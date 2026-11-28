<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class PharmacyPermissionModel extends Model
{
    protected $table = 'pharmacy_permissions';

    protected $guarded = [];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            PharmacyRoleModel::class,
            'pharmacy_role_has_permissions',
            'permission_id',
            'role_id'
        );
    }
}

