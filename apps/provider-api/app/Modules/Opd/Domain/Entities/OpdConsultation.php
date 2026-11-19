<?php

declare(strict_types=1);

namespace App\Modules\Opd\Domain\Entities;

use App\Modules\Opd\Domain\ValueObjects\OpdStatus;

final readonly class OpdConsultation
{
    public function __construct(
        public string $id,
        public string $patientId,
        public string $doctorId,
        public string $symptoms,
        public string $diagnosis,
        public OpdStatus $status
    ) {}
}
