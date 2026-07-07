<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class JournalHeader extends Model
{
    protected $guarded = ['id'];
    
    protected $casts = [
        'journal_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function details()
    {
        return $this->hasMany(JournalDetail::class);
    }
}
