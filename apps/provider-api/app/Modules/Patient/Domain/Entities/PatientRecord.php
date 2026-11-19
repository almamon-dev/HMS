<?php

declare(strict_types=1);

namespace App\Modules\Patient\Domain\Entities;

use App\Modules\Patient\Domain\ValueObjects\BloodGroup;
use App\Modules\Patient\Domain\ValueObjects\Gender;

final readonly class PatientRecord
{
    public function __construct(
        public string $id,
        public string $patientCode,
        public string $fullName,
        public string $phone,
        public Gender $gender,
        public BloodGroup $bloodGroup
    ) {}
}
