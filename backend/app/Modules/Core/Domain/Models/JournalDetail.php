<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class JournalDetail extends Model
{
    protected $guarded = ['id'];
    
    protected $casts = [
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
    ];

    public function header()
    {
        return $this->belongsTo(JournalHeader::class, 'journal_header_id');
    }

    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account_id');
    }
}
