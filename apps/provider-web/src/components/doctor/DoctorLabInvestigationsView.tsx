import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Filter,
  FlaskConical,
  Plus,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_LAB_ORDERS, DoctorLabOrder } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorLabInvestigationsView: React.FC = () => {
  const [labOrders, setLabOrders] = useState<DoctorLabOrder[]>(DOCTOR_LAB_ORDERS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<DoctorLabOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Order modal form
  const [patientName, setPatientName] = useState('');
  const [uhid, setUhid] = useState('');
  const [testName, setTestName] = useState('High-Sensitivity Troponin-I (hs-cTnI)');
  const [category, setCategory] = useState<DoctorLabOrder['category']>('Cardiac Markers');
  const [urgency, setUrgency] = useState('Routine');

  // 4 Superadmin-Styled KPI Cards
  const stats = useMemo(() => {
    const total = labOrders.length;
    const critical = labOrders.filter((o) => o.status === 'Critical Alert').length;
    const ready = labOrders.filter((o) => o.status === 'Report Ready').length;
    const pending = labOrders.filter((o) => o.status === 'Processing' || o.status === 'Sample Collected').length;
    return { total, critical, ready, pending };
  }, [labOrders]);

  const filteredOrders = useMemo(() => {
    return labOrders.filter((ord) => {
      const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
      return matchesStatus;
    });
  }, [labOrders, statusFilter]);

  const handleSignOff = (id: string) => {
    setLabOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, signedOff: true } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, signedOff: true } : null));
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newOrder: DoctorLabOrder = {
      id: `lab-${Date.now()}`,
      orderNumber: `LAB-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      uhid: uhid || `UHID-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientName.trim(),
      age: 48,
      testName,
      category,
      orderDate: '20 Nov 2026 04:30 PM',
      status: 'Sample Collected',
      flag: 'Pending',
      parameterSummary: 'Sample in transit to central automated analyzer',
      signedOff: false,
    };

    setLabOrders([newOrder, ...labOrders]);
    setShowOrderModal(false);
  };

  const columns: DataTableColumn<DoctorLabOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order No',
      sortable: true,
      sortValue: (r) => r.orderNumber,
      render: (r) => (
        <span className="font-extrabold text-[#006a4e] whitespace-nowrap">
          {r.orderNumber}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 leading-tight">{r.patientName}</div>
          <div className="text-[11px] text-slate-500">{r.uhid}</div>
        </div>
      ),
    },
    {
      key: 'testName',
      header: 'Laboratory Investigation Panel',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-800 leading-tight">{r.testName}</div>
          <div className="text-[11px] text-slate-400">{r.category}</div>
        </div>
      ),
    },
    {
      key: 'parameterSummary',
      header: 'Observed Clinical Findings',
      render: (r) => (
        <div className="text-slate-600 max-w-xs truncate" title={r.parameterSummary}>
          {r.parameterSummary}
        </div>
      ),
    },
    {
      key: 'flag',
      header: 'Flag Alert',
      sortable: true,
      sortValue: (r) => r.flag,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.flag === 'Critical High'
            ? 'bg-rose-100 text-rose-800 animate-pulse'
            : r.flag === 'Abnormal High'
              ? 'bg-amber-100 text-amber-800'
              : r.flag === 'Normal'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}
        >
          {r.flag}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Order Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.status === 'Critical Alert'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : r.status === 'Report Ready'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-sky-50 text-sky-700 border border-sky-200'
            }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedOrder(r)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            title="View Lab Report"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {!r.signedOff && (
            <button
              type="button"
              onClick={() => handleSignOff(r.id)}
              className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Sign-off</span>
            </button>
          )}
          {r.signedOff && (
            <span className="text-[11px] text-emerald-700 font-bold">
              Signed
            </span>
          )}
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={statusFilter}
      onChange={(val) => setStatusFilter(val)}
      width="w-44"
      options={[
        { label: 'All Statuses', value: 'All' },
        { label: 'Critical Alert', value: 'Critical Alert' },
        { label: 'Report Ready', value: 'Report Ready' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Sample Collected', value: 'Sample Collected' },
      ]}
    />
  );

  const toolbarActions = (
    <button
      type="button"
      onClick={() => setShowOrderModal(true)}
      className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Order Investigation</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Ordered"
          icon={FlaskConical}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Orders`}
          subtitle="Pathology & biochemistry tests"
        />
        <SummaryCard
          title="Critical STAT Alerts"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          value={`${stats.critical} Action Flags`}
          valueColor="text-rose-700"
          subtitle="High sensitivity cardiac markers"
        />
        <SummaryCard
          title="Reports Verified"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={`${stats.ready} Published`}
          valueColor="text-emerald-700"
          subtitle="Pathologist signed & validated"
        />
        <SummaryCard
          title="In Analyzer / Queue"
          icon={Filter}
          iconColor="text-amber-600"
          value={`${stats.pending} In Progress`}
          valueColor="text-amber-700"
          subtitle="Running automated assay"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorLabOrder>
        data={filteredOrders}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by order number, test name, patient or UHID..."
        searchFilter={(item, query) =>
          item.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.testName.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No laboratory orders found."
        onRowClick={(item) => setSelectedOrder(item)}
        showSerial={true}
      />

      {/* Lab Result Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Laboratory Test Report ({selectedOrder.orderNumber})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name</span>
                  <span className="font-bold text-slate-900">{selectedOrder.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">UHID</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.uhid}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Test Category</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ordered Date</span>
                  <span className="text-slate-700">{selectedOrder.orderDate}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] mb-1">Investigation Name</span>
                <div className="text-sm font-bold text-slate-900">
                  {selectedOrder.testName}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Observed Clinical Parameter</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedOrder.flag === 'Critical High'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedOrder.flag === 'Abnormal High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                      }`}
                  >
                    {selectedOrder.flag}
                  </span>
                </div>
                <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                  {selectedOrder.parameterSummary}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-slate-500">
                  Doctor Sign-off:{' '}
                  {selectedOrder.signedOff ? (
                    <span className="font-bold text-emerald-700">Signed & Verified</span>
                  ) : (
                    <span className="font-bold text-amber-700">Pending Physician Review</span>
                  )}
                </span>

                {!selectedOrder.signedOff && (
                  <button
                    type="button"
                    onClick={() => handleSignOff(selectedOrder.id)}
                    className="px-3.5 py-1.5 rounded-md bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Sign-off Report
                  </button>
                )}
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-3.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Lab Investigation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Order Diagnostic Lab Test
              </h3>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Md. Mostafa Kamal"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Patient UHID
                </label>
                <input
                  type="text"
                  value={uhid}
                  onChange={(e) => setUhid(e.target.value)}
                  placeholder="UHID-2024-..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Investigation Test Panel
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Serum Electrolytes, HbA1c, hs-cTnI"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Lab Discipline
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Cardiac Markers">Cardiac Markers</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Microbiology">Microbiology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Clinical Priority
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Routine">Routine</option>
                    <option value="STAT Emergency">STAT Emergency</option>
                    <option value="Urgent (Today)">Urgent (Today)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-3.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Send Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
