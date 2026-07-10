<?php

$models_dir = 'C:/Users/Suswati/Documents/Nexa-inv/backend/app/Modules/Inventory/Domain/Models';

if (!is_dir($models_dir)) {
    mkdir($models_dir, 0777, true);
}

$models = [
    'Warehouse' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Warehouse extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function zones()
    {
        return \$this->hasMany(WarehouseZone::class);
    }
}
EOD
    ,
    'WarehouseZone' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseZone extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function warehouse()
    {
        return \$this->belongsTo(Warehouse::class);
    }

    public function racks()
    {
        return \$this->hasMany(WarehouseRack::class, 'zone_id');
    }
}
EOD
    ,
    'WarehouseRack' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseRack extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function zone()
    {
        return \$this->belongsTo(WarehouseZone::class, 'zone_id');
    }

    public function bins()
    {
        return \$this->hasMany(WarehouseBin::class, 'rack_id');
    }
}
EOD
    ,
    'WarehouseBin' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseBin extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function rack()
    {
        return \$this->belongsTo(WarehouseRack::class, 'rack_id');
    }
}
EOD
    ,
    'WarehouseLocation' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseLocation extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function warehouse()
    {
        return \$this->belongsTo(Warehouse::class);
    }

    public function zone()
    {
        return \$this->belongsTo(WarehouseZone::class);
    }

    public function rack()
    {
        return \$this->belongsTo(WarehouseRack::class);
    }

    public function bin()
    {
        return \$this->belongsTo(WarehouseBin::class);
    }
}
EOD
    ,
    'Stock' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Core\Domain\Models\Product;

class Stock extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function product()
    {
        return \$this->belongsTo(Product::class);
    }

    public function warehouse()
    {
        return \$this->belongsTo(Warehouse::class);
    }

    public function location()
    {
        return \$this->belongsTo(WarehouseLocation::class);
    }
}
EOD
    ,
    'StockCard' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Core\Domain\Models\Product;

class StockCard extends Model
{
    protected \$guarded = ['id'];

    public function product()
    {
        return \$this->belongsTo(Product::class);
    }

    public function warehouse()
    {
        return \$this->belongsTo(Warehouse::class);
    }

    public function reference()
    {
        return \$this->morphTo();
    }
}
EOD
    ,
    'StockMovement' => <<<EOD
<?php

namespace App\Modules\Inventory\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMovement extends Model
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
}
EOD
];

foreach ($models as $name => $content) {
    $filePath = $models_dir . '/' . $name . '.php';
    file_put_contents($filePath, $content);
}

echo "Generated " . count($models) . " Inventory models.\n";
