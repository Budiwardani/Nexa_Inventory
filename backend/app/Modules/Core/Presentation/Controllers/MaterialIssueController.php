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

class MaterialIssueController extends Controller
{
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

            DB::commit();

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

    public function destroy(int $id): JsonResponse
    {
        $issue = MaterialIssueHeader::find($id);
        if (!$issue) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        $issue->delete();
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}
