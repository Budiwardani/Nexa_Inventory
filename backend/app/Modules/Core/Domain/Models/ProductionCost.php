<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionCost extends Model
{
    protected $table = 'production_costs';

    protected $guarded = [];

    protected $casts = [
        'material_cost' => 'decimal:4',
        'labor_cost' => 'decimal:4',
        'machine_cost' => 'decimal:4',
        'overhead_cost' => 'decimal:4',
        'total_cost' => 'decimal:4',
        'standard_cost' => 'decimal:4',
        'variance' => 'decimal:4',
        'posting_date' => 'date',
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
