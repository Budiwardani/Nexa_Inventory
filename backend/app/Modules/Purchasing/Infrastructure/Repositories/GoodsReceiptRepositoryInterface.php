<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\GoodsReceipt;
use Illuminate\Database\Eloquent\Collection;

interface GoodsReceiptRepositoryInterface
{
    public function all(): Collection;
    public function find(int $id): ?GoodsReceipt;
    public function create(array $data): GoodsReceipt;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
