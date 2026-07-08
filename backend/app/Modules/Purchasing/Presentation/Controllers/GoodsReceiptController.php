<?php
namespace App\Modules\Purchasing\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Purchasing\Application\Services\GoodsReceiptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoodsReceiptController extends Controller
{
    public function __construct(
        private readonly GoodsReceiptService $service
    ) {}

    public function index(): JsonResponse
    {
        $receipts = $this->service->getAllReceipts();
        return response()->json(['success' => true, 'data' => $receipts]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'purchase_order_id' => ['nullable', 'integer', 'exists:purchase_orders,id'],
            'supplier_id'       => ['required', 'integer', 'exists:suppliers,id'],
            'date'              => ['required', 'date'],
            'delivery_note'     => ['nullable', 'string'],
            'notes'             => ['nullable', 'string'],
            'items'             => ['required', 'array', 'min:1'],
            'items.*.purchase_order_item_id' => ['nullable', 'integer'],
            'items.*.item_code'  => ['required', 'string'],
            'items.*.item_name'  => ['required', 'string'],
            'items.*.qty_received' => ['required', 'numeric', 'min:0.01'],
            'items.*.qty_accepted' => ['nullable', 'numeric', 'min:0'],
            'items.*.qty_rejected' => ['nullable', 'numeric', 'min:0'],
            'items.*.uom'        => ['nullable', 'string'],
        ]);

        $grData = [
            'gr_no'             => 'GR-' . strtoupper(Str::random(8)),
            'purchase_order_id' => $validated['purchase_order_id'] ?? null,
            'supplier_id'       => $validated['supplier_id'],
            'date'              => $validated['date'],
            'delivery_note'     => $validated['delivery_note'] ?? null,
            'notes'             => $validated['notes'] ?? null,
            'status'            => 'Draft',
            'created_by'        => $request->user()?->id,
        ];

        try {
            $gr = $this->service->createReceipt($grData, $validated['items'], $request->user()?->id ?? 0);
            return response()->json(['success' => true, 'message' => 'Goods Receipt created', 'data' => $gr->load(['supplier', 'items'])], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed: ' . $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $gr = $this->service->getReceiptById($id);
        if (!$gr) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $gr]);
    }

    public function receive(int $id, Request $request): JsonResponse
    {
        $gr = $this->service->getReceiptById($id);
        if (!$gr) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if ($gr->status !== 'Draft') {
            return response()->json(['success' => false, 'message' => 'Only Draft receipts can be confirmed'], 400);
        }

        $this->service->updateReceiptStatus($id, 'Received', $request->user()?->id ?? 0);
        return response()->json(['success' => true, 'message' => 'Goods Receipt confirmed. Inventory updated.']);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $gr = $this->service->getReceiptById($id);
        if (!$gr) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if (!in_array($gr->status, ['Draft'])) {
            return response()->json(['success' => false, 'message' => 'Only Draft receipts can be deleted'], 400);
        }

        $gr->delete();
        return response()->json(['success' => true, 'message' => 'Goods Receipt deleted']);
    }
}
