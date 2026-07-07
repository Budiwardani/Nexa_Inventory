<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];
    
    protected $casts = [
        'qty' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'last_counted_at' => 'datetime',
    ];
}
