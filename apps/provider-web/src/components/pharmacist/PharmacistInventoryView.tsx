import React, { useMemo, useState } from 'react';
import {
  ArrowRightLeft,
  CalendarClock,
  CheckCircle2,
  Download,
  Search,
  Sparkles,
  ChevronRight,
  Boxes,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { DropdownSelect } from '../common/DropdownSelect';
import {
  PHARMACIST_INVENTORY_MASTER,
  MedicineItem,
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

  // Simple Transfer State
  const [transferBranchId, setTransferBranchId] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(2);
  const [transferToast, setTransferToast] = useState<string | null>(null);

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

  // Handle 1-click Auto-Rebalance
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

    setTransferToast(`⚡ Rebalanced ${deducted.toLocaleString()} pcs to ${lowBranches.length} branch(es)!`);
    setTimeout(() => setTransferToast(null), 3500);
  };

  // Handle simple manual transfer
  const handleTransfer = () => {
    if (!selectedMedicine || transferAmount <= 0) return;

    const targetBranch =
      selectedMedicine.branches.find((b) => b.branchId === transferBranchId) ||
      selectedMedicine.branches[0];

    const multiplier =
      activeUnit === 'box'
        ? selectedMedicine.units_per_box
        : activeUnit === 'strip'
          ? selectedMedicine.units_per_strip
          : 1;
    const pieces = transferAmount * multiplier;

    if (selectedMedicine.centralStock < pieces) {
      alert(`Central Depot has only ${selectedMedicine.centralStock.toLocaleString()} pcs available.`);
      return;
    }

    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id !== selectedMedicine.id) return item;
        const newBranches = item.branches.map((b) => {
          if (b.branchId !== targetBranch.branchId) return b;
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

    const unitName =
      transferAmount > 1 && activeUnit === 'box'
        ? 'Boxes'
        : transferAmount > 1 && activeUnit === 'strip'
          ? 'Strips'
          : transferAmount > 1
            ? 'Pcs'
            : activeUnit === 'box'
              ? 'Box'
              : activeUnit === 'strip'
                ? 'Strip'
                : 'Pc';

    setTransferToast(
      `✓ Transferred ${transferAmount} ${unitName} (${pieces.toLocaleString()} pcs) to ${targetBranch.shortName}!`
    );
    setTimeout(() => setTransferToast(null), 3500);
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
    <div className="h-[calc(100vh-76px)] max-h-[calc(100vh-76px)] flex flex-col min-h-0 space-y-2">
      {/* Page Header */}
      <div className="shrink-0 flex items-center justify-between gap-3">
        <PageHeader
          title="Inventory & Multi-Branch Stock"
          description="Classic Hospital Formulary & Central Depot Multi-Branch Inventory"
        />
        <button
          type="button"
          onClick={handleExportCsv}
          className="px-3 py-1 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Clean, Simple Filter Bar - Java Style Desktop Toolbar */}
      <div className="shrink-0 bg-white border border-slate-200 rounded-[3px] p-2 flex items-center justify-between gap-3 flex-wrap shadow-2xs">
        {/* Left: Quick Search & Category Filter */}
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicine, generic, or SKU code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded-[2px] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#006a4e]"
            />
          </div>

          <DropdownSelect
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            options={categories}
            width="w-40"
          />
        </div>

        {/* Right: 3 Simple Status Filter Buttons (Zero Bloat) */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-[3px] border border-slate-200">
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

      {/* 2-Panel Master-Detail Workstation (Java Swing / Classic Desktop Style) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 items-stretch">
        {/* ======================================================== */}
        {/* LEFT PANEL: Medicine Formulary Table (7 Columns)        */}
        {/* ======================================================== */}
        <div className="col-span-12 xl:col-span-7 bg-white border border-slate-200 rounded-[3px] shadow-2xs overflow-hidden flex flex-col h-full min-h-0">
          <div className="shrink-0 px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>Hospital Formulary ({filteredMedicines.length} Medicines)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-normal">Click any row to inspect & transfer</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-2xs border-b border-slate-200 text-slate-700 font-bold text-[11px] z-10">
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Brand & Generic Name</th>
                  <th className="px-3 py-2">Dosage Form</th>
                  <th className="px-3 py-2 text-right">CMS Depot</th>
                  <th className="px-3 py-2 text-center">Branch Stock</th>
                  <th className="px-2 py-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
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
                        onClick={() => {
                          setSelectedMedicineId(m.id);
                          setTransferBranchId(lowBranches[0]?.branchId || m.branches[0].branchId);
                        }}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#e6f4ea] border-l-4 border-l-[#006a4e] font-medium'
                            : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                        }`}
                      >
                        {/* Code */}
                        <td className="px-3 py-2 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {m.code}
                        </td>

                        {/* Medicine */}
                        <td className="px-3 py-2">
                          <div className="font-bold text-slate-900 text-xs">
                            {m.brandName} <span className="font-normal text-slate-500">({m.strength})</span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 truncate max-w-[200px]">
                            {m.genericName}
                          </div>
                        </td>

                        {/* Form */}
                        <td className="px-3 py-2 text-slate-600">
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 text-[10.5px]">
                            {m.dosageForm}
                          </span>
                        </td>

                        {/* CMS Central Stock */}
                        <td className="px-3 py-2 text-right font-bold text-slate-900 whitespace-nowrap">
                          {m.centralStock.toLocaleString()}{' '}
                          <span className="font-normal text-slate-400 text-[10px]">pcs</span>
                        </td>

                        {/* Branch Health Status Badge */}
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          {lowBranches.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-[2px] text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                              <span>⚠️ {lowBranches.length} Low</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-[2px] text-[10.5px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Optimal
                            </span>
                          )}
                        </td>

                        {/* Arrow */}
                        <td className="px-2 py-2 text-right text-slate-400">
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
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
        {/* RIGHT PANEL: Multi-Branch Stock & Transfer Center       */}
        {/* ======================================================== */}
        <div className="col-span-12 xl:col-span-5 bg-white border border-slate-200 rounded-[3px] shadow-2xs overflow-hidden flex flex-col h-full min-h-0">
          {selectedMedicine ? (
            <>
              {/* Header: Medicine Specs, Packaging Switcher, Depot Status & Auto-Rebalance */}
              <div className="shrink-0 p-3 bg-white border-b border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">
                        {selectedMedicine.brandName}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">({selectedMedicine.strength})</span>
                      <span className="px-1.5 py-0.2 rounded-[2px] bg-slate-100 text-[#006a4e] text-[10px] font-bold">
                        {selectedMedicine.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {selectedMedicine.genericName} • {selectedMedicine.manufacturer} • MRP: ৳ {selectedMedicine.unitPrice.toFixed(2)}/pc
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
                {transferToast && (
                  <div className="mt-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-[2px] flex items-center justify-between animate-in fade-in duration-100">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{transferToast}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTransferToast(null)}
                      className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Single-Line Depot Status & 1-Click Auto-Rebalance */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Central Depot:</span>
                    <span className="font-bold text-slate-900">
                      {formatStock(
                        selectedMedicine.centralStock,
                        activeUnit,
                        selectedMedicine.units_per_strip,
                        selectedMedicine.units_per_box
                      ).main}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({selectedMedicine.centralStock.toLocaleString()} pcs)
                    </span>
                  </div>

                  {selectedUnderMinBranches.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleAutoRebalance(selectedMedicine)}
                      className="px-2.5 py-0.5 rounded-[2px] bg-[#006a4e] hover:bg-[#00543e] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                      title="Automatically refill all low branches from Central Depot"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Rebalance ({selectedUnderMinBranches.length} low)</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>All 10 Branches Optimal</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Tabs: Branches vs FEFO Batches */}
              <div className="shrink-0 px-3 bg-white border-b border-slate-200 flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setDetailTab('branches')}
                  className={`py-2 font-semibold border-b-2 transition-colors cursor-pointer ${
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
                  className={`py-2 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
                    detailTab === 'batches'
                      ? 'border-[#006a4e] text-[#006a4e]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Batches & FEFO ({selectedMedicine.batches?.length || 0})</span>
                </button>
              </div>

              {/* Detail Content (Flat Edge-to-Edge, NO Nested Card Border!) */}
              {detailTab === 'branches' ? (
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] z-10">
                      <tr>
                        <th className="px-3 py-2">Hospital Branch</th>
                        <th className="px-2 py-2">Rack</th>
                        <th className="px-3 py-2 text-right">Current</th>
                        <th className="px-3 py-2 text-right">Safety Min</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-right"></th>
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

                        const isTarget = transferBranchId === br.branchId;

                        return (
                          <tr
                            key={br.branchId}
                            onClick={() => setTransferBranchId(br.branchId)}
                            className={`transition-colors cursor-pointer ${
                              isTarget ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="px-3 py-2">
                              <div className="font-semibold text-slate-900 text-xs">
                                {br.shortName}
                              </div>
                              <div className="text-[10px] text-slate-400">{br.city}</div>
                            </td>
                            <td className="px-2 py-2 font-mono text-[10px] text-slate-600">
                              {br.rackLocation}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <div className="font-bold text-slate-900">{stockFmt.main}</div>
                              <div className="text-[9px] text-slate-400">{stockFmt.sub}</div>
                            </td>
                            <td className="px-3 py-2 text-right text-slate-600">
                              <div className="font-semibold text-slate-700">{minFmt.main}</div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-1.5 py-0.2 rounded-[2px] text-[10px] border whitespace-nowrap ${badgeCls}`}>
                                {br.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTransferBranchId(br.branchId);
                                }}
                                className={`px-2 py-0.5 rounded-[2px] text-[11px] font-semibold transition-colors cursor-pointer ${
                                  isTarget
                                    ? 'bg-[#006a4e] text-white font-bold'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {isTarget ? 'Selected' : 'Refill'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* FEFO Batches Tab (Flat Edge-to-Edge) */
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] z-10">
                      <tr>
                        <th className="px-3 py-2">Batch</th>
                        <th className="px-3 py-2">Location</th>
                        <th className="px-3 py-2">Expiry Date</th>
                        <th className="px-3 py-2 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedMedicine.batches || []).map((b, idx) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono font-semibold text-slate-900">
                            #{idx + 1} {b.batchNo}
                          </td>
                          <td className="px-3 py-2 text-slate-600">{b.location}</td>
                          <td className="px-3 py-2 text-slate-800">
                            {new Date(b.expiryDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900">
                            {formatStock(
                              b.qtyPcs,
                              activeUnit,
                              selectedMedicine.units_per_strip,
                              selectedMedicine.units_per_box
                            ).main}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Simple Bottom Transfer Bar (Clean Flat Edge-to-Edge) */}
              <div className="shrink-0 p-3 bg-white border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span>
                      Transfer to{' '}
                      <strong className="text-[#006a4e]">
                        {selectedMedicine.branches.find((b) => b.branchId === transferBranchId)?.shortName ||
                          selectedMedicine.branches[0].shortName}
                      </strong>
                    </span>
                  </span>
                  <span className="font-normal text-slate-500">
                    Depot Available: {selectedMedicine.centralStock.toLocaleString()} pcs
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={transferBranchId || selectedMedicine.branches[0].branchId}
                    onChange={(e) => setTransferBranchId(e.target.value)}
                    className="text-xs border border-slate-300 rounded-[2px] bg-white px-2 py-1 font-medium text-slate-800 focus:outline-none focus:border-[#006a4e]"
                  >
                    {selectedMedicine.branches.map((b) => (
                      <option key={b.branchId} value={b.branchId}>
                        {b.shortName} ({b.status})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 text-xs font-bold text-center border border-slate-300 rounded-[2px] bg-white focus:outline-none focus:border-[#006a4e]"
                    />
                    <span className="text-xs text-slate-600 font-semibold">
                      {activeUnit === 'box'
                        ? `Box (${selectedMedicine.units_per_box})`
                        : activeUnit === 'strip'
                          ? `Strip (${selectedMedicine.units_per_strip})`
                          : 'Pc'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    ={' '}
                    {(
                      transferAmount *
                      (activeUnit === 'box'
                        ? selectedMedicine.units_per_box
                        : activeUnit === 'strip'
                          ? selectedMedicine.units_per_strip
                          : 1)
                    ).toLocaleString()}{' '}
                    pcs
                  </span>

                  <button
                    type="button"
                    onClick={handleTransfer}
                    className="ml-auto px-3.5 py-1 bg-[#006a4e] hover:bg-[#00543e] text-white text-xs font-bold rounded-[2px] cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Transfer Stock</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-6">
              Select a medicine from the left list to view branches and transfer stock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacistInventoryView;
