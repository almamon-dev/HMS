<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Domain\ValueObjects;

enum ScanType: string
{
    case X_RAY = 'x_ray';
    case CT_SCAN = 'ct_scan';
    case MRI = 'mri';
    case ULTRASONOGRAM = 'ultrasonogram';
}
