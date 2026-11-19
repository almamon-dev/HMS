<?php

declare(strict_types=1);

namespace App\Modules\Patient\Infrastructure\Persistence;

use App\Modules\Patient\Application\Ports\PatientRepositoryPort;
use App\Modules\Patient\Domain\Entities\PatientRecord;

final class DatabasePatientRepository implements PatientRepositoryPort
{
    public function findById(string $id): ?PatientRecord
    {
        return null;
    }

    public function save(PatientRecord $entity): void {}
}
