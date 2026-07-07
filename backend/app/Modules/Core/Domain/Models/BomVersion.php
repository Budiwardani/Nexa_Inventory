<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BomVersion extends Model
{
    use HasFactory;

    protected $table = 'bom_versions';

    protected $guarded = ['id'];

    public function bom()
    {
        return $this->belongsTo(BillOfMaterial::class, 'bom_id');
    }

    public function items()
    {
        return $this->hasMany(BomItem::class, 'bom_version_id');
    }
}
