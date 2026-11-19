<?php

declare(strict_types=1);

namespace App\Modules\Pathology\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Pathology\Application\Ports\PathologyRepositoryPort;
use Illuminate\Http\JsonResponse;

final class PathologyController extends Controller
{
    public function __construct(private readonly PathologyRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Pathology',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
