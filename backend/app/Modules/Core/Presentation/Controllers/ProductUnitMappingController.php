<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\ProductUnitMapping;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductUnitMappingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ProductUnitMapping::with(['product', 'baseUnit']);
        $mappings = $query->get();
        
        return response()->json(['success' => true, 'data' => $mappings]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id|unique:product_unit_mappings,product_id',
            'base_unit_id' => 'required|exists:units,id',
            'purchase_unit_id' => 'nullable|exists:units,id',
            'sales_unit_id' => 'nullable|exists:units,id',
            'inventory_unit_id' => 'nullable|exists:units,id',
            'production_unit_id' => 'nullable|exists:units,id',
            'weight_unit_id' => 'nullable|exists:units,id',
            'volume_unit_id' => 'nullable|exists:units,id',
        ]);

        $mapping = ProductUnitMapping::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product Unit Mapping created successfully',
            'data' => $mapping->load(['product', 'baseUnit'])
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $mapping = ProductUnitMapping::findOrFail($id);

        $validated = $request->validate([
            'base_unit_id' => 'exists:units,id',
            'purchase_unit_id' => 'nullable|exists:units,id',
            'sales_unit_id' => 'nullable|exists:units,id',
            'inventory_unit_id' => 'nullable|exists:units,id',
            'production_unit_id' => 'nullable|exists:units,id',
            'weight_unit_id' => 'nullable|exists:units,id',
            'volume_unit_id' => 'nullable|exists:units,id',
        ]);

        $mapping->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product Unit Mapping updated successfully',
            'data' => $mapping->load(['product', 'baseUnit'])
        ]);
    }
}
