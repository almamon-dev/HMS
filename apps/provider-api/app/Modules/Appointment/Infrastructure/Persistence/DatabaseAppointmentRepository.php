<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Infrastructure\Persistence;

use App\Modules\Appointment\Application\Ports\AppointmentRepositoryPort;
use App\Modules\Appointment\Domain\Entities\AppointmentBooking;

final class DatabaseAppointmentRepository implements AppointmentRepositoryPort
{
    public function findById(string $id): ?AppointmentBooking
    {
        return null;
    }

    public function save(AppointmentBooking $entity): void {}
}
