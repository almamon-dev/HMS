<?php

declare(strict_types=1);

namespace App\Modules\Staff\Domain\Entities;

use App\Modules\Staff\Domain\ValueObjects\StaffDepartment;
use App\Modules\Staff\Domain\ValueObjects\StaffStatus;

final readonly class StaffMember
{
    public function __construct(
        public string $id,
        public string $fullName,
        public string $specialization,
        public StaffDepartment $department,
        public StaffStatus $status
    ) {}
}
