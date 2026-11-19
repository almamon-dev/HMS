<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class AppointmentModel extends Model
{
    protected $table = 'appointments';

    protected $guarded = [];
}
