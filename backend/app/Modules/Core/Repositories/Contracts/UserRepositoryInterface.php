<?php

namespace App\Modules\Core\Repositories\Contracts;

use App\Modules\Core\Domain\Models\User;
use App\Modules\Core\DTO\UserDTO;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;
    
    public function findById(int $id): ?User;
    
    public function findByEmail(string $email): ?User;
    
    public function create(UserDTO $dto): User;
    
    public function update(User $user, UserDTO $dto): User;
    
    public function delete(User $user): bool;
}
