<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\AuditLog;
use App\Modules\Core\Services\WorkOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    public function __construct(
        protected WorkOrderService $service
    ) {}

    private function log(Request $request, string $event, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id,
            'event'          => $event,
            'auditable_type' => 'WorkOrder',
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
        $workOrders = $this->service->getPaginatedWorkOrders((int) $request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $workOrders->items(),
            'meta' => [
                'current_page' => $workOrders->currentPage(),
                'last_page' => $workOrders->lastPage(),
                'total' => $workOrders->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product' => ['required', 'string', 'max:255'],
            'variant' => ['nullable', 'string'],
            'target_qty' => ['required', 'numeric', 'min:0.01'],
            'uom' => ['nullable', 'string'],
            'work_center' => ['nullable', 'string'],
            'machine' => ['nullable', 'string'],
            'scheduled_start' => ['nullable', 'date'],
            'scheduled_end' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'operations' => ['nullable', 'array'],
            'operations.*.operation_seq' => ['required', 'integer'],
            'operations.*.operation_name' => ['required', 'string'],
            'operations.*.work_center' => ['nullable', 'string'],
            'operations.*.machine' => ['nullable', 'string'],
            'operations.*.setup_time' => ['nullable', 'numeric'],
            'operations.*.run_time' => ['nullable', 'numeric'],
        ]);

        try {
            $workOrder = $this->service->createWorkOrder($validated);

            $this->log($request, 'created', $workOrder->id, [], [
                'status' => $workOrder->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Work Order created',
                'data' => $workOrder,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $workOrder = $this->service->findById($id);
        if (!$workOrder) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $workOrder]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $workOrder = $this->service->findById($id);
            if (!$workOrder) return response()->json(['success' => false, 'message' => 'Not found'], 404);

            $old = $workOrder->only(['status', 'notes', 'scheduled_start', 'scheduled_end']);
            $updated = $this->service->updateWorkOrder($id, $request->only(['status', 'notes', 'scheduled_start', 'scheduled_end']));

            $this->log($request, 'updated', $workOrder->id, $old, $updated->only(['status', 'notes', 'scheduled_start', 'scheduled_end']));

            return response()->json(['success' => true, 'message' => 'Updated', 'data' => $updated]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        try {
            $workOrder = $this->service->deleteWorkOrder($id);
            $this->log($request, 'deleted', $id, ['status' => $workOrder->status], []);
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
    }
}
