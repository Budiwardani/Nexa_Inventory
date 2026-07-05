<?php

namespace App\Modules\Core\Repositories\Eloquent;

use App\Modules\Core\Domain\Models\Permission;
use App\Modules\Core\Repositories\Contracts\PermissionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentPermissionRepository implements PermissionRepositoryInterface
{
    public function all(): Collection
    {
        return Permission::orderBy('module')->orderBy('name')->get();
    }

    public function findById(int $id): ?Permission
    {
        return Permission::find($id);
    }

    public function findByModule(string $module): Collection
    {
        return Permission::where('module', $module)->get();
    }
}
