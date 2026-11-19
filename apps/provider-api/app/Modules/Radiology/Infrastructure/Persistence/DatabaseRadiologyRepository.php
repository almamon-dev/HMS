<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Infrastructure\Persistence;

use App\Modules\Radiology\Application\Ports\RadiologyRepositoryPort;
use App\Modules\Radiology\Domain\Entities\RadiologyScan;

final class DatabaseRadiologyRepository implements RadiologyRepositoryPort
{
    public function findById(string $id): ?RadiologyScan
    {
        return null;
    }

    public function save(RadiologyScan $entity): void {}
}
