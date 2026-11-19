<?php

declare(strict_types=1);

namespace App\Modules\Notification\Application\Ports;

use App\Modules\Notification\Domain\Entities\HospitalNotification;

interface NotificationSenderPort
{
    public function send(HospitalNotification $notification): bool;
}
