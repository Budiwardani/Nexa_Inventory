<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Warehouse extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function zones()
    {
        return $this->hasMany(WarehouseZone::class);
    }
}