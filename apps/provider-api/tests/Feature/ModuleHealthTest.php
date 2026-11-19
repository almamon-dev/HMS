<?php

declare(strict_types=1);

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ModuleHealthTest extends TestCase
{
    #[DataProvider('moduleEndpointProvider')]
    public function test_module_endpoints_return_active(string $endpoint, string $expectedModule): void
    {
        $response = $this->getJson($endpoint);

        $response->assertOk();
        $response->assertJson([
            'module' => $expectedModule,
            'status' => 'active',
        ]);
    }

    /**
     * @return array<string, array{0: string, 1: string}>
     */
    public static function moduleEndpointProvider(): array
    {
        return [
            'identity' => ['/api/v1/identity/status', 'Identity'],
            'staff' => ['/api/v1/staff/status', 'Staff'],
            'patient' => ['/api/v1/patient/status', 'Patient'],
            'appointment' => ['/api/v1/appointment/status', 'Appointment'],
            'opd' => ['/api/v1/opd/status', 'Opd'],
            'ipd' => ['/api/v1/ipd/status', 'Ipd'],
            'pharmacy' => ['/api/v1/pharmacy/status', 'Pharmacy'],
            'pathology' => ['/api/v1/pathology/status', 'Pathology'],
            'radiology' => ['/api/v1/radiology/status', 'Radiology'],
            'billing' => ['/api/v1/billing/status', 'Billing'],
            'notification' => ['/api/v1/notification/status', 'Notification'],
            'front-website' => ['/api/v1/front-website/status', 'FrontWebsite'],
        ];
    }
}
