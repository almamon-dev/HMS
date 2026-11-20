export type VisitType = 'opd' | 'tele' | 'diagnostic';

export interface AppointmentBookingContext {
  visitType?: VisitType;
  branch?: string;
  department?: string;
  doctorName?: string;
  packageName?: string;
  testName?: string;
  date?: string;
}

export type DoctorDesignation =
  | 'Professor'
  | 'Associate Professor'
  | 'Assistant Professor'
  | 'Doctor';

export const HOSPITAL_BRANCHES = ['Dhanmondi', 'Uttara', 'Mirpur'] as const;

export const CONSULTATION_DAYS = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
] as const;

export interface DoctorScheduleSlot {
  type: 'General OPD' | 'OPD & Video';
  day: string;
  time: string;
}

export interface DoctorOption {
  name: string;
  title: string;
  designation: DoctorDesignation;
  fee: string;
  videoFee?: string;
  experience?: string;
  chamberTime?: string;
  room: string;
  branches: string[];
  days: string[];
}

export interface DiagnosticPackageOption {
  name: string;
  price: string;
  meta: string;
}

export interface LabTestOption {
  name: string;
  price: string;
  category: string;
  branches: string[];
  reportTime: string;
}

export const DEPARTMENT_DOCTORS: Record<string, DoctorOption[]> = {
  Cardiology: [
    {
      name: 'Prof. Dr. Tanvir Ahmed, FCPS',
      title: 'Senior Interventional Cardiologist',
      designation: 'Professor',
      fee: '৳ 1,200',
      room: 'Room 302, Level 3',
      branches: ['Dhanmondi', 'Uttara'],
      days: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
    },
    {
      name: 'Dr. Farhana Rahman, MS',
      title: 'Associate Professor, Cardiac Surgery',
      designation: 'Associate Professor',
      fee: '৳ 1,000',
      room: 'Room 305, Level 3',
      branches: ['Dhanmondi', 'Mirpur'],
      days: ['Sunday', 'Monday', 'Wednesday', 'Friday'],
    },
    {
      name: 'Dr. Mahmudul Hasan, MD',
      title: 'Assistant Professor, Clinical Cardiology',
      designation: 'Assistant Professor',
      fee: '৳ 900',
      room: 'Room 308, Level 3',
      branches: ['Uttara', 'Mirpur'],
      days: ['Saturday', 'Monday', 'Tuesday', 'Thursday'],
    },
  ],
  'Chest Medicine': [
    {
      name: 'Prof. Dr. M. Delwar Hossain, FCPS',
      title: 'Professor & Head of Respiratory Medicine',
      designation: 'Professor',
      fee: '৳ 1,200',
      videoFee: '৳ 900',
      experience:
        'MBBS, FCPS (Medicine), MD (Chest), FCCP (USA) • Former Head, National Institute of Diseases of the Chest & Hospital',
      chamberTime: '6:30 pm - 9:00 pm',
      room: 'Room 312, Level 3',
      branches: ['Dhanmondi', 'Uttara'],
      days: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
    },
    {
      name: 'Dr. Rajashis Chakraborti, MD',
      title: 'Associate Professor, Pulmonary & Sleep Medicine',
      designation: 'Associate Professor',
      fee: '৳ 1,000',
      videoFee: '৳ 800',
      experience:
        'MBBS, DTCD, MD (Chest), FCCP • Senior Consultant in Asthma, COPD & Sleep Apnea',
      chamberTime: '6:00 pm - 8:30 pm',
      room: 'Room 314, Level 3',
      branches: ['Dhanmondi', 'Mirpur'],
      days: ['Sunday', 'Monday', 'Wednesday'],
    },
    {
      name: 'Prof. Dr. Rafiqul Alam, MD',
      title: 'Senior Consultant, Thoracic & Asthma Care',
      designation: 'Professor',
      fee: '৳ 1,200',
      videoFee: '৳ 900',
      experience:
        'MBBS, MD (Respiratory Medicine), FRCP • Ex-Professor of Pulmonology & Interventional Bronchoscopy',
      chamberTime: '5:30 pm - 8:30 pm',
      room: 'Room 315, Level 3',
      branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
      days: ['Sunday', 'Tuesday', 'Wednesday', 'Friday'],
    },
    {
      name: 'Dr. Mahbubul Islam, DTCD',
      title: 'Assistant Professor, Respiratory ICU',
      designation: 'Assistant Professor',
      fee: '৳ 900',
      videoFee: '৳ 700',
      experience:
        'MBBS, DTCD, MCPS (Medicine) • Respiratory Critical Care & Tuberculosis Specialist',
      chamberTime: '6:30 pm - 9:00 pm',
      room: 'Room 318, Level 3',
      branches: ['Dhanmondi', 'Mirpur'],
      days: ['Saturday', 'Sunday', 'Thursday'],
    },
    {
      name: 'Dr. Rezaul Haque, MBBS, MD',
      title: 'Specialist Consultant, Chest Diseases',
      designation: 'Doctor',
      fee: '৳ 800',
      videoFee: '৳ 650',
      experience:
        'MBBS, MD (Chest) • Chest, Asthma, Allergy & Respiratory Medicine Specialist',
      chamberTime: '6:30 pm - 9:00 pm',
      room: 'Room 320, Level 3',
      branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    },
  ],
  Neurology: [
    {
      name: 'Prof. Dr. Kabir Hossain, MS',
      title: 'Chief of Neurosurgery & Spine',
      designation: 'Professor',
      fee: '৳ 1,200',
      room: 'Room 401, Level 4',
      branches: ['Dhanmondi', 'Uttara'],
      days: ['Saturday', 'Sunday', 'Monday', 'Wednesday'],
    },
    {
      name: 'Dr. Nadia Chowdhury, MD',
      title: 'Associate Professor, Stroke & Neuro Unit',
      designation: 'Associate Professor',
      fee: '৳ 1,000',
      room: 'Room 404, Level 4',
      branches: ['Dhanmondi', 'Mirpur'],
      days: ['Sunday', 'Tuesday', 'Thursday', 'Friday'],
    },
    {
      name: 'Dr. Imran Karim, FCPS',
      title: 'Consultant Neurologist',
      designation: 'Doctor',
      fee: '৳ 900',
      room: 'Room 407, Level 4',
      branches: ['Uttara', 'Mirpur'],
      days: ['Saturday', 'Monday', 'Wednesday'],
    },
  ],
  Orthopedics: [
    {
      name: 'Prof. Dr. Tariqul Islam, MS',
      title: 'Head of Orthopedic & Joint Surgery',
      designation: 'Professor',
      fee: '৳ 1,100',
      room: 'Room 208, Level 2',
      branches: ['Dhanmondi', 'Uttara'],
      days: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
    },
    {
      name: 'Dr. Rafiqul Islam, D-Ortho',
      title: 'Assistant Professor, Sports & Trauma Surgery',
      designation: 'Assistant Professor',
      fee: '৳ 900',
      room: 'Room 210, Level 2',
      branches: ['Dhanmondi', 'Mirpur'],
      days: ['Sunday', 'Monday', 'Wednesday', 'Friday'],
    },
  ],
  Pediatrics: [
    {
      name: 'Prof. Dr. Salma Begum, FCPS',
      title: 'Head of Pediatrics & Level-3 NICU',
      designation: 'Professor',
      fee: '৳ 1,000',
      room: 'Room 112, Level 1',
      branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
      days: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
    },
    {
      name: 'Dr. Ashraful Alam, MD',
      title: 'Neonatology & Child Care Consultant',
      designation: 'Doctor',
      fee: '৳ 800',
      room: 'Room 115, Level 1',
      branches: ['Dhanmondi', 'Mirpur'],
      days: ['Sunday', 'Monday', 'Wednesday', 'Friday'],
    },
  ],
  Medicine: [
    {
      name: 'Prof. Dr. Mohammad A. Rahman, FRCP',
      title: 'Chief Medical Director & Internal Medicine',
      designation: 'Professor',
      fee: '৳ 1,200',
      room: 'Room 201, Level 2',
      branches: ['Dhanmondi', 'Uttara'],
      days: ['Saturday', 'Sunday', 'Monday', 'Wednesday'],
    },
    {
      name: 'Dr. Sadia Afrin, FCPS',
      title: 'Associate Professor, Medicine & Diabetology',
      designation: 'Associate Professor',
      fee: '৳ 900',
      room: 'Room 204, Level 2',
      branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
      days: ['Sunday', 'Tuesday', 'Thursday', 'Friday'],
    },
  ],
  Oncology: [
    {
      name: 'Dr. Rehana Parveen, PhD',
      title: 'Associate Professor of Oncology',
      designation: 'Associate Professor',
      fee: '৳ 1,200',
      room: 'Room 502, Level 5',
      branches: ['Dhanmondi', 'Uttara'],
      days: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
    },
  ],
};

export const DIAGNOSTIC_PACKAGES: DiagnosticPackageOption[] = [
  { name: 'Master Health Checkup', price: '৳ 3,800', meta: '18 Tests • Same-day report' },
  { name: 'Executive Full-Body Checkup', price: '৳ 7,500', meta: '32 Tests • Report within 6 hrs' },
  { name: 'Cardiac Wellness Screening', price: '৳ 5,900', meta: '14 Tests • Priority reporting' },
  { name: 'Diabetic & Renal Care Panel', price: '৳ 2,900', meta: '12 Tests • Same-day report' },
];

export const LAB_TEST_ITEMS: LabTestOption[] = [
  {
    name: 'Complete Blood Count (CBC with ESR)',
    price: '৳ 500',
    category: 'Pathology',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: '3 Hours',
  },
  {
    name: '3 Tesla Brain & Spine MRI',
    price: '৳ 8,500',
    category: 'Radiology & MRI',
    branches: ['Dhanmondi', 'Uttara'],
    reportTime: 'Same Day',
  },
  {
    name: 'Chest X-Ray Digital (PA View)',
    price: '৳ 600',
    category: 'Radiology & MRI',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: '1 Hour',
  },
  {
    name: 'Fasting Lipid Profile',
    price: '৳ 1,200',
    category: 'Biochemistry',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: '4 Hours',
  },
  {
    name: 'HbA1c (Glycated Hemoglobin)',
    price: '৳ 950',
    category: 'Diabetic',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: '4 Hours',
  },
  {
    name: '12-Lead Digital ECG',
    price: '৳ 450',
    category: 'Cardiac',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: 'Instant',
  },
  {
    name: '2D Color Doppler Echocardiogram',
    price: '৳ 2,800',
    category: 'Cardiac',
    branches: ['Dhanmondi', 'Uttara'],
    reportTime: 'Same Day',
  },
  {
    name: 'Whole Abdomen Ultrasonography (4D)',
    price: '৳ 1,800',
    category: 'Radiology & MRI',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: '2 Hours',
  },
  {
    name: 'TSH (Thyroid Stimulating Hormone)',
    price: '৳ 900',
    category: 'Biochemistry',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: '5 Hours',
  },
  {
    name: 'Serum Creatinine & Electrolytes',
    price: '৳ 1,100',
    category: 'Biochemistry',
    branches: ['Dhanmondi', 'Uttara', 'Mirpur'],
    reportTime: '4 Hours',
  },
];

export const TIME_SLOTS = ['09:30 AM', '11:00 AM', '04:00 PM', '06:00 PM', '07:30 PM'];

export const getTodayDateString = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/** Returns upcoming YYYY-MM-DD date matching a weekday name (starting today). */
export const getNextDateForWeekday = (dayName: string): string => {
  const target = WEEKDAY_INDEX[dayName];
  if (target === undefined) return getTodayDateString();
  const now = new Date();
  const delta = (target - now.getDay() + 7) % 7;
  const next = new Date(now);
  next.setDate(now.getDate() + delta);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/** Builds clean structured weekly schedule rows for a doctor option. */
export const resolveDoctorSchedule = (
  doc: DoctorOption
): DoctorScheduleSlot[] =>
  doc.days.map((day, idx) => ({
    type: idx % 2 === 0 ? 'General OPD' : 'OPD & Video',
    day,
    time: doc.chamberTime ?? '6:00 pm - 9:00 pm',
  }));
