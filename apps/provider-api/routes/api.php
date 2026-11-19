<?php

use App\Modules\Appointment\Interfaces\Http\AppointmentController;
use App\Modules\Billing\Interfaces\Http\BillingController;
use App\Modules\FrontWebsite\Interfaces\Http\FrontWebsiteController;
use App\Modules\Identity\Interfaces\Http\IdentityController;
use App\Modules\Ipd\Interfaces\Http\IpdController;
use App\Modules\Notification\Interfaces\Http\NotificationController;
use App\Modules\Opd\Interfaces\Http\OpdController;
use App\Modules\Pathology\Interfaces\Http\PathologyController;
use App\Modules\Patient\Interfaces\Http\PatientController;
use App\Modules\Pharmacy\Interfaces\Http\PharmacyController;
use App\Modules\Radiology\Interfaces\Http\RadiologyController;
use App\Modules\Staff\Interfaces\Http\StaffController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/identity/status', [IdentityController::class, 'status']);
    Route::get('/staff/status', [StaffController::class, 'status']);
    Route::get('/patient/status', [PatientController::class, 'status']);
    Route::get('/appointment/status', [AppointmentController::class, 'status']);
    Route::get('/opd/status', [OpdController::class, 'status']);
    Route::get('/ipd/status', [IpdController::class, 'status']);
    Route::get('/pharmacy/status', [PharmacyController::class, 'status']);
    Route::get('/pathology/status', [PathologyController::class, 'status']);
    Route::get('/radiology/status', [RadiologyController::class, 'status']);
    Route::get('/billing/status', [BillingController::class, 'status']);
    Route::get('/notification/status', [NotificationController::class, 'status']);
    Route::get('/front-website/status', [FrontWebsiteController::class, 'status']);
});
