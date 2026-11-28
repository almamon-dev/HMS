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
  'inventory-master': '/dashboard/pharmacist/inventory',
  'batch-expiry': '/dashboard/pharmacist/batches',
  'stock-transfers': '/dashboard/pharmacist/transfers',
  'purchase-orders': '/dashboard/pharmacist/purchases',
  'returns-refunds': '/dashboard/pharmacist/returns',
  'pharmacy-reports': '/dashboard/pharmacist/reports',
  'reports-branch': '/dashboard/pharmacist/reports',
  'reports-sales': '/dashboard/pharmacist/reports/sales',
  'reports-inventory': '/dashboard/pharmacist/reports/inventory',
  'staff-management': '/dashboard/pharmacist/staff',
  'staff-directory': '/dashboard/pharmacist/staff',
  'staff-roles': '/dashboard/pharmacist/staff/roles',
  'staff-audit': '/dashboard/pharmacist/staff/audit',
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
  'inventory': 'inventory-master',
  'inventory-master': 'inventory-master',
  'stock': 'inventory-master',
  'batches': 'batch-expiry',
  'batch-expiry': 'batch-expiry',
  'transfers': 'stock-transfers',
  'stock-transfers': 'stock-transfers',
  'purchases': 'purchase-orders',
  'purchase-orders': 'purchase-orders',
  'returns': 'returns-refunds',
  'returns-refunds': 'returns-refunds',
  'reports': 'reports-branch',
  'pharmacy-reports': 'reports-branch',
  'reports/branch': 'reports-branch',
  'reports-branch': 'reports-branch',
  'reports/sales': 'reports-sales',
  'reports-sales': 'reports-sales',
  'reports/inventory': 'reports-inventory',
  'reports-inventory': 'reports-inventory',
  'staff': 'staff-directory',
  'staff-management': 'staff-directory',
  'staff/directory': 'staff-directory',
  'staff-directory': 'staff-directory',
  'staff/roles': 'staff-roles',
  'staff-roles': 'staff-roles',
  'staff/audit': 'staff-audit',
  'staff-audit': 'staff-audit',
};

export const PHARMACIST_NAV_SECTIONS: PharmacistNavSection[] = [
  {
    title: 'Main Menu',
    items: [
      { id: 'dashboard', title: 'Dashboard', icon: 'Home', path: '/dashboard/pharmacist' },
      { id: 'pos-billing', title: 'Point of Sale', icon: 'Receipt', path: '/dashboard/pharmacist/pos', badge: 'Active', badgeColor: 'bg-emerald-50 text-emerald-700' },
      { id: 'inventory-master', title: 'Inventory & Stock', icon: 'Boxes', path: '/dashboard/pharmacist/inventory' },
      { id: 'batch-expiry', title: 'Batches & Expiry', icon: 'CalendarClock', path: '/dashboard/pharmacist/batches', badge: 3, badgeColor: 'bg-amber-50 text-amber-700' },
      { id: 'stock-transfers', title: 'Stock Movements', icon: 'ArrowLeftRight', path: '/dashboard/pharmacist/transfers' },
    ],
  },
  {
    title: 'Orders & Reports',
    items: [
      { id: 'returns-refunds', title: 'Returns & Refunds', icon: 'RotateCcw', path: '/dashboard/pharmacist/returns' },
      { id: 'purchase-orders', title: 'Purchase Orders', icon: 'ShoppingCart', path: '/dashboard/pharmacist/purchases' },
      {
        id: 'pharmacy-reports',
        title: 'Sales & Reports',
        icon: 'BarChart3',
        path: '/dashboard/pharmacist/reports',
        subItems: [
          { id: 'reports-branch', title: 'Branch Performance', path: '/dashboard/pharmacist/reports' },
          { id: 'reports-sales', title: 'Sales & Dispensing', path: '/dashboard/pharmacist/reports/sales' },
          { id: 'reports-inventory', title: 'Inventory Valuation', path: '/dashboard/pharmacist/reports/inventory' },
        ],
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'staff-management',
        title: 'Staff & RBAC',
        icon: 'Users',
        path: '/dashboard/pharmacist/staff',
        subItems: [
          { id: 'staff-directory', title: 'Staff Directory', path: '/dashboard/pharmacist/staff' },
          { id: 'staff-roles', title: 'Role & Permissions', path: '/dashboard/pharmacist/staff/roles' },
          { id: 'staff-audit', title: 'Audit Logs', path: '/dashboard/pharmacist/staff/audit' },
        ],
      },
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

