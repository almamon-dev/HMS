<?php

declare(strict_types=1);

namespace App\Modules\Billing\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Application\Ports\BillingRepositoryPort;
use Illuminate\Http\JsonResponse;

final class BillingController extends Controller
{
    public function __construct(private readonly BillingRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Billing',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
