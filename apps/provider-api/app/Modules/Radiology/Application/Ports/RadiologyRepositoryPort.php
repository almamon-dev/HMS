<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Application\Ports;

use App\Modules\Radiology\Domain\Entities\RadiologyScan;

interface RadiologyRepositoryPort
{
    public function findById(string $id): ?RadiologyScan;

    public function save(RadiologyScan $entity): void;
}
