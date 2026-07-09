<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\UnitConversion;
use App\Modules\Core\Services\ConversionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitConversionController extends Controller
{
    protected ConversionService $service;

    public function __construct(ConversionService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $query = UnitConversion::with(['sourceUnit', 'targetUnit', 'conversionGroup']);

        if ($request->has('active_only')) {
            $query->where('is_active', true);
        }

        $conversions = $query->get();
        
        return response()->json(['success' => true, 'data' => $conversions]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'conversion_code' => 'required|string|unique:unit_conversions,conversion_code',
            'conversion_name' => 'nullable|string',
            'source_unit_id' => 'required|exists:units,id',
            'target_unit_id' => 'required|exists:units,id|different:source_unit_id',
            'conversion_factor' => 'required|numeric|gt:0',
            'reverse_factor' => 'nullable|numeric|gt:0',
            'precision' => 'integer|min:0|max:6',
            'rounding_method' => 'string|in:Round Half Up,Round Down,Round Up',
            'allow_fraction' => 'boolean',
            'loss_percentage' => 'numeric|min:0|max:100',
            'yield_percentage' => 'numeric|min:0|max:100',
            'is_active' => 'boolean'
        ]);

        // Prevent duplicates
        $exists = UnitConversion::where('source_unit_id', $validated['source_unit_id'])
            ->where('target_unit_id', $validated['target_unit_id'])
            ->exists();
            
        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Conversion already exists between these units'], 422);
        }

        $validated['created_by'] = $request->user()?->id;

        $conversion = UnitConversion::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Conversion rule created successfully',
            'data' => $conversion->load(['sourceUnit', 'targetUnit'])
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $conversion = UnitConversion::findOrFail($id);

        $validated = $request->validate([
            'conversion_code' => "string|unique:unit_conversions,conversion_code,{$id}",
            'conversion_name' => 'nullable|string',
            'conversion_factor' => 'numeric|gt:0',
            'reverse_factor' => 'nullable|numeric|gt:0',
            'precision' => 'integer|min:0|max:6',
            'rounding_method' => 'string|in:Round Half Up,Round Down,Round Up',
            'allow_fraction' => 'boolean',
            'loss_percentage' => 'numeric|min:0|max:100',
            'yield_percentage' => 'numeric|min:0|max:100',
            'is_active' => 'boolean'
        ]);

        $validated['updated_by'] = $request->user()?->id;

        $conversion->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Conversion rule updated successfully',
            'data' => $conversion->load(['sourceUnit', 'targetUnit'])
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $conversion = UnitConversion::findOrFail($id);
        $conversion->delete();

        return response()->json(['success' => true, 'message' => 'Conversion rule deleted successfully']);
    }

    /**
     * Simulate a conversion
     */
    public function simulate(Request $request): JsonResponse
    {
        $request->validate([
            'source_unit_id' => 'required|exists:units,id',
            'target_unit_id' => 'required|exists:units,id',
            'quantity' => 'required|numeric|gt:0'
        ]);

        try {
            $result = $this->service->convert(
                $request->source_unit_id,
                $request->target_unit_id,
                $request->quantity
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'source_quantity' => $request->quantity,
                    'result_quantity' => $result
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
