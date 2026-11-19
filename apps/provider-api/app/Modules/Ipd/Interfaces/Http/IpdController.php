<?php

declare(strict_types=1);

namespace App\Modules\Ipd\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Ipd\Application\Ports\IpdRepositoryPort;
use Illuminate\Http\JsonResponse;

final class IpdController extends Controller
{
    public function __construct(private readonly IpdRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Ipd',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
