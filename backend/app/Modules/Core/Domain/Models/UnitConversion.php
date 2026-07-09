<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitConversion extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function sourceUnit()
    {
        return $this->belongsTo(Unit::class, 'source_unit_id');
    }

    public function targetUnit()
    {
        return $this->belongsTo(Unit::class, 'target_unit_id');
    }

    public function conversionGroup()
    {
        return $this->belongsTo(ConversionGroup::class, 'conversion_group_id');
    }
}