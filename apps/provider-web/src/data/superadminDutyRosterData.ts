export type DutyShiftType =
  | 'Morning (08:00 - 14:00)'
  | 'Evening (14:00 - 20:00)'
  | 'Night (20:00 - 08:00)'
  | 'General (09:00 - 17:00)'
  | '24/7 On-Call Emergency';

export type DutyStatus = 'On Duty' | 'Upcoming' | 'Completed' | 'On Leave';

export interface DutyRosterRecord {
  id: string;
  rosterNo: string;
  staffName: string;
  staffId: string;
  role: 'Consultant Doctor' | 'Specialist' | 'Senior Medical Officer' | 'Staff Nurse' | 'ICU Incharge' | 'Pharmacist';
  department: string;
  shift: DutyShiftType;
  chamberOrWard: string;
  dutyDate: string;
  checkInTime: string;
  status: DutyStatus;
  contactNo: string;
  campus: string;
}

export interface ShiftTimingConfig {
  id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  totalAssigned: number;
  colorClass: string;
}

export const SHIFT_TIMING_CONFIGS: ShiftTimingConfig[] = [
  {
    id: 'shift-1',
    shiftName: 'Morning Shift',
    startTime: '08:00 AM',
    endTime: '02:00 PM',
    durationHours: 6,
    totalAssigned: 24,
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'shift-2',
    shiftName: 'Evening Shift',
    startTime: '02:00 PM',
    endTime: '08:00 PM',
    durationHours: 6,
    totalAssigned: 18,
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'shift-3',
    shiftName: 'Night Shift',
    startTime: '08:00 PM',
    endTime: '08:00 AM',
    durationHours: 12,
    totalAssigned: 12,
    colorClass: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    id: 'shift-4',
    shiftName: 'General Duty',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    durationHours: 8,
    totalAssigned: 14,
    colorClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  {
    id: 'shift-5',
    shiftName: '24/7 On-Call',
    startTime: 'Flexible',
    endTime: 'On-Call',
    durationHours: 24,
    totalAssigned: 6,
    colorClass: 'bg-rose-50 text-rose-800 border-rose-200',
  },
];

export const SMART_DUTY_ROSTER: DutyRosterRecord[] = [
  {
    id: 'rst-01',
    rosterNo: 'RST-9041',
    staffName: 'Dr. Reyan Jain (9011)',
    staffId: 'DOC-9011',
    role: 'Consultant Doctor',
    department: 'Cardiology',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'Ch-101 (OPD Block)',
    dutyDate: '20/11/2026',
    checkInTime: '07:52 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1711-889901',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-02',
    rosterNo: 'RST-9042',
    staffName: 'Dr. Farhana Yasmin (9013)',
    staffId: 'DOC-9013',
    role: 'Consultant Doctor',
    department: 'Gynecology & Obs',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'Ch-104 (Gyne Ward)',
    dutyDate: '20/11/2026',
    checkInTime: '07:58 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1819-778899',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-03',
    rosterNo: 'RST-9043',
    staffName: 'Dr. Kamrul Islam (9014)',
    staffId: 'DOC-9014',
    role: 'Specialist',
    department: 'Orthopedic Surgery',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'OT Suite 02',
    dutyDate: '20/11/2026',
    checkInTime: '08:05 AM (Manual Log)',
    status: 'On Duty',
    contactNo: '+880 1913-667788',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-04',
    rosterNo: 'RST-9044',
    staffName: 'Dr. Tariqul Anwar (9015)',
    staffId: 'DOC-9015',
    role: 'Senior Medical Officer',
    department: 'Neuromedicine',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'Ch-301 (Neuro OPD)',
    dutyDate: '20/11/2026',
    checkInTime: '08:00 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1614-556677',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-05',
    rosterNo: 'RST-9045',
    staffName: 'Dr. Sabrina Karim (9017)',
    staffId: 'DOC-9017',
    role: 'Specialist',
    department: 'Radiology & Imaging',
    shift: 'General (09:00 - 17:00)',
    chamberOrWard: 'CT/MRI Suite 201',
    dutyDate: '20/11/2026',
    checkInTime: '08:45 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1715-445566',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-06',
    rosterNo: 'RST-9046',
    staffName: 'Prof. Dr. Tanvir Ahmed (9010)',
    staffId: 'DOC-9010',
    role: 'Consultant Doctor',
    department: 'Cardiothoracic Surgery',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'Ch-102 (Cardio Hub)',
    dutyDate: '20/11/2026',
    checkInTime: '07:45 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1816-334455',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-07',
    rosterNo: 'RST-9047',
    staffName: 'Nurse Shikha Rani (N-204)',
    staffId: 'NUR-204',
    role: 'ICU Incharge',
    department: 'ICU / CCU',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'ICU Station Bed 01-08',
    dutyDate: '20/11/2026',
    checkInTime: '07:40 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1917-223344',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-08',
    rosterNo: 'RST-9048',
    staffName: 'Dr. Nafisa Chowdhury (9016)',
    staffId: 'DOC-9016',
    role: 'Specialist',
    department: 'Pediatrics',
    shift: 'Evening (14:00 - 20:00)',
    chamberOrWard: 'Ch-205 (Pediatric Desk)',
    dutyDate: '20/11/2026',
    checkInTime: 'Pending Shift Start',
    status: 'Upcoming',
    contactNo: '+880 1618-112233',
    campus: 'Uttara',
  },
  {
    id: 'rst-09',
    rosterNo: 'RST-9049',
    staffName: 'Dr. Mahmudul Hasan (9012)',
    staffId: 'DOC-9012',
    role: 'Consultant Doctor',
    department: 'Cardiology',
    shift: 'Evening (14:00 - 20:00)',
    chamberOrWard: 'Ch-101 (OPD Block)',
    dutyDate: '20/11/2026',
    checkInTime: 'Pending Shift Start',
    status: 'Upcoming',
    contactNo: '+880 1719-001122',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-10',
    rosterNo: 'RST-9050',
    staffName: 'Dr. Rubina Parvin (9018)',
    staffId: 'DOC-9018',
    role: 'Specialist',
    department: 'Dermatology',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'Derma Suite 301',
    dutyDate: '20/11/2026',
    checkInTime: '08:10 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1812-998877',
    campus: 'Uttara',
  },
  {
    id: 'rst-11',
    rosterNo: 'RST-9051',
    staffName: 'Dr. Sajjad Hossain (9019)',
    staffId: 'DOC-9019',
    role: 'Senior Medical Officer',
    department: 'Emergency & Trauma',
    shift: 'Night (20:00 - 08:00)',
    chamberOrWard: 'Trauma Bay T1',
    dutyDate: '20/11/2026',
    checkInTime: 'Shift at 20:00 PM',
    status: 'Upcoming',
    contactNo: '+880 1913-887766',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-12',
    rosterNo: 'RST-9052',
    staffName: 'Nurse Taslima Akter (N-208)',
    staffId: 'NUR-208',
    role: 'Staff Nurse',
    department: 'Emergency & Trauma',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'Triage Desk',
    dutyDate: '20/11/2026',
    checkInTime: '07:50 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1614-776655',
    campus: 'Dhanmondi',
  },
  {
    id: 'rst-13',
    rosterNo: 'RST-9053',
    staffName: 'Dr. Mehzabin Haque (9020)',
    staffId: 'DOC-9020',
    role: 'Consultant Doctor',
    department: 'Endocrinology',
    shift: 'General (09:00 - 17:00)',
    chamberOrWard: 'Ch-105 (Endo Desk)',
    dutyDate: '20/11/2026',
    checkInTime: 'Approved Medical Leave',
    status: 'On Leave',
    contactNo: '+880 1715-665544',
    campus: 'Mirpur',
  },
  {
    id: 'rst-14',
    rosterNo: 'RST-9054',
    staffName: 'Pharmacist Kabir Ahmed',
    staffId: 'PHARM-102',
    role: 'Pharmacist',
    department: 'Pharmacy Dispensary',
    shift: 'Morning (08:00 - 14:00)',
    chamberOrWard: 'Central Dispensary Desk',
    dutyDate: '20/11/2026',
    checkInTime: '07:45 AM (Biometric)',
    status: 'On Duty',
    contactNo: '+880 1816-554433',
    campus: 'Dhanmondi',
  },
];
