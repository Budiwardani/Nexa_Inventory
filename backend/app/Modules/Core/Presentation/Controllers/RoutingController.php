<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\Routing;
use App\Modules\Core\Domain\Models\RoutingOperation;
use App\Modules\Core\Requests\CreateRoutingRequest;
use App\Modules\Core\Resources\RoutingResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Modules\Core\Domain\Models\AuditLog;

class RoutingController extends Controller
{
    private function log(Request $request, string $event, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id,
            'event'          => $event,
            'auditable_type' => 'Routing',
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
        $routings = Routing::with('operations')->paginate($request->get('per_page', 15));
        
        return response()->json([
            'success' => true,
            'data' => RoutingResource::collection($routings),
            'meta' => [
                'current_page' => $routings->currentPage(),
                'last_page' => $routings->lastPage(),
                'total' => $routings->total(),
            ],
        ]);
    }

    public function store(CreateRoutingRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $routing = Routing::create([
                'product' => $request->product,
                'description' => $request->description,
                'status' => 'Active',
            ]);

            foreach ($request->operations as $op) {
                RoutingOperation::create([
                    'routing_id' => $routing->id,
                    'operation_seq' => $op['operation_seq'],
                    'operation_name' => $op['operation_name'],
                    'work_center' => $op['work_center'] ?? null,
                    'machine_group' => $op['machine_group'] ?? null,
                    'setup_time' => $op['setup_time'] ?? 0,
                    'run_time' => $op['run_time'] ?? 0,
                    'move_time' => $op['move_time'] ?? 0,
                ]);
            }

            DB::commit();

            $this->log($request, 'created', $routing->id, [], [
                'product' => $routing->product,
                'status' => $routing->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Routing created successfully',
                'data' => new RoutingResource($routing->load('operations')),
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to create Routing: ' . $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $routing = Routing::with('operations')->find($id);

        if (!$routing) {
            return response()->json(['success' => false, 'message' => 'Routing not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new RoutingResource($routing),
        ]);
    }
}
