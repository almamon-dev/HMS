<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Pharmacy\Application\Ports\PharmacyRepositoryPort;
use Illuminate\Http\JsonResponse;

final class PharmacyController extends Controller
{
    public function __construct(private readonly PharmacyRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Pharmacy',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
