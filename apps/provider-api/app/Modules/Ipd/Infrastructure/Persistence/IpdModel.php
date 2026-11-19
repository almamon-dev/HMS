<?php

declare(strict_types=1);

namespace App\Modules\Ipd\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class IpdModel extends Model
{
    protected $table = 'ipd_admissions';

    protected $guarded = [];
}
