export interface PharmacistSubNavItem {
  id: string;
  title: string;
  path: string;
  badge?: string | number;
}

export interface PharmacistNavItem {
  id: string;
  title: string;
  icon: string;
  path: string;
  badge?: string | number;
  badgeColor?: string;
  subItems?: PharmacistSubNavItem[];
}

export interface PharmacistNavSection {
  title: string;
  items: PharmacistNavItem[];
}

export const PHARMACIST_MODULE_ROUTE_MAP: Record<string, string> = {
  'dashboard': '/dashboard/pharmacist',
  'pos-billing': '/dashboard/pharmacist/pos',
  'e-prescriptions': '/dashboard/pharmacist/dispense',
  'inventory-master': '/dashboard/pharmacist/inventory',
  'batch-expiry': '/dashboard/pharmacist/batches',
  'ward-indents': '/dashboard/pharmacist/ward-indents',
  'stock-transfers': '/dashboard/pharmacist/transfers',
  'purchase-orders': '/dashboard/pharmacist/purchases',
  'returns-refunds': '/dashboard/pharmacist/returns',
  'narcotics-register': '/dashboard/pharmacist/narcotics',
  'pharmacy-reports': '/dashboard/pharmacist/reports',
};

export const PHARMACIST_ROUTE_TO_MODULE_MAP: Record<string, string> = {
  '': 'dashboard',
  'dashboard': 'dashboard',
  'pos': 'pos-billing',
  'pos-billing': 'pos-billing',
  'dispense': 'e-prescriptions',
  'e-prescriptions': 'e-prescriptions',
  'prescriptions': 'e-prescriptions',
  'inventory': 'inventory-master',
  'inventory-master': 'inventory-master',
  'stock': 'inventory-master',
  'batches': 'batch-expiry',
  'batch-expiry': 'batch-expiry',
  'ward-indents': 'ward-indents',
  'indents': 'ward-indents',
  'transfers': 'stock-transfers',
  'stock-transfers': 'stock-transfers',
  'purchases': 'purchase-orders',
  'purchase-orders': 'purchase-orders',
  'returns': 'returns-refunds',
  'returns-refunds': 'returns-refunds',
  'narcotics': 'narcotics-register',
  'narcotics-register': 'narcotics-register',
  'reports': 'pharmacy-reports',
  'pharmacy-reports': 'pharmacy-reports',
};

export const PHARMACIST_NAV_SECTIONS: PharmacistNavSection[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'dashboard', title: 'Pharmacy Dashboard', icon: 'Home', path: '/dashboard/pharmacist' },
      { id: 'pos-billing', title: 'Point of Sale (POS)', icon: 'Receipt', path: '/dashboard/pharmacist/pos', badge: 'Fast', badgeColor: 'bg-emerald-50 text-emerald-700' },
      { id: 'e-prescriptions', title: 'E-Rx Dispense Queue', icon: 'Pill', path: '/dashboard/pharmacist/dispense', badge: 19, badgeColor: 'bg-cyan-50 text-cyan-700 animate-pulse' },
    ],
  },
  {
    title: 'Inventory & Warehouse',
    items: [
      { id: 'inventory-master', title: 'Medicine Stock Master', icon: 'Boxes', path: '/dashboard/pharmacist/inventory' },
      { id: 'batch-expiry', title: 'FEFO Batch & Expiry', icon: 'CalendarClock', path: '/dashboard/pharmacist/batches', badge: 3, badgeColor: 'bg-amber-50 text-amber-700' },
      { id: 'stock-transfers', title: 'Inter-Branch Transfers', icon: 'ArrowLeftRight', path: '/dashboard/pharmacist/transfers' },
      { id: 'purchase-orders', title: 'Purchases & GRN', icon: 'ShoppingCart', path: '/dashboard/pharmacist/purchases' },
    ],
  },
  {
    title: 'Clinical & Inpatient',
    items: [
      { id: 'ward-indents', title: 'IPD Ward Indents', icon: 'Bed', path: '/dashboard/pharmacist/ward-indents', badge: 5, badgeColor: 'bg-sky-50 text-sky-700' },
      { id: 'narcotics-register', title: 'Narcotics Register', icon: 'ShieldAlert', path: '/dashboard/pharmacist/narcotics', badge: 'DGDA', badgeColor: 'bg-rose-50 text-rose-700' },
      { id: 'returns-refunds', title: 'Returns & Refunds', icon: 'RotateCcw', path: '/dashboard/pharmacist/returns' },
    ],
  },
  {
    title: 'Analytics & Reports',
    items: [
      { id: 'pharmacy-reports', title: 'Audit & Sales Reports', icon: 'BarChart3', path: '/dashboard/pharmacist/reports' },
    ],
  },
];

export interface PharmacistProfile {
  id: string;
  name: string;
  designation: string;
  registrationNo: string;
  branch: string;
  email: string;
  phone: string;
}

export const CURRENT_PHARMACIST: PharmacistProfile = {
  id: 'pharma-01',
  name: 'Md. Rafiqul Islam, M.Pharm',
  designation: 'Chief Hospital Pharmacist & SCM In-Charge',
  registrationNo: 'PCB Reg: B-12948',
  branch: 'Dhanmondi Main Hub & Central Medical Store',
  email: 'pharmacist@hospital.local',
  phone: '+880 1711-000005',
};

