import React, { useState } from 'react';
import {
  CheckCircle,
  Flame,
  Phone,
  PhoneCall,
  ShieldAlert,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  CRITICAL_RESULTS_DATA,
  CURRENT_PATHOLOGIST,
  CriticalResultAlert,
} from '../../data/pathologistPortalData';

export const PathologistCriticalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'notified' | 'acknowledged'>('pending');
  const [selectedAlert, setSelectedAlert] = useState<CriticalResultAlert | null>(null);
  const [callNotes, setCallNotes] = useState<string>('');
  const [readBackConfirmed, setReadBackConfirmed] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const pendingAlerts = CRITICAL_RESULTS_DATA.filter(
    (a) => a.notificationStatus === 'Pending Doctor Call'
  );
  const notifiedAlerts = CRITICAL_RESULTS_DATA.filter(
    (a) => a.notificationStatus === 'Doctor Notified'
  );
  const acknowledgedAlerts = CRITICAL_RESULTS_DATA.filter(
    (a) => a.notificationStatus === 'Acknowledged by Doctor'
  );

  let currentList = pendingAlerts;
  if (activeTab === 'notified') currentList = notifiedAlerts;
  if (activeTab === 'acknowledged') currentList = acknowledgedAlerts;

  const handleOpenCallModal = (item: CriticalResultAlert) => {
    setSelectedAlert(item);
    setCallNotes(
      item.actionNote ||
        `Spoke directly with ${item.orderingDoctor}. Explained panic level of ${item.criticalValue} (${item.parameterName}). Physician confirmed awareness and initiated emergency response.`
    );
    setIsLogged(false);
  };

  const columns: DataTableColumn<CriticalResultAlert>[] = [
    {
      key: 'patientName',
      header: 'Patient & Ward Location',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">
            {r.patientName}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {r.uhid} • {r.ageGender}
          </div>
          <div className="text-[10.5px] font-semibold text-rose-700 mt-0.5">
            📍 {r.wardOrBed}
          </div>
        </div>
      ),
    },
    {
      key: 'testName',
      header: 'Panic Assay & Parameter',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-800 text-xs">
            {r.testName}
          </div>
          <div className="text-[11px] font-semibold text-rose-600 mt-0.5">
            Parameter: {r.parameterName}
          </div>
        </div>
      ),
    },
    {
      key: 'criticalValue',
      header: 'Observed Critical Value',
      sortable: true,
      sortValue: (r) => r.criticalValue,
      render: (r) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono font-extrabold text-xs shadow-xs animate-pulse">
          <Flame size={12} />
          <span>{r.criticalValue}</span>
        </div>
      ),
    },
    {
      key: 'normalRange',
      header: 'Reference Normal',
      render: (r) => (
        <span className="font-mono text-slate-600 text-xs">{r.normalRange}</span>
      ),
    },
    {
      key: 'orderingDoctor',
      header: 'Ordering Doctor & Phone',
      sortable: true,
      sortValue: (r) => r.orderingDoctor,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-800 text-xs">
            {r.orderingDoctor}
          </div>
          <div className="text-[11px] text-teal-700 font-mono flex items-center gap-1 mt-0.5">
            <Phone size={11} />
            <span>{r.doctorPhone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'alertDetectedAt',
      header: 'Alert Detected',
      sortable: true,
      sortValue: (r) => r.alertDetectedAt,
      render: (r) => (
        <div>
          <div className="text-slate-700 font-mono text-[11px]">
            {r.alertDetectedAt}
          </div>
          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
            Elapsed: &lt;10m
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Emergency Action',
      align: 'right',
      render: (r) => (
        <button
          type="button"
          onClick={() => handleOpenCallModal(r)}
          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <PhoneCall size={13} />
          <span>Log Doctor Call</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Flame size={24} className="text-rose-600" />
            <span>Critical / Panic Value Alert Management</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Life-threatening laboratory panic values requiring mandatory direct communication with treating physicians (CAP / ISO 15189 compliance).
          </p>
        </div>
      </div>

      {/* Mandatory Protocol Alert Card */}
      <div className="bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border border-rose-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-950 uppercase tracking-wide">
                15-Minute Critical Notification Window
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
                STAT
              </span>
            </div>
            <p className="text-xs text-rose-900 mt-0.5 leading-relaxed">
              Treating doctor must be informed via telephonic call with explicit <strong>Read-Back verification</strong>. All communication timestamps and doctor notes are audited for legal medical compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Sub-tabs (Image 1 reference styling) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs md:text-sm font-semibold select-none overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'pending'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flame size={16} className="text-rose-600" />
          <span>Pending Doctor Call</span>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
            ({pendingAlerts.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notified')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'notified'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PhoneCall size={16} />
          <span>Doctor Notified</span>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            ({notifiedAlerts.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('acknowledged')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'acknowledged'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle size={16} />
          <span>Acknowledged Audit Log</span>
          <span className="text-xs font-mono font-medium text-slate-500">
            ({acknowledgedAlerts.length})
          </span>
        </button>
      </div>

      {/* Main Single-Layer Surface: Standard Hospital DataTable */}
      <DataTable<CriticalResultAlert>
        data={currentList}
        columns={columns}
        showSerial={true}
        searchPlaceholder="Search by patient, doctor, test, parameter..."
        searchFilter={(r, q) =>
          r.patientName.toLowerCase().includes(q) ||
          r.uhid.toLowerCase().includes(q) ||
          r.testName.toLowerCase().includes(q) ||
          r.orderingDoctor.toLowerCase().includes(q) ||
          r.parameterName.toLowerCase().includes(q)
        }
      />

      {/* Doctor Call & Communication Logging Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-rose-200 bg-rose-50/70 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Log Critical Value Notification to Physician
                  </h3>
                  <p className="text-xs text-rose-800 font-medium">
                    Immediate compliance entry for {selectedAlert.patientName} ({selectedAlert.wardOrBed})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Critical Alert Details Card */}
              <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">
                    {selectedAlert.testName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
                    PANIC VALUE
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Parameter: <span className="text-rose-700">{selectedAlert.parameterName}</span> ={' '}
                  <span className="text-rose-700 font-mono text-base">{selectedAlert.criticalValue}</span>
                </div>
                <div className="text-xs text-slate-600">
                  Normal Reference Range: <span className="font-mono">{selectedAlert.normalRange}</span>
                </div>
              </div>

              {/* Physician Contact Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10.5px] uppercase font-bold">
                    Treating / Ordering Physician
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedAlert.orderingDoctor}
                  </div>
                  <div className="text-xs font-mono text-teal-800 mt-0.5 flex items-center gap-1">
                    <Phone size={13} />
                    <span>{selectedAlert.doctorPhone}</span>
                  </div>
                </div>

                <a
                  href={`tel:${selectedAlert.doctorPhone}`}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Phone size={14} />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Read-Back Confirmation Checkbox */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={readBackConfirmed}
                    onChange={(e) => setReadBackConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-[#006a4e] focus:ring-[#006a4e]"
                  />
                  <div>
                    <span className="font-bold text-amber-950 text-xs block">
                      Read-Back Verification Completed
                    </span>
                    <span className="text-[11px] text-amber-900 block leading-tight">
                      Physician or attending charge nurse repeated back the patient name, UHID, assay parameter, and numeric panic value to verify zero transcription error.
                    </span>
                  </div>
                </label>
              </div>

              {/* Call Communication Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Clinical Advice & Physician Conversation Notes
                </label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] text-slate-800 leading-relaxed"
                  placeholder="Record doctor response, clinical advice given by pathologist, and agreed emergency action..."
                />
              </div>

              {/* Pathologist Authority Audit Log */}
              <div className="text-[11px] text-slate-500 bg-slate-100/70 p-3 rounded-lg flex items-center justify-between font-mono">
                <span>Notifying Pathologist: {CURRENT_PATHOLOGIST.name}</span>
                <span>Time: 2026-11-24 10:35</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLogged(true);
                  setTimeout(() => {
                    setIsLogged(false);
                    setSelectedAlert(null);
                  }, 1200);
                }}
                className="px-5 py-2 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle size={15} />
                <span>{isLogged ? 'Audit Communication Logged!' : 'Confirm & Save Log'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
