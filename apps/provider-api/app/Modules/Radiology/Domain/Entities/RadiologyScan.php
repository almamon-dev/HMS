<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Domain\Entities;

use App\Modules\Radiology\Domain\ValueObjects\ScanStatus;
use App\Modules\Radiology\Domain\ValueObjects\ScanType;

final readonly class RadiologyScan
{
    public function __construct(
        public string $id,
        public string $patientId,
        public ScanType $scanType,
        public string $bodyPart,
        public ScanStatus $status
    ) {}
}
