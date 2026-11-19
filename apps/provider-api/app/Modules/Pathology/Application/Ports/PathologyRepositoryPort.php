<?php

declare(strict_types=1);

namespace App\Modules\Pathology\Application\Ports;

use App\Modules\Pathology\Domain\Entities\PathologyTest;

interface PathologyRepositoryPort
{
    public function findById(string $id): ?PathologyTest;

    public function save(PathologyTest $entity): void;
}
