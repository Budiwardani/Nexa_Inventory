<?php

namespace App\Modules\Core\Repositories\Contracts;

use App\Modules\Core\Domain\Models\ProductionOrder;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Modules\Core\DTO\ProductionOrderDTO;

interface ProductionOrderRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;
    public function findById(int $id): ?ProductionOrder;
    public function create(ProductionOrderDTO $dto): ProductionOrder;
}
