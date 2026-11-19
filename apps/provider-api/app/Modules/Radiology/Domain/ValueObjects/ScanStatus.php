<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Domain\ValueObjects;

enum ScanStatus: string
{
    case ORDERED = 'ordered';
    case ACQUIRED = 'acquired';
    case REPORTED = 'reported';
}
