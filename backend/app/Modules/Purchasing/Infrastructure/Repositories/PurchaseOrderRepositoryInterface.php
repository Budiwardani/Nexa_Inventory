<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Collection;

interface PurchaseOrderRepositoryInterface
{
    public function all(): Collection;
    public function find(int $id): ?PurchaseOrder;
    public function create(array $data): PurchaseOrder;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
