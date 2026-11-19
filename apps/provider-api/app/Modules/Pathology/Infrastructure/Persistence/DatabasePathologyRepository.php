<?php

declare(strict_types=1);

namespace App\Modules\Pathology\Infrastructure\Persistence;

use App\Modules\Pathology\Application\Ports\PathologyRepositoryPort;
use App\Modules\Pathology\Domain\Entities\PathologyTest;

final class DatabasePathologyRepository implements PathologyRepositoryPort
{
    public function findById(string $id): ?PathologyTest
    {
        return null;
    }

    public function save(PathologyTest $entity): void {}
}
