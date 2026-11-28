<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class PharmacyBranchModel extends Model
{
    protected $table = 'pharmacy_branches';

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function staff(): HasMany
    {
        return $this->hasMany(PharmacyStaffModel::class, 'primary_branch_id');
    }
}

