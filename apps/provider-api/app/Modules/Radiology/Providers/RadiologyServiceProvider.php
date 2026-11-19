<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Providers;

use App\Modules\Radiology\Application\Ports\RadiologyRepositoryPort;
use App\Modules\Radiology\Infrastructure\Persistence\DatabaseRadiologyRepository;
use Illuminate\Support\ServiceProvider;

final class RadiologyServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        RadiologyRepositoryPort::class => DatabaseRadiologyRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
