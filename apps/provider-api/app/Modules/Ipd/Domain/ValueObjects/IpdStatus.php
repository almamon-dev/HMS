<?php

declare(strict_types=1);

namespace App\Modules\Ipd\Domain\ValueObjects;

enum IpdStatus: string
{
    case ADMITTED = 'admitted';
    case TRANSFERRED = 'transferred';
    case DISCHARGED = 'discharged';
}
