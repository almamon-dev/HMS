<?php

declare(strict_types=1);

namespace App\Modules\Identity\Domain\ValueObjects;

enum UserRole: string
{
    case SUPERADMIN = 'superadmin';
    case ADMIN = 'admin';
    case DOCTOR = 'doctor';
    case NURSE = 'nurse';
    case PHARMACIST = 'pharmacist';
    case PATHOLOGIST = 'pathologist';
    case RADIOLOGIST = 'radiologist';
    case ACCOUNTANT = 'accountant';
    case RECEPTIONIST = 'receptionist';
    case PATIENT = 'patient';
}
