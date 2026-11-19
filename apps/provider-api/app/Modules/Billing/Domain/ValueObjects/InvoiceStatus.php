<?php

declare(strict_types=1);

namespace App\Modules\Billing\Domain\ValueObjects;

enum InvoiceStatus: string
{
    case UNPAID = 'unpaid';
    case PARTIALLY_PAID = 'partially_paid';
    case PAID = 'paid';
}
