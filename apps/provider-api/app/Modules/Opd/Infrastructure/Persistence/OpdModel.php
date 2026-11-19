<?php

declare(strict_types=1);

namespace App\Modules\Opd\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class OpdModel extends Model
{
    protected $table = 'opd_consultations';

    protected $guarded = [];
}
