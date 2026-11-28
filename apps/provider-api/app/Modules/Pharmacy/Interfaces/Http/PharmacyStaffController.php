<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyAuditLogModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyBranchModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyRoleModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyStaffModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

final class PharmacyStaffController extends Controller
{
    /**
     * List pharmacy staff with filtering, search, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PharmacyStaffModel::with([
            'role:id,name,slug,description,is_system',
            'primaryBranch:id,code,name,city',
            'branches:id,code,name,city',
        ]);

        // Search by name, email, employee_id, phone
        if ($search = $request->query('search')) {
            $search = trim((string) $search);
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('employee_id', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($role = $request->query('role')) {
            if (is_numeric($role)) {
                $query->where('role_id', (int) $role);
            } else {
                $query->whereHas('role', fn ($q) => $q->where('slug', $role));
            }
        }

        // Filter by branch
        if ($branchId = $request->query('branch_id')) {
            $query->where(function ($q) use ($branchId) {
                $q->where('primary_branch_id', $branchId)
                    ->orWhereHas('branches', fn ($bq) => $bq->where('pharmacy_branches.id', $branchId));
            });
        }

        // Filter by status (active, inactive, suspended)
        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $perPage = min(100, max(5, (int) $request->query('per_page', 15)));
        $staffMembers = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Overall statistics
        $stats = [
            'total_staff' => PharmacyStaffModel::count(),
            'active_staff' => PharmacyStaffModel::where('status', 'active')->count(),
            'inactive_staff' => PharmacyStaffModel::where('status', 'inactive')->count(),
            'branches_count' => PharmacyBranchModel::where('is_active', true)->count(),
            'roles_count' => PharmacyRoleModel::count(),
        ];

        return new JsonResponse([
            'success' => true,
            'data' => $staffMembers->items(),
            'meta' => [
                'current_page' => $staffMembers->currentPage(),
                'last_page' => $staffMembers->lastPage(),
                'per_page' => $staffMembers->perPage(),
                'total' => $staffMembers->total(),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Get all active pharmacy branches for assignment dropdowns.
     */
    public function branches(): JsonResponse
    {
        $branches = PharmacyBranchModel::where('is_active', true)
            ->withCount('staff')
            ->orderBy('name')
            ->get();

        return new JsonResponse([
            'success' => true,
            'data' => $branches,
        ]);
    }

    /**
     * Show detailed profile of a pharmacy staff member.
     */
    public function show(int $id): JsonResponse
    {
        $staff = PharmacyStaffModel::with([
            'role.permissions',
            'primaryBranch',
            'branches',
            'permissionOverrides',
            'auditLogs' => fn ($q) => $q->orderBy('created_at', 'desc')->limit(20),
        ])->find($id);

        if (! $staff) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Pharmacy staff member not found.',
            ], 404);
        }

        return new JsonResponse([
            'success' => true,
            'data' => [
                'id' => $staff->id,
                'employee_id' => $staff->employee_id,
                'full_name' => $staff->full_name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'role' => $staff->role,
                'primary_branch' => $staff->primaryBranch,
                'branches' => $staff->branches,
                'status' => $staff->status,
                'joining_date' => $staff->joining_date?->format('Y-m-d'),
                'qualification' => $staff->qualification,
                'license_number' => $staff->license_number,
                'last_active_at' => $staff->last_active_at,
                'effective_permissions' => $staff->getEffectivePermissions(),
                'permission_overrides' => $staff->permissionOverrides->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'is_granted' => (bool) $p->pivot->is_granted,
                ]),
                'recent_activity' => $staff->auditLogs,
            ],
        ]);
    }

    /**
     * Add new pharmacy staff member.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:pharmacy_staff,email', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:30'],
            'employee_id' => ['required', 'string', 'max:50', 'unique:pharmacy_staff,employee_id'],
            'role_id' => ['required', 'exists:pharmacy_roles,id'],
            'primary_branch_id' => ['required', 'exists:pharmacy_branches,id'],
            'status' => ['nullable', 'in:active,inactive,suspended'],
            'joining_date' => ['required', 'date'],
            'qualification' => ['nullable', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:6'],
            'branch_ids' => ['nullable', 'array'],
            'branch_ids.*' => ['exists:pharmacy_branches,id'],
            'permission_overrides' => ['nullable', 'array'],
            'permission_overrides.*.id' => ['required', 'exists:pharmacy_permissions,id'],
            'permission_overrides.*.is_granted' => ['required', 'boolean'],
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $authUser = $request->user();

        return DB::transaction(function () use ($validated, $authUser) {
            $role = PharmacyRoleModel::findOrFail($validated['role_id']);

            // 1. Create linked User Account for login
            $password = $validated['password'] ?? 'password123';
            $user = User::create([
                'name' => $validated['full_name'],
                'email' => strtolower(trim($validated['email'])),
                'password' => Hash::make($password),
                'role' => $role->slug,
                'status' => $validated['status'] ?? 'active',
                'phone' => $validated['phone'],
                'email_verified_at' => now(),
            ]);

            // 2. Create Pharmacy Staff Member Record
            $staff = PharmacyStaffModel::create([
                'user_id' => $user->id,
                'employee_id' => strtoupper(trim($validated['employee_id'])),
                'full_name' => $validated['full_name'],
                'email' => strtolower(trim($validated['email'])),
                'phone' => $validated['phone'],
                'role_id' => $role->id,
                'primary_branch_id' => $validated['primary_branch_id'],
                'status' => $validated['status'] ?? 'active',
                'joining_date' => $validated['joining_date'],
                'qualification' => $validated['qualification'] ?? null,
                'license_number' => $validated['license_number'] ?? null,
            ]);

            // 3. Sync branch assignments
            $branchIds = $validated['branch_ids'] ?? [];
            if (! in_array($validated['primary_branch_id'], $branchIds, false)) {
                $branchIds[] = $validated['primary_branch_id'];
            }
            $branchPivot = [];
            foreach ($branchIds as $bId) {
                $branchPivot[$bId] = [
                    'is_primary' => ((int) $bId === (int) $validated['primary_branch_id']),
                ];
            }
            $staff->branches()->sync($branchPivot);

            // 4. Sync permission overrides if any
            if (! empty($validated['permission_overrides'])) {
                $overridePivot = [];
                foreach ($validated['permission_overrides'] as $ov) {
                    $overridePivot[$ov['id']] = ['is_granted' => (bool) $ov['is_granted']];
                }
                $staff->permissionOverrides()->sync($overridePivot);
            }

            // 5. Log audit trail
            PharmacyAuditLogModel::create([
                'user_id' => $authUser?->id,
                'staff_id' => $staff->id,
                'action' => 'staff.create',
                'module' => 'staff',
                'entity_type' => 'PharmacyStaff',
                'entity_id' => (string) $staff->id,
                'branch_id' => $staff->primary_branch_id,
                'details' => [
                    'employee_id' => $staff->employee_id,
                    'full_name' => $staff->full_name,
                    'role' => $role->name,
                    'status' => $staff->status,
                    'branches_count' => count($branchPivot),
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
            ]);

            return new JsonResponse([
                'success' => true,
                'message' => "Staff member [{$staff->full_name}] created successfully.",
                'data' => $staff->load(['role', 'primaryBranch', 'branches']),
            ], 201);
        });
    }

    /**
     * Update existing pharmacy staff member.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $staff = PharmacyStaffModel::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', "unique:pharmacy_staff,email,{$id}", "unique:users,email,{$staff->user_id}"],
            'phone' => ['required', 'string', 'max:30'],
            'employee_id' => ['required', 'string', 'max:50', "unique:pharmacy_staff,employee_id,{$id}"],
            'role_id' => ['required', 'exists:pharmacy_roles,id'],
            'primary_branch_id' => ['required', 'exists:pharmacy_branches,id'],
            'status' => ['nullable', 'in:active,inactive,suspended'],
            'joining_date' => ['required', 'date'],
            'qualification' => ['nullable', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:100'],
            'branch_ids' => ['nullable', 'array'],
            'branch_ids.*' => ['exists:pharmacy_branches,id'],
            'permission_overrides' => ['nullable', 'array'],
            'permission_overrides.*.id' => ['required', 'exists:pharmacy_permissions,id'],
            'permission_overrides.*.is_granted' => ['required', 'boolean'],
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $authUser = $request->user();

        return DB::transaction(function () use ($staff, $validated, $authUser) {
            $role = PharmacyRoleModel::findOrFail($validated['role_id']);
            $oldRole = $staff->role?->name;

            // 1. Update Staff Model
            $staff->update([
                'employee_id' => strtoupper(trim($validated['employee_id'])),
                'full_name' => $validated['full_name'],
                'email' => strtolower(trim($validated['email'])),
                'phone' => $validated['phone'],
                'role_id' => $role->id,
                'primary_branch_id' => $validated['primary_branch_id'],
                'status' => $validated['status'] ?? $staff->status,
                'joining_date' => $validated['joining_date'],
                'qualification' => $validated['qualification'] ?? $staff->qualification,
                'license_number' => $validated['license_number'] ?? $staff->license_number,
            ]);

            // 2. Update linked User account
            if ($staff->user_id) {
                User::where('id', $staff->user_id)->update([
                    'name' => $staff->full_name,
                    'email' => $staff->email,
                    'role' => $role->slug,
                    'status' => $staff->status,
                    'phone' => $staff->phone,
                ]);
            }

            // 3. Update branch assignments
            $branchIds = $validated['branch_ids'] ?? [];
            if (! in_array($validated['primary_branch_id'], $branchIds, false)) {
                $branchIds[] = $validated['primary_branch_id'];
            }
            $branchPivot = [];
            foreach ($branchIds as $bId) {
                $branchPivot[$bId] = [
                    'is_primary' => ((int) $bId === (int) $validated['primary_branch_id']),
                ];
            }
            $staff->branches()->sync($branchPivot);

            // 4. Update permission overrides
            if (isset($validated['permission_overrides'])) {
                $overridePivot = [];
                foreach ($validated['permission_overrides'] as $ov) {
                    $overridePivot[$ov['id']] = ['is_granted' => (bool) $ov['is_granted']];
                }
                $staff->permissionOverrides()->sync($overridePivot);
            }

            // 5. Log audit trail
            PharmacyAuditLogModel::create([
                'user_id' => $authUser?->id,
                'staff_id' => $staff->id,
                'action' => 'staff.update',
                'module' => 'staff',
                'entity_type' => 'PharmacyStaff',
                'entity_id' => (string) $staff->id,
                'branch_id' => $staff->primary_branch_id,
                'details' => [
                    'employee_id' => $staff->employee_id,
                    'full_name' => $staff->full_name,
                    'role_changed_from' => $oldRole,
                    'role_changed_to' => $role->name,
                    'status' => $staff->status,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
            ]);

            return new JsonResponse([
                'success' => true,
                'message' => "Staff member [{$staff->full_name}] updated successfully.",
                'data' => $staff->load(['role', 'primaryBranch', 'branches']),
            ]);
        });
    }

    /**
     * Activate / Deactivate staff account.
     */
    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $staff = PharmacyStaffModel::findOrFail($id);
        $newStatus = $staff->status === 'active' ? 'inactive' : 'active';

        $staff->status = $newStatus;
        $staff->save();

        if ($staff->user_id) {
            User::where('id', $staff->user_id)->update(['status' => $newStatus]);
        }

        // Audit Log
        PharmacyAuditLogModel::create([
            'user_id' => $request->user()?->id,
            'staff_id' => $staff->id,
            'action' => $newStatus === 'active' ? 'staff.activate' : 'staff.deactivate',
            'module' => 'staff',
            'entity_type' => 'PharmacyStaff',
            'entity_id' => (string) $staff->id,
            'branch_id' => $staff->primary_branch_id,
            'details' => [
                'employee_id' => $staff->employee_id,
                'new_status' => $newStatus,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return new JsonResponse([
            'success' => true,
            'message' => "Staff account [{$staff->full_name}] has been set to {$newStatus}.",
            'status' => $newStatus,
        ]);
    }

    /**
     * Securely reset password for a staff member.
     */
    public function resetPassword(Request $request, int $id): JsonResponse
    {
        $staff = PharmacyStaffModel::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        if (! $staff->user_id) {
            return new JsonResponse([
                'success' => false,
                'message' => 'No active authentication account linked with this staff member.',
            ], 400);
        }

        $user = User::findOrFail($staff->user_id);
        $user->password = Hash::make($request->input('password'));
        $user->save();

        // Audit Log
        PharmacyAuditLogModel::create([
            'user_id' => $request->user()?->id,
            'staff_id' => $staff->id,
            'action' => 'staff.password_reset',
            'module' => 'staff',
            'entity_type' => 'User',
            'entity_id' => (string) $user->id,
            'branch_id' => $staff->primary_branch_id,
            'details' => [
                'employee_id' => $staff->employee_id,
                'email' => $staff->email,
                'initiated_by' => $request->user()?->email,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return new JsonResponse([
            'success' => true,
            'message' => "Password for [{$staff->full_name}] has been reset successfully.",
        ]);
    }
}

