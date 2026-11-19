<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Domain\ValueObjects;

enum AppointmentStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case IN_CONSULTATION = 'in_consultation';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}
