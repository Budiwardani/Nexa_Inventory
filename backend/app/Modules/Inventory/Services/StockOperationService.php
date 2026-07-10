<?php

namespace App\Modules\Inventory\Services;

use App\Modules\Inventory\Domain\Models\Stock;
use App\Modules\Inventory\Domain\Models\StockCard;
use App\Modules\Inventory\Domain\Models\StockAdjustment;
use App\Modules\Inventory\Domain\Models\StockTransfer;
use Illuminate\Support\Facades\DB;
use Exception;

class StockOperationService
{
    public function postAdjustment(StockAdjustment $adjustment)
    {
        if ($adjustment->status === 'posted') {
            throw new Exception("Adjustment is already posted.");
        }

        DB::transaction(function () use ($adjustment) {
            foreach ($adjustment->items as $item) {
                // Find or create stock
                $stock = Stock::firstOrCreate([
                    'product_id' => $item->product_id,
                    'warehouse_id' => $adjustment->warehouse_id,
                    'location_id' => $item->location_id,
                    'batch_number' => $item->batch_number,
                ]);

                // Update stock quantity
                $stock->quantity_on_hand += $item->quantity_adjusted;
                if ($stock->quantity_on_hand < 0) {
                    throw new Exception("Negative stock is not allowed for product ID: {$item->product_id}");
                }
                $stock->save();

                // Create Stock Card
                StockCard::create([
                    'product_id' => $item->product_id,
                    'warehouse_id' => $adjustment->warehouse_id,
                    'location_id' => $item->location_id,
                    'batch_number' => $item->batch_number,
                    'transaction_type' => 'adjustment',
                    'reference_type' => StockAdjustment::class,
                    'reference_id' => $adjustment->id,
                    'quantity_in' => $item->quantity_adjusted > 0 ? $item->quantity_adjusted : 0,
                    'quantity_out' => $item->quantity_adjusted < 0 ? abs($item->quantity_adjusted) : 0,
                    'balance' => $stock->quantity_on_hand,
                    'created_by' => auth()->id(),
                ]);
            }

            $adjustment->status = 'posted';
            $adjustment->posted_by = auth()->id();
            $adjustment->posted_at = now();
            $adjustment->save();
        });

        return $adjustment;
    }

    public function shipTransfer(StockTransfer $transfer)
    {
        if ($transfer->status !== 'draft') {
            throw new Exception("Transfer is already shipped or processed.");
        }

        DB::transaction(function () use ($transfer) {
            foreach ($transfer->items as $item) {
                // Deduct from source warehouse
                $sourceStock = Stock::where([
                    'product_id' => $item->product_id,
                    'warehouse_id' => $transfer->source_warehouse_id,
                    'location_id' => $item->source_location_id,
                    'batch_number' => $item->batch_number,
                ])->first();

                if (!$sourceStock || $sourceStock->quantity_on_hand < $item->quantity) {
                    throw new Exception("Insufficient stock for product ID: {$item->product_id} at source.");
                }

                $sourceStock->quantity_on_hand -= $item->quantity;
                $sourceStock->save();

                // Create Stock Card for Outward
                StockCard::create([
                    'product_id' => $item->product_id,
                    'warehouse_id' => $transfer->source_warehouse_id,
                    'location_id' => $item->source_location_id,
                    'batch_number' => $item->batch_number,
                    'transaction_type' => 'transfer_out',
                    'reference_type' => StockTransfer::class,
                    'reference_id' => $transfer->id,
                    'quantity_in' => 0,
                    'quantity_out' => $item->quantity,
                    'balance' => $sourceStock->quantity_on_hand,
                    'created_by' => auth()->id(),
                ]);
            }

            $transfer->status = 'intransit';
            $transfer->shipped_by = auth()->id();
            $transfer->shipped_at = now();
            $transfer->save();
        });

        return $transfer;
    }

    public function receiveTransfer(StockTransfer $transfer, array $receivedQuantities = [])
    {
        if ($transfer->status !== 'intransit') {
            throw new Exception("Transfer is not in-transit.");
        }

        DB::transaction(function () use ($transfer, $receivedQuantities) {
            foreach ($transfer->items as $item) {
                $qtyToReceive = $receivedQuantities[$item->id] ?? $item->quantity;
                
                $item->quantity_received = $qtyToReceive;
                $item->save();

                // Add to destination warehouse
                $destStock = Stock::firstOrCreate([
                    'product_id' => $item->product_id,
                    'warehouse_id' => $transfer->destination_warehouse_id,
                    'location_id' => $item->destination_location_id,
                    'batch_number' => $item->batch_number,
                ]);

                $destStock->quantity_on_hand += $qtyToReceive;
                $destStock->save();

                // Create Stock Card for Inward
                StockCard::create([
                    'product_id' => $item->product_id,
                    'warehouse_id' => $transfer->destination_warehouse_id,
                    'location_id' => $item->destination_location_id,
                    'batch_number' => $item->batch_number,
                    'transaction_type' => 'transfer_in',
                    'reference_type' => StockTransfer::class,
                    'reference_id' => $transfer->id,
                    'quantity_in' => $qtyToReceive,
                    'quantity_out' => 0,
                    'balance' => $destStock->quantity_on_hand,
                    'created_by' => auth()->id(),
                ]);
            }

            $transfer->status = 'received';
            $transfer->received_by = auth()->id();
            $transfer->received_at = now();
            $transfer->save();
        });

        return $transfer;
    }
}
