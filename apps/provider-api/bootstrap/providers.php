<?php

use App\Modules\Appointment\Providers\AppointmentServiceProvider;
use App\Modules\Billing\Providers\BillingServiceProvider;
use App\Modules\Foundation\Providers\FoundationServiceProvider;
use App\Modules\FrontWebsite\Providers\FrontWebsiteServiceProvider;
use App\Modules\Identity\Providers\IdentityServiceProvider;
use App\Modules\Ipd\Providers\IpdServiceProvider;
use App\Modules\Notification\Providers\NotificationServiceProvider;
use App\Modules\Opd\Providers\OpdServiceProvider;
use App\Modules\Pathology\Providers\PathologyServiceProvider;
use App\Modules\Patient\Providers\PatientServiceProvider;
use App\Modules\Pharmacy\Providers\PharmacyServiceProvider;
use App\Modules\Radiology\Providers\RadiologyServiceProvider;
use App\Modules\Staff\Providers\StaffServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    FoundationServiceProvider::class,
    IdentityServiceProvider::class,
    StaffServiceProvider::class,
    PatientServiceProvider::class,
    AppointmentServiceProvider::class,
    OpdServiceProvider::class,
    IpdServiceProvider::class,
    PharmacyServiceProvider::class,
    PathologyServiceProvider::class,
    RadiologyServiceProvider::class,
    BillingServiceProvider::class,
    NotificationServiceProvider::class,
    FrontWebsiteServiceProvider::class,
];
