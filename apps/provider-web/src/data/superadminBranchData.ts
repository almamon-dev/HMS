export interface HospitalBranchRecord {
  id: string;
  code: string;
  name: string;
  zone: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  incharge: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  operationTheatres: number;
  dailyFootfall: number;
  syncStatus: 'Real-Time Live' | 'Syncing' | 'Offline';
  status: 'Active' | 'Under Maintenance';
}

export interface BranchTransferRecord {
  id: string;
  transferNo: string;
  uhid: string;
  patientName: string;
  originBranch: string;
  destinationBranch: string;
  transferReason: string;
  transportMode: 'ICU Ambulance' | 'Standard Ambulance' | 'Air Ambulance';
  transferDate: string;
  status: 'In Transit' | 'Completed' | 'Pending Approval';
}

export const HOSPITAL_BRANCHES: HospitalBranchRecord[] = [
  {
    id: 'br-1',
    code: 'BR-DHA-01',
    name: 'Green Hospital Central (Dhanmondi)',
    zone: 'South Zone Flagship',
    city: 'Dhaka',
    address: 'House 32, Road 2, Dhanmondi R/A, Dhaka 1205',
    phone: '+880 2 9660015',
    email: 'dhanmondi@greenhospital.org',
    incharge: 'Dr. Mahmudul Hasan (Medical Director)',
    totalBeds: 450,
    availableBeds: 62,
    icuBeds: 48,
    operationTheatres: 12,
    dailyFootfall: 1420,
    syncStatus: 'Real-Time Live',
    status: 'Active',
  },
  {
    id: 'br-2',
    code: 'BR-UTT-02',
    name: 'Green Hospital North (Uttara)',
    zone: 'North Zone Hub',
    city: 'Dhaka',
    address: 'Plot 14, Sector 7, Jashimuddin Avenue, Uttara, Dhaka 1230',
    phone: '+880 2 8955210',
    email: 'uttara@greenhospital.org',
    incharge: 'Dr. Tariqul Anwar (Superintendent)',
    totalBeds: 250,
    availableBeds: 38,
    icuBeds: 24,
    operationTheatres: 6,
    dailyFootfall: 850,
    syncStatus: 'Real-Time Live',
    status: 'Active',
  },
  {
    id: 'br-3',
    code: 'BR-MIR-03',
    name: 'Green Hospital West (Mirpur)',
    zone: 'West Zone Specialized',
    city: 'Dhaka',
    address: 'Section 10, Mirpur Circle, Dhaka 1216',
    phone: '+880 2 9011400',
    email: 'mirpur@greenhospital.org',
    incharge: 'Dr. Sabrina Karim (Head of Operations)',
    totalBeds: 180,
    availableBeds: 29,
    icuBeds: 16,
    operationTheatres: 4,
    dailyFootfall: 640,
    syncStatus: 'Real-Time Live',
    status: 'Active',
  },
  {
    id: 'br-4',
    code: 'BR-CTG-04',
    name: 'Green Hospital Port City (Chattogram)',
    zone: 'Eastern Regional Centre',
    city: 'Chattogram',
    address: '68 Nasirabad Housing Society, Chattogram 4000',
    phone: '+880 31 658920',
    email: 'chattogram@greenhospital.org',
    incharge: 'Dr. Kamrul Islam (Regional Director)',
    totalBeds: 120,
    availableBeds: 18,
    icuBeds: 12,
    operationTheatres: 3,
    dailyFootfall: 490,
    syncStatus: 'Real-Time Live',
    status: 'Active',
  },
  {
    id: 'br-5',
    code: 'BR-SYL-05',
    name: 'Green Hospital Day Care (Sylhet)',
    zone: 'North-East Satellite',
    city: 'Sylhet',
    address: 'Zindabazar Point, Sylhet 3100',
    phone: '+880 821 720150',
    email: 'sylhet@greenhospital.org',
    incharge: 'Dr. Farhana Yasmin (Facility Lead)',
    totalBeds: 50,
    availableBeds: 14,
    icuBeds: 6,
    operationTheatres: 2,
    dailyFootfall: 210,
    syncStatus: 'Real-Time Live',
    status: 'Under Maintenance',
  },
];

export const BRANCH_TRANSFERS: BranchTransferRecord[] = [
  {
    id: 'tr-1',
    transferNo: 'TR-2026-081',
    uhid: 'UHID-2026-1005',
    patientName: 'Mushfiqur Rahman',
    originBranch: 'Uttara North Hub',
    destinationBranch: 'Dhanmondi Central',
    transferReason: 'Emergency Neurosurgery Suite & HDU bed required',
    transportMode: 'ICU Ambulance',
    transferDate: '2026-11-20 08:30 AM',
    status: 'Completed',
  },
  {
    id: 'tr-2',
    transferNo: 'TR-2026-082',
    uhid: 'UHID-2026-1007',
    patientName: 'Ashraful Haque',
    originBranch: 'Mirpur West',
    destinationBranch: 'Dhanmondi Central',
    transferReason: 'Cath Lab Angioplasty Intervention',
    transportMode: 'ICU Ambulance',
    transferDate: '2026-11-20 09:15 AM',
    status: 'In Transit',
  },
  {
    id: 'tr-3',
    transferNo: 'TR-2026-083',
    uhid: 'UHID-2026-1014',
    patientName: 'Kazi Nurul Huda',
    originBranch: 'Sylhet Day Care',
    destinationBranch: 'Dhanmondi Central',
    transferReason: 'Advanced Oncology 3T MRI & Chemotherapy regimen',
    transportMode: 'Air Ambulance',
    transferDate: '2026-11-19 04:00 PM',
    status: 'Completed',
  },
  {
    id: 'tr-4',
    transferNo: 'TR-2026-084',
    uhid: 'UHID-2026-1019',
    patientName: 'Tahmina Begum',
    originBranch: 'Dhanmondi Central',
    destinationBranch: 'Mirpur West',
    transferReason: 'Step-down Orthopedic Rehabilitation Ward transfer',
    transportMode: 'Standard Ambulance',
    transferDate: '2026-11-20 10:45 AM',
    status: 'Pending Approval',
  },
];

// Department Overview Records for Multi-Branch Comparison

export interface BranchAppointmentOverview {
  branchId: string;
  branchName: string;
  totalAppointment: number;
  doctorApproved: string;
  onlineAppointment: number;
  onlineAmount: number;
  liveConsult: number;
  offlineDesk: string;
  patientPaid: number;
  totalPaid: number;
}

export interface BranchOpdOverview {
  branchId: string;
  branchName: string;
  totalOpd: number;
  rechecked: number;
  paidAmount: number;
  totalPaid: number;
}

export interface BranchIpdOverview {
  branchId: string;
  branchName: string;
  totalIpd: number;
  discharged: number;
  paidAmount: number;
  totalPaid: number;
}

export interface BranchOtOverview {
  branchId: string;
  branchName: string;
  totalOtCases: number;
  totalOperation: number;
}

export interface BranchPharmacyOverview {
  branchId: string;
  branchName: string;
  totalBill: number;
  billAmount: number;
  paid: number;
  totalPaid: number;
}

export interface BranchPathologyOverview {
  branchId: string;
  branchName: string;
  totalBill: number;
  totalBillAmount: number;
  totalPaid: number;
}

export interface BranchRadiologyOverview {
  branchId: string;
  branchName: string;
  totalBill: number;
  totalBillAmount: number;
  totalPaid: number;
}

export interface BranchBloodIssueOverview {
  branchId: string;
  branchName: string;
  totalBill: number;
  totalBillAmount: number;
  totalPaid: number;
}

export interface BranchAmbulanceOverview {
  branchId: string;
  branchName: string;
  totalBill: number;
  totalBillAmount: number;
  totalPaid: number;
}

export interface BranchBloodDonorOverview {
  branchId: string;
  branchName: string;
  totalDonor: number;
  totalDonation: number;
}

export interface BranchBirthRecordOverview {
  branchId: string;
  branchName: string;
  totalBirth: number;
}

export interface BranchDeathRecordOverview {
  branchId: string;
  branchName: string;
  totalDeath: number;
}

export interface BranchFinanceOverview {
  branchId: string;
  branchName: string;
  totalIncome: number;
  totalExpense: number;
}

export interface BranchPayrollOverview {
  branchId: string;
  branchName: string;
  totalStaff: number;
  grossSalary: number;
  totalDeductions: number;
  netAmount: number;
  totalPaid: number;
}

export const BRANCH_APPOINTMENT_DATA: BranchAppointmentOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalAppointment: 38,
    doctorApproved: '94% (36)',
    onlineAppointment: 8,
    onlineAmount: 4800.0,
    liveConsult: 8,
    offlineDesk: '78% (30)',
    patientPaid: 32,
    totalPaid: 19200.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalAppointment: 24,
    doctorApproved: '91% (22)',
    onlineAppointment: 5,
    onlineAmount: 3000.0,
    liveConsult: 5,
    offlineDesk: '79% (19)',
    patientPaid: 20,
    totalPaid: 12000.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalAppointment: 16,
    doctorApproved: '87% (14)',
    onlineAppointment: 3,
    onlineAmount: 1800.0,
    liveConsult: 3,
    offlineDesk: '81% (13)',
    patientPaid: 14,
    totalPaid: 8400.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalAppointment: 12,
    doctorApproved: '91% (11)',
    onlineAppointment: 2,
    onlineAmount: 1200.0,
    liveConsult: 2,
    offlineDesk: '83% (10)',
    patientPaid: 10,
    totalPaid: 6000.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalAppointment: 6,
    doctorApproved: '100% (6)',
    onlineAppointment: 1,
    onlineAmount: 600.0,
    liveConsult: 1,
    offlineDesk: '83% (5)',
    patientPaid: 5,
    totalPaid: 3000.0,
  },
];

export const BRANCH_OPD_DATA: BranchOpdOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalOpd: 142,
    rechecked: 38,
    paidAmount: 85200.0,
    totalPaid: 85200.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalOpd: 84,
    rechecked: 22,
    paidAmount: 50400.0,
    totalPaid: 50400.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalOpd: 56,
    rechecked: 15,
    paidAmount: 33600.0,
    totalPaid: 33600.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalOpd: 39,
    rechecked: 9,
    paidAmount: 23400.0,
    totalPaid: 23400.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalOpd: 18,
    rechecked: 4,
    paidAmount: 10800.0,
    totalPaid: 10800.0,
  },
];

export const BRANCH_IPD_DATA: BranchIpdOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalIpd: 64,
    discharged: 18,
    paidAmount: 384000.0,
    totalPaid: 384000.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalIpd: 36,
    discharged: 11,
    paidAmount: 216000.0,
    totalPaid: 216000.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalIpd: 24,
    discharged: 8,
    paidAmount: 144000.0,
    totalPaid: 144000.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalIpd: 16,
    discharged: 5,
    paidAmount: 96000.0,
    totalPaid: 96000.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalIpd: 8,
    discharged: 3,
    paidAmount: 48000.0,
    totalPaid: 48000.0,
  },
];

export const BRANCH_OT_DATA: BranchOtOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalOtCases: 14,
    totalOperation: 12,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalOtCases: 8,
    totalOperation: 7,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalOtCases: 5,
    totalOperation: 4,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalOtCases: 3,
    totalOperation: 3,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalOtCases: 1,
    totalOperation: 1,
  },
];

export const BRANCH_PHARMACY_DATA: BranchPharmacyOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalBill: 164,
    billAmount: 184500.0,
    paid: 158,
    totalPaid: 178200.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalBill: 96,
    billAmount: 108000.0,
    paid: 92,
    totalPaid: 103500.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalBill: 62,
    billAmount: 69750.0,
    paid: 60,
    totalPaid: 67500.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalBill: 41,
    billAmount: 46125.0,
    paid: 39,
    totalPaid: 43875.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalBill: 22,
    billAmount: 24750.0,
    paid: 21,
    totalPaid: 23625.0,
  },
];

export const BRANCH_PATHOLOGY_DATA: BranchPathologyOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalBill: 112,
    totalBillAmount: 145600.0,
    totalPaid: 145600.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalBill: 68,
    totalBillAmount: 88400.0,
    totalPaid: 88400.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalBill: 44,
    totalBillAmount: 57200.0,
    totalPaid: 57200.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalBill: 28,
    totalBillAmount: 36400.0,
    totalPaid: 36400.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalBill: 15,
    totalBillAmount: 19500.0,
    totalPaid: 19500.0,
  },
];

export const BRANCH_RADIOLOGY_DATA: BranchRadiologyOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalBill: 78,
    totalBillAmount: 187200.0,
    totalPaid: 187200.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalBill: 46,
    totalBillAmount: 110400.0,
    totalPaid: 110400.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalBill: 31,
    totalBillAmount: 74400.0,
    totalPaid: 74400.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalBill: 20,
    totalBillAmount: 48000.0,
    totalPaid: 48000.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalBill: 9,
    totalBillAmount: 21600.0,
    totalPaid: 21600.0,
  },
];

export const BRANCH_BLOOD_ISSUE_DATA: BranchBloodIssueOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalBill: 34,
    totalBillAmount: 68000.0,
    totalPaid: 68000.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalBill: 18,
    totalBillAmount: 36000.0,
    totalPaid: 36000.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalBill: 12,
    totalBillAmount: 24000.0,
    totalPaid: 24000.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalBill: 8,
    totalBillAmount: 16000.0,
    totalPaid: 16000.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalBill: 4,
    totalBillAmount: 8000.0,
    totalPaid: 8000.0,
  },
];

export const BRANCH_AMBULANCE_DATA: BranchAmbulanceOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalBill: 22,
    totalBillAmount: 55000.0,
    totalPaid: 55000.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalBill: 14,
    totalBillAmount: 35000.0,
    totalPaid: 35000.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalBill: 9,
    totalBillAmount: 22500.0,
    totalPaid: 22500.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalBill: 6,
    totalBillAmount: 15000.0,
    totalPaid: 15000.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalBill: 3,
    totalBillAmount: 7500.0,
    totalPaid: 7500.0,
  },
];

export const BRANCH_BLOOD_DONOR_DATA: BranchBloodDonorOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalDonor: 48,
    totalDonation: 52,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalDonor: 26,
    totalDonation: 28,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalDonor: 18,
    totalDonation: 19,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalDonor: 12,
    totalDonation: 12,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalDonor: 6,
    totalDonation: 6,
  },
];

export const BRANCH_BIRTH_RECORD_DATA: BranchBirthRecordOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalBirth: 19,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalBirth: 11,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalBirth: 7,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalBirth: 4,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalBirth: 2,
  },
];

export const BRANCH_DEATH_RECORD_DATA: BranchDeathRecordOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalDeath: 3,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalDeath: 2,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalDeath: 1,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalDeath: 1,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalDeath: 0,
  },
];

export const BRANCH_FINANCE_DATA: BranchFinanceOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalIncome: 856000.0,
    totalExpense: 342000.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalIncome: 486000.0,
    totalExpense: 194000.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalIncome: 312000.0,
    totalExpense: 125000.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalIncome: 218000.0,
    totalExpense: 87000.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalIncome: 114000.0,
    totalExpense: 45000.0,
  },
];

export const BRANCH_PAYROLL_DATA: BranchPayrollOverview[] = [
  {
    branchId: 'br-1',
    branchName: 'Green Hospital Central (Main Branch)',
    totalStaff: 284,
    grossSalary: 11360000.0,
    totalDeductions: 568000.0,
    netAmount: 10792000.0,
    totalPaid: 10792000.0,
  },
  {
    branchId: 'br-2',
    branchName: 'Green Hospital North',
    totalStaff: 156,
    grossSalary: 6240000.0,
    totalDeductions: 312000.0,
    netAmount: 5928000.0,
    totalPaid: 5928000.0,
  },
  {
    branchId: 'br-3',
    branchName: 'Green Hospital West',
    totalStaff: 112,
    grossSalary: 4480000.0,
    totalDeductions: 224000.0,
    netAmount: 4256000.0,
    totalPaid: 4256000.0,
  },
  {
    branchId: 'br-4',
    branchName: 'Green Hospital Port City',
    totalStaff: 78,
    grossSalary: 3120000.0,
    totalDeductions: 156000.0,
    netAmount: 2964000.0,
    totalPaid: 2964000.0,
  },
  {
    branchId: 'br-5',
    branchName: 'Green Hospital Sylhet',
    totalStaff: 36,
    grossSalary: 1440000.0,
    totalDeductions: 72000.0,
    netAmount: 1368000.0,
    totalPaid: 1368000.0,
  },
];


