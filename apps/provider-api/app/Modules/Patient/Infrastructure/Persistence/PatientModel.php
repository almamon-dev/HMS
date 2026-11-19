<?php

declare(strict_types=1);

namespace App\Modules\Patient\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class PatientModel extends Model
{
    protected $table = 'patients';

    protected $guarded = [];
}
