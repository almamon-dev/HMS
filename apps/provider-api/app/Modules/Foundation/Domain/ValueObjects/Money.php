<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Domain\ValueObjects;

use App\Modules\Foundation\Domain\Exceptions\DomainException;

final readonly class Money
{
    public function __construct(
        public int $amountInCents,
        public string $currency = 'BDT'
    ) {
        if ($this->amountInCents < 0) {
            throw new DomainException('Money amount cannot be negative.');
        }

        if (strlen($this->currency) !== 3) {
            throw new DomainException("Invalid currency code '{$this->currency}'. Must be 3 characters.");
        }
    }

    public static function fromMajorUnits(float|int $amount, string $currency = 'BDT'): self
    {
        return new self((int) round($amount * 100), strtoupper($currency));
    }

    public function toMajorUnits(): float
    {
        return $this->amountInCents / 100;
    }

    public function add(self $other): self
    {
        $this->ensureSameCurrency($other);

        return new self($this->amountInCents + $other->amountInCents, $this->currency);
    }

    public function subtract(self $other): self
    {
        $this->ensureSameCurrency($other);

        return new self($this->amountInCents - $other->amountInCents, $this->currency);
    }

    private function ensureSameCurrency(self $other): void
    {
        if ($this->currency !== $other->currency) {
            throw new DomainException("Cannot operate on different currencies: {$this->currency} and {$other->currency}.");
        }
    }
}
