<?php

$baseDir = 'C:\\Users\\Suswati\\Documents\\Nexa-inv\\backend\\app\\Modules\\Purchasing';

$files = [
    // Interfaces
    'Infrastructure\\Repositories\\SupplierRepositoryInterface' => <<<PHP
<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;

interface SupplierRepositoryInterface
{
    public function all(): Collection;
    public function find(int \$id): ?Supplier;
    public function create(array \$data): Supplier;
    public function update(int \$id, array \$data): bool;
    public function delete(int \$id): bool;
}
PHP,
    'Infrastructure\\Repositories\\PurchaseOrderRepositoryInterface' => <<<PHP
<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Collection;

interface PurchaseOrderRepositoryInterface
{
    public function all(): Collection;
    public function find(int \$id): ?PurchaseOrder;
    public function create(array \$data): PurchaseOrder;
    public function update(int \$id, array \$data): bool;
    public function delete(int \$id): bool;
}
PHP,
    'Infrastructure\\Repositories\\GoodsReceiptRepositoryInterface' => <<<PHP
<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\GoodsReceipt;
use Illuminate\Database\Eloquent\Collection;

interface GoodsReceiptRepositoryInterface
{
    public function all(): Collection;
    public function find(int \$id): ?GoodsReceipt;
    public function create(array \$data): GoodsReceipt;
    public function update(int \$id, array \$data): bool;
    public function delete(int \$id): bool;
}
PHP,

    // Repositories
    'Infrastructure\\Repositories\\SupplierRepository' => <<<PHP
<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;

class SupplierRepository implements SupplierRepositoryInterface
{
    public function all(): Collection
    {
        return Supplier::all();
    }

    public function find(int \$id): ?Supplier
    {
        return Supplier::find(\$id);
    }

    public function create(array \$data): Supplier
    {
        return Supplier::create(\$data);
    }

    public function update(int \$id, array \$data): bool
    {
        \$supplier = \$this->find(\$id);
        if (\$supplier) {
            return \$supplier->update(\$data);
        }
        return false;
    }

    public function delete(int \$id): bool
    {
        \$supplier = \$this->find(\$id);
        if (\$supplier) {
            return \$supplier->delete();
        }
        return false;
    }
}
PHP,
    'Infrastructure\\Repositories\\PurchaseOrderRepository' => <<<PHP
<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Collection;

class PurchaseOrderRepository implements PurchaseOrderRepositoryInterface
{
    public function all(): Collection
    {
        return PurchaseOrder::with(['supplier', 'items'])->get();
    }

    public function find(int \$id): ?PurchaseOrder
    {
        return PurchaseOrder::with(['supplier', 'items'])->find(\$id);
    }

    public function create(array \$data): PurchaseOrder
    {
        return PurchaseOrder::create(\$data);
    }

    public function update(int \$id, array \$data): bool
    {
        \$po = \$this->find(\$id);
        if (\$po) {
            return \$po->update(\$data);
        }
        return false;
    }

    public function delete(int \$id): bool
    {
        \$po = \$this->find(\$id);
        if (\$po) {
            return \$po->delete();
        }
        return false;
    }
}
PHP,
    'Infrastructure\\Repositories\\GoodsReceiptRepository' => <<<PHP
<?php
namespace App\Modules\Purchasing\Infrastructure\Repositories;

use App\Modules\Purchasing\Domain\Models\GoodsReceipt;
use Illuminate\Database\Eloquent\Collection;

class GoodsReceiptRepository implements GoodsReceiptRepositoryInterface
{
    public function all(): Collection
    {
        return GoodsReceipt::with(['purchaseOrder', 'supplier', 'items'])->get();
    }

    public function find(int \$id): ?GoodsReceipt
    {
        return GoodsReceipt::with(['purchaseOrder', 'supplier', 'items'])->find(\$id);
    }

    public function create(array \$data): GoodsReceipt
    {
        return GoodsReceipt::create(\$data);
    }

    public function update(int \$id, array \$data): bool
    {
        \$gr = \$this->find(\$id);
        if (\$gr) {
            return \$gr->update(\$data);
        }
        return false;
    }

    public function delete(int \$id): bool
    {
        \$gr = \$this->find(\$id);
        if (\$gr) {
            return \$gr->delete();
        }
        return false;
    }
}
PHP,

    // DTOs
    'DTO\\SupplierDTO' => <<<PHP
<?php
namespace App\Modules\Purchasing\DTO;

class SupplierDTO
{
    public function __construct(
        public readonly string \$code,
        public readonly string \$name,
        public readonly ?string \$email = null,
        public readonly ?string \$phone = null,
        public readonly ?string \$address = null,
        public readonly ?string \$tax_id = null,
        public readonly string \$status = 'Active'
    ) {}

    public static function fromArray(array \$data): self
    {
        return new self(
            code: \$data['code'],
            name: \$data['name'],
            email: \$data['email'] ?? null,
            phone: \$data['phone'] ?? null,
            address: \$data['address'] ?? null,
            tax_id: \$data['tax_id'] ?? null,
            status: \$data['status'] ?? 'Active'
        );
    }

    public function toArray(): array
    {
        return [
            'code' => \$this->code,
            'name' => \$this->name,
            'email' => \$this->email,
            'phone' => \$this->phone,
            'address' => \$this->address,
            'tax_id' => \$this->tax_id,
            'status' => \$this->status,
        ];
    }
}
PHP,
];

foreach (\$files as \$path => \$content) {
    \$fullPath = \$baseDir . '\\' . \$path . '.php';
    file_put_contents(\$fullPath, \$content);
}
echo "Generated core layer successfully.\n";
