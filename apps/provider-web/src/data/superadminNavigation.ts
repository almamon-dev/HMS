export interface SubNavItem {
  id: string;
  title: string;
  badge?: string;
}

export interface NavItem {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  subItems?: SubNavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const SUPERADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: 'Core Operations',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: 'LayoutDashboard',
      },
      {
        id: 'patient',
        title: 'Patient',
        icon: 'UserCheck',
        badge: 'Directory',
      },
      {
        id: 'billing',
        title: 'Billing',
        icon: 'FileText',
        badge: 'OPD/IPD',
        badgeColor: 'bg-emerald-500/10 text-emerald-600',
      },
      {
        id: 'appointment',
        title: 'Appointment',
        icon: 'CalendarCheck2',
        badge: '18 Today',
        badgeColor: 'bg-teal-500/10 text-teal-600',
      },
      {
        id: 'opd',
        title: 'OPD - Out Patient',
        icon: 'Stethoscope',
      },
      {
        id: 'ipd',
        title: 'IPD - In Patient',
        icon: 'BedDouble',
        badge: '84 Beds',
        badgeColor: 'bg-cyan-500/10 text-cyan-700',
      },
    ],
  },
  {
    title: 'Clinical',
    items: [
      {
        id: 'pharmacy',
        title: 'Pharmacy',
        icon: 'Pill',
      },
      {
        id: 'pathology',
        title: 'Pathology',
        icon: 'FlaskConical',
        badge: '12 Pending',
        badgeColor: 'bg-amber-500/10 text-amber-700',
      },
      {
        id: 'radiology',
        title: 'Radiology',
        icon: 'Scan',
      },
      {
        id: 'blood-bank',
        title: 'Blood Bank',
        icon: 'Droplets',
        badge: 'Critical A+',
        badgeColor: 'bg-rose-500/10 text-rose-600',
      },
      {
        id: 'ambulance',
        title: 'Ambulance',
        icon: 'Ambulance',
      },
      {
        id: 'front-office',
        title: 'Front Office',
        icon: 'Building2',
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'birth-death',
        title: 'Birth & Death Record',
        icon: 'FileHeart',
        subItems: [
          { id: 'birth-record', title: 'Birth Record' },
          { id: 'death-record', title: 'Death Record' },
        ],
      },
      {
        id: 'multi-branch',
        title: 'Multi Branch',
        icon: 'GitBranch',
        subItems: [
          { id: 'branch-overview', title: 'Overview' },
          { id: 'branch-report', title: 'Report' },
          { id: 'branch-settings', title: 'Settings' },
        ],
      },
      {
        id: 'human-resource',
        title: 'Human Resource',
        icon: 'Users',
        subItems: [
          { id: 'hr-staff-directory', title: 'Staff Directory' },
          { id: 'hr-role-matrix', title: 'Role Matrix' },
          { id: 'hr-branch-allocations', title: 'Branch Allocations' },
          { id: 'hr-audit-logs', title: 'Audit Logs' },
        ],
      },
      {
        id: 'qr-attendance',
        title: 'QR Code Attendance',
        icon: 'QrCode',
        subItems: [
          { id: 'attendance-logs', title: 'Attendance' },
          { id: 'attendance-settings', title: 'Settings' },
        ],
      },
      {
        id: 'duty-roster',
        title: 'Duty Roster',
        icon: 'Clock4',
      },
      {
        id: 'annual-calendar',
        title: 'Annual Calendar',
        icon: 'CalendarDays',
      },
      {
        id: 'referral',
        title: 'Referral',
        icon: 'Share2',
      },
      {
        id: 'tpa',
        title: 'TPA Management',
        icon: 'ShieldAlert',
      },
      {
        id: 'finance',
        title: 'Finance',
        icon: 'Receipt',
        subItems: [
          { id: 'finance-income', title: 'Income' },
          { id: 'finance-expenses', title: 'Expenses' },
        ],
      },
    ],
  },
  {
    title: 'Tools & Content',
    items: [
      {
        id: 'survey-forms',
        title: 'Survey Forms',
        icon: 'ClipboardList',
        subItems: [
          { id: 'all-surveys', title: 'Survey Forms' },
          { id: 'my-surveys', title: 'My Survey Forms' },
        ],
      },
      {
        id: 'messaging',
        title: 'Messaging',
        icon: 'MessageSquareText',
      },
      {
        id: 'inventory',
        title: 'Inventory',
        icon: 'Package',
      },
      {
        id: 'download-center',
        title: 'Download Center',
        icon: 'Download',
        subItems: [
          { id: 'upload-content', title: 'Upload / Share Content' },
          { id: 'content-share-list', title: 'Content Share List' },
          { id: 'content-type', title: 'Content Type' },
        ],
      },
      {
        id: 'certificate',
        title: 'Certificate',
        icon: 'Award',
        subItems: [
          { id: 'cert-general', title: 'Certificate' },
          { id: 'cert-patient-id', title: 'Patient ID Card' },
          { id: 'cert-staff-id', title: 'Staff ID Card' },
        ],
      },
      {
        id: 'front-cms',
        title: 'Front CMS',
        icon: 'Globe2',
      },
      {
        id: 'live-consultation',
        title: 'Live Consultation',
        icon: 'Video',
        subItems: [
          { id: 'tele-consultation', title: 'Live Consultation' },
          { id: 'tele-meeting', title: 'Live Meeting' },
        ],
      },
    ],
  },
  {
    title: 'Reports & Setup',
    items: [
      {
        id: 'reports',
        title: 'Reports',
        icon: 'BarChart3',
        subItems: [
          { id: 'rep-finance', title: 'Finance Report' },
          { id: 'rep-appointment', title: 'Appointment Report' },
          { id: 'rep-opd', title: 'OPD Report' },
          { id: 'rep-ipd', title: 'IPD Report' },
          { id: 'rep-pharmacy', title: 'Pharmacy Report' },
          { id: 'rep-pathology', title: 'Pathology Report' },
          { id: 'rep-radiology', title: 'Radiology Report' },
          { id: 'rep-blood', title: 'Blood Bank Report' },
          { id: 'rep-ambulance', title: 'Ambulance Report' },
          { id: 'rep-hr', title: 'Human Resource Report' },
          { id: 'rep-ot', title: 'OT (Operation Theatre)' },
          { id: 'rep-audit', title: 'Audit / Log' },
        ],
      },
      {
        id: 'setup',
        title: 'Setup',
        icon: 'Sliders',
        subItems: [
          { id: 'setup-general', title: 'General Settings' },
          { id: 'setup-charges', title: 'Hospital Charges' },
          { id: 'setup-bed', title: 'Bed & Ward Setup' },
          { id: 'setup-header', title: 'Print Header & Footer' },
          { id: 'setup-front-office', title: 'Front Office Setup' },
        ],
      },
    ],
  },
];

