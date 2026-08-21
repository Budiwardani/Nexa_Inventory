<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\AppNotification;
use App\Modules\Core\Domain\Models\CapacityPlan;
use App\Modules\Core\Domain\Models\Machine;
use App\Modules\Core\Domain\Models\MachineDowntime;
use App\Modules\Core\Domain\Models\MachineMaintenanceLog;
use App\Modules\Core\Domain\Models\ProductionCost;
use App\Modules\Core\Domain\Models\ProductionRework;
use App\Modules\Core\Domain\Models\ProductionScrap;
use App\Modules\Core\Domain\Models\QcInspection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class Phase3Service
{
    // ─── QC Inspections ──────────────────────────────────────────────────────

    public function getQcInspections(int $perPage = 15): LengthAwarePaginator
    {
        return QcInspection::orderByDesc('id')->paginate($perPage);
    }

    public function createQcInspection(array $data, ?int $userId): QcInspection
    {
        return QcInspection::create(array_merge($data, [
            'uuid' => (string) Str::uuid(),
            'qc_no' => 'QC-' . strtoupper(Str::random(6)),
            'status' => $data['status'] ?? 'Draft',
            'created_by' => $userId,
        ]));
    }

    public function deleteQcInspection(int $id): ?QcInspection
    {
        $inspection = QcInspection::find($id);
        if (!$inspection) return null;

        if (!in_array($inspection->status, ['Draft', 'Pending'])) {
            throw new \DomainException('Cannot delete QC inspection in current status');
        }

        $inspection->delete();
        return $inspection;
    }

    // ─── Scrap Management ───────────────────────────────────────────────────

    public function getScraps(int $perPage = 15): LengthAwarePaginator
    {
        return ProductionScrap::orderByDesc('id')->paginate($perPage);
    }

    public function createScrap(array $data, ?int $userId): ProductionScrap
    {
        $unitCost = $data['unit_cost'] ?? 0;
        $scrapQty = $data['scrap_qty'] ?? 0;

        return ProductionScrap::create(array_merge($data, [
            'uuid' => (string) Str::uuid(),
            'scrap_no' => 'SCR-' . strtoupper(Str::random(6)),
            'total_cost' => $unitCost * $scrapQty,
            'status' => 'Draft',
            'created_by' => $userId,
        ]));
    }

    public function deleteScrap(int $id): ?ProductionScrap
    {
        $scrap = ProductionScrap::find($id);
        if (!$scrap) return null;

        if (!in_array($scrap->status, ['Draft', 'Pending'])) {
            throw new \DomainException('Cannot delete scrap record in current status');
        }

        $scrap->delete();
        return $scrap;
    }

    // ─── Rework ─────────────────────────────────────────────────────────────

    public function getReworks(int $perPage = 15): LengthAwarePaginator
    {
        return ProductionRework::orderByDesc('id')->paginate($perPage);
    }

    public function createRework(array $data, ?int $userId): ProductionRework
    {
        return ProductionRework::create(array_merge($data, [
            'uuid' => (string) Str::uuid(),
            'rework_no' => 'RWK-' . strtoupper(Str::random(6)),
            'status' => 'Draft',
            'created_by' => $userId,
        ]));
    }

    public function deleteRework(int $id): ?ProductionRework
    {
        $rework = ProductionRework::find($id);
        if (!$rework) return null;

        if (!in_array($rework->status, ['Draft', 'Pending'])) {
            throw new \DomainException('Cannot delete rework record in current status');
        }

        $rework->delete();
        return $rework;
    }

    // ─── Machines ───────────────────────────────────────────────────────────

    public function getMachines(int $perPage = 15): LengthAwarePaginator
    {
        return Machine::orderByDesc('id')->paginate($perPage);
    }

    public function createMachine(array $data, ?int $userId): Machine
    {
        return Machine::create(array_merge($data, [
            'machine_code' => 'MCH-' . strtoupper(Str::random(6)),
            'status' => $data['status'] ?? 'Active',
            'created_by' => $userId,
        ]));
    }

    public function deleteMachine(int $id): ?Machine
    {
        $machine = Machine::find($id);
        if (!$machine) return null;

        if (!in_array($machine->status, ['Active', 'Inactive'])) {
            throw new \DomainException('Cannot delete machine in current status');
        }

        $machine->delete();
        return $machine;
    }

    // ─── Maintenance Logs ───────────────────────────────────────────────────

    public function getMaintenanceLogs(int $perPage = 15): LengthAwarePaginator
    {
        return MachineMaintenanceLog::with('machine')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function createMaintenanceLog(array $data, ?int $userId): MachineMaintenanceLog
    {
        return MachineMaintenanceLog::create(array_merge($data, [
            'uuid' => (string) Str::uuid(),
            'maintenance_no' => 'MNT-' . strtoupper(Str::random(6)),
            'status' => $data['status'] ?? 'Scheduled',
            'created_by' => $userId,
        ]));
    }

    // ─── Downtime ───────────────────────────────────────────────────────────

    public function getDowntimes(int $perPage = 15): LengthAwarePaginator
    {
        return MachineDowntime::with('machine')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function createDowntime(array $data, ?int $userId): MachineDowntime
    {
        $durationHours = 0;
        if (!empty($data['end_time']) && !empty($data['start_time'])) {
            $durationHours = round((strtotime($data['end_time']) - strtotime($data['start_time'])) / 3600, 2);
        }

        return MachineDowntime::create(array_merge($data, [
            'uuid' => (string) Str::uuid(),
            'downtime_no' => 'DWT-' . strtoupper(Str::random(6)),
            'duration_hours' => $durationHours,
            'status' => 'Open',
            'created_by' => $userId,
        ]));
    }

    // ─── Capacity Planning ──────────────────────────────────────────────────

    public function getCapacityPlans(int $perPage = 15): LengthAwarePaginator
    {
        return CapacityPlan::orderByDesc('id')->paginate($perPage);
    }

    public function createCapacityPlan(array $data, ?int $userId): CapacityPlan
    {
        return CapacityPlan::create(array_merge($data, [
            'uuid' => (string) Str::uuid(),
            'plan_no' => 'CAP-' . strtoupper(Str::random(6)),
            'status' => 'Draft',
            'created_by' => $userId,
        ]));
    }

    // ─── Costing ────────────────────────────────────────────────────────────

    public function getProductionCosts(int $perPage = 15): LengthAwarePaginator
    {
        return ProductionCost::orderByDesc('id')->paginate($perPage);
    }

    public function createProductionCost(array $data, ?int $userId): ProductionCost
    {
        $totalCost = ($data['material_cost'] ?? 0) + ($data['labor_cost'] ?? 0) + ($data['machine_cost'] ?? 0) + ($data['overhead_cost'] ?? 0);
        $variance = $totalCost - ($data['standard_cost'] ?? 0);

        return ProductionCost::create(array_merge($data, [
            'uuid' => (string) Str::uuid(),
            'cost_no' => 'CST-' . strtoupper(Str::random(6)),
            'total_cost' => $totalCost,
            'variance' => $variance,
            'status' => 'Draft',
            'created_by' => $userId,
        ]));
    }

    // ─── Notifications ──────────────────────────────────────────────────────

    public function getNotifications(?int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return AppNotification::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        })->orderByDesc('id')->paginate($perPage);
    }

    public function createNotification(array $data, ?int $userId): AppNotification
    {
        return AppNotification::create(array_merge($data, [
            'user_id' => $userId,
            'is_read' => false,
        ]));
    }

    public function markNotificationRead(int $id): bool
    {
        $notif = AppNotification::find($id);
        if (!$notif) return false;

        $notif->is_read = true;
        return $notif->save();
    }
}
