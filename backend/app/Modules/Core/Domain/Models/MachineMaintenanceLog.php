<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MachineMaintenanceLog extends Model
{
    use SoftDeletes;

    protected $table = 'machine_maintenance_logs';

    protected $guarded = [];

    protected $casts = [
        'scheduled_date' => 'date',
        'actual_date' => 'date',
        'duration_hours' => 'decimal:2',
        'maintenance_cost' => 'decimal:4',
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
