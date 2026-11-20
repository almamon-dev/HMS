export type AmbulanceVehicleType =
  | 'ICU Support Ambulance'
  | 'Cardiac Mobile Unit'
  | 'Standard AC Ambulance'
  | 'Basic Life Support (BLS)';

export type AmbulanceVehicleStatus =
  | 'Available'
  | 'Dispatched'
  | 'Maintenance';

export interface AmbulanceVehicle {
  id: string;
  vehicleNo: string;
  vehicleModel: string;
  yearMade: string;
  driverName: string;
  driverLicense: string;
  driverContact: string;
  vehicleType: AmbulanceVehicleType;
  status: AmbulanceVehicleStatus;
  baseStation: string;
}

export interface AmbulanceCallRecord {
  id: string;
  billNo: string;
  caseId: string;
  patientName: string;
  patientContact: string;
  gender: 'Male' | 'Female';
  address: string;
  vehicleNo: string;
  vehicleModel: string;
  driverName: string;
  driverContact: string;
  callDate: string;
  distanceKm: number;
  ratePerKm: number;
  amount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  tripStatus: 'Completed' | 'En Route' | 'Assigned';
}

export const SMART_AMBULANCE_VEHICLES: AmbulanceVehicle[] = [
  {
    id: 'veh-01',
    vehicleNo: 'DM-HA-11-2041',
    vehicleModel: 'Toyota HiAce High Roof (ICU)',
    yearMade: '2023',
    driverName: 'Md. Rafiqul Islam',
    driverLicense: 'DL-DH-849201',
    driverContact: '+880 1712-334455',
    vehicleType: 'ICU Support Ambulance',
    status: 'Available',
    baseStation: 'Main Campus (Dhanmondi)',
  },
  {
    id: 'veh-02',
    vehicleNo: 'DM-HA-11-2042',
    vehicleModel: 'Mercedes-Benz Sprinter Mobile ICU',
    yearMade: '2024',
    driverName: 'Abul Kashem',
    driverLicense: 'DL-DH-739102',
    driverContact: '+880 1819-445566',
    vehicleType: 'Cardiac Mobile Unit',
    status: 'Dispatched',
    baseStation: 'Cardiac Emergency Wing',
  },
  {
    id: 'veh-03',
    vehicleNo: 'DM-HA-11-2043',
    vehicleModel: 'Hyundai Starex AC Ambulance',
    yearMade: '2022',
    driverName: 'Sultan Mahmud',
    driverLicense: 'DL-DH-628491',
    driverContact: '+880 1913-556677',
    vehicleType: 'Standard AC Ambulance',
    status: 'Available',
    baseStation: 'Uttara Annex',
  },
  {
    id: 'veh-04',
    vehicleNo: 'DM-HA-11-2044',
    vehicleModel: 'Toyota HiAce Standard',
    yearMade: '2021',
    driverName: 'Shafiqul Alam',
    driverLicense: 'DL-DH-519283',
    driverContact: '+880 1614-667788',
    vehicleType: 'Basic Life Support (BLS)',
    status: 'Available',
    baseStation: 'Mirpur Diagnostic Hub',
  },
  {
    id: 'veh-05',
    vehicleNo: 'DM-HA-11-2045',
    vehicleModel: 'Ford Transit Emergency ICU',
    yearMade: '2023',
    driverName: 'Mohammad Ali',
    driverLicense: 'DL-DH-408172',
    driverContact: '+880 1715-778899',
    vehicleType: 'ICU Support Ambulance',
    status: 'Dispatched',
    baseStation: 'Trauma & Emergency Center',
  },
  {
    id: 'veh-06',
    vehicleNo: 'DM-HA-11-2046',
    vehicleModel: 'Toyota Granvia Cardiac Mobile',
    yearMade: '2022',
    driverName: 'Jahangir Hossain',
    driverLicense: 'DL-DH-397261',
    driverContact: '+880 1816-889900',
    vehicleType: 'Cardiac Mobile Unit',
    status: 'Available',
    baseStation: 'Main Campus (Dhanmondi)',
  },
  {
    id: 'veh-07',
    vehicleNo: 'DM-HA-11-2047',
    vehicleModel: 'Nissan Urvan Standard AC',
    yearMade: '2020',
    driverName: 'Zakir Hossain',
    driverLicense: 'DL-DH-286150',
    driverContact: '+880 1917-990011',
    vehicleType: 'Standard AC Ambulance',
    status: 'Maintenance',
    baseStation: 'Central Motor Pool / Workshop',
  },
  {
    id: 'veh-08',
    vehicleNo: 'DM-HA-11-2048',
    vehicleModel: 'Toyota HiAce BLS',
    yearMade: '2023',
    driverName: 'Nazmul Islam',
    driverLicense: 'DL-DH-175049',
    driverContact: '+880 1618-001122',
    vehicleType: 'Basic Life Support (BLS)',
    status: 'Available',
    baseStation: 'Uttara Annex',
  },
];

export const SMART_AMBULANCE_CALLS: AmbulanceCallRecord[] = [
  {
    id: 'amb-call-1',
    billNo: 'AMB 1082',
    caseId: '7490',
    patientName: 'Rachel Priest (1162)',
    patientContact: '+880 1711-223344',
    gender: 'Female',
    address: 'House 42, Road 9/A, Dhanmondi, Dhaka',
    vehicleNo: 'DM-HA-11-2041',
    vehicleModel: 'Toyota HiAce High Roof (ICU)',
    driverName: 'Md. Rafiqul Islam',
    driverContact: '+880 1712-334455',
    callDate: '20/11/2026 10:15 AM',
    distanceKm: 14,
    ratePerKm: 12.0,
    amount: 168.0,
    discountAmount: 0.0,
    taxAmount: 8.4,
    netAmount: 176.4,
    paidAmount: 176.4,
    balanceAmount: 0.0,
    tripStatus: 'Completed',
  },
  {
    id: 'amb-call-2',
    billNo: 'AMB 1081',
    caseId: '7488',
    patientName: 'Jonathan Hibbins (1021)',
    patientContact: '+880 1819-334455',
    gender: 'Male',
    address: 'Sector 7, Road 14, Uttara, Dhaka',
    vehicleNo: 'DM-HA-11-2042',
    vehicleModel: 'Mercedes-Benz Sprinter Mobile ICU',
    driverName: 'Abul Kashem',
    driverContact: '+880 1819-445566',
    callDate: '20/11/2026 09:30 AM',
    distanceKm: 22,
    ratePerKm: 15.0,
    amount: 330.0,
    discountAmount: 30.0,
    taxAmount: 15.0,
    netAmount: 315.0,
    paidAmount: 250.0,
    balanceAmount: 65.0,
    tripStatus: 'En Route',
  },
  {
    id: 'amb-call-3',
    billNo: 'AMB 1080',
    caseId: '7481',
    patientName: 'Sultana Razia (1026)',
    patientContact: '+880 1912-445566',
    gender: 'Female',
    address: 'Block D, Lalmatia, Dhaka',
    vehicleNo: 'DM-HA-11-2043',
    vehicleModel: 'Hyundai Starex AC Ambulance',
    driverName: 'Sultan Mahmud',
    driverContact: '+880 1913-556677',
    callDate: '19/11/2026 08:45 PM',
    distanceKm: 8,
    ratePerKm: 10.0,
    amount: 80.0,
    discountAmount: 0.0,
    taxAmount: 4.0,
    netAmount: 84.0,
    paidAmount: 84.0,
    balanceAmount: 0.0,
    tripStatus: 'Completed',
  },
  {
    id: 'amb-call-4',
    billNo: 'AMB 1079',
    caseId: '7475',
    patientName: 'Tanveer Chowdhury (1027)',
    patientContact: '+880 1613-556677',
    gender: 'Male',
    address: 'Plot 18, Block B, Bashundhara R/A, Dhaka',
    vehicleNo: 'DM-HA-11-2045',
    vehicleModel: 'Ford Transit Emergency ICU',
    driverName: 'Mohammad Ali',
    driverContact: '+880 1715-778899',
    callDate: '19/11/2026 03:20 PM',
    distanceKm: 18,
    ratePerKm: 14.0,
    amount: 252.0,
    discountAmount: 0.0,
    taxAmount: 12.6,
    netAmount: 264.6,
    paidAmount: 264.6,
    balanceAmount: 0.0,
    tripStatus: 'Completed',
  },
  {
    id: 'amb-call-5',
    billNo: 'AMB 1078',
    caseId: '7462',
    patientName: 'Jannatul Ferdous (1028)',
    patientContact: '+880 1714-667788',
    gender: 'Female',
    address: 'Mirpur 12, Block C, Dhaka',
    vehicleNo: 'DM-HA-11-2044',
    vehicleModel: 'Toyota HiAce Standard',
    driverName: 'Shafiqul Alam',
    driverContact: '+880 1614-667788',
    callDate: '18/11/2026 01:10 PM',
    distanceKm: 12,
    ratePerKm: 9.0,
    amount: 108.0,
    discountAmount: 10.0,
    taxAmount: 4.9,
    netAmount: 102.9,
    paidAmount: 102.9,
    balanceAmount: 0.0,
    tripStatus: 'Completed',
  },
  {
    id: 'amb-call-6',
    billNo: 'AMB 1077',
    caseId: '7450',
    patientName: 'Monirul Haque (1029)',
    patientContact: '+880 1815-778899',
    gender: 'Male',
    address: 'Mohakhali DOHS, Road 3, Dhaka',
    vehicleNo: 'DM-HA-11-2046',
    vehicleModel: 'Toyota Granvia Cardiac Mobile',
    driverName: 'Jahangir Hossain',
    driverContact: '+880 1816-889900',
    callDate: '18/11/2026 10:00 AM',
    distanceKm: 16,
    ratePerKm: 14.0,
    amount: 224.0,
    discountAmount: 0.0,
    taxAmount: 11.2,
    netAmount: 235.2,
    paidAmount: 200.0,
    balanceAmount: 35.2,
    tripStatus: 'Completed',
  },
  {
    id: 'amb-call-7',
    billNo: 'AMB 1076',
    caseId: '7438',
    patientName: 'Kamal Hossain (1030)',
    patientContact: '+880 1916-889900',
    gender: 'Male',
    address: 'Sector 11, Uttara, Dhaka',
    vehicleNo: 'DM-HA-11-2048',
    vehicleModel: 'Toyota HiAce BLS',
    driverName: 'Nazmul Islam',
    driverContact: '+880 1618-001122',
    callDate: '17/11/2026 04:40 PM',
    distanceKm: 15,
    ratePerKm: 10.0,
    amount: 150.0,
    discountAmount: 0.0,
    taxAmount: 7.5,
    netAmount: 157.5,
    paidAmount: 157.5,
    balanceAmount: 0.0,
    tripStatus: 'Completed',
  },
  {
    id: 'amb-call-8',
    billNo: 'AMB 1075',
    caseId: '7425',
    patientName: 'Sharmin Jahan (1031)',
    patientContact: '+880 1717-990011',
    gender: 'Female',
    address: 'Green Road, Farmgate, Dhaka',
    vehicleNo: 'DM-HA-11-2041',
    vehicleModel: 'Toyota HiAce High Roof (ICU)',
    driverName: 'Md. Rafiqul Islam',
    driverContact: '+880 1712-334455',
    callDate: '17/11/2026 11:25 AM',
    distanceKm: 6,
    ratePerKm: 12.0,
    amount: 72.0,
    discountAmount: 0.0,
    taxAmount: 3.6,
    netAmount: 75.6,
    paidAmount: 75.6,
    balanceAmount: 0.0,
    tripStatus: 'Completed',
  },
];
