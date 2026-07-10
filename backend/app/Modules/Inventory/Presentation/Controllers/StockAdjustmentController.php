<?php

namespace App\Modules\Inventory\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Domain\Models\StockAdjustment;
use App\Modules\Inventory\Services\StockOperationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockAdjustmentController extends Controller
{
    protected \$service;

    public function __construct(StockOperationService \$service)
    {
        \$this->service = \$service;
    }

    public function index()
    {
        return response()->json(
            StockAdjustment::with(['warehouse', 'createdBy', 'items.product'])->latest()->paginate(50)
        );
    }

    public function store(Request \$request)
    {
        \$validated = \$request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'reason' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.location_id' => 'nullable|exists:warehouse_locations,id',
            'items.*.batch_number' => 'nullable|string',
            'items.*.quantity_adjusted' => 'required|numeric', // Positive or Negative
            'items.*.notes' => 'nullable|string',
        ]);

        \$adjustment = DB::transaction(function () use (\$validated, \$request) {
            \$adj = StockAdjustment::create([
                'adjustment_number' => 'ADJ-' . date('Ym') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                'warehouse_id' => \$validated['warehouse_id'],
                'reason' => \$validated['reason'] ?? null,
                'created_by' => \$request->user()?->id,
                'status' => 'draft',
            ]);

            foreach (\$validated['items'] as \$item) {
                \$adj->items()->create(\$item);
            }

            return \$adj;
        });

        return response()->json(\$adjustment->load('items'), 201);
    }

    public function show(\$id)
    {
        \$adj = StockAdjustment::with(['warehouse', 'createdBy', 'postedBy', 'items.product', 'items.location'])->findOrFail(\$id);
        return response()->json(\$adj);
    }

    public function post(\$id)
    {
        \$adjustment = StockAdjustment::with('items')->findOrFail(\$id);
        
        try {
            \$this->service->postAdjustment(\$adjustment);
            return response()->json(['message' => 'Adjustment posted successfully.']);
        } catch (\Exception \$e) {
            return response()->json(['message' => \$e->getMessage()], 400);
        }
    }

    public function destroy(\$id)
    {
        \$adjustment = StockAdjustment::findOrFail(\$id);
        if (\$adjustment->status === 'posted') {
            return response()->json(['message' => 'Cannot delete posted adjustment.'], 400);
        }
        \$adjustment->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
