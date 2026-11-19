<?php

declare(strict_types=1);

namespace App\Modules\Patient\Application\Ports;

use App\Modules\Patient\Domain\Entities\PatientRecord;

interface PatientRepositoryPort
{
    public function findById(string $id): ?PatientRecord;

    public function save(PatientRecord $entity): void;
}
