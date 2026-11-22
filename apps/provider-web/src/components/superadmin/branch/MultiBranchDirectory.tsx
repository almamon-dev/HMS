import {
  Activity,
  Bed,
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  GitBranch,
  MoreVertical,
  Network,
  Plus,
  Printer,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  BRANCH_TRANSFERS,
  BranchTransferRecord,
  HOSPITAL_BRANCHES,
  HospitalBranchRecord,
} from '../../../data/superadminBranchData';
import { DataTable, DataTableColumn } from '../../common/DataTable';
import { MultiBranchOverview } from './MultiBranchOverview';

type MultiBranchTab = 'overview' | 'directory' | 'report' | 'settings';

interface MultiBranchDirectoryProps {
  initialSubTab?: 'branch-overview' | 'branch-report' | 'branch-settings' | string;
}

export const MultiBranchDirectory: React.FC<MultiBranchDirectoryProps> = ({
  initialSubTab,
}) => {
  const initialTab: MultiBranchTab =
    initialSubTab === 'branch-report'
      ? 'report'
      : initialSubTab === 'branch-settings'
        ? 'settings'
        : 'overview';

  const [activeTab, setActiveTab] = useState<MultiBranchTab>(initialTab);
  const [branches, setBranches] = useState<HospitalBranchRecord[]>(HOSPITAL_BRANCHES);
  const [transfers] = useState<BranchTransferRecord[]>(BRANCH_TRANSFERS);
  const [cityFilter, setCityFilter] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState<HospitalBranchRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Branch Form
  const [newCode, setNewCode] = useState('BR-NEW-06');
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('Dhaka');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('+880 2 ');
  const [newIncharge, setNewIncharge] = useState('');
  const [newBeds, setNewBeds] = useState(100);
  const [newIcu, setNewIcu] = useState(10);
  const [newOt, setNewOt] = useState(3);

  useEffect(() => {
    if (initialSubTab === 'branch-report') setActiveTab('report');
    else if (initialSubTab === 'branch-settings') setActiveTab('settings');
    else if (initialSubTab === 'branch-overview') setActiveTab('overview');
  }, [initialSubTab]);

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // 4 Top Metrics matching PatientDirectory style
  const stats = useMemo(() => {
    const totalBeds = branches.reduce((s, b) => s + b.totalBeds, 0);
    const availableBeds = branches.reduce((s, b) => s + b.availableBeds, 0);
    const activeTransfers = transfers.filter((t) => t.status === 'In Transit').length;
    return {
      totalBranches: branches.length,
      totalBeds,
      availableBeds,
      activeTransfers,
    };
  }, [branches, transfers]);

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchCity = cityFilter === 'All' || b.city === cityFilter;
      return matchCity;
    });
  }, [branches, cityFilter]);

  const handleSyncNetwork = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: HospitalBranchRecord = {
      id: `br-${Date.now()}`,
      code: newCode,
      name: newName.trim(),
      zone: `${newCity} Regional Hub`,
      city: newCity,
      address: newAddress.trim() || `${newCity}, Bangladesh`,
      phone: newPhone.trim(),
      email: `${newCode.toLowerCase()}@greenhospital.org`,
      incharge: newIncharge.trim() || 'Dr. Assigned Lead',
      totalBeds: Number(newBeds) || 100,
      availableBeds: Math.round(Number(newBeds) * 0.2),
      icuBeds: Number(newIcu) || 10,
      operationTheatres: Number(newOt) || 2,
      dailyFootfall: 350,
      syncStatus: 'Real-Time Live',
      status: 'Active',
    };

    setBranches((prev) => [created, ...prev]);
    setSelectedBranch(created);
    setShowAddBranchModal(false);
    setNewName('');
    setNewAddress('');
  };

  const branchColumns: DataTableColumn<HospitalBranchRecord>[] = [
    {
      key: 'code',
      header: 'Branch Code',
      sortable: true,
      sortValue: (r) => r.code,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBranch(r);
          }}
          className="text-[#0094b6] hover:underline font-bold text-left cursor-pointer whitespace-nowrap"
        >
          {r.code}
        </button>
      ),
    },
    {
      key: 'name',
      header: 'Hospital Branch Name',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBranch(r);
            }}
            className="text-slate-900 font-semibold hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.name}
          </button>
          <span className="text-[10px] text-slate-500">{r.zone}</span>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.city,
      render: (r) => r.city,
    },
    {
      key: 'incharge',
      header: 'Branch Superintendent / In-Charge',
      render: (r) => (
        <span className="text-slate-800 font-medium whitespace-nowrap">{r.incharge}</span>
      ),
    },
    {
      key: 'beds',
      header: 'Total Beds',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.totalBeds,
      render: (r) => (
        <span className="font-semibold text-slate-900">
          {r.availableBeds} / {r.totalBeds}
        </span>
      ),
    },
    {
      key: 'icu',
      header: 'ICU Beds',
      align: 'center',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[10px]">
          {r.icuBeds} ICU
        </span>
      ),
    },
    {
      key: 'ot',
      header: 'OT Suites',
      align: 'center',
      render: (r) => `${r.operationTheatres} OTs`,
    },
    {
      key: 'footfall',
      header: 'Daily Footfall',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.dailyFootfall,
      render: (r) => (
        <span className="font-medium text-slate-700">{r.dailyFootfall} / day</span>
      ),
    },
    {
      key: 'syncStatus',
      header: 'Network Replica',
      align: 'center',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {r.syncStatus}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold border ${r.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (r, idx?: number) => {
        const isNearBottom = (idx ?? 0) >= 4;
        return (
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionId((prev) => (prev === r.id ? null : r.id));
              }}
              className="w-5 h-5 rounded-[3px] hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer mx-auto"
              title="Actions"
              aria-label="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {activeActionId === r.id && (
              <div
                className={`absolute right-0 ${isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                  } w-36 bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-40 text-left divide-y divide-slate-100`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBranch(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span>View Branch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBranch(r);
                      setActiveActionId(null);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Profile</span>
                  </button>
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBranches((prev) => prev.filter((b) => b.id !== r.id));
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const transferColumns: DataTableColumn<BranchTransferRecord>[] = [
    {
      key: 'transferNo',
      header: 'Transfer No',
      sortable: true,
      sortValue: (r) => r.transferNo,
      render: (r) => (
        <span className="font-bold text-[#0094b6] whitespace-nowrap">{r.transferNo}</span>
      ),
    },
    {
      key: 'uhid',
      header: 'Patient UHID',
      sortable: true,
      sortValue: (r) => r.uhid,
      render: (r) => (
        <span className="font-semibold text-slate-800 whitespace-nowrap">{r.uhid}</span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => <span className="font-semibold text-slate-900">{r.patientName}</span>,
    },
    {
      key: 'originBranch',
      header: 'Origin Branch',
      render: (r) => r.originBranch,
    },
    {
      key: 'destinationBranch',
      header: 'Destination Branch',
      render: (r) => (
        <span className="font-semibold text-[#006a4e]">{r.destinationBranch}</span>
      ),
    },
    {
      key: 'transportMode',
      header: 'Transport Mode',
      render: (r) => (
        <span className="px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[10px] font-medium">
          {r.transportMode}
        </span>
      ),
    },
    {
      key: 'transferReason',
      header: 'Clinical Reason',
      render: (r) => (
        <span className="text-slate-600 truncate max-w-xs block" title={r.transferReason}>
          {r.transferReason}
        </span>
      ),
    },
    {
      key: 'transferDate',
      header: 'Transfer Date',
      render: (r) => <span className="whitespace-nowrap">{r.transferDate}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold border ${r.status === 'Completed'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : r.status === 'In Transit'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  // Toolbar Filters matching PatientDirectory
  const toolbarFilters = (
    <>
      <div className="relative">
        <select
          aria-label="Filter by branch section"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as MultiBranchTab)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
        >
          <option value="overview">Overview (Department Breakdown)</option>
          <option value="directory">Campus Directory &amp; Capacity</option>
          <option value="report">Inter-Branch Transfer &amp; Audit Report</option>
          <option value="settings">Multi-Branch Synchronization Settings</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>

      {activeTab === 'directory' && (
        <div className="relative">
          <select
            aria-label="Filter by city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
          >
            <option value="All">All Cities</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
            <option value="Sylhet">Sylhet</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      )}
    </>
  );

  // Toolbar Actions matching PatientDirectory
  const toolbarActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setShowAddBranchModal(true)}
        className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Register Branch</span>
      </button>

      <button
        type="button"
        onClick={handleSyncNetwork}
        className="h-8 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{isSyncing ? 'Syncing...' : 'Sync Network'}</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Module Sub-tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'overview'
              ? 'bg-[#0094b6] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'directory'
              ? 'bg-[#0094b6] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Directory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'report'
              ? 'bg-[#0094b6] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'settings'
              ? 'bg-[#0094b6] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* 1. Overview Tab: Multi-Branch Department Telemetry Breakdown */}
      {activeTab === 'overview' && <MultiBranchOverview />}

      {/* 2. Campus Directory Tab */}
      {activeTab === 'directory' && (
        <div className="space-y-2">
          {/* 4 Summary Metric Cards matching PatientDirectory format */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-700">Total Hospital Branches</span>
                <Building2 className="w-3.5 h-3.5 text-[#0094b6]" />
              </div>
              <div className="my-1">
                <span className="text-base font-extrabold text-slate-900 leading-none">
                  {stats.totalBranches} Branches
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Dhaka, Chattogram, Sylhet metropolitan hubs</p>
            </div>

            <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-700">Aggregate Bed Capacity</span>
                <Bed className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="my-1">
                <span className="text-base font-extrabold text-emerald-700 leading-none">
                  {stats.availableBeds} / {stats.totalBeds} Beds
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Inpatient general, cabin, and ICU facilities</p>
            </div>

            <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-700">Inter-Branch Transfers</span>
                <GitBranch className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="my-1">
                <span className="text-base font-extrabold text-amber-600 leading-none">
                  {transfers.length} Transfers
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Cross-branch clinical escalations today</p>
            </div>

            <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-700">Network Sync Health</span>
                <Network className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="my-1">
                <span className="text-base font-extrabold text-sky-700 leading-none">
                  100% Real-Time
                </span>
              </div>
              <p className="text-[10px] text-slate-500">PostgreSQL distributed replica active</p>
            </div>
          </div>

          {/* Selected Branch Quick View Card matching Patient Directory styling */}
          {selectedBranch && (
            <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-sm flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {selectedBranch.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {selectedBranch.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        {selectedBranch.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      In-Charge: <strong className="text-slate-800">{selectedBranch.incharge}</strong> · Address: {selectedBranch.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="h-8 px-3 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBranch(null)}
                    className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                    aria-label="Close branch quick view"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                <div>
                  <p className="text-[11px] text-slate-400">Total Bed Capacity</p>
                  <p className="font-semibold text-slate-800">
                    {selectedBranch.availableBeds} available / {selectedBranch.totalBeds} total
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">ICU &amp; OT Capacity</p>
                  <p className="font-bold text-slate-900">
                    {selectedBranch.icuBeds} ICU Beds · {selectedBranch.operationTheatres} OTs
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Contact Telephone</p>
                  <p className="font-medium text-slate-800">{selectedBranch.phone}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Database Sync Status</p>
                  <p className="font-bold text-emerald-700">{selectedBranch.syncStatus}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reusable DataTable for Campus Directory */}
          <DataTable<HospitalBranchRecord>
            title="Hospital Branch Directory"
            subtitle="Multi-campus hospital infrastructure, bed allocations, and live occupancy telemetry"
            data={filteredBranches}
            columns={branchColumns}
            rowKey={(r) => r.id}
            searchable
            searchPlaceholder="Search by branch code, name, city, or incharge..."
            searchFilter={(r, q) =>
              r.code.toLowerCase().includes(q) ||
              r.name.toLowerCase().includes(q) ||
              r.city.toLowerCase().includes(q) ||
              r.incharge.toLowerCase().includes(q)
            }
            toolbarFilters={toolbarFilters}
            toolbarActions={toolbarActions}
            defaultPageSize={8}
            pageSizeOptions={[8, 12, 20, 30, 50, 100]}
            emptyTitle="No branches found"
            emptyDescription="No hospital branches matching your filter criteria."
          />
        </div>
      )}

      {activeTab === 'report' && (
        <DataTable<BranchTransferRecord>
          title="Inter-Branch Transfer &amp; Referral Report"
          subtitle="Cross-campus patient transports, specialized ICU referrals, and ambulance handovers"
          data={transfers}
          columns={transferColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by transfer no, UHID, patient name, or destination..."
          searchFilter={(r, q) =>
            r.transferNo.toLowerCase().includes(q) ||
            r.uhid.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.destinationBranch.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No transfers found"
          emptyDescription="No inter-branch transfer records found for the selected period."
        />
      )}

      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-300 rounded-[3px] p-4 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Multi-Branch Synchronization &amp; Replication Settings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure central database master-replica failover, cross-campus billing sync, and emergency referral routing.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSyncNetwork}
              className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Force Re-Sync Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 border border-slate-200 rounded-[3px] bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Network className="w-4 h-4 text-[#0094b6]" />
                <span>Central Core Master</span>
              </div>
              <p className="text-slate-600">
                Primary data center hosted in Dhanmondi. All branches sync electronic health records, billing ledgers, and pharmacy stocks in sub-second intervals.
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Latency: 12ms · 100% Uptime</span>
              </div>
            </div>

            <div className="p-3 border border-slate-200 rounded-[3px] bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Offline Node Failover</span>
              </div>
              <p className="text-slate-600">
                Each campus contains a high-availability local edge database. If metro fiber connectivity drops, the local OPD/IPD workstation operates offline and syncs automatically upon reconnection.
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Data Loss Protection</span>
              </div>
            </div>

            <div className="p-3 border border-slate-200 rounded-[3px] bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <GitBranch className="w-4 h-4 text-purple-600" />
                <span>Cross-Branch Billing Sync</span>
              </div>
              <p className="text-slate-600">
                Patients registered at any branch can access inpatient facilities, pharmacy, and diagnostic services across all 5 campuses under the same global UHID.
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-[#006a4e] font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Unified UHID Registry Enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Branch Modal */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-sm font-bold text-slate-900">Register New Hospital Branch</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBranchModal(false)}
                className="w-7 h-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Branch Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Green Hospital East Hub"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full h-8 px-2 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Telephone Contact
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+880 2 ..."
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Street Address
                  </label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Street address, building number, area"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Branch Superintendent / In-Charge
                  </label>
                  <input
                    type="text"
                    value={newIncharge}
                    onChange={(e) => setNewIncharge(e.target.value)}
                    placeholder="e.g. Dr. Sabrina Karim"
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Total Beds
                  </label>
                  <input
                    type="number"
                    value={newBeds}
                    onChange={(e) => setNewBeds(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    ICU Beds
                  </label>
                  <input
                    type="number"
                    value={newIcu}
                    onChange={(e) => setNewIcu(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Operation Theatres
                  </label>
                  <input
                    type="number"
                    value={newOt}
                    onChange={(e) => setNewOt(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white font-semibold cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
