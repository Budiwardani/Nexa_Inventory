<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;

class SupplierRepository implements SupplierRepositoryInterface
{
    public function all(): Collection
    {
        return Supplier::all();
    }

    public function find(int $id): ?Supplier
    {
        return Supplier::find($id);
    }

    public function create(array $data): Supplier
    {
        return Supplier::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $supplier = $this->find($id);
        if ($supplier) {
            return $supplier->update($data);
        }
        return false;
    }

    public function delete(int $id): bool
    {
        $supplier = $this->find($id);
        if ($supplier) {
            return $supplier->delete();
        }
        return false;
    }
}
