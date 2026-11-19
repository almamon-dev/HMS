<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Domain\ValueObjects;

enum MedicineCategory: string
{
    case TABLET = 'tablet';
    case CAPSULE = 'capsule';
    case SYRUP = 'syrup';
    case INJECTION = 'injection';
    case DROPS = 'drops';
}
