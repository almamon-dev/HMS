<?php

declare(strict_types=1);

namespace App\Modules\FrontWebsite\Domain\Entities;

use App\Modules\FrontWebsite\Domain\ValueObjects\PageType;

final readonly class CmsPage
{
    public function __construct(
        public string $id,
        public string $slug,
        public string $title,
        public PageType $type,
        public bool $isPublished
    ) {}
}
