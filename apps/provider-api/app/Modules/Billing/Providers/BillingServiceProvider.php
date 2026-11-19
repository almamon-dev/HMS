<?php

declare(strict_types=1);

namespace App\Modules\Billing\Providers;

use App\Modules\Billing\Application\Ports\BillingRepositoryPort;
use App\Modules\Billing\Infrastructure\Persistence\DatabaseBillingRepository;
use Illuminate\Support\ServiceProvider;

final class BillingServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        BillingRepositoryPort::class => DatabaseBillingRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
