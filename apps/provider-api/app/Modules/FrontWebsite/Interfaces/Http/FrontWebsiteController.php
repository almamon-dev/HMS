<?php

declare(strict_types=1);

namespace App\Modules\FrontWebsite\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\FrontWebsite\Application\Ports\CmsRepositoryPort;
use Illuminate\Http\JsonResponse;

final class FrontWebsiteController extends Controller
{
    public function __construct(private readonly CmsRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'FrontWebsite',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
