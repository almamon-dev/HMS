<?php

declare(strict_types=1);

namespace App\Modules\Notification\Providers;

use App\Modules\Notification\Application\Ports\NotificationSenderPort;
use App\Modules\Notification\Infrastructure\Persistence\LogNotificationSender;
use Illuminate\Support\ServiceProvider;

final class NotificationServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        NotificationSenderPort::class => LogNotificationSender::class,
    ];

    public function register(): void {}

    public function boot(): void {}
}
