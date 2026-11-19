<?php

declare(strict_types=1);

namespace App\Modules\Staff\Providers;

use App\Modules\Staff\Application\Ports\StaffRepositoryPort;
use App\Modules\Staff\Infrastructure\Persistence\DatabaseStaffRepository;
use Illuminate\Support\ServiceProvider;

final class StaffServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        StaffRepositoryPort::class => DatabaseStaffRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
