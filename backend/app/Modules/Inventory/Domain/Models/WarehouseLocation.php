<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseLocation extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function zone()
    {
        return $this->belongsTo(WarehouseZone::class);
    }

    public function rack()
    {
        return $this->belongsTo(WarehouseRack::class);
    }

    public function bin()
    {
        return $this->belongsTo(WarehouseBin::class);
    }
}