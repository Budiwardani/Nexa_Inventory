<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialIssueItem extends Model
{
    protected $table = 'material_issue_items';
    protected $guarded = ['id'];

    public function header()
    {
        return $this->belongsTo(MaterialIssueHeader::class, 'mi_header_id');
    }
}
