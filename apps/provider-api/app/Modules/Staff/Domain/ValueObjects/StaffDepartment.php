<?php

declare(strict_types=1);

namespace App\Modules\Staff\Domain\ValueObjects;

enum StaffDepartment: string
{
    case MEDICAL = 'medical';
    case NURSING = 'nursing';
    case PHARMACY = 'pharmacy';
    case LABORATORY = 'laboratory';
    case RADIOLOGY = 'radiology';
    case FINANCE = 'finance';
    case RECEPTION = 'reception';
}
