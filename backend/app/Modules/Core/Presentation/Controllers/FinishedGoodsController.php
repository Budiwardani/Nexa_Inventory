<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\FinishedGoodsReceipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinishedGoodsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $receipts = FinishedGoodsReceipt::paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $receipts->items(),
            'meta' => [
                'current_page' => $receipts->currentPage(),
                'last_page' => $receipts->lastPage(),
                'total' => $receipts->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product' => ['required', 'string', 'max:255'],
            'variant' => ['nullable', 'string'],
            'warehouse' => ['required', 'string'],
            'receipt_date' => ['required', 'date'],
            'receipt_qty' => ['required', 'numeric', 'min:0.01'],
            'uom' => ['nullable', 'string'],
            'batch_no' => ['nullable', 'string'],
            'serial_no' => ['nullable', 'string'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $unitCost = $validated['unit_cost'] ?? 0;
        $totalCost = $unitCost * $validated['receipt_qty'];

        $receipt = FinishedGoodsReceipt::create([
            'product' => $validated['product'],
            'variant' => $validated['variant'] ?? null,
            'warehouse' => $validated['warehouse'],
            'receipt_date' => $validated['receipt_date'],
            'receipt_qty' => $validated['receipt_qty'],
            'uom' => $validated['uom'] ?? 'PCS',
            'batch_no' => $validated['batch_no'] ?? null,
            'serial_no' => $validated['serial_no'] ?? null,
            'unit_cost' => $unitCost,
            'total_cost' => $totalCost,
            'notes' => $validated['notes'] ?? null,
            'status' => 'Draft',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Finished Goods Receipt created',
            'data' => $receipt,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $receipt = FinishedGoodsReceipt::find($id);
        if (!$receipt) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $receipt]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $receipt = FinishedGoodsReceipt::find($id);
        if (!$receipt) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        $receipt->update($request->only(['status', 'notes']));
        return response()->json(['success' => true, 'message' => 'Updated', 'data' => $receipt]);
    }

    public function destroy(int $id): JsonResponse
    {
        $receipt = FinishedGoodsReceipt::find($id);
        if (!$receipt) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        $receipt->delete();
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}
