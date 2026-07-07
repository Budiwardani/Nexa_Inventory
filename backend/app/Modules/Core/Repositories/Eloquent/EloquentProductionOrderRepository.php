<?php

namespace App\Modules\Core\Repositories\Eloquent;

use App\Modules\Core\Domain\Models\ProductionOrder;
use App\Modules\Core\DTO\ProductionOrderDTO;
use App\Modules\Core\Repositories\Contracts\ProductionOrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProductionOrderRepository implements ProductionOrderRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = ProductionOrder::with(['company', 'branch', 'approvedBy']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('production_order_no', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        if (!empty($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?ProductionOrder
    {
        return ProductionOrder::with(['company', 'branch', 'approvedBy'])->find($id);
    }

    public function create(ProductionOrderDTO $dto): ProductionOrder
    {
        return ProductionOrder::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'production_order_no' => $dto->productionOrderNo,
            'production_date' => $dto->productionDate,
            'company_id' => $dto->companyId,
            'branch_id' => $dto->branchId,
            'plant' => $dto->plant,
            'warehouse' => $dto->warehouse,
            'production_plan' => $dto->productionPlan,
            'bom' => $dto->bom,
            'bom_version' => $dto->bomVersion,
            'routing' => $dto->routing,
            'production_type' => $dto->productionType,
            'priority' => $dto->priority,
            'status' => $dto->status,
            'approval_stage' => $dto->approvalStage,
            'due_date' => $dto->dueDate,
            'description' => $dto->description,
            'remarks' => $dto->remarks,
            'items' => $dto->items,
            'material_requirements' => $dto->materialRequirements,
            'machine_assignments' => $dto->machineAssignments,
            'operator_assignments' => $dto->operatorAssignments,
            'approved_by' => $dto->approvedBy,
            'approved_at' => $dto->approvedAt,
        ]);
    }
}
