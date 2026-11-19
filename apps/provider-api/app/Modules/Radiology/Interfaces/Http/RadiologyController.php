<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Radiology\Application\Ports\RadiologyRepositoryPort;
use Illuminate\Http\JsonResponse;

final class RadiologyController extends Controller
{
    public function __construct(private readonly RadiologyRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Radiology',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
