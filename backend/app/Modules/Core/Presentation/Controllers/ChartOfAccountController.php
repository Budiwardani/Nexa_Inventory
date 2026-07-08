<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\ChartOfAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChartOfAccountController extends Controller
{
    public function index(): JsonResponse
    {
        $coas = ChartOfAccount::orderBy('account_code')->get();
        return response()->json(['success' => true, 'data' => $coas]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'account_code' => ['required', 'string', 'unique:chart_of_accounts,account_code'],
            'account_name' => ['required', 'string', 'max:255'],
            'account_type' => ['required', 'string', 'in:Asset,Liability,Equity,Revenue,Expense'],
            'is_active'    => ['boolean'],
        ]);

        $coa = ChartOfAccount::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Chart of Account created successfully',
            'data'    => $coa
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $coa = ChartOfAccount::find($id);
        
        if (!$coa) {
            return response()->json(['success' => false, 'message' => 'Chart of Account not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $coa]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $coa = ChartOfAccount::find($id);
        
        if (!$coa) {
            return response()->json(['success' => false, 'message' => 'Chart of Account not found'], 404);
        }

        $validated = $request->validate([
            'account_code' => ['string', "unique:chart_of_accounts,account_code,{$id}"],
            'account_name' => ['string', 'max:255'],
            'account_type' => ['string', 'in:Asset,Liability,Equity,Revenue,Expense'],
            'is_active'    => ['boolean'],
        ]);

        $coa->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Chart of Account updated successfully',
            'data'    => $coa
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $coa = ChartOfAccount::find($id);
        
        if (!$coa) {
            return response()->json(['success' => false, 'message' => 'Chart of Account not found'], 404);
        }

        // Ideally check if COA is used in JournalDetail before deleting.
        // But softDeletes is enabled, so it's relatively safe.
        $coa->delete();

        return response()->json(['success' => true, 'message' => 'Chart of Account deleted successfully']);
    }
}
