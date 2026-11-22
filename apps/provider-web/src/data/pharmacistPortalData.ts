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
  'pos-checkout': '/dashboard/pharmacist/checkout',
  'pos-receipt': '/dashboard/pharmacist/receipt',
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
  'checkout': 'pos-checkout',
  'pos/checkout': 'pos-checkout',
  'pos-checkout': 'pos-checkout',
  'receipt': 'pos-receipt',
  'pos/receipt': 'pos-receipt',
  'pos-receipt': 'pos-receipt',
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
    title: 'Main Menu',
    items: [
      { id: 'dashboard', title: 'Dashboard', icon: 'Home', path: '/dashboard/pharmacist' },
      { id: 'pos-billing', title: 'Point of Sale', icon: 'Receipt', path: '/dashboard/pharmacist/pos', badge: 'Active', badgeColor: 'bg-emerald-50 text-emerald-700' },
      { id: 'e-prescriptions', title: 'Dispense Queue', icon: 'Pill', path: '/dashboard/pharmacist/dispense', badge: 19, badgeColor: 'bg-cyan-50 text-cyan-700' },
    ],
  },
  {
    title: 'Dispensing & Stock',
    items: [
      { id: 'inventory-master', title: 'Inventory & Stock', icon: 'Boxes', path: '/dashboard/pharmacist/inventory' },
      { id: 'batch-expiry', title: 'Batches & Expiry', icon: 'CalendarClock', path: '/dashboard/pharmacist/batches', badge: 3, badgeColor: 'bg-amber-50 text-amber-700' },
      { id: 'stock-transfers', title: 'Stock Transfers', icon: 'ArrowLeftRight', path: '/dashboard/pharmacist/transfers' },
      { id: 'purchase-orders', title: 'Purchase Orders', icon: 'ShoppingCart', path: '/dashboard/pharmacist/purchases' },
    ],
  },
  {
    title: 'Clinical Care',
    items: [
      { id: 'ward-indents', title: 'Ward Indents', icon: 'Bed', path: '/dashboard/pharmacist/ward-indents', badge: 5, badgeColor: 'bg-sky-50 text-sky-700' },
      { id: 'narcotics-register', title: 'Narcotics Register', icon: 'ShieldAlert', path: '/dashboard/pharmacist/narcotics', badge: 'Regulated', badgeColor: 'bg-rose-50 text-rose-700' },
      { id: 'returns-refunds', title: 'Returns & Refunds', icon: 'RotateCcw', path: '/dashboard/pharmacist/returns' },
    ],
  },
  {
    title: 'Reports & Analytics',
    items: [
      { id: 'pharmacy-reports', title: 'Sales & Reports', icon: 'BarChart3', path: '/dashboard/pharmacist/reports' },
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

