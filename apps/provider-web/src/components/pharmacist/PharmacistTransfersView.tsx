import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  PackageCheck,
  PackageOpen,
  Plus,
  Printer,
  ShieldAlert,
  Truck,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';

export interface TransferOrder {
  id: string;
  transferNo: string;
  sourceBranch: string;
  destBranch: string;
  itemName: string;
  genericName: string;
  dosageForm: string;
  batchNo: string;
  quantity: number;
  requestDate: string;
  dispatchVehicle?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  status: 'Pending Dispatch' | 'In-Transit' | 'Received & Verified';
  urgency: 'Normal' | 'Urgent' | 'Emergency';
  notes?: string;
}

const INITIAL_TRANSFERS: TransferOrder[] = [
  {
    id: 'TR-01',
    transferNo: 'TR-2026-0842',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Dhanmondi OPD Pharmacy',
    itemName: 'Napa Extra (500mg+65mg)',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Tablet',
    batchNo: 'NP-2026-A1',
    quantity: 5000,
    requestDate: 'Today, 09:30 AM',
    dispatchVehicle: 'Refrigerated Van DHA-11-8902',
    dispatchedAt: 'Today, 10:10 AM',
    status: 'In-Transit',
    urgency: 'Normal',
    notes: 'Regular weekly buffer replenishment for OPD counter.',
  },
  {
    id: 'TR-02',
    transferNo: 'TR-2026-0841',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Uttara Branch Pharmacy',
    itemName: 'Ceftriaxone 1g Inj. (Ceftron)',
    genericName: 'Ceftriaxone Sodium',
    dosageForm: 'Injection',
    batchNo: 'CFT-2025-99',
    quantity: 200,
    requestDate: 'Today, 10:15 AM',
    status: 'Pending Dispatch',
    urgency: 'Urgent',
    notes: 'Inpatient surgical ward reserve stock running low.',
  },
  {
    id: 'TR-03',
    transferNo: 'TR-2026-0839',
    sourceBranch: 'Dhanmondi OPD Pharmacy',
    destBranch: 'ICU Satellite Pharmacy',
    itemName: 'Meropenem 1g IV Inj (Meronem)',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Injection',
    batchNo: 'MRP-2024-X8',
    quantity: 80,
    requestDate: 'Yesterday, 04:00 PM',
    dispatchVehicle: 'Internal Hospital Cart #03',
    dispatchedAt: 'Yesterday, 04:30 PM',
    receivedAt: 'Yesterday, 05:15 PM',
    status: 'Received & Verified',
    urgency: 'Emergency',
    notes: 'Emergency FEFO short-expiry lot transfer to high-usage ICU.',
  },
  {
    id: 'TR-04',
    transferNo: 'TR-2026-0835',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Mirpur Branch Pharmacy',
    itemName: 'Maxpro 20 (20mg) Capsule',
    genericName: 'Esomeprazole Magnesium',
    dosageForm: 'Capsule',
    batchNo: 'MX-2026-E2',
    quantity: 2000,
    requestDate: 'Yesterday, 02:20 PM',
    dispatchVehicle: 'Hospital Logistics Courier L-14',
    dispatchedAt: 'Yesterday, 03:00 PM',
    receivedAt: 'Yesterday, 06:10 PM',
    status: 'Received & Verified',
    urgency: 'Normal',
    notes: 'Scheduled monthly branch replenishment.',
  },
  {
    id: 'TR-05',
    transferNo: 'TR-2026-0834',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Gulshan Executive Pharmacy',
    itemName: 'Insulin Glargine 100IU/ml (Lantus)',
    genericName: 'Insulin Glargine',
    dosageForm: 'Injection',
    batchNo: 'LAN-2025-01',
    quantity: 150,
    requestDate: 'Yesterday, 11:45 AM',
    dispatchVehicle: 'Cold-Chain Insulated Box Van C-02',
    dispatchedAt: 'Yesterday, 12:30 PM',
    receivedAt: 'Yesterday, 02:00 PM',
    status: 'Received & Verified',
    urgency: 'Urgent',
    notes: 'Temperature monitored at 3.8°C throughout transit.',
  },
  {
    id: 'TR-06',
    transferNo: 'TR-2026-0843',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Chattogram Hub Pharmacy',
    itemName: 'Torax 10 (10mg) Tablet',
    genericName: 'Ketorolac Tromethamine',
    dosageForm: 'Tablet',
    batchNo: 'TRX-2024-09',
    quantity: 800,
    requestDate: 'Today, 10:40 AM',
    dispatchVehicle: 'Inter-City Courier Express CT-01',
    dispatchedAt: 'Today, 11:20 AM',
    status: 'In-Transit',
    urgency: 'Urgent',
    notes: 'Inter-city dispatch for regional stock balancing.',
  },
  {
    id: 'TR-07',
    transferNo: 'TR-2026-0844',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Old Dhaka Care Clinic',
    itemName: 'Seclo 20 (20mg) Capsule',
    genericName: 'Omeprazole',
    dosageForm: 'Capsule',
    batchNo: 'SCL-2025-77',
    quantity: 1200,
    requestDate: 'Today, 11:00 AM',
    status: 'Pending Dispatch',
    urgency: 'Normal',
    notes: 'Awaiting packaging box seal from Central Medical Store.',
  },
  {
    id: 'TR-08',
    transferNo: 'TR-2026-0845',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Sylhet Campus Pharmacy',
    itemName: 'Ciprofloxacin 500mg (Neofloxin)',
    genericName: 'Ciprofloxacin',
    dosageForm: 'Tablet',
    batchNo: 'NFX-2025-19',
    quantity: 600,
    requestDate: 'Today, 11:15 AM',
    dispatchVehicle: 'Air Cargo Express Courier SY-04',
    dispatchedAt: 'Today, 11:45 AM',
    status: 'In-Transit',
    urgency: 'Normal',
    notes: 'Dispatched via scheduled express route.',
  },
  {
    id: 'TR-09',
    transferNo: 'TR-2026-0846',
    sourceBranch: 'Dhanmondi OPD Pharmacy',
    destBranch: 'Emergency Inpatient Ward',
    itemName: 'Human Albumin 20% 50ml IV',
    genericName: 'Human Normal Albumin',
    dosageForm: 'Infusion',
    batchNo: 'ALB-2024-11',
    quantity: 25,
    requestDate: 'Today, 11:30 AM',
    status: 'Pending Dispatch',
    urgency: 'Emergency',
    notes: 'Stat urgent request from Trauma Resuscitation ICU.',
  },
  {
    id: 'TR-10',
    transferNo: 'TR-2026-0830',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Khulna Center Dispensary',
    itemName: 'Fexofenadine 120mg (Fexo)',
    genericName: 'Fexofenadine HCl',
    dosageForm: 'Tablet',
    batchNo: 'FXO-2025-02',
    quantity: 1500,
    requestDate: '2 days ago',
    dispatchVehicle: 'Express Van KH-01',
    dispatchedAt: '2 days ago, 02:00 PM',
    receivedAt: 'Yesterday, 10:30 AM',
    status: 'Received & Verified',
    urgency: 'Normal',
    notes: 'Standard branch replenishment verified by duty pharmacist.',
  },
  {
    id: 'TR-11',
    transferNo: 'TR-2026-0828',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Barishal Care Wing',
    itemName: 'Pantonix 20 (20mg) Tablet',
    genericName: 'Pantoprazole',
    dosageForm: 'Tablet',
    batchNo: 'PTX-2025-15',
    quantity: 900,
    requestDate: '3 days ago',
    dispatchVehicle: 'River Route Ferry Logistic BR-02',
    dispatchedAt: '3 days ago, 08:00 AM',
    receivedAt: '2 days ago, 04:15 PM',
    status: 'Received & Verified',
    urgency: 'Normal',
    notes: 'Verified and stocked into Bay 2.',
  },
  {
    id: 'TR-12',
    transferNo: 'TR-2026-0847',
    sourceBranch: 'Central Medical Store (CMS)',
    destBranch: 'Dhanmondi OPD Pharmacy',
    itemName: 'Ace Plus (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Tablet',
    batchNo: 'ACP-2025-12',
    quantity: 3000,
    requestDate: 'Today, 11:35 AM',
    status: 'Pending Dispatch',
    urgency: 'Normal',
    notes: 'Buffer restock for evening rush hour dispensing.',
  },
];

export const PharmacistTransfersView: React.FC = () => {
  const [transfers, setTransfers] = useState<TransferOrder[]>(INITIAL_TRANSFERS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [selectedTransfer, setSelectedTransfer] = useState<TransferOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Transfer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceBranch, setSourceBranch] = useState('Central Medical Store (CMS)');
  const [destBranch, setDestBranch] = useState('Dhanmondi OPD Pharmacy');
  const [itemName, setItemName] = useState('Napa Extra (500mg+65mg)');
  const [genericName, setGenericName] = useState('Paracetamol + Caffeine');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [batchNo, setBatchNo] = useState('NP-2026-A1');
  const [quantity, setQuantity] = useState(1000);
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');
  const [dispatchVehicle, setDispatchVehicle] = useState('Hospital Logistics Van DHA-11');
  const [notes, setNotes] = useState('');

  // Gatepass Modal State
  const [inspectChallan, setInspectChallan] = useState<TransferOrder | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mark In-Transit / Verify & Receive
  const handleStatusUpdate = (id: string, newStatus: 'In-Transit' | 'Received & Verified') => {
    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = {
          ...t,
          status: newStatus,
          ...(newStatus === 'In-Transit' ? { dispatchedAt: 'Just now' } : {}),
          ...(newStatus === 'Received & Verified' ? { receivedAt: 'Just now' } : {}),
        };
        triggerToast(
          newStatus === 'Received & Verified'
            ? `✓ Transfer ${t.transferNo} marked Received & Verified at ${t.destBranch}!`
            : `🚚 Transfer ${t.transferNo} dispatched and now In-Transit!`
        );
        return updated;
      })
    );
    if (selectedTransfer && selectedTransfer.id === id) {
      setSelectedTransfer((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Create Transfer Requisition Submit
  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || quantity <= 0) return;

    const newOrder: TransferOrder = {
      id: `TR-${Date.now()}`,
      transferNo: `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sourceBranch,
      destBranch,
      itemName: itemName.trim(),
      genericName: genericName.trim() || itemName.trim(),
      dosageForm,
      batchNo: batchNo.trim() || `LOT-${Date.now().toString().slice(-4)}`,
      quantity,
      requestDate: 'Just now',
      dispatchVehicle: dispatchVehicle.trim() || 'Internal Courier',
      status: 'Pending Dispatch',
      urgency,
      notes: notes.trim() || 'Standard stock movement requisition.',
    };

    setTransfers((prev) => [newOrder, ...prev]);
    setIsModalOpen(false);
    setSelectedTransfer(newOrder);
    triggerToast(`✓ Created transfer challan ${newOrder.transferNo} to ${destBranch}!`);

    // Reset Form
    setItemName('Napa Extra (500mg+65mg)');
    setQuantity(1000);
    setNotes('');
  };

  // Stats for 4 Top Metric Cards
  const stats = useMemo(() => {
    const pending = transfers.filter((t) => t.status === 'Pending Dispatch').length;
    const inTransit = transfers.filter((t) => t.status === 'In-Transit').length;
    const received = transfers.filter((t) => t.status === 'Received & Verified').length;
    const totalPcs = transfers.reduce((acc, t) => acc + t.quantity, 0);

    return {
      pending,
      inTransit,
      received,
      total: transfers.length,
      totalPcs,
    };
  }, [transfers]);

  // Unique branches for route filter
  const branchList = useMemo(() => {
    const set = new Set<string>();
    transfers.forEach((t) => {
      set.add(t.sourceBranch);
      set.add(t.destBranch);
    });
    return Array.from(set).sort();
  }, [transfers]);

  // Filtered transfers for DataTable
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      // Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;

      // Urgency filter
      if (urgencyFilter !== 'all' && t.urgency !== urgencyFilter) return false;

      // Route filter
      if (routeFilter !== 'all') {
        if (!t.sourceBranch.includes(routeFilter) && !t.destBranch.includes(routeFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [transfers, statusFilter, urgencyFilter, routeFilter]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Challan #',
      'Medicine Name',
      'Generic Name',
      'Form',
      'Batch Lot',
      'Quantity (Units)',
      'Source Location',
      'Destination Branch',
      'Request Date',
      'Dispatched Vehicle',
      'Status',
      'Urgency',
      'Notes',
    ];
    const rows = filteredTransfers.map((t) => [
      `"${t.transferNo}"`,
      `"${t.itemName}"`,
      `"${t.genericName}"`,
      `"${t.dosageForm}"`,
      `"${t.batchNo}"`,
      t.quantity,
      `"${t.sourceBranch}"`,
      `"${t.destBranch}"`,
      `"${t.requestDate}"`,
      `"${t.dispatchVehicle || ''}"`,
      `"${t.status}"`,
      `"${t.urgency}"`,
      `"${t.notes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stock_transfers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns for Superadmin-Style DataTable
  const columns: DataTableColumn<TransferOrder>[] = [
    {
      key: 'transferNo',
      header: 'Challan #',
      sortable: true,
      sortValue: (r) => r.transferNo,
      render: (r: TransferOrder) => (
        <div>
          <span className="font-mono text-[11px] font-medium text-[#006a4e] tracking-tight block">
            {r.transferNo}
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            {r.requestDate}
          </span>
        </div>
      ),
    },
    {
      key: 'itemName',
      header: 'Medicine & Batch Lot',
      sortable: true,
      sortValue: (r) => r.itemName,
      render: (r: TransferOrder) => (
        <div>
          <div className="flex items-center gap-1.5 leading-snug">
            <span className="font-semibold text-slate-800 text-xs">{r.itemName}</span>
            <span className="text-[9.5px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-normal">
              {r.dosageForm}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
            Lot: <span className="font-mono font-normal text-slate-500">{r.batchNo}</span> · {r.genericName}
          </div>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Transfer Route (Source → Destination)',
      render: (r: TransferOrder) => (
        <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
          <span className="font-normal text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
            {r.sourceBranch.replace('Central Medical Store (CMS)', 'CMS Depot').replace(' Pharmacy', '')}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-semibold text-[#006a4e] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            {r.destBranch.replace(' Pharmacy', '')}
          </span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Transfer Qty',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.quantity,
      render: (r: TransferOrder) => (
        <div className="whitespace-nowrap">
          <span className="font-mono font-medium text-slate-700 text-xs block">
            {r.quantity.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">units</span>
        </div>
      ),
    },
    {
      key: 'urgency',
      header: 'Priority',
      align: 'center',
      sortable: true,
      sortValue: (r) => (r.urgency === 'Emergency' ? 0 : r.urgency === 'Urgent' ? 1 : 2),
      render: (r: TransferOrder) => {
        if (r.urgency === 'Emergency') {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1 whitespace-nowrap">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Emergency</span>
            </span>
          );
        }
        if (r.urgency === 'Urgent') {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Urgent</span>
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-normal bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
            Normal
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Movement Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => (r.status === 'Pending Dispatch' ? 0 : r.status === 'In-Transit' ? 1 : 2),
      render: (r: TransferOrder) => {
        if (r.status === 'Pending Dispatch') {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Pending Dispatch</span>
            </span>
          );
        }
        if (r.status === 'In-Transit') {
          return (
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-300 inline-flex items-center gap-1 whitespace-nowrap">
              <Truck className="w-3 h-3 text-sky-600" />
              <span>In-Transit</span>
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium bg-[#edf6f2] text-[#006a4e] border border-[#006a4e]/20 inline-flex items-center gap-1 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-[#006a4e]" />
            <span>Received & Verified</span>
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r: TransferOrder) => (
        <div
          className="flex items-center justify-end gap-1.5 whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          {r.status === 'Pending Dispatch' && (
            <button
              type="button"
              onClick={() => handleStatusUpdate(r.id, 'In-Transit')}
              className="px-2 py-1 rounded-[3px] bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Dispatch shipment with logistics gatepass"
            >
              <Truck className="w-3 h-3 text-sky-700" />
              <span>Dispatch</span>
            </button>
          )}

          {r.status === 'In-Transit' && (
            <button
              type="button"
              onClick={() => handleStatusUpdate(r.id, 'Received & Verified')}
              className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Verify delivery at destination branch"
            >
              <PackageCheck className="w-3 h-3" />
              <span>Verify & Receive</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setInspectChallan(r)}
            className="px-2 py-1 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Inspect challan document & gatepass"
          >
            <FileText className="w-3 h-3 text-slate-500" />
            <span>Challan</span>
          </button>
        </div>
      ),
    },
  ];

  // Superadmin Toolbar Filters
  const toolbarFilters = (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status Filter */}
      <div className="relative">
        <select
          aria-label="Filter by movement status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="all">All Statuses ({transfers.length})</option>
          <option value="Pending Dispatch">Pending Dispatch ({stats.pending})</option>
          <option value="In-Transit">In-Transit ({stats.inTransit})</option>
          <option value="Received & Verified">Received & Verified ({stats.received})</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {/* Urgency Filter */}
      <div className="relative">
        <select
          aria-label="Filter by urgency"
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="Emergency">Emergency</option>
          <option value="Urgent">Urgent</option>
          <option value="Normal">Normal</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {/* Route Filter */}
      <div className="relative">
        <select
          aria-label="Filter by branch route"
          value={routeFilter}
          onChange={(e) => setRouteFilter(e.target.value)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#006a4e] cursor-pointer"
        >
          <option value="all">All Connected Branches</option>
          {branchList.map((b) => (
            <option key={b} value={b}>
              {b}
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
        onClick={() => setIsModalOpen(true)}
        className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>New Transfer Order</span>
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
            <span className="text-[10.5px] font-bold text-slate-700">Pending Dispatch</span>
            <PackageOpen className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-700 leading-none">
              {stats.pending} Requisitions
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Awaiting packing & gatepass release</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">In-Transit Logistics</span>
            <Truck className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-sky-700 leading-none">
              {stats.inTransit} Active Vans
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Live courier & hospital cold-chain</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Received & Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-[#006a4e] leading-none">
              {stats.received} Completed
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Destination inventory updated</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Volume Moved</span>
            <Building2 className="w-3.5 h-3.5 text-[#0c2e4b]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {stats.totalPcs.toLocaleString()} Units
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Across 10 hospital network branches</p>
        </div>
      </div>

      {/* Selected Transfer Quick View Card (matching Superadmin directory) */}
      {selectedTransfer && (
        <div className="bg-white border border-[#006a4e]/25 rounded-[3px] p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                  CHALLAN: {selectedTransfer.transferNo}
                </span>
                <span className="text-sm font-semibold text-slate-800">{selectedTransfer.itemName}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-[#006a4e] border border-emerald-200">
                  {selectedTransfer.dosageForm}
                </span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    selectedTransfer.urgency === 'Emergency'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : selectedTransfer.urgency === 'Urgent'
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {selectedTransfer.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Route:{' '}
                <span className="font-semibold text-slate-700">{selectedTransfer.sourceBranch}</span>{' '}
                →{' '}
                <span className="font-semibold text-[#006a4e]">{selectedTransfer.destBranch}</span>{' '}
                · Lot: <span className="font-mono text-slate-600">{selectedTransfer.batchNo}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedTransfer.status === 'Pending Dispatch' && (
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedTransfer.id, 'In-Transit')}
                  className="h-8 px-3 rounded-[3px] bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dispatch Requisition</span>
                </button>
              )}

              {selectedTransfer.status === 'In-Transit' && (
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedTransfer.id, 'Received & Verified')}
                  className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Verify & Receive Stock</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setInspectChallan(selectedTransfer)}
                className="h-8 px-3 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Gatepass</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTransfer(null)}
                className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                aria-label="Close details"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Transfer Key Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Transfer Quantity</span>
              <span className="font-semibold text-slate-800 text-xs">
                {selectedTransfer.quantity.toLocaleString()} Units
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Requisition Date</span>
              <span className="font-normal text-slate-700 text-xs">{selectedTransfer.requestDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Dispatch Transport</span>
              <span className="font-normal text-slate-700 text-xs truncate block" title={selectedTransfer.dispatchVehicle}>
                {selectedTransfer.dispatchVehicle || 'Logistics Van'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Current Status</span>
              <span
                className={`font-semibold text-xs ${
                  selectedTransfer.status === 'Received & Verified'
                    ? 'text-[#006a4e]'
                    : selectedTransfer.status === 'In-Transit'
                    ? 'text-sky-700'
                    : 'text-amber-600'
                }`}
              >
                {selectedTransfer.status}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Requisition Notes</span>
              <span className="text-slate-500 truncate block font-normal text-xs" title={selectedTransfer.notes}>
                {selectedTransfer.notes || 'Routine stock rebalance'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Superadmin Enterprise DataTable */}
      <DataTable<TransferOrder>
        data={filteredTransfers}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search transfer challan #, medicine name, lot, or hospital branch..."
        searchFilter={(item, query) =>
          item.transferNo.toLowerCase().includes(query.toLowerCase()) ||
          item.itemName.toLowerCase().includes(query.toLowerCase()) ||
          item.genericName.toLowerCase().includes(query.toLowerCase()) ||
          item.batchNo.toLowerCase().includes(query.toLowerCase()) ||
          item.sourceBranch.toLowerCase().includes(query.toLowerCase()) ||
          item.destBranch.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={toolbarFilters}
        headerActions={headerActions}
        pageSizeOptions={[10, 20, 50, 100]}
        defaultPageSize={20}
        emptyTitle="No transfer orders found"
        emptyDescription="No transfer orders match the selected filter parameters."
        showSerial={true}
        onRowClick={(row) => setSelectedTransfer(row)}
      />

      {/* NEW TRANSFER REQUISITION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-lg w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create Stock Transfer Requisition</h3>
                  <p className="text-[11px] text-slate-500">Initiate inter-branch dispatch challan and logistics gatepass</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <DropdownSelect
                    native
                    label="Source Location *"
                    options={[
                      'Central Medical Store (CMS)',
                      'Dhanmondi OPD Pharmacy',
                      'Uttara Branch Pharmacy',
                      'Mirpur Branch Pharmacy',
                      'Gulshan Executive Pharmacy',
                      'Chattogram Hub Pharmacy',
                    ]}
                    value={sourceBranch}
                    onChange={(val) => setSourceBranch(val)}
                    width="w-full"
                    className="w-full"
                  />
                </div>
                <div>
                  <DropdownSelect
                    native
                    label="Destination Branch *"
                    options={[
                      'Dhanmondi OPD Pharmacy',
                      'Uttara Branch Pharmacy',
                      'Mirpur Branch Pharmacy',
                      'Gulshan Executive Pharmacy',
                      'Central Medical Store (CMS)',
                      'Chattogram Hub Pharmacy',
                      'Sylhet Campus Pharmacy',
                      'Khulna Center Dispensary',
                      'Barishal Care Wing',
                      'ICU Satellite Pharmacy',
                      'Emergency Inpatient Ward',
                    ]}
                    value={destBranch}
                    onChange={(val) => setDestBranch(val)}
                    width="w-full"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Medicine Brand & Strength *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Napa Extra (500mg+65mg)"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Generic Name
                  </label>
                  <input
                    type="text"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g. Paracetamol + Caffeine"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <DropdownSelect
                    native
                    label="Form"
                    options={['Tablet', 'Capsule', 'Injection', 'Infusion', 'Syrup']}
                    value={dosageForm}
                    onChange={(val) => setDosageForm(val)}
                    width="w-full"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Batch / Lot #
                  </label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    placeholder="e.g. NP-2026-A1"
                    className="w-full h-8 px-2 font-mono uppercase rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs font-bold text-center focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <DropdownSelect
                    native
                    label="Requisition Priority"
                    options={[
                      { label: 'Normal (Routine Dispatch)', value: 'Normal' },
                      { label: 'Urgent (Ward Shortage)', value: 'Urgent' },
                      { label: 'Emergency (Immediate Stat)', value: 'Emergency' },
                    ]}
                    value={urgency}
                    onChange={(val) => setUrgency(val as any)}
                    width="w-full"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Dispatch Transport / Van
                  </label>
                  <input
                    type="text"
                    value={dispatchVehicle}
                    onChange={(e) => setDispatchVehicle(e.target.value)}
                    placeholder="Logistics Van DHA-11"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Requisition Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Monthly buffer restock for OPD pharmacy."
                  className="w-full p-2 rounded-[3px] border border-slate-300 text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Create Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHALLAN / GATEPASS INSPECTION MODAL */}
      {inspectChallan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-xl w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Inter-Branch Transfer Gatepass Challan
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Official Document: {inspectChallan.transferNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectChallan(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Document Header */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Hospital System</span>
                  <span className="font-bold text-slate-900 text-sm">Green Life Hospital & Healthcare Network</span>
                  <span className="text-[11px] text-slate-500 block">Department of Pharmacy & Central Logistics</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      inspectChallan.status === 'Received & Verified'
                        ? 'bg-emerald-100 text-[#006a4e]'
                        : inspectChallan.status === 'In-Transit'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inspectChallan.status}
                  </span>
                </div>
              </div>

              {/* Transfer Route Box */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded bg-white border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Source Origin</span>
                  <span className="font-bold text-slate-800 text-xs block">{inspectChallan.sourceBranch}</span>
                  <span className="text-[11px] text-slate-500">Authorized: CMS Warehouse Lead</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination Branch</span>
                  <span className="font-bold text-[#006a4e] text-xs block">{inspectChallan.destBranch}</span>
                  <span className="text-[11px] text-slate-500">Receiver: Inpatient/OPD Pharmacy</span>
                </div>
              </div>

              {/* Item Details Table */}
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[11px]">
                    <th className="p-2 border border-slate-200">Medicine & Generic</th>
                    <th className="p-2 border border-slate-200">Batch Lot #</th>
                    <th className="p-2 border border-slate-200 text-center">Form</th>
                    <th className="p-2 border border-slate-200 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-200">
                      <span className="font-bold text-slate-900 block">{inspectChallan.itemName}</span>
                      <span className="text-[10px] text-slate-500">{inspectChallan.genericName}</span>
                    </td>
                    <td className="p-2 border border-slate-200 font-mono text-slate-800">
                      {inspectChallan.batchNo}
                    </td>
                    <td className="p-2 border border-slate-200 text-center">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {inspectChallan.dosageForm}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {inspectChallan.quantity.toLocaleString()} Units
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Logistics & Security Gatepass Verification */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 pt-1">
                <div>
                  <span className="font-semibold text-slate-700">Transport: </span>
                  {inspectChallan.dispatchVehicle || 'Logistics Van DHA-11'}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Priority: </span>
                  <span className="font-bold text-slate-900">{inspectChallan.urgency}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-700">Security Gatepass Clearance: </span>
                  Verified and stamped at Central Medical Store Gate #2.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Green Life HMS • Pharmacy Logistics ERP</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast(`✓ Printed Gatepass Challan ${inspectChallan.transferNo}`);
                      setInspectChallan(null);
                    }}
                    className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Challan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectChallan(null)}
                    className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
