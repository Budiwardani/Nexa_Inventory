<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoutingOperation extends Model
{
    use HasFactory;

    protected $table = 'routing_operations';

    protected $guarded = ['id'];

    public function routing()
    {
        return $this->belongsTo(Routing::class, 'routing_id');
    }
}
