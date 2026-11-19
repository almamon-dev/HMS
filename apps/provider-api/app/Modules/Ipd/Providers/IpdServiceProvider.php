<?php

declare(strict_types=1);

namespace App\Modules\Ipd\Providers;

use App\Modules\Ipd\Application\Ports\IpdRepositoryPort;
use App\Modules\Ipd\Infrastructure\Persistence\DatabaseIpdRepository;
use Illuminate\Support\ServiceProvider;

final class IpdServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        IpdRepositoryPort::class => DatabaseIpdRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
