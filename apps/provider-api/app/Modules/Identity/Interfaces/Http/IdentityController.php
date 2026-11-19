<?php

declare(strict_types=1);

namespace App\Modules\Identity\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Identity\Application\Ports\UserRepositoryPort;
use Illuminate\Http\JsonResponse;

final class IdentityController extends Controller
{
    public function __construct(private readonly UserRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Identity',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
