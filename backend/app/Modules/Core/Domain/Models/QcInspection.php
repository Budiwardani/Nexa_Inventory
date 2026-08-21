<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QcInspection extends Model
{
    use SoftDeletes;

    protected $table = 'qc_inspections';

    protected $guarded = [];

    protected $casts = [
        'inspection_date' => 'date',
        'sample_qty' => 'decimal:2',
        'pass_qty' => 'decimal:2',
        'fail_qty' => 'decimal:2',
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
