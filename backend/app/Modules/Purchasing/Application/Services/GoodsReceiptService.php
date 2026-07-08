<?php
namespace App\Modules\Purchasing\Application\Services;

use App\Modules\Purchasing\Infrastructure\Repositories\GoodsReceiptRepositoryInterface;
use App\Modules\Purchasing\Domain\Models\GoodsReceipt;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use App\Modules\Core\Domain\Models\AuditLog;
use App\Modules\Core\Domain\Models\Inventory;

class GoodsReceiptService
{
    public function __construct(
        private readonly GoodsReceiptRepositoryInterface $repository
    ) {}

    public function getAllReceipts(): Collection
    {
        return $this->repository->all();
    }

    public function getReceiptById(int $id): ?GoodsReceipt
    {
        return $this->repository->find($id);
    }

    public function createReceipt(array $data, array $items, int $userId): GoodsReceipt
    {
        return DB::transaction(function () use ($data, $items, $userId) {
            $gr = $this->repository->create($data);
            
            foreach ($items as $item) {
                $grItem = $gr->items()->create([
                    'purchase_order_item_id' => $item['purchase_order_item_id'] ?? null,
                    'item_code' => $item['item_code'],
                    'item_name' => $item['item_name'],
                    'qty_received' => $item['qty_received'],
                    'qty_accepted' => $item['qty_accepted'] ?? $item['qty_received'],
                    'qty_rejected' => $item['qty_rejected'] ?? 0,
                    'uom' => $item['uom'] ?? 'PCS',
                ]);

                // Update Inventory
                $inventory = Inventory::firstOrCreate(
                    ['product' => $item['item_code'], 'warehouse' => 'Main Warehouse'], // Default warehouse
                    ['qty' => 0, 'uom' => $item['uom'] ?? 'PCS']
                );
                
                $inventory->qty += $grItem->qty_accepted;
                $inventory->save();
            }
            
            AuditLog::create([
                'user_id' => $userId,
                'event' => 'created',
                'auditable_type' => 'GoodsReceipt',
                'auditable_id' => $gr->id,
                'new_values' => json_encode(['gr_no' => $gr->gr_no]),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $gr;
        });
    }

    public function updateReceiptStatus(int $id, string $status, int $userId): bool
    {
        $gr = $this->repository->find($id);
        if (!$gr) return false;
        
        $oldStatus = $gr->status;
        
        return DB::transaction(function () use ($gr, $status, $oldStatus, $userId) {
            $gr->status = $status;
            $gr->save();
            
            AuditLog::create([
                'user_id' => $userId,
                'event' => 'status_updated',
                'auditable_type' => 'GoodsReceipt',
                'auditable_id' => $gr->id,
                'old_values' => json_encode(['status' => $oldStatus]),
                'new_values' => json_encode(['status' => $status]),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
            
            return true;
        });
    }
}
