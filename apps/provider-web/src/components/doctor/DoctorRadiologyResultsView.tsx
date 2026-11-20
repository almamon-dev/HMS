import {
  Eye,
  FileCheck2,
  Image as ImageIcon,
  Plus,
  ScanLine,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  DOCTOR_RADIOLOGY_ORDERS,
  DoctorRadiologyOrder,
} from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorRadiologyResultsView: React.FC = () => {
  const [radiologyOrders, setRadiologyOrders] = useState<DoctorRadiologyOrder[]>(DOCTOR_RADIOLOGY_ORDERS);
  const [modalityFilter, setModalityFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<DoctorRadiologyOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // New Order Form
  const [patientName, setPatientName] = useState('');
  const [uhid, setUhid] = useState('');
  const [modality, setModality] = useState<DoctorRadiologyOrder['modality']>('Echocardiogram');
  const [scanName, setScanName] = useState('2D & Color Doppler Echocardiogram');

  // 4 Superadmin-Styled KPI Cards
  const stats = useMemo(() => {
    const total = radiologyOrders.length;
    const ready = radiologyOrders.filter((o) => o.status === 'Impression Ready').length;
    const echo = radiologyOrders.filter((o) => o.modality === 'Echocardiogram').length;
    const crossSectional = radiologyOrders.filter((o) => o.modality === 'CT Scan' || o.modality === 'MRI').length;
    return { total, ready, echo, crossSectional };
  }, [radiologyOrders]);

  const filteredOrders = useMemo(() => {
    return radiologyOrders.filter((ord) => {
      const matchesModality = modalityFilter === 'All' || ord.modality === modalityFilter;
      return matchesModality;
    });
  }, [radiologyOrders, modalityFilter]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newOrd: DoctorRadiologyOrder = {
      id: `rad-${Date.now()}`,
      orderNumber: `RAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      uhid: uhid || `UHID-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientName.trim(),
      age: 52,
      modality,
      scanName,
      orderDate: '20 Nov 2026 04:35 PM',
      status: 'Scheduled',
      radiologistImpression: 'Awaiting imaging acquisition in suite.',
    };

    setRadiologyOrders([newOrd, ...radiologyOrders]);
    setShowOrderModal(false);
  };

  const columns: DataTableColumn<DoctorRadiologyOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Study ID',
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
      key: 'modality',
      header: 'Modality',
      sortable: true,
      sortValue: (r) => r.modality,
      render: (r) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[10px] whitespace-nowrap">
          {r.modality}
        </span>
      ),
    },
    {
      key: 'scanName',
      header: 'Imaging Study Name',
      sortable: true,
      sortValue: (r) => r.scanName,
      render: (r) => (
        <span className="font-bold text-slate-800">
          {r.scanName}
        </span>
      ),
    },
    {
      key: 'radiologistImpression',
      header: 'Radiologist Impression',
      render: (r) => (
        <div className="text-slate-600 max-w-xs truncate" title={r.radiologistImpression}>
          {r.radiologistImpression || 'Pending Radiologist Dictation'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.status === 'Impression Ready'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-amber-100 text-amber-800'
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
            className="px-2.5 py-1 rounded bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>Impression</span>
          </button>
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={modalityFilter}
      onChange={(val) => setModalityFilter(val)}
      width="w-44"
      options={[
        { label: 'All Modalities', value: 'All' },
        { label: 'Echocardiogram', value: 'Echocardiogram' },
        { label: 'Digital X-Ray', value: 'X-Ray' },
        { label: 'CT Scan', value: 'CT Scan' },
        { label: 'MRI', value: 'MRI' },
        { label: 'Ultrasound', value: 'Ultrasound' },
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
      <span>Order Imaging Study</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Imaging Orders"
          icon={ScanLine}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Studies`}
          subtitle="PACS archived digital scans"
        />
        <SummaryCard
          title="Impressions Ready"
          icon={FileCheck2}
          iconColor="text-emerald-600"
          value={`${stats.ready} Signed Off`}
          valueColor="text-emerald-700"
          subtitle="Radiologist verified reports"
        />
        <SummaryCard
          title="Echocardiography"
          icon={ImageIcon}
          iconColor="text-cyan-600"
          value={`${stats.echo} 2D Doppler`}
          valueColor="text-cyan-700"
          subtitle="Cardiology ultrasound studies"
        />
        <SummaryCard
          title="CT / MRI Scans"
          icon={ScanLine}
          iconColor="text-amber-600"
          value={`${stats.crossSectional} Tomography`}
          valueColor="text-amber-700"
          subtitle="Cross-sectional angiography"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorRadiologyOrder>
        data={filteredOrders}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by order number, scan name, patient or UHID..."
        searchFilter={(item, query) =>
          item.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.patientName.toLowerCase().includes(query.toLowerCase()) ||
          item.uhid.toLowerCase().includes(query.toLowerCase()) ||
          item.scanName.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No radiology orders found."
        onRowClick={(item) => setSelectedOrder(item)}
        showSerial={true}
      />

      {/* Impression Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Radiology Impression ({selectedOrder.orderNumber})
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
                  <span className="text-slate-400 block text-[10px]">Modality</span>
                  <span className="font-semibold text-emerald-800">{selectedOrder.modality}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Report Date</span>
                  <span className="text-slate-700">{selectedOrder.reportDate || selectedOrder.orderDate}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] mb-1">Imaging Study</span>
                <div className="text-sm font-bold text-slate-900">
                  {selectedOrder.scanName}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="font-bold text-slate-800 block">
                  Radiologist Impression & Diagnostic Findings:
                </span>
                <p className="text-slate-800 text-xs leading-relaxed font-medium">
                  {selectedOrder.radiologistImpression}
                </p>
              </div>

              {/* Simulated PACS Viewer Banner */}
              <div className="p-3 rounded-lg bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-300" />
                  <div>
                    <div className="font-bold text-xs">Integrated PACS DICOM Viewer</div>
                    <div className="text-[10px] text-slate-400">High-resolution cross-sectional multi-slice study</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Opening DICOM study for ${selectedOrder.patientName} in PACS viewer...`)}
                  className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Launch PACS
                </button>
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

      {/* Order Imaging Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Order Diagnostic Imaging Study
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
                  placeholder="e.g. Mrs. Nasrin Sultana"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Modality
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Echocardiogram">Echocardiogram</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="MRI">MRI</option>
                    <option value="Ultrasound">Ultrasound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Study Procedure Name
                  </label>
                  <input
                    type="text"
                    required
                    value={scanName}
                    onChange={(e) => setScanName(e.target.value)}
                    placeholder="e.g. 2D Echo or Chest PA"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                  />
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
                  Submit Imaging Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
