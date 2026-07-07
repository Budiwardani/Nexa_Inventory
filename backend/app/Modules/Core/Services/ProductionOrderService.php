<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\ProductionOrder;
use App\Modules\Core\DTO\ProductionOrderDTO;
use App\Modules\Core\Repositories\Contracts\ProductionOrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

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
}
