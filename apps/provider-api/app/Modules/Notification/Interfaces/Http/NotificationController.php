<?php

declare(strict_types=1);

namespace App\Modules\Notification\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Notification\Application\Ports\NotificationSenderPort;
use Illuminate\Http\JsonResponse;

final class NotificationController extends Controller
{
    public function __construct(private readonly NotificationSenderPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Notification',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }
}
