<?php

namespace App\Modules\Core\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductionOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('production_orders.create');
    }

    public function rules(): array
    {
        return [
            'production_order_no' => ['required', 'string', 'max:255', 'unique:production_orders'],
            'production_date' => ['required', 'date'],
            'company_id' => ['required', 'exists:companies,id'],
            'branch_id' => ['required', 'exists:branches,id'],
            'plant' => ['nullable', 'string', 'max:255'],
            'warehouse' => ['nullable', 'string', 'max:255'],
            'production_plan' => ['nullable', 'string', 'max:255'],
            'bom' => ['nullable', 'string', 'max:255'],
            'bom_version' => ['nullable', 'string', 'max:255'],
            'routing' => ['nullable', 'string', 'max:255'],
            'production_type' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:255'],
            'approval_stage' => ['nullable', 'string', 'max:255'],
            'due_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'remarks' => ['nullable', 'string'],
            'items' => ['nullable', 'array'],
            'material_requirements' => ['nullable', 'array'],
            'machine_assignments' => ['nullable', 'array'],
            'operator_assignments' => ['nullable', 'array'],
            'approved_by' => ['nullable', 'exists:users,id'],
            'approved_at' => ['nullable', 'date'],

            'items.*.product' => ['required_with:items', 'string', 'max:255'],
            'items.*.variant' => ['nullable', 'string', 'max:255'],
            'items.*.batch' => ['nullable', 'string', 'max:255'],
            'items.*.serial' => ['nullable', 'string', 'max:255'],
            'items.*.target_qty' => ['required_with:items', 'numeric', 'min:0'],
            'items.*.uom' => ['nullable', 'string', 'max:50'],
            'items.*.completed_qty' => ['nullable', 'numeric', 'min:0'],
            'items.*.reject_qty' => ['nullable', 'numeric', 'min:0'],
            'items.*.scrap_qty' => ['nullable', 'numeric', 'min:0'],
            'items.*.remaining_qty' => ['nullable', 'numeric', 'min:0'],

            'material_requirements.*.material_code' => ['required_with:material_requirements', 'string', 'max:255'],
            'material_requirements.*.material_name' => ['nullable', 'string', 'max:255'],
            'material_requirements.*.warehouse' => ['nullable', 'string', 'max:255'],
            'material_requirements.*.required_qty' => ['required_with:material_requirements', 'numeric', 'min:0'],
            'material_requirements.*.reserved_qty' => ['nullable', 'numeric', 'min:0'],
            'material_requirements.*.issued_qty' => ['nullable', 'numeric', 'min:0'],
            'material_requirements.*.returned_qty' => ['nullable', 'numeric', 'min:0'],
            'material_requirements.*.consumed_qty' => ['nullable', 'numeric', 'min:0'],
            'material_requirements.*.remaining_qty' => ['nullable', 'numeric', 'min:0'],

            'machine_assignments.*.machine' => ['required_with:machine_assignments', 'string', 'max:255'],
            'machine_assignments.*.machine_group' => ['nullable', 'string', 'max:255'],
            'machine_assignments.*.work_center' => ['nullable', 'string', 'max:255'],
            'machine_assignments.*.production_line' => ['nullable', 'string', 'max:255'],
            'machine_assignments.*.start_time' => ['nullable', 'date_format:Y-m-d\TH:i:sP'],
            'machine_assignments.*.end_time' => ['nullable', 'date_format:Y-m-d\TH:i:sP'],
            'machine_assignments.*.estimated_hours' => ['nullable', 'numeric', 'min:0'],
            'machine_assignments.*.actual_hours' => ['nullable', 'numeric', 'min:0'],

            'operator_assignments.*.employee' => ['required_with:operator_assignments', 'string', 'max:255'],
            'operator_assignments.*.role' => ['nullable', 'string', 'max:255'],
            'operator_assignments.*.shift' => ['nullable', 'string', 'max:255'],
            'operator_assignments.*.start_time' => ['nullable', 'date_format:Y-m-d\TH:i:sP'],
            'operator_assignments.*.end_time' => ['nullable', 'date_format:Y-m-d\TH:i:sP'],
            'operator_assignments.*.performance' => ['nullable', 'numeric', 'between:0,100'],
        ];
    }
}
