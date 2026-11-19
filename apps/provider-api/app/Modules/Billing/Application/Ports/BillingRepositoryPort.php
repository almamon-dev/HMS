<?php

declare(strict_types=1);

namespace App\Modules\Billing\Application\Ports;

use App\Modules\Billing\Domain\Entities\Invoice;

interface BillingRepositoryPort
{
    public function findById(string $id): ?Invoice;

    public function save(Invoice $entity): void;
}
