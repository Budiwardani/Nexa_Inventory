<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    public function branch()
    {
        return $this->belongsTo(\App\Modules\Core\Domain\Models\Branch::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function stockTransfers()
    {
        return $this->hasMany(StockTransfer::class, 'destination_department_id');
    }
}
