<?php

declare(strict_types=1);

namespace App\Modules\Notification\Domain\Entities;

use App\Modules\Notification\Domain\ValueObjects\NotificationType;

final readonly class HospitalNotification
{
    public function __construct(
        public string $id,
        public string $recipientPhone,
        public NotificationType $type,
        public string $messageContent
    ) {}
}
