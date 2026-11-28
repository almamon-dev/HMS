<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class PharmacyRoleModel extends Model
{
    protected $table = 'pharmacy_roles';

    protected $guarded = [];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            PharmacyPermissionModel::class,
            'pharmacy_role_has_permissions',
            'role_id',
            'permission_id'
        );
    }

    public function staff(): HasMany
    {
        return $this->hasMany(PharmacyStaffModel::class, 'role_id');
    }
}

