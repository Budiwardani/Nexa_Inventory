<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductionRework extends Model
{
    use SoftDeletes;

    protected $table = 'production_reworks';

    protected $guarded = [];

    protected $casts = [
        'rework_date' => 'date',
        'rework_qty' => 'decimal:2',
        'rework_cost' => 'decimal:4',
        'rework_cycle' => 'integer',
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
