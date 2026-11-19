<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Infrastructure;

use App\Modules\Foundation\Application\Ports\IdGenerator;
use Illuminate\Support\Str;

final readonly class UuidV7Generator implements IdGenerator
{
    public function generate(): string
    {
        return (string) Str::uuid();
    }
}
