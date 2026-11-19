<?php

declare(strict_types=1);

namespace App\Modules\Staff\Application\Ports;

use App\Modules\Staff\Domain\Entities\StaffMember;

interface StaffRepositoryPort
{
    public function findById(string $id): ?StaffMember;

    public function save(StaffMember $entity): void;
}
