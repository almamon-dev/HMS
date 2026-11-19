<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Domain\ValueObjects;

use App\Modules\Foundation\Domain\Exceptions\DomainException;

final readonly class GeoLocation
{
    public function __construct(
        public float $latitude,
        public float $longitude
    ) {
        if ($this->latitude < -90.0 || $this->latitude > 90.0) {
            throw new DomainException("Invalid latitude: {$this->latitude}. Must be between -90 and 90.");
        }

        if ($this->longitude < -180.0 || $this->longitude > 180.0) {
            throw new DomainException("Invalid longitude: {$this->longitude}. Must be between -180 and 180.");
        }
    }

    public static function of(float $latitude, float $longitude): self
    {
        return new self($latitude, $longitude);
    }
}
