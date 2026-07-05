<?php

namespace App\Modules\Core\Repositories\Contracts;

use App\Modules\Core\Domain\Models\Permission;
use Illuminate\Database\Eloquent\Collection;

interface PermissionRepositoryInterface
{
    public function all(): Collection;

    public function findById(int $id): ?Permission;

    public function findByModule(string $module): Collection;
}
