<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Application\Ports;

use App\Modules\Appointment\Domain\Entities\AppointmentBooking;

interface AppointmentRepositoryPort
{
    public function findById(string $id): ?AppointmentBooking;

    public function save(AppointmentBooking $entity): void;
}
