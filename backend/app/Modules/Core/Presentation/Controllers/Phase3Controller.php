<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\AuditLog;
use App\Modules\Core\Services\Phase3Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Phase3Controller extends Controller
{
    public function __construct(
        protected Phase3Service $service
    ) {}

    private function log(Request $request, string $event, string $type, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id ?? auth()->id(),
            'event'          => $event,
            'auditable_type' => $type,
            'auditable_id'   => $modelId,
            'old_values'     => json_encode($old),
            'new_values'     => json_encode($new),
            'url'            => $request->fullUrl(),
            'ip_address'     => $request->ip(),
            'user_agent'     => $request->userAgent(),
        ]);
    }

    // ─── QC Inspections ──────────────────────────────────────────────────────

    public function qcIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getQcInspections((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function qcStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'inspection_type' => 'required|string',
            'product' => 'required|string',
            'inspection_date' => 'required|date',
            'sample_qty' => 'required|numeric|min:1',
            'pass_qty' => 'nullable|numeric|min:0',
            'fail_qty' => 'nullable|numeric|min:0',
            'result' => 'nullable|string',
            'inspector' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $item = $this->service->createQcInspection($v, auth()->id());
        $this->log($request, 'created', 'QCInspection', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'QC Inspection created',
            'data' => $item,
        ], 201);
    }

    public function qcDestroy(int $id, Request $request): JsonResponse
    {
        try {
            $deleted = $this->service->deleteQcInspection($id);
            if (!$deleted) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }

            $this->log($request, 'deleted', 'QCInspection', $id, ['status' => $deleted->status ?? 'Unknown'], []);
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // ─── Scrap ───────────────────────────────────────────────────────────────

    public function scrapIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getScraps((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function scrapStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'product' => 'required|string',
            'scrap_date' => 'required|date',
            'scrap_qty' => 'required|numeric|min:0.01',
            'uom' => 'nullable|string',
            'scrap_reason' => 'required|string',
            'unit_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $item = $this->service->createScrap($v, auth()->id());
        $this->log($request, 'created', 'Scrap', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'Scrap recorded',
            'data' => $item,
        ], 201);
    }

    public function scrapDestroy(int $id, Request $request): JsonResponse
    {
        try {
            $deleted = $this->service->deleteScrap($id);
            if (!$deleted) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }

            $this->log($request, 'deleted', 'Scrap', $id, ['status' => $deleted->status ?? 'Unknown'], []);
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // ─── Rework ──────────────────────────────────────────────────────────────

    public function reworkIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getReworks((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function reworkStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'product' => 'required|string',
            'rework_date' => 'required|date',
            'rework_qty' => 'required|numeric|min:0.01',
            'uom' => 'nullable|string',
            'failure_reason' => 'required|string',
            'rework_action' => 'required|string',
            'rework_cost' => 'nullable|numeric|min:0',
            'rework_cycle' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $item = $this->service->createRework($v, auth()->id());
        $this->log($request, 'created', 'Rework', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'Rework recorded',
            'data' => $item,
        ], 201);
    }

    public function reworkDestroy(int $id, Request $request): JsonResponse
    {
        try {
            $deleted = $this->service->deleteRework($id);
            if (!$deleted) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }

            $this->log($request, 'deleted', 'Rework', $id, ['status' => $deleted->status ?? 'Unknown'], []);
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // ─── Machines ─────────────────────────────────────────────────────────────

    public function machineIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getMachines((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function machineStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'machine_name' => 'required|string',
            'machine_group' => 'nullable|string',
            'work_center' => 'nullable|string',
            'production_line' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $item = $this->service->createMachine($v, auth()->id());
        $this->log($request, 'created', 'Machine', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'Machine created',
            'data' => $item,
        ], 201);
    }

    public function machineDestroy(int $id, Request $request): JsonResponse
    {
        try {
            $deleted = $this->service->deleteMachine($id);
            if (!$deleted) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }

            $this->log($request, 'deleted', 'Machine', $id, ['status' => $deleted->status ?? 'Unknown'], []);
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // ─── Maintenance ──────────────────────────────────────────────────────────

    public function maintenanceIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getMaintenanceLogs((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function maintenanceStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'machine_id' => 'nullable|integer',
            'maintenance_type' => 'required|string',
            'scheduled_date' => 'nullable|date',
            'actual_date' => 'nullable|date',
            'technician' => 'nullable|string',
            'duration_hours' => 'nullable|numeric|min:0',
            'maintenance_cost' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'findings' => 'nullable|string',
        ]);

        $item = $this->service->createMaintenanceLog($v, auth()->id());
        $this->log($request, 'created', 'Maintenance', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance log created',
            'data' => $item,
        ], 201);
    }

    // ─── Downtime ─────────────────────────────────────────────────────────────

    public function downtimeIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getDowntimes((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function downtimeStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'machine_id' => 'nullable|integer',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date',
            'downtime_reason' => 'required|string',
            'downtime_category' => 'nullable|string',
            'root_cause' => 'nullable|string',
            'corrective_action' => 'nullable|string',
        ]);

        $item = $this->service->createDowntime($v, auth()->id());
        $this->log($request, 'created', 'Downtime', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'Downtime recorded',
            'data' => $item,
        ], 201);
    }

    // ─── Capacity Planning ────────────────────────────────────────────────────

    public function capacityIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getCapacityPlans((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function capacityStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'work_center' => 'required|string',
            'plan_date' => 'required|date',
            'shift' => 'nullable|string',
            'available_hours' => 'nullable|numeric|min:0',
            'planned_hours' => 'nullable|numeric|min:0',
            'headcount' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $item = $this->service->createCapacityPlan($v, auth()->id());
        $this->log($request, 'created', 'CapacityPlan', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'Capacity plan created',
            'data' => $item,
        ], 201);
    }

    // ─── Costing ─────────────────────────────────────────────────────────────

    public function costingIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getProductionCosts((int) $request->get('per_page', 15));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
                'last_page' => $rows->lastPage(),
                'current_page' => $rows->currentPage(),
            ],
        ]);
    }

    public function costingStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'product' => 'required|string',
            'material_cost' => 'nullable|numeric|min:0',
            'labor_cost' => 'nullable|numeric|min:0',
            'machine_cost' => 'nullable|numeric|min:0',
            'overhead_cost' => 'nullable|numeric|min:0',
            'standard_cost' => 'nullable|numeric|min:0',
            'posting_date' => 'nullable|date',
        ]);

        $item = $this->service->createProductionCost($v, auth()->id());
        $this->log($request, 'created', 'ProductionCost', $item->id, [], ['status' => 'Created/Draft']);

        return response()->json([
            'success' => true,
            'message' => 'Cost record created',
            'data' => $item,
        ], 201);
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    public function notifIndex(Request $request): JsonResponse
    {
        $rows = $this->service->getNotifications(auth()->id(), (int) $request->get('per_page', 20));
        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'total' => $rows->total(),
            ],
        ]);
    }

    public function notifStore(Request $request): JsonResponse
    {
        $v = $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'nullable|string',
            'channel' => 'nullable|string',
            'recipient' => 'nullable|string',
        ]);

        $item = $this->service->createNotification($v, auth()->id());
        return response()->json([
            'success' => true,
            'message' => 'Notification created',
            'data' => $item,
        ], 201);
    }

    public function notifMarkRead(int $id): JsonResponse
    {
        $this->service->markNotificationRead($id);
        return response()->json(['success' => true]);
    }
}
