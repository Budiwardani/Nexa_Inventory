<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductionScrap extends Model
{
    use SoftDeletes;

    protected $table = 'production_scraps';

    protected $guarded = [];

    protected $casts = [
        'scrap_date' => 'date',
        'scrap_qty' => 'decimal:2',
        'unit_cost' => 'decimal:4',
        'total_cost' => 'decimal:4',
    ];

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class, 'production_order_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
