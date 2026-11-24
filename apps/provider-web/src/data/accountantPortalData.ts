export interface AccountantProfile {
  name: string;
  roleName: string;
  email: string;
  phone: string;
  certNo: string;
  branchName: string;
  branchCode: string;
  status: 'active';
}

export const CURRENT_ACCOUNTANT: AccountantProfile = {
  name: 'Md. Rashedul Islam, ACA',
  roleName: 'Chief Hospital Accountant & Financial Controller',
  email: 'accountant@hospital.local',
  phone: '+880 1711 987654',
  certNo: 'ICAB #21408 · Fellow Chartered Accountant',
  branchName: 'Green Life Hospital Central (Dhanmondi)',
  branchCode: 'DHA-01',
  status: 'active',
};

export const ACCOUNTANT_ROUTE_TO_MODULE_MAP: Record<string, string> = {
  '': 'dashboard',
  'dashboard': 'dashboard',
  '/dashboard/accountant': 'dashboard',
  'invoices': 'billing-invoices',
  '/dashboard/accountant/invoices': 'billing-invoices',
  'collections': 'billing-collections',
  '/dashboard/accountant/collections': 'billing-collections',
  'receivables': 'billing-due',
  '/dashboard/accountant/receivables': 'billing-due',
  'refunds': 'billing-refunds',
  '/dashboard/accountant/refunds': 'billing-refunds',
  'vouchers': 'expenses-vouchers',
  '/dashboard/accountant/vouchers': 'expenses-vouchers',
  'payables': 'expenses-suppliers',
  '/dashboard/accountant/payables': 'expenses-suppliers',
  'doctor-share': 'expenses-doctors',
  '/dashboard/accountant/doctor-share': 'expenses-doctors',
  'payroll': 'expenses-payroll',
  '/dashboard/accountant/payroll': 'expenses-payroll',
  'banking': 'banking-accounts',
  '/dashboard/accountant/banking': 'banking-accounts',
  'reconciliation': 'banking-reconcile',
  '/dashboard/accountant/reconciliation': 'banking-reconcile',
  'reports': 'reports-summary',
  '/dashboard/accountant/reports': 'reports-summary',
  'reports/pnl': 'reports-pnl',
  '/dashboard/accountant/reports/pnl': 'reports-pnl',
  'reports/balance-sheet': 'reports-balance-sheet',
  '/dashboard/accountant/reports/balance-sheet': 'reports-balance-sheet',
  'reports/tax': 'reports-tax',
  '/dashboard/accountant/reports/tax': 'reports-tax',
  'settings': 'settings-coa',
  '/dashboard/accountant/settings': 'settings-coa',
  'audit-logs': 'settings-audit',
  '/dashboard/accountant/audit-logs': 'settings-audit',
};

export const ACCOUNTANT_MODULE_ROUTE_MAP: Record<string, string> = {
  'dashboard': '/dashboard/accountant',
  'billing-invoices': '/dashboard/accountant/invoices',
  'billing-collections': '/dashboard/accountant/collections',
  'billing-due': '/dashboard/accountant/receivables',
  'billing-refunds': '/dashboard/accountant/refunds',
  'expenses-vouchers': '/dashboard/accountant/vouchers',
  'expenses-suppliers': '/dashboard/accountant/payables',
  'expenses-doctors': '/dashboard/accountant/doctor-share',
  'expenses-payroll': '/dashboard/accountant/payroll',
  'banking-accounts': '/dashboard/accountant/banking',
  'banking-reconcile': '/dashboard/accountant/reconciliation',
  'reports-summary': '/dashboard/accountant/reports',
  'reports-pnl': '/dashboard/accountant/reports/pnl',
  'reports-balance-sheet': '/dashboard/accountant/reports/balance-sheet',
  'reports-tax': '/dashboard/accountant/reports/tax',
  'settings-coa': '/dashboard/accountant/settings',
  'settings-audit': '/dashboard/accountant/audit-logs',
};

// 1. IPD Patient Discharge Billing & Clearance Queue
export interface IpdDischargeQueueItem {
  id: string;
  invoiceNo: string;
  patientName: string;
  uhid: string;
  bedNumber: string;
  admissionDate: string;
  dischargeDate: string;
  department: string;
  consultantName: string;
  bedCharges: number;
  otCharges: number;
  doctorCharges: number;
  medicineCharges: number;
  diagnosticCharges: number;
  grossAmount: number;
  advancePaid: number;
  discountApproved: number;
  netPayable: number;
  status: 'Pending Clearance' | 'Cleared' | 'Under Review';
}

export const IPD_DISCHARGE_QUEUE_DATA: IpdDischargeQueueItem[] = [
  {
    id: 'IPD-01',
    invoiceNo: 'INV-IPD-2026-4019',
    patientName: 'Mrs. Rokeya Begum (54F)',
    uhid: 'UHID-GLH-09821',
    bedNumber: 'Cabin 402 (Deluxe)',
    admissionDate: '2026-11-18',
    dischargeDate: '2026-11-24',
    department: 'General Surgery & Laparoscopy',
    consultantName: 'Prof. Dr. M. A. Hasan',
    bedCharges: 36000,
    otCharges: 45000,
    doctorCharges: 22000,
    medicineCharges: 28400,
    diagnosticCharges: 14500,
    grossAmount: 145900,
    advancePaid: 80000,
    discountApproved: 5000,
    netPayable: 60900,
    status: 'Pending Clearance',
  },
  {
    id: 'IPD-02',
    invoiceNo: 'INV-IPD-2026-4018',
    patientName: 'Kazi Tanvir Ahmed (42M)',
    uhid: 'UHID-GLH-09744',
    bedNumber: 'ICU Bed 06',
    admissionDate: '2026-11-19',
    dischargeDate: '2026-11-24',
    department: 'Critical Care & Cardiology',
    consultantName: 'Dr. Shahed Kamal, MD',
    bedCharges: 75000,
    otCharges: 65000,
    doctorCharges: 35000,
    medicineCharges: 88500,
    diagnosticCharges: 32000,
    grossAmount: 295500,
    advancePaid: 200000,
    discountApproved: 0,
    netPayable: 95500,
    status: 'Pending Clearance',
  },
  {
    id: 'IPD-03',
    invoiceNo: 'INV-IPD-2026-4015',
    patientName: 'Shahidul Islam (61M)',
    uhid: 'UHID-GLH-09612',
    bedNumber: 'Cabin 308',
    admissionDate: '2026-11-20',
    dischargeDate: '2026-11-24',
    department: 'Orthopedics & Joint Care',
    consultantName: 'Prof. Dr. A.K. Azad',
    bedCharges: 24000,
    otCharges: 35000,
    doctorCharges: 18000,
    medicineCharges: 19500,
    diagnosticCharges: 11200,
    grossAmount: 107700,
    advancePaid: 60000,
    discountApproved: 3500,
    netPayable: 44200,
    status: 'Pending Clearance',
  },
  {
    id: 'IPD-04',
    invoiceNo: 'INV-IPD-2026-4011',
    patientName: 'Taslima Akhter (29F)',
    uhid: 'UHID-GLH-09553',
    bedNumber: 'Post-Operative Ward 12',
    admissionDate: '2026-11-21',
    dischargeDate: '2026-11-24',
    department: 'Obstetrics & Gynecology',
    consultantName: 'Dr. Nusrat Jahan, FCPS',
    bedCharges: 18000,
    otCharges: 32000,
    doctorCharges: 15000,
    medicineCharges: 14800,
    diagnosticCharges: 8500,
    grossAmount: 88300,
    advancePaid: 50000,
    discountApproved: 0,
    netPayable: 38300,
    status: 'Cleared',
  },
  {
    id: 'IPD-05',
    invoiceNo: 'INV-IPD-2026-4009',
    patientName: 'Farhan Chowdhury (35M)',
    uhid: 'UHID-GLH-09489',
    bedNumber: 'Cabin 505',
    admissionDate: '2026-11-22',
    dischargeDate: '2026-11-24',
    department: 'Nephrology & Dialysis',
    consultantName: 'Dr. Tariqul Islam',
    bedCharges: 16000,
    otCharges: 0,
    doctorCharges: 12000,
    medicineCharges: 22400,
    diagnosticCharges: 16800,
    grossAmount: 67200,
    advancePaid: 40000,
    discountApproved: 2000,
    netPayable: 25200,
    status: 'Cleared',
  },
];

// 2. Daily Counter Cash Collection & Shift Closing Records
export interface DailyCounterCollectionRecord {
  id: string;
  counterName: string;
  counterCode: string;
  cashierName: string;
  shift: 'Morning (08:00 - 16:00)' | 'Evening (16:00 - 23:00)' | 'Night (23:00 - 08:00)';
  billsCount: number;
  cashCollected: number;
  cardCollected: number;
  mfsCollected: number;
  totalCollection: number;
  status: 'Open / Collecting' | 'Shift Closed / Handed Over' | 'Deposited to Vault';
}

export const DAILY_COUNTER_COLLECTIONS_DATA: DailyCounterCollectionRecord[] = [
  {
    id: 'CTR-01',
    counterName: 'OPD Central Billing Counter 01',
    counterCode: 'CTR-DHA-OPD1',
    cashierName: 'Sadia Afrin',
    shift: 'Morning (08:00 - 16:00)',
    billsCount: 84,
    cashCollected: 145000,
    cardCollected: 92000,
    mfsCollected: 48000,
    totalCollection: 285000,
    status: 'Open / Collecting',
  },
  {
    id: 'CTR-02',
    counterName: 'OPD Diagnostic & Lab Cash Counter 02',
    counterCode: 'CTR-DHA-LAB2',
    cashierName: 'Kamal Hossain',
    shift: 'Morning (08:00 - 16:00)',
    billsCount: 96,
    cashCollected: 182000,
    cardCollected: 110000,
    mfsCollected: 64000,
    totalCollection: 356000,
    status: 'Open / Collecting',
  },
  {
    id: 'CTR-03',
    counterName: 'IPD Admission & Discharge Cash Desk',
    counterCode: 'CTR-DHA-IPD',
    cashierName: 'Tanvir Hasan',
    shift: 'Morning (08:00 - 16:00)',
    billsCount: 18,
    cashCollected: 310000,
    cardCollected: 185000,
    mfsCollected: 42000,
    totalCollection: 537000,
    status: 'Open / Collecting',
  },
  {
    id: 'CTR-04',
    counterName: '24/7 Emergency Billing Counter',
    counterCode: 'CTR-DHA-EMG',
    cashierName: 'Monirul Haque',
    shift: 'Morning (08:00 - 16:00)',
    billsCount: 42,
    cashCollected: 94000,
    cardCollected: 38000,
    mfsCollected: 26000,
    totalCollection: 158000,
    status: 'Open / Collecting',
  },
  {
    id: 'CTR-05',
    counterName: 'Central OPD Pharmacy Retail POS',
    counterCode: 'CTR-DHA-PHARM',
    cashierName: 'Nusrat Jahan, B.Pharm',
    shift: 'Morning (08:00 - 16:00)',
    billsCount: 164,
    cashCollected: 128500,
    cardCollected: 62000,
    mfsCollected: 34500,
    totalCollection: 225000,
    status: 'Open / Collecting',
  },
  {
    id: 'CTR-06',
    counterName: 'Night Shift Consolidated Emergency Desk',
    counterCode: 'CTR-DHA-NIGHT',
    cashierName: 'Farhan Chowdhury',
    shift: 'Night (23:00 - 08:00)',
    billsCount: 31,
    cashCollected: 76000,
    cardCollected: 28000,
    mfsCollected: 18000,
    totalCollection: 122000,
    status: 'Deposited to Vault',
  },
];

// 3. Expense Vouchers & Petty Cash Records
export interface ExpenseVoucherRecord {
  id: string;
  voucherNo: string;
  date: string;
  category: 'Hospital Dietary & Kitchen' | 'Medical Gases & Oxygen' | 'Facility Maintenance' | 'Laundry & Sanitization' | 'Fuel & Ambulance Transport' | 'Office & Admin Printing';
  payee: string;
  description: string;
  costCenter: string;
  amount: number;
  paymentMethod: 'Cash Float' | 'Account Payee Cheque' | 'Corporate Bank EFT';
  approvedBy: string;
  status: 'Approved & Paid' | 'Pending Review' | 'Draft';
}

export const EXPENSE_VOUCHERS_DATA: ExpenseVoucherRecord[] = [
  {
    id: 'VOU-101',
    voucherNo: 'VOU-GLH-2026-891',
    date: '2026-11-24',
    category: 'Medical Gases & Oxygen',
    payee: 'Linde Bangladesh Ltd',
    description: 'Emergency liquid oxygen manifold refill (Cylinder tank #4)',
    costCenter: 'ICU & Medical Gas Manifold',
    amount: 145000,
    paymentMethod: 'Corporate Bank EFT',
    approvedBy: 'Prof. Dr. A.K. Azad (Medical Director)',
    status: 'Approved & Paid',
  },
  {
    id: 'VOU-102',
    voucherNo: 'VOU-GLH-2026-890',
    date: '2026-11-24',
    category: 'Facility Maintenance',
    payee: 'Siemens Healthineers Service BD',
    description: 'Scheduled preventive maintenance of 128-slice CT scanner',
    costCenter: 'Radiology & Imaging',
    amount: 88000,
    paymentMethod: 'Account Payee Cheque',
    approvedBy: 'Md. Rashedul Islam (Chief Accountant)',
    status: 'Approved & Paid',
  },
  {
    id: 'VOU-103',
    voucherNo: 'VOU-GLH-2026-889',
    date: '2026-11-23',
    category: 'Laundry & Sanitization',
    payee: 'CleanCare Hospital Hygiene Services',
    description: 'OT linen autoclaving, patient gowns & bedsheet commercial wash',
    costCenter: 'Hospital Housekeeping & OT',
    amount: 32500,
    paymentMethod: 'Cash Float',
    approvedBy: 'Hospital Superintendent',
    status: 'Approved & Paid',
  },
  {
    id: 'VOU-104',
    voucherNo: 'VOU-GLH-2026-888',
    date: '2026-11-23',
    category: 'Hospital Dietary & Kitchen',
    payee: 'Meghna Agro & Dairy Supplies',
    description: 'In-patient clinical diet supplies (organic milk, chicken, vegetables)',
    costCenter: 'IPD Clinical Nutrition & Kitchen',
    amount: 46200,
    paymentMethod: 'Cash Float',
    approvedBy: 'Hospital Superintendent',
    status: 'Approved & Paid',
  },
  {
    id: 'VOU-105',
    voucherNo: 'VOU-GLH-2026-887',
    date: '2026-11-23',
    category: 'Fuel & Ambulance Transport',
    payee: 'Padma Oil Filling Station',
    description: 'Diesel fuel refill for 3 ICU ambulances & 500kVA backup generator',
    costCenter: 'Ambulance & Facility Power',
    amount: 54000,
    paymentMethod: 'Account Payee Cheque',
    approvedBy: 'Md. Rashedul Islam (Chief Accountant)',
    status: 'Approved & Paid',
  },
];

// 4. Accounts Payable & Supplier Bills (3-Way Matching)
export interface SupplierPayableRecord {
  id: string;
  supplierName: string;
  category: 'Pharmaceuticals' | 'Medical Devices' | 'Diagnostic Reagents' | 'Surgical Consumables';
  taxInvoiceNo: string;
  poNumber: string;
  grnNumber: string;
  billDate: string;
  dueDate: string;
  grossAmount: number;
  taxDeductedSource: number;
  netPayable: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Pending 3-Way Verification' | 'Approved for Payment' | 'Settled';
}

export const SUPPLIER_PAYABLES_DATA: SupplierPayableRecord[] = [
  {
    id: 'AP-01',
    supplierName: 'Square Pharmaceuticals PLC',
    category: 'Pharmaceuticals',
    taxInvoiceNo: 'INV-SQ-2026-9041',
    poNumber: 'PO-PH-2026-081',
    grnNumber: 'GRN-CMS-2026-119',
    billDate: '2026-11-05',
    dueDate: '2026-11-28',
    grossAmount: 850000,
    taxDeductedSource: 42500,
    netPayable: 807500,
    paidAmount: 500000,
    balanceDue: 307500,
    status: 'Approved for Payment',
  },
  {
    id: 'AP-02',
    supplierName: 'Beximco Pharmaceuticals Ltd',
    category: 'Pharmaceuticals',
    taxInvoiceNo: 'INV-BX-2026-8812',
    poNumber: 'PO-PH-2026-083',
    grnNumber: 'GRN-CMS-2026-121',
    billDate: '2026-11-10',
    dueDate: '2026-12-05',
    grossAmount: 640000,
    taxDeductedSource: 32000,
    netPayable: 608000,
    paidAmount: 0,
    balanceDue: 608000,
    status: 'Approved for Payment',
  },
  {
    id: 'AP-03',
    supplierName: 'Incepta Pharmaceuticals Ltd',
    category: 'Pharmaceuticals',
    taxInvoiceNo: 'INV-INC-2026-7740',
    poNumber: 'PO-PH-2026-084',
    grnNumber: 'GRN-CMS-2026-122',
    billDate: '2026-11-12',
    dueDate: '2026-12-08',
    grossAmount: 520000,
    taxDeductedSource: 26000,
    netPayable: 494000,
    paidAmount: 0,
    balanceDue: 494000,
    status: 'Approved for Payment',
  },
  {
    id: 'AP-04',
    supplierName: 'Roche Diagnostics Bangladesh',
    category: 'Diagnostic Reagents',
    taxInvoiceNo: 'INV-ROCHE-2026-310',
    poNumber: 'PO-LAB-2026-039',
    grnNumber: 'GRN-LAB-2026-055',
    billDate: '2026-11-08',
    dueDate: '2026-11-30',
    grossAmount: 420000,
    taxDeductedSource: 21000,
    netPayable: 399000,
    paidAmount: 200000,
    balanceDue: 199000,
    status: 'Approved for Payment',
  },
  {
    id: 'AP-05',
    supplierName: 'Johnson & Johnson Medical Devices',
    category: 'Surgical Consumables',
    taxInvoiceNo: 'INV-JNJ-2026-112',
    poNumber: 'PO-OT-2026-028',
    grnNumber: 'GRN-OT-2026-042',
    billDate: '2026-11-14',
    dueDate: '2026-12-12',
    grossAmount: 380000,
    taxDeductedSource: 19000,
    netPayable: 361000,
    paidAmount: 0,
    balanceDue: 361000,
    status: 'Pending 3-Way Verification',
  },
];

// 5. Doctor Honorarium & Visiting Fee Sharing Engine
export interface DoctorHonorariumRecord {
  id: string;
  doctorName: string;
  department: string;
  qualification: string;
  opdVisitsCount: number;
  opdShareBdt: number;
  otSurgeriesCount: number;
  otShareBdt: number;
  grossEarnings: number;
  taxWithholdingAit: number; // 10% AIT per NBR rule
  netDisbursement: number;
  bankAccountNumber: string;
  status: 'Ready for BEFTN Transfer' | 'Disbursed';
}

export const DOCTOR_HONORARIUM_DATA: DoctorHonorariumRecord[] = [
  {
    id: 'DOC-HON-01',
    doctorName: 'Prof. Dr. M. A. Hasan',
    department: 'General & Laparoscopic Surgery',
    qualification: 'FCPS, FRCS (Glasgow)',
    opdVisitsCount: 142,
    opdShareBdt: 170400,
    otSurgeriesCount: 18,
    otShareBdt: 270000,
    grossEarnings: 440400,
    taxWithholdingAit: 44040,
    netDisbursement: 396360,
    bankAccountNumber: 'City Bank · 1102983741001',
    status: 'Ready for BEFTN Transfer',
  },
  {
    id: 'DOC-HON-02',
    doctorName: 'Prof. Dr. A.K. Azad',
    department: 'Orthopedics & Joint Replacement',
    qualification: 'MS (Ortho), FICS',
    opdVisitsCount: 118,
    opdShareBdt: 141600,
    otSurgeriesCount: 14,
    otShareBdt: 252000,
    grossEarnings: 393600,
    taxWithholdingAit: 39360,
    netDisbursement: 354240,
    bankAccountNumber: 'BRAC Bank · 1502204918201',
    status: 'Ready for BEFTN Transfer',
  },
  {
    id: 'DOC-HON-03',
    doctorName: 'Dr. Nusrat Jahan',
    department: 'Obstetrics & Gynecology',
    qualification: 'FCPS (Gynae), MRCOG (UK)',
    opdVisitsCount: 165,
    opdShareBdt: 198000,
    otSurgeriesCount: 12,
    otShareBdt: 180000,
    grossEarnings: 378000,
    taxWithholdingAit: 37800,
    netDisbursement: 340200,
    bankAccountNumber: 'DBBL · 108120038914',
    status: 'Ready for BEFTN Transfer',
  },
  {
    id: 'DOC-HON-04',
    doctorName: 'Dr. Shahed Kamal',
    department: 'Cardiology & Interventional Care',
    qualification: 'MD (Cardiology), FCPS',
    opdVisitsCount: 130,
    opdShareBdt: 156000,
    otSurgeriesCount: 9,
    otShareBdt: 162000,
    grossEarnings: 318000,
    taxWithholdingAit: 31800,
    netDisbursement: 286200,
    bankAccountNumber: 'Eastern Bank · 104106029811',
    status: 'Ready for BEFTN Transfer',
  },
];

// 6. Bank Accounts, Treasury & Vault Records
export interface BankAccountRecord {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  routingNumber: string;
  currentBookBalance: number;
  uncreditedDeposits: number;
  unpresentedCheques: number;
  reconciledBankBalance: number;
  status: 'Active';
}

export const BANK_ACCOUNTS_DATA: BankAccountRecord[] = [
  {
    id: 'BNK-01',
    bankName: 'The City Bank PLC',
    accountName: 'Green Life Hospital Ltd - Main Operations',
    accountNumber: '110-2849104-001',
    branch: 'Dhanmondi Branch, Dhaka',
    routingNumber: '225271842',
    currentBookBalance: 34500000,
    uncreditedDeposits: 450000,
    unpresentedCheques: 380000,
    reconciledBankBalance: 34570000,
    status: 'Active',
  },
  {
    id: 'BNK-02',
    bankName: 'Dutch-Bangla Bank PLC (DBBL)',
    accountName: 'Green Life Hospital Ltd - MFS & Card Collection',
    accountNumber: '108-110-098273',
    branch: 'Satmasjid Road Branch, Dhaka',
    routingNumber: '090272941',
    currentBookBalance: 18200000,
    uncreditedDeposits: 620000,
    unpresentedCheques: 150000,
    reconciledBankBalance: 18670000,
    status: 'Active',
  },
  {
    id: 'BNK-03',
    bankName: 'BRAC Bank PLC',
    accountName: 'Green Life Hospital Ltd - Payroll & Escrow',
    accountNumber: '150-120-482910',
    branch: 'Gulshan 1 Branch, Dhaka',
    routingNumber: '060261948',
    currentBookBalance: 14800000,
    uncreditedDeposits: 0,
    unpresentedCheques: 840000,
    reconciledBankBalance: 13960000,
    status: 'Active',
  },
];

// 7. Financial Audit Logs
export interface FinancialAuditLogRecord {
  id: string;
  timestamp: string;
  staffName: string;
  staffRole: string;
  action: string;
  module: string;
  amount: number;
  referenceNo: string;
  ipAddress: string;
}

export const FINANCIAL_AUDIT_LOGS_DATA: FinancialAuditLogRecord[] = [
  {
    id: 'LOG-01',
    timestamp: '2026-11-24 10:35:12',
    staffName: 'Md. Rashedul Islam',
    staffRole: 'Chief Accountant',
    action: 'IPD Discharge Clearance Approved',
    module: 'IPD Billing',
    amount: 60900,
    referenceNo: 'INV-IPD-2026-4019',
    ipAddress: '192.168.10.42',
  },
  {
    id: 'LOG-02',
    timestamp: '2026-11-24 09:48:30',
    staffName: 'Sadia Afrin',
    staffRole: 'Senior Cashier',
    action: 'Counter Shift Morning Started',
    module: 'Cash Counter',
    amount: 145000,
    referenceNo: 'CTR-DHA-OPD1',
    ipAddress: '192.168.10.15',
  },
  {
    id: 'LOG-03',
    timestamp: '2026-11-24 09:15:04',
    staffName: 'Md. Rashedul Islam',
    staffRole: 'Chief Accountant',
    action: 'Expense Voucher Authorized',
    module: 'Petty Cash',
    amount: 145000,
    referenceNo: 'VOU-GLH-2026-891',
    ipAddress: '192.168.10.42',
  },
  {
    id: 'LOG-04',
    timestamp: '2026-11-23 18:20:00',
    staffName: 'Farhan Chowdhury',
    staffRole: 'Vault In-Charge',
    action: 'Day-End Cash Vault Deposit Sealed',
    module: 'Vault & CIT',
    amount: 122000,
    referenceNo: 'VAULT-DEP-2026-11-23',
    ipAddress: '192.168.10.28',
  },
];

export interface AccountantNavItem {
  id: string;
  title: string;
  path: string;
  subItems?: { id: string; title: string; path: string }[];
}

export interface AccountantNavSection {
  title: string;
  items: AccountantNavItem[];
}

export const ACCOUNTANT_NAV_SECTIONS: AccountantNavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', title: 'Financial Dashboard', path: '/dashboard/accountant' },
    ],
  },
  {
    title: 'Income & Billing',
    items: [
      {
        id: 'billing-invoices',
        title: 'Patient Billing & Invoices',
        path: '/dashboard/accountant/invoices',
        subItems: [
          { id: 'billing-invoices', title: 'Patient Invoices', path: '/dashboard/accountant/invoices' },
          { id: 'billing-collections', title: 'Daily Counter Collections', path: '/dashboard/accountant/collections' },
          { id: 'billing-due', title: 'Due & Outstanding Ledger', path: '/dashboard/accountant/receivables' },
          { id: 'billing-refunds', title: 'Refund Clearance', path: '/dashboard/accountant/refunds' },
        ],
      },
    ],
  },
  {
    title: 'Expenses & Payables',
    items: [
      {
        id: 'expenses-vouchers',
        title: 'Expense Vouchers & Petty Cash',
        path: '/dashboard/accountant/vouchers',
        subItems: [
          { id: 'expenses-vouchers', title: 'Expense Vouchers', path: '/dashboard/accountant/vouchers' },
          { id: 'expenses-suppliers', title: 'Supplier & Vendor Bills (AP)', path: '/dashboard/accountant/payables' },
          { id: 'expenses-doctors', title: 'Doctor Share & Honorarium', path: '/dashboard/accountant/doctor-share' },
          { id: 'expenses-payroll', title: 'Payroll & Staff Salary', path: '/dashboard/accountant/payroll' },
        ],
      },
    ],
  },
  {
    title: 'Treasury & Banking',
    items: [
      {
        id: 'banking-accounts',
        title: 'Bank Accounts & Vault Cash',
        path: '/dashboard/accountant/banking',
        subItems: [
          { id: 'banking-accounts', title: 'Bank Accounts', path: '/dashboard/accountant/banking' },
          { id: 'banking-reconcile', title: 'Bank Reconciliation (BRS)', path: '/dashboard/accountant/reconciliation' },
        ],
      },
    ],
  },
  {
    title: 'Reports & Tax',
    items: [
      {
        id: 'reports-summary',
        title: 'Financial Statements Hub',
        path: '/dashboard/accountant/reports',
        subItems: [
          { id: 'reports-summary', title: 'Statements Overview', path: '/dashboard/accountant/reports' },
          { id: 'reports-pnl', title: 'Profit & Loss (P&L)', path: '/dashboard/accountant/reports/pnl' },
          { id: 'reports-balance-sheet', title: 'Balance Sheet & Cash Flow', path: '/dashboard/accountant/reports/balance-sheet' },
          { id: 'reports-tax', title: 'Tax & NBR VAT (Mushak 6.3)', path: '/dashboard/accountant/reports/tax' },
        ],
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'settings-coa',
        title: 'Chart of Accounts (COA)',
        path: '/dashboard/accountant/settings',
        subItems: [
          { id: 'settings-coa', title: 'Chart of Accounts', path: '/dashboard/accountant/settings' },
          { id: 'settings-audit', title: 'Financial Audit Logs', path: '/dashboard/accountant/audit-logs' },
        ],
      },
    ],
  },
];
