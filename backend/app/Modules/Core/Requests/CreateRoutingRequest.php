<?php

namespace App\Modules\Core\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateRoutingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'operations' => ['required', 'array', 'min:1'],
            'operations.*.operation_seq' => ['required', 'integer', 'min:1'],
            'operations.*.operation_name' => ['required', 'string', 'max:255'],
            'operations.*.work_center' => ['nullable', 'string', 'max:255'],
            'operations.*.machine_group' => ['nullable', 'string', 'max:255'],
            'operations.*.setup_time' => ['nullable', 'numeric', 'min:0'],
            'operations.*.run_time' => ['nullable', 'numeric', 'min:0'],
            'operations.*.move_time' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
