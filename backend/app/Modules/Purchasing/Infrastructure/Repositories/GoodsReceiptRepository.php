<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\GoodsReceipt;
use Illuminate\Database\Eloquent\Collection;

class GoodsReceiptRepository implements GoodsReceiptRepositoryInterface
{
    public function all(): Collection
    {
        return GoodsReceipt::with(['purchaseOrder', 'supplier', 'items'])->get();
    }

    public function find(int $id): ?GoodsReceipt
    {
        return GoodsReceipt::with(['purchaseOrder', 'supplier', 'items'])->find($id);
    }

    public function create(array $data): GoodsReceipt
    {
        return GoodsReceipt::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $gr = $this->find($id);
        if ($gr) {
            return $gr->update($data);
        }
        return false;
    }

    public function delete(int $id): bool
    {
        $gr = $this->find($id);
        if ($gr) {
            return $gr->delete();
        }
        return false;
    }
}
