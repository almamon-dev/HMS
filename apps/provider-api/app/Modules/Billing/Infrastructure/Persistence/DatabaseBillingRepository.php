<?php

declare(strict_types=1);

namespace App\Modules\Billing\Infrastructure\Persistence;

use App\Modules\Billing\Application\Ports\BillingRepositoryPort;
use App\Modules\Billing\Domain\Entities\Invoice;

final class DatabaseBillingRepository implements BillingRepositoryPort
{
    public function findById(string $id): ?Invoice
    {
        return null;
    }

    public function save(Invoice $entity): void {}
}
