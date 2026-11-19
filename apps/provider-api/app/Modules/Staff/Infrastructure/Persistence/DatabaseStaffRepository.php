<?php

declare(strict_types=1);

namespace App\Modules\Staff\Infrastructure\Persistence;

use App\Modules\Staff\Application\Ports\StaffRepositoryPort;
use App\Modules\Staff\Domain\Entities\StaffMember;

final class DatabaseStaffRepository implements StaffRepositoryPort
{
    public function findById(string $id): ?StaffMember
    {
        return null;
    }

    public function save(StaffMember $entity): void {}
}
