<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class PharmacyModel extends Model
{
    protected $table = 'medicines';

    protected $guarded = [];
}
