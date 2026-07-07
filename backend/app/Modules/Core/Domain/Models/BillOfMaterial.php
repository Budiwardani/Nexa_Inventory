<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class BillOfMaterial extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'bill_of_materials';

    protected $guarded = ['id'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
            if (empty($model->bom_no)) {
                $model->bom_no = 'BOM-' . strtoupper(Str::random(6));
            }
        });
    }

    public function versions()
    {
        return $this->hasMany(BomVersion::class, 'bom_id');
    }

    public function activeVersion()
    {
        return $this->hasOne(BomVersion::class, 'bom_id')->where('status', 'Active')->latest('version_number');
    }
}
