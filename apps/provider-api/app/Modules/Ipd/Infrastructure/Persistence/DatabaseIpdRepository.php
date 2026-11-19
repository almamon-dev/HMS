<?php

declare(strict_types=1);

namespace App\Modules\Ipd\Infrastructure\Persistence;

use App\Modules\Ipd\Application\Ports\IpdRepositoryPort;
use App\Modules\Ipd\Domain\Entities\IpdAdmission;

final class DatabaseIpdRepository implements IpdRepositoryPort
{
    public function findById(string $id): ?IpdAdmission
    {
        return null;
    }

    public function save(IpdAdmission $entity): void {}
}
