import React, { useMemo, useState } from 'react';
import {
  ArrowRightLeft,
  ArrowUpRight,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  Download,
  Filter,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { PageHeader } from '../common/PageHeader';
import {
  PHARMACIST_INVENTORY_MASTER,
  MedicineItem,
  BranchStockItem,
  SaleUnit,
} from '../../data/pharmacistInventoryData';

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
    <div className="inline-flex items-center rounded border border-slate-300 bg-white p-0.5 divide-x divide-slate-200 select-none shadow-2xs">
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
            className={`px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer first:rounded-l-[2px] last:rounded-r-[2px] focus:outline-none ${
              active
                ? 'bg-[#006a4e] text-white shadow-xs font-bold'
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

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(medicines.map((m) => m.category))).sort();
    return ['All', ...cats];
  }, [medicines]);

  const totalCentralUnits = useMemo(() => {
    return medicines.reduce((acc, m) => acc + m.centralStock, 0);
  }, [medicines]);

  const criticalSkusCount = useMemo(() => {
    return medicines.filter((m) => m.status === 'Critical').length;
  }, [medicines]);

  // Multi-branch details modal
  const [selectedMedicineForModal, setSelectedMedicineForModal] = useState<MedicineItem | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalCityFilter, setModalCityFilter] = useState('All');
  const [modalUnit, setModalUnit] = useState<SaleUnit>('box');
  const [modalTab, setModalTab] = useState<'branches' | 'batches'>('branches');

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
      alert(`Central warehouse has insufficient stock (${medicine.centralStock.toLocaleString()} pcs) for ${transferAmount} ${transferUnit}s (${totalPiecesToTransfer.toLocaleString()} pcs).`);
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

  // Handle 1-click Auto-Rebalance across under-reorder branches
  const handleAutoRebalance = (medicine: MedicineItem) => {
    const underMinBranches = medicine.branches.filter(
      (b) => b.status === 'Low Stock' || b.status === 'Critical'
    );
    if (underMinBranches.length === 0) return;

    const totalDeficit = underMinBranches.reduce(
      (sum, b) => sum + Math.max(0, b.reorderLevel - b.currentStock),
      0
    );
    const safeAvailable = Math.max(0, medicine.centralStock - medicine.reorderLevel);

    if (safeAvailable <= 0) {
      alert(
        `Cannot auto-rebalance: CMS Central Depot has only ${medicine.centralStock.toLocaleString()} pcs, which is at or below its safe buffer level (${medicine.reorderLevel.toLocaleString()} pcs).`
      );
      return;
    }

    const allocateRatio = Math.min(1, safeAvailable / Math.max(1, totalDeficit));
    let totalDeducted = 0;

    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id !== medicine.id) return med;

        const updatedBranches = med.branches.map((b) => {
          if (b.status !== 'Low Stock' && b.status !== 'Critical') return b;
          const deficit = Math.max(0, b.reorderLevel - b.currentStock);
          const added = Math.floor(deficit * allocateRatio);
          totalDeducted += added;
          const newStock = b.currentStock + added;
          let newStatus: 'In Stock' | 'Low Stock' | 'Critical' = 'In Stock';
          if (newStock <= b.reorderLevel * 0.4) newStatus = 'Critical';
          else if (newStock <= b.reorderLevel) newStatus = 'Low Stock';
          return {
            ...b,
            currentStock: newStock,
            status: newStatus,
          };
        });

        const updatedMed = {
          ...med,
          centralStock: med.centralStock - totalDeducted,
          branches: updatedBranches,
        };
        if (selectedMedicineForModal?.id === med.id) {
          setSelectedMedicineForModal(updatedMed);
        }
        return updatedMed;
      })
    );

    setTransferSuccessNotice(
      `Auto-rebalanced ${totalDeducted.toLocaleString()} pcs across ${underMinBranches.length} branches for ${medicine.brandName}!`
    );
    setTimeout(() => setTransferSuccessNotice(null), 5000);
  };

  // CSV export handler
  const handleExportCsv = () => {
    const headers = [
      'Item Code',
      'Brand Name',
      'Generic Name',
      'Form',
      'Strength',
      'Manufacturer',
      'Category',
      'CMS Central Stock (Pcs)',
      'Total Branch Stock (Pcs)',
      'MRP (BDT)',
      'Status',
    ];

    const rows = filteredMedicines.map((m) => {
      const branchTotal = m.branches.reduce((acc, b) => acc + b.currentStock, 0);
      return [
        `"${m.code}"`,
        `"${m.brandName}"`,
        `"${m.genericName}"`,
        `"${m.dosageForm}"`,
        `"${m.strength}"`,
        `"${m.manufacturer}"`,
        `"${m.category}"`,
        m.centralStock,
        branchTotal,
        m.unitPrice.toFixed(2),
        `"${m.status}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_master_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    setModalUnit('box');
                  }}
                  className="px-1.5 py-0.5 rounded-[3px] bg-emerald-50 hover:bg-[#006a4e] text-[#006a4e] hover:text-white border border-emerald-200 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="View stock breakdown by branch"
                >
                  <Building2 className="w-3 h-3" />
                  <span>Branches</span>
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
          value={`${medicines.length} SKUs`}
          subtitle="Registered across hospital network"
        />
        <SummaryCard
          title="Central CMS Warehouse"
          icon={Building2}
          iconColor="text-[#006a4e]"
          value={`${totalCentralUnits.toLocaleString()} Units`}
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
          value={`${criticalSkusCount} SKUs`}
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
              options={categoryOptions}
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
              onClick={handleExportCsv}
              className="px-2.5 py-1 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => alert('New formulary item creation dialog.')}
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

            {/* Auto-Rebalance Suggestion Callout */}
            {(() => {
              const underMin = selectedMedicineForModal.branches.filter((b) => b.status === 'Low Stock' || b.status === 'Critical');
              if (underMin.length === 0) return null;
              const totalDeficit = underMin.reduce((sum, b) => sum + Math.max(0, b.reorderLevel - b.currentStock), 0);
              const canRebalance = selectedMedicineForModal.centralStock > selectedMedicineForModal.reorderLevel;

              return (
                <div className="mx-4 mt-2.5 p-2.5 rounded-[3px] bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-900">Auto-Rebalance Suggestion:</span>{' '}
                      <span className="text-amber-800">
                        {underMin.length} branch{underMin.length > 1 ? 'es require' : ' requires'} restocking (Deficit: {totalDeficit.toLocaleString()} pcs).
                      </span>
                      <span className="text-[10.5px] text-amber-700 block mt-0.5">
                        CMS Central: {selectedMedicineForModal.centralStock.toLocaleString()} pcs (Buffer reserve: {selectedMedicineForModal.reorderLevel.toLocaleString()} pcs).
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!canRebalance}
                    onClick={() => handleAutoRebalance(selectedMedicineForModal)}
                    className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] disabled:opacity-50 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Rebalance</span>
                  </button>
                </div>
              );
            })()}

            {/* Modal Tabs: Branches vs FEFO Batches */}
            <div className="px-4 pt-2 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap bg-white">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setModalTab('branches')}
                  className={`pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    modalTab === 'branches'
                      ? 'border-[#006a4e] text-[#006a4e]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Branch Stock Breakdown ({selectedMedicineForModal.branches.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('batches')}
                  className={`pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    modalTab === 'batches'
                      ? 'border-[#006a4e] text-[#006a4e]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Batches & FEFO Order ({selectedMedicineForModal.batches?.length || 0})</span>
                </button>
              </div>

              {/* Packaging Unit Switcher (Piece / Strip / Box) - Matching Image 1 precisely with NO 'Unit:' label */}
              <div className="pb-1.5">
                <PackagingUnitSwitcher
                  unitsPerStrip={selectedMedicineForModal.units_per_strip}
                  unitsPerBox={selectedMedicineForModal.units_per_box}
                  activeUnit={modalUnit}
                  onChange={(u) => setModalUnit(u)}
                />
              </div>
            </div>

            {modalTab === 'branches' ? (
              <>
                {/* Branch Filters: Search & City Pills */}
                <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap bg-slate-50/50">
                  <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter branch name, city, or rack..."
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded-[3px] bg-white focus:outline-none focus:border-[#006a4e]"
                    />
                  </div>

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

                {/* High-Density Multi-Branch Inventory Matrix Table with Strip & Box Breakdown */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="border border-slate-200 rounded-[3px] overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                          <th className="px-3 py-2">Hospital Branch & Region</th>
                          <th className="px-3 py-2">Dispensary Rack</th>
                          <th className="px-3 py-2 text-right">
                            Current Stock ({modalUnit === 'box' ? `Box (${selectedMedicineForModal.units_per_box})` : modalUnit === 'strip' ? `Strip (${selectedMedicineForModal.units_per_strip})` : 'Pcs'})
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
                              <tr key={br.branchId} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-3 py-2">
                                  <div className="font-semibold text-slate-900 text-xs">
                                    {br.shortName}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {br.city} • <span className="text-slate-400">{br.zone}</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-700">
                                    {br.rackLocation}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-right font-medium text-slate-900">
                                  <div className="font-bold text-slate-900 text-xs">
                                    {brFmt.primary}
                                  </div>
                                  <div className="text-[9.5px] text-slate-500 font-normal leading-tight">
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
                                        width: `${Math.min(100, Math.round((br.currentStock / Math.max(1, br.reorderLevel * 2)) * 100))}%`,
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
              </>
            ) : (
              /* FEFO Batches Tab */
              <div className="flex-1 overflow-auto p-4">
                <div className="border border-slate-200 rounded-[3px] overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <th className="px-3 py-2">Batch No</th>
                        <th className="px-3 py-2">Location</th>
                        <th className="px-3 py-2">Expiry Date</th>
                        <th className="px-3 py-2 text-right">Quantity</th>
                        <th className="px-3 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedMedicineForModal.batches || []).map((b, bIdx) => {
                        const bFmt = formatStockQuantity(
                          b.qtyPcs,
                          modalUnit,
                          selectedMedicineForModal.units_per_strip,
                          selectedMedicineForModal.units_per_box
                        );
                        return (
                          <tr key={b.id} className="hover:bg-slate-50/80">
                            <td className="px-3 py-2 font-mono font-semibold text-slate-900">
                              #{bIdx + 1} {b.batchNo}
                            </td>
                            <td className="px-3 py-2 text-slate-600">
                              {b.location}
                            </td>
                            <td className="px-3 py-2 font-medium text-slate-800">
                              {new Date(b.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-slate-900">
                              {bFmt.primary}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="px-2 py-0.5 rounded-[2px] text-[10.5px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                                FEFO Priority #{bIdx + 1}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
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
                    min="1"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[3px] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#006a4e]"
                  />
                  <span className="text-xs text-slate-600 font-semibold whitespace-nowrap">
                    {transferAmount > 1 && transferUnit === 'box' ? 'Boxes' : transferAmount > 1 ? `${transferUnit}s` : transferUnit}
                  </span>
                </div>

                <div className="text-[10.5px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>
                    Total: <strong className="text-slate-800">{((transferAmount) * (transferUnit === 'box' ? transferTarget.medicine.units_per_box : transferUnit === 'strip' ? transferTarget.medicine.units_per_strip : 1)).toLocaleString()} pieces</strong>
                  </span>
                  <span>
                    Valuation: ৳ {((transferAmount) * (transferUnit === 'box' ? transferTarget.medicine.units_per_box : transferUnit === 'strip' ? transferTarget.medicine.units_per_strip : 1) * transferTarget.medicine.unitPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-200 flex items-center gap-2 text-[10.5px] text-slate-600">
                <Truck className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                <span>Internal hospital transit manifest will be generated automatically upon approval.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTransferTarget(null)}
                className="px-3 py-1 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTransfer}
                className="px-3 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistInventoryView;
