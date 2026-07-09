<?php

$models_dir = 'C:/Users/Suswati/Documents/Nexa-inv/backend/app/Modules/Core/Domain/Models';

if (!is_dir($models_dir)) {
    mkdir($models_dir, 0777, true);
}

$models = [
    'Product' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function unitMappings()
    {
        return \$this->hasOne(ProductUnitMapping::class);
    }

    public function packaging()
    {
        return \$this->hasMany(ProductPackaging::class);
    }
}
EOD
    ,
    'UnitGroup' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitGroup extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];
}
EOD
    ,
    'Unit' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function group()
    {
        return \$this->belongsTo(UnitGroup::class, 'group_id');
    }
}
EOD
    ,
    'PackagingType' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PackagingType extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];
}
EOD
    ,
    'ConversionGroup' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConversionGroup extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];
}
EOD
    ,
    'UnitConversion' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitConversion extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function sourceUnit()
    {
        return \$this->belongsTo(Unit::class, 'source_unit_id');
    }

    public function targetUnit()
    {
        return \$this->belongsTo(Unit::class, 'target_unit_id');
    }

    public function conversionGroup()
    {
        return \$this->belongsTo(ConversionGroup::class, 'conversion_group_id');
    }
}
EOD
    ,
    'ProductUnitMapping' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductUnitMapping extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function product()
    {
        return \$this->belongsTo(Product::class);
    }

    public function baseUnit()
    {
        return \$this->belongsTo(Unit::class, 'base_unit_id');
    }
}
EOD
    ,
    'ProductPackaging' => <<<EOD
<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductPackaging extends Model
{
    use SoftDeletes;
    protected \$guarded = ['id'];

    public function product()
    {
        return \$this->belongsTo(Product::class);
    }

    public function packagingType()
    {
        return \$this->belongsTo(PackagingType::class);
    }

    public function baseUnit()
    {
        return \$this->belongsTo(Unit::class, 'base_unit_id');
    }
}
EOD
];

foreach ($models as $name => $content) {
    $filePath = $models_dir . '/' . $name . '.php';
    file_put_contents($filePath, $content);
}

echo "Generated " . count($models) . " models.\n";
