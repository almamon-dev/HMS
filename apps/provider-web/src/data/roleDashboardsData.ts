export interface RoleDashboardKpi {
  label: string;
  value: string;
  note: string;
}

export interface RoleDashboardMenuItem {
  id: string;
  label: string;
}

export interface RoleDashboardRow {
  code: string;
  subject: string;
  meta: string;
  time: string;
  status: string;
}

export interface RoleWorkspaceConfig {
  navItems: RoleDashboardMenuItem[];
  kpis: RoleDashboardKpi[];
  tableTitle: string;
  columns: [string, string, string, string, string];
  rows: RoleDashboardRow[];
}

export const ROLE_WORKSPACES: Record<string, RoleWorkspaceConfig> = {
  admin: {
    navItems: [
      { id: 'overview', label: 'Operations Overview' },
      { id: 'departments', label: 'Departments & Units' },
      { id: 'staff', label: 'Staff Roster' },
      { id: 'approvals', label: 'Pending Approvals' },
    ],
    kpis: [
      { label: 'Active Departments', value: '14 Units', note: 'All OPD wings operational' },
      { label: 'On-Duty Staff', value: '186 Staff', note: 'Doctors, nurses & technicians' },
      { label: 'OPD Tokens Today', value: '312 Visits', note: '94% on-schedule flow' },
      { label: 'Bed Occupancy', value: '82%', note: '410 / 500 inpatient beds' },
    ],
    tableTitle: 'Department Operations & Roster Status',
    columns: ['Unit ID', 'Department / Wing', 'In-Charge Lead', 'Shift', 'Status'],
    rows: [
      { code: 'OPS-01', subject: 'Cardiology & Cath Lab', meta: 'Prof. Dr. Tanvir Ahmed', time: 'Morning / 24h', status: 'Active' },
      { code: 'OPS-02', subject: 'Chest Medicine OPD', meta: 'Prof. Dr. M. Delwar Hossain', time: 'Evening Chamber', status: 'Active' },
      { code: 'OPS-03', subject: 'Emergency & Trauma ICU', meta: 'Dr. Mahmudul Hasan', time: '24/7 Duty', status: 'On Duty' },
      { code: 'OPS-04', subject: 'Diagnostics Reception', meta: 'Mirpur & Uttara Wings', time: '08:00 AM - 10:00 PM', status: 'Active' },
    ],
  },
  doctor: {
    navItems: [
      { id: 'consults', label: 'OPD Consultation Queue' },
      { id: 'prescriptions', label: 'E-Prescriptions' },
      { id: 'ipd-rounds', label: 'IPD Rounds' },
      { id: 'schedule', label: 'Chamber Schedule' },
    ],
    kpis: [
      { label: 'Appointments Today', value: '24 Patients', note: '14 completed • 10 waiting' },
      { label: 'Video Tele-Consults', value: '5 Calls', note: 'Next at 04:00 PM' },
      { label: 'E-Prescriptions Issued', value: '14 Signed', note: 'Synced with Pharmacy' },
      { label: 'Lab Reviews Pending', value: '6 Reports', note: 'Pathology & MRI' },
    ],
    tableTitle: 'Today Specialist Consultation Queue',
    columns: ['Token', 'Patient Name', 'Visit Type', 'Slot Time', 'Status'],
    rows: [
      { code: 'OPD-201', subject: 'Md. Rahim Uddin (48M)', meta: 'In-Person OPD • Follow-up', time: '04:00 PM', status: 'Waiting' },
      { code: 'OPD-202', subject: 'Mrs. Nasrin Akter (36F)', meta: 'In-Person OPD • New Consult', time: '04:15 PM', status: 'Checked In' },
      { code: 'VID-014', subject: 'Tanvir Mahmud (54M)', meta: 'Video Consult • Report Review', time: '05:00 PM', status: 'Scheduled' },
      { code: 'OPD-198', subject: 'Salma Khatun (62F)', meta: 'In-Person OPD • Cardiology', time: '03:30 PM', status: 'Completed' },
    ],
  },
  nurse: {
    navItems: [
      { id: 'wards', label: 'Ward Bed Assignments' },
      { id: 'vitals', label: 'Vitals & Charts' },
      { id: 'meds', label: 'Medication Rounds' },
      { id: 'handover', label: 'Shift Handover' },
    ],
    kpis: [
      { label: 'Assigned Ward Beds', value: '22 Patients', note: 'Level 3 Surgical & ICU' },
      { label: 'Vitals Due This Hour', value: '7 Charts', note: 'BP, SpO2 & Temp checks' },
      { label: 'Scheduled IV Meds', value: '11 Doses', note: 'All pharmacy verified' },
      { label: 'Discharge Prep', value: '3 Cases', note: 'Awaiting clearance slip' },
    ],
    tableTitle: 'Inpatient Ward & Nursing Care Queue',
    columns: ['Bed ID', 'Patient Name', 'Care Protocol', 'Next Round', 'Status'],
    rows: [
      { code: 'ICU-302', subject: 'Abdul Kader (66M)', meta: 'Post-Op Cardiac Monitoring', time: '03:00 PM', status: 'Stable' },
      { code: 'WRD-309', subject: 'Farida Begum (52F)', meta: 'IV Antibiotic & Vitals Chart', time: '03:15 PM', status: 'Due' },
      { code: 'WRD-314', subject: 'Kamal Hossain (41M)', meta: 'Nebulization + SpO2 Watch', time: '03:30 PM', status: 'Completed' },
      { code: 'CAB-405', subject: 'Sadia Rahman (29F)', meta: 'Discharge Counseling', time: '04:30 PM', status: 'Ready' },
    ],
  },
  pharmacist: {
    navItems: [
      { id: 'dispense', label: 'Prescription Dispensing' },
      { id: 'inventory', label: 'Medicine Stock' },
      { id: 'alerts', label: 'Expiry & Low Stock' },
      { id: 'billing', label: 'Pharmacy Invoices' },
    ],
    kpis: [
      { label: 'Prescriptions Queue', value: '19 Orders', note: 'OPD & IPD indents' },
      { label: 'Dispensed Today', value: '142 Bills', note: '৳ 92,400 total turnover' },
      { label: 'Low-Stock Items', value: '8 SKUs', note: 'Reorder requests drafted' },
      { label: 'Expiring in 30 Days', value: '3 Batches', note: 'Flagged in stock ledger' },
    ],
    tableTitle: 'E-Prescription Dispensing Queue',
    columns: ['Rx ID', 'Patient & Ward', 'Items Prescribed', 'Time', 'Status'],
    rows: [
      { code: 'RX-8841', subject: 'Salma Khatun (OPD)', meta: '5 Items • Cardiology', time: '03:40 PM', status: 'Ready' },
      { code: 'RX-8842', subject: 'Bed #ICU-302 (IPD)', meta: '3 Injectable Units', time: '03:45 PM', status: 'Urgent' },
      { code: 'RX-8839', subject: 'Tariq Aziz (OPD)', meta: '4 Items • Chest Medicine', time: '03:20 PM', status: 'Dispensed' },
      { code: 'RX-8837', subject: 'Nusrat Jahan (OPD)', meta: '2 Items • Pediatrics', time: '03:10 PM', status: 'Dispensed' },
    ],
  },
  pathologist: {
    navItems: [
      { id: 'samples', label: 'Sample Collection Queue' },
      { id: 'results', label: 'Result Entry' },
      { id: 'verified', label: 'Verified Lab Reports' },
      { id: 'qc', label: 'Lab QC Logs' },
    ],
    kpis: [
      { label: 'Samples Collected', value: '96 Tubes', note: 'Hematology & Biochemistry' },
      { label: 'Pending Verification', value: '12 Reports', note: 'Awaiting pathologist sign-off' },
      { label: 'Reports Published', value: '74 Ready', note: 'Delivered to patient portal' },
      { label: 'Avg Turnaround', value: '2.8 Hrs', note: 'Within SLA target' },
    ],
    tableTitle: 'Pathology Sample & Sign-Off Queue',
    columns: ['Lab ID', 'Patient Name', 'Test Panel', 'Collected', 'Status'],
    rows: [
      { code: 'LAB-5021', subject: 'Md. Rafiqul Islam', meta: 'CBC with ESR + HbA1c', time: '01:15 PM', status: 'Pending Sign-off' },
      { code: 'LAB-5022', subject: 'Ayesha Siddika', meta: 'Fasting Lipid Profile', time: '01:30 PM', status: 'In Analyzer' },
      { code: 'LAB-5018', subject: 'Mahmudul Karim', meta: 'Serum Creatinine & Electrolytes', time: '11:45 AM', status: 'Published' },
      { code: 'LAB-5015', subject: 'Rehana Begum', meta: 'TSH & Liver Function Panel', time: '10:30 AM', status: 'Published' },
    ],
  },
  radiologist: {
    navItems: [
      { id: 'worklist', label: 'Imaging Worklist' },
      { id: 'reporting', label: 'Impression & Dictation' },
      { id: 'archive', label: 'PACS Studies' },
      { id: 'schedule', label: 'Modality Schedule' },
    ],
    kpis: [
      { label: 'Imaging Orders Today', value: '38 Scans', note: 'MRI, CT, X-Ray & USG' },
      { label: 'Pending Reporting', value: '9 Studies', note: '3 Priority STAT scans' },
      { label: 'Signed Impressions', value: '29 Ready', note: 'Synced to EMR' },
      { label: 'Active Modalities', value: '4 Suites', note: '3T MRI • 128-Slice CT • 4D USG' },
    ],
    tableTitle: 'Radiology PACS Worklist',
    columns: ['Study ID', 'Patient Name', 'Imaging Modality', 'Scan Time', 'Status'],
    rows: [
      { code: 'RAD-309', subject: 'Ashraf Ali (57M)', meta: '3 Tesla Brain & Spine MRI', time: '02:10 PM', status: 'STAT Review' },
      { code: 'RAD-310', subject: 'Taslima Begum (44F)', meta: 'Whole Abdomen 4D USG', time: '02:35 PM', status: 'Reporting' },
      { code: 'RAD-305', subject: 'Jahirul Islam (35M)', meta: 'Chest X-Ray Digital (PA)', time: '01:20 PM', status: 'Finalized' },
      { code: 'RAD-302', subject: 'Farhana Yasmin (50F)', meta: 'HRCT Chest Scan', time: '12:05 PM', status: 'Finalized' },
    ],
  },
  accountant: {
    navItems: [
      { id: 'collections', label: 'Daily Collections' },
      { id: 'invoices', label: 'OPD & IPD Billing' },
      { id: 'expenses', label: 'Expense Vouchers' },
      { id: 'summary', label: 'Financial Reports' },
    ],
    kpis: [
      { label: 'Today Collection', value: '৳ 4,18,500', note: 'Cash, Card & MFS combined' },
      { label: 'OPD Receipts', value: '198 Bills', note: 'Consultation & Diagnostic' },
      { label: 'IPD Settlements', value: '6 Discharges', note: '৳ 1,85,200 cleared' },
      { label: 'Pending Receivables', value: '4 Accounts', note: 'Corporate billing claims' },
    ],
    tableTitle: 'Recent Billing & Payment Transactions',
    columns: ['Invoice', 'Patient / Account', 'Department / Service', 'Time', 'Status'],
    rows: [
      { code: 'INV-9412', subject: 'Md. Sohel Rana', meta: 'Master Health Checkup • ৳ 3,800', time: '03:35 PM', status: 'Paid' },
      { code: 'INV-9411', subject: 'Sadia Rahman', meta: 'IPD Cabin Settlement • ৳ 42,500', time: '03:10 PM', status: 'Settled' },
      { code: 'INV-9409', subject: 'Tanvir Mahmud', meta: 'Cardiology OPD • ৳ 1,200', time: '02:45 PM', status: 'Paid' },
      { code: 'INV-9405', subject: 'Corporate Insurance #12', meta: 'Corporate Invoice • ৳ 68,000', time: '01:15 PM', status: 'Pending' },
    ],
  },
  receptionist: {
    navItems: [
      { id: 'appointments', label: 'Appointment Desk' },
      { id: 'checkin', label: 'Patient Registration' },
      { id: 'calls', label: 'Hotline & Enquiry Log' },
      { id: 'visitors', label: 'Visitor Passes' },
    ],
    kpis: [
      { label: 'Checked-In Today', value: '164 Patients', note: 'Dhanmondi Front Desk' },
      { label: 'Online Bookings', value: '48 Serials', note: 'Synced from Web Portal' },
      { label: 'Hotline Enquiries', value: '39 Calls', note: '10678 desk logs' },
      { label: 'Active Queues', value: '6 Counters', note: 'Average wait < 6 mins' },
    ],
    tableTitle: 'Front Desk Serial & Check-In Queue',
    columns: ['Serial', 'Patient Name', 'Requested Service', 'Appointment', 'Status'],
    rows: [
      { code: 'APT-2026-4120', subject: 'Md. Rafiqul Islam', meta: 'Prof. Dr. Tanvir Ahmed (Cardiology)', time: '04:00 PM', status: 'Arrived' },
      { code: 'APT-2026-4121', subject: 'Nadia Sultana', meta: 'Chest Medicine • Dhanmondi', time: '04:30 PM', status: 'Confirmed' },
      { code: 'APT-2026-4115', subject: 'Habibullah Khan', meta: 'Executive Full-Body Checkup', time: '03:00 PM', status: 'Checked In' },
      { code: 'APT-2026-4110', subject: 'Farhana Akter', meta: 'Video Consult Follow-up', time: '05:00 PM', status: 'Scheduled' },
    ],
  },
  patient: {
    navItems: [
      { id: 'my-appointments', label: 'My Appointments' },
      { id: 'prescriptions', label: 'My E-Prescriptions' },
      { id: 'lab-reports', label: 'Diagnostic Reports' },
      { id: 'billing', label: 'Invoices & Receipts' },
    ],
    kpis: [
      { label: 'Upcoming Visits', value: '1 Serial', note: 'Prof. Dr. Tanvir Ahmed' },
      { label: 'Active Prescriptions', value: '2 Scripts', note: 'Updated last week' },
      { label: 'Ready Lab Reports', value: '3 PDFs', note: 'CBC, Lipid Profile, ECG' },
      { label: 'Total Unpaid Dues', value: '৳ 0', note: 'All invoices settled' },
    ],
    tableTitle: 'My Recent Appointments & Diagnostic Reports',
    columns: ['Ref ID', 'Service / Consultant', 'Hospital Campus', 'Date', 'Status'],
    rows: [
      { code: 'APT-2026-3892', subject: 'Prof. Dr. Tanvir Ahmed (Cardiology)', meta: 'Dhanmondi • Room 302', time: 'Today, 06:00 PM', status: 'Confirmed' },
      { code: 'LAB-5011', subject: 'Complete Blood Count (CBC)', meta: 'Dhanmondi Pathology Lab', time: '18 Nov 2026', status: 'Report Ready' },
      { code: 'RX-8710', subject: 'Medicine Follow-up Prescription', meta: 'Dr. Sadia Afrin', time: '12 Nov 2026', status: 'Active' },
      { code: 'INV-9204', subject: 'Cardiac Wellness Screening', meta: 'Paid ৳ 5,900', time: '10 Nov 2026', status: 'Settled' },
    ],
  },
};

