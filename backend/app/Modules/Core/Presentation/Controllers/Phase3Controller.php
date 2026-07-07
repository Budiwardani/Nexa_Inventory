<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class Phase3Controller extends Controller
{
    // ─── QC Inspections ──────────────────────────────────────────────────────

    public function qcIndex(Request $request): JsonResponse
    {
        $rows = DB::table('qc_inspections')->whereNull('deleted_at')
            ->orderByDesc('id')->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $id = DB::table('qc_inspections')->insertGetId(array_merge($v, [
            'uuid' => (string) Str::uuid(),
            'qc_no' => 'QC-' . strtoupper(Str::random(6)),
            'status' => 'Draft',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'QC Inspection created', 'data' => DB::table('qc_inspections')->find($id)], 201);
    }

    public function qcDestroy(int $id): JsonResponse
    {
        DB::table('qc_inspections')->where('id', $id)->update(['deleted_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }

    // ─── Scrap ───────────────────────────────────────────────────────────────

    public function scrapIndex(Request $request): JsonResponse
    {
        $rows = DB::table('production_scraps')->whereNull('deleted_at')
            ->orderByDesc('id')->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $unitCost = $v['unit_cost'] ?? 0;
        $id = DB::table('production_scraps')->insertGetId(array_merge($v, [
            'uuid' => (string) Str::uuid(),
            'scrap_no' => 'SCR-' . strtoupper(Str::random(6)),
            'total_cost' => $unitCost * $v['scrap_qty'],
            'status' => 'Draft',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Scrap recorded', 'data' => DB::table('production_scraps')->find($id)], 201);
    }

    public function scrapDestroy(int $id): JsonResponse
    {
        DB::table('production_scraps')->where('id', $id)->update(['deleted_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }

    // ─── Rework ──────────────────────────────────────────────────────────────

    public function reworkIndex(Request $request): JsonResponse
    {
        $rows = DB::table('production_reworks')->whereNull('deleted_at')
            ->orderByDesc('id')->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $id = DB::table('production_reworks')->insertGetId(array_merge($v, [
            'uuid' => (string) Str::uuid(),
            'rework_no' => 'RWK-' . strtoupper(Str::random(6)),
            'status' => 'Draft',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Rework recorded', 'data' => DB::table('production_reworks')->find($id)], 201);
    }

    public function reworkDestroy(int $id): JsonResponse
    {
        DB::table('production_reworks')->where('id', $id)->update(['deleted_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }

    // ─── Machines ─────────────────────────────────────────────────────────────

    public function machineIndex(Request $request): JsonResponse
    {
        $rows = DB::table('machines')->whereNull('deleted_at')
            ->orderByDesc('id')->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $id = DB::table('machines')->insertGetId(array_merge($v, [
            'machine_code' => 'MCH-' . strtoupper(Str::random(6)),
            'status' => 'Active',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Machine created', 'data' => DB::table('machines')->find($id)], 201);
    }

    public function machineDestroy(int $id): JsonResponse
    {
        DB::table('machines')->where('id', $id)->update(['deleted_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }

    // ─── Maintenance ──────────────────────────────────────────────────────────

    public function maintenanceIndex(Request $request): JsonResponse
    {
        $rows = DB::table('machine_maintenance_logs as m')
            ->leftJoin('machines as mc', 'm.machine_id', '=', 'mc.id')
            ->select('m.*', 'mc.machine_name', 'mc.machine_code')
            ->whereNull('m.deleted_at')
            ->orderByDesc('m.id')->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $id = DB::table('machine_maintenance_logs')->insertGetId(array_merge($v, [
            'uuid' => (string) Str::uuid(),
            'maintenance_no' => 'MNT-' . strtoupper(Str::random(6)),
            'status' => 'Scheduled',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Maintenance log created', 'data' => DB::table('machine_maintenance_logs')->find($id)], 201);
    }

    // ─── Downtime ─────────────────────────────────────────────────────────────

    public function downtimeIndex(Request $request): JsonResponse
    {
        $rows = DB::table('machine_downtimes as d')
            ->leftJoin('machines as mc', 'd.machine_id', '=', 'mc.id')
            ->select('d.*', 'mc.machine_name', 'mc.machine_code')
            ->orderByDesc('d.id')->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $durationHours = 0;
        if (!empty($v['end_time']) && !empty($v['start_time'])) {
            $durationHours = round((strtotime($v['end_time']) - strtotime($v['start_time'])) / 3600, 2);
        }
        $id = DB::table('machine_downtimes')->insertGetId(array_merge($v, [
            'uuid' => (string) Str::uuid(),
            'downtime_no' => 'DWT-' . strtoupper(Str::random(6)),
            'duration_hours' => $durationHours,
            'status' => 'Open',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Downtime recorded', 'data' => DB::table('machine_downtimes')->find($id)], 201);
    }

    // ─── Capacity Planning ────────────────────────────────────────────────────

    public function capacityIndex(Request $request): JsonResponse
    {
        $rows = DB::table('capacity_plans')->orderByDesc('id')
            ->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $id = DB::table('capacity_plans')->insertGetId(array_merge($v, [
            'uuid' => (string) Str::uuid(),
            'plan_no' => 'CAP-' . strtoupper(Str::random(6)),
            'status' => 'Draft',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Capacity plan created', 'data' => DB::table('capacity_plans')->find($id)], 201);
    }

    // ─── Costing ─────────────────────────────────────────────────────────────

    public function costingIndex(Request $request): JsonResponse
    {
        $rows = DB::table('production_costs')->orderByDesc('id')
            ->paginate($request->get('per_page', 15));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'last_page' => $rows->lastPage(), 'current_page' => $rows->currentPage()]]);
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
        $totalCost = ($v['material_cost'] ?? 0) + ($v['labor_cost'] ?? 0) + ($v['machine_cost'] ?? 0) + ($v['overhead_cost'] ?? 0);
        $variance = $totalCost - ($v['standard_cost'] ?? 0);
        $id = DB::table('production_costs')->insertGetId(array_merge($v, [
            'uuid' => (string) Str::uuid(),
            'cost_no' => 'CST-' . strtoupper(Str::random(6)),
            'total_cost' => $totalCost,
            'variance' => $variance,
            'status' => 'Draft',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Cost record created', 'data' => DB::table('production_costs')->find($id)], 201);
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    public function notifIndex(Request $request): JsonResponse
    {
        $rows = DB::table('notifications')
            ->where(function ($q) { $q->where('user_id', auth()->id())->orWhereNull('user_id'); })
            ->orderByDesc('id')->paginate($request->get('per_page', 20));
        return response()->json(['success' => true, 'data' => $rows->items(), 'meta' => ['total' => $rows->total()]]);
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
        $id = DB::table('notifications')->insertGetId(array_merge($v, [
            'user_id' => auth()->id(),
            'is_read' => false,
            'created_at' => now(), 'updated_at' => now(),
        ]));
        return response()->json(['success' => true, 'message' => 'Notification created', 'data' => DB::table('notifications')->find($id)], 201);
    }

    public function notifMarkRead(int $id): JsonResponse
    {
        DB::table('notifications')->where('id', $id)->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }
}
