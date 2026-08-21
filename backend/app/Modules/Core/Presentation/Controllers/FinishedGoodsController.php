<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\AuditLog;
use App\Modules\Core\Services\FinishedGoodsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinishedGoodsController extends Controller
{
    public function __construct(
        protected FinishedGoodsService $service
    ) {}

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
        $receipts = $this->service->getPaginatedReceipts((int) $request->get('per_page', 15));

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

        try {
            $receipt = $this->service->createReceipt($validated);

            $this->log($request, 'created', $receipt->id, [], [
                'status' => $receipt->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Finished Goods Receipt created',
                'data' => $receipt,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $receipt = $this->service->findById($id);
        if (!$receipt) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $receipt]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $receipt = $this->service->findById($id);
        if (!$receipt) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $old = $receipt->only(['status', 'notes']);
        $updated = $this->service->updateReceipt($id, $request->only(['status', 'notes']));

        $this->log($request, 'updated', $id, $old, $updated->only(['status', 'notes']));

        return response()->json(['success' => true, 'message' => 'Updated', 'data' => $updated]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        try {
            $receipt = $this->service->deleteReceipt($id);
            $this->log($request, 'deleted', $id, ['status' => $receipt->status], []);
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
    }
}
