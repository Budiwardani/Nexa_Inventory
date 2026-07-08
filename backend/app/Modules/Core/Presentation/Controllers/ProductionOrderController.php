<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\AuditLog;
use App\Modules\Core\DTO\ProductionOrderDTO;
use App\Modules\Core\Requests\CreateProductionOrderRequest;
use App\Modules\Core\Resources\ProductionOrderResource;
use App\Modules\Core\Services\ProductionOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionOrderController extends Controller
{
    // Roles allowed to approve / reject / cancel / release
    private const APPROVAL_ROLES = ['Super Admin', 'Manager', 'Supervisor'];

    public function __construct(
        private ProductionOrderService $productionOrderService
    ) {}

    /** Helper: write an audit log entry */
    private function log(Request $request, string $event, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id,
            'event'          => $event,
            'auditable_type' => 'ProductionOrder',
            'auditable_id'   => $modelId,
            'old_values'     => json_encode($old),
            'new_values'     => json_encode($new),
            'url'            => $request->fullUrl(),
            'ip_address'     => $request->ip(),
            'user_agent'     => $request->userAgent(),
        ]);
    }

    /** Helper: check caller has an approval-level role */
    private function canApprove(Request $request): bool
    {
        $user = $request->user();
        if (!$user) return false;
        foreach (self::APPROVAL_ROLES as $role) {
            if ($user->hasRole($role)) return true;
        }
        return false;
    }

    // ─── CRUD ───────────────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $orders = $this->productionOrderService->getPaginatedProductionOrders(
            (int) $request->get('per_page', 15),
            $request->only(['search', 'status', 'company_id', 'branch_id'])
        );

        return response()->json([
            'success' => true,
            'data'    => ProductionOrderResource::collection($orders),
            'meta'    => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    public function store(CreateProductionOrderRequest $request): JsonResponse
    {
        $order = $this->productionOrderService->createProductionOrder(
            ProductionOrderDTO::fromArray(array_merge(
                $request->validated(),
                ['created_by' => $request->user()?->id]
            ))
        );

        $this->log($request, 'created', $order->id, [], [
            'production_order_no' => $order->production_order_no,
            'status'              => $order->status,
            'created_by'          => $request->user()?->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Production order created successfully',
            'data'    => new ProductionOrderResource($order),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->productionOrderService->getProductionOrderById($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Production order not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new ProductionOrderResource($order),
        ]);
    }

    // ─── APPROVAL WORKFLOW ──────────────────────────────────────────────────

    public function approve(int $id, Request $request): JsonResponse
    {
        if (!$this->canApprove($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Only Supervisor or Manager can approve a production order.',
            ], 403);
        }

        try {
            $order    = $this->productionOrderService->getProductionOrderById($id);
            $oldStatus = $order?->status;

            $order = $this->productionOrderService->approve($id, $request->user()->id);

            $this->log($request, 'approved', $id,
                ['status' => $oldStatus],
                ['status' => $order->status, 'approved_by' => $request->user()->name]
            );

            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function reject(int $id, Request $request): JsonResponse
    {
        if (!$this->canApprove($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Only Supervisor or Manager can reject a production order.',
            ], 403);
        }

        try {
            $order     = $this->productionOrderService->getProductionOrderById($id);
            $oldStatus = $order?->status;
            $reason    = $request->input('reason', '');

            $order = $this->productionOrderService->reject($id, $request->user()->id, $reason);

            $this->log($request, 'rejected', $id,
                ['status' => $oldStatus],
                ['status' => $order->status, 'rejected_by' => $request->user()->name, 'reason' => $reason]
            );

            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function cancel(int $id, Request $request): JsonResponse
    {
        if (!$this->canApprove($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Only Supervisor or Manager can cancel a production order.',
            ], 403);
        }

        try {
            $order     = $this->productionOrderService->getProductionOrderById($id);
            $oldStatus = $order?->status;
            $reason    = $request->input('reason', '');

            $order = $this->productionOrderService->cancel($id, $request->user()->id, $reason);

            $this->log($request, 'cancelled', $id,
                ['status' => $oldStatus],
                ['status' => $order->status, 'cancelled_by' => $request->user()->name, 'reason' => $reason]
            );

            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function release(int $id, Request $request): JsonResponse
    {
        if (!$this->canApprove($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Only Supervisor or Manager can release a production order.',
            ], 403);
        }

        try {
            $order     = $this->productionOrderService->getProductionOrderById($id);
            $oldStatus = $order?->status;

            $order = $this->productionOrderService->release($id);

            $this->log($request, 'released', $id,
                ['status' => $oldStatus],
                ['status' => $order->status, 'released_by' => $request->user()?->name]
            );

            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function complete(int $id, Request $request): JsonResponse
    {
        try {
            $order     = $this->productionOrderService->getProductionOrderById($id);
            $oldStatus = $order?->status;

            $order = $this->productionOrderService->complete($id);

            $this->log($request, 'completed', $id,
                ['status' => $oldStatus],
                ['status' => $order->status, 'completed_by' => $request->user()?->name]
            );

            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    /** GET /production-orders/{id}/logs — Audit trail for one PO */
    public function logs(int $id): JsonResponse
    {
        $logs = AuditLog::where('auditable_type', 'ProductionOrder')
            ->where('auditable_id', $id)
            ->with('user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($l) => [
                'id'         => $l->id,
                'event'      => $l->event,
                'user'       => $l->user?->name ?? 'System',
                'old_values' => is_string($l->old_values) ? json_decode($l->old_values, true) : $l->old_values,
                'new_values' => is_string($l->new_values) ? json_decode($l->new_values, true) : $l->new_values,
                'ip_address' => $l->ip_address,
                'created_at' => $l->created_at?->toDateTimeString(),
            ]);

        return response()->json(['success' => true, 'data' => $logs]);
    }
}
