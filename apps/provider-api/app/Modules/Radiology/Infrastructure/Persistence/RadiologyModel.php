<?php

declare(strict_types=1);

namespace App\Modules\Radiology\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class RadiologyModel extends Model
{
    protected $table = 'radiology_scans';

    protected $guarded = [];
}
