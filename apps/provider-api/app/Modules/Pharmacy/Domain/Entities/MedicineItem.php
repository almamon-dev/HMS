<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Domain\Entities;

use App\Modules\Pharmacy\Domain\ValueObjects\MedicineCategory;

final readonly class MedicineItem
{
    public function __construct(
        public string $id,
        public string $genericName,
        public string $brandName,
        public MedicineCategory $category,
        public int $stockQuantity,
        public int $unitPriceCents
    ) {}
}
