import React, { useMemo, useState } from 'react';
import {
  ArrowRightLeft,
  ArrowUpRight,
  Boxes,
  Building2,
  Check,
  CheckCircle2,
  Download,
  Filter,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Truck,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { PageHeader } from '../common/PageHeader';

export type SaleUnit = 'piece' | 'strip' | 'box';

interface BranchStockItem {
  branchId: string;
  branchName: string;
  shortName: string;
  city: string;
  zone: string;
  rackLocation: string;
  currentStock: number; // always stored in individual pieces (canonical base unit)
  reorderLevel: number; // in pieces
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

interface MedicineItem {
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
}

// Helper to format stock quantities across Pc, Strip, Box
function formatStockQuantity(
  totalPieces: number,
  unit: SaleUnit,
  unitsPerStrip: number,
  unitsPerBox: number
): { primary: string; secondary: string } {
  if (unit === 'box' && unitsPerBox > 1) {
    const boxes = (totalPieces / unitsPerBox).toFixed(1).replace('.0', '');
    const wholeBoxes = Math.floor(totalPieces / unitsPerBox);
    const remPcs = totalPieces % unitsPerBox;
    const strips = unitsPerStrip > 1 ? Math.floor(remPcs / unitsPerStrip) : 0;
    const loose = unitsPerStrip > 1 ? remPcs % unitsPerStrip : remPcs;

    let detail = `${wholeBoxes} bxs`;
    if (strips > 0) detail += ` • ${strips} str`;
    if (loose > 0) detail += ` • ${loose} pcs`;
    detail += ` (${totalPieces.toLocaleString()} pcs)`;

    return {
      primary: `${boxes} Box${parseFloat(boxes) !== 1 ? 'es' : ''}`,
      secondary: detail,
    };
  }

  if (unit === 'strip' && unitsPerStrip > 1) {
    const strips = (totalPieces / unitsPerStrip).toFixed(1).replace('.0', '');
    const wholeStrips = Math.floor(totalPieces / unitsPerStrip);
    const remPcs = totalPieces % unitsPerStrip;

    let detail = `${wholeStrips} str`;
    if (remPcs > 0) detail += ` + ${remPcs} pcs`;
    detail += ` (${totalPieces.toLocaleString()} pcs)`;

    return {
      primary: `${strips} Strip${parseFloat(strips) !== 1 ? 's' : ''}`,
      secondary: detail,
    };
  }

  // piece
  const wholeBoxes = unitsPerBox > 1 ? Math.floor(totalPieces / unitsPerBox) : 0;
  const remPcs = unitsPerBox > 1 ? totalPieces % unitsPerBox : totalPieces;
  const strips = unitsPerStrip > 1 ? Math.floor(remPcs / unitsPerStrip) : 0;

  let detail = '';
  if (wholeBoxes > 0) detail += `${wholeBoxes} bxs`;
  if (strips > 0) detail += `${detail ? ' • ' : ''}${strips} str`;

  return {
    primary: `${totalPieces.toLocaleString()} Pcs`,
    secondary: detail || `${totalPieces.toLocaleString()} units`,
  };
}

// Packaging Unit Switcher (Piece / Strip / Box) - Matching POS design
interface PackagingUnitSwitcherProps {
  unitsPerStrip: number;
  unitsPerBox: number;
  activeUnit: SaleUnit;
  onChange: (u: SaleUnit) => void;
}

const PackagingUnitSwitcher: React.FC<PackagingUnitSwitcherProps> = ({
  unitsPerStrip,
  unitsPerBox,
  activeUnit,
  onChange,
}) => {
  const units: SaleUnit[] = ['piece', 'strip', 'box'];
  const availableUnits = units.filter(
    (u) =>
      u === 'piece' ||
      (u === 'strip' && unitsPerStrip > 1) ||
      (u === 'box' && unitsPerBox > 1)
  );

  return (
    <div className="inline-flex items-center rounded-[3px] border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs">
      {availableUnits.map((u) => {
        const active = activeUnit === u;
        const label =
          u === 'piece'
            ? 'Pc'
            : u === 'strip'
              ? `Strip (${unitsPerStrip})`
              : `Box (${unitsPerBox})`;

        return (
          <button
            key={u}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(u);
            }}
            className={`px-2 py-0.5 text-xs font-semibold transition-colors cursor-pointer ${
              active
                ? 'bg-[#006a4e] text-white font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: 'MED-101',
    code: 'PAR-EXTRA',
    brandName: 'Napa Extra',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Tablet',
    strength: '500mg + 65mg',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    category: 'Analgesics',
    centralStock: 12500,
    unitPrice: 3.5,
    reorderLevel: 1000,
    status: 'In Stock',
    units_per_strip: 10,
    units_per_box: 200,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Rack A-12, Bin 1', currentStock: 1400, reorderLevel: 300, status: 'In Stock' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Rack B-04, Bin 2', currentStock: 850, reorderLevel: 250, status: 'In Stock' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Rack M-01, Bin 4', currentStock: 620, reorderLevel: 200, status: 'In Stock' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Rack G-02, Bin 1', currentStock: 480, reorderLevel: 150, status: 'In Stock' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Rack OD-05, Bin 3', currentStock: 390, reorderLevel: 150, status: 'In Stock' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Rack CT-03, Bin 2', currentStock: 520, reorderLevel: 180, status: 'In Stock' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Rack SY-01, Bin 1', currentStock: 280, reorderLevel: 120, status: 'In Stock' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Rack KH-02, Bin 4', currentStock: 210, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Rack RJ-01, Bin 2', currentStock: 190, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Rack BR-04, Bin 1', currentStock: 140, reorderLevel: 80, status: 'In Stock' },
    ],
  },
  {
    id: 'MED-102',
    code: 'ESO-MAX',
    brandName: 'Maxpro',
    genericName: 'Esomeprazole Magnesium',
    dosageForm: 'Capsule',
    strength: '20mg',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    category: 'Gastrointestinal',
    centralStock: 8400,
    unitPrice: 9.0,
    reorderLevel: 800,
    status: 'In Stock',
    units_per_strip: 10,
    units_per_box: 100,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Rack A-08, Bin 3', currentStock: 920, reorderLevel: 250, status: 'In Stock' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Rack B-02, Bin 1', currentStock: 480, reorderLevel: 200, status: 'In Stock' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Rack M-02, Bin 2', currentStock: 310, reorderLevel: 150, status: 'In Stock' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Rack G-01, Bin 4', currentStock: 290, reorderLevel: 120, status: 'In Stock' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Rack OD-02, Bin 1', currentStock: 220, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Rack CT-01, Bin 3', currentStock: 340, reorderLevel: 120, status: 'In Stock' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Rack SY-03, Bin 2', currentStock: 190, reorderLevel: 80, status: 'In Stock' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Rack KH-01, Bin 1', currentStock: 140, reorderLevel: 80, status: 'In Stock' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Rack RJ-03, Bin 4', currentStock: 110, reorderLevel: 60, status: 'In Stock' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Rack BR-02, Bin 2', currentStock: 95, reorderLevel: 50, status: 'In Stock' },
    ],
  },
  {
    id: 'MED-103',
    code: 'CEF-1G',
    brandName: 'Ceftron 1g IV/IM',
    genericName: 'Ceftriaxone Sodium',
    dosageForm: 'Injection (Vial)',
    strength: '1g',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    category: 'Antibiotics',
    centralStock: 140,
    unitPrice: 195.0,
    reorderLevel: 300,
    status: 'Critical',
    units_per_strip: 1,
    units_per_box: 10,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Cold Safe CS-1', currentStock: 25, reorderLevel: 50, status: 'Critical' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Cold Safe CS-2', currentStock: 15, reorderLevel: 30, status: 'Critical' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Cold Safe CS-1', currentStock: 10, reorderLevel: 25, status: 'Critical' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Cold Safe CS-3', currentStock: 12, reorderLevel: 20, status: 'Critical' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Cold Safe CS-1', currentStock: 8, reorderLevel: 20, status: 'Critical' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Cold Safe CS-2', currentStock: 18, reorderLevel: 30, status: 'Critical' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Cold Safe CS-1', currentStock: 6, reorderLevel: 15, status: 'Critical' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Cold Safe CS-1', currentStock: 4, reorderLevel: 15, status: 'Critical' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Cold Safe CS-2', currentStock: 5, reorderLevel: 15, status: 'Critical' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Cold Safe CS-1', currentStock: 2, reorderLevel: 15, status: 'Critical' },
    ],
  },
  {
    id: 'MED-104',
    code: 'MER-1G',
    brandName: 'Meronem 1g IV',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Injection (Vial)',
    strength: '1g',
    manufacturer: 'Incepta Pharmaceuticals',
    category: 'Antibiotics',
    centralStock: 320,
    unitPrice: 1100.0,
    reorderLevel: 150,
    status: 'In Stock',
    units_per_strip: 1,
    units_per_box: 10,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Cold Safe CS-4', currentStock: 45, reorderLevel: 20, status: 'In Stock' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Cold Safe CS-4', currentStock: 30, reorderLevel: 15, status: 'In Stock' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Cold Safe CS-2', currentStock: 20, reorderLevel: 15, status: 'In Stock' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Cold Safe CS-1', currentStock: 28, reorderLevel: 15, status: 'In Stock' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Cold Safe CS-3', currentStock: 16, reorderLevel: 10, status: 'In Stock' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Cold Safe CS-3', currentStock: 22, reorderLevel: 12, status: 'In Stock' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Cold Safe CS-2', currentStock: 14, reorderLevel: 10, status: 'In Stock' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Cold Safe CS-2', currentStock: 12, reorderLevel: 8, status: 'In Stock' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Cold Safe CS-1', currentStock: 10, reorderLevel: 8, status: 'In Stock' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Cold Safe CS-1', currentStock: 8, reorderLevel: 6, status: 'In Stock' },
    ],
  },
  {
    id: 'MED-105',
    code: 'MON-10',
    brandName: 'Monas 10mg',
    genericName: 'Montelukast Sodium',
    dosageForm: 'Chewable Tab',
    strength: '10mg',
    manufacturer: 'Acme Laboratories Ltd.',
    category: 'Respiratory',
    centralStock: 2100,
    unitPrice: 17.0,
    reorderLevel: 400,
    status: 'Low Stock',
    units_per_strip: 10,
    units_per_box: 30,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Rack C-02, Bin 1', currentStock: 180, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Rack C-01, Bin 3', currentStock: 90, reorderLevel: 100, status: 'Low Stock' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Rack C-04, Bin 2', currentStock: 40, reorderLevel: 80, status: 'Critical' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Rack C-03, Bin 1', currentStock: 110, reorderLevel: 80, status: 'In Stock' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Rack C-02, Bin 4', currentStock: 65, reorderLevel: 70, status: 'Low Stock' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Rack C-05, Bin 2', currentStock: 80, reorderLevel: 90, status: 'Low Stock' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Rack C-01, Bin 1', currentStock: 30, reorderLevel: 50, status: 'Critical' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Rack C-02, Bin 2', currentStock: 45, reorderLevel: 50, status: 'Low Stock' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Rack C-03, Bin 3', currentStock: 50, reorderLevel: 50, status: 'Low Stock' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Rack C-01, Bin 4', currentStock: 25, reorderLevel: 40, status: 'Critical' },
    ],
  },
  {
    id: 'MED-106',
    code: 'CLO-75',
    brandName: 'Plagrin 75mg',
    genericName: 'Clopidogrel Bisulfate',
    dosageForm: 'Tablet',
    strength: '75mg',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    category: 'Cardiovascular',
    centralStock: 4600,
    unitPrice: 14.0,
    reorderLevel: 500,
    status: 'In Stock',
    units_per_strip: 10,
    units_per_box: 30,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Rack D-01, Bin 2', currentStock: 540, reorderLevel: 150, status: 'In Stock' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Rack D-02, Bin 1', currentStock: 320, reorderLevel: 120, status: 'In Stock' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Rack D-01, Bin 4', currentStock: 210, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Rack D-03, Bin 2', currentStock: 260, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Rack D-02, Bin 3', currentStock: 180, reorderLevel: 80, status: 'In Stock' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Rack D-04, Bin 1', currentStock: 240, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Rack D-01, Bin 1', currentStock: 150, reorderLevel: 70, status: 'In Stock' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Rack D-02, Bin 2', currentStock: 120, reorderLevel: 60, status: 'In Stock' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Rack D-03, Bin 1', currentStock: 95, reorderLevel: 50, status: 'In Stock' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Rack D-01, Bin 3', currentStock: 80, reorderLevel: 40, status: 'In Stock' },
    ],
  },
  {
    id: 'MED-107',
    code: 'AZI-500',
    brandName: 'Azithrocin 500mg',
    genericName: 'Azithromycin Dihydrate',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    category: 'Antibiotics',
    centralStock: 3800,
    unitPrice: 35.0,
    reorderLevel: 400,
    status: 'In Stock',
    units_per_strip: 6,
    units_per_box: 18,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Rack B-06, Bin 1', currentStock: 410, reorderLevel: 120, status: 'In Stock' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Rack B-03, Bin 2', currentStock: 290, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Rack B-05, Bin 4', currentStock: 180, reorderLevel: 80, status: 'In Stock' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Rack B-01, Bin 3', currentStock: 210, reorderLevel: 80, status: 'In Stock' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Rack B-04, Bin 2', currentStock: 140, reorderLevel: 60, status: 'In Stock' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Rack B-07, Bin 1', currentStock: 220, reorderLevel: 80, status: 'In Stock' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Rack B-02, Bin 2', currentStock: 110, reorderLevel: 50, status: 'In Stock' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Rack B-03, Bin 1', currentStock: 95, reorderLevel: 50, status: 'In Stock' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Rack B-01, Bin 2', currentStock: 80, reorderLevel: 40, status: 'In Stock' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Rack B-05, Bin 1', currentStock: 65, reorderLevel: 40, status: 'In Stock' },
    ],
  },
  {
    id: 'MED-108',
    code: 'SER-20',
    brandName: 'Sergel 20mg',
    genericName: 'Esomeprazole Trihydrate',
    dosageForm: 'Capsule',
    strength: '20mg',
    manufacturer: 'Healthcare Pharmaceuticals Ltd.',
    category: 'Gastrointestinal',
    centralStock: 6200,
    unitPrice: 8.0,
    reorderLevel: 600,
    status: 'In Stock',
    units_per_strip: 14,
    units_per_box: 70,
    branches: [
      { branchId: 'br-1', branchName: 'Green Hospital Central (Dhanmondi)', shortName: 'Dhanmondi Central', city: 'Dhaka', zone: 'South Zone Flagship', rackLocation: 'Rack A-05, Bin 2', currentStock: 740, reorderLevel: 200, status: 'In Stock' },
      { branchId: 'br-2', branchName: 'Green Hospital North (Uttara)', shortName: 'Uttara Hub', city: 'Dhaka', zone: 'North Zone Hub', rackLocation: 'Rack B-01, Bin 4', currentStock: 510, reorderLevel: 150, status: 'In Stock' },
      { branchId: 'br-3', branchName: 'Green Hospital West (Mirpur)', shortName: 'Mirpur Center', city: 'Dhaka', zone: 'West Zone Specialized', rackLocation: 'Rack M-03, Bin 1', currentStock: 330, reorderLevel: 120, status: 'In Stock' },
      { branchId: 'br-4', branchName: 'Green Hospital East (Gulshan)', shortName: 'Gulshan Executive', city: 'Dhaka', zone: 'East Zone Care', rackLocation: 'Rack G-04, Bin 2', currentStock: 380, reorderLevel: 120, status: 'In Stock' },
      { branchId: 'br-5', branchName: 'Green Hospital Heritage (Old Dhaka)', shortName: 'Old Dhaka Care', city: 'Dhaka', zone: 'Central Zone', rackLocation: 'Rack OD-01, Bin 3', currentStock: 250, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-6', branchName: 'Green Hospital Port City (Chattogram)', shortName: 'Chattogram Hub', city: 'Chattogram', zone: 'Eastern Regional', rackLocation: 'Rack CT-02, Bin 1', currentStock: 310, reorderLevel: 100, status: 'In Stock' },
      { branchId: 'br-7', branchName: 'Green Hospital Campus (Sylhet)', shortName: 'Sylhet Campus', city: 'Sylhet', zone: 'North-East Center', rackLocation: 'Rack SY-02, Bin 3', currentStock: 160, reorderLevel: 70, status: 'In Stock' },
      { branchId: 'br-8', branchName: 'Green Hospital Specialized (Khulna)', shortName: 'Khulna Center', city: 'Khulna', zone: 'South-West Hub', rackLocation: 'Rack KH-03, Bin 2', currentStock: 130, reorderLevel: 60, status: 'In Stock' },
      { branchId: 'br-9', branchName: 'Green Hospital Padma (Rajshahi)', shortName: 'Rajshahi Wing', city: 'Rajshahi', zone: 'North-West Care', rackLocation: 'Rack RJ-02, Bin 1', currentStock: 115, reorderLevel: 50, status: 'In Stock' },
      { branchId: 'br-10', branchName: 'Green Hospital Coastal (Barishal)', shortName: 'Barishal Care', city: 'Barishal', zone: 'Coastal Regional', rackLocation: 'Rack BR-03, Bin 4', currentStock: 90, reorderLevel: 50, status: 'In Stock' },
    ],
  },
];

export const PharmacistInventoryView: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All Branches');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Dynamic list of registered branches from the medicine formulary
  const registeredBranches = useMemo(() => {
    const map = new Map<string, { id: string; name: string; shortName: string; city: string; zone: string }>();
    medicines.forEach((m) => {
      m.branches.forEach((b) => {
        if (!map.has(b.branchId)) {
          map.set(b.branchId, {
            id: b.branchId,
            name: b.branchName,
            shortName: b.shortName,
            city: b.city,
            zone: b.zone,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [medicines]);

  const branchFilterOptions = useMemo(() => {
    return ['All Branches', ...registeredBranches.map((b) => b.shortName)];
  }, [registeredBranches]);

  // Multi-branch details modal
  const [selectedMedicineForModal, setSelectedMedicineForModal] = useState<MedicineItem | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalCityFilter, setModalCityFilter] = useState('All');
  const [modalUnit, setModalUnit] = useState<SaleUnit>('box');

  // Transfer stock action
  const [transferTarget, setTransferTarget] = useState<{
    medicine: MedicineItem;
    branch: BranchStockItem;
  } | null>(null);
  const [transferUnit, setTransferUnit] = useState<SaleUnit>('box');
  const [transferAmount, setTransferAmount] = useState<number>(2);
  const [transferSuccessNotice, setTransferSuccessNotice] = useState<string | null>(null);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchCat = selectedCategory === 'All' || m.category === selectedCategory;

      let matchStat = true;
      if (selectedStatus !== 'All') {
        if (selectedBranchFilter === 'All Branches') {
          matchStat = m.status === selectedStatus;
        } else {
          const br = m.branches.find((b) => b.shortName === selectedBranchFilter || b.branchName === selectedBranchFilter);
          matchStat = br ? br.status === selectedStatus : false;
        }
      }

      return matchCat && matchStat;
    });
  }, [medicines, selectedCategory, selectedStatus, selectedBranchFilter]);

  // Handle transfer execution
  const handleExecuteTransfer = () => {
    if (!transferTarget || transferAmount <= 0) return;

    const { medicine, branch } = transferTarget;
    const packMultiplier =
      transferUnit === 'box'
        ? medicine.units_per_box
        : transferUnit === 'strip'
          ? medicine.units_per_strip
          : 1;
    const totalPiecesToTransfer = transferAmount * packMultiplier;

    if (medicine.centralStock < totalPiecesToTransfer) {
      alert(`Central warehouse has insufficient stock (${medicine.centralStock} pcs) for ${transferAmount} ${transferUnit}s (${totalPiecesToTransfer} pcs).`);
      return;
    }

    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id !== medicine.id) return med;

        const newCentralStock = med.centralStock - totalPiecesToTransfer;
        const updatedBranches = med.branches.map((b) => {
          if (b.branchId !== branch.branchId) return b;
          const newBranchStock = b.currentStock + totalPiecesToTransfer;
          let newStatus: 'In Stock' | 'Low Stock' | 'Critical' = 'In Stock';
          if (newBranchStock <= b.reorderLevel * 0.4) newStatus = 'Critical';
          else if (newBranchStock <= b.reorderLevel) newStatus = 'Low Stock';
          return {
            ...b,
            currentStock: newBranchStock,
            status: newStatus,
          };
        });

        const updatedMed = {
          ...med,
          centralStock: newCentralStock,
          branches: updatedBranches,
        };
        if (selectedMedicineForModal?.id === med.id) {
          setSelectedMedicineForModal(updatedMed);
        }

        return updatedMed;
      })
    );

    const unitLabel = transferAmount > 1 && transferUnit === 'box' ? 'Boxes' : transferAmount > 1 ? `${transferUnit}s` : transferUnit;
    const refNo = `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTransferSuccessNotice(
      `Dispatched ${transferAmount} ${unitLabel} (${totalPiecesToTransfer.toLocaleString()} pcs) of ${medicine.brandName} to ${branch.shortName}! Tracking #${refNo}`
    );
    setTimeout(() => setTransferSuccessNotice(null), 5000);
    setTransferTarget(null);
  };

  // Columns definition
  const columns: DataTableColumn<MedicineItem>[] = [
    {
      key: 'brandName',
      header: 'Medicine & Formulary',
      sortable: true,
      sortValue: (r) => r.brandName,
      render: (r) => (
        <div className="py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.brandName}</span>
            <span className="px-1 py-0.2 rounded-[2px] bg-slate-100 text-[#006a4e] text-[10px] font-bold">
              {r.code}
            </span>
          </div>
          <div className="text-[10.5px] text-slate-600 leading-tight mt-0.5">
            {r.genericName} • {r.strength}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-slate-400">{r.manufacturer}</span>
            <span className="text-slate-300">•</span>
            <span className="px-1 py-0.2 rounded-[2px] bg-slate-100 text-slate-600 text-[9.5px]">
              Strip ({r.units_per_strip})
            </span>
            <span className="px-1 py-0.2 rounded-[2px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-medium">
              Box ({r.units_per_box})
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Form / Class',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">
            {r.dosageForm}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {r.category}
          </span>
        </div>
      ),
    },
    {
      key: 'centralStock',
      header: 'CMS Central Depot',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.centralStock,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">
            {r.centralStock.toLocaleString()} pcs
          </span>
          <span className="text-[10px] text-slate-400 block leading-tight">
            Safety Min: {r.reorderLevel.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'branchStock',
      header: selectedBranchFilter === 'All Branches' ? 'Branch Stock' : `${selectedBranchFilter} Stock`,
      align: 'center',
      sortable: true,
      sortValue: (r) => {
        if (selectedBranchFilter === 'All Branches') {
          return r.branches.reduce((acc, b) => acc + b.currentStock, 0);
        }
        const b = r.branches.find((br) => br.shortName === selectedBranchFilter || br.branchName === selectedBranchFilter);
        return b ? b.currentStock : 0;
      },
      render: (r) => {
        if (selectedBranchFilter === 'All Branches') {
          const totalBranches = r.branches.reduce((acc, b) => acc + b.currentStock, 0);
          const lowBranches = r.branches.filter((b) => b.status === 'Low Stock' || b.status === 'Critical');

          return (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs">
                  {totalBranches.toLocaleString()} pcs
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMedicineForModal(r);
                    setModalUnit('box'); // default to box view inside modal as requested
                  }}
                  className="px-1.5 py-0.5 rounded-[3px] bg-emerald-50 hover:bg-[#006a4e] text-[#006a4e] hover:text-white border border-emerald-200 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="View stock breakdown by branch"
                >
                  <Building2 className="w-3 h-3" />
                  <span>View Branches</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
              <div className="text-[10px] leading-tight mt-0.5">
                {lowBranches.length > 0 ? (
                  <span className="text-amber-700 font-medium">
                    ⚠️ {lowBranches.length} branch{lowBranches.length > 1 ? 'es' : ''} reorder alert
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium">
                    All branches optimal
                  </span>
                )}
              </div>
            </div>
          );
        }

        // Specific branch view
        const currentBr = r.branches.find((b) => b.shortName === selectedBranchFilter || b.branchName === selectedBranchFilter);
        if (!currentBr) {
          return <span className="text-xs text-slate-400">—</span>;
        }

        return (
          <div className="text-center">
            <span className="font-bold text-slate-900 text-xs block">
              {currentBr.currentStock.toLocaleString()} pcs
            </span>
            <span className="text-[10px] text-slate-500 block leading-tight">
              {currentBr.rackLocation} • Min: {currentBr.reorderLevel}
            </span>
          </div>
        );
      },
    },
    {
      key: 'unitPrice',
      header: 'MRP (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.unitPrice,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ৳ {r.unitPrice.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => {
        if (selectedBranchFilter === 'All Branches') return r.status;
        const b = r.branches.find((br) => br.shortName === selectedBranchFilter || br.branchName === selectedBranchFilter);
        return b ? b.status : r.status;
      },
      render: (r) => {
        let stat = r.status;
        if (selectedBranchFilter !== 'All Branches') {
          const b = r.branches.find((br) => br.shortName === selectedBranchFilter || br.branchName === selectedBranchFilter);
          if (b) stat = b.status;
        }

        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (stat === 'In Stock') cls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
        else if (stat === 'Low Stock') cls = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
        else if (stat === 'Critical') cls = 'bg-rose-50 text-rose-800 border-rose-300 font-bold animate-pulse';

        return (
          <span className={`px-2 py-0.5 rounded-[2px] text-[11px] border whitespace-nowrap ${cls}`}>
            {stat}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setSelectedMedicineForModal(r);
              setModalUnit('box');
            }}
            className="px-2 py-0.5 rounded-[2px] bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Building2 className="w-3 h-3 text-[#006a4e]" />
            <span>Branches</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const target = r.branches.find((b) => b.status === 'Critical') || r.branches.find((b) => b.status === 'Low Stock') || r.branches[0];
              setTransferTarget({ medicine: r, branch: target });
              setTransferUnit('box');
              setTransferAmount(2);
            }}
            className="px-2 py-0.5 rounded-[2px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Transfer</span>
          </button>
        </div>
      ),
    },
  ];

  // Modal filtered branches
  const modalAvailableCities = useMemo(() => {
    if (!selectedMedicineForModal) return ['All'];
    const cities = Array.from(new Set(selectedMedicineForModal.branches.map((b) => b.city)));
    return ['All', ...cities];
  }, [selectedMedicineForModal]);

  const modalBranches = useMemo(() => {
    if (!selectedMedicineForModal) return [];
    return selectedMedicineForModal.branches.filter((b) => {
      const matchCity = modalCityFilter === 'All' || b.city === modalCityFilter;
      const matchQuery =
        modalSearchQuery.trim() === '' ||
        b.branchName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        b.shortName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        b.rackLocation.toLowerCase().includes(modalSearchQuery.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [selectedMedicineForModal, modalCityFilter, modalSearchQuery]);

  const modalTotalBranchStock = useMemo(() => {
    if (!selectedMedicineForModal) return 0;
    return selectedMedicineForModal.branches.reduce((sum, b) => sum + b.currentStock, 0);
  }, [selectedMedicineForModal]);

  const modalHealthyBranches = useMemo(() => {
    if (!selectedMedicineForModal) return 0;
    return selectedMedicineForModal.branches.filter((b) => b.status === 'In Stock').length;
  }, [selectedMedicineForModal]);

  return (
    <div className="space-y-2">
      <PageHeader
        title="Inventory & Multi-Branch Stock"
        description="Central Medical Store · Enterprise Formulary & Multi-Branch Dispensaries"
      />

      {/* Global Transfer Success Notification Toast */}
      {transferSuccessNotice && (
        <div className="p-2.5 rounded-[4px] bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{transferSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setTransferSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Formulary SKUs"
          icon={Boxes}
          iconColor="text-[#006a4e]"
          value="1,480 SKUs"
          subtitle="Registered across hospital network"
        />
        <SummaryCard
          title="Central CMS Warehouse"
          icon={Building2}
          iconColor="text-[#006a4e]"
          value="482,500 Units"
          subtitle="Central medical storage depot"
        />
        <SummaryCard
          title="Hospital Branches"
          icon={MapPin}
          iconColor="text-[#0c2e4b]"
          value={`${registeredBranches.length} Branches`}
          subtitle="Active dispensary network"
        />
        <SummaryCard
          title="Critical Shortages"
          icon={ShieldAlert}
          iconColor="text-rose-600"
          value="2 SKUs"
          valueColor="text-rose-700"
          subtitle="Emergency inter-branch rebalance"
        />
      </SummaryCardGrid>

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<MedicineItem>
        data={filteredMedicines}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search brand, generic, SKU code, or manufacturer..."
        searchFilter={(item, query) =>
          item.brandName.toLowerCase().includes(query.toLowerCase()) ||
          item.genericName.toLowerCase().includes(query.toLowerCase()) ||
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.manufacturer.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Branch Selector Dropdown */}
            <DropdownSelect
              value={selectedBranchFilter}
              onChange={(val) => setSelectedBranchFilter(val)}
              options={branchFilterOptions}
              width="w-48"
            />
            <DropdownSelect
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              options={['All', 'Analgesics', 'Gastrointestinal', 'Antibiotics', 'Respiratory', 'Cardiovascular']}
              width="w-36"
            />
            <DropdownSelect
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              options={['All', 'In Stock', 'Low Stock', 'Critical']}
              width="w-32"
            />
          </div>
        }
        headerActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2.5 py-1 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
          </div>
        }
        emptyTitle="No medicines found"
        emptyDescription="No formulary items match the selected filter criteria."
        showSerial={true}
        compact={true}
      />

      {/* Multi-Branch Stock Details Modal (শাখাভিত্তিক স্টক বিশ্লেষণ ও প্যাকেজিং ইউনিট: Pc / Strip / Box) */}
      {selectedMedicineForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-[#f8fafc] border-b border-slate-200 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[3px] bg-[#e6f4ea] text-[#006a4e] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedMedicineForModal.brandName}
                    </h3>
                    <span className="text-xs text-slate-600 font-medium">
                      ({selectedMedicineForModal.strength})
                    </span>
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-200 text-[#006a4e] text-[10.5px] font-bold">
                      {selectedMedicineForModal.code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-white border border-slate-300 text-slate-700 text-[10.5px] font-medium">
                      {selectedMedicineForModal.dosageForm}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Generic: <strong className="text-slate-700 font-semibold">{selectedMedicineForModal.genericName}</strong> • {selectedMedicineForModal.manufacturer} • MRP: <strong className="text-slate-800">৳ {selectedMedicineForModal.unitPrice.toFixed(2)}/pc</strong> (৳ {(selectedMedicineForModal.unitPrice * selectedMedicineForModal.units_per_box).toFixed(2)}/box)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMedicineForModal(null)}
                className="w-7 h-7 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick KPI Strip across Branches with Active Unit Representation */}
            {(() => {
              const centralFmt = formatStockQuantity(selectedMedicineForModal.centralStock, modalUnit, selectedMedicineForModal.units_per_strip, selectedMedicineForModal.units_per_box);
              const branchFmt = formatStockQuantity(modalTotalBranchStock, modalUnit, selectedMedicineForModal.units_per_strip, selectedMedicineForModal.units_per_box);
              const totalPieces = selectedMedicineForModal.centralStock + modalTotalBranchStock;
              const totalFmt = formatStockQuantity(totalPieces, modalUnit, selectedMedicineForModal.units_per_strip, selectedMedicineForModal.units_per_box);

              return (
                <div className="px-4 py-2.5 bg-[#f1f5f9] border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-[3px] border border-slate-200">
                    <div className="text-[10px] text-slate-500">CMS Central Warehouse</div>
                    <div className="font-bold text-slate-900 text-xs">
                      {centralFmt.primary}
                    </div>
                    <div className="text-[9.5px] text-slate-400">{centralFmt.secondary}</div>
                  </div>
                  <div className="bg-white p-2 rounded-[3px] border border-slate-200">
                    <div className="text-[10px] text-slate-500">Branch Network Stock</div>
                    <div className="font-bold text-[#006a4e] text-xs">
                      {branchFmt.primary}
                    </div>
                    <div className="text-[9.5px] text-slate-400">{modalHealthyBranches} of {selectedMedicineForModal.branches.length} Branches Optimal</div>
                  </div>
                  <div className="bg-white p-2 rounded-[3px] border border-slate-200">
                    <div className="text-[10px] text-slate-500">Enterprise Grand Total</div>
                    <div className="font-bold text-slate-900 text-xs">
                      {totalFmt.primary}
                    </div>
                    <div className="text-[9.5px] text-slate-400">{totalPieces.toLocaleString()} pcs total</div>
                  </div>
                  <div className="bg-white p-2 rounded-[3px] border border-slate-200">
                    <div className="text-[10px] text-slate-500">Enterprise Stock Valuation</div>
                    <div className="font-bold text-slate-900 text-xs">
                      ৳ {(totalPieces * selectedMedicineForModal.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9.5px] text-emerald-700">Calculated at unit MRP</div>
                  </div>
                </div>
              );
            })()}

            {/* Modal Toolbar: Search, City Filter & Packaging Unit Switcher (Piece / Strip / Box) */}
            <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap bg-white">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter branch name, city, or rack..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded-[3px] focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Packaging Unit Switcher (Piece / Strip / Box) - Matching user screenshot exactly */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-semibold">Stock Unit:</span>
                  <PackagingUnitSwitcher
                    unitsPerStrip={selectedMedicineForModal.units_per_strip}
                    unitsPerBox={selectedMedicineForModal.units_per_box}
                    activeUnit={modalUnit}
                    onChange={(u) => setModalUnit(u)}
                  />
                </div>

                {/* City Filter Pills */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-slate-400" />
                    <span>City:</span>
                  </span>
                  {modalAvailableCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setModalCityFilter(city)}
                      className={`px-2 py-0.5 rounded-[2px] text-[10.5px] font-semibold cursor-pointer transition-colors ${
                        modalCityFilter === city
                          ? 'bg-[#0c2e4b] text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* High-Density Multi-Branch Inventory Matrix Table with Strip & Box Breakdown */}
            <div className="flex-1 overflow-auto p-4">
              <div className="border border-slate-200 rounded-[3px] overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                      <th className="px-3 py-2">Hospital Branch & Region</th>
                      <th className="px-3 py-2">Dispensary Rack</th>
                      <th className="px-3 py-2 text-right">
                        Current Stock ({modalUnit === 'box' ? `Box - ${selectedMedicineForModal.units_per_box} pcs` : modalUnit === 'strip' ? `Strip - ${selectedMedicineForModal.units_per_strip} pcs` : 'Pieces'})
                      </th>
                      <th className="px-3 py-2 text-right">Min Reorder</th>
                      <th className="px-3 py-2 text-center">Status</th>
                      <th className="px-3 py-2 text-right">Transfer Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {modalBranches.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                          No branches match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      modalBranches.map((br) => {
                        let badgeCls = 'bg-slate-100 text-slate-700 border-slate-200';
                        if (br.status === 'In Stock') badgeCls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                        else if (br.status === 'Low Stock') badgeCls = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
                        else if (br.status === 'Critical') badgeCls = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';

                        const brFmt = formatStockQuantity(
                          br.currentStock,
                          modalUnit,
                          selectedMedicineForModal.units_per_strip,
                          selectedMedicineForModal.units_per_box
                        );

                        const reorderFmt = formatStockQuantity(
                          br.reorderLevel,
                          modalUnit,
                          selectedMedicineForModal.units_per_strip,
                          selectedMedicineForModal.units_per_box
                        );

                        return (
                          <tr key={br.branchId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-3 py-2">
                              <div className="font-semibold text-slate-900">{br.branchName}</div>
                              <div className="text-[10px] text-slate-500">
                                {br.city} • <span className="text-slate-600">{br.zone}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 text-[10.5px] border border-slate-200 font-medium">
                                {br.rackLocation}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <div className="font-bold text-slate-900 text-xs">
                                {brFmt.primary}
                              </div>
                              <div className="text-[10px] text-slate-500 font-normal leading-tight">
                                {brFmt.secondary}
                              </div>
                              {/* Stock Health indicator bar */}
                              <div className="w-16 h-1 bg-slate-200 rounded-full ml-auto mt-1 overflow-hidden">
                                <div
                                  className={`h-full ${
                                    br.status === 'In Stock'
                                      ? 'bg-emerald-500'
                                      : br.status === 'Low Stock'
                                        ? 'bg-amber-500'
                                        : 'bg-rose-500'
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.round((br.currentStock / (br.reorderLevel * 2)) * 100))}%`,
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right text-slate-600">
                              <div className="font-semibold text-slate-800 text-xs">
                                {reorderFmt.primary}
                              </div>
                              <div className="text-[9.5px] text-slate-400 leading-tight">
                                Min safety
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-0.5 rounded-[2px] text-[10.5px] border whitespace-nowrap ${badgeCls}`}>
                                {br.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setTransferTarget({
                                    medicine: selectedMedicineForModal,
                                    branch: br,
                                  });
                                  setTransferUnit('box');
                                  setTransferAmount(2);
                                }}
                                className="px-2 py-1 rounded-[2px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                                <span>Transfer</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-[#006a4e]" />
                <span>Inter-branch couriers support bulk Box, Strip blister, and loose Piece dispatches</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedicineForModal(null)}
                className="px-3 py-1 rounded-[3px] bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inter-Branch Transfer Dialog with Packaging Unit Switcher (Piece / Strip / Box) */}
      {transferTarget && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xl max-w-md w-full p-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[3px] bg-[#0c2e4b] text-white flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Inter-Branch Stock Transfer</h4>
                  <p className="text-[10px] text-slate-500">Dispatch stock from CMS Central to branch dispensary</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTransferTarget(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400">Medicine Item</div>
                <div className="font-bold text-slate-900">{transferTarget.medicine.brandName} ({transferTarget.medicine.strength})</div>
                <div className="text-[10.5px] text-slate-600">
                  {transferTarget.medicine.genericName} • {transferTarget.medicine.code} • 1 Strip = {transferTarget.medicine.units_per_strip} pcs, 1 Box = {transferTarget.medicine.units_per_box} pcs
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-[3px] bg-emerald-50/60 border border-emerald-200">
                  <div className="text-[10px] text-emerald-800 font-semibold">Origin Warehouse</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">CMS Central Depot</div>
                  <div className="text-[10.5px] text-slate-600">
                    Available: {transferTarget.medicine.centralStock.toLocaleString()} pcs ({(transferTarget.medicine.centralStock / transferTarget.medicine.units_per_box).toFixed(1)} Boxes)
                  </div>
                </div>

                <div className="p-2 rounded-[3px] bg-blue-50/60 border border-blue-200">
                  <div className="text-[10px] text-blue-800 font-semibold">Destination Branch</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{transferTarget.branch.shortName}</div>
                  <div className="text-[10.5px] text-slate-600">
                    Current: {transferTarget.branch.currentStock.toLocaleString()} pcs ({(transferTarget.branch.currentStock / transferTarget.medicine.units_per_box).toFixed(1)} Boxes)
                  </div>
                </div>
              </div>

              {/* Packaging Unit Switcher inside Transfer Dialog */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Dispatch Packaging Unit:
                  </label>
                  <PackagingUnitSwitcher
                    unitsPerStrip={transferTarget.medicine.units_per_strip}
                    unitsPerBox={transferTarget.medicine.units_per_box}
                    activeUnit={transferUnit}
                    onChange={(u) => {
                      setTransferUnit(u);
                      setTransferAmount(u === 'box' ? 2 : u === 'strip' ? 10 : 100);
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-[3px] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#006a4e]"
                  />
                  <span className="text-xs text-slate-600 font-semibold">
                    {transferUnit === 'box'
                      ? transferAmount > 1 ? 'Boxes' : 'Box'
                      : transferUnit === 'strip'
                        ? transferAmount > 1 ? 'Strips' : 'Strip'
                        : 'Pieces'}
                  </span>
                </div>

                {/* Conversion feedback */}
                {(() => {
                  const mult =
                    transferUnit === 'box'
                      ? transferTarget.medicine.units_per_box
                      : transferUnit === 'strip'
                        ? transferTarget.medicine.units_per_strip
                        : 1;
                  const totalPcs = transferAmount * mult;

                  return (
                    <div className="mt-1.5 p-1.5 rounded-[2px] bg-slate-100 border border-slate-200 text-[11px] flex items-center justify-between">
                      <span className="text-slate-600">Equivalent Dispatch:</span>
                      <strong className="text-[#006a4e]">
                        {totalPcs.toLocaleString()} individual pieces
                        {transferUnit !== 'piece' && ` (${transferAmount} ${transferUnit}${transferAmount > 1 ? (transferUnit === 'box' ? 'es' : 's') : ''})`}
                      </strong>
                    </div>
                  );
                })()}

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500">Quick qty:</span>
                  {(transferUnit === 'box'
                    ? [1, 2, 5, 10]
                    : transferUnit === 'strip'
                      ? [5, 10, 20, 50]
                      : [50, 100, 200, 500]
                  ).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTransferAmount(preset)}
                      className="px-2 py-0.5 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      +{preset} {transferUnit === 'box' ? 'bxs' : transferUnit === 'strip' ? 'str' : 'pcs'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTransferTarget(null)}
                  className="px-3 py-1.5 rounded-[3px] border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  className="px-3.5 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Dispatch Stock Transfer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
