<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseRack extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function zone()
    {
        return $this->belongsTo(WarehouseZone::class, 'zone_id');
    }

    public function bins()
    {
        return $this->hasMany(WarehouseBin::class, 'rack_id');
    }
}