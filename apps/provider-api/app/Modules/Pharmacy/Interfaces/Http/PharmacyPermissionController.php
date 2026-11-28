<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyPermissionModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyStaffModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PharmacyPermissionController extends Controller
{
    /**
     * List all granular permissions grouped by module.
     */
    public function index(): JsonResponse
    {
        $permissions = PharmacyPermissionModel::orderBy('module')->orderBy('id')->get();
        $grouped = $permissions->groupBy('module');

        $moduleLabels = [
            'dispense_queue' => 'Dispense Queue',
            'ward_indents' => 'Ward Indents',
            'narcotics' => 'Narcotics Register',
            'returns' => 'Returns & Refunds',
            'purchases' => 'Purchase Orders',
            'inventory' => 'Inventory & Stock',
            'sales' => 'Sales & Reports',
            'staff' => 'Staff Management',
        ];

        $result = [];
        foreach ($grouped as $moduleKey => $items) {
            $result[] = [
                'module' => $moduleKey,
                'title' => $moduleLabels[$moduleKey] ?? ucwords(str_replace('_', ' ', $moduleKey)),
                'permissions' => $items,
            ];
        }

        return new JsonResponse([
            'success' => true,
            'data' => $result,
            'total_permissions' => $permissions->count(),
        ]);
    }

    /**
     * Get effective permissions for currently authenticated user.
     */
    public function myPermissions(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return new JsonResponse(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        // Superadmin and Admin have master privileges
        if (in_array($user->role, ['superadmin', 'admin'], true)) {
            $allPerms = PharmacyPermissionModel::pluck('name')->toArray();
            return new JsonResponse([
                'success' => true,
                'is_admin' => true,
                'role' => $user->role,
                'primary_branch' => 'All Branches',
                'authorized_branches' => ['*'],
                'permissions' => $allPerms,
            ]);
        }

        $staff = PharmacyStaffModel::with(['role.permissions', 'primaryBranch', 'branches', 'permissionOverrides'])
            ->where('user_id', $user->id)
            ->first();

        if (! $staff) {
            return new JsonResponse([
                'success' => true,
                'is_admin' => false,
                'role' => $user->role,
                'primary_branch' => null,
                'authorized_branches' => [],
                'permissions' => [],
            ]);
        }

        return new JsonResponse([
            'success' => true,
            'is_admin' => ($staff->role?->slug === 'pharmacy_admin'),
            'role' => $staff->role?->name,
            'role_slug' => $staff->role?->slug,
            'staff_id' => $staff->id,
            'employee_id' => $staff->employee_id,
            'primary_branch' => $staff->primaryBranch,
            'authorized_branches' => $staff->branches->pluck('id')->toArray(),
            'permissions' => $staff->getEffectivePermissions(),
        ]);
    }
}

