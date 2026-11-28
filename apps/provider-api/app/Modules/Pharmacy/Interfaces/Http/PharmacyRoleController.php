<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyAuditLogModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyRoleModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

final class PharmacyRoleController extends Controller
{
    /**
     * List all pharmacy roles with permission counts and assigned staff count.
     */
    public function index(): JsonResponse
    {
        $roles = PharmacyRoleModel::with(['permissions:id,name,module,action,display_name'])
            ->withCount('staff')
            ->orderBy('id')
            ->get();

        return new JsonResponse([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Show role details.
     */
    public function show(int $id): JsonResponse
    {
        $role = PharmacyRoleModel::with(['permissions', 'staff'])->findOrFail($id);

        return new JsonResponse([
            'success' => true,
            'data' => $role,
        ]);
    }

    /**
     * Create a custom role.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100', 'unique:pharmacy_roles,name'],
            'description' => ['nullable', 'string', 'max:500'],
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['exists:pharmacy_permissions,id'],
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $slug = Str::slug($validated['name'], '_');

        if (PharmacyRoleModel::where('slug', $slug)->exists()) {
            $slug .= '_' . Str::random(4);
        }

        return DB::transaction(function () use ($validated, $slug, $request) {
            $role = PharmacyRoleModel::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'] ?? null,
                'is_system' => false,
            ]);

            $role->permissions()->sync($validated['permission_ids']);

            // Audit Log
            PharmacyAuditLogModel::create([
                'user_id' => $request->user()?->id,
                'action' => 'role.create',
                'module' => 'staff',
                'entity_type' => 'PharmacyRole',
                'entity_id' => (string) $role->id,
                'details' => [
                    'role_name' => $role->name,
                    'slug' => $role->slug,
                    'permissions_count' => count($validated['permission_ids']),
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return new JsonResponse([
                'success' => true,
                'message' => "Custom role [{$role->name}] created successfully.",
                'data' => $role->load('permissions'),
            ], 201);
        });
    }

    /**
     * Update an existing role and its permissions matrix.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $role = PharmacyRoleModel::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100', "unique:pharmacy_roles,name,{$id}"],
            'description' => ['nullable', 'string', 'max:500'],
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['exists:pharmacy_permissions,id'],
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        return DB::transaction(function () use ($role, $validated, $request) {
            // If system role, keep system slug and name intact to preserve standard guarantees
            if (! $role->is_system) {
                $role->name = $validated['name'];
            }
            $role->description = $validated['description'] ?? $role->description;
            $role->save();

            $role->permissions()->sync($validated['permission_ids']);

            // Audit Log
            PharmacyAuditLogModel::create([
                'user_id' => $request->user()?->id,
                'action' => 'role.update',
                'module' => 'staff',
                'entity_type' => 'PharmacyRole',
                'entity_id' => (string) $role->id,
                'details' => [
                    'role_name' => $role->name,
                    'permissions_count' => count($validated['permission_ids']),
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return new JsonResponse([
                'success' => true,
                'message' => "Role [{$role->name}] permissions updated successfully.",
                'data' => $role->load('permissions'),
            ]);
        });
    }

    /**
     * Delete a custom role.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $role = PharmacyRoleModel::withCount('staff')->findOrFail($id);

        if ($role->is_system) {
            return new JsonResponse([
                'success' => false,
                'message' => 'System predefined roles cannot be deleted.',
            ], 403);
        }

        if ($role->staff_count > 0) {
            return new JsonResponse([
                'success' => false,
                'message' => "Cannot delete role [{$role->name}] because {$role->staff_count} staff member(s) are currently assigned to it.",
            ], 422);
        }

        $roleName = $role->name;
        $role->permissions()->detach();
        $role->delete();

        // Audit Log
        PharmacyAuditLogModel::create([
            'user_id' => $request->user()?->id,
            'action' => 'role.delete',
            'module' => 'staff',
            'entity_type' => 'PharmacyRole',
            'entity_id' => (string) $id,
            'details' => ['deleted_role' => $roleName],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return new JsonResponse([
            'success' => true,
            'message' => "Role [{$roleName}] deleted successfully.",
        ]);
    }
}

