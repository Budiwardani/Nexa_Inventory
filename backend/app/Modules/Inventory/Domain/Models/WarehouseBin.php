<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseBin extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function rack()
    {
        return $this->belongsTo(WarehouseRack::class, 'rack_id');
    }
}