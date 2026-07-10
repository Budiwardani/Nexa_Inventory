<?php

namespace App\Modules\Inventory\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Domain\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::with('branch')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'        => 'required|string|unique:departments,code',
            'name'        => 'required|string|max:255',
            'type'        => 'nullable|string|in:production,qc,maintenance,assembly,logistics,warehouse,admin',
            'description' => 'nullable|string',
            'branch_id'   => 'nullable|exists:branches,id',
            'is_active'   => 'boolean',
        ]);

        $validated['created_by'] = $request->user()?->id;

        $dept = Department::create($validated);
        return response()->json($dept, 201);
    }

    public function show($id)
    {
        return response()->json(Department::with('branch')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $dept = Department::findOrFail($id);

        $validated = $request->validate([
            'code'        => 'sometimes|string|unique:departments,code,' . $id,
            'name'        => 'sometimes|string|max:255',
            'type'        => 'nullable|string|in:production,qc,maintenance,assembly,logistics,warehouse,admin',
            'description' => 'nullable|string',
            'branch_id'   => 'nullable|exists:branches,id',
            'is_active'   => 'boolean',
        ]);

        $dept->update($validated);
        return response()->json($dept);
    }

    public function destroy($id)
    {
        $dept = Department::findOrFail($id);
        $dept->delete();
        return response()->json(['message' => 'Department deleted.']);
    }
}
