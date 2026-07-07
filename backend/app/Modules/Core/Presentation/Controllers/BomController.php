<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Domain\Models\BillOfMaterial;
use App\Modules\Core\Domain\Models\BomVersion;
use App\Modules\Core\Domain\Models\BomItem;
use App\Modules\Core\Requests\CreateBomRequest;
use App\Modules\Core\Resources\BomResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $boms = BillOfMaterial::with(['activeVersion.items', 'versions'])->paginate($request->get('per_page', 15));
        
        return response()->json([
            'success' => true,
            'data' => BomResource::collection($boms),
            'meta' => [
                'current_page' => $boms->currentPage(),
                'last_page' => $boms->lastPage(),
                'total' => $boms->total(),
            ],
        ]);
    }

    public function store(CreateBomRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $bom = BillOfMaterial::create([
                'product' => $request->product,
                'variant' => $request->variant,
                'uom' => $request->uom,
                'base_qty' => $request->base_qty,
                'description' => $request->description,
                'status' => 'Active',
            ]);

            $version = BomVersion::create([
                'bom_id' => $bom->id,
                'version_number' => 1,
                'effective_date' => now(),
                'status' => 'Active',
            ]);

            foreach ($request->items as $item) {
                BomItem::create([
                    'bom_version_id' => $version->id,
                    'component_item' => $item['component_item'],
                    'quantity' => $item['quantity'],
                    'uom' => $item['uom'] ?? null,
                    'scrap_percentage' => $item['scrap_percentage'] ?? 0,
                    'is_critical' => $item['is_critical'] ?? false,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'BOM created successfully',
                'data' => new BomResource($bom->load(['versions.items', 'activeVersion.items'])),
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to create BOM: ' . $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $bom = BillOfMaterial::with(['versions.items', 'activeVersion.items'])->find($id);

        if (!$bom) {
            return response()->json(['success' => false, 'message' => 'BOM not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new BomResource($bom),
        ]);
    }
}
