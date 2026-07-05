<?php

namespace App\Modules\Core\Repositories\Contracts;

use App\Modules\Core\Domain\Models\Role;
use App\Modules\Core\DTO\RoleDTO;
use Illuminate\Pagination\LengthAwarePaginator;

interface RoleRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Role;

    public function create(RoleDTO $dto): Role;

    public function update(Role $role, RoleDTO $dto): Role;

    public function delete(Role $role): bool;

    public function all(): \Illuminate\Database\Eloquent\Collection;
}
