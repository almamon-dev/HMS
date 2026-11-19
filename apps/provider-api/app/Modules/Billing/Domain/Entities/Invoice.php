<?php

declare(strict_types=1);

namespace App\Modules\Billing\Domain\Entities;

use App\Modules\Billing\Domain\ValueObjects\InvoiceStatus;
use App\Modules\Billing\Domain\ValueObjects\InvoiceType;

final readonly class Invoice
{
    public function __construct(
        public string $id,
        public string $patientId,
        public InvoiceType $type,
        public int $totalAmountCents,
        public InvoiceStatus $status
    ) {}
}
