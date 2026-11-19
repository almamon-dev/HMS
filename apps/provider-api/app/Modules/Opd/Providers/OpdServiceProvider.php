<?php

declare(strict_types=1);

namespace App\Modules\Opd\Providers;

use App\Modules\Opd\Application\Ports\OpdRepositoryPort;
use App\Modules\Opd\Infrastructure\Persistence\DatabaseOpdRepository;
use Illuminate\Support\ServiceProvider;

final class OpdServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        OpdRepositoryPort::class => DatabaseOpdRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
