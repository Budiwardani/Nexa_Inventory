import os

base_dir = r"C:\Users\Suswati\Documents\Nexa-inv\backend\app\Modules\Purchasing"

models = {
    "Supplier": """<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Core\Domain\Models\User;

class Supplier extends Model
{
    use SoftDeletes, HasUuids;

    protected $guarded = ['id'];
    
    public function uniqueIds()
    {
        return ['uuid'];
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(SupplierContact::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
""",
    "SupplierContact": """<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierContact extends Model
{
    protected $guarded = ['id'];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
""",
    "PurchaseOrder": """<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\Core\Domain\Models\User;

class PurchaseOrder extends Model
{
    use SoftDeletes, HasUuids;

    protected $guarded = ['id'];

    public function uniqueIds()
    {
        return ['uuid'];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function goodsReceipts(): HasMany
    {
        return $this->hasMany(GoodsReceipt::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
""",
    "PurchaseOrderItem": """<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderItem extends Model
{
    protected $guarded = ['id'];

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
""",
    "GoodsReceipt": """<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\Core\Domain\Models\User;

class GoodsReceipt extends Model
{
    use SoftDeletes, HasUuids;

    protected $guarded = ['id'];

    public function uniqueIds()
    {
        return ['uuid'];
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(GoodsReceiptItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
""",
    "GoodsReceiptItem": """<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoodsReceiptItem extends Model
{
    protected $guarded = ['id'];

    public function goodsReceipt(): BelongsTo
    {
        return $this->belongsTo(GoodsReceipt::class);
    }
    
    public function purchaseOrderItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrderItem::class);
    }
}
"""
}

# Write models
for name, content in models.items():
    path = os.path.join(base_dir, "Domain", "Models", f"{name}.php")
    with open(path, "w") as f:
        f.write(content)

print("Generated models successfully.")
