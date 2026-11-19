<?php

declare(strict_types=1);

namespace App\Modules\FrontWebsite\Domain\ValueObjects;

enum PageType: string
{
    case HOME = 'home';
    case ABOUT = 'about';
    case DOCTORS = 'doctors';
    case DEPARTMENTS = 'departments';
    case CONTACT = 'contact';
}
