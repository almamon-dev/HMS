<?php

declare(strict_types=1);

namespace App\Modules\Patient\Domain\ValueObjects;

enum Gender: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';
}
