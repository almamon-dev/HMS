<?php

declare(strict_types=1);

namespace App\Modules\Staff\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class StaffModel extends Model
{
    protected $table = 'staff_members';

    protected $guarded = [];
}
