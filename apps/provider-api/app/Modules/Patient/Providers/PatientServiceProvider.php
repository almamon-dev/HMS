<?php

declare(strict_types=1);

namespace App\Modules\Patient\Providers;

use App\Modules\Patient\Application\Ports\PatientRepositoryPort;
use App\Modules\Patient\Infrastructure\Persistence\DatabasePatientRepository;
use Illuminate\Support\ServiceProvider;

final class PatientServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        PatientRepositoryPort::class => DatabasePatientRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
