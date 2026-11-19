<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Application\Ports;

interface IdGenerator
{
    public function generate(): string;
}
