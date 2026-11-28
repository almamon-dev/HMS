<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyAuditLogModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PharmacyAuditLogController extends Controller
{
    /**
     * List audit logs with pagination and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PharmacyAuditLogModel::with([
            'user:id,name,email,role',
            'staff:id,employee_id,full_name',
            'branch:id,code,name',
        ]);

        // Search by action or IP or entity_id
        if ($search = $request->query('search')) {
            $search = trim((string) $search);
            $query->where(function ($q) use ($search) {
                $q->where('action', 'ilike', "%{$search}%")
                    ->orWhere('entity_id', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        // Filter by module
        if ($module = $request->query('module')) {
            if ($module !== 'all') {
                $query->where('module', $module);
            }
        }

        // Filter by specific staff member
        if ($staffId = $request->query('staff_id')) {
            $query->where('staff_id', $staffId);
        }

        $perPage = min(100, max(5, (int) $request->query('per_page', 20)));
        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return new JsonResponse([
            'success' => true,
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }
}

