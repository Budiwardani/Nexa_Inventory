<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Machine extends Model
{
    use SoftDeletes;

    protected $table = 'machines';

    protected $guarded = [];

    protected $casts = [
        'last_maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
    ];

    public function maintenanceLogs()
    {
        return $this->hasMany(MachineMaintenanceLog::class, 'machine_id');
    }

    public function downtimes()
    {
        return $this->hasMany(MachineDowntime::class, 'machine_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
