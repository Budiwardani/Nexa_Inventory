<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function group()
    {
        return $this->belongsTo(UnitGroup::class, 'group_id');
    }
}