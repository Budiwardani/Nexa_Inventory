<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Modules\Core\Domain\Models\Inventory;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Inventory::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('product', 'ilike', "%{$search}%")
                  ->orWhere('warehouse', 'ilike', "%{$search}%");
        }

        $rows = $query->orderByDesc('id')->paginate($request->get('per_page', 15));
        
        return response()->json([
            'success' => true, 
            'data' => $rows->items(), 
            'meta' => [
                'total' => $rows->total(), 
                'last_page' => $rows->lastPage(), 
                'current_page' => $rows->currentPage()
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $v = $request->validate([
            'product' => 'required|string',
            'warehouse' => 'required|string',
            'qty' => 'required|numeric',
            'uom' => 'nullable|string',
            'unit_cost' => 'nullable|numeric',
            'last_counted_at' => 'nullable|date'
        ]);

        $inventory = Inventory::create($v);

        return response()->json([
            'success' => true, 
            'message' => 'Inventory created', 
            'data' => $inventory
        ], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $v = $request->validate([
            'product' => 'required|string',
            'warehouse' => 'required|string',
            'qty' => 'required|numeric',
            'uom' => 'nullable|string',
            'unit_cost' => 'nullable|numeric',
            'last_counted_at' => 'nullable|date'
        ]);

        $inventory = Inventory::findOrFail($id);
        $inventory->update($v);

        return response()->json([
            'success' => true, 
            'message' => 'Inventory updated', 
            'data' => $inventory
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Inventory::destroy($id);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}
