<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function unitMappings()
    {
        return $this->hasOne(ProductUnitMapping::class);
    }

    public function packaging()
    {
        return $this->hasMany(ProductPackaging::class);
    }
}