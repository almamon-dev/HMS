<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Pharmacy Branches Table
        Schema::create('pharmacy_branches', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type')->default('depot'); // depot, opd_pharmacy, ipd_pharmacy, satellite
            $table->string('city');
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('incharge_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Roles Table
        Schema::create('pharmacy_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        // 3. Permissions Table
        Schema::create('pharmacy_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. prescriptions.view
            $table->string('module'); // dispense_queue, ward_indents, narcotics, returns, purchases, inventory, sales, staff
            $table->string('action'); // view, create, edit, approve, reject, fulfill, manage, etc.
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. Role-Permission Pivot Table
        Schema::create('pharmacy_role_has_permissions', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained('pharmacy_roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('pharmacy_permissions')->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        // 5. Pharmacy Staff Table
        Schema::create('pharmacy_staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('employee_id')->unique(); // e.g. EMP-PH-1001
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->foreignId('role_id')->constrained('pharmacy_roles');
            $table->foreignId('primary_branch_id')->constrained('pharmacy_branches');
            $table->string('status')->default('active'); // active, inactive, suspended
            $table->date('joining_date');
            $table->string('qualification')->nullable();
            $table->string('license_number')->nullable();
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
        });

        // 6. Staff-Branch Pivot Table (Multiple branch access)
        Schema::create('pharmacy_staff_has_branches', function (Blueprint $table) {
            $table->foreignId('staff_id')->constrained('pharmacy_staff')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('pharmacy_branches')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->primary(['staff_id', 'branch_id']);
        });

        // 7. Individual Staff Permission Overrides
        Schema::create('pharmacy_staff_permission_overrides', function (Blueprint $table) {
            $table->foreignId('staff_id')->constrained('pharmacy_staff')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('pharmacy_permissions')->cascadeOnDelete();
            $table->boolean('is_granted')->default(true); // true = granted override, false = revoked override
            $table->primary(['staff_id', 'permission_id']);
        });

        // 8. Pharmacy Audit Logs Table
        Schema::create('pharmacy_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('staff_id')->nullable()->constrained('pharmacy_staff')->nullOnDelete();
            $table->string('action'); // e.g. staff.create, staff.update, role.assign, purchases.approve, password.reset
            $table->string('module')->default('staff');
            $table->string('entity_type')->nullable(); // e.g. PharmacyStaff, PurchaseOrder, Role
            $table->string('entity_id')->nullable();
            $table->foreignId('branch_id')->nullable()->constrained('pharmacy_branches')->nullOnDelete();
            $table->json('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_audit_logs');
        Schema::dropIfExists('pharmacy_staff_permission_overrides');
        Schema::dropIfExists('pharmacy_staff_has_branches');
        Schema::dropIfExists('pharmacy_staff');
        Schema::dropIfExists('pharmacy_role_has_permissions');
        Schema::dropIfExists('pharmacy_permissions');
        Schema::dropIfExists('pharmacy_roles');
        Schema::dropIfExists('pharmacy_branches');
    }
};

