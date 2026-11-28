import React, { useMemo, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRightLeft,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Download,
  PackagePlus,
  Plus,
  ShieldAlert,
  ThermometerSnowflake,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';

export interface BatchRecord {
  id: string;
  medicineName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  category: string;
  manufacturer: string;
  batchNo: string;
  location: string;
  mfgDate: string;
  expDate: string;
  daysRemaining: number;
  quantity: number;
  unitCost: number;
  isColdChain?: boolean;
  isQuarantined?: boolean;
}

const INITIAL_BATCHES: BatchRecord[] = [
  {
    id: 'B-01',
    medicineName: 'Meropenem 1g IV Inj (Meronem)',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Injection',
    strength: '1g',
    category: 'Antibiotics',
    manufacturer: 'Healthcare Pharma',
    batchNo: 'MRP-2024-X8',
    location: 'Dhanmondi OPD Pharmacy (Shelf B-4)',
    mfgDate: '2024-12',
    expDate: '2026-12-15',
    daysRemaining: 22,
    quantity: 80,
    unitCost: 950.0,
    isQuarantined: false,
  },
  {
    id: 'B-02',
    medicineName: 'Human Albumin 20% 50ml IV',
    genericName: 'Human Normal Albumin',
    dosageForm: 'Infusion',
    strength: '20% 50ml',
    category: 'Blood Derivatives',
    manufacturer: 'Grifols Biologicals',
    batchNo: 'ALB-2024-11',
    location: 'Central Medical Store (Cold Chain 2-8°C)',
    mfgDate: '2024-12',
    expDate: '2026-12-12',
    daysRemaining: 19,
    quantity: 45,
    unitCost: 4200.0,
    isColdChain: true,
    isQuarantined: false,
  },
  {
    id: 'B-03',
    medicineName: 'Torax 10 (10mg) Tablet',
    genericName: 'Ketorolac Tromethamine',
    dosageForm: 'Tablet',
    strength: '10mg',
    category: 'Analgesics',
    manufacturer: 'Square Pharmaceuticals',
    batchNo: 'TRX-2024-09',
    location: 'Central Depot (Bay 02)',
    mfgDate: '2024-10',
    expDate: '2026-12-18',
    daysRemaining: 25,
    quantity: 650,
    unitCost: 9.6,
    isQuarantined: false,
  },
  {
    id: 'B-04',
    medicineName: 'Napa Extra (500mg+65mg)',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Tablet',
    strength: '500mg+65mg',
    category: 'Analgesics',
    manufacturer: 'Beximco Pharmaceuticals',
    batchNo: 'NPX-2024-88',
    location: 'Central Depot (Bay 01)',
    mfgDate: '2024-11',
    expDate: '2026-12-20',
    daysRemaining: 27,
    quantity: 3500,
    unitCost: 2.8,
    isQuarantined: false,
  },
  {
    id: 'B-05',
    medicineName: 'Azithromycin 500mg (Zimax)',
    genericName: 'Azithromycin Dihydrate',
    dosageForm: 'Tablet',
    strength: '500mg',
    category: 'Antibiotics',
    manufacturer: 'Square Pharmaceuticals',
    batchNo: 'ZMX-2024-44',
    location: 'Central Depot (Bay 03)',
    mfgDate: '2024-11',
    expDate: '2026-12-25',
    daysRemaining: 32,
    quantity: 420,
    unitCost: 28.0,
    isQuarantined: false,
  },
  {
    id: 'B-06',
    medicineName: 'Pantonix 20 (20mg) Tablet',
    genericName: 'Pantoprazole',
    dosageForm: 'Tablet',
    strength: '20mg',
    category: 'Gastrointestinal',
    manufacturer: 'Incepta Pharmaceuticals',
    batchNo: 'PTX-2025-15',
    location: 'Chattogram Hub (Rack CT-02)',
    mfgDate: '2025-03',
    expDate: '2027-01-05',
    daysRemaining: 43,
    quantity: 1100,
    unitCost: 6.0,
    isQuarantined: false,
  },
  {
    id: 'B-07',
    medicineName: 'Insulin Glargine 100IU/ml (Lantus)',
    genericName: 'Insulin Glargine',
    dosageForm: 'Injection',
    strength: '100IU/ml',
    category: 'Endocrinology',
    manufacturer: 'Sanofi Bangladesh',
    batchNo: 'LAN-2025-01',
    location: 'Central Medical Store (Cold Chain 2-8°C)',
    mfgDate: '2025-01',
    expDate: '2027-01-10',
    daysRemaining: 48,
    quantity: 120,
    unitCost: 820.0,
    isColdChain: true,
    isQuarantined: false,
  },
  {
    id: 'B-08',
    medicineName: 'Sergel 20 (20mg) Capsule',
    genericName: 'Esomeprazole',
    dosageForm: 'Capsule',
    strength: '20mg',
    category: 'Gastrointestinal',
    manufacturer: 'Healthcare Pharma',
    batchNo: 'SRG-2025-34',
    location: 'Gulshan Executive (Rack G-04)',
    mfgDate: '2025-03',
    expDate: '2027-01-18',
    daysRemaining: 56,
    quantity: 1400,
    unitCost: 6.4,
    isQuarantined: false,
  },
  {
    id: 'B-09',
    medicineName: 'Clexane 40mg/0.4ml Syringe',
    genericName: 'Enoxaparin Sodium',
    dosageForm: 'Prefilled Syringe',
    strength: '40mg/0.4ml',
    category: 'Anticoagulants',
    manufacturer: 'Sanofi Bangladesh',
    batchNo: 'CLX-2025-08',
    location: 'Central Medical Store (Cold Chain 2-8°C)',
    mfgDate: '2025-02',
    expDate: '2027-01-22',
    daysRemaining: 60,
    quantity: 180,
    unitCost: 540.0,
    isColdChain: true,
    isQuarantined: false,
  },
  {
    id: 'B-10',
    medicineName: 'Amoxicillin + Clavulanic 625mg (Moxaclav)',
    genericName: 'Amoxicillin + Clavulanic Acid',
    dosageForm: 'Tablet',
    strength: '625mg',
    category: 'Antibiotics',
    manufacturer: 'Square Pharmaceuticals',
    batchNo: 'MXC-2025-42',
    location: 'Central Medical Store (Shelf C-1)',
    mfgDate: '2025-03',
    expDate: '2027-01-28',
    daysRemaining: 66,
    quantity: 600,
    unitCost: 28.0,
    isQuarantined: false,
  },
  {
    id: 'B-11',
    medicineName: 'Maxpro 40 (40mg) Capsule',
    genericName: 'Esomeprazole Magnesium',
    dosageForm: 'Capsule',
    strength: '40mg',
    category: 'Gastrointestinal',
    manufacturer: 'Renata Limited',
    batchNo: 'MXP-2025-91',
    location: 'Central Depot (Bay 04)',
    mfgDate: '2025-05',
    expDate: '2027-02-01',
    daysRemaining: 70,
    quantity: 950,
    unitCost: 11.2,
    isQuarantined: false,
  },
  {
    id: 'B-12',
    medicineName: 'Ceftriaxone 1g Inj. (Ceftron)',
    genericName: 'Ceftriaxone Sodium',
    dosageForm: 'Injection',
    strength: '1g',
    category: 'Antibiotics',
    manufacturer: 'Square Pharmaceuticals',
    batchNo: 'CFT-2025-99',
    location: 'Uttara Branch Pharmacy (Aisle 2)',
    mfgDate: '2025-02',
    expDate: '2027-02-05',
    daysRemaining: 74,
    quantity: 210,
    unitCost: 165.0,
    isQuarantined: false,
  },
  {
    id: 'B-13',
    medicineName: 'Ace Plus (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Tablet',
    strength: '500mg+65mg',
    category: 'Analgesics',
    manufacturer: 'Square Pharmaceuticals',
    batchNo: 'ACP-2025-12',
    location: 'Dhanmondi OPD Pharmacy (Rack A-01)',
    mfgDate: '2025-02',
    expDate: '2027-02-14',
    daysRemaining: 83,
    quantity: 2800,
    unitCost: 2.7,
    isQuarantined: false,
  },
  {
    id: 'B-14',
    medicineName: 'Maxpro 20 (20mg) Capsule',
    genericName: 'Esomeprazole Magnesium',
    dosageForm: 'Capsule',
    strength: '20mg',
    category: 'Gastrointestinal',
    manufacturer: 'Renata Limited',
    batchNo: 'MXP-2025-63',
    location: 'Mirpur Branch Pharmacy (Shelf A-3)',
    mfgDate: '2025-04',
    expDate: '2027-03-30',
    daysRemaining: 127,
    quantity: 1800,
    unitCost: 7.2,
    isQuarantined: false,
  },
  {
    id: 'B-15',
    medicineName: 'Seclo 20 (20mg) Capsule',
    genericName: 'Omeprazole',
    dosageForm: 'Capsule',
    strength: '20mg',
    category: 'Gastrointestinal',
    manufacturer: 'Square Pharmaceuticals',
    batchNo: 'SCL-2025-77',
    location: 'Old Dhaka Care (Rack OD-01)',
    mfgDate: '2025-04',
    expDate: '2027-04-12',
    daysRemaining: 140,
    quantity: 2200,
    unitCost: 4.8,
    isQuarantined: false,
  },
  {
    id: 'B-16',
    medicineName: 'Pantoprazole 40mg IV (Pantobex)',
    genericName: 'Pantoprazole Sodium',
    dosageForm: 'Injection',
    strength: '40mg',
    category: 'Gastrointestinal',
    manufacturer: 'Beximco Pharmaceuticals',
    batchNo: 'PTB-2025-14',
    location: 'Mirpur Branch Pharmacy (Shelf A-3)',
    mfgDate: '2025-04',
    expDate: '2027-04-30',
    daysRemaining: 160,
    quantity: 450,
    unitCost: 65.0,
    isQuarantined: false,
  },
  {
    id: 'B-17',
    medicineName: 'Ciprofloxacin 500mg (Neofloxin)',
    genericName: 'Ciprofloxacin',
    dosageForm: 'Tablet',
    strength: '500mg',
    category: 'Antibiotics',
    manufacturer: 'Beximco Pharmaceuticals',
    batchNo: 'NFX-2025-19',
    location: 'Sylhet Campus (Rack SY-03)',
    mfgDate: '2025-01',
    expDate: '2027-05-20',
    daysRemaining: 178,
    quantity: 850,
    unitCost: 12.0,
    isQuarantined: false,
  },
  {
    id: 'B-18',
    medicineName: 'Fexofenadine 120mg (Fexo)',
    genericName: 'Fexofenadine HCl',
    dosageForm: 'Tablet',
    strength: '120mg',
    category: 'Antihistamines',
    manufacturer: 'Square Pharmaceuticals',
    batchNo: 'FXO-2025-02',
    location: 'Khulna Center (Rack KH-04)',
    mfgDate: '2025-02',
    expDate: '2027-06-15',
    daysRemaining: 204,
    quantity: 1600,
    unitCost: 7.2,
    isQuarantined: false,
  },
];

export const PharmacistBatchExpiryView: React.FC = () => {
  const [batches, setBatches] = useState<BatchRecord[]>(INITIAL_BATCHES);
  const [filterRange, setFilterRange] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inward Batch Modal State
  const [isInwardModalOpen, setIsInwardModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newGenericName, setNewGenericName] = useState('');
  const [newCategory, setNewCategory] = useState('Analgesics');
  const [newDosageForm, setNewDosageForm] = useState('Tablet');
  const [newStrength, setNewStrength] = useState('500mg');
  const [newManufacturer, setNewManufacturer] = useState('Square Pharmaceuticals');
  const [newBatchNo, setNewBatchNo] = useState('');
  const [newLocation, setNewLocation] = useState('Central Depot (Bay 01)');
  const [newMfgDate, setNewMfgDate] = useState('2025-05');
  const [newExpDate, setNewExpDate] = useState('2027-06-30');
  const [newQuantity, setNewQuantity] = useState(1000);
  const [newUnitCost, setNewUnitCost] = useState(3.5);
  const [newIsColdChain, setNewIsColdChain] = useState(false);

  // FEFO Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTargetBatch, setTransferTargetBatch] = useState<BatchRecord | null>(null);
  const [transferDestination, setTransferDestination] = useState('Dhanmondi OPD Pharmacy');
  const [transferUnits, setTransferUnits] = useState(100);
  const [transferUrgency, setTransferUrgency] = useState<'Standard' | 'Urgent' | 'Stat ICU'>('Urgent');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toggle Quarantine
  const toggleQuarantine = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const newStatus = !b.isQuarantined;
        triggerToast(
          newStatus
            ? `⚠️ Lot ${b.batchNo} (${b.medicineName}) has been placed in QUARANTINE lock.`
            : `✓ Lot ${b.batchNo} released from Quarantine into active formulary.`
        );
        return { ...b, isQuarantined: newStatus };
      })
    );
    if (selectedBatch && selectedBatch.id === id) {
      setSelectedBatch((prev) => (prev ? { ...prev, isQuarantined: !prev.isQuarantined } : null));
    }
  };

  // Stats for 4 Metric Cards
  const stats = useMemo(() => {
    const critical = batches.filter((b) => b.daysRemaining <= 30 && !b.isQuarantined).length;
    const warning = batches.filter(
      (b) => b.daysRemaining > 30 && b.daysRemaining <= 60 && !b.isQuarantined
    ).length;
    const notice = batches.filter(
      (b) => b.daysRemaining > 60 && b.daysRemaining <= 90 && !b.isQuarantined
    ).length;
    const safe = batches.filter((b) => b.daysRemaining > 90 && !b.isQuarantined).length;
    const quarantined = batches.filter((b) => b.isQuarantined).length;
    const totalValuation = batches.reduce((acc, b) => acc + b.quantity * b.unitCost, 0);

    return {
      critical,
      warning,
      notice,
      safe,
      quarantined,
      total: batches.length,
      totalValuation,
    };
  }, [batches]);

  // Unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    batches.forEach((b) => set.add(b.location));
    return Array.from(set).sort();
  }, [batches]);

  // Filtered batches for DataTable
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      // Location filter
      if (locationFilter !== 'all' && b.location !== locationFilter) {
        return false;
      }

      // Expiry filter
      if (filterRange === 'critical') return b.daysRemaining <= 30 && !b.isQuarantined;
      if (filterRange === 'warning')
        return b.daysRemaining > 30 && b.daysRemaining <= 60 && !b.isQuarantined;
      if (filterRange === 'notice')
        return b.daysRemaining > 60 && b.daysRemaining <= 90 && !b.isQuarantined;
      if (filterRange === 'safe') return b.daysRemaining > 90 && !b.isQuarantined;
      if (filterRange === 'quarantined') return b.isQuarantined;

      return true;
    });
  }, [batches, filterRange, locationFilter]);

  // Handle Inward Batch Submit
  const handleInwardBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newBatchNo.trim()) return;

    // Approximate days remaining
    const expTime = new Date(newExpDate).getTime();
    const nowTime = new Date('2026-11-23').getTime();
    const days = Math.max(1, Math.round((expTime - nowTime) / (1000 * 60 * 60 * 24)));

    const created: BatchRecord = {
      id: `B-${Date.now()}`,
      medicineName: `${newMedName.trim()} (${newStrength})`,
      genericName: newGenericName.trim() || newMedName.trim(),
      dosageForm: newDosageForm,
      strength: newStrength,
      category: newCategory,
      manufacturer: newManufacturer,
      batchNo: newBatchNo.trim().toUpperCase(),
      location: newLocation,
      mfgDate: newMfgDate,
      expDate: newExpDate,
      daysRemaining: days,
      quantity: Number(newQuantity) || 500,
      unitCost: Number(newUnitCost) || 5.0,
      isColdChain: newIsColdChain,
      isQuarantined: false,
    };

    setBatches((prev) => [created, ...prev]);
    setIsInwardModalOpen(false);
    setSelectedBatch(created);
    triggerToast(`✓ Registered new batch lot ${created.batchNo} for ${created.medicineName}!`);

    // Reset form
    setNewMedName('');
    setNewGenericName('');
    setNewBatchNo('');
  };

  // Handle FEFO Transfer Submit
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetBatch || transferUnits <= 0) return;

    if (transferUnits > transferTargetBatch.quantity) {
      alert(`Cannot transfer more than available lot stock (${transferTargetBatch.quantity} units)`);
      return;
    }

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== transferTargetBatch.id) return b;
        return {
          ...b,
          quantity: b.quantity - transferUnits,
        };
      })
    );

    triggerToast(
      `✓ FEFO Dispatch: ${transferUnits} units of ${transferTargetBatch.medicineName} (Lot ${transferTargetBatch.batchNo}) transferred to ${transferDestination}!`
    );
    setIsTransferModalOpen(false);
    if (selectedBatch && selectedBatch.id === transferTargetBatch.id) {
      setSelectedBatch((prev) =>
        prev ? { ...prev, quantity: prev.quantity - transferUnits } : null
      );
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Lot Number',
      'Medicine Name',
      'Generic Name',
      'Dosage Form',
      'Strength',
      'Category',
      'Manufacturer',
      'Storage Location',
      'Quantity (Units)',
      'Mfg Date',
      'Expiry Date',
      'Days Remaining',
      'Unit Cost (Tk)',
      'Total Valuation (Tk)',
      'Cold Chain',
      'Quarantine Status',
    ];
    const rows = filteredBatches.map((b) => [
      `"${b.batchNo}"`,
      `"${b.medicineName}"`,
      `"${b.genericName}"`,
      `"${b.dosageForm}"`,
      `"${b.strength}"`,
      `"${b.category}"`,
      `"${b.manufacturer}"`,
      `"${b.location}"`,
      b.quantity,
      `"${b.mfgDate}"`,
      `"${b.expDate}"`,
      b.daysRemaining,
      b.unitCost.toFixed(2),
      (b.quantity * b.unitCost).toFixed(2),
      b.isColdChain ? 'YES' : 'NO',
      b.isQuarantined ? 'QUARANTINED' : 'ACTIVE',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `batches_expiry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns for Superadmin-Style DataTable
  const columns: DataTableColumn<BatchRecord>[] = [
    {
      key: 'batchNo',
      header: 'Batch & Lot No',
      sortable: true,
      sortValue: (r) => r.batchNo,
      render: (r: BatchRecord) => (
        <div>
          <span className="font-mono text-[11px] font-medium text-slate-700 tracking-tight block">
            {r.batchNo}
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            ID: {r.id}
          </span>
        </div>
      ),
    },
    {
      key: 'medicineName',
      header: 'Medicine & Generic',
      sortable: true,
      sortValue: (r) => r.medicineName,
      render: (r: BatchRecord) => (
        <div>
          <div className="flex items-center gap-1.5 leading-snug">
            <span className="font-semibold text-slate-800 text-xs">{r.medicineName}</span>
            <span className="text-[9.5px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-normal">
              {r.dosageForm}
            </span>
            {r.isColdChain && (
              <span className="text-[9px] bg-cyan-50 text-cyan-700 border border-cyan-200 px-1 py-0.2 rounded font-medium inline-flex items-center gap-0.5">
                <ThermometerSnowflake className="w-2.5 h-2.5" />
                2-8°C
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
            {r.genericName} · <span className="text-slate-400">{r.manufacturer}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Storage Location',
      sortable: true,
      sortValue: (r) => r.location,
      render: (r: BatchRecord) => (
        <span className="text-xs text-slate-600 font-normal whitespace-nowrap">
          {r.location}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Stock Qty',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.quantity,
      render: (r: BatchRecord) => (
        <div className="whitespace-nowrap">
          <span className="font-mono font-medium text-slate-700 text-xs block">
            {r.quantity.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">units</span>
        </div>
      ),
    },
    {
      key: 'mfgDate',
      header: 'Mfg Date',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.mfgDate,
      render: (r: BatchRecord) => (
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          {r.mfgDate}
        </span>
      ),
    },
    {
      key: 'expDate',
      header: 'Expiry Date',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.expDate,
      render: (r: BatchRecord) => (
        <span className="font-mono text-[11px] font-medium text-slate-700 whitespace-nowrap">
          {r.expDate}
        </span>
      ),
    },
    {
      key: 'daysRemaining',
      header: 'Shelf Life / Expiry',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.daysRemaining,
      render: (r: BatchRecord) => {
        if (r.daysRemaining <= 30) {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1 whitespace-nowrap">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>{r.daysRemaining}d (Critical)</span>
            </span>
          );
        }
        if (r.daysRemaining <= 60) {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-1 whitespace-nowrap">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>{r.daysRemaining}d (Warning)</span>
            </span>
          );
        }
        if (r.daysRemaining <= 90) {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 inline-flex items-center gap-1 whitespace-nowrap">
              <CalendarClock className="w-3 h-3 text-yellow-600" />
              <span>{r.daysRemaining}d (Notice)</span>
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-[#edf6f2] text-[#006a4e] border border-[#006a4e]/20 inline-flex items-center gap-1 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-[#006a4e]" />
            <span>{r.daysRemaining}d (Safe)</span>
          </span>
        );
      },
    },
    {
      key: 'valuation',
      header: 'Lot Valuation (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.quantity * r.unitCost,
      render: (r: BatchRecord) => (
        <span className="font-medium text-slate-700 text-xs whitespace-nowrap">
          ৳ {(r.quantity * r.unitCost).toLocaleString(undefined, { minimumFractionDigits: 0 })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Control',
      align: 'center',
      render: (r: BatchRecord) => {
        if (r.isQuarantined) {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-rose-600 text-white whitespace-nowrap">
              QUARANTINED
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            ACTIVE
          </span>
        );
      },
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (r: BatchRecord) => (
        <div
          className="flex items-center justify-end gap-1.5 whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setTransferTargetBatch(r);
              setTransferUnits(Math.min(r.quantity, 100));
              setIsTransferModalOpen(true);
            }}
            disabled={r.isQuarantined || r.quantity <= 0}
            className={`px-2 py-1 rounded-[3px] text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              r.isQuarantined || r.quantity <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-300 cursor-pointer'
            }`}
            title="Fast-track FEFO dispatch to hospital branch"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>FEFO</span>
          </button>
          <button
            type="button"
            onClick={() => toggleQuarantine(r.id)}
            className={`px-2 py-1 rounded-[3px] text-[11px] font-semibold transition-colors cursor-pointer border ${
              r.isQuarantined
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={r.isQuarantined ? 'Release from quarantine' : 'Quarantine this batch'}
          >
            {r.isQuarantined ? 'Release' : 'Quarantine'}
          </button>
        </div>
      ),
    },
  ];

  // Superadmin Toolbar Filters
  const toolbarFilters = (
    <div className="flex flex-wrap items-center gap-2">
      {/* Expiry Window Filter */}
      <div className="relative">
        <select
          aria-label="Filter by expiry range"
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="all">All Expiry Windows ({batches.length})</option>
          <option value="critical">Critical (&lt; 30 Days)</option>
          <option value="warning">Warning (30 - 60 Days)</option>
          <option value="notice">Early Notice (60 - 90 Days)</option>
          <option value="safe">Safe Shelf Life (&gt; 90 Days)</option>
          <option value="quarantined">Quarantined Lots</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {/* Location Filter */}
      <div className="relative">
        <select
          aria-label="Filter by storage location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="all">All Storage Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );

  // Superadmin Header Actions
  const headerActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setIsInwardModalOpen(true)}
        className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Inward Batch Lot</span>
      </button>

      <button
        type="button"
        onClick={handleExportCsv}
        className="h-8 px-2.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Export CSV</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Summary Metric Cards Matching Superadmin Directory Format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Critical Expiry (&lt; 30d)</span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-rose-700 leading-none">
              {stats.critical} Batches
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Immediate FEFO dispatch or return</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Warning Window (30-60d)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-700 leading-none">
              {stats.warning} Batches
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Fast-track OPD & inpatient dispense</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Early Notice (60-90d)</span>
            <CalendarClock className="w-3.5 h-3.5 text-yellow-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-yellow-700 leading-none">
              {stats.notice} Batches
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Normal hospital rotation schedule</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Monitored Lots</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-[#006a4e] leading-none">
              {stats.total} Lots
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Valuation: ৳ {stats.totalValuation.toLocaleString()}</p>
        </div>
      </div>

      {/* Selected Batch Quick View Card (matching Superadmin directory) */}
      {selectedBatch && (
        <div className="bg-white border border-[#006a4e]/25 rounded-[3px] p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                  LOT: {selectedBatch.batchNo}
                </span>
                <span className="text-sm font-semibold text-slate-800">{selectedBatch.medicineName}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-[#006a4e] border border-emerald-200">
                  {selectedBatch.dosageForm}
                </span>
                {selectedBatch.isColdChain && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-300 inline-flex items-center gap-1">
                    <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                    Cold Chain (2-8°C)
                  </span>
                )}
                {selectedBatch.isQuarantined && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-600 text-white">
                    QUARANTINED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generic: <span className="font-normal text-slate-600">{selectedBatch.genericName}</span> · Mfg: <span className="font-normal text-slate-600">{selectedBatch.manufacturer}</span> · Storage: <span className="font-normal text-slate-600">{selectedBatch.location}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTransferTargetBatch(selectedBatch);
                  setTransferUnits(Math.min(selectedBatch.quantity, 100));
                  setIsTransferModalOpen(true);
                }}
                disabled={selectedBatch.isQuarantined || selectedBatch.quantity <= 0}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Dispatch FEFO</span>
              </button>
              <button
                type="button"
                onClick={() => toggleQuarantine(selectedBatch.id)}
                className={`h-8 px-3 rounded-[3px] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  selectedBatch.isQuarantined
                    ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{selectedBatch.isQuarantined ? 'Quarantined (Release)' : 'Quarantine Lot'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-300 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center cursor-pointer shrink-0 ml-1"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Batch Key Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Stock Quantity</span>
              <span className="font-semibold text-slate-800 text-xs">
                {selectedBatch.quantity.toLocaleString()} Units
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Manufactured</span>
              <span className="font-mono text-slate-600 text-xs">{selectedBatch.mfgDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Expiry Date</span>
              <span className="font-mono text-slate-600 text-xs">{selectedBatch.expDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Shelf Life Remaining</span>
              <span
                className={`font-medium text-xs ${
                  selectedBatch.daysRemaining <= 30
                    ? 'text-rose-600'
                    : selectedBatch.daysRemaining <= 60
                    ? 'text-amber-600'
                    : 'text-[#006a4e]'
                }`}
              >
                {selectedBatch.daysRemaining} Days
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Lot Valuation</span>
              <span className="font-medium text-slate-700 text-xs">
                ৳ {(selectedBatch.quantity * selectedBatch.unitCost).toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Superadmin Enterprise DataTable */}
      <DataTable<BatchRecord>
        data={filteredBatches}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search medicine name, generic, batch lot, or rack location..."
        searchFilter={(item, query) =>
          item.medicineName.toLowerCase().includes(query.toLowerCase()) ||
          item.genericName.toLowerCase().includes(query.toLowerCase()) ||
          item.batchNo.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase()) ||
          item.manufacturer.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={toolbarFilters}
        headerActions={headerActions}
        pageSizeOptions={[10, 20, 50, 100]}
        defaultPageSize={20}
        emptyTitle="No expiring batches found"
        emptyDescription="All medicine batches within this filter range are within safe shelf life."
        showSerial={true}
        onRowClick={(row) => setSelectedBatch(row)}
      />

      {/* INWARD BATCH LOT MODAL */}
      {isInwardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-lg w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
                  <PackagePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Inward Batch Lot Delivery</h3>
                  <p className="text-[11px] text-slate-500">Record inbound delivery lot from pharmaceutical supplier</p>
                </div>
              </div>
              <button
                onClick={() => setIsInwardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInwardBatchSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Napa Extra"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Batch / Lot Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatchNo}
                    onChange={(e) => setNewBatchNo(e.target.value)}
                    placeholder="e.g. NPX-2025-01"
                    className="w-full h-8 px-2.5 font-mono uppercase rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Generic Name
                  </label>
                  <input
                    type="text"
                    value={newGenericName}
                    onChange={(e) => setNewGenericName(e.target.value)}
                    placeholder="e.g. Paracetamol + Caffeine"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Manufacturer
                  </label>
                  <select
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e] cursor-pointer"
                  >
                    <option value="Square Pharmaceuticals">Square Pharmaceuticals</option>
                    <option value="Beximco Pharmaceuticals">Beximco Pharmaceuticals</option>
                    <option value="Incepta Pharmaceuticals">Incepta Pharmaceuticals</option>
                    <option value="Renata Limited">Renata Limited</option>
                    <option value="Healthcare Pharma">Healthcare Pharma</option>
                    <option value="Sanofi Bangladesh">Sanofi Bangladesh</option>
                    <option value="Grifols Biologicals">Grifols Biologicals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Form
                  </label>
                  <select
                    value={newDosageForm}
                    onChange={(e) => setNewDosageForm(e.target.value)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e] cursor-pointer"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Infusion">Infusion</option>
                    <option value="Prefilled Syringe">Prefilled Syringe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Strength
                  </label>
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="500mg"
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e] cursor-pointer"
                  >
                    <option value="Analgesics">Analgesics</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Anticoagulants">Anticoagulants</option>
                    <option value="Blood Derivatives">Blood Derivatives</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mfg Date
                  </label>
                  <input
                    type="month"
                    required
                    value={newMfgDate}
                    onChange={(e) => setNewMfgDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpDate}
                    onChange={(e) => setNewExpDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Storage Location
                  </label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e] cursor-pointer"
                  >
                    <option value="Central Depot (Bay 01)">Central Depot (Bay 01)</option>
                    <option value="Central Depot (Bay 02)">Central Depot (Bay 02)</option>
                    <option value="Central Depot (Bay 03)">Central Depot (Bay 03)</option>
                    <option value="Central Medical Store (Cold Chain 2-8°C)">Central Medical Store (Cold Chain 2-8°C)</option>
                    <option value="Dhanmondi OPD Pharmacy (Shelf B-4)">Dhanmondi OPD Pharmacy (Shelf B-4)</option>
                    <option value="Uttara Branch Pharmacy (Aisle 2)">Uttara Branch Pharmacy (Aisle 2)</option>
                    <option value="Mirpur Branch Pharmacy (Shelf A-3)">Mirpur Branch Pharmacy (Shelf A-3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Unit Cost (৳)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    required
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsColdChain}
                    onChange={(e) => setNewIsColdChain(e.target.checked)}
                    className="rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]"
                  />
                  <span className="text-xs text-slate-700 font-medium flex items-center gap-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
                    Cold Chain Storage Required (2-8°C)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInwardModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Record Inward Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEFO DISPATCH MODAL */}
      {isTransferModalOpen && transferTargetBatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">FEFO Fast-Track Dispatch</h3>
                  <p className="text-[11px] text-slate-500">First-Expiry First-Out hospital branch reallocation</p>
                </div>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3 mt-4 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{transferTargetBatch.medicineName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Lot: <span className="font-mono font-bold text-slate-700">{transferTargetBatch.batchNo}</span> · Current Stock: <span className="font-bold text-slate-800">{transferTargetBatch.quantity.toLocaleString()} units</span>
                </div>
                <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
                  Expiry: {transferTargetBatch.expDate} ({transferTargetBatch.daysRemaining} days remaining)
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Target Hospital Branch / Ward *
                </label>
                <select
                  value={transferDestination}
                  onChange={(e) => setTransferDestination(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e] cursor-pointer"
                >
                  <option value="Dhanmondi OPD Pharmacy">Dhanmondi OPD Pharmacy (High Volume)</option>
                  <option value="Inpatient Emergency Ward (Main)">Inpatient Emergency Ward (Main)</option>
                  <option value="ICU & CCU Satellite Pharmacy">ICU & CCU Satellite Pharmacy</option>
                  <option value="Uttara Branch Pharmacy">Uttara Branch Pharmacy</option>
                  <option value="Mirpur Center Dispensary">Mirpur Center Dispensary</option>
                  <option value="Old Dhaka Care Clinic">Old Dhaka Care Clinic</option>
                  <option value="Chattogram Hub Pharmacy">Chattogram Hub Pharmacy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Transfer Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={transferTargetBatch.quantity}
                    required
                    value={transferUnits}
                    onChange={(e) => setTransferUnits(parseInt(e.target.value) || 0)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Priority / Urgency
                  </label>
                  <select
                    value={transferUrgency}
                    onChange={(e) => setTransferUrgency(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e] cursor-pointer"
                  >
                    <option value="Standard">Standard Routine</option>
                    <option value="Urgent">Urgent Priority</option>
                    <option value="Stat ICU">Stat Emergency</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Execute FEFO Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
