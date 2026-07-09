<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\Unit;
use App\Modules\Core\Domain\Models\UnitGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Unit::with('group')->orderBy('unit_name');
        
        if ($request->has('active_only')) {
            $query->where('is_active', true);
        }

        $units = $query->get();
        return response()->json(['success' => true, 'data' => $units]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'unit_code' => 'required|string|unique:units,unit_code',
            'unit_name' => 'required|string',
            'group_id' => 'nullable|exists:unit_groups,id',
            'is_base_unit' => 'boolean',
            'is_active' => 'boolean'
        ]);

        $unit = Unit::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Unit created successfully',
            'data' => $unit->load('group')
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $unit = Unit::findOrFail($id);

        $validated = $request->validate([
            'unit_code' => "string|unique:units,unit_code,{$id}",
            'unit_name' => 'string',
            'group_id' => 'nullable|exists:unit_groups,id',
            'is_base_unit' => 'boolean',
            'is_active' => 'boolean'
        ]);

        $unit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Unit updated successfully',
            'data' => $unit->load('group')
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $unit = Unit::findOrFail($id);
        $unit->delete();

        return response()->json(['success' => true, 'message' => 'Unit deleted successfully']);
    }

    // --- Unit Groups ---
    public function getGroups(): JsonResponse
    {
        $groups = UnitGroup::orderBy('group_name')->get();
        return response()->json(['success' => true, 'data' => $groups]);
    }
}
