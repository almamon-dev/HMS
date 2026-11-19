<?php

declare(strict_types=1);

namespace App\Modules\Opd\Application\Ports;

use App\Modules\Opd\Domain\Entities\OpdConsultation;

interface OpdRepositoryPort
{
    public function findById(string $id): ?OpdConsultation;

    public function save(OpdConsultation $entity): void;
}
