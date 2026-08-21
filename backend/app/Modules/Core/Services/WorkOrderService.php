<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\WorkOrder;
use App\Modules\Core\Domain\Models\WorkOrderOperation;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class WorkOrderService
{
    public function getPaginatedWorkOrders(int $perPage = 15): LengthAwarePaginator
    {
        return WorkOrder::with('operations')->orderByDesc('id')->paginate($perPage);
    }

    public function findById(int $id): ?WorkOrder
    {
        return WorkOrder::with('operations')->find($id);
    }

    public function createWorkOrder(array $data): WorkOrder
    {
        return DB::transaction(function () use ($data) {
            $workOrder = WorkOrder::create([
                'product' => $data['product'],
                'variant' => $data['variant'] ?? null,
                'target_qty' => $data['target_qty'],
                'uom' => $data['uom'] ?? 'PCS',
                'work_center' => $data['work_center'] ?? null,
                'machine' => $data['machine'] ?? null,
                'scheduled_start' => $data['scheduled_start'] ?? null,
                'scheduled_end' => $data['scheduled_end'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'Draft',
            ]);

            if (!empty($data['operations'])) {
                foreach ($data['operations'] as $op) {
                    WorkOrderOperation::create([
                        'work_order_id' => $workOrder->id,
                        'operation_seq' => $op['operation_seq'],
                        'operation_name' => $op['operation_name'],
                        'work_center' => $op['work_center'] ?? null,
                        'machine' => $op['machine'] ?? null,
                        'setup_time' => $op['setup_time'] ?? 0,
                        'run_time' => $op['run_time'] ?? 0,
                        'status' => 'Pending',
                    ]);
                }
            }

            return $workOrder->load('operations');
        });
    }

    public function updateWorkOrder(int $id, array $data): WorkOrder
    {
        $workOrder = WorkOrder::find($id);
        if (!$workOrder) {
            throw new \Exception('Not found');
        }

        $workOrder->update(array_intersect_key($data, array_flip([
            'status', 'notes', 'scheduled_start', 'scheduled_end'
        ])));

        return $workOrder->load('operations');
    }

    public function deleteWorkOrder(int $id): WorkOrder
    {
        $workOrder = WorkOrder::find($id);
        if (!$workOrder) {
            throw new \Exception('Not found');
        }

        if ($workOrder->status !== 'Draft') {
            throw new \DomainException('Only draft work orders can be deleted');
        }

        $workOrder->delete();
        return $workOrder;
    }
}
