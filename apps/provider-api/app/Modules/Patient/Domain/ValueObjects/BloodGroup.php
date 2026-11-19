<?php

declare(strict_types=1);

namespace App\Modules\Patient\Domain\ValueObjects;

enum BloodGroup: string
{
    case A_POS = 'A+';
    case A_NEG = 'A-';
    case B_POS = 'B+';
    case B_NEG = 'B-';
    case O_POS = 'O+';
    case O_NEG = 'O-';
    case AB_POS = 'AB+';
    case AB_NEG = 'AB-';
}
