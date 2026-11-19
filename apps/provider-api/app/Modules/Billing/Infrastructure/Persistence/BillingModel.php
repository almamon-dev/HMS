<?php

declare(strict_types=1);

namespace App\Modules\Billing\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;

final class BillingModel extends Model
{
    protected $table = 'invoices';

    protected $guarded = [];
}
