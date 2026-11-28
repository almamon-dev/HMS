import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  Layers,
  PackagePlus,
  Plus,
  ShieldAlert,
  Warehouse,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  PHARMACIST_INVENTORY_MASTER,
  HOSPITAL_10_BRANCHES,
  MedicineItem,
  SaleUnit,
} from '../../data/pharmacistInventoryData';
import { getStoredSuppliers } from '../../data/pharmacySuppliersData';

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

export const PharmacistInventoryView: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>(PHARMACIST_INVENTORY_MASTER);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'critical'>('all');
  const suppliers = useMemo(() => getStoredSuppliers(), []);

  // Active Packaging Unit Toggle
  const [activeUnit, setActiveUnit] = useState<SaleUnit>('box');

  // Selected Medicine for Superadmin-style Quick View Card
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItem | null>(null);

  // Inspected Medicine for Branch Breakdown Modal
  const [inspectMedicine, setInspectMedicine] = useState<MedicineItem | null>(null);
  const [inspectTab, setInspectTab] = useState<'branches' | 'batches'>('branches');

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isReceiveStockOpen, setIsReceiveStockOpen] = useState(false);
  const [receiveStockMedId, setReceiveStockMedId] = useState<string>('');

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

  // Categories
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(medicines.map((m) => m.category))).sort()];
  }, [medicines]);

  // Overall Statistics for Superadmin 4-Card layout
  const stats = useMemo(() => {
    const totalSkus = medicines.length;
    let lowCount = 0;
    let criticalCount = 0;
    let totalStockPieces = 0;

    medicines.forEach((m) => {
      totalStockPieces += m.centralStock;
      if (m.centralStock <= m.reorderLevel * 0.4) {
        criticalCount++;
      } else if (m.centralStock <= m.reorderLevel) {
        lowCount++;
      }
    });

    return { totalSkus, lowCount, criticalCount, totalStockPieces };
  }, [medicines]);

  // Filtered medicine list for table
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
      if (!matchCat) return false;

      if (statusFilter === 'critical') {
        return m.centralStock <= m.reorderLevel * 0.4;
      }
      if (statusFilter === 'low') {
        return m.centralStock <= m.reorderLevel && m.centralStock > m.reorderLevel * 0.4;
      }
      return true;
    });
  }, [medicines, categoryFilter, statusFilter]);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Add Medicine Submit
  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newGenericName.trim()) return;

    const code =
      newBrandName.slice(0, 3).toUpperCase() +
      '-' +
      Math.floor(100 + Math.random() * 900);

    const price = parseFloat(newUnitPrice) || 2.5;
    const pieces = newInitialDepotBoxes * newUnitsPerBox;

    const newMed: MedicineItem = {
      id: `med-${Date.now()}`,
      code,
      brandName: newBrandName.trim(),
      genericName: newGenericName.trim(),
      dosageForm: newDosageForm,
      strength: newStrength.trim() || '500mg',
      manufacturer: newManufacturer.trim() || 'Square Pharmaceuticals Ltd.',
      category: newCategory,
      centralStock: pieces,
      unitPrice: price,
      reorderLevel: newReorderLevel || 500,
      status:
        pieces <= (newReorderLevel || 500) * 0.4
          ? 'Critical'
          : pieces <= (newReorderLevel || 500)
            ? 'Low Stock'
            : 'In Stock',
      units_per_strip: newUnitsPerStrip || 10,
      units_per_box: newUnitsPerBox || 200,
      batches: [
        {
          id: `bth-${Date.now()}`,
          batchNo: `BTH-${Math.floor(10000 + Math.random() * 90000)}`,
          expiryDate: '2028-12-31',
          qtyPcs: pieces,
          location: 'Central Depot - Bay 01',
        },
      ],
      branches: HOSPITAL_10_BRANCHES.map((b) => ({
        branchId: b.branchId,
        branchName: b.branchName,
        shortName: b.shortName,
        city: b.city,
        zone: b.zone,
        rackLocation: `${b.rackPrefix}-01, Bin 1`,
        currentStock: Math.floor(pieces * 0.03),
        reorderLevel: Math.floor(pieces * 0.04),
        maxStock: Math.floor(pieces * 0.1),
        status: 'In Stock',
      })),
    };

    setMedicines((prev) => [newMed, ...prev]);
    setIsAddMedicineOpen(false);
    setSelectedMedicine(newMed);
    triggerToast(`✓ "${newMed.brandName} (${newMed.strength})" registered successfully in Formulary!`);

    // Reset Form
    setNewBrandName('');
    setNewGenericName('');
    setNewStrength('500mg');
  };

  // Handle Receive Stock Submit
  const handleReceiveStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMed = medicines.find((m) => m.id === receiveStockMedId) || medicines[0];
    if (!targetMed || rcvQuantity <= 0) return;

    const multiplier =
      rcvUnit === 'box'
        ? targetMed.units_per_box
        : rcvUnit === 'strip'
          ? targetMed.units_per_strip
          : 1;

    const piecesToAdd = rcvQuantity * multiplier;

    const newBatch = {
      id: `bth-${Date.now()}`,
      batchNo: rcvBatchNo.trim() || `BTH-${Date.now().toString().slice(-5)}`,
      expiryDate: rcvExpiry,
      qtyPcs: piecesToAdd,
      location: rcvRack || 'Central Depot - Bay 01',
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

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      'Code',
      'Brand Name',
      'Generic Name',
      'Form',
      'Strength',
      'Category',
      'Manufacturer',
      'Depot Stock (Pcs)',
      'Safety Min (Pcs)',
      'MRP (Tk)',
      'Status',
    ];
    const rows = filteredMedicines.map((m) => [
      `"${m.code}"`,
      `"${m.brandName}"`,
      `"${m.genericName}"`,
      `"${m.dosageForm}"`,
      `"${m.strength}"`,
      `"${m.category}"`,
      `"${m.manufacturer}"`,
      m.centralStock,
      m.reorderLevel,
      m.unitPrice.toFixed(2),
      `"${m.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns for Superadmin-Style DataTable
  const columns: DataTableColumn<MedicineItem>[] = [
    {
      key: 'code',
      header: 'Code',
      sortable: true,
      sortValue: (r) => r.code,
      render: (r: MedicineItem) => (
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          {r.code}
        </span>
      ),
    },
    {
      key: 'brandName',
      header: 'Medicine Name & Generic',
      sortable: true,
      sortValue: (r) => r.brandName,
      render: (r: MedicineItem) => (
        <div>
          <div className="flex items-center gap-1.5 leading-snug">
            <span className="font-semibold text-slate-800 text-xs">{r.brandName}</span>
            <span className="text-[11px] text-slate-400 font-normal">({r.strength})</span>
            <span className="text-[9.5px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-normal">
              {r.dosageForm}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
            {r.genericName}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r: MedicineItem) => (
        <span className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 text-[11px] whitespace-nowrap">
          {r.category}
        </span>
      ),
    },
    {
      key: 'manufacturer',
      header: 'Manufacturer',
      sortable: true,
      sortValue: (r) => r.manufacturer,
      render: (r: MedicineItem) => (
        <span className="text-slate-500 text-xs whitespace-nowrap">{r.manufacturer}</span>
      ),
    },
    {
      key: 'rack',
      header: 'Depot Rack',
      render: (r: MedicineItem) => (
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          {r.batches?.[0]?.location || 'Central Depot - Bay 01'}
        </span>
      ),
    },
    {
      key: 'centralStock',
      header: 'Depot Stock',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.centralStock,
      render: (r: MedicineItem) => {
        const depotStock = formatStock(
          r.centralStock,
          activeUnit,
          r.units_per_strip,
          r.units_per_box
        );
        return (
          <div className="whitespace-nowrap">
            <div className="font-semibold text-slate-800 text-xs">{depotStock.main}</div>
            <div className="text-[10px] text-slate-400">{depotStock.sub}</div>
          </div>
        );
      },
    },
    {
      key: 'networkStock',
      header: 'Network Stock',
      align: 'right',
      sortable: true,
      sortValue: (r) =>
        r.centralStock + r.branches.reduce((acc, b) => acc + b.currentStock, 0),
      render: (r: MedicineItem) => {
        const totalNetwork =
          r.centralStock + r.branches.reduce((acc, b) => acc + b.currentStock, 0);
        const lowBranches = r.branches.filter(
          (b) => b.status === 'Low Stock' || b.status === 'Critical'
        );
        const networkStock = formatStock(
          totalNetwork,
          activeUnit,
          r.units_per_strip,
          r.units_per_box
        );
        return (
          <div className="whitespace-nowrap">
            <div className="font-medium text-slate-700 text-xs">{networkStock.main}</div>
            <div className="text-[10px] text-slate-400">
              {lowBranches.length > 0 ? (
                <span className="text-amber-600 font-normal">⚠️ {lowBranches.length} br. low</span>
              ) : (
                '10 br. optimal'
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'reorderLevel',
      header: 'Safety Min',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.reorderLevel,
      render: (r: MedicineItem) => (
        <span className="text-slate-500 text-xs whitespace-nowrap">
          {r.reorderLevel.toLocaleString()} pcs
        </span>
      ),
    },
    {
      key: 'unitPrice',
      header: 'MRP (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.unitPrice,
      render: (r: MedicineItem) => (
        <span className="font-medium text-slate-700 text-xs whitespace-nowrap">
          ৳ {r.unitPrice.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) =>
        r.centralStock <= r.reorderLevel * 0.4
          ? 0
          : r.centralStock <= r.reorderLevel
            ? 1
            : 2,
      render: (r: MedicineItem) => {
        if (r.centralStock <= r.reorderLevel * 0.4) {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1 whitespace-nowrap">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Critical</span>
            </span>
          );
        }
        if (r.centralStock <= r.reorderLevel) {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-1 whitespace-nowrap">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Low Stock</span>
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-[#edf6f2] text-[#006a4e] border border-[#006a4e]/20 inline-flex items-center gap-1 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-[#006a4e]" />
            <span>In Stock</span>
          </span>
        );
      },
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (r: MedicineItem) => (
        <div
          className="flex items-center justify-end gap-1.5 whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setReceiveStockMedId(r.id);
              setIsReceiveStockOpen(true);
            }}
            className="px-2 py-1 rounded-[3px] bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Receive inbound delivery"
          >
            <PackagePlus className="w-3 h-3" />
            <span>Restock</span>
          </button>
          <button
            type="button"
            onClick={() => setInspectMedicine(r)}
            className="px-2 py-1 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
            title="View 10 branches breakdown & batches"
          >
            Branches
          </button>
        </div>
      ),
    },
  ];

  // Superadmin Toolbar Filters
  const toolbarFilters = (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category Dropdown */}
      <div className="relative">
        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All Categories' : c}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {/* Status Filter Dropdown */}
      <div className="relative">
        <select
          aria-label="Filter by stock status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'low' | 'critical')}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="all">All Stock Levels ({stats.totalSkus})</option>
          <option value="low">Low Stock Alert ({stats.lowCount})</option>
          <option value="critical">Critical Depletion ({stats.criticalCount})</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {/* Packaging Unit Switcher (Superadmin Compact Toggle) */}
      <div className="flex items-center gap-1.5 ml-1">
        <span className="text-[11px] font-semibold text-slate-500">Unit:</span>
        <div className="inline-flex rounded border border-slate-300 bg-white p-0.5 divide-x divide-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveUnit('piece')}
            className={`px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${
              activeUnit === 'piece'
                ? 'bg-[#006a4e] text-white font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Pc
          </button>
          <button
            type="button"
            onClick={() => setActiveUnit('strip')}
            className={`px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${
              activeUnit === 'strip'
                ? 'bg-[#006a4e] text-white font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Strip
          </button>
          <button
            type="button"
            onClick={() => setActiveUnit('box')}
            className={`px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${
              activeUnit === 'box'
                ? 'bg-[#006a4e] text-white font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Box
          </button>
        </div>
      </div>
    </div>
  );

  // Superadmin Toolbar Header Actions
  const headerActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => {
          setIsReceiveStockOpen(false);
          setIsAddMedicineOpen(true);
        }}
        className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Medicine</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setIsAddMedicineOpen(false);
          setReceiveStockMedId(medicines[0]?.id || '');
          setIsReceiveStockOpen(true);
        }}
        className="h-8 px-2.5 rounded-[3px] bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <PackagePlus className="w-3.5 h-3.5" />
        <span>Receive Stock</span>
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
      {/* 4 Summary Metric Cards Matching Superadmin Directory Format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Medicines</span>
            <Boxes className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.totalSkus} SKUs
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Hospital Formulary Registry catalog</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Central Depot Stock</span>
            <Warehouse className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-blue-700 leading-none">
              {stats.totalStockPieces.toLocaleString()} pcs
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Available in Central Medical Store</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Low Stock Buffer</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {stats.lowCount} SKUs
            </span>
          </div>
          <p className="text-[10px] text-slate-500">At or below reorder safety threshold</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Critical Depletion</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-rose-600 leading-none">
              {stats.criticalCount} SKUs
            </span>
          </div>
          <p className="text-[10px] text-slate-500">&lt; 40% safety stock, restock required</p>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="px-3 py-1.5 bg-[#edf6f2] border border-[#006a4e]/25 text-[#006a4e] text-xs font-semibold rounded-[3px] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#006a4e] hover:text-emerald-900 text-xs cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Selected Medicine Quick View Card (Matching Superadmin Quick View) */}
      {selectedMedicine && (
        <div className="bg-white border border-[#006a4e]/25 rounded-[3px] p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedMedicine.brandName}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    ({selectedMedicine.strength})
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                    {selectedMedicine.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedMedicine.dosageForm}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-600 text-[11px]">
                    {selectedMedicine.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generic:{' '}
                  <strong className="text-slate-800">{selectedMedicine.genericName}</strong> ·
                  Mfg: {selectedMedicine.manufacturer} · MRP: ৳{' '}
                  {selectedMedicine.unitPrice.toFixed(2)}/pc
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setReceiveStockMedId(selectedMedicine.id);
                  setIsReceiveStockOpen(true);
                }}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>Restock Medicine</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectMedicine(selectedMedicine)}
                className="h-8 px-3 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>10 Branches Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMedicine(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Central Depot Stock</p>
              <p className="font-bold text-slate-900 text-sm">
                {
                  formatStock(
                    selectedMedicine.centralStock,
                    activeUnit,
                    selectedMedicine.units_per_strip,
                    selectedMedicine.units_per_box
                  ).main
                }
              </p>
              <p className="text-[10px] text-slate-400">
                {selectedMedicine.centralStock.toLocaleString()} pcs
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Total Network Stock</p>
              <p className="font-bold text-slate-900 text-sm">
                {(
                  selectedMedicine.centralStock +
                  selectedMedicine.branches.reduce((acc, b) => acc + b.currentStock, 0)
                ).toLocaleString()}{' '}
                pcs
              </p>
              <p className="text-[10px] text-slate-400">Across 10 Hospital Branches</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Packaging Multipliers</p>
              <p className="font-medium text-slate-800">
                1 Strip = {selectedMedicine.units_per_strip} pcs · 1 Box ={' '}
                {selectedMedicine.units_per_box} pcs
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Safety Min / Reorder Level</p>
              <p className="font-medium text-slate-800">
                {selectedMedicine.reorderLevel.toLocaleString()} pcs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Superadmin-Style Enterprise DataTable */}
      <DataTable<MedicineItem>
        data={filteredMedicines}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search by medicine, generic, SKU code, or manufacturer..."
        searchFilter={(m, q) =>
          m.brandName.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q) ||
          m.manufacturer.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
        }
        toolbarFilters={toolbarFilters}
        headerActions={headerActions}
        defaultPageSize={30}
        pageSizeOptions={[15, 30, 50, 100]}
        emptyTitle="No matching medicines found"
        emptyDescription="Try clearing your search query, category, or status filter."
        onRowClick={(row) => setSelectedMedicine(row)}
      />

      {/* ======================================================== */}
      {/* MODAL: MULTI-BRANCH BREAKDOWN & FEFO BATCHES             */}
      {/* ======================================================== */}
      {inspectMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[4px] shadow-xl border border-slate-300 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {inspectMedicine.brandName} ({inspectMedicine.strength})
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-50 text-[#006a4e] border border-emerald-200 font-mono text-xs font-bold">
                    {inspectMedicine.code}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                    {inspectMedicine.dosageForm}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Generic: {inspectMedicine.genericName} · Mfg: {inspectMedicine.manufacturer} ·
                  MRP: ৳ {inspectMedicine.unitPrice.toFixed(2)}/pc
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectMedicine(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Tabs: Branch Stock vs Batches */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setInspectTab('branches')}
                    className={`pb-1 flex items-center gap-1.5 border-b-2 cursor-pointer ${
                      inspectTab === 'branches'
                        ? 'border-[#006a4e] text-[#006a4e]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Branch Stock (10 Hospitals)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectTab('batches')}
                    className={`pb-1 flex items-center gap-1.5 border-b-2 cursor-pointer ${
                      inspectTab === 'batches'
                        ? 'border-[#006a4e] text-[#006a4e]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Batches & FEFO ({inspectMedicine.batches?.length || 0})</span>
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Central Depot Available:{' '}
                  <strong className="text-slate-900 font-bold">
                    {inspectMedicine.centralStock.toLocaleString()} pcs
                  </strong>
                </span>
              </div>

              {inspectTab === 'branches' ? (
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs">
                    <tr>
                      <th className="py-1.5 px-2">Hospital Branch</th>
                      <th className="py-1.5 px-2">Rack Location</th>
                      <th className="py-1.5 px-2 text-right">Current Stock</th>
                      <th className="py-1.5 px-2 text-right">Safety Min</th>
                      <th className="py-1.5 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inspectMedicine.branches.map((b) => (
                      <tr key={b.branchId} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2 font-medium text-slate-900">
                          {b.shortName}
                        </td>
                        <td className="py-1.5 px-2 font-mono text-[11px] text-slate-600">
                          {b.rackLocation}
                        </td>
                        <td className="py-1.5 px-2 text-right font-bold text-slate-900">
                          {b.currentStock.toLocaleString()} pcs
                        </td>
                        <td className="py-1.5 px-2 text-right text-slate-600">
                          {b.reorderLevel.toLocaleString()} pcs
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          {b.status === 'Critical' ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              ⚠️ Critical
                            </span>
                          ) : b.status === 'Low Stock' ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              ⚠️ Low Stock
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#edf6f2] text-[#006a4e] border border-[#006a4e]/20">
                              ✓ In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs">
                    <tr>
                      <th className="py-1.5 px-2">Batch / Lot #</th>
                      <th className="py-1.5 px-2">Expiry Date</th>
                      <th className="py-1.5 px-2">Location</th>
                      <th className="py-1.5 px-2 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(inspectMedicine.batches || []).map((b) => (
                      <tr key={b.batchNo} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2 font-mono font-bold text-slate-900">
                          {b.batchNo}
                        </td>
                        <td className="py-1.5 px-2 text-slate-700">{b.expiryDate}</td>
                        <td className="py-1.5 px-2 text-slate-600">{b.location}</td>
                        <td className="py-1.5 px-2 text-right font-bold text-slate-900">
                          {b.qtyPcs.toLocaleString()} pcs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectMedicine(null)}
                className="px-3 py-1.5 rounded-[2px] bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <h3 className="text-sm font-bold text-slate-900">
                    Add New Medicine to Formulary
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Register brand name, formulation, packaging &amp; safety limits
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMedicineOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicineSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Napa Extra"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Generic Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol + Caffeine"
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
                    className="w-full h-8 px-2 text-xs border border-slate-300 rounded-[2px] bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Eye Drops">Eye Drops</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg+65mg"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Therapeutic Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-slate-300 rounded-[2px] bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Analgesics">Analgesics</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Manufacturer / Supplier</label>
                  <input
                    type="text"
                    list="inventory-manufacturers-list"
                    placeholder="e.g. Square Pharmaceuticals Ltd."
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                  <datalist id="inventory-manufacturers-list">
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Retail Price (MRP/pc in ৳) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              {/* Packaging Ratios & Initial Depot Stock */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px] space-y-2">
                <span className="font-bold text-slate-800 text-xs">
                  Packaging Units &amp; Central Depot Stock
                </span>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-0.5">Pcs / Strip</label>
                    <input
                      type="number"
                      min="1"
                      value={newUnitsPerStrip}
                      onChange={(e) => setNewUnitsPerStrip(parseInt(e.target.value) || 1)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-0.5">Pcs / Box</label>
                    <input
                      type="number"
                      min="1"
                      value={newUnitsPerBox}
                      onChange={(e) => setNewUnitsPerBox(parseInt(e.target.value) || 1)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-0.5">
                      Initial Stock (Boxes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newInitialDepotBoxes}
                      onChange={(e) => setNewInitialDepotBoxes(parseInt(e.target.value) || 0)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-0.5">
                      Safety Min (Pcs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newReorderLevel}
                      onChange={(e) => setNewReorderLevel(parseInt(e.target.value) || 0)}
                      className="w-full h-7 px-2 text-xs border border-slate-300 rounded-[2px] bg-white"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Total Initial Central Stock ={' '}
                  <strong className="text-slate-800 font-bold">
                    {(newInitialDepotBoxes * newUnitsPerBox).toLocaleString()} pcs
                  </strong>
                </p>
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
      {/* MODAL 2: RECEIVE STOCK (DEPOT RESTOCK / GRN)              */}
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
                  <h3 className="text-sm font-bold text-slate-900">
                    Receive Stock (Depot Restock / GRN)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Record inbound delivery and update Central Depot inventory
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiveStockOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReceiveStockSubmit} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Medicine *</label>
                <select
                  value={receiveStockMedId}
                  onChange={(e) => setReceiveStockMedId(e.target.value)}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded-[2px] bg-white font-semibold text-slate-900 focus:outline-none focus:border-[#006a4e]"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brandName} ({m.strength}) — Central Depot:{' '}
                      {m.centralStock.toLocaleString()} pcs
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Supplier / Manufacturer
                  </label>
                  <input
                    type="text"
                    required
                    value={rcvSupplier}
                    onChange={(e) => setRcvSupplier(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Purchase Order (PO #)
                  </label>
                  <input
                    type="text"
                    required
                    value={rcvPoNumber}
                    onChange={(e) => setRcvPoNumber(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs font-mono border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              {/* Quantity & Unit Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Received Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={rcvQuantity}
                    onChange={(e) => setRcvQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-8 px-2.5 text-xs font-bold border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit</label>
                  <div className="inline-flex w-full rounded border border-slate-300 bg-white p-0.5 divide-x divide-slate-200">
                    <button
                      type="button"
                      onClick={() => setRcvUnit('piece')}
                      className={`flex-1 py-1 text-xs font-semibold cursor-pointer text-center ${
                        rcvUnit === 'piece'
                          ? 'bg-[#006a4e] text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Piece
                    </button>
                    <button
                      type="button"
                      onClick={() => setRcvUnit('strip')}
                      className={`flex-1 py-1 text-xs font-semibold cursor-pointer text-center ${
                        rcvUnit === 'strip'
                          ? 'bg-[#006a4e] text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Strip
                    </button>
                    <button
                      type="button"
                      onClick={() => setRcvUnit('box')}
                      className={`flex-1 py-1 text-xs font-semibold cursor-pointer text-center ${
                        rcvUnit === 'box'
                          ? 'bg-[#006a4e] text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Box
                    </button>
                  </div>
                </div>
              </div>

              {/* Batch & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Batch / Lot Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BTH-89102"
                    value={rcvBatchNo}
                    onChange={(e) => setRcvBatchNo(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs font-mono font-bold border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
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

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Storage Rack Location
                </label>
                <input
                  type="text"
                  value={rcvRack}
                  onChange={(e) => setRcvRack(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs font-mono border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
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
                  <span>Receive &amp; Add Stock</span>
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
