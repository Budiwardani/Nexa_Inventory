<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\MaterialReturnHeader;
use App\Modules\Core\Domain\Models\MaterialReturnItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Modules\Core\Domain\Models\AuditLog;

class MaterialReturnController extends Controller
{
    private function log(Request $request, string $event, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id,
            'event'          => $event,
            'auditable_type' => 'MaterialReturn',
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
        $returns = MaterialReturnHeader::with('items')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $returns->items(),
            'meta' => [
                'current_page' => $returns->currentPage(),
                'last_page' => $returns->lastPage(),
                'total' => $returns->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'return_date' => ['required', 'date'],
            'warehouse' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.material_code' => ['required', 'string'],
            'items.*.material_name' => ['required', 'string'],
            'items.*.return_qty' => ['required', 'numeric', 'min:0.0001'],
            'items.*.uom' => ['nullable', 'string'],
            'items.*.reason' => ['nullable', 'string'],
        ]);

        try {
            DB::beginTransaction();

            $header = MaterialReturnHeader::create([
                'return_date' => $validated['return_date'],
                'warehouse' => $validated['warehouse'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'Draft',
            ]);

            foreach ($validated['items'] as $item) {
                MaterialReturnItem::create([
                    'mr_header_id' => $header->id,
                    'material_code' => $item['material_code'],
                    'material_name' => $item['material_name'],
                    'return_qty' => $item['return_qty'],
                    'uom' => $item['uom'] ?? null,
                    'reason' => $item['reason'] ?? null,
                ]);
            }

            DB::commit();

            $this->log($request, 'created', $header->id, [], [
                'return_date' => $header->return_date,
                'status'      => $header->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Material Return created',
                'data' => $header->load('items'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $ret = MaterialReturnHeader::with('items')->find($id);
        if (!$ret) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $ret]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $ret = MaterialReturnHeader::find($id);
        if (!$ret) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if (!in_array($ret->status, ['Draft', 'Pending'])) {
            return response()->json(['success' => false, 'message' => 'Cannot delete Material Return in current status'], 400);
        }

        $oldStatus = $ret->status;
        $ret->delete();

        $this->log($request, 'deleted', $id, ['status' => $oldStatus], []);

        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}
