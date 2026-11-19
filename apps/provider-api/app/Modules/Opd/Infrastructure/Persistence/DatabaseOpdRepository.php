<?php

declare(strict_types=1);

namespace App\Modules\Opd\Infrastructure\Persistence;

use App\Modules\Opd\Application\Ports\OpdRepositoryPort;
use App\Modules\Opd\Domain\Entities\OpdConsultation;

final class DatabaseOpdRepository implements OpdRepositoryPort
{
    public function findById(string $id): ?OpdConsultation
    {
        return null;
    }

    public function save(OpdConsultation $entity): void {}
}
