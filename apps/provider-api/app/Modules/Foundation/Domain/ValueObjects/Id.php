<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Domain\ValueObjects;

use App\Modules\Foundation\Domain\Exceptions\DomainException;
use Stringable;

final readonly class Id implements Stringable
{
    public function __construct(public string $value)
    {
        if (trim($this->value) === '') {
            throw new DomainException('Identifier cannot be empty.');
        }
    }

    public static function from(string $value): self
    {
        return new self($value);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
