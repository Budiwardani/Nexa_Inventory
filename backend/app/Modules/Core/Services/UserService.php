<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\User;
use App\Modules\Core\DTO\UserDTO;
use App\Modules\Core\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function getPaginatedUsers(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->userRepository->paginate($perPage, $filters);
    }

    public function getUserById(int $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    public function createUser(UserDTO $dto): User
    {
        return DB::transaction(function () use ($dto) {
            return $this->userRepository->create($dto);
        });
    }

    public function updateUser(int $id, UserDTO $dto): User
    {
        $user = $this->userRepository->findById($id);
        
        if (!$user) {
            throw new \Exception("User not found");
        }

        return DB::transaction(function () use ($user, $dto) {
            return $this->userRepository->update($user, $dto);
        });
    }

    public function deleteUser(int $id): bool
    {
        $user = $this->userRepository->findById($id);
        
        if (!$user) {
            throw new \Exception("User not found");
        }

        return $this->userRepository->delete($user);
    }
}
