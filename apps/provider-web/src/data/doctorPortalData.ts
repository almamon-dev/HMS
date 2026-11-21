export interface DoctorSubNavItem {
  id: string;
  title: string;
  badge?: string | number;
}

export interface DoctorNavItem {
  id: string;
  title: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
  subItems?: DoctorSubNavItem[];
}

export interface DoctorNavSection {
  title: string;
  items: DoctorNavItem[];
}

export const DOCTOR_NAV_SECTIONS: DoctorNavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      { id: 'dashboard', title: 'Dashboard', icon: 'Home' },
      { id: 'my-appointments', title: 'My Appointments', icon: 'SquarePen', badge: 8, badgeColor: 'bg-emerald-50 text-emerald-700' },
      { id: 'my-patients', title: 'My Patients', icon: 'Accessibility' },
      { id: 'patient-queue', title: 'Patient Queue', icon: 'Clock', badge: 'Live', badgeColor: 'bg-red-50 text-red-600 animate-pulse' },
    ],
  },
  {
    title: 'CLINICAL CARE',
    items: [
      { id: 'consultations', title: 'Consultations', icon: 'Stethoscope' },
      { id: 'clinical-records', title: 'Clinical Records', icon: 'FileText' },
      { id: 'prescriptions', title: 'E-Prescriptions', icon: 'BookOpen' },
      { id: 'lab-investigations', title: 'Lab & Investigation', icon: 'FlaskConical', badge: 3, badgeColor: 'bg-amber-50 text-amber-700' },
      { id: 'radiology-results', title: 'Radiology Results', icon: 'ScanLine' },
      { id: 'my-inpatients', title: 'My Inpatients', icon: 'Bed', badge: 6, badgeColor: 'bg-sky-50 text-sky-700' },
      { id: 'referrals', title: 'Referrals', icon: 'Share2' },
    ],
  },
  {
    title: 'WORK MANAGEMENT',
    items: [
      { id: 'my-schedule', title: 'My Schedule', icon: 'Calendar' },
      { id: 'clinical-tasks', title: 'Clinical Tasks', icon: 'ClipboardCheck', badge: 4, badgeColor: 'bg-indigo-50 text-indigo-700' },
      { id: 'notifications', title: 'Notifications', icon: 'Bell', badge: 5, badgeColor: 'bg-rose-50 text-rose-700' },
      { id: 'my-reports', title: 'My Reports', icon: 'BarChart3' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { id: 'profile-settings', title: 'My Profile & Settings', icon: 'Settings' },
    ],
  },
];

export interface DoctorProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  bmdcReg: string;
  room: string;
  branch: string;
  email: string;
  phone: string;
  avatarUrl: string;
  experience: string;
  opdFee: string;
  videoFee: string;
  followupFee: string;
  biography: string;
}

export const CURRENT_DOCTOR: DoctorProfile = {
  id: 'doc-001',
  name: 'Prof. Dr. Tanvir Ahmed',
  designation: 'Senior Consultant & Professor',
  department: 'Department of Cardiology & Interventional Medicine',
  qualification: 'MBBS, FCPS (Medicine), MD (Cardiology), FACC (USA), FSCAI',
  bmdcReg: 'A-48291',
  room: 'Room 302, Level 3, Executive OPD Wing',
  branch: 'Dhanmondi Main Hospital (Campus 1)',
  email: 'doctor@hospital.local',
  phone: '+880 1712-345678',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
  experience: '18+ Years in Clinical & Interventional Cardiology',
  opdFee: '৳ 1,200',
  videoFee: '৳ 900',
  followupFee: '৳ 600',
  biography: 'Specialized in complex coronary angioplasty, heart failure management, hypertension, and preventive cardiac rehabilitation.',
};

export interface DoctorKpi {
  label: string;
  value: string;
  subtext: string;
  change: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export const DOCTOR_KPIS: DoctorKpi[] = [
  {
    label: "Today's Appointments",
    value: '24',
    subtext: '14 Completed • 10 Remaining',
    change: '+12% from yesterday',
    icon: 'CalendarCheck',
    trend: 'up',
    color: 'emerald',
  },
  {
    label: 'Waiting in Chamber Queue',
    value: '7',
    subtext: 'Avg wait time 14 mins',
    change: 'Live token #08 inside',
    icon: 'Clock',
    trend: 'neutral',
    color: 'cyan',
  },
  {
    label: 'Assigned Inpatients',
    value: '6',
    subtext: '4 Cabin • 2 Cardiac ICU',
    change: 'Morning rounds completed',
    icon: 'Bed',
    trend: 'neutral',
    color: 'sky',
  },
  {
    label: 'Critical Lab Alerts',
    value: '2',
    subtext: 'Troponin-I & Potassium flag',
    change: 'Requires prompt review',
    icon: 'FlaskConical',
    trend: 'down',
    color: 'rose',
  },
];

export interface DoctorAppointment {
  id: string;
  tokenNo: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  slotTime: string;
  type: 'In-Person OPD' | 'Follow-up' | 'Video Teleconsult' | 'Emergency Priority';
  status: 'Waiting' | 'In Chamber' | 'Checked In' | 'Completed' | 'Scheduled' | 'Cancelled';
  chiefComplaint: string;
  contact: string;
  feeStatus: 'Paid' | 'Pending' | 'Hospital Staff';
  notes?: string;
}

export const DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 'apt-101',
    tokenNo: '#06',
    uhid: 'UHID-2024-8841',
    patientName: 'Md. Rahim Uddin',
    age: 54,
    gender: 'Male',
    slotTime: '04:00 PM',
    type: 'In-Person OPD',
    status: 'In Chamber',
    chiefComplaint: 'Chest tightness on exertion, intermittent palpitation for 5 days',
    contact: '+880 1819-234567',
    feeStatus: 'Paid',
    notes: 'Prior ECG shows sinus tachycardia. Blood pressure elevated.',
  },
  {
    id: 'apt-102',
    tokenNo: '#07',
    uhid: 'UHID-2024-8842',
    patientName: 'Mrs. Nasrin Sultana',
    age: 46,
    gender: 'Female',
    slotTime: '04:15 PM',
    type: 'Follow-up',
    status: 'Waiting',
    chiefComplaint: 'Post-angioplasty 6-month routine review, dyspnea relieved',
    contact: '+880 1711-456789',
    feeStatus: 'Paid',
    notes: 'Echocardiogram and Lipid Profile reports ready for review.',
  },
  {
    id: 'apt-103',
    tokenNo: '#08',
    uhid: 'UHID-2024-8849',
    patientName: 'Kazi Farhadul Alam',
    age: 62,
    gender: 'Male',
    slotTime: '04:30 PM',
    type: 'In-Person OPD',
    status: 'Checked In',
    chiefComplaint: 'Uncontrolled hypertension (170/105 mmHg), occipital headache',
    contact: '+880 1912-887766',
    feeStatus: 'Paid',
    notes: 'Diabetic since 2012. Needs medication dosage escalation.',
  },
  {
    id: 'apt-104',
    tokenNo: '#09',
    uhid: 'UHID-2024-8854',
    patientName: 'Farida Begum',
    age: 58,
    gender: 'Female',
    slotTime: '04:45 PM',
    type: 'Video Teleconsult',
    status: 'Scheduled',
    chiefComplaint: 'Ankle edema, shortness of breath while lying flat',
    contact: '+880 1611-332211',
    feeStatus: 'Paid',
    notes: 'Remote video call link active in doctor portal.',
  },
  {
    id: 'apt-105',
    tokenNo: '#10',
    uhid: 'UHID-2024-8860',
    patientName: 'Tanvir Mahmud',
    age: 39,
    gender: 'Male',
    slotTime: '05:00 PM',
    type: 'In-Person OPD',
    status: 'Scheduled',
    chiefComplaint: 'Executive routine cardiac screening, family history of premature CAD',
    contact: '+880 1715-998877',
    feeStatus: 'Paid',
    notes: 'Requested Exercise Tolerance Test (ETT) evaluation.',
  },
  {
    id: 'apt-106',
    tokenNo: '#11',
    uhid: 'UHID-2024-8868',
    patientName: 'Shahina Akter',
    age: 51,
    gender: 'Female',
    slotTime: '05:15 PM',
    type: 'Emergency Priority',
    status: 'Waiting',
    chiefComplaint: 'Acute radiating left shoulder pain, diaphoresis, nausea',
    contact: '+880 1812-445566',
    feeStatus: 'Hospital Staff',
    notes: 'Triage alerted: STAT Troponin-I sent to Pathology.',
  },
  {
    id: 'apt-107',
    tokenNo: '#04',
    uhid: 'UHID-2024-8812',
    patientName: 'Abdul Mannan',
    age: 67,
    gender: 'Male',
    slotTime: '03:30 PM',
    type: 'In-Person OPD',
    status: 'Completed',
    chiefComplaint: 'Chronic ischemic heart disease follow-up',
    contact: '+880 1722-113344',
    feeStatus: 'Paid',
    notes: 'Prescription renewed. Next follow-up in 3 months.',
  },
  {
    id: 'apt-108',
    tokenNo: '#05',
    uhid: 'UHID-2024-8820',
    patientName: 'Rokeya Parvin',
    age: 44,
    gender: 'Female',
    slotTime: '03:45 PM',
    type: 'Follow-up',
    status: 'Completed',
    chiefComplaint: 'Post-CABG recovery monitoring',
    contact: '+880 1933-556677',
    feeStatus: 'Paid',
    notes: 'Surgical sternotomy scar well-healed.',
  },
];

export interface DoctorPatient {
  uhid: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  lastVisit: string;
  diagnosis: string;
  allergies: string[];
  chronicDiseases: string[];
  vitalsSummary: string;
  status: 'Active Outpatient' | 'Admitted IPD' | 'Stable Follow-up' | 'Discharged';
}

export const DOCTOR_PATIENTS: DoctorPatient[] = [
  {
    uhid: 'UHID-2024-8841',
    name: 'Md. Rahim Uddin',
    age: 54,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+880 1819-234567',
    lastVisit: 'Today (20 Nov 2026)',
    diagnosis: 'Unstable Angina, Stage 2 HTN',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicDiseases: ['Hypertension (7 yrs)', 'Type 2 Diabetes (4 yrs)'],
    vitalsSummary: 'BP: 145/95 mmHg, HR: 88 bpm, SpO2: 98%',
    status: 'Active Outpatient',
  },
  {
    uhid: 'UHID-2024-8842',
    name: 'Mrs. Nasrin Sultana',
    age: 46,
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+880 1711-456789',
    lastVisit: 'Today (20 Nov 2026)',
    diagnosis: 'Post-PTCA with Stent to LAD',
    allergies: ['None known'],
    chronicDiseases: ['Dyslipidemia'],
    vitalsSummary: 'BP: 120/78 mmHg, HR: 72 bpm, SpO2: 99%',
    status: 'Stable Follow-up',
  },
  {
    uhid: 'UHID-2024-8849',
    name: 'Kazi Farhadul Alam',
    age: 62,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+880 1912-887766',
    lastVisit: 'Today (20 Nov 2026)',
    diagnosis: 'Severe Resistant Hypertension',
    allergies: ['Aspirin (gastric irritation)'],
    chronicDiseases: ['T2DM', 'Stage 2 CKD'],
    vitalsSummary: 'BP: 170/105 mmHg, HR: 92 bpm, SpO2: 96%',
    status: 'Active Outpatient',
  },
  {
    uhid: 'UHID-2024-8868',
    name: 'Shahina Akter',
    age: 51,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+880 1812-445566',
    lastVisit: 'Today (20 Nov 2026)',
    diagnosis: 'Suspected Non-STEMI',
    allergies: ['Iodinated contrast (mild itching)'],
    chronicDiseases: ['Hypertension'],
    vitalsSummary: 'BP: 155/100 mmHg, HR: 104 bpm, SpO2: 95%',
    status: 'Active Outpatient',
  },
  {
    uhid: 'UHID-2024-7719',
    name: 'Haji Mohammad Ismail',
    age: 71,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '+880 1718-223344',
    lastVisit: '18 Nov 2026',
    diagnosis: 'Congestive Cardiac Failure (NYHA Class III)',
    allergies: ['NSAIDs'],
    chronicDiseases: ['Old Anterior MI', 'Atrial Fibrillation'],
    vitalsSummary: 'BP: 110/70 mmHg, HR: 82 bpm (irregular), SpO2: 94%',
    status: 'Admitted IPD',
  },
  {
    uhid: 'UHID-2024-7650',
    name: 'Zubair Hossain',
    age: 33,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+880 1618-990011',
    lastVisit: '15 Nov 2026',
    diagnosis: 'Hypertrophic Cardiomyopathy (HCM)',
    allergies: ['None'],
    chronicDiseases: ['Family history of sudden cardiac arrest'],
    vitalsSummary: 'BP: 125/80 mmHg, HR: 66 bpm, SpO2: 99%',
    status: 'Stable Follow-up',
  },
];

export interface DoctorQueueItem {
  id: string;
  tokenNo: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  arrivalTime: string;
  waitTime: string;
  visitType: string;
  status: 'In Chamber' | 'Waiting' | 'In Diagnostics' | 'Hold' | 'Completed';
  priority: 'Emergency' | 'Senior Citizen' | 'Normal';
}

export const DOCTOR_LIVE_QUEUE: DoctorQueueItem[] = [
  {
    id: 'q-01',
    tokenNo: '#06',
    uhid: 'UHID-2024-8841',
    patientName: 'Md. Rahim Uddin',
    age: 54,
    gender: 'Male',
    arrivalTime: '03:45 PM',
    waitTime: '15 mins',
    visitType: 'OPD Consultation',
    status: 'In Chamber',
    priority: 'Normal',
  },
  {
    id: 'q-02',
    tokenNo: '#11',
    uhid: 'UHID-2024-8868',
    patientName: 'Shahina Akter',
    age: 51,
    gender: 'Female',
    arrivalTime: '04:05 PM',
    waitTime: '5 mins',
    visitType: 'Emergency Triage',
    status: 'Waiting',
    priority: 'Emergency',
  },
  {
    id: 'q-03',
    tokenNo: '#07',
    uhid: 'UHID-2024-8842',
    patientName: 'Mrs. Nasrin Sultana',
    age: 46,
    gender: 'Female',
    arrivalTime: '03:52 PM',
    waitTime: '18 mins',
    visitType: 'Post-Op Follow-up',
    status: 'Waiting',
    priority: 'Normal',
  },
  {
    id: 'q-04',
    tokenNo: '#08',
    uhid: 'UHID-2024-8849',
    patientName: 'Kazi Farhadul Alam',
    age: 62,
    gender: 'Male',
    arrivalTime: '03:58 PM',
    waitTime: '12 mins',
    visitType: 'Hypertension Review',
    status: 'Waiting',
    priority: 'Senior Citizen',
  },
  {
    id: 'q-05',
    tokenNo: '#09',
    uhid: 'UHID-2024-8854',
    patientName: 'Farida Begum',
    age: 58,
    gender: 'Female',
    arrivalTime: '04:10 PM',
    waitTime: '-- (Remote)',
    visitType: 'Video Teleconsult',
    status: 'Waiting',
    priority: 'Normal',
  },
  {
    id: 'q-06',
    tokenNo: '#03',
    uhid: 'UHID-2024-8805',
    patientName: 'Selim Reza',
    age: 49,
    gender: 'Male',
    arrivalTime: '03:15 PM',
    waitTime: 'Sent to ECG',
    visitType: 'OPD Consult',
    status: 'In Diagnostics',
    priority: 'Normal',
  },
];

export interface ConsultationNote {
  id: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  chiefComplaints: string;
  historyOfPresentIllness: string;
  vitals: {
    bp: string;
    pulse: string;
    temperature: string;
    spo2: string;
    weight: string;
    bmi: string;
  };
  clinicalFindings: string;
  diagnosis: string;
  investigationsOrdered: string[];
  treatmentPlan: string;
  followUpDays: string;
}

export const DOCTOR_CONSULTATIONS: ConsultationNote[] = [
  {
    id: 'con-501',
    uhid: 'UHID-2024-8841',
    patientName: 'Md. Rahim Uddin',
    age: 54,
    gender: 'Male',
    date: '20 Nov 2026',
    time: '04:05 PM',
    chiefComplaints: 'Substernal chest pain radiating to left arm on brisk walking for 2 weeks',
    historyOfPresentIllness: 'Patient has been experiencing exertional angina for past 14 days, relieved within 5 minutes of rest. No syncope.',
    vitals: {
      bp: '145/95 mmHg',
      pulse: '88 bpm',
      temperature: '98.4 °F',
      spo2: '98%',
      weight: '76 kg',
      bmi: '26.8',
    },
    clinicalFindings: 'S1, S2 audible, no murmurs. Chest clear on auscultation. No peripheral pedal edema.',
    diagnosis: 'Coronary Artery Disease - Unstable Angina (CCS Class II), Essential HTN',
    investigationsOrdered: ['12-Lead Resting ECG', 'Serum Troponin-I STAT', 'Lipid Profile', 'Echocardiogram 2D & Doppler'],
    treatmentPlan: 'Tab. Aspirin 75mg (1+0+0), Tab. Clopidogrel 75mg (0+1+0), Tab. Atorvastatin 20mg (0+0+1), Tab. Bisoprolol 2.5mg (1+0+0)',
    followUpDays: '7 days with lab & imaging results',
  },
  {
    id: 'con-502',
    uhid: 'UHID-2024-8812',
    patientName: 'Abdul Mannan',
    age: 67,
    gender: 'Male',
    date: '20 Nov 2026',
    time: '03:35 PM',
    chiefComplaints: 'Routine 3-month follow-up for chronic ischemic heart disease',
    historyOfPresentIllness: 'Patient reports well-controlled symptoms. Walks 30 mins daily with no chest pain or dyspnea.',
    vitals: {
      bp: '124/78 mmHg',
      pulse: '68 bpm',
      temperature: '98.2 °F',
      spo2: '99%',
      weight: '68 kg',
      bmi: '24.1',
    },
    clinicalFindings: 'Normal heart sounds. Apex beat normal. Pulse regular.',
    diagnosis: 'Chronic Ischemic Heart Disease, Well-controlled HTN & T2DM',
    investigationsOrdered: ['Serum Creatinine', 'HbA1c', 'Serum Electrolytes'],
    treatmentPlan: 'Continue Tab. Rosuvastatin 10mg, Tab. Metoprolol ER 25mg, Tab. Telmisartan 40mg',
    followUpDays: '3 Months',
  },
];

export interface PrescriptionMedicine {
  medicineName: string;
  dosage: string;
  route?: string;
  frequency: string;
  duration: string;
  instruction: string;
}

export interface PrescribedTest {
  id?: string;
  name: string;
  source: 'in-house' | 'others';
  department?: string;
  notes?: string;
}

export interface PatientCaseStudy {
  chiefComplaints?: string;
  caseHistory?: string;
  pastMedicalHistory?: string;
  allergies?: string[];
  clinicalFindings?: string;
}

export interface HospitalLabCatalogItem {
  code: string;
  name: string;
  category: 'Pathology' | 'Biochemistry' | 'Radiology' | 'Cardiology' | 'Microbiology' | 'Immunology' | 'Hematology';
  sampleOrModality?: string;
  turnaroundTime: string;
  charge: string;
  inHouse: boolean;
}

export const HOSPITAL_LAB_TEST_CATALOG: HospitalLabCatalogItem[] = [
  { code: 'CBC-01', name: 'Complete Blood Count (CBC) with ESR', category: 'Hematology', sampleOrModality: 'Whole Blood EDTA', turnaroundTime: '4 Hours', charge: '৳350', inHouse: true },
  { code: 'LIPID-02', name: 'Lipid Profile Comprehensive (Cholesterol, HDL, LDL, TG)', category: 'Biochemistry', sampleOrModality: 'Fasting Blood Serum', turnaroundTime: '6 Hours', charge: '৳850', inHouse: true },
  { code: 'LFT-03', name: 'Liver Function Test (LFT - SGPT, SGOT, Bilirubin, Alk Phos)', category: 'Biochemistry', sampleOrModality: 'Serum', turnaroundTime: '6 Hours', charge: '৳750', inHouse: true },
  { code: 'RFT-04', name: 'Renal Function Test (Creatinine, Urea, Uric Acid)', category: 'Biochemistry', sampleOrModality: 'Serum', turnaroundTime: '4 Hours', charge: '৳650', inHouse: true },
  { code: 'HBA1C-05', name: 'Glycated Hemoglobin (HbA1c Blood Test)', category: 'Biochemistry', sampleOrModality: 'Whole Blood', turnaroundTime: '4 Hours', charge: '৳600', inHouse: true },
  { code: 'FBS-06', name: 'Fasting Blood Sugar (FBS / 2HABF Profile)', category: 'Biochemistry', sampleOrModality: 'Fluoride Plasma', turnaroundTime: '2 Hours', charge: '৳150', inHouse: true },
  { code: 'TROP-07', name: 'High-Sensitivity Troponin-I (Cardiac STAT)', category: 'Pathology', sampleOrModality: 'Heparin Plasma', turnaroundTime: '1 Hour', charge: '৳1200', inHouse: true },
  { code: 'THY-08', name: 'Thyroid Profile Comprehensive (FT3, FT4, TSH)', category: 'Immunology', sampleOrModality: 'Serum', turnaroundTime: '8 Hours', charge: '৳950', inHouse: true },
  { code: 'URI-09', name: 'Urine Routine & Microscopic Examination (R/M/E)', category: 'Pathology', sampleOrModality: 'Fresh Urine', turnaroundTime: '2 Hours', charge: '৳200', inHouse: true },
  { code: 'DENG-10', name: 'Dengue NS1 Antigen & Antibody (IgM/IgG) Panel', category: 'Pathology', sampleOrModality: 'Serum', turnaroundTime: '2 Hours', charge: '৳500', inHouse: true },
  { code: 'CRP-11', name: 'High-Sensitivity C-Reactive Protein (hs-CRP)', category: 'Immunology', sampleOrModality: 'Serum', turnaroundTime: '4 Hours', charge: '৳650', inHouse: true },
  { code: 'BCULT-12', name: 'Blood Culture & Sensitivity (Bactec Automated)', category: 'Microbiology', sampleOrModality: 'Bactec Blood Vials', turnaroundTime: '48 Hours', charge: '৳1200', inHouse: true },
  { code: 'SELEC-13', name: 'Serum Electrolytes (Na+, K+, Cl-, HCO3-)', category: 'Biochemistry', sampleOrModality: 'Serum', turnaroundTime: '3 Hours', charge: '৳550', inHouse: true },
  { code: 'FERR-14', name: 'Serum Ferritin & Iron Profile', category: 'Hematology', sampleOrModality: 'Serum', turnaroundTime: '6 Hours', charge: '৳900', inHouse: true },
  { code: 'PTINR-15', name: 'Prothrombin Time with INR (PT/INR)', category: 'Hematology', sampleOrModality: 'Citrate Plasma', turnaroundTime: '3 Hours', charge: '৳450', inHouse: true },
  { code: 'ECG-01', name: '12-Lead Digital Resting ECG', category: 'Cardiology', sampleOrModality: '12-Lead Machine', turnaroundTime: '15 Mins', charge: '৳400', inHouse: true },
  { code: 'ECHO-02', name: '2D Echocardiogram with Color Doppler', category: 'Cardiology', sampleOrModality: 'Echocardiography Unit', turnaroundTime: '1 Hour', charge: '৳2500', inHouse: true },
  { code: 'ETT-03', name: 'Exercise Tolerance Test (TMT / Stress ECG)', category: 'Cardiology', sampleOrModality: 'Treadmill Lab', turnaroundTime: '2 Hours', charge: '৳2200', inHouse: true },
  { code: 'CXR-01', name: 'Chest X-Ray Digital PA View', category: 'Radiology', sampleOrModality: 'Digital X-Ray Suite', turnaroundTime: '30 Mins', charge: '৳500', inHouse: true },
  { code: 'USG-01', name: 'Whole Abdomen & Pelvis Ultrasonography (USG)', category: 'Radiology', sampleOrModality: 'Ultrasound Scanner', turnaroundTime: '1 Hour', charge: '৳1400', inHouse: true },
  { code: 'CT-01', name: 'CT Scan Whole Abdomen with IV Contrast', category: 'Radiology', sampleOrModality: '128-Slice CT Unit', turnaroundTime: '4 Hours', charge: '৳6500', inHouse: true },
  { code: 'HRCT-02', name: 'HRCT Chest (High Resolution CT Scan)', category: 'Radiology', sampleOrModality: 'CT Scanner Suite', turnaroundTime: '4 Hours', charge: '৳5500', inHouse: true },
  { code: 'MRI-01', name: 'MRI Brain with Contrast (3.0 Tesla)', category: 'Radiology', sampleOrModality: '3.0T MRI Suite', turnaroundTime: '6 Hours', charge: '৳8500', inHouse: true },
  { code: 'MRI-02', name: 'MRI Lumbosacral Spine (3.0 Tesla)', category: 'Radiology', sampleOrModality: '3.0T MRI Suite', turnaroundTime: '6 Hours', charge: '৳8000', inHouse: true },
  { code: 'MAMMO-01', name: 'Digital Bilateral Mammography', category: 'Radiology', sampleOrModality: 'Mammography Suite', turnaroundTime: '2 Hours', charge: '৳2500', inHouse: true },
  { code: 'ENDO-01', name: 'Upper GI Video Endoscopy', category: 'Pathology', sampleOrModality: 'Endoscopy Suite', turnaroundTime: '2 Hours', charge: '৳3500', inHouse: true },
];

export interface EPrescription {
  id: string;
  rxNumber: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  advice: string[];
  testsAdvised: (string | PrescribedTest)[];
  followUp: string;
  followUpInstructions?: string;
  status: 'Signed & Dispensed' | 'Active E-Rx' | 'Draft';
  vitals?: {
    bp?: string;
    pulse?: string;
    weight?: string;
    temp?: string;
    spo2?: string;
  };
  caseStudy?: PatientCaseStudy;
}

export const DOCTOR_PRESCRIPTIONS: EPrescription[] = [
  {
    id: 'rx-901',
    rxNumber: 'RX-2026-118841',
    uhid: 'UHID-2024-8841',
    patientName: 'Md. Rahim Uddin',
    age: 54,
    gender: 'Male',
    date: '20 Nov 2026',
    diagnosis: 'Unstable Angina, Essential HTN',
    medicines: [
      { medicineName: 'Tab. Aspirin (Ecosprin)', dosage: '75 mg', frequency: '1+0+0', duration: '1 Month', instruction: 'After breakfast' },
      { medicineName: 'Tab. Clopidogrel (Plagrin)', dosage: '75 mg', frequency: '0+1+0', duration: '1 Month', instruction: 'After lunch' },
      { medicineName: 'Tab. Atorvastatin (Atova)', dosage: '20 mg', frequency: '0+0+1', duration: '1 Month', instruction: 'At bedtime' },
      { medicineName: 'Tab. Bisoprolol (Bisocor)', dosage: '2.5 mg', frequency: '1+0+0', duration: '1 Month', instruction: 'Morning before breakfast' },
      { medicineName: 'Tab. Nitroglycerin Sublingual', dosage: '0.5 mg', frequency: 'SOS', duration: 'As needed', instruction: 'Under tongue for chest pain' },
    ],
    advice: [
      'Avoid heavy physical strain and heavy lifting',
      'Maintain low-salt and low-cholesterol diet',
      'Daily 20-30 min gentle walk (if no chest pain)',
      'Emergency room visit immediately if chest pain lasts > 15 mins',
    ],
    testsAdvised: ['Serum Troponin-I', 'Echocardiogram 2D & Color Doppler', 'Fasting Lipid Profile'],
    followUp: '7 Days later with report',
    status: 'Active E-Rx',
  },
  {
    id: 'rx-902',
    rxNumber: 'RX-2026-118812',
    uhid: 'UHID-2024-8812',
    patientName: 'Abdul Mannan',
    age: 67,
    gender: 'Male',
    date: '20 Nov 2026',
    diagnosis: 'Chronic Ischemic Heart Disease, Post-MI',
    medicines: [
      { medicineName: 'Tab. Rosuvastatin (Rostan)', dosage: '10 mg', frequency: '0+0+1', duration: '3 Months', instruction: 'At bedtime' },
      { medicineName: 'Tab. Metoprolol Succinate', dosage: '25 mg', frequency: '1+0+0', duration: '3 Months', instruction: 'Morning after food' },
      { medicineName: 'Tab. Telmisartan (Telma)', dosage: '40 mg', frequency: '1+0+0', duration: '3 Months', instruction: 'Morning after food' },
    ],
    advice: [
      'Continue regular blood pressure charting twice weekly',
      'Maintain diabetic diet and diabetic foot care',
    ],
    testsAdvised: ['HbA1c', 'Serum Creatinine'],
    followUp: '3 Months later',
    status: 'Signed & Dispensed',
  },
];

export interface DoctorLabOrder {
  id: string;
  orderNumber: string;
  uhid: string;
  patientName: string;
  age: number;
  testName: string;
  category: 'Biochemistry' | 'Hematology' | 'Cardiac Markers' | 'Microbiology';
  orderDate: string;
  resultDate?: string;
  status: 'Critical Alert' | 'Report Ready' | 'Processing' | 'Sample Collected';
  flag: 'Normal' | 'Abnormal High' | 'Critical High' | 'Pending';
  parameterSummary?: string;
  signedOff: boolean;
}

export const DOCTOR_LAB_ORDERS: DoctorLabOrder[] = [
  {
    id: 'lab-301',
    orderNumber: 'LAB-ORD-9921',
    uhid: 'UHID-2024-8868',
    patientName: 'Shahina Akter',
    age: 51,
    testName: 'High-Sensitivity Troponin-I (hs-cTnI)',
    category: 'Cardiac Markers',
    orderDate: '20 Nov 2026 04:10 PM',
    resultDate: '20 Nov 2026 04:35 PM',
    status: 'Critical Alert',
    flag: 'Critical High',
    parameterSummary: '0.84 ng/mL (Ref: < 0.04 ng/mL) - Significant elevation indicative of myocardial injury',
    signedOff: false,
  },
  {
    id: 'lab-302',
    orderNumber: 'LAB-ORD-9918',
    uhid: 'UHID-2024-8849',
    patientName: 'Kazi Farhadul Alam',
    age: 62,
    testName: 'Serum Electrolytes (Na+, K+, Cl-)',
    category: 'Biochemistry',
    orderDate: '20 Nov 2026 03:20 PM',
    resultDate: '20 Nov 2026 03:55 PM',
    status: 'Critical Alert',
    flag: 'Abnormal High',
    parameterSummary: 'K+: 5.8 mmol/L (Ref: 3.5 - 5.1 mmol/L) - Mild hyperkalemia',
    signedOff: false,
  },
  {
    id: 'lab-303',
    orderNumber: 'LAB-ORD-9905',
    uhid: 'UHID-2024-8842',
    patientName: 'Mrs. Nasrin Sultana',
    age: 46,
    testName: 'Fasting Lipid Profile',
    category: 'Biochemistry',
    orderDate: '20 Nov 2026 08:30 AM',
    resultDate: '20 Nov 2026 01:15 PM',
    status: 'Report Ready',
    flag: 'Normal',
    parameterSummary: 'Total Chol: 168 mg/dL, LDL: 68 mg/dL, HDL: 52 mg/dL, Triglycerides: 140 mg/dL',
    signedOff: true,
  },
  {
    id: 'lab-304',
    orderNumber: 'LAB-ORD-9902',
    uhid: 'UHID-2024-8841',
    patientName: 'Md. Rahim Uddin',
    age: 54,
    testName: 'Complete Blood Count (CBC) with ESR',
    category: 'Hematology',
    orderDate: '20 Nov 2026 04:08 PM',
    status: 'Processing',
    flag: 'Pending',
    parameterSummary: 'Automated 5-part hematology run in progress',
    signedOff: false,
  },
];

export interface DoctorRadiologyOrder {
  id: string;
  orderNumber: string;
  uhid: string;
  patientName: string;
  age: number;
  modality: 'Echocardiogram' | 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound';
  scanName: string;
  orderDate: string;
  reportDate?: string;
  status: 'Impression Ready' | 'Scan Completed' | 'Scheduled' | 'Pending';
  radiologistImpression?: string;
  pacsLink?: string;
}

export const DOCTOR_RADIOLOGY_ORDERS: DoctorRadiologyOrder[] = [
  {
    id: 'rad-401',
    orderNumber: 'RAD-2026-4412',
    uhid: 'UHID-2024-8842',
    patientName: 'Mrs. Nasrin Sultana',
    age: 46,
    modality: 'Echocardiogram',
    scanName: '2D & Color Doppler Transthoracic Echocardiogram',
    orderDate: '20 Nov 2026 09:00 AM',
    reportDate: '20 Nov 2026 11:30 AM',
    status: 'Impression Ready',
    radiologistImpression: 'Left ventricular ejection fraction (LVEF) 58%. Good anterior wall motion, stent patent, grade 1 diastolic dysfunction.',
    pacsLink: '#pacs-echo-8842',
  },
  {
    id: 'rad-402',
    orderNumber: 'RAD-2026-4410',
    uhid: 'UHID-2024-7719',
    patientName: 'Haji Mohammad Ismail',
    age: 71,
    modality: 'X-Ray',
    scanName: 'Chest X-Ray PA View (Digital)',
    orderDate: '19 Nov 2026 04:00 PM',
    reportDate: '19 Nov 2026 05:15 PM',
    status: 'Impression Ready',
    radiologistImpression: 'Cardiomegaly with cardiothoracic ratio 0.62. Mild upper lobe pulmonary vascular prominence. Costophrenic angles clear.',
    pacsLink: '#pacs-xray-7719',
  },
  {
    id: 'rad-403',
    orderNumber: 'RAD-2026-4418',
    uhid: 'UHID-2024-8841',
    patientName: 'Md. Rahim Uddin',
    age: 54,
    modality: 'CT Scan',
    scanName: 'Coronary CT Angiography (128-Slice)',
    orderDate: '20 Nov 2026 04:12 PM',
    status: 'Scheduled',
    radiologistImpression: 'Awaiting baseline serum creatinine before iodinated contrast protocol.',
    pacsLink: '#pacs-cta-8841',
  },
];

export interface DoctorInpatient {
  id: string;
  ipdNumber: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  wardBed: string;
  admissionDate: string;
  primaryDiagnosis: string;
  condition: 'Stable' | 'Critical Monitoring' | 'Improving' | 'Discharge Ready';
  dailyProgressNote: string;
  dietAdvice: string;
  attendingNurse: string;
}

export const DOCTOR_INPATIENTS: DoctorInpatient[] = [
  {
    id: 'ipd-201',
    ipdNumber: 'IPD-2026-0412',
    uhid: 'UHID-2024-7719',
    patientName: 'Haji Mohammad Ismail',
    age: 71,
    gender: 'Male',
    wardBed: 'Cardiac ICU - Bed #03',
    admissionDate: '18 Nov 2026',
    primaryDiagnosis: 'Decompensated Heart Failure with AF',
    condition: 'Critical Monitoring',
    dailyProgressNote: 'IV Furosemide titration ongoing. Urine output 1,800 mL/24h. SpO2 maintained at 96% on 2L nasal cannula.',
    dietAdvice: 'Salt restricted cardiac fluid allowance: max 1.2 L / 24h',
    attendingNurse: 'Senior Staff Nurse Shilpi Begum',
  },
  {
    id: 'ipd-202',
    ipdNumber: 'IPD-2026-0418',
    uhid: 'UHID-2024-7725',
    patientName: 'Mohammad Ali Sikder',
    age: 59,
    gender: 'Male',
    wardBed: 'VIP Cabin #402, Level 4',
    admissionDate: '19 Nov 2026',
    primaryDiagnosis: 'Post-Coronary Angioplasty (LAD + LCx)',
    condition: 'Improving',
    dailyProgressNote: 'Femoral puncture site clean, no hematoma. Ambulating without angina. Vitals stable.',
    dietAdvice: 'Normal cardiac diet, low sodium',
    attendingNurse: 'Staff Nurse Farzana',
  },
  {
    id: 'ipd-203',
    ipdNumber: 'IPD-2026-0409',
    uhid: 'UHID-2024-7704',
    patientName: 'Rehana Sultana',
    age: 63,
    gender: 'Female',
    wardBed: 'Cabin #408, Level 4',
    admissionDate: '17 Nov 2026',
    primaryDiagnosis: 'Hypertensive Emergency with Encephalopathy',
    condition: 'Discharge Ready',
    dailyProgressNote: 'Blood pressure safely stabilized at 128/82 mmHg. Symptoms resolved. Discharge summary prepared.',
    dietAdvice: 'DASH low-sodium diet',
    attendingNurse: 'Senior Staff Nurse Poly',
  },
];

export interface DoctorReferral {
  id: string;
  uhid: string;
  patientName: string;
  age: number;
  referralType: 'Outbound Referral' | 'Inbound Consult';
  department: string;
  targetDoctor: string;
  urgency: 'Routine' | 'Urgent' | 'STAT Emergency';
  date: string;
  reason: string;
  status: 'Pending Review' | 'Accepted' | 'Completed';
}

export const DOCTOR_REFERRALS: DoctorReferral[] = [
  {
    id: 'ref-101',
    uhid: 'UHID-2024-8868',
    patientName: 'Shahina Akter',
    age: 51,
    referralType: 'Outbound Referral',
    department: 'Cardiac Surgery & Cath Lab',
    targetDoctor: 'Prof. Dr. M. A. Hasan (Lead Cardiac Surgeon)',
    urgency: 'STAT Emergency',
    date: '20 Nov 2026',
    reason: 'Emergency coronary angiography and possible primary PCI for acute coronary syndrome.',
    status: 'Pending Review',
  },
  {
    id: 'ref-102',
    uhid: 'UHID-2024-8849',
    patientName: 'Kazi Farhadul Alam',
    age: 62,
    referralType: 'Outbound Referral',
    department: 'Nephrology & Renal Medicine',
    targetDoctor: 'Prof. Dr. Shahidul Islam',
    urgency: 'Urgent',
    date: '20 Nov 2026',
    reason: 'Evaluation of persistent hyperkalemia and renal artery stenosis in resistant hypertension.',
    status: 'Accepted',
  },
  {
    id: 'ref-103',
    uhid: 'UHID-2024-8790',
    patientName: 'Nusrat Jahan',
    age: 38,
    referralType: 'Inbound Consult',
    department: 'Obstetrics & Gynecology',
    targetDoctor: 'Prof. Dr. Tanvir Ahmed (Cardiology Opinion)',
    urgency: 'Routine',
    date: '19 Nov 2026',
    reason: 'Cardiac risk evaluation for elective C-section in patient with congenital mitral valve prolapse.',
    status: 'Completed',
  },
];

export interface DoctorScheduleSlot {
  id: string;
  day: string;
  branch: string;
  room: string;
  session: 'Morning OPD' | 'Evening Chamber' | 'IPD Rounds';
  timeRange: string;
  slotDuration: string;
  maxPatients: number;
  bookedCount: number;
  status: 'Active' | 'Full' | 'On Leave';
}

export const DOCTOR_SCHEDULES: DoctorScheduleSlot[] = [
  {
    id: 'sch-01',
    day: 'Saturday',
    branch: 'Dhanmondi Main Wing',
    room: 'Room 302, Level 3',
    session: 'Evening Chamber',
    timeRange: '05:00 PM - 09:00 PM',
    slotDuration: '15 mins',
    maxPatients: 20,
    bookedCount: 18,
    status: 'Active',
  },
  {
    id: 'sch-02',
    day: 'Sunday',
    branch: 'Dhanmondi Main Wing',
    room: 'Room 302, Level 3',
    session: 'Morning OPD',
    timeRange: '10:00 AM - 01:00 PM',
    slotDuration: '15 mins',
    maxPatients: 15,
    bookedCount: 15,
    status: 'Full',
  },
  {
    id: 'sch-03',
    day: 'Sunday',
    branch: 'Dhanmondi Main Wing',
    room: 'Room 302, Level 3',
    session: 'Evening Chamber',
    timeRange: '05:00 PM - 09:00 PM',
    slotDuration: '15 mins',
    maxPatients: 20,
    bookedCount: 16,
    status: 'Active',
  },
  {
    id: 'sch-04',
    day: 'Tuesday',
    branch: 'Uttara Branch Campus',
    room: 'Room 204, Level 2',
    session: 'Evening Chamber',
    timeRange: '05:30 PM - 09:30 PM',
    slotDuration: '15 mins',
    maxPatients: 18,
    bookedCount: 14,
    status: 'Active',
  },
  {
    id: 'sch-05',
    day: 'Thursday',
    branch: 'Dhanmondi Main Wing',
    room: 'Room 302, Level 3',
    session: 'Evening Chamber',
    timeRange: '05:00 PM - 09:00 PM',
    slotDuration: '15 mins',
    maxPatients: 20,
    bookedCount: 12,
    status: 'Active',
  },
  {
    id: 'sch-06',
    day: 'Daily (Sun-Thu)',
    branch: 'Hospital Inpatient Wing',
    room: 'Cardiac ICU & Level 4',
    session: 'IPD Rounds',
    timeRange: '08:30 AM - 10:00 AM',
    slotDuration: 'Inpatients',
    maxPatients: 10,
    bookedCount: 6,
    status: 'Active',
  },
];

export interface DoctorClinicalTask {
  id: string;
  title: string;
  description: string;
  patientRef?: string;
  dueTime: string;
  priority: 'STAT Urgent' | 'High' | 'Normal';
  completed: boolean;
  category: 'Review' | 'Discharge' | 'Prescription' | 'Call';
}

export const DOCTOR_TASKS: DoctorClinicalTask[] = [
  {
    id: 'tsk-01',
    title: 'Review urgent Troponin-I for Shahina Akter',
    description: 'Patient in Emergency triage with suspected NSTEMI. Check with Cath Lab.',
    patientRef: 'UHID-2024-8868',
    dueTime: '04:30 PM Today',
    priority: 'STAT Urgent',
    completed: false,
    category: 'Review',
  },
  {
    id: 'tsk-02',
    title: 'Sign discharge summary for Rehana Sultana',
    description: 'Patient clinically stable in Cabin 408. Ready for discharge home.',
    patientRef: 'Cabin 408 / IPD-2026-0409',
    dueTime: '05:30 PM Today',
    priority: 'High',
    completed: false,
    category: 'Discharge',
  },
  {
    id: 'tsk-03',
    title: 'Approve teleconsultation prescription for Farida Begum',
    description: 'Video consult scheduled for 04:45 PM. Review prior ECHO results.',
    patientRef: 'UHID-2024-8854',
    dueTime: '05:00 PM Today',
    priority: 'Normal',
    completed: false,
    category: 'Prescription',
  },
  {
    id: 'tsk-04',
    title: 'Family counseling for ICU Bed #03 (Haji Ismail)',
    description: 'Discuss heart failure prognosis and long-term inotropic therapy options.',
    patientRef: 'Cardiac ICU #03',
    dueTime: '06:00 PM Today',
    priority: 'High',
    completed: false,
    category: 'Call',
  },
];

export interface DoctorNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'alert' | 'info' | 'message';
  unread: boolean;
}

export const DOCTOR_NOTIFICATIONS: DoctorNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'CRITICAL LAB ALERT: hs-Troponin-I',
    message: 'Pathology has reported a critically high hs-Troponin-I (0.84 ng/mL) for patient Shahina Akter (UHID-2024-8868).',
    timestamp: '10 mins ago',
    type: 'critical',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'New Emergency Walk-in Added to Queue',
    message: 'Triage officer added patient Shahina Akter with high priority to your OPD queue.',
    timestamp: '25 mins ago',
    type: 'alert',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Echocardiogram Report Uploaded',
    message: 'Radiology has published 2D Echocardiogram study for Mrs. Nasrin Sultana (UHID-2024-8842).',
    timestamp: '1 hour ago',
    type: 'info',
    unread: true,
  },
  {
    id: 'notif-4',
    title: 'Cath Lab Schedule Confirmed',
    message: 'Coronary Angioplasty slot reserved for tomorrow 09:30 AM in Cath Lab Suite 1.',
    timestamp: '3 hours ago',
    type: 'info',
    unread: false,
  },
  {
    id: 'notif-5',
    title: 'Pharmacy Dispensing Slip Signed',
    message: 'E-Prescription RX-2026-118812 successfully dispensed by central outpatient pharmacy.',
    timestamp: '4 hours ago',
    type: 'info',
    unread: false,
  },
];

