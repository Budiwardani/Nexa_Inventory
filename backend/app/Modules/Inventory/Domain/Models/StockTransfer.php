<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class StockTransfer extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function sourceWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'source_warehouse_id');
    }

    public function destinationWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'destination_warehouse_id');
    }

    public function destinationDepartment()
    {
        return $this->belongsTo(Department::class, 'destination_department_id');
    }

    public function items()
    {
        return $this->hasMany(StockTransferItem::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function shippedBy()
    {
        return $this->belongsTo(User::class, 'shipped_by');
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}