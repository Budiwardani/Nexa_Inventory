<?php
$baseDir = 'C:\\Users\\Suswati\\Documents\\Nexa-inv\\backend\\app\\Modules\\Purchasing';

$models = [
    'Supplier' => <<<PHP
<?php
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

    protected \$guarded = ['id'];
    
    public function uniqueIds()
    {
        return ['uuid'];
    }

    public function contacts(): HasMany
    {
        return \$this->hasMany(SupplierContact::class);
    }

    public function creator(): BelongsTo
    {
        return \$this->belongsTo(User::class, 'created_by');
    }
}
PHP,
    'SupplierContact' => <<<PHP
<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierContact extends Model
{
    protected \$guarded = ['id'];

    public function supplier(): BelongsTo
    {
        return \$this->belongsTo(Supplier::class);
    }
}
PHP,
    'PurchaseOrder' => <<<PHP
<?php
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

    protected \$guarded = ['id'];

    public function uniqueIds()
    {
        return ['uuid'];
    }

    public function supplier(): BelongsTo
    {
        return \$this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return \$this->hasMany(PurchaseOrderItem::class);
    }

    public function goodsReceipts(): HasMany
    {
        return \$this->hasMany(GoodsReceipt::class);
    }

    public function creator(): BelongsTo
    {
        return \$this->belongsTo(User::class, 'created_by');
    }
}
PHP,
    'PurchaseOrderItem' => <<<PHP
<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderItem extends Model
{
    protected \$guarded = ['id'];

    public function purchaseOrder(): BelongsTo
    {
        return \$this->belongsTo(PurchaseOrder::class);
    }
}
PHP,
    'GoodsReceipt' => <<<PHP
<?php
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

    protected \$guarded = ['id'];

    public function uniqueIds()
    {
        return ['uuid'];
    }

    public function purchaseOrder(): BelongsTo
    {
        return \$this->belongsTo(PurchaseOrder::class);
    }

    public function supplier(): BelongsTo
    {
        return \$this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return \$this->hasMany(GoodsReceiptItem::class);
    }

    public function creator(): BelongsTo
    {
        return \$this->belongsTo(User::class, 'created_by');
    }
}
PHP,
    'GoodsReceiptItem' => <<<PHP
<?php
namespace App\Modules\Purchasing\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoodsReceiptItem extends Model
{
    protected \$guarded = ['id'];

    public function goodsReceipt(): BelongsTo
    {
        return \$this->belongsTo(GoodsReceipt::class);
    }
    
    public function purchaseOrderItem(): BelongsTo
    {
        return \$this->belongsTo(PurchaseOrderItem::class);
    }
}
PHP
];

foreach (\$models as \$name => \$content) {
    file_put_contents(\$baseDir . '\\Domain\\Models\\' . \$name . '.php', \$content);
}

echo "Generated models successfully.\n";
