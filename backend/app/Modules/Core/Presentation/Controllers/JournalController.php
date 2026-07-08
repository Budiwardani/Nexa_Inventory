<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\JournalHeader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = JournalHeader::with(['details.chartOfAccount'])->orderBy('journal_date', 'desc')->orderBy('id', 'desc');

        if ($request->has('reference_type')) {
            $query->where('reference_type', $request->query('reference_type'));
        }

        if ($request->has('reference_id')) {
            $query->where('reference_id', $request->query('reference_id'));
        }

        $journals = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data'    => $journals->items(),
            'meta'    => [
                'current_page' => $journals->currentPage(),
                'last_page'    => $journals->lastPage(),
                'total'        => $journals->total(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $journal = JournalHeader::with(['details.chartOfAccount'])->find($id);

        if (!$journal) {
            return response()->json(['success' => false, 'message' => 'Journal entry not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $journal]);
    }
}
