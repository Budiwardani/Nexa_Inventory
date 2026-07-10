<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Core\Domain\Models\Product;

class StockAdjustmentItem extends Model
{
    protected $guarded = ['id'];

    public function adjustment()
    {
        return $this->belongsTo(StockAdjustment::class, 'stock_adjustment_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function location()
    {
        return $this->belongsTo(WarehouseLocation::class);
    }
}