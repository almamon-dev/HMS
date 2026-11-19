<?php

declare(strict_types=1);

namespace App\Modules\Opd\Domain\ValueObjects;

enum OpdStatus: string
{
    case WAITING = 'waiting';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
}
