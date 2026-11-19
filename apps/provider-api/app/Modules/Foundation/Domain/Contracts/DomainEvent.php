<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Domain\Contracts;

use DateTimeImmutable;

interface DomainEvent
{
    public function occurredAt(): DateTimeImmutable;

    public function eventName(): string;
}
