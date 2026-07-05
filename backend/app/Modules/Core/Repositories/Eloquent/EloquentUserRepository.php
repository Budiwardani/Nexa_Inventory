<?php

namespace App\Modules\Core\Repositories\Eloquent;

use App\Modules\Core\Domain\Models\User;
use App\Modules\Core\DTO\UserDTO;
use App\Modules\Core\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = User::with(['branch', 'roles']);

        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?User
    {
        return User::with(['branch', 'roles'])->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(UserDTO $dto): User
    {
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'branch_id' => $dto->branchId,
        ]);

        if (!empty($dto->roles)) {
            $user->roles()->sync($dto->roles);
        }

        return $user->load('roles');
    }

    public function update(User $user, UserDTO $dto): User
    {
        $data = [
            'name' => $dto->name,
            'email' => $dto->email,
            'branch_id' => $dto->branchId,
        ];

        if (!empty($dto->password)) {
            $data['password'] = Hash::make($dto->password);
        }

        $user->update($data);

        if ($dto->roles !== null) {
            $user->roles()->sync($dto->roles);
        }

        return $user->load('roles');
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}
