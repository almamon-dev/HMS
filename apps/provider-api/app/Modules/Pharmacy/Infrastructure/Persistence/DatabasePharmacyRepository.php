<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Infrastructure\Persistence;

use App\Modules\Pharmacy\Application\Ports\PharmacyRepositoryPort;
use App\Modules\Pharmacy\Domain\Entities\MedicineItem;

final class DatabasePharmacyRepository implements PharmacyRepositoryPort
{
    public function findById(string $id): ?MedicineItem
    {
        return null;
    }

    public function save(MedicineItem $entity): void {}
}
