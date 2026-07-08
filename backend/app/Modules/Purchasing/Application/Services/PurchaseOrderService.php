<?php
namespace App\Modules\Purchasing\Application\Services;

use App\Modules\Purchasing\Infrastructure\Repositories\PurchaseOrderRepositoryInterface;
use App\Modules\Purchasing\Domain\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use App\Modules\Core\Domain\Models\AuditLog;

class PurchaseOrderService
{
    public function __construct(
        private readonly PurchaseOrderRepositoryInterface $repository
    ) {}

    public function getAllOrders(): Collection
    {
        return $this->repository->all();
    }

    public function getOrderById(int $id): ?PurchaseOrder
    {
        return $this->repository->find($id);
    }

    public function createOrder(array $data, array $items, int $userId): PurchaseOrder
    {
        return DB::transaction(function () use ($data, $items, $userId) {
            $po = $this->repository->create($data);
            
            $subtotal = 0;
            foreach ($items as $item) {
                $totalPrice = $item['qty'] * $item['unit_price'];
                $subtotal += $totalPrice;
                
                $po->items()->create([
                    'item_code' => $item['item_code'],
                    'item_name' => $item['item_name'],
                    'qty' => $item['qty'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $totalPrice,
                    'uom' => $item['uom'] ?? 'PCS',
                ]);
            }
            
            $po->subtotal = $subtotal;
            $po->total_amount = $subtotal + $po->tax_amount;
            $po->save();
            
            AuditLog::create([
                'user_id' => $userId,
                'event' => 'created',
                'auditable_type' => 'PurchaseOrder',
                'auditable_id' => $po->id,
                'new_values' => json_encode(['po_no' => $po->po_no, 'total_amount' => $po->total_amount]),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $po;
        });
    }

    public function updateOrderStatus(int $id, string $status, int $userId): bool
    {
        $po = $this->repository->find($id);
        if (!$po) return false;
        
        $oldStatus = $po->status;
        
        return DB::transaction(function () use ($po, $status, $oldStatus, $userId) {
            $po->status = $status;
            $po->save();
            
            AuditLog::create([
                'user_id' => $userId,
                'event' => 'status_updated',
                'auditable_type' => 'PurchaseOrder',
                'auditable_id' => $po->id,
                'old_values' => json_encode(['status' => $oldStatus]),
                'new_values' => json_encode(['status' => $status]),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
            
            return true;
        });
    }
}
