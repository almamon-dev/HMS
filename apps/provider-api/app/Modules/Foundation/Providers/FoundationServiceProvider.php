<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Providers;

use App\Modules\Foundation\Application\Ports\Clock;
use App\Modules\Foundation\Application\Ports\IdGenerator;
use App\Modules\Foundation\Infrastructure\SystemClock;
use App\Modules\Foundation\Infrastructure\UuidV7Generator;
use Illuminate\Support\ServiceProvider;

final class FoundationServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        Clock::class => SystemClock::class,
        IdGenerator::class => UuidV7Generator::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
