<?php

namespace App\Modules\Core\DTO;

readonly class ProductionOrderDTO
{
    public function __construct(
        public string $productionOrderNo,
        public string $productionDate,
        public int $companyId,
        public int $branchId,
        public ?string $plant = null,
        public ?string $warehouse = null,
        public ?string $productionPlan = null,
        public ?string $bom = null,
        public ?string $bomVersion = null,
        public ?string $routing = null,
        public ?string $productionType = null,
        public ?string $priority = 'Normal',
        public ?string $status = 'Draft',
        public ?string $approvalStage = 'Draft',
        public ?string $dueDate = null,
        public ?string $description = null,
        public ?string $remarks = null,
        public ?array $items = [],
        public ?array $materialRequirements = [],
        public ?array $machineAssignments = [],
        public ?array $operatorAssignments = [],
        public ?int $approvedBy = null,
        public ?string $approvedAt = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            productionOrderNo: $data['production_order_no'],
            productionDate: $data['production_date'],
            companyId: $data['company_id'],
            branchId: $data['branch_id'],
            plant: $data['plant'] ?? null,
            warehouse: $data['warehouse'] ?? null,
            productionPlan: $data['production_plan'] ?? null,
            bom: $data['bom'] ?? null,
            bomVersion: $data['bom_version'] ?? null,
            routing: $data['routing'] ?? null,
            productionType: $data['production_type'] ?? null,
            priority: $data['priority'] ?? 'Normal',
            status: $data['status'] ?? 'Draft',
            approvalStage: $data['approval_stage'] ?? 'Draft',
            dueDate: $data['due_date'] ?? null,
            description: $data['description'] ?? null,
            remarks: $data['remarks'] ?? null,
            items: $data['items'] ?? [],
            materialRequirements: $data['material_requirements'] ?? [],
            machineAssignments: $data['machine_assignments'] ?? [],
            operatorAssignments: $data['operator_assignments'] ?? [],
            approvedBy: $data['approved_by'] ?? null,
            approvedAt: $data['approved_at'] ?? null,
        );
    }
}
