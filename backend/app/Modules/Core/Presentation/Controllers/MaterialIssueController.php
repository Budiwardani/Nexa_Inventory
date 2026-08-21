<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\AuditLog;
use App\Modules\Core\Services\MaterialIssueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialIssueController extends Controller
{
    public function __construct(
        protected MaterialIssueService $service
    ) {}

    private function log(Request $request, string $event, int $modelId, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'        => $request->user()?->id,
            'event'          => $event,
            'auditable_type' => 'MaterialIssue',
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
        $issues = $this->service->getPaginatedIssues((int) $request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $issues->items(),
            'meta' => [
                'current_page' => $issues->currentPage(),
                'last_page' => $issues->lastPage(),
                'total' => $issues->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'issue_date' => ['required', 'date'],
            'warehouse' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.material_code' => ['required', 'string'],
            'items.*.material_name' => ['required', 'string'],
            'items.*.required_qty' => ['required', 'numeric', 'min:0.0001'],
            'items.*.issued_qty' => ['nullable', 'numeric', 'min:0'],
            'items.*.uom' => ['nullable', 'string'],
        ]);

        try {
            $header = $this->service->createIssue($validated);

            $this->log($request, 'created', $header->id, [], [
                'status' => $header->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Material Issue created',
                'data' => $header,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $issue = $this->service->findById($id);
        if (!$issue) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $issue]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        try {
            $issue = $this->service->deleteIssue($id);
            $this->log($request, 'deleted', $id, ['status' => $issue->status], []);
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
    }
}
