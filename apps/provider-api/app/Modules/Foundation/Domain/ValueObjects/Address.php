<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Domain\ValueObjects;

use App\Modules\Foundation\Domain\Exceptions\DomainException;

final readonly class Address
{
    public function __construct(
        public string $street,
        public string $city,
        public string $state,
        public string $postalCode,
        public string $country = 'BD'
    ) {
        if (trim($this->street) === '') {
            throw new DomainException('Street cannot be empty.');
        }
        if (trim($this->city) === '') {
            throw new DomainException('City cannot be empty.');
        }
    }

    public function toFormattedString(): string
    {
        return implode(', ', array_filter([
            $this->street,
            $this->city,
            $this->state,
            $this->postalCode,
            $this->country,
        ]));
    }
}
