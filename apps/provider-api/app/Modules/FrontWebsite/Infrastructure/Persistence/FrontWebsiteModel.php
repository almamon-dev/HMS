<?php

declare(strict_types=1);

namespace App\Modules\FrontWebsite\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class FrontWebsiteModel extends Model
{
    protected $table = 'cms_pages';

    protected $guarded = [];
}
