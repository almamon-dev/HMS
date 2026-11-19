<?php

declare(strict_types=1);

namespace App\Modules\Ipd\Domain\Entities;

use App\Modules\Ipd\Domain\ValueObjects\IpdStatus;

final readonly class IpdAdmission
{
    public function __construct(
        public string $id,
        public string $patientId,
        public string $wardNumber,
        public string $bedNumber,
        public string $admittedAt,
        public IpdStatus $status
    ) {}
}
