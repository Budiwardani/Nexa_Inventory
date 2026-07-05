<?php

namespace App\Modules\Core\DTO;

readonly class BranchDTO
{
    public function __construct(
        public int $companyId,
        public string $name,
        public string $code,
        public ?string $address = null,
        public ?string $phone = null,
        public ?string $email = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            companyId: $data['company_id'],
            name: $data['name'],
            code: $data['code'],
            address: $data['address'] ?? null,
            phone: $data['phone'] ?? null,
            email: $data['email'] ?? null,
        );
    }
}
