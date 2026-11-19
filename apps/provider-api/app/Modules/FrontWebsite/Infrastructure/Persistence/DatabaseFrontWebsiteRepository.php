<?php

declare(strict_types=1);

namespace App\Modules\FrontWebsite\Infrastructure\Persistence;

use App\Modules\FrontWebsite\Application\Ports\CmsRepositoryPort;
use App\Modules\FrontWebsite\Domain\Entities\CmsPage;

final class DatabaseFrontWebsiteRepository implements CmsRepositoryPort
{
    public function findById(string $id): ?CmsPage
    {
        return null;
    }

    public function save(CmsPage $entity): void {}
}
