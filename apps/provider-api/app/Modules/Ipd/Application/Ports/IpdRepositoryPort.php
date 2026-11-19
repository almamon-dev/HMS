<?php

declare(strict_types=1);

namespace App\Modules\Ipd\Application\Ports;

use App\Modules\Ipd\Domain\Entities\IpdAdmission;

interface IpdRepositoryPort
{
    public function findById(string $id): ?IpdAdmission;

    public function save(IpdAdmission $entity): void;
}
