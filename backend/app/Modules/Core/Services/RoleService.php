<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\Role;
use App\Modules\Core\DTO\RoleDTO;
use App\Modules\Core\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class RoleService
{
    public function __construct(
        private RoleRepositoryInterface $roleRepository
    ) {}

    public function getPaginatedRoles(int $perPage = 15): LengthAwarePaginator
    {
        return $this->roleRepository->paginate($perPage);
    }

    public function getAllRoles(): Collection
    {
        return $this->roleRepository->all();
    }

    public function getRoleById(int $id): ?Role
    {
        return $this->roleRepository->findById($id);
    }

    public function createRole(RoleDTO $dto): Role
    {
        return DB::transaction(function () use ($dto) {
            return $this->roleRepository->create($dto);
        });
    }

    public function updateRole(int $id, RoleDTO $dto): Role
    {
        $role = $this->roleRepository->findById($id);

        if (!$role) {
            throw new \Exception("Role not found");
        }

        return DB::transaction(function () use ($role, $dto) {
            return $this->roleRepository->update($role, $dto);
        });
    }

    public function deleteRole(int $id): bool
    {
        $role = $this->roleRepository->findById($id);

        if (!$role) {
            throw new \Exception("Role not found");
        }

        return $this->roleRepository->delete($role);
    }
}
