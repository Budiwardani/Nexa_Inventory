<?php

namespace App\Modules\Core\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Handle permission in controller or policy
    }

    public function rules(): array
    {
        return [
            'product' => ['required', 'string', 'max:255'],
            'variant' => ['nullable', 'string', 'max:255'],
            'uom' => ['required', 'string', 'max:50'],
            'base_qty' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.component_item' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.0001'],
            'items.*.uom' => ['nullable', 'string', 'max:50'],
            'items.*.scrap_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items.*.is_critical' => ['nullable', 'boolean'],
        ];
    }
}
