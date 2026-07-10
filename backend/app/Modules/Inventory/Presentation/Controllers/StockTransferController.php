<?php

namespace App\Modules\Inventory\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Domain\Models\StockTransfer;
use App\Modules\Inventory\Services\StockOperationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockTransferController extends Controller
{
    protected $service;

    public function __construct(StockOperationService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json(
            StockTransfer::with(['sourceWarehouse', 'destinationWarehouse', 'createdBy', 'items.product'])->latest()->paginate(50)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_warehouse_id' => 'required|exists:warehouses,id',
            'destination_warehouse_id' => 'required|exists:warehouses,id|different:source_warehouse_id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.source_location_id' => 'nullable|exists:warehouse_locations,id',
            'items.*.destination_location_id' => 'nullable|exists:warehouse_locations,id',
            'items.*.batch_number' => 'nullable|string',
            'items.*.quantity' => 'required|numeric|min:0.0001',
            'items.*.notes' => 'nullable|string',
        ]);

        $transfer = DB::transaction(function () use ($validated, $request) {
            $trf = StockTransfer::create([
                'transfer_number' => 'TRF-' . date('Ym') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                'source_warehouse_id' => $validated['source_warehouse_id'],
                'destination_warehouse_id' => $validated['destination_warehouse_id'],
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()?->id,
                'status' => 'draft',
            ]);

            foreach ($validated['items'] as $item) {
                $trf->items()->create($item);
            }

            return $trf;
        });

        return response()->json($transfer->load('items'), 201);
    }

    public function show($id)
    {
        $trf = StockTransfer::with([
            'sourceWarehouse', 'destinationWarehouse', 'createdBy', 'shippedBy', 'receivedBy', 
            'items.product', 'items.sourceLocation', 'items.destinationLocation'
        ])->findOrFail($id);
        
        return response()->json($trf);
    }

    public function ship($id)
    {
        $transfer = StockTransfer::with('items')->findOrFail($id);
        
        try {
            $this->service->shipTransfer($transfer);
            return response()->json(['message' => 'Transfer shipped successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function receive(Request $request, $id)
    {
        $transfer = StockTransfer::with('items')->findOrFail($id);
        
        $validated = $request->validate([
            'received_quantities' => 'nullable|array',
            'received_quantities.*' => 'numeric|min:0'
        ]);

        try {
            $this->service->receiveTransfer($transfer, $validated['received_quantities'] ?? []);
            return response()->json(['message' => 'Transfer received successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $transfer = StockTransfer::findOrFail($id);
        if ($transfer->status !== 'draft') {
            return response()->json(['message' => 'Cannot delete transfer that is not in draft status.'], 400);
        }
        $transfer->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
