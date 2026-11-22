export type SaleUnit = 'piece' | 'strip' | 'box';

export interface BranchStockItem {
  branchId: string;
  branchName: string;
  shortName: string;
  city: string;
  zone: string;
  rackLocation: string;
  currentStock: number; // in pieces
  reorderLevel: number; // in pieces
  maxStock: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export interface BatchItem {
  id: string;
  batchNo: string;
  expiryDate: string;
  qtyPcs: number;
  location: string;
}

export interface MedicineItem {
  id: string;
  code: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  category: string;
  centralStock: number; // in pieces
  unitPrice: number; // MRP per piece
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
  units_per_strip: number;
  units_per_box: number;
  branches: BranchStockItem[];
  batches?: BatchItem[];
}

export const HOSPITAL_10_BRANCHES = [
  { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackPrefix: 'Rack A' },
  { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackPrefix: 'Rack B' },
  { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackPrefix: 'Rack M' },
  { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackPrefix: 'Rack G' },
  { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackPrefix: 'Rack OD' },
  { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackPrefix: 'Rack CT' },
  { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackPrefix: 'Rack SY' },
  { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackPrefix: 'Rack KH' },
  { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackPrefix: 'Rack RJ' },
  { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackPrefix: 'Rack BR' },
];

function generateBranchStocks(
  baseMin: number,
  isCritical: boolean = false,
  isLow: boolean = false
): BranchStockItem[] {
  return HOSPITAL_10_BRANCHES.map((b, idx) => {
    const min = Math.round(baseMin * (0.6 + (idx % 5) * 0.15));
    const max = min * 3;
    let qty = Math.round(min * 1.5);

    if (isCritical && idx === 0) {
      qty = 0;
    } else if (isCritical && idx < 3) {
      qty = Math.round(min * 0.25);
    } else if (isLow && idx < 3) {
      qty = Math.round(min * 0.7);
    } else if (idx % 4 === 0 && !isCritical) {
      qty = Math.round(min * 0.85); // slight low stock for variety
    }

    let status: 'In Stock' | 'Low Stock' | 'Critical' = 'In Stock';
    if (qty <= min * 0.4) status = 'Critical';
    else if (qty <= min) status = 'Low Stock';

    return {
      branchId: b.branchId,
      branchName: b.branchName,
      shortName: b.shortName,
      city: b.city,
      zone: b.zone,
      rackLocation: `${b.rackPrefix}-0${(idx % 4) + 1}, Bin ${(idx % 3) + 1}`,
      currentStock: qty,
      reorderLevel: min,
      maxStock: max,
      status,
    };
  });
}

function calcMedStatus(branches: BranchStockItem[], central: number, minLvl: number): 'In Stock' | 'Low Stock' | 'Critical' {
  const total = central + branches.reduce((acc, b) => acc + b.currentStock, 0);
  if (total <= minLvl * 0.4 || total === 0) return 'Critical';
  if (branches.some((b) => b.status === 'Critical')) return 'Critical';
  if (branches.some((b) => b.status === 'Low Stock') || total <= minLvl) return 'Low Stock';
  return 'In Stock';
}

function buildMed(
  id: string,
  code: string,
  brandName: string,
  genericName: string,
  dosageForm: string,
  strength: string,
  manufacturer: string,
  category: string,
  centralStock: number,
  unitPrice: number,
  reorderLevel: number,
  units_per_strip: number,
  units_per_box: number,
  isCritical: boolean = false,
  isLow: boolean = false
): MedicineItem {
  const branches = generateBranchStocks(Math.round(reorderLevel / 10), isCritical, isLow);
  const status = calcMedStatus(branches, centralStock, reorderLevel);
  return {
    id,
    code,
    brandName,
    genericName,
    dosageForm,
    strength,
    manufacturer,
    category,
    centralStock,
    unitPrice,
    reorderLevel,
    status,
    units_per_strip,
    units_per_box,
    branches,
    batches: [
      { id: `${id}-B1`, batchNo: `B-${code}-24A`, expiryDate: '2027-04-15', qtyPcs: Math.round(centralStock * 0.6), location: 'Central Depot - Bay 1' },
      { id: `${id}-B2`, batchNo: `B-${code}-24B`, expiryDate: '2026-12-28', qtyPcs: Math.round(centralStock * 0.4), location: 'Central Depot - Bay 3' },
    ],
  };
}

export const PHARMACIST_INVENTORY_MASTER: MedicineItem[] = [
  // Analgesics & Antipyretics
  buildMed('MED-101', 'PAR-EXTRA', 'Napa Extra', 'Paracetamol + Caffeine', 'Tablet', '500mg+65mg', 'Beximco Pharmaceuticals', 'Analgesics', 14500, 3.5, 3000, 10, 200),
  buildMed('MED-102', 'ACE-PLUS', 'Ace Plus', 'Paracetamol + Caffeine', 'Tablet', '500mg+65mg', 'Square Pharmaceuticals', 'Analgesics', 12200, 3.5, 2500, 10, 200),
  buildMed('MED-103', 'PAR-FAST', 'Fast', 'Paracetamol', 'Tablet', '500mg', 'ACME Laboratories', 'Analgesics', 8400, 1.5, 2000, 10, 200),
  buildMed('MED-104', 'TORAX-10', 'Torax 10', 'Ketorolac Tromethamine', 'Tablet', '10mg', 'Square Pharmaceuticals', 'Analgesics', 3200, 12.0, 800, 10, 100),
  buildMed('MED-105', 'D-DOL-50', 'D-Dol', 'Diclofenac Sodium', 'Tablet', '50mg', 'Eskayef Pharmaceuticals', 'Analgesics', 4500, 4.0, 1000, 10, 100),
  buildMed('MED-106', 'CLOF-100', 'Clofenac SR', 'Diclofenac Sodium', 'Capsule', '100mg', 'Square Pharmaceuticals', 'Analgesics', 2800, 8.5, 600, 10, 100),
  buildMed('MED-107', 'NAPA-RAP', 'Napa Rapid', 'Paracetamol (Rapid Act)', 'Tablet', '500mg', 'Beximco Pharmaceuticals', 'Analgesics', 9800, 2.5, 1800, 10, 200),

  // Gastrointestinal
  buildMed('MED-108', 'MAX-20', 'Maxpro 20', 'Esomeprazole Magnesium', 'Capsule', '20mg', 'Renata Limited', 'Gastrointestinal', 11400, 9.0, 2200, 14, 70),
  buildMed('MED-109', 'MAX-40', 'Maxpro 40', 'Esomeprazole Magnesium', 'Capsule', '40mg', 'Renata Limited', 'Gastrointestinal', 6200, 14.0, 1200, 14, 70),
  buildMed('MED-110', 'SER-20', 'Sergel 20', 'Esomeprazole', 'Capsule', '20mg', 'Healthcare Pharma', 'Gastrointestinal', 8900, 8.0, 1800, 14, 70),
  buildMed('MED-111', 'SEC-20', 'Seclo 20', 'Omeprazole', 'Capsule', '20mg', 'Square Pharmaceuticals', 'Gastrointestinal', 13500, 6.0, 2500, 10, 100),
  buildMed('MED-112', 'PAN-20', 'Pantonix 20', 'Pantoprazole', 'Tablet', '20mg', 'Incepta Pharmaceuticals', 'Gastrointestinal', 7800, 7.5, 1500, 10, 100),
  buildMed('MED-113', 'PAN-40', 'Pantonix 40', 'Pantoprazole', 'Tablet', '40mg', 'Incepta Pharmaceuticals', 'Gastrointestinal', 5400, 12.0, 1000, 10, 100),
  buildMed('MED-114', 'FIN-20', 'Finix 20', 'Rabeprazole Sodium', 'Tablet', '20mg', 'Opsonin Pharma', 'Gastrointestinal', 4600, 8.5, 900, 10, 100),
  buildMed('MED-115', 'ENT-DS', 'Entacyd Plus', 'Magaldrate + Simethicone', 'Suspension', '200ml', 'Square Pharmaceuticals', 'Gastrointestinal', 950, 110.0, 200, 1, 24),

  // Antibiotics & Anti-Infectives
  buildMed('MED-116', 'CEF-1G', 'Ceftron 1g IV', 'Ceftriaxone Sodium', 'Injection', '1g Vial', 'Square Pharmaceuticals', 'Antibiotics', 1850, 165.0, 500, 1, 10, false, true),
  buildMed('MED-117', 'MOX-625', 'Moxaclav 625', 'Amoxicillin + Clavulanic', 'Tablet', '625mg', 'Square Pharmaceuticals', 'Antibiotics', 3800, 32.0, 800, 6, 36),
  buildMed('MED-118', 'CIP-500', 'Ciprocin 500', 'Ciprofloxacin', 'Tablet', '500mg', 'Square Pharmaceuticals', 'Antibiotics', 5200, 15.0, 1000, 10, 100),
  buildMed('MED-119', 'ZITH-500', 'Zithrox 500', 'Azithromycin', 'Tablet', '500mg', 'Square Pharmaceuticals', 'Antibiotics', 4100, 38.0, 900, 6, 18),
  buildMed('MED-120', 'FIM-500', 'Fimoxyl 500', 'Amoxicillin Trihydrate', 'Capsule', '500mg', 'Beximco Pharmaceuticals', 'Antibiotics', 6700, 7.5, 1200, 10, 100),
  buildMed('MED-121', 'MER-1G', 'Meronem 1g IV', 'Meropenem Trihydrate', 'Injection', '1g Vial', 'AstraZeneca / Radiant', 'Antibiotics', 240, 980.0, 150, 1, 10, true, false),
  buildMed('MED-122', 'CEF3-200', 'Cef-3 200', 'Cefixime Trihydrate', 'Capsule', '200mg', 'Square Pharmaceuticals', 'Antibiotics', 3100, 42.0, 600, 7, 28),
  buildMed('MED-123', 'AVE-400', 'Avelox 400', 'Moxifloxacin HCl', 'Tablet', '400mg', 'Bayer / Square', 'Antibiotics', 850, 85.0, 250, 5, 20),
  buildMed('MED-124', 'FLA-400', 'Filmet 400', 'Metronidazole', 'Tablet', '400mg', 'Square Pharmaceuticals', 'Antibiotics', 7500, 2.2, 1500, 10, 200),

  // Cardiovascular & Antihypertensives
  buildMed('MED-125', 'BIZ-5-20', 'Bizoran 5/20', 'Amlodipine + Olmesartan', 'Tablet', '5mg+20mg', 'Square Pharmaceuticals', 'Cardiovascular', 4800, 12.0, 900, 10, 30),
  buildMed('MED-126', 'OLM-20', 'Olmesartan 20', 'Olmesartan Medoxomil', 'Tablet', '20mg', 'Beximco Pharmaceuticals', 'Cardiovascular', 5200, 9.5, 1000, 10, 30),
  buildMed('MED-127', 'ANG-50', 'Angilock 50', 'Losartan Potassium', 'Tablet', '50mg', 'Square Pharmaceuticals', 'Cardiovascular', 7200, 8.0, 1400, 10, 50),
  buildMed('MED-128', 'CAR-30', 'Cardizem 30', 'Diltiazem HCl', 'Tablet', '30mg', 'Square Pharmaceuticals', 'Cardiovascular', 3400, 4.5, 600, 10, 100),
  buildMed('MED-129', 'NEB-5', 'Nebita 5', 'Nebivolol HCl', 'Tablet', '5mg', 'Square Pharmaceuticals', 'Cardiovascular', 2900, 14.0, 500, 10, 30),
  buildMed('MED-130', 'ROS-10', 'Rosuva 10', 'Rosuvastatin Calcium', 'Tablet', '10mg', 'Square Pharmaceuticals', 'Cardiovascular', 6100, 22.0, 1100, 10, 30),
  buildMed('MED-131', 'ATOR-10', 'Atova 10', 'Atorvastatin Calcium', 'Tablet', '10mg', 'Beximco Pharmaceuticals', 'Cardiovascular', 8300, 16.0, 1500, 10, 30),
  buildMed('MED-132', 'CLO-75', 'Anclog 75', 'Clopidogrel Bisulfate', 'Tablet', '75mg', 'Square Pharmaceuticals', 'Cardiovascular', 5900, 13.0, 1000, 10, 30),

  // Antidiabetics
  buildMed('MED-133', 'GLU-500', 'Comet 500', 'Metformin HCl', 'Tablet', '500mg', 'Square Pharmaceuticals', 'Antidiabetic', 14200, 4.0, 2500, 10, 100),
  buildMed('MED-134', 'GLU-850', 'Comet 850', 'Metformin HCl', 'Tablet', '850mg', 'Square Pharmaceuticals', 'Antidiabetic', 9800, 6.0, 1800, 10, 100),
  buildMed('MED-135', 'LIN-5', 'Linaglip 5', 'Linagliptin', 'Tablet', '5mg', 'Square Pharmaceuticals', 'Antidiabetic', 4400, 18.0, 800, 10, 30),
  buildMed('MED-136', 'JAN-50', 'Januvia 50', 'Sitagliptin Phosphate', 'Tablet', '50mg', 'MSD / Square', 'Antidiabetic', 1600, 48.0, 400, 14, 28),
  buildMed('MED-137', 'LAN-100', 'Lantus SoloStar', 'Insulin Glargine', 'Injection Pen', '100IU/ml (3ml)', 'Sanofi Bangladesh', 'Antidiabetic', 290, 850.0, 100, 1, 5, false, true),
  buildMed('MED-138', 'NOV-100', 'NovoMix 30 FlexPen', 'Biphasic Insulin Aspart', 'Injection Pen', '100IU/ml (3ml)', 'Novo Nordisk', 'Antidiabetic', 310, 890.0, 100, 1, 5),

  // Respiratory & Antiasthma
  buildMed('MED-139', 'MON-10', 'Monas 10', 'Montelukast Sodium', 'Tablet', '10mg', 'Acme Laboratories', 'Respiratory', 9400, 16.0, 1800, 10, 30),
  buildMed('MED-140', 'MON-5', 'Monas 5 Chewable', 'Montelukast Sodium', 'Tablet', '5mg', 'Acme Laboratories', 'Respiratory', 5800, 10.0, 1000, 10, 30),
  buildMed('MED-141', 'BEX-100', 'Bexitrol-F Inhaler', 'Salmeterol + Fluticasone', 'Inhaler', '25/125mcg', 'Beximco Pharmaceuticals', 'Respiratory', 620, 420.0, 150, 1, 10),
  buildMed('MED-142', 'WIN-SYR', 'Windelix Syrup', 'Salbutamol + Guaifenesin', 'Syrup', '100ml', 'Square Pharmaceuticals', 'Respiratory', 1400, 45.0, 300, 1, 24),
];
