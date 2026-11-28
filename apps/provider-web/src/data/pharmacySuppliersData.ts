export interface PharmacySupplier {
  id: string;
  name: string; // Company / Supplier Name
  code: string; // Short code / ticker (e.g., SQUARE, BEXIMCO)
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  drugLicense: string;
  tradeLicense: string;
  paymentTerms: string;
  category: string;
  status: 'Active' | 'Inactive';
  ordersCount: number;
}

export const INITIAL_PHARMACY_SUPPLIERS: PharmacySupplier[] = [
  {
    id: 'SUP-01',
    name: 'Square Pharmaceuticals Ltd.',
    code: 'SQUARE',
    contactPerson: 'Md. Kamrul Islam',
    phone: '+880 1711-223344',
    email: 'orders@squarepharma.com.bd',
    address: 'Square Centre, 48 Mohakhali C/A, Dhaka-1212',
    drugLicense: 'DL-DH-1002',
    tradeLicense: 'TR-88219',
    paymentTerms: 'Net 30 Days',
    category: 'Allopathic / Oral & Injectables',
    status: 'Active',
    ordersCount: 42,
  },
  {
    id: 'SUP-02',
    name: 'Beximco Pharmaceuticals Ltd.',
    code: 'BEXIMCO',
    contactPerson: 'Farhan Ahmed',
    phone: '+880 1712-334455',
    email: 'sales@beximcopharma.com',
    address: '17 Dhanmondi R/A, Road No. 2, Dhaka-1205',
    drugLicense: 'DL-DH-1003',
    tradeLicense: 'TR-88220',
    paymentTerms: 'Net 30 Days',
    category: 'Allopathic / High Potency & Inhalers',
    status: 'Active',
    ordersCount: 38,
  },
  {
    id: 'SUP-03',
    name: 'Incepta Pharmaceuticals Ltd.',
    code: 'INCEPTA',
    contactPerson: 'Dr. Tariq Mahmud',
    phone: '+880 1713-445566',
    email: 'institutional@inceptapharma.com',
    address: '40 Shahid Tajuddin Ahmed Sarani, Tejgaon I/A, Dhaka-1208',
    drugLicense: 'DL-DH-1004',
    tradeLicense: 'TR-88221',
    paymentTerms: 'Net 45 Days',
    category: 'Biologics, Vaccines & Cephalosporins',
    status: 'Active',
    ordersCount: 29,
  },
  {
    id: 'SUP-04',
    name: 'Renata Limited',
    code: 'RENATA',
    contactPerson: 'SM Kabir',
    phone: '+880 1714-556677',
    email: 'supply@renata-ltd.com',
    address: 'Plot # 1, Milk Vita Road, Section-7, Mirpur, Dhaka-1216',
    drugLicense: 'DL-DH-1005',
    tradeLicense: 'TR-88222',
    paymentTerms: 'Net 30 Days',
    category: 'Hormones, Steroids & Critical Care',
    status: 'Active',
    ordersCount: 21,
  },
  {
    id: 'SUP-05',
    name: 'Acme Laboratories Ltd.',
    code: 'ACME',
    contactPerson: 'Zahidul Hassan',
    phone: '+880 1715-667788',
    email: 'orders@acmelab.com',
    address: '1/4 Kallayanpur, Mirpur Road, Dhaka-1207',
    drugLicense: 'DL-DH-1006',
    tradeLicense: 'TR-88223',
    paymentTerms: 'Net 30 Days',
    category: 'Infusions, Antibiotics & Oral Solids',
    status: 'Active',
    ordersCount: 18,
  },
  {
    id: 'SUP-06',
    name: 'Eskayef Pharmaceuticals Ltd.',
    code: 'SKF',
    contactPerson: 'M. Rahman',
    phone: '+880 1716-778899',
    email: 'info@skfbd.com',
    address: 'Transcom Bhaban, 52 Motijheel C/A, Dhaka-1000',
    drugLicense: 'DL-DH-1007',
    tradeLicense: 'TR-88224',
    paymentTerms: 'Net 30 Days',
    category: 'Ophthalmic, Oncology & Injectables',
    status: 'Active',
    ordersCount: 15,
  },
  {
    id: 'SUP-07',
    name: 'Opsonin Pharma Ltd.',
    code: 'OPSONIN',
    contactPerson: 'Shah Alam',
    phone: '+880 1717-889900',
    email: 'orders@opsonin.com.bd',
    address: '30 New Eskaton Road, Dhaka-1000',
    drugLicense: 'DL-DH-1008',
    tradeLicense: 'TR-88225',
    paymentTerms: 'Net 30 Days',
    category: 'General Finished Formulations',
    status: 'Active',
    ordersCount: 12,
  },
  {
    id: 'SUP-08',
    name: 'Aristopharma Ltd.',
    code: 'ARISTO',
    contactPerson: 'Nurul Amin',
    phone: '+880 1718-990011',
    email: 'sales@aristopharma.com',
    address: '7 Purana Paltan Line, Dhaka-1000',
    drugLicense: 'DL-DH-1009',
    tradeLicense: 'TR-88226',
    paymentTerms: 'Net 30 Days',
    category: 'Cardiovascular, Anti-ulcerants & NSAIDs',
    status: 'Active',
    ordersCount: 11,
  },
  {
    id: 'SUP-09',
    name: 'Healthcare Pharmaceuticals Ltd.',
    code: 'HEALTHCARE',
    contactPerson: 'Tanvir Hossain',
    phone: '+880 1719-112233',
    email: 'supplies@hpl.com.bd',
    address: 'Nasir Trade Centre, 9-11 Bir Uttam CR Datta Road, Dhaka-1205',
    drugLicense: 'DL-DH-1010',
    tradeLicense: 'TR-88227',
    paymentTerms: 'Net 30 Days',
    category: 'Specialty Formulations & Derma',
    status: 'Active',
    ordersCount: 16,
  },
  {
    id: 'SUP-10',
    name: 'Sanofi Bangladesh Ltd.',
    code: 'SANOFI',
    contactPerson: 'Mahmudul Haque',
    phone: '+880 1720-223344',
    email: 'institutional@sanofi.com.bd',
    address: '6/2/A Segun Bagicha, Dhaka-1000',
    drugLicense: 'DL-DH-1011',
    tradeLicense: 'TR-88228',
    paymentTerms: 'Advance LC 100%',
    category: 'Insulins, Vaccines & Critical Therapeutics',
    status: 'Active',
    ordersCount: 8,
  },
  {
    id: 'SUP-11',
    name: 'Popular Pharmaceuticals Ltd.',
    code: 'POPULAR',
    contactPerson: 'Engr. Masud Rana',
    phone: '+880 1721-334455',
    email: 'institutional@popular-pharma.com',
    address: 'Sheltech Astral, 29 Kemal Ataturk Avenue, Banani, Dhaka-1213',
    drugLicense: 'DL-DH-1012',
    tradeLicense: 'TR-88229',
    paymentTerms: 'Net 30 Days',
    category: 'Antibiotics, IV Infusions & Anesthetics',
    status: 'Active',
    ordersCount: 9,
  },
  {
    id: 'SUP-12',
    name: 'ACI Limited (Pharmaceuticals)',
    code: 'ACI',
    contactPerson: 'Rezaul Karim',
    phone: '+880 1722-445566',
    email: 'pharma.sales@aci-bd.com',
    address: 'ACI Centre, 245 Tejgaon Industrial Area, Dhaka-1208',
    drugLicense: 'DL-DH-1013',
    tradeLicense: 'TR-88230',
    paymentTerms: 'Net 30 Days',
    category: 'Respiratory, Antibacterial & Antidiabetic',
    status: 'Active',
    ordersCount: 14,
  },
];

const LOCAL_STORAGE_KEY = 'pharmacy_suppliers_list';

export function getStoredSuppliers(): PharmacySupplier[] {
  if (typeof window === 'undefined') return INITIAL_PHARMACY_SUPPLIERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_PHARMACY_SUPPLIERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse stored suppliers', e);
  }
  return INITIAL_PHARMACY_SUPPLIERS;
}

export function saveStoredSuppliers(suppliers: PharmacySupplier[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(suppliers));
  } catch (e) {
    console.error('Failed to save suppliers to localStorage', e);
  }
}

export function addSupplier(newSupplier: Omit<PharmacySupplier, 'id' | 'ordersCount'>): PharmacySupplier {
  const current = getStoredSuppliers();
  const id = `SUP-${String(current.length + 1).padStart(2, '0')}`;
  const record: PharmacySupplier = {
    ...newSupplier,
    id,
    ordersCount: 0,
  };
  const updated = [record, ...current];
  saveStoredSuppliers(updated);
  return record;
}

