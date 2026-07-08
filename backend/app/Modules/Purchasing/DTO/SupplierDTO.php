<?php
namespace App\Modules\Purchasing\DTO;

class SupplierDTO
{
    public function __construct(
        public readonly string $code,
        public readonly string $name,
        public readonly ?string $email = null,
        public readonly ?string $phone = null,
        public readonly ?string $address = null,
        public readonly ?string $tax_id = null,
        public readonly string $status = 'Active'
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            code: $data['code'],
            name: $data['name'],
            email: $data['email'] ?? null,
            phone: $data['phone'] ?? null,
            address: $data['address'] ?? null,
            tax_id: $data['tax_id'] ?? null,
            status: $data['status'] ?? 'Active'
        );
    }

    public function toArray(): array
    {
        return [
            'code' => $this->code,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'tax_id' => $this->tax_id,
            'status' => $this->status,
        ];
    }
}
