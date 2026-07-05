<?php

namespace App\Modules\Core\DTO;

readonly class CompanyDTO
{
    public function __construct(
        public string $name,
        public string $code,
        public ?string $address = null,
        public ?string $phone = null,
        public ?string $email = null,
        public ?string $website = null,
        public ?string $taxNumber = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            code: $data['code'],
            address: $data['address'] ?? null,
            phone: $data['phone'] ?? null,
            email: $data['email'] ?? null,
            website: $data['website'] ?? null,
            taxNumber: $data['tax_number'] ?? null,
        );
    }
}
