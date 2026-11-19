<?php

declare(strict_types=1);

namespace App\Modules\Patient\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Patient\Application\Ports\PatientRepositoryPort;
use Illuminate\Http\JsonResponse;

final class PatientController extends Controller
{
    public function __construct(private readonly PatientRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Patient',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
