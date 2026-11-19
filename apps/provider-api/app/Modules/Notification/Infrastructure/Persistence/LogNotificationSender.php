<?php

declare(strict_types=1);

namespace App\Modules\Notification\Infrastructure\Persistence;

use App\Modules\Notification\Application\Ports\NotificationSenderPort;
use App\Modules\Notification\Domain\Entities\HospitalNotification;
use Illuminate\Support\Facades\Log;

final class LogNotificationSender implements NotificationSenderPort
{
    public function send(HospitalNotification $notification): bool
    {
        Log::info("Hospital notification sent to {$notification->recipientPhone}");

        return true;
    }
}
