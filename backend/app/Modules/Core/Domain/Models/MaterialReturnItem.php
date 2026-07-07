<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialReturnItem extends Model
{
    protected $table = 'material_return_items';
    protected $guarded = ['id'];
}
