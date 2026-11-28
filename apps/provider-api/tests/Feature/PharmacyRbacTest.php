<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyBranchModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyPermissionModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyRoleModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyStaffModel;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PharmacyRbacTest extends TestCase
{
    use DatabaseTransactions;
    protected function setUp(): void
    {
        parent::setUp();
        // Seed RBAC data
        $this->seed(\Database\Seeders\PharmacyRbacSeeder::class);
    }

    public function test_pharmacy_admin_can_manage_authorized_staff(): void
    {
        $adminUser = User::where('email', 'pharmacist@hospital.local')->first();
        Sanctum::actingAs($adminUser);

        // 1. List staff
        $response = $this->getJson('/api/v1/pharmacy/staff');
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data', 'meta', 'stats']);

        // 2. Create staff
        $branch = PharmacyBranchModel::first();
        $role = PharmacyRoleModel::where('slug', 'pharmacist')->first();
        $uid = uniqid();

        $createRes = $this->postJson('/api/v1/pharmacy/staff', [
            'full_name' => 'Test Clinical Pharmacist',
            'email' => "new.pharmacist.{$uid}@hospital.local",
            'phone' => '+8801700998877',
            'employee_id' => "EMP-TEST-{$uid}",
            'role_id' => $role->id,
            'primary_branch_id' => $branch->id,
            'joining_date' => '2026-01-01',
            'branch_ids' => [$branch->id],
        ]);

        $createRes->assertStatus(201)
            ->assertJsonPath('success', true);

        $staffId = $createRes->json('data.id');
        $newStaff = PharmacyStaffModel::find($staffId);
        $this->assertNotNull($newStaff);

        // 3. Deactivate staff
        $deactivateRes = $this->patchJson("/api/v1/pharmacy/staff/{$newStaff->id}/status");
        $deactivateRes->assertStatus(200)
            ->assertJsonPath('status', 'inactive');

        $this->assertEquals('inactive', $newStaff->fresh()->status);
    }

    public function test_purchase_officer_cannot_approve_own_purchase_order_separation_of_duties(): void
    {
        $poUser = User::where('email', 'purchase.officer@hospital.local')->first();
        Sanctum::actingAs($poUser);

        // Purchase officer lacks purchases.approve permission
        $response = $this->postJson('/api/v1/pharmacy/purchases/PO-2026-001/approve', [
            'creator_user_id' => $poUser->id,
        ]);

        // Access denied by middleware because purchase officer role does not have purchases.approve
        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_manager_cannot_self_approve_own_purchase_order(): void
    {
        // Pharmacy manager has purchases.approve, but if they created it, self-approval must be blocked
        $managerUser = User::where('email', 'shahed.kamal@hospital.local')->first();
        Sanctum::actingAs($managerUser);

        $response = $this->postJson('/api/v1/pharmacy/purchases/PO-2026-001/approve', [
            'creator_user_id' => $managerUser->id, // Created by same user
        ]);

        // Blocked by separation of duties check
        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonFragment(['message' => 'Separation of duties violation: The creator of a purchase order cannot authorize or approve their own order. An independent Pharmacy Manager or Admin is required.']);
    }

    public function test_cashier_cannot_manage_staff(): void
    {
        $cashierUser = User::where('email', 'cashier@hospital.local')->first();
        Sanctum::actingAs($cashierUser);

        // Cashier attempts to list staff
        $response = $this->getJson('/api/v1/pharmacy/staff');
        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('required_permission', 'staff.view');
    }

    public function test_inactive_staff_cannot_access_pharmacy_dashboard(): void
    {
        $inactiveUser = User::where('email', 'former.staff@hospital.local')->first();
        Sanctum::actingAs($inactiveUser);

        $response = $this->getJson('/api/v1/pharmacy/staff');
        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_custom_role_permissions_work_correctly(): void
    {
        $adminUser = User::where('email', 'pharmacist@hospital.local')->first();
        Sanctum::actingAs($adminUser);

        $perm1 = PharmacyPermissionModel::where('name', 'inventory.view')->first();
        $perm2 = PharmacyPermissionModel::where('name', 'reports.view')->first();

        // 1. Create custom role
        $uid = uniqid();
        $roleName = "Pharmacy Trainee {$uid}";
        $createRoleRes = $this->postJson('/api/v1/pharmacy/roles', [
            'name' => $roleName,
            'description' => 'Limited trainee role with view only',
            'permission_ids' => [$perm1->id, $perm2->id],
        ]);

        $createRoleRes->assertStatus(201)
            ->assertJsonPath('success', true);

        $customRole = PharmacyRoleModel::where('name', $roleName)->first();
        $this->assertNotNull($customRole);
        $this->assertCount(2, $customRole->permissions);

        // 2. Assign custom role to a new staff
        $branch = PharmacyBranchModel::first();
        $createStaffRes = $this->postJson('/api/v1/pharmacy/staff', [
            'full_name' => 'Trainee Intern',
            'email' => "trainee.intern.{$uid}@hospital.local",
            'phone' => '+8801700112233',
            'employee_id' => "EMP-TR-{$uid}",
            'role_id' => $customRole->id,
            'primary_branch_id' => $branch->id,
            'joining_date' => '2026-02-01',
        ]);
        $createStaffRes->assertStatus(201);

        $traineeStaff = PharmacyStaffModel::find($createStaffRes->json('data.id'));
        $this->assertNotNull($traineeStaff);
        $this->assertTrue($traineeStaff->hasPermission('inventory.view'));
        $this->assertTrue($traineeStaff->hasPermission('reports.view'));
        $this->assertFalse($traineeStaff->hasPermission('staff.view'));
        $this->assertFalse($traineeStaff->hasPermission('purchases.approve'));
    }

    public function test_auditor_has_read_only_access_and_cannot_modify(): void
    {
        $auditorUser = User::where('email', 'auditor@hospital.local')->first();
        Sanctum::actingAs($auditorUser);

        // Auditor can view audit logs
        $viewLogsRes = $this->getJson('/api/v1/pharmacy/audit-logs');
        $viewLogsRes->assertStatus(200);

        // Auditor cannot create staff
        $branch = PharmacyBranchModel::first();
        $role = PharmacyRoleModel::first();
        $createStaffRes = $this->postJson('/api/v1/pharmacy/staff', [
            'full_name' => 'Hacker Staff',
            'email' => 'hacker@hospital.local',
            'phone' => '+8801111111111',
            'employee_id' => 'EMP-HACK-01',
            'role_id' => $role->id,
            'primary_branch_id' => $branch->id,
            'joining_date' => '2026-01-01',
        ]);
        $createStaffRes->assertStatus(403);
    }
}
