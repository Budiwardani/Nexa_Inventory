import os

models_dir = r"C:\Users\Suswati\Documents\Nexa-inv\backend\app\Modules\Core\Domain\Models"
os.makedirs(models_dir, exist_ok=True)

models = {
    "Product": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function unitMappings()
    {
        return $this->hasOne(ProductUnitMapping::class);
    }

    public function packaging()
    {
        return $this->hasMany(ProductPackaging::class);
    }
}
""",
    "UnitGroup": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitGroup extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];
}
""",
    "Unit": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function group()
    {
        return $this->belongsTo(UnitGroup::class, 'group_id');
    }
}
""",
    "PackagingType": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PackagingType extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];
}
""",
    "ConversionGroup": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConversionGroup extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];
}
""",
    "UnitConversion": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitConversion extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function sourceUnit()
    {
        return $this->belongsTo(Unit::class, 'source_unit_id');
    }

    public function targetUnit()
    {
        return $this->belongsTo(Unit::class, 'target_unit_id');
    }

    public function conversionGroup()
    {
        return $this->belongsTo(ConversionGroup::class, 'conversion_group_id');
    }
}
""",
    "ProductUnitMapping": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductUnitMapping extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function baseUnit()
    {
        return $this->belongsTo(Unit::class, 'base_unit_id');
    }
}
""",
    "ProductPackaging": """<?php

namespace App\Modules\Core\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductPackaging extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function packagingType()
    {
        return $this->belongsTo(PackagingType::class);
    }

    public function baseUnit()
    {
        return $this->belongsTo(Unit::class, 'base_unit_id');
    }
}
"""
}

for name, content in models.items():
    file_path = os.path.join(models_dir, f"{name}.php")
    with open(file_path, "w") as f:
        f.write(content)

print(f"Generated {len(models)} models.")
