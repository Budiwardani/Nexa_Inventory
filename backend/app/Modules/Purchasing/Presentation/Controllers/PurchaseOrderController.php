<?php
namespace App\Modules\Purchasing\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Purchasing\Application\Services\PurchaseOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PurchaseOrderController extends Controller
{
    public function __construct(
        private readonly PurchaseOrderService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->service->getAllOrders();
        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id'       => ['required', 'integer', 'exists:suppliers,id'],
            'purchase_request_id' => ['nullable', 'integer', 'exists:purchase_requests,id'],
            'date'              => ['required', 'date'],
            'expected_delivery' => ['nullable', 'date'],
            'tax_amount'        => ['nullable', 'numeric', 'min:0'],
            'notes'             => ['nullable', 'string'],
            'items'             => ['required', 'array', 'min:1'],
            'items.*.item_code'  => ['required', 'string'],
            'items.*.item_name'  => ['required', 'string'],
            'items.*.qty'        => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.uom'        => ['nullable', 'string'],
        ]);

        $poData = [
            'po_no'              => 'PO-' . strtoupper(Str::random(8)),
            'supplier_id'        => $validated['supplier_id'],
            'purchase_request_id' => $validated['purchase_request_id'] ?? null,
            'date'               => $validated['date'],
            'expected_delivery'  => $validated['expected_delivery'] ?? null,
            'tax_amount'         => $validated['tax_amount'] ?? 0,
            'notes'              => $validated['notes'] ?? null,
            'status'             => 'Draft',
            'created_by'         => $request->user()?->id,
        ];

        try {
            $po = $this->service->createOrder($poData, $validated['items'], $request->user()?->id ?? 0);
            return response()->json(['success' => true, 'message' => 'Purchase Order created', 'data' => $po->load(['supplier', 'items'])], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed: ' . $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $po = $this->service->getOrderById($id);
        if (!$po) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $po]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $po = $this->service->getOrderById($id);
        if (!$po) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if (!in_array($po->status, ['Draft'])) {
            return response()->json(['success' => false, 'message' => 'Only Draft orders can be edited'], 400);
        }

        $validated = $request->validate([
            'expected_delivery' => ['nullable', 'date'],
            'notes'             => ['nullable', 'string'],
        ]);

        $po->update($validated);
        return response()->json(['success' => true, 'message' => 'Purchase Order updated', 'data' => $po]);
    }

    public function approve(int $id, Request $request): JsonResponse
    {
        $po = $this->service->getOrderById($id);
        if (!$po) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if ($po->status !== 'Draft') {
            return response()->json(['success' => false, 'message' => 'Only Draft orders can be approved'], 400);
        }

        $this->service->updateOrderStatus($id, 'Approved', $request->user()?->id ?? 0);
        return response()->json(['success' => true, 'message' => 'Purchase Order approved']);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $po = $this->service->getOrderById($id);
        if (!$po) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if (!in_array($po->status, ['Draft'])) {
            return response()->json(['success' => false, 'message' => 'Only Draft orders can be deleted'], 400);
        }

        $po->delete();
        return response()->json(['success' => true, 'message' => 'Purchase Order deleted']);
    }
}
