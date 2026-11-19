<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Infrastructure;

use App\Modules\Foundation\Application\Ports\Clock;
use DateTimeImmutable;
use DateTimeZone;

final readonly class SystemClock implements Clock
{
    public function __construct(private string $timezone = 'Asia/Dhaka') {}

    public function now(): DateTimeImmutable
    {
        return new DateTimeImmutable('now', new DateTimeZone($this->timezone));
    }
}
