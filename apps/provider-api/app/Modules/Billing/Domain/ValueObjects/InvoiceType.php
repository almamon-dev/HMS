<?php

declare(strict_types=1);

namespace App\Modules\Billing\Domain\ValueObjects;

enum InvoiceType: string
{
    case OPD = 'opd';
    case IPD = 'ipd';
    case PHARMACY = 'pharmacy';
    case PATHOLOGY = 'pathology';
    case RADIOLOGY = 'radiology';
}
