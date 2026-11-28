export interface PharmacyBranch {
  id: string;
  code: string;
  name: string;
  type: 'depot' | 'opd_pharmacy' | 'ipd_pharmacy' | 'satellite';
  city: string;
  address: string;
  phone: string;
  email: string;
  inchargeName: string;
  isActive: boolean;
}

export interface PharmacyPermission {
  id: string;
  name: string; // e.g. prescriptions.view
  module: string;
  action: 'view' | 'create' | 'edit' | 'approve' | 'reject' | 'delete' | 'export' | 'dispense' | 'fulfill' | 'review';
  displayName: string;
  description: string;
}

export interface PermissionModuleGroup {
  module: string;
  title: string;
  description: string;
  permissions: PharmacyPermission[];
}

export interface PharmacyRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  permissions: string[]; // Permission names
}

export interface PharmacyStaffMember {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  roleSlug: string;
  roleName: string;
  primaryBranchId: string;
  primaryBranchName: string;
  branchIds: string[];
  branchNames: string[];
  status: 'active' | 'inactive' | 'suspended';
  joiningDate: string;
  qualification?: string;
  licenseNumber?: string;
  lastActiveAt?: string;
  permissionOverrides?: {
    permissionName: string;
    isGranted: boolean; // true = extra granted, false = revoked
  }[];
}

export interface PharmacyAuditLog {
  id: string;
  action: string;
  module: string;
  staffName: string;
  employeeId: string;
  branchName: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

// 5 Standard Hospital Pharmacy Branches
export const PHARMACY_BRANCHES: PharmacyBranch[] = [
  {
    id: 'br-cms-01',
    code: 'CMS-01',
    name: 'Central Medical Store (CMS) - Main Depot',
    type: 'depot',
    city: 'Dhaka',
    address: 'Plot 8, Tejgaon Industrial Area, Dhaka 1208',
    phone: '+880 2 9884011',
    email: 'cms-depot@greenhospital.org',
    inchargeName: 'Dr. Shahed Kamal',
    isActive: true,
  },
  {
    id: 'br-dha-02',
    code: 'DHA-02',
    name: 'Dhanmondi OPD Pharmacy Depot',
    type: 'opd_pharmacy',
    city: 'Dhaka',
    address: 'House 32, Road 2, Dhanmondi R/A, Dhaka 1205',
    phone: '+880 2 9660015',
    email: 'dhanmondi-pharmacy@greenhospital.org',
    inchargeName: 'Md. Rafiqul Islam, M.Pharm',
    isActive: true,
  },
  {
    id: 'br-utt-03',
    code: 'UTT-03',
    name: 'Uttara Branch Pharmacy Depot',
    type: 'opd_pharmacy',
    city: 'Dhaka',
    address: 'Plot 14, Sector 7, Jashimuddin Ave, Uttara, Dhaka 1230',
    phone: '+880 2 8955210',
    email: 'uttara-pharmacy@greenhospital.org',
    inchargeName: 'Nusrat Jahan, B.Pharm',
    isActive: true,
  },
  {
    id: 'br-mir-04',
    code: 'MIR-04',
    name: 'Mirpur Branch Pharmacy',
    type: 'satellite',
    city: 'Dhaka',
    address: 'Plot 4, Mirpur Section 10 Circle, Dhaka 1216',
    phone: '+880 2 9011234',
    email: 'mirpur-pharmacy@greenhospital.org',
    inchargeName: 'Tanvir Hasan',
    isActive: true,
  },
  {
    id: 'br-ctg-05',
    code: 'CTG-05',
    name: 'Chattogram Hub Pharmacy Depot',
    type: 'depot',
    city: 'Chittagong',
    address: '45 O.R. Nizam Road, GEC Circle, Chattogram 4000',
    phone: '+880 31 654321',
    email: 'ctg-pharmacy@greenhospital.org',
    inchargeName: 'Farhan Chowdhury',
    isActive: true,
  },
];

// All 36 Granular Permissions Grouped by Module
export const PHARMACY_PERMISSION_MODULES: PermissionModuleGroup[] = [
  {
    module: 'dispense_queue',
    title: 'Dispense Queue',
    description: 'Outpatient & inpatient electronic prescription processing, clinical verification, and dispensing.',
    permissions: [
      { id: 'p1', name: 'prescriptions.view', module: 'dispense_queue', action: 'view', displayName: 'View Prescriptions', description: 'Browse and inspect incoming prescription queue.' },
      { id: 'p2', name: 'prescriptions.review', module: 'dispense_queue', action: 'review', displayName: 'Review Clinical Safety', description: 'Perform drug-drug interaction and dosage checks.' },
      { id: 'p3', name: 'prescriptions.verify', module: 'dispense_queue', action: 'approve', displayName: 'Verify & Authorize Rx', description: 'Clinical sign-off authorizing medication fulfillment.' },
      { id: 'p4', name: 'medicines.dispense', module: 'dispense_queue', action: 'dispense', displayName: 'Dispense Medicines', description: 'Pick medication from shelves and hand over to patient.' },
      { id: 'p5', name: 'dispensing.history', module: 'dispense_queue', action: 'export', displayName: 'Dispensing History', description: 'View and export audit logs of completed dispenses.' },
    ],
  },
  {
    module: 'ward_indents',
    title: 'Ward Indents',
    description: 'Inpatient ward, OT, and ICU medication requisitions and replenishment.',
    permissions: [
      { id: 'p6', name: 'ward_indents.view', module: 'ward_indents', action: 'view', displayName: 'View Ward Indents', description: 'View floor requests and satellite requisitions.' },
      { id: 'p7', name: 'ward_indents.create', module: 'ward_indents', action: 'create', displayName: 'Create Ward Indents', description: 'Draft emergency ward replenishment requests.' },
      { id: 'p8', name: 'ward_indents.approve', module: 'ward_indents', action: 'approve', displayName: 'Approve Ward Indents', description: 'Authorize delivery of medications to hospital wards.' },
      { id: 'p9', name: 'ward_indents.reject', module: 'ward_indents', action: 'reject', displayName: 'Reject Ward Indents', description: 'Decline non-formulary or unauthorized ward requests.' },
      { id: 'p10', name: 'ward_indents.fulfill', module: 'ward_indents', action: 'fulfill', displayName: 'Fulfill & Dispatch', description: 'Pack and dispatch medicines to ward nursing station.' },
    ],
  },
  {
    module: 'narcotics',
    title: 'Narcotics Register',
    description: 'Controlled substances (Schedule II-IV), double-lock vault audit, and narcotics log.',
    permissions: [
      { id: 'p11', name: 'narcotics.view', module: 'narcotics', action: 'view', displayName: 'View Narcotics Register', description: 'View controlled substance inventory and balances.' },
      { id: 'p12', name: 'narcotics.create', module: 'narcotics', action: 'create', displayName: 'Log Narcotic Dispense', description: 'Record dual-witnessed controlled drug issuance.' },
      { id: 'p13', name: 'narcotics.update', module: 'narcotics', action: 'edit', displayName: 'Update Narcotic Lot', description: 'Correct vault counts following physical count inspection.' },
      { id: 'p14', name: 'narcotics.audit', module: 'narcotics', action: 'approve', displayName: 'Perform Regulatory Audit', description: 'Execute official narcotics register closing and sign-off.' },
    ],
  },
  {
    module: 'returns',
    title: 'Returns & Refunds',
    description: 'Medication returns, seal integrity inspection, quarantine, and patient refund processing.',
    permissions: [
      { id: 'p15', name: 'returns.view', module: 'returns', action: 'view', displayName: 'View Returned Items', description: 'Inspect list of customer and ward medicine return requests.' },
      { id: 'p16', name: 'returns.create', module: 'returns', action: 'create', displayName: 'Initiate Return Request', description: 'Draft patient return ticket with invoice validation.' },
      { id: 'p17', name: 'returns.inspect', module: 'returns', action: 'review', displayName: 'Inspect Returned Stock', description: 'Verify blister pack seal, batch validity, and cold-chain integrity.' },
      { id: 'p18', name: 'returns.approve', module: 'returns', action: 'approve', displayName: 'Approve Returns', description: 'Authorize return into restockable or scrap status.' },
      { id: 'p19', name: 'returns.reject', module: 'returns', action: 'reject', displayName: 'Reject Returns', description: 'Decline opened, compromised, or ineligible items.' },
      { id: 'p20', name: 'refunds.view', module: 'returns', action: 'view', displayName: 'View Refund Register', description: 'Access financial refund ledger and audit vouchers.' },
      { id: 'p21', name: 'refunds.process', module: 'returns', action: 'approve', displayName: 'Process Cash/Card Refund', description: 'Issue monetary refund to customer via cash counter or POS.' },
    ],
  },
  {
    module: 'purchases',
    title: 'Purchase Orders',
    description: 'Pharmaceutical manufacturer orders, pricing terms, 3-way match, and spend authorization.',
    permissions: [
      { id: 'p22', name: 'purchases.view', module: 'purchases', action: 'view', displayName: 'View Purchase Orders', description: 'Review procurement requisitions and manufacturer orders.' },
      { id: 'p23', name: 'purchases.create', module: 'purchases', action: 'create', displayName: 'Create Purchase Orders', description: 'Draft procurement orders for medicine suppliers.' },
      { id: 'p24', name: 'purchases.edit', module: 'purchases', action: 'edit', displayName: 'Edit Purchase Orders', description: 'Modify item lines, order quantities, and unit trade prices.' },
      { id: 'p25', name: 'purchases.submit', module: 'purchases', action: 'create', displayName: 'Submit PO to Vendor', description: 'Transmit finalized purchase order to pharmaceutical distributor.' },
      { id: 'p26', name: 'purchases.approve', module: 'purchases', action: 'approve', displayName: 'Authorize & Approve PO', description: 'Managerial spend approval and 3-way GRN sign-off.' },
      { id: 'p27', name: 'purchases.cancel', module: 'purchases', action: 'delete', displayName: 'Cancel Purchase Orders', description: 'Void or cancel purchase order before vendor fulfillment.' },
    ],
  },
  {
    module: 'inventory',
    title: 'Inventory & Stock',
    description: 'Medicine catalogue, FEFO batch management, inter-branch transfers, and physical write-offs.',
    permissions: [
      { id: 'p28', name: 'inventory.view', module: 'inventory', action: 'view', displayName: 'View Real-Time Stock', description: 'Inspect stock balances, formulations, and depots.' },
      { id: 'p29', name: 'inventory.manage', module: 'inventory', action: 'edit', displayName: 'Manage SKU Catalog', description: 'Add and update medications, generic names, and strengths.' },
      { id: 'p30', name: 'inventory.adjust', module: 'inventory', action: 'edit', displayName: 'Stock Adjustments', description: 'Record physical count discrepancies and write-offs.' },
      { id: 'p31', name: 'inventory.receive', module: 'inventory', action: 'create', displayName: 'Receive Goods & GRN', description: 'Receive supplier shipments and generate GRN vouchers.' },
      { id: 'p32', name: 'inventory.transfer', module: 'inventory', action: 'create', displayName: 'Branch Stock Transfers', description: 'Requisition and dispatch stock between hospital branches.' },
      { id: 'p33', name: 'inventory.batch.manage', module: 'inventory', action: 'edit', displayName: 'Manage Batches & FEFO', description: 'Update batch lots, expiry dates, and quarantine.' },
    ],
  },
  {
    module: 'sales',
    title: 'Sales & Reports',
    description: 'Point of sale billing, receipt generation, invoice voiding, and analytics.',
    permissions: [
      { id: 'p34', name: 'sales.view', module: 'sales', action: 'view', displayName: 'View Sales Register', description: 'Browse POS sales history and customer receipts.' },
      { id: 'p35', name: 'sales.create', module: 'sales', action: 'create', displayName: 'Execute POS Billing', description: 'Scan barcodes, collect cash/card, and issue printed bill.' },
      { id: 'p36', name: 'sales.manage', module: 'sales', action: 'edit', displayName: 'Manage & Void Invoices', description: 'Authorize price adjustments and manager bill voids.' },
      { id: 'p37', name: 'reports.view', module: 'sales', action: 'view', displayName: 'View Analytics & Reports', description: 'Inspect daily revenue, consumption, and margin charts.' },
      { id: 'p38', name: 'reports.export', module: 'sales', action: 'export', displayName: 'Export Data to CSV/Excel', description: 'Download CSV and Excel audit sheets for accounting.' },
    ],
  },
  {
    module: 'staff',
    title: 'Staff Management',
    description: 'Pharmacy staff roster, role assignment, branch authorizations, and granular permissions.',
    permissions: [
      { id: 'p39', name: 'staff.view', module: 'staff', action: 'view', displayName: 'View Staff Directory', description: 'Browse pharmacy personnel, roles, and branch assignments.' },
      { id: 'p40', name: 'staff.create', module: 'staff', action: 'create', displayName: 'Add New Staff Member', description: 'Register new pharmacy employee and configure credentials.' },
      { id: 'p41', name: 'staff.update', module: 'staff', action: 'edit', displayName: 'Edit Staff Information', description: 'Modify contact details, roles, and branch authorizations.' },
      { id: 'p42', name: 'staff.deactivate', module: 'staff', action: 'delete', displayName: 'Activate / Deactivate', description: 'Toggle account login status and revoke access.' },
      { id: 'p43', name: 'staff.assign_roles', module: 'staff', action: 'approve', displayName: 'Assign & Switch Roles', description: 'Assign predefined or custom roles to personnel.' },
      { id: 'p44', name: 'permissions.manage', module: 'staff', action: 'approve', displayName: 'Manage Permission Matrix', description: 'Create custom roles and customize permission overrides.' },
    ],
  },
];

// Flat list of all permissions for fast indexing
export const ALL_PHARMACY_PERMISSIONS: PharmacyPermission[] = PHARMACY_PERMISSION_MODULES.flatMap((m) => m.permissions);

// 9 Predefined Pharmacy Roles with Exact Default Permissions
export const PREDEFINED_PHARMACY_ROLES: PharmacyRole[] = [
  {
    id: 'role-admin',
    name: 'Pharmacy Admin',
    slug: 'pharmacy_admin',
    description: 'Full administrative access across all pharmacy modules, staff, roles, branches, and compliance.',
    isSystem: true,
    permissions: ALL_PHARMACY_PERMISSIONS.map((p) => p.name), // All permissions
  },
  {
    id: 'role-mgr',
    name: 'Pharmacy Manager',
    slug: 'pharmacy_manager',
    description: 'Operational management, purchase approval, return authorization, staff supervision and reports.',
    isSystem: true,
    permissions: [
      'prescriptions.view', 'prescriptions.review', 'prescriptions.verify', 'medicines.dispense', 'dispensing.history',
      'ward_indents.view', 'ward_indents.approve', 'ward_indents.reject', 'ward_indents.fulfill',
      'narcotics.view', 'narcotics.audit',
      'returns.view', 'returns.inspect', 'returns.approve', 'returns.reject', 'refunds.view', 'refunds.process',
      'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.submit', 'purchases.approve', 'purchases.cancel',
      'inventory.view', 'inventory.manage', 'inventory.adjust', 'inventory.receive', 'inventory.transfer', 'inventory.batch.manage',
      'sales.view', 'sales.manage', 'reports.view', 'reports.export',
      'staff.view', 'staff.create', 'staff.update', 'staff.deactivate', 'staff.assign_roles',
    ],
  },
  {
    id: 'role-pharm',
    name: 'Pharmacist',
    slug: 'pharmacist',
    description: 'Clinical prescription review, dispensing, ward requests, narcotics handling and return inspection.',
    isSystem: true,
    permissions: [
      'prescriptions.view', 'prescriptions.review', 'prescriptions.verify', 'medicines.dispense', 'dispensing.history',
      'ward_indents.view', 'ward_indents.fulfill',
      'narcotics.view', 'narcotics.create', 'narcotics.update',
      'returns.view', 'returns.create', 'returns.inspect',
      'inventory.view', 'inventory.transfer', 'inventory.batch.manage',
      'sales.view', 'sales.create',
      'reports.view',
    ],
  },
  {
    id: 'role-asst',
    name: 'Pharmacy Assistant',
    slug: 'pharmacy_assistant',
    description: 'Basic medicine handling, customer assistance, POS counter and authorized stock operations.',
    isSystem: true,
    permissions: [
      'prescriptions.view', 'medicines.dispense', 'dispensing.history',
      'inventory.view',
      'sales.view', 'sales.create',
    ],
  },
  {
    id: 'role-purch',
    name: 'Purchase Officer',
    slug: 'purchase_officer',
    description: 'Manufacturer relationship management, drafting and submitting purchase orders. Cannot self-approve orders.',
    isSystem: true,
    permissions: [
      'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.submit',
      'inventory.view', 'inventory.receive',
      'reports.view',
    ],
  },
  {
    id: 'role-store',
    name: 'Storekeeper',
    slug: 'storekeeper',
    description: 'Goods receipt (GRN), batch tracking, storage organization, and branch stock dispatch.',
    isSystem: true,
    permissions: [
      'inventory.view', 'inventory.manage', 'inventory.adjust', 'inventory.receive', 'inventory.transfer', 'inventory.batch.manage',
      'purchases.view',
      'ward_indents.view', 'ward_indents.fulfill',
    ],
  },
  {
    id: 'role-cashier',
    name: 'Cashier',
    slug: 'cashier',
    description: 'Billing counter, payment processing, and authorized customer refunds. No inventory modification.',
    isSystem: true,
    permissions: [
      'sales.view', 'sales.create', 'sales.manage',
      'refunds.view', 'refunds.process',
      'prescriptions.view',
    ],
  },
  {
    id: 'role-inv-mgr',
    name: 'Inventory Manager',
    slug: 'inventory_manager',
    description: 'Stock auditing, FEFO expiry management, write-offs, transfers and re-order thresholds.',
    isSystem: true,
    permissions: [
      'inventory.view', 'inventory.manage', 'inventory.adjust', 'inventory.receive', 'inventory.transfer', 'inventory.batch.manage',
      'purchases.view', 'purchases.create',
      'returns.view', 'returns.inspect',
      'reports.view', 'reports.export',
    ],
  },
  {
    id: 'role-auditor',
    name: 'Auditor',
    slug: 'auditor',
    description: 'Strictly read-only compliance access to inspect logs, narcotic registers, orders, and sales.',
    isSystem: true,
    permissions: [
      'prescriptions.view', 'dispensing.history',
      'ward_indents.view',
      'narcotics.view', 'narcotics.audit',
      'returns.view', 'refunds.view',
      'purchases.view',
      'inventory.view',
      'sales.view', 'reports.view', 'reports.export',
      'staff.view',
    ],
  },
];

// Initial Seeded Pharmacy Staff Members
export const INITIAL_PHARMACY_STAFF: PharmacyStaffMember[] = [
  {
    id: 'staff-01',
    employeeId: 'EMP-PH-1001',
    fullName: 'Md. Rafiqul Islam, M.Pharm',
    email: 'pharmacist@hospital.local',
    phone: '+880 1711 000005',
    roleSlug: 'pharmacy_admin',
    roleName: 'Pharmacy Admin',
    primaryBranchId: 'br-dha-02',
    primaryBranchName: 'Dhanmondi OPD Pharmacy Depot',
    branchIds: ['br-cms-01', 'br-dha-02', 'br-utt-03', 'br-mir-04', 'br-ctg-05'],
    branchNames: ['CMS Depot', 'Dhanmondi OPD', 'Uttara Branch', 'Mirpur Branch', 'Chattogram Hub'],
    status: 'active',
    joiningDate: '2022-03-15',
    qualification: 'M.Pharm (Clinical Pharmacy), University of Dhaka',
    licenseNumber: 'PCB Reg: B-12948',
    lastActiveAt: 'Just now',
  },
  {
    id: 'staff-02',
    employeeId: 'EMP-PH-1002',
    fullName: 'Dr. Shahed Kamal',
    email: 'shahed.kamal@hospital.local',
    phone: '+880 1712 112233',
    roleSlug: 'pharmacy_manager',
    roleName: 'Pharmacy Manager',
    primaryBranchId: 'br-cms-01',
    primaryBranchName: 'Central Medical Store (CMS) - Main Depot',
    branchIds: ['br-cms-01', 'br-dha-02'],
    branchNames: ['CMS Depot', 'Dhanmondi OPD'],
    status: 'active',
    joiningDate: '2023-01-10',
    qualification: 'Pharm.D, Master in Health Administration',
    licenseNumber: 'PCB Reg: B-08812',
    lastActiveAt: '12 mins ago',
  },
  {
    id: 'staff-03',
    employeeId: 'EMP-PH-1003',
    fullName: 'Nusrat Jahan, B.Pharm',
    email: 'nusrat.jahan@hospital.local',
    phone: '+880 1819 223344',
    roleSlug: 'pharmacist',
    roleName: 'Pharmacist',
    primaryBranchId: 'br-dha-02',
    primaryBranchName: 'Dhanmondi OPD Pharmacy Depot',
    branchIds: ['br-dha-02'],
    branchNames: ['Dhanmondi OPD'],
    status: 'active',
    joiningDate: '2023-06-01',
    qualification: 'B.Pharm (Hons), Jahangirnagar University',
    licenseNumber: 'PCB Reg: B-14201',
    lastActiveAt: '25 mins ago',
  },
  {
    id: 'staff-04',
    employeeId: 'EMP-PH-1004',
    fullName: 'Tanvir Hasan',
    email: 'tanvir.hasan@hospital.local',
    phone: '+880 1912 334455',
    roleSlug: 'pharmacy_assistant',
    roleName: 'Pharmacy Assistant',
    primaryBranchId: 'br-dha-02',
    primaryBranchName: 'Dhanmondi OPD Pharmacy Depot',
    branchIds: ['br-dha-02'],
    branchNames: ['Dhanmondi OPD'],
    status: 'active',
    joiningDate: '2024-02-15',
    qualification: 'Diploma in Medical Technology (Pharmacy)',
    licenseNumber: 'PCB Reg: C-09144',
    lastActiveAt: '1 hour ago',
  },
  {
    id: 'staff-05',
    employeeId: 'EMP-PH-1005',
    fullName: 'Farhan Chowdhury',
    email: 'purchase.officer@hospital.local',
    phone: '+880 1611 445566',
    roleSlug: 'purchase_officer',
    roleName: 'Purchase Officer',
    primaryBranchId: 'br-cms-01',
    primaryBranchName: 'Central Medical Store (CMS) - Main Depot',
    branchIds: ['br-cms-01'],
    branchNames: ['CMS Depot'],
    status: 'active',
    joiningDate: '2023-08-20',
    qualification: 'BBA (Supply Chain Management)',
    licenseNumber: 'N/A',
    lastActiveAt: '35 mins ago',
  },
  {
    id: 'staff-06',
    employeeId: 'EMP-PH-1006',
    fullName: 'Kamal Hossain',
    email: 'storekeeper@hospital.local',
    phone: '+880 1512 556677',
    roleSlug: 'storekeeper',
    roleName: 'Storekeeper',
    primaryBranchId: 'br-cms-01',
    primaryBranchName: 'Central Medical Store (CMS) - Main Depot',
    branchIds: ['br-cms-01', 'br-utt-03'],
    branchNames: ['CMS Depot', 'Uttara Branch'],
    status: 'active',
    joiningDate: '2022-11-05',
    qualification: 'HSC Science, Certified Warehouse Lead',
    licenseNumber: 'N/A',
    lastActiveAt: '2 hours ago',
  },
  {
    id: 'staff-07',
    employeeId: 'EMP-PH-1007',
    fullName: 'Sadia Afrin',
    email: 'cashier@hospital.local',
    phone: '+880 1713 667788',
    roleSlug: 'cashier',
    roleName: 'Cashier',
    primaryBranchId: 'br-dha-02',
    primaryBranchName: 'Dhanmondi OPD Pharmacy Depot',
    branchIds: ['br-dha-02'],
    branchNames: ['Dhanmondi OPD'],
    status: 'active',
    joiningDate: '2024-01-02',
    qualification: 'B.Com (Accounting)',
    licenseNumber: 'N/A',
    lastActiveAt: '5 mins ago',
  },
  {
    id: 'staff-08',
    employeeId: 'EMP-PH-1008',
    fullName: 'Tariqul Islam',
    email: 'inventory.mgr@hospital.local',
    phone: '+880 1814 778899',
    roleSlug: 'inventory_manager',
    roleName: 'Inventory Manager',
    primaryBranchId: 'br-cms-01',
    primaryBranchName: 'Central Medical Store (CMS) - Main Depot',
    branchIds: ['br-cms-01', 'br-dha-02', 'br-mir-04'],
    branchNames: ['CMS Depot', 'Dhanmondi OPD', 'Mirpur Branch'],
    status: 'active',
    joiningDate: '2023-04-18',
    qualification: 'B.Pharm, Certified Inventory Specialist',
    licenseNumber: 'PCB Reg: B-11029',
    lastActiveAt: '40 mins ago',
  },
  {
    id: 'staff-09',
    employeeId: 'EMP-PH-1009',
    fullName: 'Monirul Haque',
    email: 'auditor@hospital.local',
    phone: '+880 1915 889900',
    roleSlug: 'auditor',
    roleName: 'Auditor',
    primaryBranchId: 'br-cms-01',
    primaryBranchName: 'Central Medical Store (CMS) - Main Depot',
    branchIds: ['br-cms-01', 'br-dha-02', 'br-utt-03', 'br-mir-04', 'br-ctg-05'],
    branchNames: ['All 5 Branches'],
    status: 'active',
    joiningDate: '2022-09-01',
    qualification: 'FCA, Quality & Regulatory Compliance Lead',
    licenseNumber: 'ICAB #1842',
    lastActiveAt: '3 hours ago',
  },
  {
    id: 'staff-10',
    employeeId: 'EMP-PH-1010',
    fullName: 'Shahidul Alam',
    email: 'former.staff@hospital.local',
    phone: '+880 1716 990011',
    roleSlug: 'pharmacy_assistant',
    roleName: 'Pharmacy Assistant',
    primaryBranchId: 'br-mir-04',
    primaryBranchName: 'Mirpur Branch Pharmacy',
    branchIds: ['br-mir-04'],
    branchNames: ['Mirpur Branch'],
    status: 'inactive',
    joiningDate: '2023-03-01',
    qualification: 'Diploma in Pharmacy',
    licenseNumber: 'PCB Reg: C-07821',
    lastActiveAt: '15 days ago',
  },
];

// Initial Seeded Pharmacy Audit Logs
export const INITIAL_PHARMACY_AUDIT_LOGS: PharmacyAuditLog[] = [
  {
    id: 'aud-01',
    action: 'staff.create',
    module: 'Staff Management',
    staffName: 'Sadia Afrin',
    employeeId: 'EMP-PH-1007',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    details: { role: 'Cashier', primaryBranch: 'Dhanmondi OPD', status: 'active' },
    ipAddress: '192.168.1.45',
    timestamp: 'Today, 10:45 AM',
  },
  {
    id: 'aud-02',
    action: 'role.update',
    module: 'Roles & RBAC',
    staffName: 'Md. Rafiqul Islam, M.Pharm',
    employeeId: 'EMP-PH-1001',
    branchName: 'All Branches',
    details: { role: 'Purchase Officer', note: 'Enforced separation of duties: removed purchases.approve' },
    ipAddress: '192.168.1.10',
    timestamp: 'Today, 09:30 AM',
  },
  {
    id: 'aud-03',
    action: 'purchases.approve',
    module: 'Purchase Orders',
    staffName: 'Dr. Shahed Kamal',
    employeeId: 'EMP-PH-1002',
    branchName: 'Central Medical Store (CMS)',
    details: { poNumber: 'PO-2026-0192', vendor: 'Square Pharmaceuticals Ltd.', valueBDT: 1850000 },
    ipAddress: '192.168.1.18',
    timestamp: 'Today, 08:15 AM',
  },
  {
    id: 'aud-04',
    action: 'staff.password_reset',
    module: 'Security & Access',
    staffName: 'Kamal Hossain',
    employeeId: 'EMP-PH-1006',
    branchName: 'Central Medical Store (CMS)',
    details: { reason: 'Scheduled 90-day mandatory credential rotation' },
    ipAddress: '192.168.1.10',
    timestamp: 'Yesterday, 04:30 PM',
  },
  {
    id: 'aud-05',
    action: 'staff.deactivate',
    module: 'Staff Management',
    staffName: 'Shahidul Alam',
    employeeId: 'EMP-PH-1010',
    branchName: 'Mirpur Branch Pharmacy',
    details: { reason: 'Resignation effective Feb 2026', revokedSessions: 2 },
    ipAddress: '192.168.1.10',
    timestamp: '2 days ago, 02:15 PM',
  },
  {
    id: 'aud-06',
    action: 'narcotics.audit',
    module: 'Narcotics Register',
    staffName: 'Monirul Haque',
    employeeId: 'EMP-PH-1009',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    details: { vaultStatus: '100% Reconciled', discrepancyUnits: 0 },
    ipAddress: '192.168.1.55',
    timestamp: '3 days ago, 11:00 AM',
  },
];

// Helper: Calculate effective permissions for a staff member
export const computeStaffPermissions = (
  staff: PharmacyStaffMember,
  rolesList: PharmacyRole[] = PREDEFINED_PHARMACY_ROLES
): string[] => {
  if (staff.status !== 'active') return [];

  const role = rolesList.find((r) => r.slug === staff.roleSlug);
  const basePermissions = role ? [...role.permissions] : [];

  if (staff.permissionOverrides && staff.permissionOverrides.length > 0) {
    staff.permissionOverrides.forEach((ov) => {
      if (ov.isGranted) {
        if (!basePermissions.includes(ov.permissionName)) {
          basePermissions.push(ov.permissionName);
        }
      } else {
        const idx = basePermissions.indexOf(ov.permissionName);
        if (idx !== -1) {
          basePermissions.splice(idx, 1);
        }
      }
    });
  }

  return basePermissions;
};

// Helper: Check if staff has a specific permission
export const checkStaffPermission = (
  staff: PharmacyStaffMember | null | undefined,
  permissionName: string,
  rolesList: PharmacyRole[] = PREDEFINED_PHARMACY_ROLES
): boolean => {
  if (!staff || staff.status !== 'active') return false;
  if (staff.roleSlug === 'pharmacy_admin') return true;

  const perms = computeStaffPermissions(staff, rolesList);
  return perms.includes(permissionName);
};

