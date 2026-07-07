<?php

namespace App\Modules\Core\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductionOrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'production_order_no' => $this->production_order_no,
            'production_date' => $this->production_date?->toDateString(),
            'company' => $this->company?->name,
            'branch' => $this->branch?->name,
            'plant' => $this->plant,
            'warehouse' => $this->warehouse,
            'production_plan' => $this->production_plan,
            'bom' => $this->bom,
            'bom_version' => $this->bom_version,
            'routing' => $this->routing,
            'production_type' => $this->production_type,
            'priority' => $this->priority,
            'status' => $this->status,
            'approval_stage' => $this->approval_stage,
            'due_date' => $this->due_date?->toDateString(),
            'description' => $this->description,
            'remarks' => $this->remarks,
            'items' => $this->items,
            'material_requirements' => $this->material_requirements,
            'machine_assignments' => $this->machine_assignments,
            'operator_assignments' => $this->operator_assignments,
            'approved_by' => $this->approvedBy?->name,
            'approved_at' => $this->approved_at?->toDateTimeString(),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
