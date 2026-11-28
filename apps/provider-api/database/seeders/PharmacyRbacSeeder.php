<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyAuditLogModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyBranchModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyPermissionModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyRoleModel;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyStaffModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PharmacyRbacSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================================================
        // 1. SEED PHARMACY BRANCHES
        // =========================================================================
        $branches = [
            [
                'code' => 'CMS-01',
                'name' => 'Central Medical Store (CMS) - Main Depot',
                'type' => 'depot',
                'city' => 'Dhaka',
                'address' => 'Plot 8, Tejgaon Industrial Area, Dhaka 1208',
                'phone' => '+880 2 9884011',
                'email' => 'cms-depot@hospital.local',
                'incharge_name' => 'Dr. Shahed Kamal',
            ],
            [
                'code' => 'DHA-02',
                'name' => 'Dhanmondi OPD Pharmacy Depot',
                'type' => 'opd_pharmacy',
                'city' => 'Dhaka',
                'address' => 'House 32, Road 2, Dhanmondi R/A, Dhaka 1205',
                'phone' => '+880 2 9660015',
                'email' => 'dhanmondi-pharmacy@hospital.local',
                'incharge_name' => 'Md. Rafiqul Islam, M.Pharm',
            ],
            [
                'code' => 'UTT-03',
                'name' => 'Uttara Branch Pharmacy Depot',
                'type' => 'opd_pharmacy',
                'city' => 'Dhaka',
                'address' => 'Plot 14, Sector 7, Jashimuddin Ave, Uttara, Dhaka 1230',
                'phone' => '+880 2 8955210',
                'email' => 'uttara-pharmacy@hospital.local',
                'incharge_name' => 'Nusrat Jahan, B.Pharm',
            ],
            [
                'code' => 'MIR-04',
                'name' => 'Mirpur Branch Pharmacy',
                'type' => 'satellite',
                'city' => 'Dhaka',
                'address' => 'Plot 4, Mirpur Section 10 Circle, Dhaka 1216',
                'phone' => '+880 2 9011234',
                'email' => 'mirpur-pharmacy@hospital.local',
                'incharge_name' => 'Tanvir Hasan',
            ],
            [
                'code' => 'CTG-05',
                'name' => 'Chattogram Hub Pharmacy Depot',
                'type' => 'depot',
                'city' => 'Chittagong',
                'address' => '45 O.R. Nizam Road, GEC Circle, Chattogram 4000',
                'phone' => '+880 31 654321',
                'email' => 'ctg-pharmacy@hospital.local',
                'incharge_name' => 'Farhan Chowdhury',
            ],
        ];

        $branchModels = [];
        foreach ($branches as $b) {
            $branchModels[$b['code']] = PharmacyBranchModel::updateOrCreate(
                ['code' => $b['code']],
                $b
            );
        }

        // =========================================================================
        // 2. SEED 36 GRANULAR PHARMACY PERMISSIONS
        // =========================================================================
        $permissionsList = [
            // Dispense Queue
            ['name' => 'prescriptions.view', 'module' => 'dispense_queue', 'action' => 'view', 'display_name' => 'View Prescriptions Queue', 'description' => 'Browse and view pending e-prescriptions in dispense queue.'],
            ['name' => 'prescriptions.review', 'module' => 'dispense_queue', 'action' => 'review', 'display_name' => 'Review Prescription Safety', 'description' => 'Clinical safety and drug-drug interaction review.'],
            ['name' => 'prescriptions.verify', 'module' => 'dispense_queue', 'action' => 'approve', 'display_name' => 'Verify & Authorize Rx', 'description' => 'Authorize verified prescription for dispensing.'],
            ['name' => 'medicines.dispense', 'module' => 'dispense_queue', 'action' => 'dispense', 'display_name' => 'Dispense Medicines', 'description' => 'Deduct stock and dispense medications to patient.'],
            ['name' => 'dispensing.history', 'module' => 'dispense_queue', 'action' => 'export', 'display_name' => 'Dispensing Logs & History', 'description' => 'Review historical patient dispensing logs.'],

            // Ward Indents
            ['name' => 'ward_indents.view', 'module' => 'ward_indents', 'action' => 'view', 'display_name' => 'View Ward Indents', 'description' => 'View IPD and ICU medicine requisitions.'],
            ['name' => 'ward_indents.create', 'module' => 'ward_indents', 'action' => 'create', 'display_name' => 'Create Ward Indents', 'description' => 'Draft hospital ward replenishment indent.'],
            ['name' => 'ward_indents.approve', 'module' => 'ward_indents', 'action' => 'approve', 'display_name' => 'Approve Ward Indents', 'description' => 'Authorize ward stock dispatch.'],
            ['name' => 'ward_indents.reject', 'module' => 'ward_indents', 'action' => 'reject', 'display_name' => 'Reject Ward Indents', 'description' => 'Reject unauthorized or duplicate ward requests.'],
            ['name' => 'ward_indents.fulfill', 'module' => 'ward_indents', 'action' => 'fulfill', 'display_name' => 'Fulfill & Dispatch Indents', 'description' => 'Pick, pack and transfer stock to ward satellite.'],

            // Narcotics Register
            ['name' => 'narcotics.view', 'module' => 'narcotics', 'action' => 'view', 'display_name' => 'View Narcotics Register', 'description' => 'Access Schedule II-IV controlled drug records.'],
            ['name' => 'narcotics.create', 'module' => 'narcotics', 'action' => 'create', 'display_name' => 'Log Controlled Drug Dispense', 'description' => 'Record dual-verified narcotic issuance.'],
            ['name' => 'narcotics.update', 'module' => 'narcotics', 'action' => 'edit', 'display_name' => 'Update Narcotic Lot Record', 'description' => 'Modify narcotic balance following physical count.'],
            ['name' => 'narcotics.audit', 'module' => 'narcotics', 'action' => 'approve', 'display_name' => 'Audit Narcotic Vault', 'description' => 'Perform official regulatory narcotic audit and sign-off.'],

            // Returns & Refunds
            ['name' => 'returns.view', 'module' => 'returns', 'action' => 'view', 'display_name' => 'View Returned Items', 'description' => 'Inspect returned medication list and notes.'],
            ['name' => 'returns.create', 'module' => 'returns', 'action' => 'create', 'display_name' => 'Initiate Return Request', 'description' => 'Draft customer or ward medicine return ticket.'],
            ['name' => 'returns.inspect', 'module' => 'returns', 'action' => 'review', 'display_name' => 'Inspect Returned Stock', 'description' => 'Verify seal integrity, strip batch and cold-chain validity.'],
            ['name' => 'returns.approve', 'module' => 'returns', 'action' => 'approve', 'display_name' => 'Approve Medicine Returns', 'description' => 'Authorize return to stock or quarantine.'],
            ['name' => 'returns.reject', 'module' => 'returns', 'action' => 'reject', 'display_name' => 'Reject Medicine Returns', 'description' => 'Decline damaged or opened medication return.'],
            ['name' => 'refunds.view', 'module' => 'returns', 'action' => 'view', 'display_name' => 'View Refund Register', 'description' => 'Review financial refund transactions.'],
            ['name' => 'refunds.process', 'module' => 'returns', 'action' => 'approve', 'display_name' => 'Process Financial Refund', 'description' => 'Issue cash, card or wallet refund to patient.'],

            // Purchase Orders
            ['name' => 'purchases.view', 'module' => 'purchases', 'action' => 'view', 'display_name' => 'View Purchase Orders', 'description' => 'Review procurement orders and status.'],
            ['name' => 'purchases.create', 'module' => 'purchases', 'action' => 'create', 'display_name' => 'Draft Purchase Order', 'description' => 'Create new manufacturer procurement order.'],
            ['name' => 'purchases.edit', 'module' => 'purchases', 'action' => 'edit', 'display_name' => 'Edit Purchase Order', 'description' => 'Modify item lines, quantities and trade prices.'],
            ['name' => 'purchases.submit', 'module' => 'purchases', 'action' => 'create', 'display_name' => 'Submit PO to Vendor', 'description' => 'Transmit purchase order via EDI or portal.'],
            ['name' => 'purchases.approve', 'module' => 'purchases', 'action' => 'approve', 'display_name' => 'Authorize Purchase Order', 'description' => 'Approve PO spend and 3-way GRN match.'],
            ['name' => 'purchases.cancel', 'module' => 'purchases', 'action' => 'delete', 'display_name' => 'Cancel Purchase Order', 'description' => 'Cancel unfulfilled purchase order with reason.'],

            // Inventory & Stock
            ['name' => 'inventory.view', 'module' => 'inventory', 'action' => 'view', 'display_name' => 'View Real-Time Inventory', 'description' => 'Inspect current SKU stocks across branches.'],
            ['name' => 'inventory.manage', 'module' => 'inventory', 'action' => 'edit', 'display_name' => 'Manage Medicine Master', 'description' => 'Add and edit SKU formulations, pricing and strengths.'],
            ['name' => 'inventory.adjust', 'module' => 'inventory', 'action' => 'edit', 'display_name' => 'Perform Stock Adjustment', 'description' => 'Write off breakage, spoilage or reconciliation differences.'],
            ['name' => 'inventory.receive', 'module' => 'inventory', 'action' => 'create', 'display_name' => 'Receive Manufacturer Stock', 'description' => 'Inspect delivery challan and generate GRN.'],
            ['name' => 'inventory.transfer', 'module' => 'inventory', 'action' => 'create', 'display_name' => 'Requisition Stock Transfer', 'description' => 'Transfer stock between central depot and branches.'],
            ['name' => 'inventory.batch.manage', 'module' => 'inventory', 'action' => 'edit', 'display_name' => 'Manage Batches & Expiry', 'description' => 'Quarantine expired batches and manage FEFO.'],

            // Sales & Reports
            ['name' => 'sales.view', 'module' => 'sales', 'action' => 'view', 'display_name' => 'View Sales Invoices', 'description' => 'Browse pharmacy counter sales register.'],
            ['name' => 'sales.create', 'module' => 'sales', 'action' => 'create', 'display_name' => 'Execute POS Billing', 'description' => 'Scan barcodes, generate invoice and collect payments.'],
            ['name' => 'sales.manage', 'module' => 'sales', 'action' => 'edit', 'display_name' => 'Manage Invoices & Voids', 'description' => 'Void or amend invoices with manager override.'],
            ['name' => 'reports.view', 'module' => 'sales', 'action' => 'view', 'display_name' => 'View Analytics & Reports', 'description' => 'Access revenue, gross margin and consumption graphs.'],
            ['name' => 'reports.export', 'module' => 'sales', 'action' => 'export', 'display_name' => 'Export Pharmacy Reports', 'description' => 'Export CSV and PDF reports for audit.'],

            // Staff Management
            ['name' => 'staff.view', 'module' => 'staff', 'action' => 'view', 'display_name' => 'View Pharmacy Staff', 'description' => 'Browse pharmacy staff roster and active status.'],
            ['name' => 'staff.create', 'module' => 'staff', 'action' => 'create', 'display_name' => 'Add New Pharmacy Staff', 'description' => 'Register new employee with role and branch.'],
            ['name' => 'staff.update', 'module' => 'staff', 'action' => 'edit', 'display_name' => 'Edit Staff & Branch Access', 'description' => 'Modify staff role, contact and branch authorization.'],
            ['name' => 'staff.deactivate', 'module' => 'staff', 'action' => 'delete', 'display_name' => 'Activate / Deactivate Staff', 'description' => 'Disable login and revoke active session.'],
            ['name' => 'staff.assign_roles', 'module' => 'staff', 'action' => 'approve', 'display_name' => 'Assign & Switch Roles', 'description' => 'Assign predefined or custom roles to personnel.'],
            ['name' => 'permissions.manage', 'module' => 'staff', 'action' => 'approve', 'display_name' => 'Manage Permission Matrix', 'description' => 'Configure custom roles and override permissions.'],
        ];

        $permissionModels = [];
        foreach ($permissionsList as $p) {
            $permissionModels[$p['name']] = PharmacyPermissionModel::updateOrCreate(
                ['name' => $p['name']],
                $p
            );
        }

        // =========================================================================
        // 3. SEED 9 PREDEFINED PHARMACY ROLES WITH EXACT DEFAULT PERMISSIONS
        // =========================================================================
        $rolesConfig = [
            'pharmacy_admin' => [
                'name' => 'Pharmacy Admin',
                'description' => 'Full administrative access across all pharmacy modules, staff, roles, branches, and compliance.',
                'permissions' => array_keys($permissionModels), // All 36
            ],
            'pharmacy_manager' => [
                'name' => 'Pharmacy Manager',
                'description' => 'Operational management, purchase approval, return authorization, staff supervision and reports.',
                'permissions' => [
                    'prescriptions.view', 'prescriptions.review', 'prescriptions.verify', 'medicines.dispense', 'dispensing.history',
                    'ward_indents.view', 'ward_indents.approve', 'ward_indents.reject', 'ward_indents.fulfill',
                    'narcotics.view', 'narcotics.audit',
                    'returns.view', 'returns.inspect', 'returns.approve', 'returns.reject', 'refunds.view', 'refunds.process',
                    'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.submit', 'purchases.approve', 'purchases.cancel',
                    'inventory.view', 'inventory.manage', 'inventory.adjust', 'inventory.receive', 'inventory.transfer', 'inventory.batch.manage',
                    'sales.view', 'sales.manage', 'reports.view', 'reports.export',
                    'staff.view', 'staff.create', 'staff.update', 'staff.deactivate', 'staff.assign_roles',
                ],
            ],
            'pharmacist' => [
                'name' => 'Pharmacist',
                'description' => 'Clinical prescription review, dispensing, ward requests, narcotics handling and return inspection.',
                'permissions' => [
                    'prescriptions.view', 'prescriptions.review', 'prescriptions.verify', 'medicines.dispense', 'dispensing.history',
                    'ward_indents.view', 'ward_indents.fulfill',
                    'narcotics.view', 'narcotics.create', 'narcotics.update',
                    'returns.view', 'returns.create', 'returns.inspect',
                    'inventory.view', 'inventory.transfer', 'inventory.batch.manage',
                    'sales.view', 'sales.create',
                    'reports.view',
                ],
            ],
            'pharmacy_assistant' => [
                'name' => 'Pharmacy Assistant',
                'description' => 'Basic medicine handling, customer assistance, POS counter and authorized stock operations.',
                'permissions' => [
                    'prescriptions.view', 'medicines.dispense', 'dispensing.history',
                    'inventory.view',
                    'sales.view', 'sales.create',
                ],
            ],
            'purchase_officer' => [
                'name' => 'Purchase Officer',
                'description' => 'Manufacturer relationship management, drafting and submitting purchase orders. Cannot self-approve.',
                'permissions' => [
                    'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.submit',
                    'inventory.view', 'inventory.receive',
                    'reports.view',
                ],
            ],
            'storekeeper' => [
                'name' => 'Storekeeper',
                'description' => 'Goods receipt (GRN), batch tracking, storage organization, and branch stock dispatch.',
                'permissions' => [
                    'inventory.view', 'inventory.manage', 'inventory.adjust', 'inventory.receive', 'inventory.transfer', 'inventory.batch.manage',
                    'purchases.view',
                    'ward_indents.view', 'ward_indents.fulfill',
                ],
            ],
            'cashier' => [
                'name' => 'Cashier',
                'description' => 'Billing counter, payment processing, and authorized customer refunds. No inventory modification.',
                'permissions' => [
                    'sales.view', 'sales.create', 'sales.manage',
                    'refunds.view', 'refunds.process',
                    'prescriptions.view',
                ],
            ],
            'inventory_manager' => [
                'name' => 'Inventory Manager',
                'description' => 'Stock auditing, FEFO expiry management, write-offs, transfers and re-order thresholds.',
                'permissions' => [
                    'inventory.view', 'inventory.manage', 'inventory.adjust', 'inventory.receive', 'inventory.transfer', 'inventory.batch.manage',
                    'purchases.view', 'purchases.create',
                    'returns.view', 'returns.inspect',
                    'reports.view', 'reports.export',
                ],
            ],
            'auditor' => [
                'name' => 'Auditor',
                'description' => 'Strictly read-only compliance access to inspect logs, narcotic registers, orders, and sales.',
                'permissions' => [
                    'prescriptions.view', 'dispensing.history',
                    'ward_indents.view',
                    'narcotics.view', 'narcotics.audit',
                    'returns.view', 'refunds.view',
                    'purchases.view',
                    'inventory.view',
                    'sales.view', 'reports.view', 'reports.export',
                    'staff.view',
                ],
            ],
        ];

        $roleModels = [];
        foreach ($rolesConfig as $slug => $data) {
            $role = PharmacyRoleModel::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $data['name'],
                    'slug' => $slug,
                    'description' => $data['description'],
                    'is_system' => true,
                ]
            );

            // Sync permissions
            $permIds = [];
            foreach ($data['permissions'] as $pName) {
                if (isset($permissionModels[$pName])) {
                    $permIds[] = $permissionModels[$pName]->id;
                }
            }
            $role->permissions()->sync($permIds);
            $roleModels[$slug] = $role;
        }

        // =========================================================================
        // 4. SEED SAMPLE PHARMACY STAFF MEMBERS LINKED WITH ACCOUNTS
        // =========================================================================
        $defaultPassword = Hash::make('password123');

        $staffMembersData = [
            [
                'employee_id' => 'EMP-PH-1001',
                'full_name' => 'Md. Rafiqul Islam, M.Pharm',
                'email' => 'pharmacist@hospital.local',
                'phone' => '+880 1711 000005',
                'role_slug' => 'pharmacy_admin',
                'primary_branch_code' => 'DHA-02',
                'branches' => ['CMS-01', 'DHA-02', 'UTT-03', 'MIR-04', 'CTG-05'],
                'status' => 'active',
                'joining_date' => '2022-03-15',
                'qualification' => 'M.Pharm (Clinical Pharmacy), DU',
                'license_number' => 'PCB Reg: B-12948',
            ],
            [
                'employee_id' => 'EMP-PH-1002',
                'full_name' => 'Dr. Shahed Kamal',
                'email' => 'shahed.kamal@hospital.local',
                'phone' => '+880 1712 112233',
                'role_slug' => 'pharmacy_manager',
                'primary_branch_code' => 'CMS-01',
                'branches' => ['CMS-01', 'DHA-02'],
                'status' => 'active',
                'joining_date' => '2023-01-10',
                'qualification' => 'Pharm.D, Master in Health Admin',
                'license_number' => 'PCB Reg: B-08812',
            ],
            [
                'employee_id' => 'EMP-PH-1003',
                'full_name' => 'Nusrat Jahan, B.Pharm',
                'email' => 'nusrat.jahan@hospital.local',
                'phone' => '+880 1819 223344',
                'role_slug' => 'pharmacist',
                'primary_branch_code' => 'DHA-02',
                'branches' => ['DHA-02'],
                'status' => 'active',
                'joining_date' => '2023-06-01',
                'qualification' => 'B.Pharm (Hons), Jahangirnagar Univ',
                'license_number' => 'PCB Reg: B-14201',
            ],
            [
                'employee_id' => 'EMP-PH-1004',
                'full_name' => 'Tanvir Hasan',
                'email' => 'tanvir.hasan@hospital.local',
                'phone' => '+880 1912 334455',
                'role_slug' => 'pharmacy_assistant',
                'primary_branch_code' => 'DHA-02',
                'branches' => ['DHA-02'],
                'status' => 'active',
                'joining_date' => '2024-02-15',
                'qualification' => 'Diploma in Medical Technology (Pharmacy)',
                'license_number' => 'PCB Reg: C-09144',
            ],
            [
                'employee_id' => 'EMP-PH-1005',
                'full_name' => 'Farhan Chowdhury',
                'email' => 'purchase.officer@hospital.local',
                'phone' => '+880 1611 445566',
                'role_slug' => 'purchase_officer',
                'primary_branch_code' => 'CMS-01',
                'branches' => ['CMS-01'],
                'status' => 'active',
                'joining_date' => '2023-08-20',
                'qualification' => 'BBA (Supply Chain Management)',
                'license_number' => 'N/A',
            ],
            [
                'employee_id' => 'EMP-PH-1006',
                'full_name' => 'Kamal Hossain',
                'email' => 'storekeeper@hospital.local',
                'phone' => '+880 1512 556677',
                'role_slug' => 'storekeeper',
                'primary_branch_code' => 'CMS-01',
                'branches' => ['CMS-01', 'UTT-03'],
                'status' => 'active',
                'joining_date' => '2022-11-05',
                'qualification' => 'HSC (Science), Certified Warehouse Lead',
                'license_number' => 'N/A',
            ],
            [
                'employee_id' => 'EMP-PH-1007',
                'full_name' => 'Sadia Afrin',
                'email' => 'cashier@hospital.local',
                'phone' => '+880 1713 667788',
                'role_slug' => 'cashier',
                'primary_branch_code' => 'DHA-02',
                'branches' => ['DHA-02'],
                'status' => 'active',
                'joining_date' => '2024-01-02',
                'qualification' => 'B.Com (Accounting)',
                'license_number' => 'N/A',
            ],
            [
                'employee_id' => 'EMP-PH-1008',
                'full_name' => 'Tariqul Islam',
                'email' => 'inventory.mgr@hospital.local',
                'phone' => '+880 1814 778899',
                'role_slug' => 'inventory_manager',
                'primary_branch_code' => 'CMS-01',
                'branches' => ['CMS-01', 'DHA-02', 'MIR-04'],
                'status' => 'active',
                'joining_date' => '2023-04-18',
                'qualification' => 'B.Pharm, Certified Inventory Specialist',
                'license_number' => 'PCB Reg: B-11029',
            ],
            [
                'employee_id' => 'EMP-PH-1009',
                'full_name' => 'Monirul Haque',
                'email' => 'auditor@hospital.local',
                'phone' => '+880 1915 889900',
                'role_slug' => 'auditor',
                'primary_branch_code' => 'CMS-01',
                'branches' => ['CMS-01', 'DHA-02', 'UTT-03', 'MIR-04', 'CTG-05'],
                'status' => 'active',
                'joining_date' => '2022-09-01',
                'qualification' => 'FCA, Quality & Regulatory Compliance Lead',
                'license_number' => 'ICAB #1842',
            ],
            [
                'employee_id' => 'EMP-PH-1010',
                'full_name' => 'Shahidul Alam',
                'email' => 'former.staff@hospital.local',
                'phone' => '+880 1716 990011',
                'role_slug' => 'pharmacy_assistant',
                'primary_branch_code' => 'MIR-04',
                'branches' => ['MIR-04'],
                'status' => 'inactive',
                'joining_date' => '2023-03-01',
                'qualification' => 'Diploma in Pharmacy',
                'license_number' => 'PCB Reg: C-07821',
            ],
        ];

        foreach ($staffMembersData as $s) {
            // Create or update user account
            $user = User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['full_name'],
                    'password' => $defaultPassword,
                    'role' => $s['role_slug'],
                    'status' => $s['status'],
                    'phone' => $s['phone'],
                    'email_verified_at' => now(),
                ]
            );

            $role = $roleModels[$s['role_slug']];
            $primaryBranch = $branchModels[$s['primary_branch_code']];

            // Create or update pharmacy staff member
            $staff = PharmacyStaffModel::updateOrCreate(
                ['employee_id' => $s['employee_id']],
                [
                    'user_id' => $user->id,
                    'full_name' => $s['full_name'],
                    'email' => $s['email'],
                    'phone' => $s['phone'],
                    'role_id' => $role->id,
                    'primary_branch_id' => $primaryBranch->id,
                    'status' => $s['status'],
                    'joining_date' => $s['joining_date'],
                    'qualification' => $s['qualification'],
                    'license_number' => $s['license_number'],
                    'last_active_at' => now()->subMinutes(rand(5, 120)),
                ]
            );

            // Sync authorized branches
            $branchPivot = [];
            foreach ($s['branches'] as $bCode) {
                if (isset($branchModels[$bCode])) {
                    $branchPivot[$branchModels[$bCode]->id] = [
                        'is_primary' => ($bCode === $s['primary_branch_code']),
                    ];
                }
            }
            $staff->branches()->sync($branchPivot);

            // Log staff creation audit
            PharmacyAuditLogModel::create([
                'user_id' => $user->id,
                'staff_id' => $staff->id,
                'action' => 'staff.create',
                'module' => 'staff',
                'entity_type' => 'PharmacyStaff',
                'entity_id' => (string) $staff->id,
                'branch_id' => $primaryBranch->id,
                'details' => [
                    'employee_id' => $staff->employee_id,
                    'role' => $role->name,
                    'primary_branch' => $primaryBranch->name,
                    'status' => $staff->status,
                ],
                'ip_address' => '127.0.0.1',
                'user_agent' => 'GreenHospital/Pharmacy-ERP/Seeder',
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}

