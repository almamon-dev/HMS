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
  'quick-entry': 'entry-quick',
  '/dashboard/accountant/quick-entry': 'entry-quick',
  'multi-entry': 'entry-multi',
  '/dashboard/accountant/multi-entry': 'entry-multi',
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
  'journal': 'journal-entry',
  '/dashboard/accountant/journal': 'journal-entry',
  'payables': 'expenses-suppliers',
  '/dashboard/accountant/payables': 'expenses-suppliers',
  'doctor-share': 'expenses-doctors',
  '/dashboard/accountant/doctor-share': 'expenses-doctors',
  'payroll': 'expenses-payroll',
  '/dashboard/accountant/payroll': 'expenses-payroll',
  'day-book': 'books-day',
  '/dashboard/accountant/day-book': 'books-day',
  'cash-book': 'banking-accounts',
  '/dashboard/accountant/cash-book': 'banking-accounts',
  'banking': 'banking-accounts',
  '/dashboard/accountant/banking': 'banking-accounts',
  'reconciliation': 'banking-reconcile',
  '/dashboard/accountant/reconciliation': 'banking-reconcile',
  'ledger': 'books-ledger',
  '/dashboard/accountant/ledger': 'books-ledger',
  'parties': 'books-parties',
  '/dashboard/accountant/parties': 'books-parties',
  'reports': 'reports-summary',
  '/dashboard/accountant/reports': 'reports-summary',
  'reports/pnl': 'reports-pnl',
  '/dashboard/accountant/reports/pnl': 'reports-pnl',
  'reports/trial-balance': 'reports-trial-balance',
  '/dashboard/accountant/reports/trial-balance': 'reports-trial-balance',
  'reports/balance-sheet': 'reports-balance-sheet',
  '/dashboard/accountant/reports/balance-sheet': 'reports-balance-sheet',
  'reports/tax': 'reports-tax',
  '/dashboard/accountant/reports/tax': 'reports-tax',
  'coa': 'settings-coa',
  '/dashboard/accountant/coa': 'settings-coa',
  'periods': 'settings-periods',
  '/dashboard/accountant/periods': 'settings-periods',
  'audit-logs': 'settings-audit',
  '/dashboard/accountant/audit-logs': 'settings-audit',
  'settings': 'settings-mode',
  '/dashboard/accountant/settings': 'settings-mode',
};

export const ACCOUNTANT_MODULE_ROUTE_MAP: Record<string, string> = {
  'dashboard': '/dashboard/accountant',
  'entry-quick': '/dashboard/accountant/quick-entry',
  'entry-multi': '/dashboard/accountant/multi-entry',
  'billing-invoices': '/dashboard/accountant/invoices',
  'billing-collections': '/dashboard/accountant/collections',
  'billing-due': '/dashboard/accountant/receivables',
  'billing-refunds': '/dashboard/accountant/refunds',
  'expenses-vouchers': '/dashboard/accountant/vouchers',
  'journal-entry': '/dashboard/accountant/journal',
  'expenses-suppliers': '/dashboard/accountant/payables',
  'expenses-doctors': '/dashboard/accountant/doctor-share',
  'expenses-payroll': '/dashboard/accountant/payroll',
  'books-day': '/dashboard/accountant/day-book',
  'banking-accounts': '/dashboard/accountant/cash-book',
  'banking-reconcile': '/dashboard/accountant/reconciliation',
  'books-ledger': '/dashboard/accountant/ledger',
  'books-parties': '/dashboard/accountant/parties',
  'reports-summary': '/dashboard/accountant/reports',
  'reports-pnl': '/dashboard/accountant/reports/pnl',
  'reports-trial-balance': '/dashboard/accountant/reports/trial-balance',
  'reports-balance-sheet': '/dashboard/accountant/reports/balance-sheet',
  'reports-tax': '/dashboard/accountant/reports/tax',
  'settings-coa': '/dashboard/accountant/coa',
  'settings-periods': '/dashboard/accountant/periods',
  'settings-audit': '/dashboard/accountant/audit-logs',
  'settings-mode': '/dashboard/accountant/settings',
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
    title: 'Overview & Entry',
    items: [
      { id: 'dashboard', title: 'Dashboard / Overview', path: '/dashboard/accountant' },
      { id: 'entry-quick', title: 'Quick Entry (Single)', path: '/dashboard/accountant/quick-entry' },
      { id: 'entry-multi', title: 'Multi Entry (Batch)', path: '/dashboard/accountant/multi-entry' },
    ],
  },
  {
    title: 'Hospital Billing',
    items: [
      {
        id: 'billing-invoices',
        title: 'Hospital Billing',
        path: '/dashboard/accountant/invoices',
        subItems: [
          { id: 'billing-invoices', title: 'Patient Invoices', path: '/dashboard/accountant/invoices' },
          { id: 'billing-collections', title: 'Daily Collections', path: '/dashboard/accountant/collections' },
          { id: 'billing-due', title: 'Due & Receivables', path: '/dashboard/accountant/receivables' },
          { id: 'billing-refunds', title: 'Refund Clearance', path: '/dashboard/accountant/refunds' },
        ],
      },
    ],
  },
  {
    title: 'Vouchers & Payables',
    items: [
      {
        id: 'expenses-vouchers',
        title: 'Vouchers & Journal',
        path: '/dashboard/accountant/vouchers',
        subItems: [
          { id: 'expenses-vouchers', title: 'Vouchers Hub', path: '/dashboard/accountant/vouchers' },
          { id: 'journal-entry', title: 'Journal Entry (Dr/Cr)', path: '/dashboard/accountant/journal' },
          { id: 'expenses-suppliers', title: 'Supplier Payables', path: '/dashboard/accountant/payables' },
          { id: 'expenses-doctors', title: 'Doctor Share', path: '/dashboard/accountant/doctor-share' },
          { id: 'expenses-payroll', title: 'Staff Payroll', path: '/dashboard/accountant/payroll' },
        ],
      },
    ],
  },
  {
    title: 'Books & Ledgers',
    items: [
      {
        id: 'books-day',
        title: 'Books & Ledgers',
        path: '/dashboard/accountant/day-book',
        subItems: [
          { id: 'books-day', title: 'Day Book', path: '/dashboard/accountant/day-book' },
          { id: 'banking-accounts', title: 'Cash & Bank Book', path: '/dashboard/accountant/cash-book' },
          { id: 'banking-reconcile', title: 'Bank Reconciliation', path: '/dashboard/accountant/reconciliation' },
          { id: 'books-ledger', title: 'Account Ledger (GL)', path: '/dashboard/accountant/ledger' },
          { id: 'books-parties', title: 'Party Ledger & Ageing', path: '/dashboard/accountant/parties' },
        ],
      },
    ],
  },
  {
    title: 'Financial Reports',
    items: [
      {
        id: 'reports-pnl',
        title: 'Financial Statements',
        path: '/dashboard/accountant/reports/pnl',
        subItems: [
          { id: 'reports-pnl', title: 'Profit & Loss (P&L)', path: '/dashboard/accountant/reports/pnl' },
          { id: 'reports-trial-balance', title: 'Trial Balance', path: '/dashboard/accountant/reports/trial-balance' },
          { id: 'reports-balance-sheet', title: 'Balance Sheet', path: '/dashboard/accountant/reports/balance-sheet' },
          { id: 'reports-tax', title: 'Cash Flow & Tax/VAT', path: '/dashboard/accountant/reports/tax' },
        ],
      },
    ],
  },
  {
    title: 'Accounting Setup',
    items: [
      {
        id: 'settings-coa',
        title: 'Accounting Setup',
        path: '/dashboard/accountant/settings',
        subItems: [
          { id: 'settings-coa', title: 'Chart of Accounts', path: '/dashboard/accountant/coa' },
          { id: 'settings-periods', title: 'Fiscal Periods', path: '/dashboard/accountant/periods' },
          { id: 'settings-audit', title: 'Audit Logs', path: '/dashboard/accountant/audit-logs' },
          { id: 'settings-mode', title: 'Accounting Settings', path: '/dashboard/accountant/settings' },
        ],
      },
    ],
  },
];

// =============================================================================
// DUAL-MODE ACCOUNTING (SINGLE-ENTRY + DOUBLE-ENTRY) ARCHITECTURE (PHARMACY-CARE TEMPLATE)
// =============================================================================

export type AccountingMode = 'simple' | 'advanced';

export type CoaAccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

export type CoaReportGroup =
  | 'cash'
  | 'bank'
  | 'wallet'
  | 'receivable'
  | 'payable'
  | 'inventory'
  | 'fixed_asset'
  | 'revenue'
  | 'cogs'
  | 'operating_expense'
  | 'equity'
  | 'tax';

export interface CoaAccount {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  type: CoaAccountType;
  reportGroup: CoaReportGroup;
  normalBalance: 'Debit' | 'Credit';
  openingBalance: number;
  isSystem: boolean;
  isContra: boolean;
  isActive: boolean;
}

export interface SimpleEntryCategory {
  id: string;
  kind: 'income' | 'expense';
  code: string;
  nameEn: string;
  nameBn: string;
  targetAccountCode: string; // Credited on income, Debited on expense
}

export interface LedgerVoucherLine {
  id: string;
  accountCode: string;
  accountNameEn: string;
  debit: number;
  credit: number;
  partyName?: string;
  narration?: string;
}

export interface LedgerVoucher {
  id: string;
  voucherNo: string;
  type: 'income' | 'expense' | 'receipt' | 'payment' | 'contra' | 'journal';
  entryMethod: 'single' | 'multi' | 'double';
  date: string;
  status: 'posted' | 'pending_approval' | 'draft' | 'reversed';
  direction: 'in' | 'out' | 'transfer';
  amount: number;
  categoryEn: string;
  categoryBn: string;
  paymentChannel: 'Cash' | 'Bank' | 'bKash / Nagad' | 'Journal Ledger';
  partyName?: string;
  narration: string;
  branchName: string;
  createdBy: string;
  approvedBy?: string;
  isReversal?: boolean;
  reversalOfNo?: string;
  reversedByNo?: string;
  lines: LedgerVoucherLine[];
}

export interface AccountingParty {
  id: string;
  code: string;
  name: string;
  partyType: 'Patient / Corporate' | 'Supplier';
  phone: string;
  openingBalance: number;
  currentBalance: number;
  age0to30: number;
  age31to60: number;
  age60Plus: number;
  lastActivityDate: string;
}

export interface FiscalPeriod {
  id: string;
  yearName: string;
  periodNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'closed';
  closedAt?: string;
  closedBy?: string;
  reopenedReason?: string;
}

export interface AccountingSettingsState {
  mode: AccountingMode;
  fiscalYearStartMonth: number;
  vatEnabled: boolean;
  vatRatePercent: number;
  approvalThresholdBdt: number;
  defaultCashCode: string;
  defaultBankCode: string;
  defaultWalletCode: string;
}

export const DEFAULT_ACCOUNTING_SETTINGS: AccountingSettingsState = {
  mode: 'advanced',
  fiscalYearStartMonth: 7, // July (Bangladesh Standard FY)
  vatEnabled: true,
  vatRatePercent: 5,
  approvalThresholdBdt: 100000,
  defaultCashCode: '1010-01',
  defaultBankCode: '1020-01',
  defaultWalletCode: '1025-01',
};

// Perfectly Balanced Initial Chart of Accounts (Opening Assets = 137,450,000 === Opening Liabilities + Equity = 137,450,000)
export const INITIAL_COA_ACCOUNTS: CoaAccount[] = [
  // 1000 ASSETS (Total Opening = 137,450,000)
  { id: 'coa-1010-01', code: '1010-01', nameEn: 'Main Hospital Safe Vault (Liquid Cash)', nameBn: 'মূল ক্যাশ ভল্ট (নগদ)', type: 'asset', reportGroup: 'cash', normalBalance: 'Debit', openingBalance: 485000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-1020-01', code: '1020-01', nameEn: 'The City Bank PLC (Operations A/C)', nameBn: 'সিটি ব্যাংক লি. (অপারেশনস)', type: 'asset', reportGroup: 'bank', normalBalance: 'Debit', openingBalance: 42500000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-1020-02', code: '1020-02', nameEn: 'Dutch-Bangla Bank PLC (MFS & Card)', nameBn: 'ডাচ-বাংলা ব্যাংক (কার্ড ও এমএফএস)', type: 'asset', reportGroup: 'bank', normalBalance: 'Debit', openingBalance: 18200000, isSystem: false, isContra: false, isActive: true },
  { id: 'coa-1020-03', code: '1020-03', nameEn: 'BRAC Bank PLC (Payroll & Escrow)', nameBn: 'ব্র্যাক ব্যাংক (বেতন ও এসক্রো)', type: 'asset', reportGroup: 'bank', normalBalance: 'Debit', openingBalance: 14800000, isSystem: false, isContra: false, isActive: true },
  { id: 'coa-1025-01', code: '1025-01', nameEn: 'bKash / Nagad Merchant Wallet', nameBn: 'বিকাশ / নগদ মার্চেন্ট ওয়ালেট', type: 'asset', reportGroup: 'wallet', normalBalance: 'Debit', openingBalance: 1250000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-1030-01', code: '1030-01', nameEn: 'Pharmacy & Surgical Inventory Stock', nameBn: 'ফার্মেসি ও সার্জিক্যাল মজুদ পণ্য', type: 'asset', reportGroup: 'inventory', normalBalance: 'Debit', openingBalance: 24500000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-1040-01', code: '1040-01', nameEn: 'Accounts Receivable (Patient & Corporate)', nameBn: 'প্রাপ্য হিসাব (রোগী ও কর্পোরেট)', type: 'asset', reportGroup: 'receivable', normalBalance: 'Debit', openingBalance: 3715000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-1050-01', code: '1050-01', nameEn: 'Medical Equipment & OT Machinery', nameBn: 'মেডিকেল ইকুইপমেন্ট ও ওটি যন্ত্রপাতি', type: 'asset', reportGroup: 'fixed_asset', normalBalance: 'Debit', openingBalance: 32000000, isSystem: false, isContra: false, isActive: true },

  // 2000 LIABILITIES (Total Opening = 15,450,000)
  { id: 'coa-2010-01', code: '2010-01', nameEn: 'Accounts Payable (Pharma & Vendors)', nameBn: 'প্রদেয় হিসাব (সরবরাহকারী দেনা)', type: 'liability', reportGroup: 'payable', normalBalance: 'Credit', openingBalance: 12450000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-2020-01', code: '2020-01', nameEn: 'Patient IPD Advance Security Deposits', nameBn: 'ভর্তি রোগীদের অগ্রিম জামানত', type: 'liability', reportGroup: 'payable', normalBalance: 'Credit', openingBalance: 2240000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-2030-01', code: '2030-01', nameEn: 'Withholding Tax (TDS / AIT) Payable', nameBn: 'উৎসে কর (টিডিএস) প্রদেয়', type: 'liability', reportGroup: 'tax', normalBalance: 'Credit', openingBalance: 450000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-2030-02', code: '2030-02', nameEn: 'Mushak 6.3 Output VAT Payable', nameBn: 'ভ্যাট (মূসক ৬.৩) প্রদেয়', type: 'liability', reportGroup: 'tax', normalBalance: 'Credit', openingBalance: 310000, isSystem: true, isContra: false, isActive: true },

  // 3000 EQUITY (Total Opening = 122,000,000)
  { id: 'coa-3010-01', code: '3010-01', nameEn: 'Hospital Paid-Up Capital & Reserves', nameBn: 'মূলধন ও প্রাতিষ্ঠানিক রিজার্ভ', type: 'equity', reportGroup: 'equity', normalBalance: 'Credit', openingBalance: 100000000, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-3020-01', code: '3020-01', nameEn: 'Retained Operating Surplus (Prior FY)', nameBn: 'সংরক্ষিত উদ্বৃত্ত আয় (পূর্ববর্তী অর্থবছর)', type: 'equity', reportGroup: 'equity', normalBalance: 'Credit', openingBalance: 22000000, isSystem: true, isContra: false, isActive: true },

  // 4000 INCOME / REVENUE (Period activity begins at 0 opening, driven by vouchers)
  { id: 'coa-4010-01', code: '4010-01', nameEn: 'Inpatient (IPD) Bed, OT & Surgery Income', nameBn: 'ইনপেশেন্ট (IPD), বেড ও ওটি আয়', type: 'income', reportGroup: 'revenue', normalBalance: 'Credit', openingBalance: 0, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-4020-01', code: '4020-01', nameEn: 'Outpatient (OPD) Consultation Income', nameBn: 'আউটডোর (OPD) কনসাল্টেশন আয়', type: 'income', reportGroup: 'revenue', normalBalance: 'Credit', openingBalance: 0, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-4030-01', code: '4030-01', nameEn: 'Pathology, Lab & Radiology Diagnostic Income', nameBn: 'প্যাথলজি, ল্যাব ও ডায়াগনস্টিক আয়', type: 'income', reportGroup: 'revenue', normalBalance: 'Credit', openingBalance: 0, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-4040-01', code: '4040-01', nameEn: 'Pharmacy Sales & Dispensary Income', nameBn: 'ফার্মেসি ওষুধ বিক্রয় আয়', type: 'income', reportGroup: 'revenue', normalBalance: 'Credit', openingBalance: 0, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-4050-01', code: '4050-01', nameEn: 'Ambulance, Cafeteria & Misc. Income', nameBn: 'অ্যাম্বুলেন্স ও অন্যান্য আয়', type: 'income', reportGroup: 'revenue', normalBalance: 'Credit', openingBalance: 0, isSystem: false, isContra: false, isActive: true },

  // 5000 EXPENSES (Period activity driven by vouchers)
  { id: 'coa-5010-01', code: '5010-01', nameEn: 'Cost of Medicines & Surgical Supplies (COGS)', nameBn: 'ওষুধ ও সার্জিক্যাল সামগ্রী ক্রয় খরচ', type: 'expense', reportGroup: 'cogs', normalBalance: 'Debit', openingBalance: 0, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-5020-01', code: '5020-01', nameEn: 'Consultant Honorarium & Doctor Share', nameBn: 'ডাক্তার সম্মানী ও সার্জারি শেয়ার', type: 'expense', reportGroup: 'operating_expense', normalBalance: 'Debit', openingBalance: 0, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-5030-01', code: '5030-01', nameEn: 'Hospital Staff Salaries & Nursing Allowances', nameBn: 'স্টাফ বেতন ও নার্সিং ভাতা', type: 'expense', reportGroup: 'operating_expense', normalBalance: 'Debit', openingBalance: 0, isSystem: true, isContra: false, isActive: true },
  { id: 'coa-5040-01', code: '5040-01', nameEn: 'Utilities, Oxygen Plant & Generator Fuel', nameBn: 'বিদ্যুৎ, অক্সিজেন ও জেনারেটর খরচ', type: 'expense', reportGroup: 'operating_expense', normalBalance: 'Debit', openingBalance: 0, isSystem: false, isContra: false, isActive: true },
  { id: 'coa-5050-01', code: '5050-01', nameEn: 'Diagnostic Reagent & Equipment Maintenance', nameBn: 'ল্যাব রিএজেন্ট ও মেশিন মেইনটেন্যান্স', type: 'expense', reportGroup: 'operating_expense', normalBalance: 'Debit', openingBalance: 0, isSystem: false, isContra: false, isActive: true },
];

export const SIMPLE_ENTRY_CATEGORIES: SimpleEntryCategory[] = [
  // Income Categories
  { id: 'cat-inc-1', kind: 'income', code: 'INC-IPD', nameEn: 'IPD Admission & OT Collection', nameBn: 'ভর্তি রোগী ও অপারেশন আয়', targetAccountCode: '4010-01' },
  { id: 'cat-inc-2', kind: 'income', code: 'INC-OPD', nameEn: 'OPD Ticket & Consultation Income', nameBn: 'আউটডোর টিকেট ও ডাক্তার ভিজিট আয়', targetAccountCode: '4020-01' },
  { id: 'cat-inc-3', kind: 'income', code: 'INC-LAB', nameEn: 'Pathology & Radiology Tests', nameBn: 'প্যাথলজি ও এক্স-রে / আল্ট্রাসাউন্ড আয়', targetAccountCode: '4030-01' },
  { id: 'cat-inc-4', kind: 'income', code: 'INC-PHARM', nameEn: 'Pharmacy Counter Sales', nameBn: 'ফার্মেসি ওষুধ বিক্রয়', targetAccountCode: '4040-01' },
  { id: 'cat-inc-5', kind: 'income', code: 'INC-MISC', nameEn: 'Ambulance & Emergency Charges', nameBn: 'অ্যাম্বুলেন্স ও জরুরি সেবা আয়', targetAccountCode: '4050-01' },
  { id: 'cat-inc-6', kind: 'income', code: 'INC-REC', nameEn: 'Corporate / Patient Due Recovery', nameBn: 'বকেয়া বিল আদায়', targetAccountCode: '1040-01' },

  // Expense Categories
  { id: 'cat-exp-1', kind: 'expense', code: 'EXP-SUP', nameEn: 'Medicine & Consumables Purchase', nameBn: 'ওষুধ ও সার্জিক্যাল মালামাল ক্রয়', targetAccountCode: '5010-01' },
  { id: 'cat-exp-2', kind: 'expense', code: 'EXP-DOC', nameEn: 'Doctor Honorarium & Visit Share', nameBn: 'ডাক্তার সম্মানী প্রদান', targetAccountCode: '5020-01' },
  { id: 'cat-exp-3', kind: 'expense', code: 'EXP-SAL', nameEn: 'Staff Salary & Overtime', nameBn: 'স্টাফ বেতন ও ওভারটাইম', targetAccountCode: '5030-01' },
  { id: 'cat-exp-4', kind: 'expense', code: 'EXP-UTIL', nameEn: 'Electricity, Oxygen & Diesel', nameBn: 'বিদ্যুৎ, অক্সিজেন ও জেনারেটর তেল', targetAccountCode: '5040-01' },
  { id: 'cat-exp-5', kind: 'expense', code: 'EXP-LAB', nameEn: 'Lab Reagent & Equipment Repair', nameBn: 'ল্যাব রিএজেন্ট ও মেশিন মেরামত', targetAccountCode: '5050-01' },
  { id: 'cat-exp-6', kind: 'expense', code: 'EXP-AP', nameEn: 'Supplier Credit Bill Payment', nameBn: 'সাপ্লায়ার বকেয়া পরিশোধ', targetAccountCode: '2010-01' },
];

export const INITIAL_LEDGER_VOUCHERS: LedgerVoucher[] = [
  {
    id: 'vch-101',
    voucherNo: 'INC-2026-0841',
    type: 'income',
    entryMethod: 'single',
    date: '2026-11-28',
    status: 'posted',
    direction: 'in',
    amount: 485000,
    categoryEn: 'IPD Admission & OT Collection',
    categoryBn: 'ভর্তি রোগী ও অপারেশন আয়',
    paymentChannel: 'Bank',
    partyName: 'Ahsanul Haque Chowdhury (UHID-88412)',
    narration: 'Discharge final bill settlement - Cardiac OT & Cabin 402',
    branchName: 'Dhanmondi Central',
    createdBy: 'Sadia Afrin (Cashier)',
    lines: [
      { id: 'ln-1', accountCode: '1020-01', accountNameEn: 'The City Bank PLC (Operations A/C)', debit: 485000, credit: 0 },
      { id: 'ln-2', accountCode: '4010-01', accountNameEn: 'Inpatient (IPD) Bed, OT & Surgery Income', debit: 0, credit: 485000 },
    ],
  },
  {
    id: 'vch-102',
    voucherNo: 'INC-2026-0842',
    type: 'receipt',
    entryMethod: 'single',
    date: '2026-11-28',
    status: 'posted',
    direction: 'in',
    amount: 268000,
    categoryEn: 'Pathology & Radiology Tests',
    categoryBn: 'প্যাথলজি ও এক্স-রে / আল্ট্রাসাউন্ড আয়',
    paymentChannel: 'Cash',
    narration: 'Morning shift diagnostics counter collection (OPD & Emergency Lab)',
    branchName: 'Dhanmondi Central',
    createdBy: 'Sadia Afrin (Cashier)',
    lines: [
      { id: 'ln-3', accountCode: '1010-01', accountNameEn: 'Main Hospital Safe Vault (Liquid Cash)', debit: 268000, credit: 0 },
      { id: 'ln-4', accountCode: '4030-01', accountNameEn: 'Pathology, Lab & Radiology Diagnostic Income', debit: 0, credit: 268000 },
    ],
  },
  {
    id: 'vch-103',
    voucherNo: 'INC-2026-0843',
    type: 'income',
    entryMethod: 'single',
    date: '2026-11-28',
    status: 'posted',
    direction: 'in',
    amount: 194500,
    categoryEn: 'Pharmacy Counter Sales',
    categoryBn: 'ফার্মেসি ওষুধ বিক্রয়',
    paymentChannel: 'bKash / Nagad',
    narration: 'OPD Dispensary MFS automated settlement',
    branchName: 'Dhanmondi Central',
    createdBy: 'Farhan Chowdhury',
    lines: [
      { id: 'ln-5', accountCode: '1025-01', accountNameEn: 'bKash / Nagad Merchant Wallet', debit: 194500, credit: 0 },
      { id: 'ln-6', accountCode: '4040-01', accountNameEn: 'Pharmacy Sales & Dispensary Income', debit: 0, credit: 194500 },
    ],
  },
  {
    id: 'vch-104',
    voucherNo: 'EXP-2026-0311',
    type: 'expense',
    entryMethod: 'single',
    date: '2026-11-28',
    status: 'posted',
    direction: 'out',
    amount: 64000,
    categoryEn: 'Utilities, Oxygen & Diesel',
    categoryBn: 'বিদ্যুৎ, অক্সিজেন ও জেনারেটর তেল',
    paymentChannel: 'Cash',
    partyName: 'Linde Bangladesh Ltd (Oxygen Manifold)',
    narration: 'Liquid medical oxygen manifold refill + standby generator diesel',
    branchName: 'Dhanmondi Central',
    createdBy: 'Md. Rashedul Islam, ACA',
    lines: [
      { id: 'ln-7', accountCode: '5040-01', accountNameEn: 'Utilities, Oxygen Plant & Generator Fuel', debit: 64000, credit: 0 },
      { id: 'ln-8', accountCode: '1010-01', accountNameEn: 'Main Hospital Safe Vault (Liquid Cash)', debit: 0, credit: 64000 },
    ],
  },
  {
    id: 'vch-105',
    voucherNo: 'JV-2026-0119',
    type: 'journal',
    entryMethod: 'double',
    date: '2026-11-27',
    status: 'posted',
    direction: 'transfer',
    amount: 440400,
    categoryEn: 'Double-Entry Journal (Doctor Share & AIT)',
    categoryBn: 'জার্নাল ভাউচার (ডাক্তার সম্মানী ও ট্যাক্স)',
    paymentChannel: 'Journal Ledger',
    partyName: 'Prof. Dr. M. A. Hasan',
    narration: 'Accrual of Consultant Surgery Honorarium with 10% NBR Withholding Tax (AIT)',
    branchName: 'Dhanmondi Central',
    createdBy: 'Md. Rashedul Islam, ACA',
    approvedBy: 'Md. Rashedul Islam, ACA',
    lines: [
      { id: 'ln-9', accountCode: '5020-01', accountNameEn: 'Consultant Honorarium & Doctor Share', debit: 440400, credit: 0, partyName: 'Prof. Dr. M. A. Hasan' },
      { id: 'ln-10', accountCode: '2030-01', accountNameEn: 'Withholding Tax (TDS / AIT) Payable', debit: 0, credit: 44040, narration: '10% TDS under Section 52AA' },
      { id: 'ln-11', accountCode: '1020-01', accountNameEn: 'The City Bank PLC (Operations A/C)', debit: 0, credit: 396360, narration: 'Net BEFTN disbursement' },
    ],
  },
  {
    id: 'vch-106',
    voucherNo: 'PMT-2026-0208',
    type: 'payment',
    entryMethod: 'double',
    date: '2026-11-27',
    status: 'posted',
    direction: 'out',
    amount: 320000,
    categoryEn: 'Supplier Credit Bill Payment',
    categoryBn: 'সাপ্লায়ার বকেয়া পরিশোধ',
    paymentChannel: 'Bank',
    partyName: 'Square Pharmaceuticals PLC',
    narration: 'Settlement against GRN #GRN-2026-9910 & 9914 via City Bank Cheque',
    branchName: 'Dhanmondi Central',
    createdBy: 'Md. Rashedul Islam, ACA',
    lines: [
      { id: 'ln-12', accountCode: '2010-01', accountNameEn: 'Accounts Payable (Pharma & Vendors)', debit: 320000, credit: 0, partyName: 'Square Pharmaceuticals PLC' },
      { id: 'ln-13', accountCode: '1020-01', accountNameEn: 'The City Bank PLC (Operations A/C)', debit: 0, credit: 320000 },
    ],
  },
  {
    id: 'vch-107',
    voucherNo: 'CNT-2026-0044',
    type: 'contra',
    entryMethod: 'double',
    date: '2026-11-26',
    status: 'posted',
    direction: 'transfer',
    amount: 150000,
    categoryEn: 'Cash Vault to Bank Deposit (Contra)',
    categoryBn: 'ক্যাশ থেকে ব্যাংকে জমা (কন্ট্রা)',
    paymentChannel: 'Bank',
    narration: 'Cash-in-Transit deposit from safe vault to The City Bank PLC Operations Account',
    branchName: 'Dhanmondi Central',
    createdBy: 'Farhan Chowdhury',
    lines: [
      { id: 'ln-14', accountCode: '1020-01', accountNameEn: 'The City Bank PLC (Operations A/C)', debit: 150000, credit: 0 },
      { id: 'ln-15', accountCode: '1010-01', accountNameEn: 'Main Hospital Safe Vault (Liquid Cash)', debit: 0, credit: 150000 },
    ],
  },
  {
    id: 'vch-108',
    voucherNo: 'EXP-2026-0309',
    type: 'expense',
    entryMethod: 'single',
    date: '2026-11-26',
    status: 'pending_approval',
    direction: 'out',
    amount: 185000,
    categoryEn: 'Lab Reagent & Equipment Repair',
    categoryBn: 'ল্যাব রিএজেন্ট ও মেশিন মেরামত',
    paymentChannel: 'Bank',
    partyName: 'Roche Diagnostics BD',
    narration: 'Cobas e411 hs-Troponin reagent cartridge procurement (Above ৳100k approval threshold)',
    branchName: 'Dhanmondi Central',
    createdBy: 'Kamrul Hasan',
    lines: [
      { id: 'ln-16', accountCode: '5050-01', accountNameEn: 'Diagnostic Reagent & Equipment Maintenance', debit: 185000, credit: 0 },
      { id: 'ln-17', accountCode: '1020-01', accountNameEn: 'The City Bank PLC (Operations A/C)', debit: 0, credit: 185000 },
    ],
  },
];

export const INITIAL_ACCOUNTING_PARTIES: AccountingParty[] = [
  { id: 'pty-1', code: 'CORP-001', name: 'Grameenphone Corporate Medical Panel', partyType: 'Patient / Corporate', phone: '+880 1711-000111', openingBalance: 1450000, currentBalance: 1620000, age0to30: 1120000, age31to60: 350000, age60Plus: 150000, lastActivityDate: '2026-11-26' },
  { id: 'pty-2', code: 'CORP-002', name: 'BRAC Health Insurance Escrow', partyType: 'Patient / Corporate', phone: '+880 1712-333444', openingBalance: 980000, currentBalance: 1180000, age0to30: 840000, age31to60: 240000, age60Plus: 100000, lastActivityDate: '2026-11-25' },
  { id: 'pty-3', code: 'PAT-9042', name: 'Md. Golam Mostafa (ICU Credit Guarantee)', partyType: 'Patient / Corporate', phone: '+880 1819-551290', openingBalance: 320000, currentBalance: 415000, age0to30: 415000, age31to60: 0, age60Plus: 0, lastActivityDate: '2026-11-27' },
  { id: 'pty-4', code: 'SUP-101', name: 'Square Pharmaceuticals PLC', partyType: 'Supplier', phone: '+880 2-8833047', openingBalance: 4850000, currentBalance: 4530000, age0to30: 3100000, age31to60: 1430000, age60Plus: 0, lastActivityDate: '2026-11-27' },
  { id: 'pty-5', code: 'SUP-102', name: 'Incepta Pharmaceuticals Ltd', partyType: 'Supplier', phone: '+880 2-8891688', openingBalance: 3620000, currentBalance: 3890000, age0to30: 2650000, age31to60: 890000, age60Plus: 350000, lastActivityDate: '2026-11-24' },
  { id: 'pty-6', code: 'SUP-103', name: 'Roche Diagnostics BD / Medtech', partyType: 'Supplier', phone: '+880 1713-990221', openingBalance: 2140000, currentBalance: 2325000, age0to30: 1925000, age31to60: 400000, age60Plus: 0, lastActivityDate: '2026-11-26' },
];

export const INITIAL_FISCAL_PERIODS: FiscalPeriod[] = [
  { id: 'fp-1', yearName: 'FY 2026-2027', periodNumber: 1, name: 'July 2026', startDate: '2026-07-01', endDate: '2026-07-31', status: 'closed', closedAt: '2026-08-05', closedBy: 'Md. Rashedul Islam, ACA' },
  { id: 'fp-2', yearName: 'FY 2026-2027', periodNumber: 2, name: 'August 2026', startDate: '2026-08-01', endDate: '2026-08-31', status: 'closed', closedAt: '2026-09-04', closedBy: 'Md. Rashedul Islam, ACA' },
  { id: 'fp-3', yearName: 'FY 2026-2027', periodNumber: 3, name: 'September 2026', startDate: '2026-09-01', endDate: '2026-09-30', status: 'closed', closedAt: '2026-10-06', closedBy: 'Md. Rashedul Islam, ACA' },
  { id: 'fp-4', yearName: 'FY 2026-2027', periodNumber: 4, name: 'October 2026', startDate: '2026-10-01', endDate: '2026-10-31', status: 'closed', closedAt: '2026-11-05', closedBy: 'Md. Rashedul Islam, ACA' },
  { id: 'fp-5', yearName: 'FY 2026-2027', periodNumber: 5, name: 'November 2026', startDate: '2026-11-01', endDate: '2026-11-30', status: 'open' },
  { id: 'fp-6', yearName: 'FY 2026-2027', periodNumber: 6, name: 'December 2026', startDate: '2026-12-01', endDate: '2026-12-31', status: 'open' },
];

