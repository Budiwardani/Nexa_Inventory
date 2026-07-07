<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\WorkOrder;
use App\Modules\Core\Domain\Models\WorkOrderOperation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workOrders = WorkOrder::with('operations')
            ->paginate($request->get('per_page', 15));

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
            DB::beginTransaction();

            $workOrder = WorkOrder::create([
                'product' => $validated['product'],
                'variant' => $validated['variant'] ?? null,
                'target_qty' => $validated['target_qty'],
                'uom' => $validated['uom'] ?? 'PCS',
                'work_center' => $validated['work_center'] ?? null,
                'machine' => $validated['machine'] ?? null,
                'scheduled_start' => $validated['scheduled_start'] ?? null,
                'scheduled_end' => $validated['scheduled_end'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'Draft',
            ]);

            foreach ($validated['operations'] ?? [] as $op) {
                WorkOrderOperation::create([
                    'work_order_id' => $workOrder->id,
                    'operation_seq' => $op['operation_seq'],
                    'operation_name' => $op['operation_name'],
                    'work_center' => $op['work_center'] ?? null,
                    'machine' => $op['machine'] ?? null,
                    'setup_time' => $op['setup_time'] ?? 0,
                    'run_time' => $op['run_time'] ?? 0,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Work Order created successfully',
                'data' => $workOrder->load('operations'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed: ' . $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $wo = WorkOrder::with('operations')->find($id);
        if (!$wo) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        return response()->json(['success' => true, 'data' => $wo]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $wo = WorkOrder::find($id);
        if (!$wo) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $wo->update($request->only(['status', 'actual_start', 'actual_end', 'completed_qty', 'reject_qty', 'notes']));

        return response()->json(['success' => true, 'message' => 'Work Order updated', 'data' => $wo]);
    }

    public function destroy(int $id): JsonResponse
    {
        $wo = WorkOrder::find($id);
        if (!$wo) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $wo->delete();
        return response()->json(['success' => true, 'message' => 'Work Order deleted']);
    }
}
