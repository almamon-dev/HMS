<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Infrastructure\Persistence;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class PharmacyStaffModel extends Model
{
    protected $table = 'pharmacy_staff';

    protected $guarded = [];

    protected $casts = [
        'joining_date' => 'date:Y-m-d',
        'last_active_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(PharmacyRoleModel::class, 'role_id');
    }

    public function primaryBranch(): BelongsTo
    {
        return $this->belongsTo(PharmacyBranchModel::class, 'primary_branch_id');
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(
            PharmacyBranchModel::class,
            'pharmacy_staff_has_branches',
            'staff_id',
            'branch_id'
        )->withPivot('is_primary');
    }

    public function permissionOverrides(): BelongsToMany
    {
        return $this->belongsToMany(
            PharmacyPermissionModel::class,
            'pharmacy_staff_permission_overrides',
            'staff_id',
            'permission_id'
        )->withPivot('is_granted');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(PharmacyAuditLogModel::class, 'staff_id');
    }

    /**
     * Compute effective list of permission slugs for this staff member.
     * Takes role permissions and applies individual grant/revoke overrides.
     *
     * @return array<string>
     */
    public function getEffectivePermissions(): array
    {
        $rolePermissions = $this->role ? $this->role->permissions->pluck('name')->toArray() : [];

        $overrides = $this->permissionOverrides;
        $granted = $overrides->where('pivot.is_granted', true)->pluck('name')->toArray();
        $revoked = $overrides->where('pivot.is_granted', false)->pluck('name')->toArray();

        $effective = array_unique(array_merge($rolePermissions, $granted));
        return array_values(array_diff($effective, $revoked));
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        // Pharmacy Admin has all permissions
        if ($this->role && $this->role->slug === 'pharmacy_admin') {
            return true;
        }

        return in_array($permission, $this->getEffectivePermissions(), true);
    }
}

