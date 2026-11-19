<?php

declare(strict_types=1);

namespace App\Modules\Pathology\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class PathologyModel extends Model
{
    protected $table = 'pathology_tests';

    protected $guarded = [];
}
