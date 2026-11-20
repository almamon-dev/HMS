export type PathologyCategory =
  | 'Hematology'
  | 'Biochemistry'
  | 'Microbiology'
  | 'Immunology'
  | 'Histopathology'
  | 'Serology';

export interface PathologyParameter {
  id: string;
  name: string;
  category: PathologyCategory;
  referenceRange: string;
  unit: string;
  description: string;
}

export interface PathologyTestCatalog {
  id: string;
  testCode: string;
  testName: string;
  shortName: string;
  category: PathologyCategory;
  subCategory: string;
  sampleType: string;
  turnaroundTime: string;
  method: string;
  standardCharge: number;
  parameterCount: number;
}

export interface TestResultItem {
  parameterName: string;
  observedValue: string;
  referenceRange: string;
  unit: string;
  flag?: 'Normal' | 'High' | 'Low';
}

export interface PathologyBillRecord {
  id: string;
  billNo: string;
  caseId: string;
  date: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  pathologistName: string;
  testName: string;
  testCode: string;
  category: PathologyCategory;
  sampleType: string;
  sampleStatus: 'Collected' | 'In Lab' | 'Processing' | 'Pending';
  reportStatus: 'Completed & Signed' | 'In Process' | 'Pending Review';
  amount: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  taxPercent: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  results?: TestResultItem[];
  technicianNotes?: string;
}

export const PATHOLOGY_PARAMETERS: PathologyParameter[] = [
  {
    id: 'param-01',
    name: 'Hemoglobin (Hb)',
    category: 'Hematology',
    referenceRange: '13.0 - 17.0 (Male), 12.0 - 15.0 (Female)',
    unit: 'g/dL',
    description: 'Oxygen carrying protein in red blood cells',
  },
  {
    id: 'param-02',
    name: 'Total Leukocyte Count (WBC)',
    category: 'Hematology',
    referenceRange: '4,000 - 11,000',
    unit: 'cells/mcL',
    description: 'Immune defense white blood cell count',
  },
  {
    id: 'param-03',
    name: 'Platelet Count',
    category: 'Hematology',
    referenceRange: '150,000 - 450,000',
    unit: 'cells/mcL',
    description: 'Blood clotting thrombocytes',
  },
  {
    id: 'param-04',
    name: 'Fasting Plasma Glucose',
    category: 'Biochemistry',
    referenceRange: '70 - 99',
    unit: 'mg/dL',
    description: 'Fasting serum sugar baseline',
  },
  {
    id: 'param-05',
    name: 'Glycated Hemoglobin (HbA1c)',
    category: 'Biochemistry',
    referenceRange: '< 5.7 (Normal), 5.7 - 6.4 (Prediabetes)',
    unit: '%',
    description: '3-month average blood glucose control',
  },
  {
    id: 'param-06',
    name: 'Serum Creatinine',
    category: 'Biochemistry',
    referenceRange: '0.7 - 1.3 (Male), 0.5 - 1.1 (Female)',
    unit: 'mg/dL',
    description: 'Renal function and kidney clearance filtration metric',
  },
  {
    id: 'param-07',
    name: 'Serum Bilirubin (Total)',
    category: 'Biochemistry',
    referenceRange: '0.2 - 1.2',
    unit: 'mg/dL',
    description: 'Hepatic and biliary breakdown biomarker',
  },
  {
    id: 'param-08',
    name: 'SGPT / ALT (Alanine Aminotransferase)',
    category: 'Biochemistry',
    referenceRange: '7 - 56',
    unit: 'U/L',
    description: 'Hepatocyte specific liver integrity enzyme',
  },
  {
    id: 'param-09',
    name: 'Thyroid Stimulating Hormone (TSH)',
    category: 'Immunology',
    referenceRange: '0.4 - 4.0',
    unit: 'mIU/L',
    description: 'Pituitary gland regulator of thyroid function',
  },
  {
    id: 'param-10',
    name: 'C-Reactive Protein (High Sensitivity)',
    category: 'Immunology',
    referenceRange: '< 3.0',
    unit: 'mg/L',
    description: 'Systemic inflammation and cardiovascular risk indicator',
  },
];

export const PATHOLOGY_TEST_CATALOG: PathologyTestCatalog[] = [
  {
    id: 'path-cat-01',
    testCode: 'CBC-01',
    testName: 'Complete Blood Count (CBC) with ESR',
    shortName: 'CBC + ESR',
    category: 'Hematology',
    subCategory: 'Automated Cell Profiling',
    sampleType: 'Whole Blood (EDTA Purple Top)',
    turnaroundTime: '2 Hours',
    method: 'Automated 5-Part Cell Counter & Westergren',
    standardCharge: 28.0,
    parameterCount: 16,
  },
  {
    id: 'path-cat-02',
    testCode: 'LIPID-02',
    testName: 'Lipid Profile Comprehensive (Cholesterol, HDL, LDL, TG)',
    shortName: 'Lipid Profile',
    category: 'Biochemistry',
    subCategory: 'Cardiovascular Risk Panel',
    sampleType: 'Serum (Yellow Top Gel Separator)',
    turnaroundTime: '4 Hours',
    method: 'Enzymatic Colorimetric Spectrophotometry',
    standardCharge: 42.0,
    parameterCount: 6,
  },
  {
    id: 'path-cat-03',
    testCode: 'LFT-03',
    testName: 'Liver Function Test (LFT Profile)',
    shortName: 'LFT Comprehensive',
    category: 'Biochemistry',
    subCategory: 'Hepatic Diagnostics',
    sampleType: 'Serum (Plain/SST)',
    turnaroundTime: '3 Hours',
    method: 'Dry Chemistry Analyzer (Roche Cobas)',
    standardCharge: 38.0,
    parameterCount: 8,
  },
  {
    id: 'path-cat-04',
    testCode: 'RFT-04',
    testName: 'Renal Function Test (Urea, Creatinine, Electrolytes, Uric Acid)',
    shortName: 'RFT / KFT Panel',
    category: 'Biochemistry',
    subCategory: 'Nephrology Diagnostics',
    sampleType: 'Serum (Plain/SST)',
    turnaroundTime: '3 Hours',
    method: 'Kinetic Jaffe & Ion-Selective Electrode',
    standardCharge: 35.0,
    parameterCount: 6,
  },
  {
    id: 'path-cat-05',
    testCode: 'HBA1C-05',
    testName: 'Glycated Hemoglobin (HbA1c Blood Test)',
    shortName: 'HbA1c',
    category: 'Biochemistry',
    subCategory: 'Endocrine Diagnostics',
    sampleType: 'Whole Blood (EDTA)',
    turnaroundTime: '2 Hours',
    method: 'High-Performance Liquid Chromatography (HPLC)',
    standardCharge: 25.0,
    parameterCount: 2,
  },
  {
    id: 'path-cat-06',
    testCode: 'THY-06',
    testName: 'Thyroid Profile Comprehensive (FT3, FT4, TSH)',
    shortName: 'Thyroid Panel',
    category: 'Immunology',
    subCategory: 'Endocrine Immunoassay',
    sampleType: 'Serum (SST)',
    turnaroundTime: '4 Hours',
    method: 'Electrochemiluminescence Immunoassay (ECLIA)',
    standardCharge: 48.0,
    parameterCount: 3,
  },
  {
    id: 'path-cat-07',
    testCode: 'URI-07',
    testName: 'Urine Routine & Microscopic Examination (R/E)',
    shortName: 'Urine R/M/E',
    category: 'Microbiology',
    subCategory: 'Clinical Microscopy',
    sampleType: 'Midstream Urine (Sterile Container)',
    turnaroundTime: '1.5 Hours',
    method: 'Automated Urine Chemistry & Brightfield Microscopy',
    standardCharge: 15.0,
    parameterCount: 12,
  },
  {
    id: 'path-cat-08',
    testCode: 'DENG-08',
    testName: 'Dengue NS1 Antigen & IgM/IgG Rapid Antibody Panel',
    shortName: 'Dengue Combo',
    category: 'Serology',
    subCategory: 'Infectious Disease Serology',
    sampleType: 'Serum / Whole Blood',
    turnaroundTime: '1 Hour',
    method: 'Immunochromatographic Assay',
    standardCharge: 22.0,
    parameterCount: 3,
  },
  {
    id: 'path-cat-09',
    testCode: 'CRP-09',
    testName: 'High Sensitivity C-Reactive Protein (hs-CRP)',
    shortName: 'hs-CRP',
    category: 'Immunology',
    subCategory: 'Inflammatory Biomarkers',
    sampleType: 'Serum',
    turnaroundTime: '2 Hours',
    method: 'Immunoturbidimetry',
    standardCharge: 20.0,
    parameterCount: 1,
  },
  {
    id: 'path-cat-10',
    testCode: 'BCULT-10',
    testName: 'Blood Culture & Antimicrobial Sensitivity Test (Bactec)',
    shortName: 'Blood Culture & AST',
    category: 'Microbiology',
    subCategory: 'Bacterial Pathology',
    sampleType: 'Venous Blood (Bactec Aerobic & Anaerobic Vials)',
    turnaroundTime: '48 Hours',
    method: 'Continuous Automated Fluorescence Monitoring (BD BACTEC)',
    standardCharge: 55.0,
    parameterCount: 4,
  },
];

export const SMART_PATHOLOGY_BILLS: PathologyBillRecord[] = [
  {
    id: 'path-bill-01',
    billNo: 'PATHOB640',
    caseId: '7492',
    date: '12/11/2026 09:30 AM',
    patientName: 'Rachel Priest',
    patientId: '1162',
    doctorName: 'Dr. Reyan Jain (9011)',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    testName: 'Complete Blood Count (CBC) with ESR',
    testCode: 'CBC-01',
    category: 'Hematology',
    sampleType: 'Whole Blood (EDTA)',
    sampleStatus: 'Collected',
    reportStatus: 'Completed & Signed',
    amount: 28.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 1.4,
    taxPercent: 5.0,
    netAmount: 29.4,
    paidAmount: 29.4,
    balanceAmount: 0.0,
    technicianNotes: 'No hemolysis observed. Specimen checked and verified.',
    results: [
      {
        parameterName: 'Hemoglobin (Hb)',
        observedValue: '13.8',
        referenceRange: '12.0 - 15.0',
        unit: 'g/dL',
        flag: 'Normal',
      },
      {
        parameterName: 'Total Leukocyte Count (WBC)',
        observedValue: '7,400',
        referenceRange: '4,000 - 11,000',
        unit: 'cells/mcL',
        flag: 'Normal',
      },
      {
        parameterName: 'Platelet Count',
        observedValue: '240,000',
        referenceRange: '150,000 - 450,000',
        unit: 'cells/mcL',
        flag: 'Normal',
      },
      {
        parameterName: 'Erythrocyte Sedimentation Rate (ESR)',
        observedValue: '14',
        referenceRange: '0 - 20',
        unit: 'mm/1st hr',
        flag: 'Normal',
      },
    ],
  },
  {
    id: 'path-bill-02',
    billNo: 'PATHOB639',
    caseId: '7493',
    date: '12/11/2026 10:15 AM',
    patientName: 'Gemma Boniwell',
    patientId: '1127',
    doctorName: 'Dr. Amit Singh (9009)',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    testName: 'Lipid Profile Comprehensive (Cholesterol, HDL, LDL, TG)',
    testCode: 'LIPID-02',
    category: 'Biochemistry',
    sampleType: 'Serum (Yellow Top Gel)',
    sampleStatus: 'In Lab',
    reportStatus: 'In Process',
    amount: 42.0,
    discountAmount: 2.1,
    discountPercent: 5.0,
    taxAmount: 2.0,
    taxPercent: 5.0,
    netAmount: 41.9,
    paidAmount: 41.9,
    balanceAmount: 0.0,
    technicianNotes: 'Serum separated cleanly; optical density calibration passed.',
    results: [
      {
        parameterName: 'Total Cholesterol',
        observedValue: '215',
        referenceRange: '< 200 Desirable',
        unit: 'mg/dL',
        flag: 'High',
      },
      {
        parameterName: 'Triglycerides',
        observedValue: '165',
        referenceRange: '< 150 Normal',
        unit: 'mg/dL',
        flag: 'High',
      },
      {
        parameterName: 'HDL Cholesterol (Good)',
        observedValue: '48',
        referenceRange: '> 40 Protective',
        unit: 'mg/dL',
        flag: 'Normal',
      },
      {
        parameterName: 'LDL Cholesterol (Calculated)',
        observedValue: '134',
        referenceRange: '< 100 Optimal',
        unit: 'mg/dL',
        flag: 'High',
      },
    ],
  },
  {
    id: 'path-bill-03',
    billNo: 'PATHOB638',
    caseId: '7485',
    date: '11/11/2026 02:45 PM',
    patientName: 'Sultana Razia',
    patientId: '1026',
    doctorName: 'Dr. Farhana Yasmin (9013)',
    pathologistName: 'Dr. Tariqul Anwar (Senior Biochemist)',
    testName: 'Liver Function Test (LFT Profile)',
    testCode: 'LFT-03',
    category: 'Biochemistry',
    sampleType: 'Serum',
    sampleStatus: 'Collected',
    reportStatus: 'Completed & Signed',
    amount: 38.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 1.9,
    taxPercent: 5.0,
    netAmount: 39.9,
    paidAmount: 39.9,
    balanceAmount: 0.0,
    technicianNotes: 'Specimen verified by Dr. Tariqul Anwar.',
    results: [
      {
        parameterName: 'Total Bilirubin',
        observedValue: '0.85',
        referenceRange: '0.2 - 1.2',
        unit: 'mg/dL',
        flag: 'Normal',
      },
      {
        parameterName: 'SGPT / ALT',
        observedValue: '34',
        referenceRange: '7 - 56',
        unit: 'U/L',
        flag: 'Normal',
      },
      {
        parameterName: 'SGOT / AST',
        observedValue: '29',
        referenceRange: '10 - 40',
        unit: 'U/L',
        flag: 'Normal',
      },
      {
        parameterName: 'Alkaline Phosphatase (ALP)',
        observedValue: '88',
        referenceRange: '44 - 147',
        unit: 'U/L',
        flag: 'Normal',
      },
      {
        parameterName: 'Total Protein',
        observedValue: '7.2',
        referenceRange: '6.4 - 8.3',
        unit: 'g/dL',
        flag: 'Normal',
      },
    ],
  },
  {
    id: 'path-bill-04',
    billNo: 'PATHOB637',
    caseId: '7479',
    date: '11/11/2026 11:20 AM',
    patientName: 'Aadish Mody',
    patientId: '1072',
    doctorName: 'Dr. Reyan Jain (9011)',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    testName: 'Glycated Hemoglobin (HbA1c Blood Test)',
    testCode: 'HBA1C-05',
    category: 'Biochemistry',
    sampleType: 'Whole Blood (EDTA)',
    sampleStatus: 'Collected',
    reportStatus: 'Completed & Signed',
    amount: 25.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 1.25,
    taxPercent: 5.0,
    netAmount: 26.25,
    paidAmount: 26.25,
    balanceAmount: 0.0,
    results: [
      {
        parameterName: 'HbA1c Glycated Fraction',
        observedValue: '6.8',
        referenceRange: '< 5.7 (Normal), 5.7-6.4 (Prediabetes)',
        unit: '%',
        flag: 'High',
      },
      {
        parameterName: 'Estimated Average Glucose (eAG)',
        observedValue: '148',
        referenceRange: '< 117 Normal',
        unit: 'mg/dL',
        flag: 'High',
      },
    ],
  },
  {
    id: 'path-bill-05',
    billNo: 'PATHOB636',
    caseId: '7481',
    date: '10/11/2026 08:50 AM',
    patientName: 'Mushfiqur Rahman',
    patientId: '1005',
    doctorName: 'Dr. Mahmudul Hasan (9008)',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    testName: 'Renal Function Test (Urea, Creatinine, Electrolytes, Uric Acid)',
    testCode: 'RFT-04',
    category: 'Biochemistry',
    sampleType: 'Serum (SST)',
    sampleStatus: 'Processing',
    reportStatus: 'In Process',
    amount: 35.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 1.75,
    taxPercent: 5.0,
    netAmount: 36.75,
    paidAmount: 30.0,
    balanceAmount: 6.75,
    results: [
      {
        parameterName: 'Blood Urea Nitrogen',
        observedValue: '18',
        referenceRange: '7 - 20',
        unit: 'mg/dL',
        flag: 'Normal',
      },
      {
        parameterName: 'Serum Creatinine',
        observedValue: '1.05',
        referenceRange: '0.7 - 1.3',
        unit: 'mg/dL',
        flag: 'Normal',
      },
      {
        parameterName: 'Serum Sodium (Na+)',
        observedValue: '141',
        referenceRange: '135 - 145',
        unit: 'mEq/L',
        flag: 'Normal',
      },
      {
        parameterName: 'Serum Potassium (K+)',
        observedValue: '4.2',
        referenceRange: '3.5 - 5.0',
        unit: 'mEq/L',
        flag: 'Normal',
      },
    ],
  },
  {
    id: 'path-bill-06',
    billNo: 'PATHOB635',
    caseId: '7468',
    date: '10/11/2026 04:10 PM',
    patientName: 'Farzana Akter',
    patientId: '1008',
    doctorName: 'Dr. Sabrina Karim (9015)',
    pathologistName: 'Dr. Tariqul Anwar (Senior Biochemist)',
    testName: 'Thyroid Profile Comprehensive (FT3, FT4, TSH)',
    testCode: 'THY-06',
    category: 'Immunology',
    sampleType: 'Serum',
    sampleStatus: 'Collected',
    reportStatus: 'Completed & Signed',
    amount: 48.0,
    discountAmount: 4.8,
    discountPercent: 10.0,
    taxAmount: 2.16,
    taxPercent: 5.0,
    netAmount: 45.36,
    paidAmount: 45.36,
    balanceAmount: 0.0,
    results: [
      {
        parameterName: 'Free Triiodothyronine (FT3)',
        observedValue: '3.1',
        referenceRange: '2.3 - 4.2',
        unit: 'pg/mL',
        flag: 'Normal',
      },
      {
        parameterName: 'Free Thyroxine (FT4)',
        observedValue: '1.24',
        referenceRange: '0.89 - 1.76',
        unit: 'ng/dL',
        flag: 'Normal',
      },
      {
        parameterName: 'Thyroid Stimulating Hormone (TSH)',
        observedValue: '2.45',
        referenceRange: '0.4 - 4.0',
        unit: 'mIU/L',
        flag: 'Normal',
      },
    ],
  },
  {
    id: 'path-bill-07',
    billNo: 'PATHOB634',
    caseId: '7461',
    date: '09/11/2026 10:00 AM',
    patientName: 'Mehedi Hasan',
    patientId: '1009',
    doctorName: 'Dr. Sajjad Hossain (9017)',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    testName: 'Dengue NS1 Antigen & IgM/IgG Rapid Antibody Panel',
    testCode: 'DENG-08',
    category: 'Serology',
    sampleType: 'Whole Blood',
    sampleStatus: 'Collected',
    reportStatus: 'Completed & Signed',
    amount: 22.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 1.1,
    taxPercent: 5.0,
    netAmount: 23.1,
    paidAmount: 23.1,
    balanceAmount: 0.0,
    results: [
      {
        parameterName: 'Dengue NS1 Antigen',
        observedValue: 'Negative',
        referenceRange: 'Negative',
        unit: 'Qualitative',
        flag: 'Normal',
      },
      {
        parameterName: 'Dengue IgM Antibody',
        observedValue: 'Negative',
        referenceRange: 'Negative',
        unit: 'Qualitative',
        flag: 'Normal',
      },
      {
        parameterName: 'Dengue IgG Antibody',
        observedValue: 'Negative',
        referenceRange: 'Negative',
        unit: 'Qualitative',
        flag: 'Normal',
      },
    ],
  },
  {
    id: 'path-bill-08',
    billNo: 'PATHOB633',
    caseId: '7455',
    date: '09/11/2026 01:15 PM',
    patientName: 'Sharmeen Sultana',
    patientId: '1010',
    doctorName: 'Dr. Reyan Jain (9011)',
    pathologistName: 'Dr. Nusrat Jahan (Pathologist)',
    testName: 'Urine Routine & Microscopic Examination (R/E)',
    testCode: 'URI-07',
    category: 'Microbiology',
    sampleType: 'Midstream Urine',
    sampleStatus: 'In Lab',
    reportStatus: 'Pending Review',
    amount: 15.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 0.75,
    taxPercent: 5.0,
    netAmount: 15.75,
    paidAmount: 15.75,
    balanceAmount: 0.0,
  },
];

