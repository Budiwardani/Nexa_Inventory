<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Collection;

class PurchaseOrderRepository implements PurchaseOrderRepositoryInterface
{
    public function all(): Collection
    {
        return PurchaseOrder::with(['supplier', 'items'])->get();
    }

    public function find(int $id): ?PurchaseOrder
    {
        return PurchaseOrder::with(['supplier', 'items'])->find($id);
    }

    public function create(array $data): PurchaseOrder
    {
        return PurchaseOrder::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $po = $this->find($id);
        if ($po) {
            return $po->update($data);
        }
        return false;
    }

    public function delete(int $id): bool
    {
        $po = $this->find($id);
        if ($po) {
            return $po->delete();
        }
        return false;
    }
}
