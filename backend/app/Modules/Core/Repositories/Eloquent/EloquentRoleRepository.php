<?php

namespace App\Modules\Core\Repositories\Eloquent;

use App\Modules\Core\Domain\Models\Role;
use App\Modules\Core\DTO\RoleDTO;
use App\Modules\Core\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentRoleRepository implements RoleRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Role::with('permissions')->paginate($perPage);
    }

    public function findById(int $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    public function create(RoleDTO $dto): Role
    {
        $role = Role::create([
            'name' => $dto->name,
            'description' => $dto->description,
        ]);

        if (!empty($dto->permissions)) {
            $role->permissions()->sync($dto->permissions);
        }

        return $role->load('permissions');
    }

    public function update(Role $role, RoleDTO $dto): Role
    {
        $role->update([
            'name' => $dto->name,
            'description' => $dto->description,
        ]);

        if ($dto->permissions !== null) {
            $role->permissions()->sync($dto->permissions);
        }

        return $role->load('permissions');
    }

    public function delete(Role $role): bool
    {
        return $role->delete();
    }

    public function all(): Collection
    {
        return Role::with('permissions')->get();
    }
}
