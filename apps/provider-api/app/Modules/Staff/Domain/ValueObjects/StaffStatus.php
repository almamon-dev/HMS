<?php

declare(strict_types=1);

namespace App\Modules\Staff\Domain\ValueObjects;

enum StaffStatus: string
{
    case ACTIVE = 'active';
    case ON_LEAVE = 'on_leave';
    case TERMINATED = 'terminated';
}
