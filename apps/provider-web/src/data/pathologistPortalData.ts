/**
 * Pathologist Portal Data Layer
 * Green Life Hospital ERP - Laboratory Medicine & Diagnostic Pathology
 */

export type PathologyCategory =
  | 'Hematology'
  | 'Biochemistry'
  | 'Microbiology'
  | 'Immunology & Serology'
  | 'Histopathology & Cytology'
  | 'Clinical Pathology';

export interface PathologistProfile {
  id: string;
  name: string;
  qualification: string;
  designation: string;
  specialization: string;
  bmdcRegNo: string;
  digitalSignatureUrl?: string;
  email: string;
  phone: string;
  hospitalBranch: string;
  licenseValidUntil: string;
  department: string;
}

export const CURRENT_PATHOLOGIST: PathologistProfile = {
  id: 'PATH-01',
  name: 'Dr. Nusrat Jahan',
  qualification: 'MBBS, M.Phil (Pathology), FCPS (Hematology)',
  designation: 'Senior Consultant Pathologist & Lab Director',
  specialization: 'Clinical Hematology & Bone Marrow Morphology',
  bmdcRegNo: 'BMDC-A-41295',
  email: 'nusrat.pathology@greenlife.hospital',
  phone: '+880 1711-884210',
  hospitalBranch: 'Green Life Hospital Central Diagnostic Hub',
  licenseValidUntil: '2028-12-31',
  department: 'Department of Laboratory Medicine',
};

// =============================================================================
// DATA STRUCTURES
// =============================================================================

export interface TestParameterItem {
  id: string;
  name: string;
  observedValue: string;
  referenceRange: string;
  unit: string;
  flag?: 'Normal' | 'High' | 'Low' | 'Critical';
  previousValue?: string;
}

export interface LabTestVerificationItem {
  id: string;
  billNo: string;
  sampleBarcode: string;
  orderDate: string;
  patientName: string;
  uhid: string;
  ageGender: string;
  bedNumber?: string;
  patientType: 'IPD Cabin' | 'ICU Critical' | 'Emergency Triage' | 'OPD Specialist';
  referringDoctor: string;
  doctorDepartment: string;
  testName: string;
  testCode: string;
  category: PathologyCategory;
  sampleType: string;
  parameters: TestParameterItem[];
  technicianNotes?: string;
  pathologistInterpretation?: string;
  deltaCheckNote?: string;
  analyzedAt: string;
  technicianName: string;
  isCritical: boolean;
  priority: 'STAT / Emergency' | 'Urgent' | 'Routine';
  verificationStatus: 'Pending Verification' | 'Verified & Signed' | 'Retest Requested' | 'Rejected';
}

export interface CriticalResultAlert {
  id: string;
  uhid: string;
  patientName: string;
  ageGender: string;
  wardOrBed: string;
  testName: string;
  parameterName: string;
  criticalValue: string;
  normalRange: string;
  alertDetectedAt: string;
  orderingDoctor: string;
  doctorPhone: string;
  notificationStatus: 'Pending Doctor Call' | 'Doctor Notified' | 'Acknowledged by Doctor';
  actionNote?: string;
  acknowledgedBy?: string;
  acknowledgedTime?: string;
}

export interface FinalLabReportItem {
  id: string;
  reportNo: string;
  billNo: string;
  barcode: string;
  patientName: string;
  uhid: string;
  ageGender: string;
  testName: string;
  category: PathologyCategory;
  orderedBy: string;
  verifiedAt: string;
  pathologistName: string;
  qrVerificationCode: string;
  overallImpression: string;
  downloadCount: number;
  deliveryStatus: 'Ready for Patient Portal' | 'Delivered via SMS/WhatsApp' | 'Printed at Counter';
}

export interface LabPatientRequest {
  id: string;
  orderNo: string;
  requestedAt: string;
  patientName: string;
  uhid: string;
  ageGender: string;
  source: 'OPD Chamber' | 'IPD Ward' | 'Emergency' | 'ICU';
  referringDoctor: string;
  clinicalIndication: string;
  testsOrdered: string[];
  sampleBarcode: string;
  sampleStatus: 'Collected' | 'In Transit' | 'Received in Lab' | 'Processing';
  priority: 'STAT / Emergency' | 'Urgent' | 'Routine';
}

export interface LabSampleItem {
  id: string;
  barcode: string;
  patientName: string;
  uhid: string;
  testName: string;
  sampleType: string;
  tubeType: 'Lavender (EDTA)' | 'Gold / Red (Serum SST)' | 'Light Blue (Citrate)' | 'Grey (Fluoride)' | 'Sterile Cup';
  collectedAt: string;
  collectedBy: string;
  storageLocation: string;
  condition: 'Optimal' | 'Mildly Lipemic' | 'Hemolyzed (Reject)' | 'Clotted (Reject)';
  status: 'In Analysis' | 'Queued in Lab' | 'Rejected' | 'Recollection Requested';
}

export interface QualityControlRecord {
  id: string;
  instrumentName: string;
  assayParameter: string;
  controlLevel: 'Level 1 (Low)' | 'Level 2 (Normal)' | 'Level 3 (High)';
  controlLotNo: string;
  targetMean: number;
  observedValue: number;
  standardDeviation: number;
  westgardRule: 'In Control (Within ±1SD)' | 'Warning (±2SD)' | 'Violation (1-3s)' | 'Passed';
  runTime: string;
  technologistName: string;
  status: 'Accepted' | 'Calibration Required';
}

export interface TurnaroundTimeStat {
  category: PathologyCategory;
  testsProcessedToday: number;
  targetMinutes: number;
  averageMinutes: number;
  complianceRate: number;
  delayedCount: number;
}

// =============================================================================
// MOCK DATASETS
// =============================================================================

export const LAB_VERIFICATION_QUEUE_DATA: LabTestVerificationItem[] = [
  {
    id: 'VER-01',
    billNo: 'LAB-2026-9041',
    sampleBarcode: 'GLH-BC-88401',
    orderDate: '2026-11-24 09:15',
    patientName: 'Prof. Rafiqul Islam (62M)',
    uhid: 'UHID-GLH-09412',
    ageGender: '62Y / Male',
    bedNumber: 'Cabin 402',
    patientType: 'IPD Cabin',
    referringDoctor: 'Prof. Dr. M. A. Hasan',
    doctorDepartment: 'General Surgery & Laparoscopy',
    testName: 'Complete Blood Count (CBC) with Peripheral Blood Film',
    testCode: 'HAEM-CBC-01',
    category: 'Hematology',
    sampleType: 'EDTA Whole Blood',
    analyzedAt: '2026-11-24 10:20',
    technicianName: 'Md. Shahidul Alam, BSc MLT',
    technicianNotes: 'Analyzer flagged severe thrombocytopenia. Slide prepared for manual microscopy.',
    deltaCheckNote: 'Platelets dropped sharply from 1,45,000/μL on Nov 21 to 24,000/μL today.',
    pathologistInterpretation: 'Marked thrombocytopenia confirmed on peripheral blood film. True thrombocytopenia (no EDTA-induced platelet clumping). Toxic granulation in neutrophils noted.',
    isCritical: true,
    priority: 'STAT / Emergency',
    verificationStatus: 'Pending Verification',
    parameters: [
      { id: 'p1', name: 'Hemoglobin (Hb)', observedValue: '10.8', referenceRange: '13.0 - 17.0', unit: 'g/dL', flag: 'Low', previousValue: '11.2' },
      { id: 'p2', name: 'Total WBC Count', observedValue: '14,800', referenceRange: '4,000 - 11,000', unit: '/μL', flag: 'High', previousValue: '9,800' },
      { id: 'p3', name: 'Platelet Count', observedValue: '24,000', referenceRange: '1,50,000 - 4,50,000', unit: '/μL', flag: 'Critical', previousValue: '1,45,000' },
      { id: 'p4', name: 'Neutrophils', observedValue: '82', referenceRange: '40 - 75', unit: '%', flag: 'High', previousValue: '68' },
      { id: 'p5', name: 'Lymphocytes', observedValue: '12', referenceRange: '20 - 45', unit: '%', flag: 'Low', previousValue: '25' },
      { id: 'p6', name: 'ESR (Westergren)', observedValue: '48', referenceRange: '0 - 15', unit: 'mm/1st hr', flag: 'High', previousValue: '35' },
    ],
  },
  {
    id: 'VER-02',
    billNo: 'LAB-2026-9045',
    sampleBarcode: 'GLH-BC-88402',
    orderDate: '2026-11-24 09:30',
    patientName: 'Kazi Tanvir Ahmed (42M)',
    uhid: 'UHID-GLH-09744',
    ageGender: '42Y / Male',
    bedNumber: 'ICU Bed 06',
    patientType: 'ICU Critical',
    referringDoctor: 'Dr. Shahed Kamal, MD',
    doctorDepartment: 'Critical Care & Cardiology',
    testName: 'High-Sensitivity Cardiac Troponin-I (hs-cTnI) & CK-MB',
    testCode: 'BIO-TROP-02',
    category: 'Biochemistry',
    sampleType: 'Serum / Lithium Heparin Plasma',
    analyzedAt: '2026-11-24 10:15',
    technicianName: 'Sultana Razia, Senior Biochemist',
    technicianNotes: 'Roche Cobas e411 ECLIA run. Result verified in duplicate.',
    deltaCheckNote: 'Troponin-I elevated from 12 ng/L (admission) to 2,450 ng/L.',
    pathologistInterpretation: 'Acute myocardial injury pattern. Massive elevation of hs-cTnI. Urgent cardiology review and catheterization recommended.',
    isCritical: true,
    priority: 'STAT / Emergency',
    verificationStatus: 'Pending Verification',
    parameters: [
      { id: 'p1', name: 'High-Sensitivity Troponin-I', observedValue: '2,450.0', referenceRange: '< 19.8 (99th percentile URL)', unit: 'ng/L', flag: 'Critical', previousValue: '12.0' },
      { id: 'p2', name: 'Creatine Kinase-MB (CK-MB)', observedValue: '68.4', referenceRange: '< 24.0', unit: 'U/L', flag: 'High', previousValue: '18.2' },
      { id: 'p3', name: 'Total CPK', observedValue: '485', referenceRange: '39 - 308', unit: 'U/L', flag: 'High', previousValue: '140' },
    ],
  },
  {
    id: 'VER-03',
    billNo: 'LAB-2026-9048',
    sampleBarcode: 'GLH-BC-88403',
    orderDate: '2026-11-24 09:45',
    patientName: 'Begum Laila Arjumand (58F)',
    uhid: 'UHID-GLH-08819',
    ageGender: '58Y / Female',
    bedNumber: 'Cabin 304',
    patientType: 'IPD Cabin',
    referringDoctor: 'Prof. Dr. Farhana Yasmin',
    doctorDepartment: 'Nephrology & Internal Medicine',
    testName: 'Renal Function Profile (Serum Urea, Creatinine & Electrolytes)',
    testCode: 'BIO-RFT-03',
    category: 'Biochemistry',
    sampleType: 'Serum SST',
    analyzedAt: '2026-11-24 10:40',
    technicianName: 'Md. Shahidul Alam, BSc MLT',
    technicianNotes: 'Beckman Coulter AU480 run. No hemolysis detected.',
    deltaCheckNote: 'Serum Creatinine increased from 1.6 mg/dL to 3.8 mg/dL. Potassium critical at 6.8 mmol/L.',
    pathologistInterpretation: 'Severe acute kidney injury with critical hyperkalemia (K+ 6.8 mmol/L). High risk of cardiac arrhythmia. Immediate dialysis consult indicated.',
    isCritical: true,
    priority: 'STAT / Emergency',
    verificationStatus: 'Pending Verification',
    parameters: [
      { id: 'p1', name: 'Serum Creatinine', observedValue: '3.8', referenceRange: '0.6 - 1.2', unit: 'mg/dL', flag: 'High', previousValue: '1.6' },
      { id: 'p2', name: 'Blood Urea Nitrogen (BUN)', observedValue: '78.5', referenceRange: '8.0 - 23.0', unit: 'mg/dL', flag: 'High', previousValue: '34.0' },
      { id: 'p3', name: 'Potassium (K+)', observedValue: '6.8', referenceRange: '3.5 - 5.1', unit: 'mmol/L', flag: 'Critical', previousValue: '4.6' },
      { id: 'p4', name: 'Sodium (Na+)', observedValue: '132.0', referenceRange: '136 - 145', unit: 'mmol/L', flag: 'Low', previousValue: '138.0' },
      { id: 'p5', name: 'Chloride (Cl-)', observedValue: '96.0', referenceRange: '98 - 107', unit: 'mmol/L', flag: 'Low', previousValue: '101.0' },
      { id: 'p6', name: 'eGFR (CKD-EPI)', observedValue: '12.4', referenceRange: '> 90', unit: 'mL/min/1.73m²', flag: 'Low', previousValue: '38.0' },
    ],
  },
  {
    id: 'VER-04',
    billNo: 'LAB-2026-9052',
    sampleBarcode: 'GLH-BC-88404',
    orderDate: '2026-11-24 10:00',
    patientName: 'Moniruzzaman (48M)',
    uhid: 'UHID-GLH-09802',
    ageGender: '48Y / Male',
    patientType: 'OPD Specialist',
    referringDoctor: 'Dr. Tariqul Islam, FCPS',
    doctorDepartment: 'Endocrinology & Diabetes',
    testName: 'Comprehensive Diabetes & Lipid Panel (HbA1c & Lipogram)',
    testCode: 'BIO-DM-04',
    category: 'Biochemistry',
    sampleType: 'Fluoride Plasma & Serum SST',
    analyzedAt: '2026-11-24 11:10',
    technicianName: 'Sultana Razia, Senior Biochemist',
    technicianNotes: 'Bio-Rad D-10 HPLC used for HbA1c. Calibration valid.',
    deltaCheckNote: 'HbA1c consistent with known uncontrolled diabetes.',
    pathologistInterpretation: 'Suboptimal glycemic control (HbA1c 9.4%) with mixed dyslipidemia (elevated triglycerides and LDL).',
    isCritical: false,
    priority: 'Routine',
    verificationStatus: 'Pending Verification',
    parameters: [
      { id: 'p1', name: 'Fasting Plasma Glucose (FPG)', observedValue: '168.0', referenceRange: '70 - 100', unit: 'mg/dL', flag: 'High', previousValue: '154.0' },
      { id: 'p2', name: 'HbA1c (Glycated Hemoglobin)', observedValue: '9.4', referenceRange: '< 5.7 (Normal), > 6.5 (Diabetes)', unit: '%', flag: 'High', previousValue: '9.1' },
      { id: 'p3', name: 'Estimated Average Glucose (eAG)', observedValue: '223', referenceRange: '< 126', unit: 'mg/dL', flag: 'High', previousValue: '214' },
      { id: 'p4', name: 'Total Cholesterol', observedValue: '245', referenceRange: '< 200', unit: 'mg/dL', flag: 'High', previousValue: '230' },
      { id: 'p5', name: 'Serum Triglycerides', observedValue: '310', referenceRange: '< 150', unit: 'mg/dL', flag: 'High', previousValue: '280' },
      { id: 'p6', name: 'HDL Cholesterol (Direct)', observedValue: '36.0', referenceRange: '> 40.0', unit: 'mg/dL', flag: 'Low', previousValue: '38.0' },
      { id: 'p7', name: 'LDL Cholesterol (Calculated)', observedValue: '147.0', referenceRange: '< 100.0', unit: 'mg/dL', flag: 'High', previousValue: '136.0' },
    ],
  },
  {
    id: 'VER-05',
    billNo: 'LAB-2026-9055',
    sampleBarcode: 'GLH-BC-88405',
    orderDate: '2026-11-24 10:15',
    patientName: 'Shahadat Hossain (35M)',
    uhid: 'UHID-GLH-09855',
    ageGender: '35Y / Male',
    patientType: 'Emergency Triage',
    referringDoctor: 'Dr. Nusrat Jahan, FCPS',
    doctorDepartment: 'Emergency Medicine',
    testName: 'Arterial Blood Gas Analysis (ABG with Lactate & Electrolytes)',
    testCode: 'BIO-ABG-05',
    category: 'Clinical Pathology',
    sampleType: 'Heparinized Arterial Blood',
    analyzedAt: '2026-11-24 10:35',
    technicianName: 'Md. Shahidul Alam, BSc MLT',
    technicianNotes: 'Radiometer ABL90 analyzer. Run within 10 min of arterial draw on ice.',
    deltaCheckNote: 'Severe metabolic acidosis. Lactate 5.2 mmol/L.',
    pathologistInterpretation: 'Partially compensated metabolic acidosis with high anion gap and significant hyperlactatemia. Consistent with severe sepsis / tissue hypoperfusion.',
    isCritical: true,
    priority: 'STAT / Emergency',
    verificationStatus: 'Pending Verification',
    parameters: [
      { id: 'p1', name: 'Arterial pH', observedValue: '7.21', referenceRange: '7.35 - 7.45', unit: 'pH units', flag: 'Critical', previousValue: '7.36' },
      { id: 'p2', name: 'pCO2 (Partial Pressure CO2)', observedValue: '28.0', referenceRange: '35.0 - 45.0', unit: 'mmHg', flag: 'Low', previousValue: '38.0' },
      { id: 'p3', name: 'pO2 (Partial Pressure O2)', observedValue: '78.0', referenceRange: '80.0 - 100.0', unit: 'mmHg', flag: 'Low', previousValue: '92.0' },
      { id: 'p4', name: 'Actual Bicarbonate (HCO3-)', observedValue: '11.2', referenceRange: '22.0 - 26.0', unit: 'mmol/L', flag: 'Critical', previousValue: '23.0' },
      { id: 'p5', name: 'Base Excess (BE)', observedValue: '-14.8', referenceRange: '-2.0 - +2.0', unit: 'mmol/L', flag: 'Critical', previousValue: '-0.5' },
      { id: 'p6', name: 'Blood Lactate', observedValue: '5.2', referenceRange: '0.5 - 2.0', unit: 'mmol/L', flag: 'Critical', previousValue: '1.2' },
    ],
  },
  {
    id: 'VER-06',
    billNo: 'LAB-2026-9060',
    sampleBarcode: 'GLH-BC-88406',
    orderDate: '2026-11-24 10:30',
    patientName: 'Anowara Begum (52F)',
    uhid: 'UHID-GLH-09881',
    ageGender: '52Y / Female',
    bedNumber: 'Cabin 508',
    patientType: 'IPD Cabin',
    referringDoctor: 'Prof. Dr. A.K. Azad',
    doctorDepartment: 'Hepatology & Gastroenterology',
    testName: 'Hepatic Function Panel (LFT with Enzymes & Bilirubin Fractions)',
    testCode: 'BIO-LFT-06',
    category: 'Biochemistry',
    sampleType: 'Serum SST',
    analyzedAt: '2026-11-24 11:25',
    technicianName: 'Sultana Razia, Senior Biochemist',
    technicianNotes: 'Serum icteric. Total bilirubin 6.2 mg/dL.',
    deltaCheckNote: 'ALT and AST markedly elevated (acute flare).',
    pathologistInterpretation: 'Acute hepatocellular injury pattern with direct hyperbilirubinemia. ALT > AST elevation suggestive of acute viral or toxic hepatitis.',
    isCritical: false,
    priority: 'Urgent',
    verificationStatus: 'Pending Verification',
    parameters: [
      { id: 'p1', name: 'Total Bilirubin', observedValue: '6.2', referenceRange: '0.2 - 1.2', unit: 'mg/dL', flag: 'High', previousValue: '1.1' },
      { id: 'p2', name: 'Direct Bilirubin', observedValue: '4.4', referenceRange: '0.0 - 0.3', unit: 'mg/dL', flag: 'High', previousValue: '0.2' },
      { id: 'p3', name: 'SGPT / ALT', observedValue: '580', referenceRange: '< 41', unit: 'U/L', flag: 'Critical', previousValue: '35' },
      { id: 'p4', name: 'SGOT / AST', observedValue: '420', referenceRange: '< 40', unit: 'U/L', flag: 'High', previousValue: '38' },
      { id: 'p5', name: 'Alkaline Phosphatase (ALP)', observedValue: '195', referenceRange: '40 - 130', unit: 'U/L', flag: 'High', previousValue: '110' },
      { id: 'p6', name: 'Serum Albumin', observedValue: '3.6', referenceRange: '3.5 - 5.2', unit: 'g/dL', flag: 'Normal', previousValue: '3.8' },
    ],
  },
  {
    id: 'VER-07',
    billNo: 'LAB-2026-9065',
    sampleBarcode: 'GLH-BC-88407',
    orderDate: '2026-11-23 16:00',
    patientName: 'Taslima Akhter (29F)',
    uhid: 'UHID-GLH-09553',
    ageGender: '29Y / Female',
    bedNumber: 'Post-Op Ward 12',
    patientType: 'IPD Cabin',
    referringDoctor: 'Dr. Nusrat Jahan, FCPS',
    doctorDepartment: 'Obstetrics & Gynecology',
    testName: 'Coagulation Profile (PT, INR, APTT & Fibrinogen)',
    testCode: 'HAEM-COAG-07',
    category: 'Hematology',
    sampleType: 'Sodium Citrate (Blue Tube 9:1)',
    analyzedAt: '2026-11-24 09:10',
    technicianName: 'Md. Shahidul Alam, BSc MLT',
    technicianNotes: 'Stago Compact Max analyzer. Automated clot detection.',
    deltaCheckNote: 'Post-cesarean coagulation normal.',
    pathologistInterpretation: 'Coagulation profile within expected therapeutic limits. Normal hemostatic parameters.',
    isCritical: false,
    priority: 'Routine',
    verificationStatus: 'Verified & Signed',
    parameters: [
      { id: 'p1', name: 'Prothrombin Time (PT)', observedValue: '12.4', referenceRange: '11.0 - 13.5', unit: 'Seconds', flag: 'Normal' },
      { id: 'p2', name: 'Control PT', observedValue: '12.0', referenceRange: '11.5 - 12.5', unit: 'Seconds', flag: 'Normal' },
      { id: 'p3', name: 'INR (International Normalized Ratio)', observedValue: '1.04', referenceRange: '0.9 - 1.2', unit: 'Ratio', flag: 'Normal' },
      { id: 'p4', name: 'Activated Partial Thromboplastin Time (APTT)', observedValue: '31.2', referenceRange: '26.0 - 36.0', unit: 'Seconds', flag: 'Normal' },
      { id: 'p5', name: 'Fibrinogen', observedValue: '340', referenceRange: '200 - 400', unit: 'mg/dL', flag: 'Normal' },
    ],
  },
];

export const CRITICAL_RESULTS_DATA: CriticalResultAlert[] = [
  {
    id: 'CRIT-01',
    uhid: 'UHID-GLH-09412',
    patientName: 'Prof. Rafiqul Islam (62M)',
    ageGender: '62Y / Male',
    wardOrBed: 'Cabin 402 (Surgery)',
    testName: 'Complete Blood Count (CBC)',
    parameterName: 'Platelet Count',
    criticalValue: '24,000 /μL',
    normalRange: '1,50,000 - 4,50,000 /μL',
    alertDetectedAt: '2026-11-24 10:20',
    orderingDoctor: 'Prof. Dr. M. A. Hasan',
    doctorPhone: '01711-229910',
    notificationStatus: 'Pending Doctor Call',
    actionNote: 'High risk of spontaneous mucosal bleeding. Platelet concentrate requisition advised.',
  },
  {
    id: 'CRIT-02',
    uhid: 'UHID-GLH-09744',
    patientName: 'Kazi Tanvir Ahmed (42M)',
    ageGender: '42Y / Male',
    wardOrBed: 'ICU Bed 06',
    testName: 'High-Sensitivity Troponin-I',
    parameterName: 'hs-cTnI',
    criticalValue: '2,450.0 ng/L',
    normalRange: '< 19.8 ng/L',
    alertDetectedAt: '2026-11-24 10:15',
    orderingDoctor: 'Dr. Shahed Kamal, MD',
    doctorPhone: '01819-338822',
    notificationStatus: 'Acknowledged by Doctor',
    actionNote: 'Alert communicated directly to ICU Consultant Dr. Shahed. Patient transferred for emergency angiogram.',
    acknowledgedBy: 'Dr. Shahed Kamal (ICU Lead)',
    acknowledgedTime: '2026-11-24 10:25',
  },
  {
    id: 'CRIT-03',
    uhid: 'UHID-GLH-08819',
    patientName: 'Begum Laila Arjumand (58F)',
    ageGender: '58Y / Female',
    wardOrBed: 'Cabin 304 (Nephrology)',
    testName: 'Renal Function & Electrolytes',
    parameterName: 'Potassium (K+)',
    criticalValue: '6.8 mmol/L',
    normalRange: '3.5 - 5.1 mmol/L',
    alertDetectedAt: '2026-11-24 10:40',
    orderingDoctor: 'Prof. Dr. Farhana Yasmin',
    doctorPhone: '01911-552200',
    notificationStatus: 'Doctor Notified',
    actionNote: 'Spoke with Duty Medical Officer Dr. Saiful. Calcium gluconate and insulin-dextrose therapy initiated.',
    acknowledgedBy: 'Dr. Saiful Islam (DMO Nephro)',
    acknowledgedTime: '2026-11-24 10:48',
  },
  {
    id: 'CRIT-04',
    uhid: 'UHID-GLH-09855',
    patientName: 'Shahadat Hossain (35M)',
    ageGender: '35Y / Male',
    wardOrBed: 'Emergency Observation Resus Bed 2',
    testName: 'Arterial Blood Gas (ABG)',
    parameterName: 'Blood Lactate & pH',
    criticalValue: 'Lactate 5.2 mmol/L | pH 7.21',
    normalRange: 'Lactate < 2.0 | pH 7.35-7.45',
    alertDetectedAt: '2026-11-24 10:35',
    orderingDoctor: 'Dr. Nusrat Jahan, FCPS',
    doctorPhone: '01712-441199',
    notificationStatus: 'Acknowledged by Doctor',
    actionNote: 'Emergency Physician notified immediately. IV resuscitation fluid and noradrenaline infusion started.',
    acknowledgedBy: 'Dr. Nusrat Jahan (EMO)',
    acknowledgedTime: '2026-11-24 10:39',
  },
];

export const FINAL_LAB_REPORTS_DATA: FinalLabReportItem[] = [
  {
    id: 'REP-01',
    reportNo: 'REP-GLH-2026-10490',
    billNo: 'LAB-2026-8990',
    barcode: 'GLH-BC-88120',
    patientName: 'Mahbubur Rahman (54M)',
    uhid: 'UHID-GLH-09221',
    ageGender: '54Y / Male',
    testName: 'Complete Blood Count (CBC) with Peripheral Blood Film',
    category: 'Hematology',
    orderedBy: 'Prof. Dr. M. A. Hasan',
    verifiedAt: '2026-11-24 08:45',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    qrVerificationCode: 'https://verify.greenlife.hospital/lab/REP-GLH-2026-10490',
    overallImpression: 'Normocytic normochromic blood picture. Platelets adequate. No abnormal cells.',
    downloadCount: 2,
    deliveryStatus: 'Ready for Patient Portal',
  },
  {
    id: 'REP-02',
    reportNo: 'REP-GLH-2026-10488',
    billNo: 'LAB-2026-8975',
    barcode: 'GLH-BC-88118',
    patientName: 'Shahnaz Parveen (38F)',
    uhid: 'UHID-GLH-09340',
    ageGender: '38Y / Female',
    testName: 'Thyroid Function Profile (FT3, FT4 & Ultra-Sensitive TSH)',
    category: 'Immunology & Serology',
    orderedBy: 'Dr. Tariqul Islam, FCPS',
    verifiedAt: '2026-11-23 18:30',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    qrVerificationCode: 'https://verify.greenlife.hospital/lab/REP-GLH-2026-10488',
    overallImpression: 'Primary Hypothyroidism. Serum TSH markedly elevated (14.2 mIU/L) with low FT4.',
    downloadCount: 3,
    deliveryStatus: 'Delivered via SMS/WhatsApp',
  },
  {
    id: 'REP-03',
    reportNo: 'REP-GLH-2026-10485',
    billNo: 'LAB-2026-8960',
    barcode: 'GLH-BC-88112',
    patientName: 'Taslima Akhter (29F)',
    uhid: 'UHID-GLH-09553',
    ageGender: '29Y / Female',
    testName: 'Coagulation Profile (PT, INR, APTT & Fibrinogen)',
    category: 'Hematology',
    orderedBy: 'Dr. Nusrat Jahan, FCPS',
    verifiedAt: '2026-11-24 09:10',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    qrVerificationCode: 'https://verify.greenlife.hospital/lab/REP-GLH-2026-10485',
    overallImpression: 'Hemostatic parameters within therapeutic normal limits. Normal PT/INR and APTT.',
    downloadCount: 1,
    deliveryStatus: 'Printed at Counter',
  },
  {
    id: 'REP-04',
    reportNo: 'REP-GLH-2026-10480',
    billNo: 'LAB-2026-8942',
    barcode: 'GLH-BC-88090',
    patientName: 'Enamul Haque (67M)',
    uhid: 'UHID-GLH-08990',
    ageGender: '67Y / Male',
    testName: 'Prostate Specific Antigen (Total PSA - ECLIA)',
    category: 'Immunology & Serology',
    orderedBy: 'Prof. Dr. A.K. Azad',
    verifiedAt: '2026-11-23 16:15',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    qrVerificationCode: 'https://verify.greenlife.hospital/lab/REP-GLH-2026-10480',
    overallImpression: 'Total PSA 2.8 ng/mL (Normal age-adjusted reference range). No indication of acute malignancy.',
    downloadCount: 4,
    deliveryStatus: 'Delivered via SMS/WhatsApp',
  },
];

export const LAB_PATIENT_REQUESTS_DATA: LabPatientRequest[] = [
  {
    id: 'REQ-01',
    orderNo: 'REQ-2026-7810',
    requestedAt: '2026-11-24 10:45',
    patientName: 'Khandaker Monirul Alam (51M)',
    uhid: 'UHID-GLH-09902',
    ageGender: '51Y / Male',
    source: 'IPD Ward',
    referringDoctor: 'Prof. Dr. M. A. Hasan',
    clinicalIndication: 'Pre-operative cardiac and coagulation assessment prior to cholecystectomy',
    testsOrdered: ['Complete Blood Count', 'Serum Creatinine', 'PT / INR', 'HBsAg Screening'],
    sampleBarcode: 'GLH-BC-88510',
    sampleStatus: 'Processing',
    priority: 'STAT / Emergency',
  },
  {
    id: 'REQ-02',
    orderNo: 'REQ-2026-7808',
    requestedAt: '2026-11-24 10:30',
    patientName: 'Farhana Chowdhury (34F)',
    uhid: 'UHID-GLH-09914',
    ageGender: '34Y / Female',
    source: 'OPD Chamber',
    referringDoctor: 'Dr. Farhana Yasmin',
    clinicalIndication: 'Evaluation of persistent fatigue, pallor, and microcytic anemia',
    testsOrdered: ['Serum Ferritin', 'Iron Profile & TIBC', 'Peripheral Blood Film', 'Stool for OBT'],
    sampleBarcode: 'GLH-BC-88508',
    sampleStatus: 'Received in Lab',
    priority: 'Routine',
  },
  {
    id: 'REQ-03',
    orderNo: 'REQ-2026-7805',
    requestedAt: '2026-11-24 10:15',
    patientName: 'Mohammad Ali (72M)',
    uhid: 'UHID-GLH-09876',
    ageGender: '72Y / Male',
    source: 'ICU',
    referringDoctor: 'Dr. Shahed Kamal, MD',
    clinicalIndication: 'Septic shock with acute respiratory distress; monitoring blood gas and procalcitonin',
    testsOrdered: ['Arterial Blood Gas (ABG)', 'Serum Procalcitonin', 'Serum Lactate', 'Blood Culture x2'],
    sampleBarcode: 'GLH-BC-88505',
    sampleStatus: 'Processing',
    priority: 'STAT / Emergency',
  },
  {
    id: 'REQ-04',
    orderNo: 'REQ-2026-7798',
    requestedAt: '2026-11-24 09:50',
    patientName: 'Sayeda Nasreen (44F)',
    uhid: 'UHID-GLH-09850',
    ageGender: '44Y / Female',
    source: 'OPD Chamber',
    referringDoctor: 'Dr. Tariqul Islam, FCPS',
    clinicalIndication: 'Follow-up gestational diabetes and thyroid disorder evaluation',
    testsOrdered: ['HbA1c', 'Fasting Blood Glucose', 'Serum TSH', 'Urine Microalbumin'],
    sampleBarcode: 'GLH-BC-88498',
    sampleStatus: 'Collected',
    priority: 'Routine',
  },
];

export const LAB_SAMPLE_TRACKING_DATA: LabSampleItem[] = [
  {
    id: 'SMP-01',
    barcode: 'GLH-BC-88401',
    patientName: 'Prof. Rafiqul Islam (62M)',
    uhid: 'UHID-GLH-09412',
    testName: 'Complete Blood Count (CBC)',
    sampleType: 'Whole Blood',
    tubeType: 'Lavender (EDTA)',
    collectedAt: '2026-11-24 09:20',
    collectedBy: 'Sumon Mia (Phlebotomist)',
    storageLocation: 'Hematology Sysmex XN-550 Rack A-04',
    condition: 'Optimal',
    status: 'In Analysis',
  },
  {
    id: 'SMP-02',
    barcode: 'GLH-BC-88402',
    patientName: 'Kazi Tanvir Ahmed (42M)',
    uhid: 'UHID-GLH-09744',
    testName: 'Cardiac Troponin-I & CK-MB',
    sampleType: 'Serum',
    tubeType: 'Gold / Red (Serum SST)',
    collectedAt: '2026-11-24 09:35',
    collectedBy: 'Sumon Mia (Phlebotomist)',
    storageLocation: 'Cobas e411 Centrifuge Carousel B',
    condition: 'Optimal',
    status: 'In Analysis',
  },
  {
    id: 'SMP-03',
    barcode: 'GLH-BC-88390',
    patientName: 'Abdul Karim (59M)',
    uhid: 'UHID-GLH-09601',
    testName: 'Serum Potassium & Electrolytes',
    sampleType: 'Serum',
    tubeType: 'Gold / Red (Serum SST)',
    collectedAt: '2026-11-24 08:50',
    collectedBy: 'Night Duty MLT',
    storageLocation: 'Biochemistry Reject Bay',
    condition: 'Hemolyzed (Reject)',
    status: 'Rejected',
  },
  {
    id: 'SMP-04',
    barcode: 'GLH-BC-88395',
    patientName: 'Nazrul Islam (31M)',
    uhid: 'UHID-GLH-09650',
    testName: 'Prothrombin Time (PT / INR)',
    sampleType: 'Citrated Plasma',
    tubeType: 'Light Blue (Citrate)',
    collectedAt: '2026-11-24 09:10',
    collectedBy: 'Sumon Mia (Phlebotomist)',
    storageLocation: 'Hematology Coagulation Station',
    condition: 'Clotted (Reject)',
    status: 'Recollection Requested',
  },
];

export const QUALITY_CONTROL_DATA: QualityControlRecord[] = [
  {
    id: 'QC-01',
    instrumentName: 'Sysmex XN-550 Hematology Analyzer',
    assayParameter: 'Platelet Count (PLT)',
    controlLevel: 'Level 2 (Normal)',
    controlLotNo: 'LOT-SYS-8821',
    targetMean: 215,
    observedValue: 212,
    standardDeviation: 6.2,
    westgardRule: 'In Control (Within ±1SD)',
    runTime: '2026-11-24 07:30',
    technologistName: 'Md. Shahidul Alam, BSc MLT',
    status: 'Accepted',
  },
  {
    id: 'QC-02',
    instrumentName: 'Beckman Coulter AU480 Chemistry',
    assayParameter: 'Serum Potassium (K+)',
    controlLevel: 'Level 2 (Normal)',
    controlLotNo: 'LOT-BC-9041',
    targetMean: 4.25,
    observedValue: 4.28,
    standardDeviation: 0.08,
    westgardRule: 'In Control (Within ±1SD)',
    runTime: '2026-11-24 07:45',
    technologistName: 'Sultana Razia, Senior Biochemist',
    status: 'Accepted',
  },
  {
    id: 'QC-03',
    instrumentName: 'Roche Cobas e411 Immunoanalyzer',
    assayParameter: 'hs-Troponin-I',
    controlLevel: 'Level 1 (Low)',
    controlLotNo: 'LOT-RCH-3301',
    targetMean: 18.5,
    observedValue: 18.2,
    standardDeviation: 0.6,
    westgardRule: 'In Control (Within ±1SD)',
    runTime: '2026-11-24 08:00',
    technologistName: 'Sultana Razia, Senior Biochemist',
    status: 'Accepted',
  },
  {
    id: 'QC-04',
    instrumentName: 'Stago Compact Max Coagulation',
    assayParameter: 'Prothrombin Time (PT Control)',
    controlLevel: 'Level 2 (Normal)',
    controlLotNo: 'LOT-STG-1102',
    targetMean: 12.0,
    observedValue: 12.8,
    standardDeviation: 0.35,
    westgardRule: 'Warning (±2SD)',
    runTime: '2026-11-24 08:15',
    technologistName: 'Md. Shahidul Alam, BSc MLT',
    status: 'Calibration Required',
  },
];

export const TURNAROUND_TIME_STATS: TurnaroundTimeStat[] = [
  {
    category: 'Hematology',
    testsProcessedToday: 142,
    targetMinutes: 60,
    averageMinutes: 44,
    complianceRate: 97.2,
    delayedCount: 4,
  },
  {
    category: 'Biochemistry',
    testsProcessedToday: 285,
    targetMinutes: 90,
    averageMinutes: 68,
    complianceRate: 95.8,
    delayedCount: 12,
  },
  {
    category: 'Immunology & Serology',
    testsProcessedToday: 68,
    targetMinutes: 120,
    averageMinutes: 92,
    complianceRate: 98.5,
    delayedCount: 1,
  },
  {
    category: 'Microbiology',
    testsProcessedToday: 24,
    targetMinutes: 2880, // 48 hours for culture
    averageMinutes: 2450,
    complianceRate: 92.0,
    delayedCount: 2,
  },
];

// =============================================================================
// NAVIGATION & ROUTE DEFINITIONS
// =============================================================================

export interface PathologistNavItem {
  id: string;
  title: string;
  path: string;
  badge?: number | string;
  subItems?: { id: string; title: string; path: string; badge?: number | string }[];
}

export interface PathologistNavSection {
  title: string;
  items: PathologistNavItem[];
}

export const PATHOLOGIST_ROUTE_TO_MODULE_MAP: Record<string, string> = {
  // Direct root & short slugs
  '': 'dashboard',
  'dashboard': 'dashboard',
  'verification': 'verification-pending',
  'verification-pending': 'verification-pending',
  'critical': 'critical-results',
  'critical-results': 'critical-results',
  'reports': 'reports-signed',
  'reports-signed': 'reports-signed',
  'requests': 'worklist-requests',
  'worklist-requests': 'worklist-requests',
  'worklist': 'worklist-requests',
  'samples': 'worklist-samples',
  'worklist-samples': 'worklist-samples',
  'processing': 'worklist-processing',
  'worklist-processing': 'worklist-processing',
  'qc': 'masters-qc',
  'masters-qc': 'masters-qc',
  'catalog': 'masters-tests',
  'masters': 'masters-tests',
  'masters-tests': 'masters-tests',
  'analytics': 'masters-analytics',
  'masters-analytics': 'masters-analytics',
  'profile': 'profile-settings',
  'profile-settings': 'profile-settings',

  // Full paths
  '/dashboard/pathologist': 'dashboard',
  '/dashboard/pathologist/': 'dashboard',
  '/dashboard/pathologist/dashboard': 'dashboard',
  '/dashboard/pathologist/verification': 'verification-pending',
  '/dashboard/pathologist/critical': 'critical-results',
  '/dashboard/pathologist/reports': 'reports-signed',
  '/dashboard/pathologist/requests': 'worklist-requests',
  '/dashboard/pathologist/processing': 'worklist-processing',
  '/dashboard/pathologist/samples': 'worklist-samples',
  '/dashboard/pathologist/catalog': 'masters-tests',
  '/dashboard/pathologist/qc': 'masters-qc',
  '/dashboard/pathologist/analytics': 'masters-analytics',
  '/dashboard/pathologist/profile': 'profile-settings',
};

export const PATHOLOGIST_MODULE_ROUTE_MAP: Record<string, string> = {
  'dashboard': '/dashboard/pathologist',
  'verification-pending': '/dashboard/pathologist/verification',
  'critical-results': '/dashboard/pathologist/critical',
  'reports-signed': '/dashboard/pathologist/reports',
  'worklist-requests': '/dashboard/pathologist/requests',
  'worklist-processing': '/dashboard/pathologist/processing',
  'worklist-samples': '/dashboard/pathologist/samples',
  'masters-tests': '/dashboard/pathologist/catalog',
  'masters-qc': '/dashboard/pathologist/qc',
  'masters-analytics': '/dashboard/pathologist/analytics',
  'profile-settings': '/dashboard/pathologist/profile',
};

export const PATHOLOGIST_NAV_SECTIONS: PathologistNavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', title: 'Dashboard', path: '/dashboard/pathologist' },
    ],
  },
  {
    title: 'Clinical Verification',
    items: [
      {
        id: 'verification-pending',
        title: 'Result Verification',
        path: '/dashboard/pathologist/verification',
        badge: 6,
      },
      {
        id: 'critical-results',
        title: 'Critical Results',
        path: '/dashboard/pathologist/critical',
        badge: 4,
      },
      {
        id: 'reports-signed',
        title: 'Laboratory Reports',
        path: '/dashboard/pathologist/reports',
        badge: 4,
      },
    ],
  },
  {
    title: 'Testing & Worklist',
    items: [
      {
        id: 'worklist-requests',
        title: 'Patient Requests',
        path: '/dashboard/pathologist/requests',
        badge: 4,
      },
      {
        id: 'worklist-processing',
        title: 'Test Processing',
        path: '/dashboard/pathologist/processing',
      },
      {
        id: 'worklist-samples',
        title: 'Sample Tracking',
        path: '/dashboard/pathologist/samples',
      },
    ],
  },
  {
    title: 'Lab Master & QC',
    items: [
      {
        id: 'masters-tests',
        title: 'Laboratory Master',
        path: '/dashboard/pathologist/catalog',
      },
      {
        id: 'masters-qc',
        title: 'Quality Control',
        path: '/dashboard/pathologist/qc',
      },
      {
        id: 'masters-analytics',
        title: 'Reports & Analytics',
        path: '/dashboard/pathologist/analytics',
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'profile-settings',
        title: 'Profile & Settings',
        path: '/dashboard/pathologist/profile',
      },
    ],
  },
];
