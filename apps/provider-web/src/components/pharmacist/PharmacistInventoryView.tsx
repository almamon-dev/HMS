import React, { useMemo, useState } from 'react';
import {
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  PackagePlus,
  Plus,
  Search,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Send,
  X,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { DropdownSelect } from '../common/DropdownSelect';
import {
  PHARMACIST_INVENTORY_MASTER,
  HOSPITAL_10_BRANCHES,
  MedicineItem,
  BranchStockItem,
  SaleUnit,
} from '../../data/pharmacistInventoryData';

// Helper to format stock quantities across Pc, Strip, Box
function formatStock(
  pieces: number,
  unit: SaleUnit,
  unitsPerStrip: number,
  unitsPerBox: number
): { main: string; sub: string } {
  if (unit === 'box' && unitsPerBox > 1) {
    const boxes = (pieces / unitsPerBox).toFixed(1).replace('.0', '');
    return {
      main: `${boxes} Box${parseFloat(boxes) !== 1 ? 'es' : ''}`,
      sub: `${pieces.toLocaleString()} pcs`,
    };
  }

  if (unit === 'strip' && unitsPerStrip > 1) {
    const strips = (pieces / unitsPerStrip).toFixed(1).replace('.0', '');
    return {
      main: `${strips} Strip${parseFloat(strips) !== 1 ? 's' : ''}`,
      sub: `${pieces.toLocaleString()} pcs`,
    };
  }

  return {
    main: `${pieces.toLocaleString()} Pcs`,
    sub: `${pieces.toLocaleString()} units`,
  };
}

// Packaging Unit Switcher (Piece / Strip / Box) - Matching Image 1 with NO 'Unit:' label
interface PackagingUnitSwitcherProps {
  unitsPerStrip: number;
  unitsPerBox: number;
  activeUnit: SaleUnit;
  onChange: (u: SaleUnit) => void;
  className?: string;
}

const PackagingUnitSwitcher: React.FC<PackagingUnitSwitcherProps> = ({
  unitsPerStrip,
  unitsPerBox,
  activeUnit,
  onChange,
  className = '',
}) => {
  const units: SaleUnit[] = ['piece', 'strip', 'box'];
  const availableUnits = units.filter(
    (u) =>
      u === 'piece' ||
      (u === 'strip' && unitsPerStrip > 1) ||
      (u === 'box' && unitsPerBox > 1)
  );

  return (
    <div
      className={`inline-flex items-center rounded border border-slate-300 bg-white p-0.5 divide-x divide-slate-200 select-none shadow-2xs ${className}`}
    >
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
            className={`px-3 py-1 text-xs font-semibold transition-colors cursor-pointer first:rounded-l-[2px] last:rounded-r-[2px] focus:outline-none ${
              active
                ? 'bg-[#006a4e] text-white font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export const PharmacistInventoryView: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>(PHARMACIST_INVENTORY_MASTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'critical'>('all');

  // Currently selected medicine for detail panel (default: first medicine)
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>(
    PHARMACIST_INVENTORY_MASTER[0]?.id || ''
  );

  // Active Packaging Unit in Detail Panel
  const [activeUnit, setActiveUnit] = useState<SaleUnit>('box');
  const [detailTab, setDetailTab] = useState<'branches' | 'batches'>('branches');

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isReceiveStockOpen, setIsReceiveStockOpen] = useState(false);
  const [receiveStockMedId, setReceiveStockMedId] = useState<string>('');
  const [dispatchBranch, setDispatchBranch] = useState<BranchStockItem | null>(null);

  // Add Medicine Form State
  const [newBrandName, setNewBrandName] = useState('');
  const [newGenericName, setNewGenericName] = useState('');
  const [newDosageForm, setNewDosageForm] = useState('Tablet');
  const [newStrength, setNewStrength] = useState('500mg');
  const [newCategory, setNewCategory] = useState('Analgesics');
  const [newManufacturer, setNewManufacturer] = useState('Square Pharmaceuticals Ltd.');
  const [newUnitPrice, setNewUnitPrice] = useState('2.50');
  const [newUnitsPerStrip, setNewUnitsPerStrip] = useState(10);
  const [newUnitsPerBox, setNewUnitsPerBox] = useState(200);
  const [newInitialDepotBoxes, setNewInitialDepotBoxes] = useState(50);
  const [newReorderLevel, setNewReorderLevel] = useState(500);

  // Receive Stock Form State
  const [rcvBatchNo, setRcvBatchNo] = useState(`BTH-${Date.now().toString().slice(-5)}`);
  const [rcvExpiry, setRcvExpiry] = useState('2028-12-31');
  const [rcvQuantity, setRcvQuantity] = useState(20);
  const [rcvUnit, setRcvUnit] = useState<SaleUnit>('box');
  const [rcvSupplier, setRcvSupplier] = useState('Square Life Sciences');
  const [rcvPoNumber, setRcvPoNumber] = useState(`PO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [rcvRack, setRcvRack] = useState('Central Depot - Bay 01');

  // Branch Dispatch Form State
  const [dispatchQty, setDispatchQty] = useState(2);
  const [dispatchUnit, setDispatchUnit] = useState<SaleUnit>('box');

  // Categories
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(medicines.map((m) => m.category))).sort()];
  }, [medicines]);

  // Selected Medicine object
  const selectedMedicine = useMemo(() => {
    return medicines.find((m) => m.id === selectedMedicineId) || medicines[0];
  }, [medicines, selectedMedicineId]);

  // Filtered medicine list for left panel
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q);

      let matchStatus = true;
      const hasLowBranch = m.branches.some((b) => b.status === 'Low Stock' || b.status === 'Critical');
      if (statusFilter === 'low') {
        matchStatus = hasLowBranch;
      } else if (statusFilter === 'critical') {
        matchStatus = m.status === 'Critical' || m.branches.some((b) => b.status === 'Critical');
      }

      return matchCat && matchSearch && matchStatus;
    });
  }, [medicines, searchQuery, categoryFilter, statusFilter]);

  // Stats for top bar
  const stats = useMemo(() => {
    const totalSkus = medicines.length;
    const lowCount = medicines.filter((m) =>
      m.branches.some((b) => b.status === 'Low Stock' || b.status === 'Critical')
    ).length;
    const criticalCount = medicines.filter(
      (m) => m.status === 'Critical' || m.branches.some((b) => b.status === 'Critical')
    ).length;
    return { totalSkus, lowCount, criticalCount };
  }, [medicines]);

  // Under-min branches of currently selected medicine
  const selectedUnderMinBranches = useMemo(() => {
    if (!selectedMedicine) return [];
    return selectedMedicine.branches.filter(
      (b) => b.status === 'Low Stock' || b.status === 'Critical'
    );
  }, [selectedMedicine]);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1-Click Auto-Rebalance
  const handleAutoRebalance = (med: MedicineItem) => {
    const lowBranches = med.branches.filter(
      (b) => b.status === 'Low Stock' || b.status === 'Critical'
    );
    if (lowBranches.length === 0) return;

    const totalDeficit = lowBranches.reduce(
      (sum, b) => sum + Math.max(0, b.reorderLevel - b.currentStock),
      0
    );
    const safeBuffer = Math.max(0, med.centralStock - med.reorderLevel);

    if (safeBuffer <= 0) {
      alert(`Central Depot has ${med.centralStock.toLocaleString()} pcs, at or below safe buffer.`);
      return;
    }

    const ratio = Math.min(1, safeBuffer / Math.max(1, totalDeficit));
    let deducted = 0;

    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id !== med.id) return item;
        const newBranches = item.branches.map((b) => {
          if (b.status !== 'Low Stock' && b.status !== 'Critical') return b;
          const deficit = Math.max(0, b.reorderLevel - b.currentStock);
          const added = Math.floor(deficit * ratio);
          deducted += added;
          const newQty = b.currentStock + added;
          let newStat: 'In Stock' | 'Low Stock' | 'Critical' = 'In Stock';
          if (newQty <= b.reorderLevel * 0.4) newStat = 'Critical';
          else if (newQty <= b.reorderLevel) newStat = 'Low Stock';
          return { ...b, currentStock: newQty, status: newStat };
        });

        return {
          ...item,
          centralStock: item.centralStock - deducted,
          branches: newBranches,
        };
      })
    );

    triggerToast(`⚡ Auto-rebalanced ${deducted.toLocaleString()} pcs across ${lowBranches.length} branch(es)!`);
  };

  // Handle Add Medicine Submit
  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newGenericName.trim()) {
      alert('Please fill in Brand Name and Generic Name.');
      return;
    }

    const cleanCode =
      newBrandName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '') +
      '-' +
      newStrength.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '');

    const initialPcs = newInitialDepotBoxes * (newUnitsPerBox || 100);
    const parsedPrice = parseFloat(newUnitPrice) || 2.5;

    // Generate stock for all 10 branches
    const newBranches: BranchStockItem[] = HOSPITAL_10_BRANCHES.map((b, idx) => {
      const min = Math.round(newReorderLevel * (0.6 + (idx % 5) * 0.15));
      const current = Math.round(min * 1.5);
      return {
        branchId: b.branchId,
        branchName: b.branchName,
        shortName: b.shortName,
        city: b.city,
        zone: b.zone,
        rackLocation: `${b.rackPrefix}-0${(idx % 4) + 1}, Bin ${(idx % 3) + 1}`,
        currentStock: current,
        reorderLevel: min,
        maxStock: min * 3,
        status: 'In Stock',
      };
    });

    const newMed: MedicineItem = {
      id: `med-${Date.now()}`,
      code: cleanCode || `MED-${Date.now().toString().slice(-4)}`,
      brandName: newBrandName.trim(),
      genericName: newGenericName.trim(),
      dosageForm: newDosageForm,
      strength: newStrength.trim() || '500mg',
      manufacturer: newManufacturer.trim() || 'Square Pharmaceuticals Ltd.',
      category: newCategory,
      centralStock: initialPcs,
      unitPrice: parsedPrice,
      reorderLevel: newReorderLevel,
      status: 'In Stock',
      units_per_strip: newUnitsPerStrip,
      units_per_box: newUnitsPerBox,
      branches: newBranches,
      batches: [
        {
          id: `bth-${Date.now()}`,
          batchNo: `BTH-INIT-${Date.now().toString().slice(-4)}`,
          expiryDate: '2028-12-31',
          qtyPcs: initialPcs,
          location: 'Central Depot - Bay 01',
        },
      ],
    };

    setMedicines((prev) => [newMed, ...prev]);
    setSelectedMedicineId(newMed.id);
    setIsAddMedicineOpen(false);

    // Reset Form
    setNewBrandName('');
    setNewGenericName('');
    setNewStrength('500mg');
    triggerToast(`✓ Registered new medicine "${newMed.brandName}" in formulary!`);
  };

  // Handle Receive Stock (GRN) Submit
  const handleReceiveStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMed = medicines.find((m) => m.id === receiveStockMedId) || selectedMedicine;
    if (!targetMed || rcvQuantity <= 0) return;

    const mult =
      rcvUnit === 'box'
        ? targetMed.units_per_box
        : rcvUnit === 'strip'
          ? targetMed.units_per_strip
          : 1;
    const piecesToAdd = rcvQuantity * mult;

    const newBatch = {
      id: `batch-${Date.now()}`,
      batchNo: rcvBatchNo.trim() || `BTH-${Date.now().toString().slice(-4)}`,
      expiryDate: rcvExpiry,
      qtyPcs: piecesToAdd,
      location: rcvRack || 'Central Depot',
    };

    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id !== targetMed.id) return m;
        return {
          ...m,
          centralStock: m.centralStock + piecesToAdd,
          batches: [newBatch, ...(m.batches || [])],
        };
      })
    );

    setIsReceiveStockOpen(false);
    triggerToast(
      `✓ Received ${rcvQuantity} ${rcvUnit}${rcvQuantity > 1 ? 's' : ''} (${piecesToAdd.toLocaleString()} pcs) of ${targetMed.brandName} into Central Depot!`
    );
  };

  // Handle Dispatch from Depot to Branch
  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine || !dispatchBranch || dispatchQty <= 0) return;

    const mult =
      dispatchUnit === 'box'
        ? selectedMedicine.units_per_box
        : dispatchUnit === 'strip'
          ? selectedMedicine.units_per_strip
          : 1;
    const pieces = dispatchQty * mult;

    if (selectedMedicine.centralStock < pieces) {
      alert(`Insufficient Central Depot stock! Available: ${selectedMedicine.centralStock.toLocaleString()} pcs.`);
      return;
    }

    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id !== selectedMedicine.id) return item;
        const newBranches = item.branches.map((b) => {
          if (b.branchId !== dispatchBranch.branchId) return b;
          const newQty = b.currentStock + pieces;
          let newStat: 'In Stock' | 'Low Stock' | 'Critical' = 'In Stock';
          if (newQty <= b.reorderLevel * 0.4) newStat = 'Critical';
          else if (newQty <= b.reorderLevel) newStat = 'Low Stock';
          return { ...b, currentStock: newQty, status: newStat };
        });

        return {
          ...item,
          centralStock: item.centralStock - pieces,
          branches: newBranches,
        };
      })
    );

    const bName = dispatchBranch.shortName;
    setDispatchBranch(null);
    triggerToast(`✓ Dispatched ${dispatchQty} ${dispatchUnit}(s) (${pieces.toLocaleString()} pcs) to ${bName}!`);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Code', 'Brand', 'Generic', 'Form', 'Central Depot (Pcs)', 'MRP (BDT)'];
    const rows = filteredMedicines.map((m) => [
      `"${m.code}"`,
      `"${m.brandName}"`,
      `"${m.genericName}"`,
      `"${m.dosageForm}"`,
      m.centralStock,
      m.unitPrice.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 space-y-2 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      {/* Page Header: Title + Primary Action Buttons (Add Medicine, Receive Stock, Export) */}
      <div className="shrink-0 flex items-center justify-between gap-3">
        <PageHeader
          title="Inventory & Formulary Master"
          description="Hospital Formulary Registry, Central Depot Inventory & Branch Stock Levels"
        />
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { setIsReceiveStockOpen(false); setDispatchBranch(null); setIsAddMedicineOpen(true); }}
            className="h-7.5 px-3 rounded-[2px] bg-[#006a4e] hover:bg-[#00543e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAddMedicineOpen(false);
              setDispatchBranch(null);
              setReceiveStockMedId(selectedMedicineId || medicines[0]?.id || '');
              setIsReceiveStockOpen(true);
            }}
            className="h-7.5 px-3 rounded-[2px] bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Receive Stock</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="h-7.5 px-3 rounded-[2px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Clean, Simple Filter Bar - Desktop Toolbar */}
      <div className="shrink-0 bg-white border border-slate-200 rounded-[2px] px-2.5 py-1.5 flex items-center justify-between gap-2.5 shadow-2xs">
        {/* Left: Quick Search & Category Filter */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicine, generic, or SKU code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-full pl-8 pr-2.5 text-xs border border-slate-300 rounded-[2px] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#006a4e]"
            />
          </div>

          <DropdownSelect
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            options={categories}
            width="w-40"
          />
        </div>

        {/* Right: 3 Simple Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-[2px] border border-slate-200 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({stats.totalSkus})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('low')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === 'low'
                ? 'bg-amber-500 text-white shadow-2xs font-bold'
                : 'text-amber-800 hover:text-amber-900'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Low Stock ({stats.lowCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('critical')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-2xs font-bold'
                : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Critical ({stats.criticalCount})</span>
          </button>
        </div>
      </div>

      {/* 2-Panel Master-Detail Workstation */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-2.5 items-stretch overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT PANEL: Medicine Formulary Table (No Truncate, Stacked) */}
        {/* ======================================================== */}
        <div className="w-full lg:w-[380px] xl:w-[410px] 2xl:w-[440px] shrink-0 bg-white border border-slate-200 rounded-[3px] shadow-2xs overflow-hidden flex flex-col h-full min-h-0">
          <div className="shrink-0 px-2.5 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>Formulary Catalog ({filteredMedicines.length})</span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal">Click to select</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-2xs border-b border-slate-200 text-slate-700 font-bold text-[11px] z-10">
                <tr>
                  <th className="px-2 py-1.5 w-16">Code</th>
                  <th className="px-2 py-1.5">Medicine & Generic</th>
                  <th className="px-2 py-1.5 text-right w-16">Depot</th>
                  <th className="px-2 py-1.5 text-center w-14">Status</th>
                  <th className="px-1 py-1.5 text-right w-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-slate-400 text-xs">
                      No medicines found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((m) => {
                    const isSelected = selectedMedicine?.id === m.id;
                    const lowBranches = m.branches.filter(
                      (b) => b.status === 'Low Stock' || b.status === 'Critical'
                    );

                    return (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedMedicineId(m.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#e6f4ea] border-l-[3px] border-l-[#006a4e] font-medium'
                            : 'hover:bg-slate-50/80 border-l-[3px] border-l-transparent'
                        }`}
                      >
                        {/* Code */}
                        <td className="px-2 py-1.5 font-mono text-[10.5px] text-slate-400 whitespace-nowrap align-top">
                          {m.code}
                        </td>

                        {/* Medicine - User requested: No text limit, new lines for generic and form */}
                        <td className="px-2 py-1.5 min-w-0 align-top">
                          {/* Line 1: Brand & Strength */}
                          <div className="font-bold text-slate-900 text-xs leading-snug break-words">
                            {m.brandName} <span className="font-semibold text-slate-500 text-[11px]">({m.strength})</span>
                          </div>
                          {/* Line 2: Generic Name on its own line (NO TRUNCATION) */}
                          <div className="text-[11.5px] font-medium text-slate-600 leading-snug break-words mt-0.5">
                            {m.genericName}
                          </div>
                          {/* Line 3: Dosage Form & Category badge */}
                          <div className="text-[10px] text-slate-400 leading-tight mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-[2px] font-medium">
                              {m.dosageForm}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{m.category}</span>
                          </div>
                        </td>

                        {/* Central Stock */}
                        <td className="px-2 py-1.5 text-right font-bold text-slate-900 whitespace-nowrap text-xs align-top">
                          <div>{m.centralStock.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 font-normal">pcs</div>
                        </td>

                        {/* Branch Health Status Badge */}
                        <td className="px-2 py-1.5 text-center whitespace-nowrap align-top">
                          {lowBranches.length > 0 ? (
                            <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-0.5">
                              ⚠️ {lowBranches.length}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ OK
                            </span>
                          )}
                        </td>

                        {/* Arrow */}
                        <td className="px-1 py-1.5 text-right text-slate-400 align-top">
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected ? 'text-[#006a4e] translate-x-0.5' : 'text-slate-300'
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Multi-Branch Stock & Formulary Details      */}
        {/* ======================================================== */}
        <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-[3px] shadow-2xs overflow-hidden flex flex-col h-full min-h-0">
          {selectedMedicine ? (
            <>
              {/* Header: Medicine Specs, Packaging Switcher, Depot Status & Auto-Rebalance */}
              <div className="shrink-0 px-3.5 py-2 bg-white border-b border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Line 1: Brand name, strength, SKU code, category */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">
                        {selectedMedicine.brandName}
                      </h3>
                      <span className="text-xs text-slate-600 font-semibold">({selectedMedicine.strength})</span>
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-50 text-[#006a4e] border border-emerald-200 text-[11px] font-mono font-bold">
                        {selectedMedicine.code}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {selectedMedicine.dosageForm}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-600 text-[11px]">
                        {selectedMedicine.category}
                      </span>
                    </div>

                    {/* Line 2: Generic name, manufacturer, MRP (Full text, NO truncation) */}
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">
                        Generic: {selectedMedicine.genericName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>Mfg: {selectedMedicine.manufacturer}</span>
                      <span className="text-slate-300">•</span>
                      <span>
                        MRP: <strong className="text-slate-800 font-bold">৳ {selectedMedicine.unitPrice.toFixed(2)}/pc</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-[11px]">
                        (1 Strip = {selectedMedicine.units_per_strip} pcs, 1 Box = {selectedMedicine.units_per_box} pcs)
                      </span>
                    </div>
                  </div>

                  {/* Packaging Unit Switcher (Matching Image 1 precisely) */}
                  <div className="shrink-0">
                    <PackagingUnitSwitcher
                      unitsPerStrip={selectedMedicine.units_per_strip}
                      unitsPerBox={selectedMedicine.units_per_box}
                      activeUnit={activeUnit}
                      onChange={(u) => setActiveUnit(u)}
                    />
                  </div>
                </div>

                {/* Status Notice Toast */}
                {toastMessage && (
                  <div className="mt-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-[2px] flex items-center justify-between animate-in fade-in duration-100">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{toastMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setToastMessage(null)}
                      className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Single-Line Depot Status & Action Controls */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-xs">Central Depot:</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {formatStock(
                        selectedMedicine.centralStock,
                        activeUnit,
                        selectedMedicine.units_per_strip,
                        selectedMedicine.units_per_box
                      ).main}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({selectedMedicine.centralStock.toLocaleString()} pcs)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedUnderMinBranches.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAutoRebalance(selectedMedicine)}
                        className="px-2.5 py-1 rounded-[2px] bg-[#006a4e] hover:bg-[#00543e] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                        title="Automatically refill all low branches from Central Depot"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Auto-Rebalance ({selectedUnderMinBranches.length} low)</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>All 10 Branches Optimal</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddMedicineOpen(false);
                        setDispatchBranch(null);
                        setReceiveStockMedId(selectedMedicine.id);
                        setIsReceiveStockOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <PackagePlus className="w-3 h-3 text-[#006a4e]" />
                      <span>+ Restock Depot</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs: Branches vs FEFO Batches */}
              <div className="shrink-0 px-3.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailTab('branches')}
                    className={`py-1.5 font-semibold border-b-2 transition-colors cursor-pointer text-xs ${
                      detailTab === 'branches'
                        ? 'border-[#006a4e] text-[#006a4e]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Branch Stock ({selectedMedicine.branches.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailTab('batches')}
                    className={`py-1.5 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${
                      detailTab === 'batches'
                        ? 'border-[#006a4e] text-[#006a4e]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CalendarClock className="w-3.5 h-3.5" />
                    <span>Batches & FEFO ({selectedMedicine.batches?.length || 0})</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400">
                  {detailTab === 'branches' ? '10 Network Hospitals' : 'FEFO Expiry Schedule'}
                </span>
              </div>

              {/* Detail Content (Edge-to-Edge: All 10 Branches visible with zero vertical scroll!) */}
              {detailTab === 'branches' ? (
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col justify-start">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs z-10">
                      <tr>
                        <th className="px-3.5 py-1.5">Hospital Branch</th>
                        <th className="px-2.5 py-1.5">Rack Location</th>
                        <th className="px-2.5 py-1.5 text-right">Current Stock</th>
                        <th className="px-2.5 py-1.5 text-right">Safety Min</th>
                        <th className="px-2.5 py-1.5 text-center">Status</th>
                        <th className="px-3.5 py-1.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedMedicine.branches.map((br) => {
                        const stockFmt = formatStock(
                          br.currentStock,
                          activeUnit,
                          selectedMedicine.units_per_strip,
                          selectedMedicine.units_per_box
                        );
                        const minFmt = formatStock(
                          br.reorderLevel,
                          activeUnit,
                          selectedMedicine.units_per_strip,
                          selectedMedicine.units_per_box
                        );

                        let badgeCls = 'bg-slate-100 text-slate-700 border-slate-200';
                        if (br.status === 'In Stock')
                          badgeCls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                        else if (br.status === 'Low Stock')
                          badgeCls = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
                        else if (br.status === 'Critical')
                          badgeCls = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';

                        return (
                          <tr
                            key={br.branchId}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-3.5 py-1 whitespace-nowrap">
                              <span className="font-semibold text-slate-900 text-xs">{br.shortName}</span>
                              <span className="text-[11px] text-slate-400 ml-1.5">({br.city})</span>
                            </td>
                            <td className="px-2.5 py-1 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                              {br.rackLocation}
                            </td>
                            <td className="px-2.5 py-1 text-right whitespace-nowrap">
                              <span className="font-bold text-slate-900 text-xs">{stockFmt.main}</span>
                              <span className="text-[11px] text-slate-400 ml-1.5">({stockFmt.sub})</span>
                            </td>
                            <td className="px-2.5 py-1 text-right text-slate-700 text-xs font-semibold whitespace-nowrap">
                              {minFmt.main}
                            </td>
                            <td className="px-2.5 py-1 text-center whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-[2px] text-[11px] font-semibold border ${badgeCls}`}>
                                {br.status}
                              </span>
                            </td>
                            <td className="px-3.5 py-1 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddMedicineOpen(false);
                                  setIsReceiveStockOpen(false);
                                  setDispatchBranch(br);
                                  setDispatchQty(br.status !== 'In Stock' ? 2 : 1);
                                  setDispatchUnit(activeUnit);
                                }}
                                className={`h-6 px-2.5 rounded-[2px] text-[11px] font-semibold transition-colors cursor-pointer ${
                                  br.status === 'Critical'
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white font-bold'
                                    : br.status === 'Low Stock'
                                      ? 'bg-[#006a4e] hover:bg-[#00543e] text-white font-bold'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                }`}
                              >
                                {br.status === 'Critical' ? 'Refill Now' : br.status === 'Low Stock' ? 'Refill' : 'Dispatch'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* FEFO Batches Tab */
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col justify-start">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs z-10">
                      <tr>
                        <th className="px-3.5 py-1.5">Batch No</th>
                        <th className="px-2.5 py-1.5">Warehouse Location</th>
                        <th className="px-2.5 py-1.5">Expiry Date</th>
                        <th className="px-2.5 py-1.5 text-center">Shelf Life Status</th>
                        <th className="px-3.5 py-1.5 text-right">Available Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedMedicine.batches || []).map((b, idx) => {
                        const expDate = new Date(b.expiryDate);
                        const isExpired = expDate < new Date();
                        const isSoon = !isExpired && expDate.getTime() - Date.now() < 180 * 24 * 3600 * 1000;

                        return (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="px-3.5 py-1.5 font-mono font-semibold text-slate-900 text-xs">
                              #{idx + 1} {b.batchNo}
                            </td>
                            <td className="px-2.5 py-1.5 text-slate-600 text-xs">{b.location}</td>
                            <td className="px-2.5 py-1.5 text-slate-800 text-xs">
                              {expDate.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="px-2.5 py-1.5 text-center">
                              {isExpired ? (
                                <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                                  Expired
                                </span>
                              ) : isSoon ? (
                                <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                  Expiring Soon (&lt;6mo)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  Valid / Active
                                </span>
                              )}
                            </td>
                            <td className="px-3.5 py-1.5 text-right font-bold text-slate-900 text-xs">
                              {formatStock(
                                b.qtyPcs,
                                activeUnit,
                                selectedMedicine.units_per_strip,
                                selectedMedicine.units_per_box
                              ).main}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-6">
              Select a medicine from the left list to view details and branch stocks.
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW MEDICINE TO FORMULARY                   */}
      {/* ======================================================== */}
      {isAddMedicineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[4px] shadow-xl border border-slate-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[2px] bg-[#006a4e] text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Medicine to Formulary</h3>
                  <p className="text-[11px] text-slate-500">Register brand, active generic ingredient and initial depot stock</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMedicineOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMedicineSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Napa Extend"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Generic Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol"
                    value={newGenericName}
                    onChange={(e) => setNewGenericName(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dosage Form</label>
                  <select
                    value={newDosageForm}
                    onChange={(e) => setNewDosageForm(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e] bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Ointment">Ointment</option>
                    <option value="IV Infusion">IV Infusion</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 665mg"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Analgesics"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Beximco Pharma"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Price / MRP (৳)</label>
                  <input
                    type="number"
                    step="0.05"
                    placeholder="2.50"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px] space-y-2">
                <div className="font-semibold text-slate-800 text-[11.5px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>Packaging & Initial Depot Stock</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Units / Strip</label>
                    <input
                      type="number"
                      min="1"
                      value={newUnitsPerStrip}
                      onChange={(e) => setNewUnitsPerStrip(parseInt(e.target.value) || 1)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Units / Box</label>
                    <input
                      type="number"
                      min="1"
                      value={newUnitsPerBox}
                      onChange={(e) => setNewUnitsPerBox(parseInt(e.target.value) || 1)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Initial Depot (Boxes)</label>
                    <input
                      type="number"
                      min="0"
                      value={newInitialDepotBoxes}
                      onChange={(e) => setNewInitialDepotBoxes(parseInt(e.target.value) || 0)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Safety Min (Pcs)</label>
                    <input
                      type="number"
                      min="50"
                      value={newReorderLevel}
                      onChange={(e) => setNewReorderLevel(parseInt(e.target.value) || 100)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 text-right">
                  Total Depot Stock ={' '}
                  <strong className="text-slate-900 font-bold">
                    {(newInitialDepotBoxes * (newUnitsPerBox || 100)).toLocaleString()} pcs
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddMedicineOpen(false)}
                  className="px-3 py-1.5 rounded-[2px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[2px] bg-[#006a4e] hover:bg-[#00543e] text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Medicine</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: RECEIVE STOCK / INVENTORY (GRN RESTOCK)          */}
      {/* ======================================================== */}
      {isReceiveStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[4px] shadow-xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[2px] bg-emerald-700 text-white flex items-center justify-center">
                  <PackagePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Receive Stock (Depot Restock / GRN)</h3>
                  <p className="text-[11px] text-slate-500">Record inbound delivery and update Central Depot inventory</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiveStockOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReceiveStockSubmit} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Medicine *</label>
                <select
                  value={receiveStockMedId || selectedMedicine?.id}
                  onChange={(e) => setReceiveStockMedId(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e] bg-white font-semibold text-slate-900"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brandName} ({m.strength}) • {m.genericName} [Depot: {m.centralStock.toLocaleString()} pcs]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={rcvBatchNo}
                    onChange={(e) => setRcvBatchNo(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] font-mono focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={rcvExpiry}
                    onChange={(e) => setRcvExpiry(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              {/* Quantity & Unit Selection */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-[2px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold text-xs">Received Quantity & Packaging Unit *</label>
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    {(() => {
                      const tMed = medicines.find((m) => m.id === receiveStockMedId) || selectedMedicine;
                      const mult =
                        rcvUnit === 'box'
                          ? tMed.units_per_box
                          : rcvUnit === 'strip'
                            ? tMed.units_per_strip
                            : 1;
                      return `= ${(rcvQuantity * mult).toLocaleString()} total pcs`;
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={rcvQuantity}
                    onChange={(e) => setRcvQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-8 w-24 px-2.5 text-xs font-bold border border-slate-300 rounded-[2px] bg-white text-center focus:outline-none focus:border-[#006a4e]"
                  />
                  <div className="inline-flex rounded border border-slate-300 bg-white p-0.5 divide-x divide-slate-200">
                    <button
                      type="button"
                      onClick={() => setRcvUnit('piece')}
                      className={`px-3 py-1 text-xs font-semibold cursor-pointer ${
                        rcvUnit === 'piece' ? 'bg-[#006a4e] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Pcs
                    </button>
                    <button
                      type="button"
                      onClick={() => setRcvUnit('strip')}
                      className={`px-3 py-1 text-xs font-semibold cursor-pointer ${
                        rcvUnit === 'strip' ? 'bg-[#006a4e] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Strips
                    </button>
                    <button
                      type="button"
                      onClick={() => setRcvUnit('box')}
                      className={`px-3 py-1 text-xs font-semibold cursor-pointer ${
                        rcvUnit === 'box' ? 'bg-[#006a4e] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Boxes
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supplier / Manufacturer</label>
                  <input
                    type="text"
                    value={rcvSupplier}
                    onChange={(e) => setRcvSupplier(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">PO / Invoice Number</label>
                  <input
                    type="text"
                    value={rcvPoNumber}
                    onChange={(e) => setRcvPoNumber(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Storage Location</label>
                <input
                  type="text"
                  value={rcvRack}
                  onChange={(e) => setRcvRack(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReceiveStockOpen(false)}
                  className="px-3 py-1.5 rounded-[2px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[2px] bg-[#006a4e] hover:bg-[#00543e] text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>Receive & Add Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DISPATCH STOCK TO SPECIFIC BRANCH                */}
      {/* ======================================================== */}
      {dispatchBranch && selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[4px] shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[2px] bg-[#006a4e] text-white flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dispatch Stock to Branch</h3>
                  <p className="text-[11px] text-slate-500">{dispatchBranch.shortName} ({dispatchBranch.city})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchBranch(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Medicine:</span>
                  <strong className="text-slate-900 font-bold">{selectedMedicine.brandName} ({selectedMedicine.strength})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="text-slate-800 font-semibold">{dispatchBranch.shortName} [{dispatchBranch.rackLocation}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch Status:</span>
                  <span className={`font-bold ${dispatchBranch.status === 'Critical' ? 'text-rose-600' : dispatchBranch.status === 'Low Stock' ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {dispatchBranch.status} ({dispatchBranch.currentStock.toLocaleString()} / min {dispatchBranch.reorderLevel.toLocaleString()} pcs)
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Central Depot Available:</span>
                  <strong className="text-emerald-700 font-bold">{selectedMedicine.centralStock.toLocaleString()} pcs</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dispatch Quantity & Unit *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={dispatchQty}
                    onChange={(e) => setDispatchQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-8 w-20 px-2 text-xs font-bold text-center border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                  <div className="inline-flex rounded border border-slate-300 bg-white p-0.5 divide-x divide-slate-200">
                    <button
                      type="button"
                      onClick={() => setDispatchUnit('piece')}
                      className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                        dispatchUnit === 'piece' ? 'bg-[#006a4e] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Pc
                    </button>
                    {selectedMedicine.units_per_strip > 1 && (
                      <button
                        type="button"
                        onClick={() => setDispatchUnit('strip')}
                        className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                          dispatchUnit === 'strip' ? 'bg-[#006a4e] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Strip ({selectedMedicine.units_per_strip})
                      </button>
                    )}
                    {selectedMedicine.units_per_box > 1 && (
                      <button
                        type="button"
                        onClick={() => setDispatchUnit('box')}
                        className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                          dispatchUnit === 'box' ? 'bg-[#006a4e] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Box ({selectedMedicine.units_per_box})
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Total Dispatched ={' '}
                  <strong className="text-slate-900 font-bold">
                    {(
                      dispatchQty *
                      (dispatchUnit === 'box'
                        ? selectedMedicine.units_per_box
                        : dispatchUnit === 'strip'
                          ? selectedMedicine.units_per_strip
                          : 1)
                    ).toLocaleString()}{' '}
                    pcs
                  </strong>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDispatchBranch(null)}
                  className="px-3 py-1.5 rounded-[2px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[2px] bg-[#006a4e] hover:bg-[#00543e] text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistInventoryView;
