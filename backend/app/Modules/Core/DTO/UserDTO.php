<?php

namespace App\Modules\Core\DTO;

readonly class UserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?int $branchId = null,
        public ?array $roles = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'] ?? '',
            branchId: $data['branch_id'] ?? null,
            roles: $data['roles'] ?? [],
        );
    }
}
