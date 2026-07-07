<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class FinishedGoodsReceipt extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'finished_goods_receipts';
    protected $guarded = ['id'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) $model->uuid = (string) Str::uuid();
            if (empty($model->fgr_no)) $model->fgr_no = 'FGR-' . strtoupper(Str::random(6));
        });
    }

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class, 'production_order_id');
    }
}
