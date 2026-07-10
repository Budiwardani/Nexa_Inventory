<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Core\Domain\Models\Product;

class StockTransferItem extends Model
{
    protected $guarded = ['id'];

    public function transfer()
    {
        return $this->belongsTo(StockTransfer::class, 'stock_transfer_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function sourceLocation()
    {
        return $this->belongsTo(WarehouseLocation::class, 'source_location_id');
    }

    public function destinationLocation()
    {
        return $this->belongsTo(WarehouseLocation::class, 'destination_location_id');
    }
}