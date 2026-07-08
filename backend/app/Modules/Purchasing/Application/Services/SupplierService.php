<?php
namespace App\Modules\Purchasing\Application\Services;

use App\Modules\Purchasing\Infrastructure\Repositories\SupplierRepositoryInterface;
use App\Modules\Purchasing\DTO\SupplierDTO;
use App\Modules\Purchasing\Domain\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;

class SupplierService
{
    public function __construct(
        private readonly SupplierRepositoryInterface $repository
    ) {}

    public function getAllSuppliers(): Collection
    {
        return $this->repository->all();
    }

    public function getSupplierById(int $id): ?Supplier
    {
        return $this->repository->find($id);
    }

    public function createSupplier(SupplierDTO $dto): Supplier
    {
        return $this->repository->create($dto->toArray());
    }

    public function updateSupplier(int $id, SupplierDTO $dto): bool
    {
        return $this->repository->update($id, $dto->toArray());
    }

    public function deleteSupplier(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
