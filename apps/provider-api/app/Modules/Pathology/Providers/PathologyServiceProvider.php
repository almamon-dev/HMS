<?php

declare(strict_types=1);

namespace App\Modules\Pathology\Providers;

use App\Modules\Pathology\Application\Ports\PathologyRepositoryPort;
use App\Modules\Pathology\Infrastructure\Persistence\DatabasePathologyRepository;
use Illuminate\Support\ServiceProvider;

final class PathologyServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        PathologyRepositoryPort::class => DatabasePathologyRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
