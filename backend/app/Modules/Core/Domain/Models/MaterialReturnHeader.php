<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class MaterialReturnHeader extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'material_return_headers';
    protected $guarded = ['id'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) $model->uuid = (string) Str::uuid();
            if (empty($model->mr_no)) $model->mr_no = 'MR-' . strtoupper(Str::random(6));
        });
    }

    public function items()
    {
        return $this->hasMany(MaterialReturnItem::class, 'mr_header_id');
    }
}
