<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Providers;

use App\Modules\Appointment\Application\Ports\AppointmentRepositoryPort;
use App\Modules\Appointment\Infrastructure\Persistence\DatabaseAppointmentRepository;
use Illuminate\Support\ServiceProvider;

final class AppointmentServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        AppointmentRepositoryPort::class => DatabaseAppointmentRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
