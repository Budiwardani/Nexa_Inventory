<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\Inventory;
use App\Modules\Core\Domain\Models\ProductionOrder;
use App\Modules\Core\DTO\ProductionOrderDTO;
use App\Modules\Core\Repositories\Contracts\ProductionOrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductionOrderService
{
    public function __construct(
        private ProductionOrderRepositoryInterface $productionOrderRepository
    ) {}

    public function getPaginatedProductionOrders(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->productionOrderRepository->paginate($perPage, $filters);
    }

    public function getProductionOrderById(int $id): ?ProductionOrder
    {
        return $this->productionOrderRepository->findById($id);
    }

    public function createProductionOrder(ProductionOrderDTO $dto): ProductionOrder
    {
        return DB::transaction(function () use ($dto) {
            return $this->productionOrderRepository->create($dto);
        });
    }

    // ─── APPROVAL WORKFLOW ──────────────────────────────────────────────────

    public function approve(int $id, int $userId): ProductionOrder
    {
        $order = $this->getProductionOrderById($id);
        if (!$order) throw new \Exception('Production order not found.');

        $allowedStatuses = ['Draft', 'Submitted'];
        if (!in_array($order->status, $allowedStatuses)) {
            throw new \Exception("Cannot approve an order with status: {$order->status}.");
        }

        $order->status         = 'Approved';
        $order->approval_stage = 'Approved';
        $order->approved_by    = $userId;
        $order->approved_at    = now();
        $order->save();

        return $order;
    }

    public function reject(int $id, int $userId, string $reason = ''): ProductionOrder
    {
        $order = $this->getProductionOrderById($id);
        if (!$order) throw new \Exception('Production order not found.');

        $allowedStatuses = ['Draft', 'Submitted', 'Approved'];
        if (!in_array($order->status, $allowedStatuses)) {
            throw new \Exception("Cannot reject an order with status: {$order->status}.");
        }

        $order->status         = 'Rejected';
        $order->approval_stage = 'Rejected';
        $order->remarks        = $reason ?: $order->remarks;
        $order->save();

        return $order;
    }

    public function cancel(int $id, int $userId, string $reason = ''): ProductionOrder
    {
        $order = $this->getProductionOrderById($id);
        if (!$order) throw new \Exception('Production order not found.');

        if (in_array($order->status, ['Completed', 'Closed'])) {
            throw new \Exception("Cannot cancel an order that is already {$order->status}.");
        }

        $order->status         = 'Cancelled';
        $order->approval_stage = 'Cancelled';
        $order->remarks        = $reason ?: $order->remarks;
        $order->save();

        return $order;
    }

    public function release(int $id): ProductionOrder
    {
        $order = $this->getProductionOrderById($id);
        if (!$order) throw new \Exception('Production order not found.');
        if ($order->status !== 'Approved') throw new \Exception('Order must be approved before release.');

        // Validate Material Availability
        $requirements = $order->material_requirements ?? [];
        foreach ($requirements as $req) {
            $product     = $req['product'] ?? null;
            $requiredQty = $req['qty'] ?? 0;
            if (!$product || $requiredQty <= 0) continue;

            $availableQty = Inventory::where('product', $product)->sum('qty');
            if ($availableQty < $requiredQty) {
                throw new \Exception(
                    "Insufficient inventory for product: {$product}. Required: {$requiredQty}, Available: {$availableQty}"
                );
            }
        }

        $order->status = 'Released';
        $order->save();

        return $order;
    }

    public function complete(int $id): ProductionOrder
    {
        $order = $this->getProductionOrderById($id);
        if (!$order) throw new \Exception('Production order not found.');

        // QC check
        $hasQc = DB::table('qc_inspections')
            ->where('production_order_id', $id)
            ->where(function ($q) {
                $q->where('result', 'Pass')
                  ->orWhere('result', 'Passed')
                  ->orWhere('status', 'Passed')
                  ->orWhere('status', 'Approved')
                  ->orWhere('status', 'Completed');
            })
            ->exists();

        if (!$hasQc) {
            throw new \Exception('Production cannot complete without a passed QC inspection.');
        }

        // Finished goods receipt check
        $hasReceipt = true;
        if (Schema::hasTable('finished_goods_receipts')) {
            $hasReceipt = DB::table('finished_goods_receipts')
                ->where('production_order_id', $id)
                ->exists();
        }

        if (!$hasReceipt) {
            throw new \Exception('Production cannot complete without a finished goods receipt updating inventory.');
        }

        $order->status = 'Completed';
        $order->save();

        return $order;
    }
}
