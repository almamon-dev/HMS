<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Providers;

use App\Modules\Pharmacy\Application\Ports\PharmacyRepositoryPort;
use App\Modules\Pharmacy\Infrastructure\Persistence\DatabasePharmacyRepository;
use Illuminate\Support\ServiceProvider;

final class PharmacyServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        PharmacyRepositoryPort::class => DatabasePharmacyRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
