<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\MaterialIssueHeader;
use App\Modules\Core\Domain\Models\MaterialIssueItem;
use App\Modules\Core\Domain\Models\MaterialReturnHeader;
use App\Modules\Core\Domain\Models\MaterialReturnItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Modules\Core\Domain\Models\AuditLog;

class MaterialIssueController extends Controller
{
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
        $issues = MaterialIssueHeader::with('items')
            ->paginate($request->get('per_page', 15));

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
            DB::beginTransaction();

            $header = MaterialIssueHeader::create([
                'issue_date' => $validated['issue_date'],
                'warehouse' => $validated['warehouse'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'Draft',
            ]);

            foreach ($validated['items'] as $item) {
                MaterialIssueItem::create([
                    'mi_header_id' => $header->id,
                    'material_code' => $item['material_code'],
                    'material_name' => $item['material_name'],
                    'required_qty' => $item['required_qty'],
                    'issued_qty' => $item['issued_qty'] ?? 0,
                    'uom' => $item['uom'] ?? null,
                ]);
            }

            // Post Journal Entry for Material Issue (Debit WIP, Credit Inventory)
            // Assuming standard account codes for demonstration: 
            // 11400 (Inventory), 11500 (WIP)
            // We use a dummy cost of $10 per unit for the demo if unit cost is unknown
            $totalCost = collect($validated['items'])->sum(function($item) {
                return ($item['issued_qty'] ?? 0) * 10; 
            });

            if ($totalCost > 0) {
                $accounting = app(\App\Modules\Core\Services\AccountingService::class);
                $accounting->postJournalEntry([
                    'journal_date' => $header->issue_date,
                    'reference_type' => 'MaterialIssue',
                    'reference_id' => $header->id,
                    'description' => 'Material Issue for Production',
                    'entries' => [
                        ['account_code' => '11500', 'debit' => $totalCost, 'credit' => 0, 'department' => 'Production'], // Debit WIP
                        ['account_code' => '11400', 'debit' => 0, 'credit' => $totalCost, 'department' => 'Warehouse'],  // Credit Inventory
                    ]
                ]);
            }

            DB::commit();

            $this->log($request, 'created', $header->id, [], [
                'status' => $header->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Material Issue created',
                'data' => $header->load('items'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $issue = MaterialIssueHeader::with('items')->find($id);
        if (!$issue) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $issue]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $issue = MaterialIssueHeader::find($id);
        if (!$issue) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        if ($issue->status !== 'Draft') {
            return response()->json(['success' => false, 'message' => 'Only draft material issues can be deleted'], 400);
        }

        $oldStatus = $issue->status;
        $issue->delete();

        $this->log($request, 'deleted', $id, ['status' => $oldStatus], []);

        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}
