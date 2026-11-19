<?php

declare(strict_types=1);

namespace App\Modules\Staff\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Application\Ports\StaffRepositoryPort;
use Illuminate\Http\JsonResponse;

final class StaffController extends Controller
{
    public function __construct(private readonly StaffRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Staff',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
