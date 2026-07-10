<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseZone extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function racks()
    {
        return $this->hasMany(WarehouseRack::class, 'zone_id');
    }
}