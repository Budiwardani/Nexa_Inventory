<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\DTO\ProductionOrderDTO;
use App\Modules\Core\Requests\CreateProductionOrderRequest;
use App\Modules\Core\Resources\ProductionOrderResource;
use App\Modules\Core\Services\ProductionOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionOrderController extends Controller
{
    public function __construct(
        private ProductionOrderService $productionOrderService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->productionOrderService->getPaginatedProductionOrders(
            $request->get('per_page', 15),
            $request->only(['search', 'status', 'company_id', 'branch_id'])
        );

        return response()->json([
            'success' => true,
            'data' => ProductionOrderResource::collection($orders),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function store(CreateProductionOrderRequest $request): JsonResponse
    {
        $order = $this->productionOrderService->createProductionOrder(
            ProductionOrderDTO::fromArray($request->validated())
        );

        return response()->json([
            'success' => true,
            'message' => 'Production order created successfully',
            'data' => new ProductionOrderResource($order),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->productionOrderService->getProductionOrderById($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Production order not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new ProductionOrderResource($order),
        ]);
    }

    public function approve(int $id, Request $request): JsonResponse
    {
        try {
            // In a real app, $request->user()->id would be used. Using 1 for simplicity if no auth.
            $userId = $request->user() ? $request->user()->id : 1;
            $order = $this->productionOrderService->approve($id, $userId);
            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function release(int $id): JsonResponse
    {
        try {
            $order = $this->productionOrderService->release($id);
            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function complete(int $id): JsonResponse
    {
        try {
            $order = $this->productionOrderService->complete($id);
            return response()->json(['success' => true, 'data' => new ProductionOrderResource($order)]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}
