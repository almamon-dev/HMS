<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Application\Ports;

use App\Modules\Pharmacy\Domain\Entities\MedicineItem;

interface PharmacyRepositoryPort
{
    public function findById(string $id): ?MedicineItem;

    public function save(MedicineItem $entity): void;
}
