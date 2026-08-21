<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class MachineDowntime extends Model
{
    protected $table = 'machine_downtimes';

    protected $guarded = [];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'duration_hours' => 'decimal:2',
    ];

    public function machine()
    {
        return $this->belongsTo(Machine::class, 'machine_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
