<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitGroup extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];
}