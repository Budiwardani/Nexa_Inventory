<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class MaterialIssueHeader extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'material_issue_headers';
    protected $guarded = ['id'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) $model->uuid = (string) Str::uuid();
            if (empty($model->mi_no)) $model->mi_no = 'MI-' . strtoupper(Str::random(6));
        });
    }

    public function items()
    {
        return $this->hasMany(MaterialIssueItem::class, 'mi_header_id');
    }

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class, 'production_order_id');
    }
}
