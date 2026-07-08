<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\FinishedGoodsReceipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Modules\Core\Domain\Models\AuditLog;

class FinishedGoodsController extends Controller
{
    private function log(Request $request, string $event, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id,
            'event'          => $event,
            'auditable_type' => 'FinishedGoodsReceipt',
            'auditable_id'   => $modelId,
            'old_values'     => json_encode($old),
            'new_values'     => json_encode($new),
            'url'            => $request->fullUrl(),
            'ip_address'     => $request->ip(),
            'user_agent'     => $request->userAgent(),
        ]);
    }

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

        if ($totalCost > 0) {
            $accounting = app(\App\Modules\Core\Services\AccountingService::class);
            $accounting->postJournalEntry([
                'journal_date' => $receipt->receipt_date,
                'reference_type' => 'FinishedGoodsReceipt',
                'reference_id' => $receipt->id,
                'description' => 'Finished Goods Receipt from Production',
                'entries' => [
                    ['account_code' => '11400', 'debit' => $totalCost, 'credit' => 0, 'department' => 'Warehouse'], // Debit Inventory
                    ['account_code' => '11500', 'debit' => 0, 'credit' => $totalCost, 'department' => 'Production'], // Credit WIP
                ]
            ]);
        }

        $this->log($request, 'created', $receipt->id, [], [
            'status' => $receipt->status,
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
        
        $old = $receipt->only(['status', 'notes']);
        $receipt->update($request->only(['status', 'notes']));
        
        $this->log($request, 'updated', $receipt->id, $old, $receipt->only(['status', 'notes']));

        return response()->json(['success' => true, 'message' => 'Updated', 'data' => $receipt]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $receipt = FinishedGoodsReceipt::find($id);
        if (!$receipt) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if ($receipt->status !== 'Draft') {
            return response()->json(['success' => false, 'message' => 'Only draft receipts can be deleted'], 400);
        }

        $oldStatus = $receipt->status;
        $receipt->delete();

        $this->log($request, 'deleted', $id, ['status' => $oldStatus], []);

        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}
