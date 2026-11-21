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
    // Authentication Endpoints
    Route::post('/auth/login', [IdentityController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [IdentityController::class, 'me']);
        Route::post('/auth/logout', [IdentityController::class, 'logout']);

        // Doctor Workstation Endpoints
        Route::prefix('doctor')->group(function () {
            Route::get('/dashboard', [OpdController::class, 'status']);
            Route::get('/appointments', [AppointmentController::class, 'status']);
            Route::get('/patients', [PatientController::class, 'status']);
            Route::get('/queue', [OpdController::class, 'status']);
            Route::get('/consultations', [OpdController::class, 'status']);
            Route::get('/prescriptions', [OpdController::class, 'status']);
            Route::post('/prescriptions', [OpdController::class, 'status']);
            Route::get('/lab-investigations', [PathologyController::class, 'status']);
            Route::get('/radiology-results', [RadiologyController::class, 'status']);
            Route::get('/schedule', [StaffController::class, 'status']);
            Route::get('/reports', [OpdController::class, 'status']);
        });

        // Pharmacist Workstation & Multi-Branch SCM Endpoints
        Route::prefix('pharmacy')->group(function () {
            Route::get('/dashboard', [PharmacyController::class, 'status']);
            Route::get('/pos/items', [PharmacyController::class, 'status']);
            Route::post('/pos/checkout', [PharmacyController::class, 'status']);
            Route::get('/dispense-queue', [PharmacyController::class, 'status']);
            Route::post('/dispense', [PharmacyController::class, 'status']);
            Route::get('/inventory', [PharmacyController::class, 'status']);
            Route::get('/batches', [PharmacyController::class, 'status']);
            Route::get('/ward-indents', [PharmacyController::class, 'status']);
            Route::get('/transfers', [PharmacyController::class, 'status']);
            Route::post('/transfers', [PharmacyController::class, 'status']);
            Route::get('/purchases', [PharmacyController::class, 'status']);
            Route::post('/purchases', [PharmacyController::class, 'status']);
            Route::get('/returns', [PharmacyController::class, 'status']);
            Route::get('/narcotics-register', [PharmacyController::class, 'status']);
            Route::get('/reports', [PharmacyController::class, 'status']);
        });
    });

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
