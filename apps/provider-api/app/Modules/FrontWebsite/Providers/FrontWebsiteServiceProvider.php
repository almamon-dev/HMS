<?php

declare(strict_types=1);

namespace App\Modules\FrontWebsite\Providers;

use App\Modules\FrontWebsite\Application\Ports\CmsRepositoryPort;
use App\Modules\FrontWebsite\Infrastructure\Persistence\DatabaseFrontWebsiteRepository;
use Illuminate\Support\ServiceProvider;

final class FrontWebsiteServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        CmsRepositoryPort::class => DatabaseFrontWebsiteRepository::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
