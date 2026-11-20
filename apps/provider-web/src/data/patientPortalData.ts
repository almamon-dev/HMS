export interface PatientSubNavItem {
  id: string;
  title: string;
  badge?: string | number;
}

export interface PatientNavItem {
  id: string;
  title: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
  subItems?: PatientSubNavItem[];
}

export interface PatientNavSection {
  title: string;
  items: PatientNavItem[];
}

export const PATIENT_NAV_SECTIONS: PatientNavSection[] = [
  {
    title: 'MY HEALTH',
    items: [
      { id: 'dashboard', title: 'Dashboard', icon: 'Home' },
      { id: 'profile', title: 'My Profile', icon: 'User' },
      { id: 'appointments', title: 'My Appointments', icon: 'FilePenLine', badge: 1, badgeColor: 'bg-emerald-50 text-[#006a4e]' },
      { id: 'find-doctor', title: 'Find a Doctor', icon: 'Search' },
      { id: 'my-doctors', title: 'My Doctors', icon: 'Stethoscope' },
    ],
  },
  {
    title: 'MEDICAL RECORDS',
    items: [
      { id: 'medical-history', title: 'Medical History', icon: 'FileText' },
      { id: 'prescriptions', title: 'Prescriptions', icon: 'BookOpen', badge: 3, badgeColor: 'bg-cyan-50 text-cyan-700' },
      { id: 'lab-reports', title: 'Lab Reports', icon: 'FlaskConical', badge: 2, badgeColor: 'bg-amber-50 text-amber-700' },
      { id: 'radiology-reports', title: 'Radiology Reports', icon: 'Scan' },
      { id: 'vitals', title: 'My Vitals', icon: 'Activity' },
      { id: 'medical-documents', title: 'Medical Documents', icon: 'FolderArchive' },
    ],
  },
  {
    title: 'HOSPITAL SERVICES',
    items: [
      { id: 'admissions', title: 'My Admissions', icon: 'Bed', badge: 'Discharged', badgeColor: 'bg-slate-100 text-slate-600' },
      { id: 'teleconsultation', title: 'Online Consultation', icon: 'Video' },
      { id: 'billing', title: 'Billing & Payments', icon: 'Receipt', badge: '$0 Due', badgeColor: 'bg-emerald-50 text-[#006a4e]' },
      { id: 'download-center', title: 'Download Center', icon: 'Download' },
    ],
  },
  {
    title: 'SUPPORT',
    items: [
      { id: 'notifications', title: 'Notifications', icon: 'Bell', badge: 4, badgeColor: 'bg-rose-50 text-rose-700' },
      { id: 'support-messages', title: 'Messages & Support', icon: 'MessageSquareText' },
      { id: 'settings', title: 'Settings', icon: 'Settings' },
    ],
  },
];

export interface PatientProfile {
  uhid: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  allergies: string[];
  chronicDiseases: string[];
  lastVisit: string;
  preferredBranch: string;
  nationalId: string;
}

export const CURRENT_PATIENT: PatientProfile = {
  uhid: 'UHID-2024-8841',
  name: 'Md. Rahim Uddin',
  age: 54,
  gender: 'Male',
  bloodGroup: 'B+',
  phone: '+880 1819-234567',
  email: 'patient@hospital.local',
  address: 'House #42, Road 9/A, Dhanmondi, Dhaka-1209',
  emergencyContact: 'Mrs. Rokeya Begum (Wife) - +880 1711-002233',
  allergies: ['Penicillin', 'Sulfa drugs'],
  chronicDiseases: ['Hypertension (7 yrs)', 'Type 2 Diabetes (4 yrs)'],
  lastVisit: 'Today (20 Nov 2026)',
  preferredBranch: 'Dhanmondi Main Wing',
  nationalId: '1972-269-8472910',
};

export interface PatientAppointmentItem {
  id: string;
  tokenNo: string;
  appointmentNo: string;
  doctorName: string;
  department: string;
  room: string;
  branch: string;
  slotTime: string;
  date: string;
  type: 'In-Person OPD' | 'Video Teleconsult' | 'Follow-up';
  status: 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled';
  fee: number;
  feeStatus: 'Paid' | 'Unpaid';
  teleconsultLink?: string;
}

export const PATIENT_APPOINTMENTS: PatientAppointmentItem[] = [
  {
    id: 'p-apt-01',
    tokenNo: '#06',
    appointmentNo: 'APPNO7893',
    doctorName: 'Prof. Dr. Tanvir Ahmed',
    department: 'Cardiology & Interventional',
    room: 'Room 302, Level 3',
    branch: 'Dhanmondi Main Wing',
    slotTime: '04:00 PM',
    date: 'Today (20 Nov 2026)',
    type: 'In-Person OPD',
    status: 'Confirmed',
    fee: 50.0,
    feeStatus: 'Paid',
  },
  {
    id: 'p-apt-02',
    tokenNo: '#14',
    appointmentNo: 'APPNO7840',
    doctorName: 'Dr. Mahmudul Hasan',
    department: 'Clinical Cardiology',
    room: 'Room 308, Level 3',
    branch: 'Dhanmondi Main Wing',
    slotTime: '11:00 AM',
    date: '27 Nov 2026',
    type: 'Follow-up',
    status: 'Confirmed',
    fee: 40.0,
    feeStatus: 'Paid',
  },
  {
    id: 'p-apt-03',
    tokenNo: '--',
    appointmentNo: 'APPNO7712',
    doctorName: 'Dr. Farhana Yasmin',
    department: 'Endocrinology & Diabetology',
    room: 'Virtual Room 1',
    branch: 'Telehealth Portal',
    slotTime: '06:30 PM',
    date: '02 Dec 2026',
    type: 'Video Teleconsult',
    status: 'Confirmed',
    fee: 35.0,
    feeStatus: 'Paid',
    teleconsultLink: 'https://telehealth.greenhospital.org/meet/apt-7712',
  },
  {
    id: 'p-apt-04',
    tokenNo: '#04',
    appointmentNo: 'APPNO7610',
    doctorName: 'Prof. Dr. Tanvir Ahmed',
    department: 'Cardiology',
    room: 'Room 302, Level 3',
    branch: 'Dhanmondi Main Wing',
    slotTime: '03:30 PM',
    date: '15 Oct 2026',
    type: 'In-Person OPD',
    status: 'Completed',
    fee: 50.0,
    feeStatus: 'Paid',
  },
];

export interface PatientPrescriptionItem {
  id: string;
  rxNumber: string;
  doctorName: string;
  department: string;
  date: string;
  diagnosis: string;
  medicinesCount: number;
  medicines: { name: string; dosage: string; frequency: string; duration: string; instruction: string }[];
  followUp: string;
  status: 'Active E-Rx' | 'Completed Refill';
}

export const PATIENT_PRESCRIPTIONS: PatientPrescriptionItem[] = [
  {
    id: 'p-rx-01',
    rxNumber: 'RX-2026-118841',
    doctorName: 'Prof. Dr. Tanvir Ahmed',
    department: 'Cardiology',
    date: '20 Nov 2026',
    diagnosis: 'Unstable Angina, Essential HTN',
    medicinesCount: 5,
    medicines: [
      { name: 'Tab. Aspirin (Ecosprin)', dosage: '75 mg', frequency: '1+0+0', duration: '1 Month', instruction: 'After breakfast' },
      { name: 'Tab. Clopidogrel (Plagrin)', dosage: '75 mg', frequency: '0+1+0', duration: '1 Month', instruction: 'After lunch' },
      { name: 'Tab. Atorvastatin (Atova)', dosage: '20 mg', frequency: '0+0+1', duration: '1 Month', instruction: 'At bedtime' },
      { name: 'Tab. Bisoprolol (Bisocor)', dosage: '2.5 mg', frequency: '1+0+0', duration: '1 Month', instruction: 'Before breakfast' },
      { name: 'Tab. Nitroglycerin Sublingual', dosage: '0.5 mg', frequency: 'SOS', duration: 'As needed', instruction: 'Under tongue for chest pain' },
    ],
    followUp: '7 Days later with report',
    status: 'Active E-Rx',
  },
  {
    id: 'p-rx-02',
    rxNumber: 'RX-2026-107712',
    doctorName: 'Dr. Farhana Yasmin',
    department: 'Diabetology',
    date: '10 Oct 2026',
    diagnosis: 'Type 2 Diabetes Mellitus',
    medicinesCount: 2,
    medicines: [
      { name: 'Tab. Metformin HCl (Comprid)', dosage: '500 mg', frequency: '1+0+1', duration: '3 Months', instruction: 'During meals' },
      { name: 'Tab. Linagliptin (Trazenta)', dosage: '5 mg', frequency: '0+0+1', duration: '3 Months', instruction: 'Night' },
    ],
    followUp: '3 Months later',
    status: 'Completed Refill',
  },
];

export interface PatientLabReportItem {
  id: string;
  orderNumber: string;
  testName: string;
  department: string;
  orderDate: string;
  reportDate: string;
  resultSummary: string;
  flag: 'Normal' | 'Abnormal High' | 'Critical High';
  status: 'Ready' | 'Processing';
  pdfUrl?: string;
}

export const PATIENT_LAB_REPORTS: PatientLabReportItem[] = [
  {
    id: 'p-lab-01',
    orderNumber: 'LAB-ORD-9902',
    testName: 'Complete Blood Count (CBC) with ESR',
    department: 'Hematology',
    orderDate: '20 Nov 2026',
    reportDate: '20 Nov 2026 05:00 PM',
    resultSummary: 'Hb: 13.8 g/dL, Total WBC: 7,400 /cu.mm, Platelets: 245,000 /cu.mm, ESR: 14 mm/1st hr',
    flag: 'Normal',
    status: 'Ready',
  },
  {
    id: 'p-lab-02',
    orderNumber: 'LAB-ORD-9884',
    testName: 'Fasting Lipid Profile',
    department: 'Biochemistry',
    orderDate: '15 Oct 2026',
    reportDate: '15 Oct 2026 02:30 PM',
    resultSummary: 'Total Chol: 218 mg/dL, LDL: 138 mg/dL (High), HDL: 44 mg/dL, Triglycerides: 180 mg/dL',
    flag: 'Abnormal High',
    status: 'Ready',
  },
  {
    id: 'p-lab-03',
    orderNumber: 'LAB-ORD-9881',
    testName: 'Glycated Hemoglobin (HbA1c)',
    department: 'Biochemistry',
    orderDate: '15 Oct 2026',
    reportDate: '15 Oct 2026 01:15 PM',
    resultSummary: 'HbA1c: 6.8% (Target: < 7.0% for diabetic management)',
    flag: 'Normal',
    status: 'Ready',
  },
  {
    id: 'p-lab-04',
    orderNumber: 'LAB-ORD-9925',
    testName: 'Serum Electrolytes (Na+, K+, Cl-)',
    department: 'Biochemistry',
    orderDate: '20 Nov 2026 04:15 PM',
    reportDate: 'Awaiting Run',
    resultSummary: 'Sample in automated biochemistry analyzer',
    flag: 'Normal',
    status: 'Processing',
  },
];

export interface PatientRadiologyItem {
  id: string;
  studyId: string;
  scanName: string;
  modality: 'Echocardiogram' | 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound';
  date: string;
  performingDoctor: string;
  impression: string;
  status: 'Report Ready' | 'Scheduled';
  pacsUrl?: string;
}

export const PATIENT_RADIOLOGY_REPORTS: PatientRadiologyItem[] = [
  {
    id: 'p-rad-01',
    studyId: 'RAD-2026-4412',
    scanName: '2D & Color Doppler Transthoracic Echocardiogram',
    modality: 'Echocardiogram',
    date: '20 Nov 2026',
    performingDoctor: 'Dr. Shahriar Kabir (Cardiologist)',
    impression: 'LVEF 58%. Good overall left ventricular systolic function. Normal chamber dimensions. Mild diastolic relaxation abnormality.',
    status: 'Report Ready',
    pacsUrl: '#pacs-study-4412',
  },
  {
    id: 'p-rad-02',
    studyId: 'RAD-2026-3918',
    scanName: 'Chest X-Ray Digital PA View',
    modality: 'X-Ray',
    date: '15 Oct 2026',
    performingDoctor: 'Dr. Mehnaz Parvin (Radiologist)',
    impression: 'Lungs clear of consolidation or active infiltrates. Cardiothoracic ratio within normal physiological limits (CTR < 0.50).',
    status: 'Report Ready',
    pacsUrl: '#pacs-study-3918',
  },
];

export interface PatientVitalItem {
  id: string;
  date: string;
  time: string;
  bp: string;
  heartRate: number;
  glucose: string;
  spo2: number;
  weight: number;
  status: 'Normal' | 'Elevated' | 'Attention Needed';
}

export const PATIENT_VITALS: PatientVitalItem[] = [
  { id: 'v-01', date: '20 Nov 2026', time: '04:05 PM', bp: '145/95 mmHg', heartRate: 88, glucose: '6.4 mmol/L (Random)', spo2: 98, weight: 76, status: 'Elevated' },
  { id: 'v-02', date: '15 Oct 2026', time: '03:40 PM', bp: '138/88 mmHg', heartRate: 78, glucose: '5.8 mmol/L (Fasting)', spo2: 99, weight: 77, status: 'Normal' },
  { id: 'v-03', date: '10 Aug 2026', time: '10:15 AM', bp: '132/84 mmHg', heartRate: 74, glucose: '6.1 mmol/L', spo2: 99, weight: 78, status: 'Normal' },
  { id: 'v-04', date: '02 May 2026', time: '11:00 AM', bp: '150/98 mmHg', heartRate: 92, glucose: '7.2 mmol/L', spo2: 97, weight: 79, status: 'Elevated' },
];

export interface PatientAdmissionItem {
  id: string;
  admissionNo: string;
  wardRoom: string;
  admissionDate: string;
  dischargeDate: string;
  primaryDiagnosis: string;
  attendingConsultant: string;
  status: 'Discharged' | 'Admitted';
  dischargeSummaryPdf: string;
}

export const PATIENT_ADMISSIONS: PatientAdmissionItem[] = [
  {
    id: 'adm-01',
    admissionNo: 'IPD-2025-0812',
    wardRoom: 'Cabin #304, Level 3',
    admissionDate: '12 Dec 2025',
    dischargeDate: '15 Dec 2025',
    primaryDiagnosis: 'Acute Coronary Syndrome - Evaluated with Coronary Angiogram',
    attendingConsultant: 'Prof. Dr. Tanvir Ahmed',
    status: 'Discharged',
    dischargeSummaryPdf: '#discharge-8841-2025',
  },
];

export interface PatientBillItem {
  id: string;
  invoiceNo: string;
  date: string;
  department: string;
  serviceDescription: string;
  amount: number;
  paid: number;
  due: number;
  status: 'Paid' | 'Pending';
  receiptNo: string;
}

export const PATIENT_BILLS: PatientBillItem[] = [
  {
    id: 'bill-01',
    invoiceNo: 'INV-2026-118841',
    date: '20 Nov 2026',
    department: 'OPD Cardiology',
    serviceDescription: 'Consultant Specialist Fee (Prof. Dr. Tanvir Ahmed)',
    amount: 50.0,
    paid: 50.0,
    due: 0.0,
    status: 'Paid',
    receiptNo: 'RCP-8841-01',
  },
  {
    id: 'bill-02',
    invoiceNo: 'INV-2026-118842',
    date: '20 Nov 2026',
    department: 'Pathology & Diagnostic',
    serviceDescription: 'Complete Blood Count (CBC) with ESR',
    amount: 25.0,
    paid: 25.0,
    due: 0.0,
    status: 'Paid',
    receiptNo: 'RCP-8841-02',
  },
  {
    id: 'bill-03',
    invoiceNo: 'INV-2026-104412',
    date: '15 Oct 2026',
    department: 'Radiology & Imaging',
    serviceDescription: 'Digital Chest X-Ray PA View',
    amount: 30.0,
    paid: 30.0,
    due: 0.0,
    status: 'Paid',
    receiptNo: 'RCP-7890-03',
  },
];

export interface PatientNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'lab' | 'billing' | 'system';
  unread: boolean;
}

export const PATIENT_NOTIFICATIONS: PatientNotificationItem[] = [
  {
    id: 'pn-01',
    title: 'Appointment Reminder: Today 04:00 PM',
    message: 'Your consultation with Prof. Dr. Tanvir Ahmed is scheduled in Room 302, Level 3. Token #06.',
    timestamp: '1 hour ago',
    type: 'appointment',
    unread: true,
  },
  {
    id: 'pn-02',
    title: 'Lab Report Ready for Download',
    message: 'Your Complete Blood Count (CBC) test results are available online in your Medical Records tab.',
    timestamp: '2 hours ago',
    type: 'lab',
    unread: true,
  },
  {
    id: 'pn-03',
    title: 'Payment Receipt Issued: $50.00',
    message: 'Invoice INV-2026-118841 has been settled via Card/Online. Receipt RCP-8841-01 generated.',
    timestamp: '3 hours ago',
    type: 'billing',
    unread: false,
  },
  {
    id: 'pn-04',
    title: 'Free Health Screening Camp on Friday',
    message: 'GreenHospital is hosting a preventive cardiovascular wellness camp at Dhanmondi Campus.',
    timestamp: '1 day ago',
    type: 'system',
    unread: false,
  },
];

export interface PatientDoctorContact {
  id: string;
  name: string;
  title: string;
  department: string;
  room: string;
  phone: string;
  email: string;
  lastConsultDate: string;
}

export const MY_DOCTORS_LIST: PatientDoctorContact[] = [
  {
    id: 'doc-cardio',
    name: 'Prof. Dr. Tanvir Ahmed',
    title: 'Senior Consultant & Professor',
    department: 'Cardiology & Interventional',
    room: 'Room 302, Level 3',
    phone: '+880 1712-345678',
    email: 'tanvir.cardio@greenhospital.org',
    lastConsultDate: 'Today (20 Nov 2026)',
  },
  {
    id: 'doc-diab',
    name: 'Dr. Farhana Yasmin',
    title: 'Associate Professor & Diabetologist',
    department: 'Endocrinology & Diabetology',
    room: 'Room 205, Level 2',
    phone: '+880 1715-998877',
    email: 'farhana.diab@greenhospital.org',
    lastConsultDate: '10 Oct 2026',
  },
  {
    id: 'doc-med',
    name: 'Dr. Mahmudul Hasan',
    title: 'Consultant Physician',
    department: 'Internal Medicine',
    room: 'Room 308, Level 3',
    phone: '+880 1819-556677',
    email: 'mahmud.med@greenhospital.org',
    lastConsultDate: '02 May 2026',
  },
];
