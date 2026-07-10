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
            'code' => 'required|string|unique:warehouses,code',
            'name' => 'required|string',
            'type' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()?->id;

        $warehouse = Warehouse::create($validated);
        return response()->json($warehouse, 201);
    }
}
