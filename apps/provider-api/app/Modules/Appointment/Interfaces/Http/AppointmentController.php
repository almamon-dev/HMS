<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Appointment\Application\Ports\AppointmentRepositoryPort;
use Illuminate\Http\JsonResponse;

final class AppointmentController extends Controller
{
    public function __construct(private readonly AppointmentRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Appointment',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
