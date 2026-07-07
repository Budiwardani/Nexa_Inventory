<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BomItem extends Model
{
    use HasFactory;

    protected $table = 'bom_items';

    protected $guarded = ['id'];

    public function version()
    {
        return $this->belongsTo(BomVersion::class, 'bom_version_id');
    }
}
