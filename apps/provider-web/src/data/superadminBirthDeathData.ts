export type Gender = 'Male' | 'Female' | 'Other';

export interface BirthRecord {
  id: string;
  referenceNo: string;
  caseId: string;
  childName: string;
  gender: Gender;
  birthDate: string;
  birthTime: string;
  motherName: string;
  motherUhid: string;
  fatherName: string;
  birthWeightKg: number;
  deliveryType: 'Normal Vaginal Delivery' | 'Cesarean Section (C-Section)' | 'Assisted Vacuum Delivery';
  wardLocation: string;
  attendingDoctor: string;
  contactPhone: string;
  permanentAddress: string;
  certificateStatus: 'Issued' | 'Pending Verification';
  certificateIssueDate: string;
}

export interface DeathRecord {
  id: string;
  referenceNo: string;
  caseId: string;
  patientName: string;
  patientUhid: string;
  age: number;
  gender: Gender;
  deathDate: string;
  deathTime: string;
  guardianName: string;
  guardianRelation: string;
  guardianContact: string;
  wardLocation: string;
  immediateCause: string;
  antecedentCause: string;
  underlyingCause: string;
  attendingDoctor: string;
  autopsyRequired: boolean;
  certificateStatus: 'Issued' | 'Under Legal Review';
  certificateIssueDate: string;
}

export const SMART_BIRTH_RECORDS: BirthRecord[] = [
  {
    id: 'bth-01',
    referenceNo: 'BTH-2026-1042',
    caseId: '7490',
    childName: 'Baby of Farhana',
    gender: 'Male',
    birthDate: '12/11/2026',
    birthTime: '04:32 AM',
    motherName: 'Farhana Sultana',
    motherUhid: 'UHID-2026-1008',
    fatherName: 'Kamal Hossain',
    birthWeightKg: 3.25,
    deliveryType: 'Normal Vaginal Delivery',
    wardLocation: 'Labor Suite 02 · Maternity Ward',
    attendingDoctor: 'Dr. Farhana Yasmin (Obs/Gyn)',
    contactPhone: '+880 181 9283741',
    permanentAddress: 'House 42, Road 9, Dhanmondi R/A, Dhaka',
    certificateStatus: 'Issued',
    certificateIssueDate: '12/11/2026',
  },
  {
    id: 'bth-02',
    referenceNo: 'BTH-2026-1041',
    caseId: '7482',
    childName: 'Ayaan Ahmed',
    gender: 'Male',
    birthDate: '11/11/2026',
    birthTime: '10:15 PM',
    motherName: 'Taslima Nasrin',
    motherUhid: 'UHID-2026-1014',
    fatherName: 'Tariq Ahmed',
    birthWeightKg: 3.48,
    deliveryType: 'Cesarean Section (C-Section)',
    wardLocation: 'OT Suite 03 · Maternity Block',
    attendingDoctor: 'Dr. Sabrina Karim (Obs/Gyn)',
    contactPhone: '+880 171 8392019',
    permanentAddress: 'Sector 4, Uttara Model Town, Dhaka',
    certificateStatus: 'Issued',
    certificateIssueDate: '12/11/2026',
  },
  {
    id: 'bth-03',
    referenceNo: 'BTH-2026-1040',
    caseId: '7476',
    childName: 'Inaya Rahman',
    gender: 'Female',
    birthDate: '11/11/2026',
    birthTime: '01:20 PM',
    motherName: 'Sultana Razia',
    motherUhid: 'UHID-2026-1026',
    fatherName: 'Zubair Rahman',
    birthWeightKg: 2.95,
    deliveryType: 'Normal Vaginal Delivery',
    wardLocation: 'Labor Suite 01 · Maternity Ward',
    attendingDoctor: 'Dr. Farhana Yasmin (Obs/Gyn)',
    contactPhone: '+880 191 7483920',
    permanentAddress: 'Plot 12, Mirpur 10, Dhaka',
    certificateStatus: 'Issued',
    certificateIssueDate: '11/11/2026',
  },
  {
    id: 'bth-04',
    referenceNo: 'BTH-2026-1039',
    caseId: '7468',
    childName: 'Baby of Sharmeen',
    gender: 'Female',
    birthDate: '10/11/2026',
    birthTime: '07:45 AM',
    motherName: 'Sharmeen Sultana',
    motherUhid: 'UHID-2026-1010',
    fatherName: 'Asaduzzaman Khan',
    birthWeightKg: 3.1,
    deliveryType: 'Cesarean Section (C-Section)',
    wardLocation: 'OT Suite 02 · Maternity Block',
    attendingDoctor: 'Dr. Sabrina Karim (Obs/Gyn)',
    contactPhone: '+880 161 8493021',
    permanentAddress: 'Road 5, Dhanmondi, Dhaka',
    certificateStatus: 'Issued',
    certificateIssueDate: '11/11/2026',
  },
  {
    id: 'bth-05',
    referenceNo: 'BTH-2026-1038',
    caseId: '7455',
    childName: 'Zayan Kabir',
    gender: 'Male',
    birthDate: '09/11/2026',
    birthTime: '06:10 PM',
    motherName: 'Nusrat Jahan',
    motherUhid: 'UHID-2026-1032',
    fatherName: 'Anisul Kabir',
    birthWeightKg: 3.32,
    deliveryType: 'Normal Vaginal Delivery',
    wardLocation: 'Labor Suite 03 · Maternity Ward',
    attendingDoctor: 'Dr. Farhana Yasmin (Obs/Gyn)',
    contactPhone: '+880 172 8394012',
    permanentAddress: 'Zindabazar, Sylhet',
    certificateStatus: 'Issued',
    certificateIssueDate: '10/11/2026',
  },
  {
    id: 'bth-06',
    referenceNo: 'BTH-2026-1037',
    caseId: '7449',
    childName: 'Baby of Sadia',
    gender: 'Female',
    birthDate: '08/11/2026',
    birthTime: '11:35 AM',
    motherName: 'Sadia Afrin',
    motherUhid: 'UHID-2026-1004',
    fatherName: 'Mahir Faisal',
    birthWeightKg: 2.8,
    deliveryType: 'Assisted Vacuum Delivery',
    wardLocation: 'Labor Suite 01 · Maternity Ward',
    attendingDoctor: 'Dr. Farhana Yasmin (Obs/Gyn)',
    contactPhone: '+880 183 9201928',
    permanentAddress: 'Nasirabad, Chattogram',
    certificateStatus: 'Pending Verification',
    certificateIssueDate: '-',
  },
];

export const SMART_DEATH_RECORDS: DeathRecord[] = [
  {
    id: 'dth-01',
    referenceNo: 'DTH-2026-081',
    caseId: '7431',
    patientName: 'Kazi Nurul Huda',
    patientUhid: 'UHID-2026-1014',
    age: 72,
    gender: 'Male',
    deathDate: '11/11/2026',
    deathTime: '11:45 PM',
    guardianName: 'Kazi Mahbubul Huda',
    guardianRelation: 'Son',
    guardianContact: '+880 171 9483720',
    wardLocation: 'ICU Bed 04 · Critical Care Unit',
    immediateCause: 'Cardiopulmonary Arrest',
    antecedentCause: 'Septic Shock with Multi-Organ Dysfunction Syndrome',
    underlyingCause: 'Severe Community-Acquired Bilateral Pneumonia with Type II Respiratory Failure',
    attendingDoctor: 'Dr. Mahmudul Hasan (Critical Care Specialist)',
    autopsyRequired: false,
    certificateStatus: 'Issued',
    certificateIssueDate: '12/11/2026',
  },
  {
    id: 'dth-02',
    referenceNo: 'DTH-2026-080',
    caseId: '7419',
    patientName: 'Anowar Hossain Chowdhury',
    patientUhid: 'UHID-2026-1029',
    age: 68,
    gender: 'Male',
    deathDate: '09/11/2026',
    deathTime: '03:15 AM',
    guardianName: 'Salma Chowdhury',
    guardianRelation: 'Spouse',
    guardianContact: '+880 181 8392019',
    wardLocation: 'CCU Suite 02 · Cardiology Wing',
    immediateCause: 'Ventricular Fibrillation & Asystole',
    antecedentCause: 'Acute Extensive Anterior Wall ST-Elevation Myocardial Infarction',
    underlyingCause: 'Severe Triple Vessel Coronary Artery Disease with Cardiogenic Shock',
    attendingDoctor: 'Dr. Reyan Jain (Interventional Cardiologist)',
    autopsyRequired: false,
    certificateStatus: 'Issued',
    certificateIssueDate: '09/11/2026',
  },
  {
    id: 'dth-03',
    referenceNo: 'DTH-2026-079',
    caseId: '7405',
    patientName: 'Rabeya Khatun',
    patientUhid: 'UHID-2026-1038',
    age: 81,
    gender: 'Female',
    deathDate: '07/11/2026',
    deathTime: '06:50 PM',
    guardianName: 'Dr. Masudur Rahman',
    guardianRelation: 'Son',
    guardianContact: '+880 191 8392011',
    wardLocation: 'HDU Bed 06 · High Dependency Unit',
    immediateCause: 'Acute Respiratory Failure',
    antecedentCause: 'Acute Exacerbation of Chronic Obstructive Pulmonary Disease (COPD)',
    underlyingCause: 'Cor Pulmonale with End-stage Pulmonary Fibrosis',
    attendingDoctor: 'Dr. Sajjad Hossain (Pulmonologist)',
    autopsyRequired: false,
    certificateStatus: 'Issued',
    certificateIssueDate: '08/11/2026',
  },
  {
    id: 'dth-04',
    referenceNo: 'DTH-2026-078',
    caseId: '7392',
    patientName: 'Jahangir Alam',
    patientUhid: 'UHID-2026-1045',
    age: 49,
    gender: 'Male',
    deathDate: '05/11/2026',
    deathTime: '02:30 PM',
    guardianName: 'Rokeya Begum',
    guardianRelation: 'Spouse',
    guardianContact: '+880 161 7483920',
    wardLocation: 'Emergency Resuscitation Suite 01',
    immediateCause: 'Severe Hemorrhagic Shock & Brainstem Herniation',
    antecedentCause: 'Extensive Traumatic Brain Injury with Subdural Hematoma',
    underlyingCause: 'High-Velocity Road Traffic Collision (RTA)',
    attendingDoctor: 'Dr. Tariqul Anwar (Emergency Consultant)',
    autopsyRequired: true,
    certificateStatus: 'Under Legal Review',
    certificateIssueDate: '-',
  },
];

