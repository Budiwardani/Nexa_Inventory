<?php

$models_dir = 'C:/Users/Suswati/Documents/Nexa-inv/backend/app/Modules/Inventory/Domain/Models';

if (!is_dir($models_dir)) {
    mkdir($models_dir, 0777, true);
}

$models = [
    'StockAdjustment' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class StockAdjustment extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function warehouse()
    {
        return \$this->belongsTo(Warehouse::class);
    }

    public function items()
    {
        return \$this->hasMany(StockAdjustmentItem::class);
    }

    public function createdBy()
    {
        return \$this->belongsTo(User::class, 'created_by');
    }
}
EOD
    ,
    'StockAdjustmentItem' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Core\Domain\Models\Product;

class StockAdjustmentItem extends Model
{
    protected \$guarded = ['id'];

    public function adjustment()
    {
        return \$this->belongsTo(StockAdjustment::class, 'stock_adjustment_id');
    }

    public function product()
    {
        return \$this->belongsTo(Product::class);
    }

    public function location()
    {
        return \$this->belongsTo(WarehouseLocation::class);
    }
}
EOD
    ,
    'StockTransfer' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class StockTransfer extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function sourceWarehouse()
    {
        return \$this->belongsTo(Warehouse::class, 'source_warehouse_id');
    }

    public function destinationWarehouse()
    {
        return \$this->belongsTo(Warehouse::class, 'destination_warehouse_id');
    }

    public function items()
    {
        return \$this->hasMany(StockTransferItem::class);
    }

    public function createdBy()
    {
        return \$this->belongsTo(User::class, 'created_by');
    }
}
EOD
    ,
    'StockTransferItem' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Core\Domain\Models\Product;

class StockTransferItem extends Model
{
    protected \$guarded = ['id'];

    public function transfer()
    {
        return \$this->belongsTo(StockTransfer::class, 'stock_transfer_id');
    }

    public function product()
    {
        return \$this->belongsTo(Product::class);
    }

    public function sourceLocation()
    {
        return \$this->belongsTo(WarehouseLocation::class, 'source_location_id');
    }

    public function destinationLocation()
    {
        return \$this->belongsTo(WarehouseLocation::class, 'destination_location_id');
    }
}
EOD
];

foreach ($models as $name => $content) {
    $filePath = $models_dir . '/' . $name . '.php';
    file_put_contents($filePath, $content);
}

echo "Generated " . count($models) . " Inventory Phase 2 models.\n";
