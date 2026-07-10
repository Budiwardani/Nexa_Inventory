<?php

namespace App\Modules\Inventory\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Domain\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index()
    {
        return response()->json(Warehouse::with(['zones.racks.bins'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'    => 'required|string|unique:warehouses,code',
            'name'    => 'required|string',
            'type'    => 'nullable|string|in:raw_material,finished_goods,wip,general',
            'address' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()?->id;

        $warehouse = Warehouse::create($validated);
        return response()->json($warehouse->load('zones'), 201);
    }

    public function show($id)
    {
        return response()->json(Warehouse::with(['zones.racks.bins'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $warehouse = Warehouse::findOrFail($id);

        $validated = $request->validate([
            'code'    => 'sometimes|string|unique:warehouses,code,' . $id,
            'name'    => 'sometimes|string',
            'type'    => 'nullable|string|in:raw_material,finished_goods,wip,general',
            'address' => 'nullable|string',
        ]);

        $warehouse->update($validated);
        return response()->json($warehouse);
    }

    public function destroy($id)
    {
        $warehouse = Warehouse::findOrFail($id);
        $warehouse->delete();
        return response()->json(['message' => 'Warehouse deleted.']);
    }
}
