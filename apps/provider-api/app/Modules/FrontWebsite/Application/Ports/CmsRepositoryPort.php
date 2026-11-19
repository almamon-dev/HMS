<?php

declare(strict_types=1);

namespace App\Modules\FrontWebsite\Application\Ports;

use App\Modules\FrontWebsite\Domain\Entities\CmsPage;

interface CmsRepositoryPort
{
    public function findById(string $id): ?CmsPage;

    public function save(CmsPage $entity): void;
}
