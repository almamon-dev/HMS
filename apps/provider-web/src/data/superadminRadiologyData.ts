export type RadiologyModality =
  | 'X-Ray'
  | 'CT Scan'
  | 'MRI'
  | 'Ultrasound'
  | 'Echocardiography'
  | 'Mammography';

export interface RadiologyTestCatalog {
  id: string;
  testCode: string;
  testName: string;
  modality: RadiologyModality;
  subCategory: string;
  turnaroundTime: string;
  roomOrMachine: string;
  standardCharge: number;
}

export interface RadiologyBillRecord {
  id: string;
  billNo: string;
  caseId: string;
  date: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  radiologistName: string;
  testName: string;
  testCode: string;
  modality: RadiologyModality;
  amount: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  taxPercent: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  reportStatus: 'Completed & Signed' | 'In Process' | 'Pending Review';
  filmUploaded: boolean;
}

export const RADIOLOGY_TEST_CATALOG: RadiologyTestCatalog[] = [
  {
    id: 'rad-cat-01',
    testCode: 'CXR-PA',
    testName: 'Chest X-Ray PA View (Digital)',
    modality: 'X-Ray',
    subCategory: 'Thoracic Imaging',
    turnaroundTime: '1 Hour',
    roomOrMachine: 'Digital X-Ray Suite 101 (Shimadzu)',
    standardCharge: 45.0,
  },
  {
    id: 'rad-cat-02',
    testCode: 'MRI-BRN',
    testName: 'MRI Brain with Contrast (3.0 Tesla)',
    modality: 'MRI',
    subCategory: 'Neuro Imaging',
    turnaroundTime: '4 Hours',
    roomOrMachine: 'MRI 3T Suite 201 (Siemens Magnetom)',
    standardCharge: 320.0,
  },
  {
    id: 'rad-cat-03',
    testCode: 'CT-ABD',
    testName: 'CT Scan Whole Abdomen with IV Contrast',
    modality: 'CT Scan',
    subCategory: 'Abdominal Imaging',
    turnaroundTime: '3 Hours',
    roomOrMachine: '128-Slice CT Scanner (GE Healthcare)',
    standardCharge: 240.0,
  },
  {
    id: 'rad-cat-04',
    testCode: 'USG-WA',
    testName: 'Ultrasound Whole Abdomen & Pelvis',
    modality: 'Ultrasound',
    subCategory: 'Sonography',
    turnaroundTime: 'Same Day',
    roomOrMachine: 'Sonography Chamber 104 (Philips Epiq)',
    standardCharge: 60.0,
  },
  {
    id: 'rad-cat-05',
    testCode: 'ECHO-2D',
    testName: '2D Echocardiogram with Color Doppler',
    modality: 'Echocardiography',
    subCategory: 'Cardiac Imaging',
    turnaroundTime: '2 Hours',
    roomOrMachine: 'Echo Lab Suite 103 (GE Vivid E95)',
    standardCharge: 110.0,
  },
  {
    id: 'rad-cat-06',
    testCode: 'MAMMO-BI',
    testName: 'Digital Bilateral Mammography',
    modality: 'Mammography',
    subCategory: 'Breast Imaging',
    turnaroundTime: 'Same Day',
    roomOrMachine: 'Mammography Suite 105 (Hologic)',
    standardCharge: 85.0,
  },
  {
    id: 'rad-cat-07',
    testCode: 'MRI-LUMB',
    testName: 'MRI Lumbosacral Spine',
    modality: 'MRI',
    subCategory: 'Musculoskeletal',
    turnaroundTime: '4 Hours',
    roomOrMachine: 'MRI 3T Suite 201 (Siemens Magnetom)',
    standardCharge: 290.0,
  },
  {
    id: 'rad-cat-08',
    testCode: 'CT-CHEST-HR',
    testName: 'HRCT Chest (High Resolution CT)',
    modality: 'CT Scan',
    subCategory: 'Pulmonary Imaging',
    turnaroundTime: '3 Hours',
    roomOrMachine: '128-Slice CT Scanner (GE Healthcare)',
    standardCharge: 210.0,
  },
];

export const SMART_RADIOLOGY_BILLS: RadiologyBillRecord[] = [
  {
    id: 'rad-bill-1',
    billNo: 'RADIOB 842',
    caseId: '7490',
    date: '20/11/2026 10:30 AM',
    patientName: 'Rachel Priest (1162)',
    patientId: '1162',
    doctorName: 'Dr. Reyan Jain (9011)',
    radiologistName: 'Dr. Sabrina Karim (Radiologist)',
    testName: 'CT Scan Whole Abdomen with IV Contrast',
    testCode: 'CT-ABD',
    modality: 'CT Scan',
    amount: 240.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 12.0,
    taxPercent: 5,
    netAmount: 252.0,
    paidAmount: 252.0,
    balanceAmount: 0.0,
    reportStatus: 'Completed & Signed',
    filmUploaded: true,
  },
  {
    id: 'rad-bill-2',
    billNo: 'RADIOB 841',
    caseId: '7488',
    date: '20/11/2026 09:45 AM',
    patientName: 'Jonathan Hibbins (1021)',
    patientId: '1021',
    doctorName: 'Dr. Kamrul Islam (9014)',
    radiologistName: 'Dr. Sabrina Karim (Radiologist)',
    testName: 'Chest X-Ray PA View (Digital)',
    testCode: 'CXR-PA',
    modality: 'X-Ray',
    amount: 45.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 2.25,
    taxPercent: 5,
    netAmount: 47.25,
    paidAmount: 47.25,
    balanceAmount: 0.0,
    reportStatus: 'Completed & Signed',
    filmUploaded: true,
  },
  {
    id: 'rad-bill-3',
    billNo: 'RADIOB 840',
    caseId: '7482',
    date: '20/11/2026 09:10 AM',
    patientName: 'Sultana Razia (1026)',
    patientId: '1026',
    doctorName: 'Dr. Farhana Yasmin (9013)',
    radiologistName: 'Dr. Mahmudul Hasan (Consultant)',
    testName: 'Ultrasound Whole Abdomen & Pelvis',
    testCode: 'USG-WA',
    modality: 'Ultrasound',
    amount: 60.0,
    discountAmount: 5.0,
    discountPercent: 8.33,
    taxAmount: 2.75,
    taxPercent: 5,
    netAmount: 57.75,
    paidAmount: 57.75,
    balanceAmount: 0.0,
    reportStatus: 'In Process',
    filmUploaded: false,
  },
  {
    id: 'rad-bill-4',
    billNo: 'RADIOB 839',
    caseId: '7476',
    date: '19/11/2026 04:20 PM',
    patientName: 'Tanveer Chowdhury (1027)',
    patientId: '1027',
    doctorName: 'Dr. Tariqul Anwar (9015)',
    radiologistName: 'Dr. Sabrina Karim (Radiologist)',
    testName: 'MRI Brain with Contrast (3.0 Tesla)',
    testCode: 'MRI-BRN',
    modality: 'MRI',
    amount: 320.0,
    discountAmount: 20.0,
    discountPercent: 6.25,
    taxAmount: 15.0,
    taxPercent: 5,
    netAmount: 315.0,
    paidAmount: 250.0,
    balanceAmount: 65.0,
    reportStatus: 'Completed & Signed',
    filmUploaded: true,
  },
  {
    id: 'rad-bill-5',
    billNo: 'RADIOB 838',
    caseId: '7465',
    date: '19/11/2026 02:50 PM',
    patientName: 'Jannatul Ferdous (1028)',
    patientId: '1028',
    doctorName: 'Dr. Nafisa Chowdhury (9016)',
    radiologistName: 'Dr. Sabrina Karim (Radiologist)',
    testName: '2D Echocardiogram with Color Doppler',
    testCode: 'ECHO-2D',
    modality: 'Echocardiography',
    amount: 110.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 5.5,
    taxPercent: 5,
    netAmount: 115.5,
    paidAmount: 115.5,
    balanceAmount: 0.0,
    reportStatus: 'Pending Review',
    filmUploaded: false,
  },
  {
    id: 'rad-bill-6',
    billNo: 'RADIOB 837',
    caseId: '7453',
    date: '19/11/2026 11:15 AM',
    patientName: 'Monirul Haque (1029)',
    patientId: '1029',
    doctorName: 'Prof. Dr. Tanvir Ahmed (9010)',
    radiologistName: 'Dr. Mahmudul Hasan (Consultant)',
    testName: 'HRCT Chest (High Resolution CT)',
    testCode: 'CT-CHEST-HR',
    modality: 'CT Scan',
    amount: 210.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 10.5,
    taxPercent: 5,
    netAmount: 220.5,
    paidAmount: 220.5,
    balanceAmount: 0.0,
    reportStatus: 'Completed & Signed',
    filmUploaded: true,
  },
  {
    id: 'rad-bill-7',
    billNo: 'RADIOB 836',
    caseId: '7441',
    date: '18/11/2026 03:40 PM',
    patientName: 'Kamal Hossain (1030)',
    patientId: '1030',
    doctorName: 'Dr. Kamrul Islam (9014)',
    radiologistName: 'Dr. Sabrina Karim (Radiologist)',
    testName: 'MRI Lumbosacral Spine',
    testCode: 'MRI-LUMB',
    modality: 'MRI',
    amount: 290.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 14.5,
    taxPercent: 5,
    netAmount: 304.5,
    paidAmount: 304.5,
    balanceAmount: 0.0,
    reportStatus: 'Completed & Signed',
    filmUploaded: true,
  },
  {
    id: 'rad-bill-8',
    billNo: 'RADIOB 835',
    caseId: '7430',
    date: '18/11/2026 01:25 PM',
    patientName: 'Sharmin Jahan (1031)',
    patientId: '1031',
    doctorName: 'Dr. Farhana Yasmin (9013)',
    radiologistName: 'Dr. Sabrina Karim (Radiologist)',
    testName: 'Digital Bilateral Mammography',
    testCode: 'MAMMO-BI',
    modality: 'Mammography',
    amount: 85.0,
    discountAmount: 0.0,
    discountPercent: 0,
    taxAmount: 4.25,
    taxPercent: 5,
    netAmount: 89.25,
    paidAmount: 89.25,
    balanceAmount: 0.0,
    reportStatus: 'Completed & Signed',
    filmUploaded: true,
  },
];
