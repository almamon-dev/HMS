<?php

declare(strict_types=1);

namespace App\Modules\Notification\Domain\ValueObjects;

enum NotificationType: string
{
    case APPOINTMENT_ALERT = 'appointment_alert';
    case LAB_REPORT_READY = 'lab_report_ready';
    case DISCHARGE_SUMMARY = 'discharge_summary';
}
