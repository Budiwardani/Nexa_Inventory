<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class CapacityPlan extends Model
{
    protected $table = 'capacity_plans';

    protected $guarded = [];

    protected $casts = [
        'plan_date' => 'date',
        'available_hours' => 'decimal:2',
        'planned_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
        'headcount' => 'integer',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
