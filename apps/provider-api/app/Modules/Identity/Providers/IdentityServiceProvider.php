<?php

declare(strict_types=1);

namespace App\Modules\Identity\Providers;

use App\Modules\Identity\Application\Ports\UserRepositoryPort;
use App\Modules\Identity\Infrastructure\Persistence\DatabaseIdentityRepository;
use Illuminate\Support\ServiceProvider;

final class IdentityServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        UserRepositoryPort::class => DatabaseIdentityRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
