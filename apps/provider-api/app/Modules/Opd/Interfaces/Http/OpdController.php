<?php

declare(strict_types=1);

namespace App\Modules\Opd\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Opd\Application\Ports\OpdRepositoryPort;
use Illuminate\Http\JsonResponse;

final class OpdController extends Controller
{
    public function __construct(private readonly OpdRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Opd',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
