<?php

namespace App\Modules\Core\DTO;

readonly class RoleDTO
{
    public function __construct(
        public string $name,
        public ?string $description = null,
        public ?array $permissions = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['description'] ?? null,
            permissions: $data['permissions'] ?? [],
        );
    }
}
