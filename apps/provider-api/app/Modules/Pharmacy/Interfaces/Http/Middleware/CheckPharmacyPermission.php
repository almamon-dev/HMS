<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Interfaces\Http\Middleware;

use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyStaffModel;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class CheckPharmacyPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (! $user) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Account status check
        if (isset($user->status) && $user->status !== 'active') {
            return new JsonResponse([
                'success' => false,
                'message' => 'Your account is currently inactive or suspended. Access denied.',
            ], 403);
        }

        // Superadmin and Hospital Admin always bypass specific module checks
        if (in_array($user->role, ['superadmin', 'admin'], true)) {
            return $next($request);
        }

        // Find associated pharmacy staff profile
        $staff = PharmacyStaffModel::with(['role.permissions', 'permissionOverrides'])->where('user_id', $user->id)->first();

        // If no pharmacy staff profile exists, check if user's direct role grants access
        if (! $staff) {
            if ($user->role === 'pharmacist' && ! in_array($permission, ['staff.deactivate', 'staff.assign_roles', 'permissions.manage'], true)) {
                return $next($request);
            }

            return new JsonResponse([
                'success' => false,
                'message' => "Access denied. You do not have pharmacy staff authorization for [{$permission}].",
            ], 403);
        }

        // Inactive staff check
        if ($staff->status !== 'active') {
            return new JsonResponse([
                'success' => false,
                'message' => 'Your pharmacy staff account is inactive or suspended.',
            ], 403);
        }

        // Check permission (Pharmacy Admin has all permissions)
        if (! $staff->hasPermission($permission)) {
            return new JsonResponse([
                'success' => false,
                'message' => "Access denied. Required permission [{$permission}] not granted.",
                'required_permission' => $permission,
                'role' => $staff->role?->name,
            ], 403);
        }

        // Optional branch restriction check if request specifies a target branch
        $targetBranchId = $request->header('X-Pharmacy-Branch') ?: $request->input('branch_id');
        if ($targetBranchId && ! in_array($staff->role?->slug, ['pharmacy_admin', 'pharmacy_manager', 'auditor'], true)) {
            $isAuthorizedForBranch = $staff->branches()->where('pharmacy_branches.id', $targetBranchId)->exists();
            if (! $isAuthorizedForBranch && (string) $staff->primary_branch_id !== (string) $targetBranchId) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Access denied. You are not authorized to perform operations in this pharmacy branch.',
                    'target_branch_id' => $targetBranchId,
                ], 403);
            }
        }

        return $next($request);
    }
}

