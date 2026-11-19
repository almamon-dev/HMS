<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Domain\Entities;

use App\Modules\Appointment\Domain\ValueObjects\AppointmentStatus;

final readonly class AppointmentBooking
{
    public function __construct(
        public string $id,
        public string $patientId,
        public string $doctorId,
        public string $appointmentDate,
        public int $serialNumber,
        public AppointmentStatus $status
    ) {}
}
