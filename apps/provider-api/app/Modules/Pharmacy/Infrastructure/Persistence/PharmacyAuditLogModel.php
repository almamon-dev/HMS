<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Infrastructure\Persistence;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PharmacyAuditLogModel extends Model
{
    public $timestamps = false;

    protected $table = 'pharmacy_audit_logs';

    protected $guarded = [];

    protected $casts = [
        'details' => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(PharmacyStaffModel::class, 'staff_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(PharmacyBranchModel::class, 'branch_id');
    }
}

