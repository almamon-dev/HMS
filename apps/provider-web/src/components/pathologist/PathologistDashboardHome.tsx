import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  Flame,
  Microscope,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  CURRENT_PATHOLOGIST,
  LAB_VERIFICATION_QUEUE_DATA,
  LabTestVerificationItem,
} from '../../data/pathologistPortalData';

interface PathologistDashboardHomeProps {
  onSelectModule: (moduleId: string) => void;
  onOpenVerificationModal?: (item: LabTestVerificationItem) => void;
}

export const PathologistDashboardHome: React.FC<PathologistDashboardHomeProps> = ({
  onSelectModule,
  onOpenVerificationModal,
}) => {
  const [selectedItem, setSelectedItem] = useState<LabTestVerificationItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [isSignSuccess, setIsSignSuccess] = useState<boolean>(false);

  const pendingItems = LAB_VERIFICATION_QUEUE_DATA.filter(
    (item) => item.verificationStatus === 'Pending Verification'
  );

  const filteredItems = pendingItems.filter((item) => {
    if (activeCategoryFilter === 'All') return true;
    return item.category === activeCategoryFilter;
  });

  const criticalItems = pendingItems.filter((item) => item.isCritical);

  const handleReviewClick = (item: LabTestVerificationItem) => {
    if (onOpenVerificationModal) {
      onOpenVerificationModal(item);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#006a4e] to-[#0c4e3b] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold tracking-wide uppercase">
            <Microscope size={16} />
            <span>Diagnostic Pathology & Laboratory Medicine</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold mt-1 text-white">
            Welcome, {CURRENT_PATHOLOGIST.name}
          </h1>
          <p className="text-teal-100/80 text-xs md:text-sm mt-0.5">
            {CURRENT_PATHOLOGIST.qualification} • Reg: {CURRENT_PATHOLOGIST.bmdcRegNo}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectModule('verification-pending')}
            className="px-4 py-2 bg-white text-[#006a4e] hover:bg-teal-50 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle size={15} />
            <span>Start Result Verification ({pendingItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectModule('critical-results')}
            className="px-4 py-2 bg-[#FF4A1F] text-white hover:bg-[#e03d14] rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <AlertCircle size={15} />
            <span>Critical Alerts (4)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Single Layer Surface (NO nested cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectModule('verification-pending')}
          className="bg-white rounded-xl border border-slate-200/80 p-4.5 hover:border-teal-500/50 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Verification
            </span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-[#006a4e] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {pendingItems.length}
            </span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              2 STAT / Urgent
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Awaiting clinical interpretation & signature</span>
          </p>
        </div>

        <div
          onClick={() => onSelectModule('critical-results')}
          className="bg-white rounded-xl border border-rose-200/90 p-4.5 hover:border-rose-400 hover:shadow-sm transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Critical Panic Values
            </span>
            <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse">
              <AlertTriangle size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-rose-700">
              {criticalItems.length}
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <p className="text-[11.5px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
            <span>Doctor telephonic alert mandatory</span>
          </p>
        </div>

        <div
          onClick={() => onSelectModule('reports-signed')}
          className="bg-white rounded-xl border border-slate-200/80 p-4.5 hover:border-teal-500/50 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reports Signed Today
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
              185
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              +14% vs yesterday
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 mt-1">
            <span>All validated with digital QR stamp</span>
          </p>
        </div>

        <div
          onClick={() => onSelectModule('masters-analytics')}
          className="bg-white rounded-xl border border-slate-200/80 p-4.5 hover:border-teal-500/50 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Lab TAT
            </span>
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
              48 min
            </span>
            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Target &lt;60 min
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 mt-1">
            <span>96.8% compliance rate across all assays</span>
          </p>
        </div>
      </div>

      {/* Critical Value Alert Banner (Immediate Attention) */}
      {criticalItems.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 border border-rose-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-bounce">
              <Flame size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                  Critical Panic Values Detected ({criticalItems.length} Cases)
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
                  URGENT
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                hs-Troponin I (2,450 ng/L - ICU Bed 06), Potassium (6.8 mmol/L - Cabin 312), Platelets (24,000/μL - Cabin 402). Ordering physicians must be notified immediately.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectModule('critical-results')}
            className="px-3.5 py-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Phone size={13} />
            <span>Manage Panic Alerts</span>
          </button>
        </div>
      )}

      {/* Main Section: Pending Verification Worklist (NO nested cards) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              <FileCheck size={18} className="text-[#006a4e]" />
              <span>Pending Result Verification Queue</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100/80 text-[#006a4e]">
                {filteredItems.length} awaiting review
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review machine observed values, check delta variances, and approve with digital signature.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Hematology', 'Biochemistry', 'Clinical Pathology'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeCategoryFilter === cat
                    ? 'bg-[#006a4e] text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4">Patient & UHID</th>
                <th className="py-3 px-4">Test Name & Code</th>
                <th className="py-3 px-4">Key Parameters & Values</th>
                <th className="py-3 px-4">Technician / Analyzed</th>
                <th className="py-3 px-4">Priority / Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    item.isCritical ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* Patient Info */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 text-[13px]">
                      {item.patientName}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono">{item.uhid}</span>
                      <span>•</span>
                      <span>{item.bedNumber || item.patientType}</span>
                    </div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5">
                      Ref: {item.referringDoctor}
                    </div>
                  </td>

                  {/* Test Info */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {item.testName}
                    </div>
                    <div className="text-[11px] text-teal-700 font-mono mt-0.5">
                      {item.testCode} • {item.category}
                    </div>
                    <div className="text-[10.5px] text-slate-500 mt-0.5 font-mono">
                      Barcode: {item.sampleBarcode}
                    </div>
                  </td>

                  {/* Key Parameters */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {item.parameters.slice(0, 3).map((p) => (
                        <span
                          key={p.id}
                          className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                            p.flag === 'Critical'
                              ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                              : p.flag === 'High'
                              ? 'bg-amber-100 text-amber-800 font-semibold'
                              : p.flag === 'Low'
                              ? 'bg-sky-100 text-sky-800 font-semibold'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="truncate max-w-[90px]">{p.name}:</span>
                          <span className="font-bold">{p.observedValue}</span>
                        </span>
                      ))}
                      {item.parameters.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{item.parameters.length - 3} more
                        </span>
                      )}
                    </div>
                    {item.deltaCheckNote && (
                      <div className="text-[10px] text-amber-700 font-medium mt-1 truncate">
                        ⚠️ Delta: {item.deltaCheckNote}
                      </div>
                    )}
                  </td>

                  {/* Technician & Analyzer */}
                  <td className="py-3 px-4">
                    <div className="text-slate-700 font-medium truncate max-w-[150px]">
                      {item.technicianName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.analyzedAt}
                    </div>
                  </td>

                  {/* Status & Critical Flag */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {item.isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          <AlertTriangle size={11} />
                          CRITICAL PANIC
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={11} />
                          {item.priority}
                        </span>
                      )}
                      <span className="text-[10.5px] text-slate-500">
                        {item.verificationStatus}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleReviewClick(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#006a4e] text-white hover:bg-[#00523c] font-semibold text-xs transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Review & Sign</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Quick Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    Pathology Result Verification
                  </h3>
                  {selectedItem.isCritical && (
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-600 text-white">
                      CRITICAL PANIC
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedItem.testName} ({selectedItem.testCode}) • Barcode: {selectedItem.sampleBarcode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Patient Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Patient</span>
                  <span className="font-bold text-slate-800">{selectedItem.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px] uppercase font-bold">UHID / Bed</span>
                  <span className="font-semibold text-slate-800">{selectedItem.uhid} ({selectedItem.bedNumber || 'OPD'})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Sample Type</span>
                  <span className="font-semibold text-teal-700">{selectedItem.sampleType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Ordering Doctor</span>
                  <span className="font-semibold text-slate-800">{selectedItem.referringDoctor}</span>
                </div>
              </div>

              {/* Parameters Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Observed Assay Parameters vs Reference Ranges
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-600 font-bold text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Observed Value</th>
                        <th className="py-2.5 px-3">Reference Range</th>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3">Previous Value</th>
                        <th className="py-2.5 px-3 text-center">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedItem.parameters.map((p) => (
                        <tr
                          key={p.id}
                          className={
                            p.flag === 'Critical'
                              ? 'bg-rose-50/50'
                              : p.flag === 'High' || p.flag === 'Low'
                              ? 'bg-amber-50/30'
                              : ''
                          }
                        >
                          <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                            {p.name}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {p.observedValue}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {p.referenceRange}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {p.unit}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {p.previousValue || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-center font-sans">
                            {p.flag ? (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                  p.flag === 'Critical'
                                    ? 'bg-rose-600 text-white'
                                    : p.flag === 'High'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-sky-500 text-white'
                                }`}
                              >
                                {p.flag.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-semibold">
                                NORMAL
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delta Check & Technician Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-800 block text-[11px] mb-1">
                    Delta Check Alert
                  </span>
                  <p className="text-amber-900 text-xs">
                    {selectedItem.deltaCheckNote || 'Delta check within normal historical variance limits.'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-700 block text-[11px] mb-1">
                    Technician Notes ({selectedItem.technicianName})
                  </span>
                  <p className="text-slate-600 text-xs">
                    {selectedItem.technicianNotes || 'Routine automated analyzer run completed.'}
                  </p>
                </div>
              </div>

              {/* Pathologist Clinical Interpretation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pathologist Clinical Impression & Comments
                </label>
                <textarea
                  defaultValue={selectedItem.pathologistInterpretation || ''}
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] text-slate-800"
                  placeholder="Enter morphological comments, clinical correlation, or diagnostic advice..."
                />
              </div>

              {/* Digital Signature Notice */}
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#006a4e]" />
                  <div>
                    <span className="font-bold text-[#006a4e] block">
                      Authorizing Signatory: {CURRENT_PATHOLOGIST.name}
                    </span>
                    <span className="text-teal-800 text-[11px]">
                      {CURRENT_PATHOLOGIST.designation} • {CURRENT_PATHOLOGIST.bmdcRegNo}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#006a4e] text-white px-2 py-0.5 rounded">
                  AUTHENTICATED
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert('Retest requested with fresh sample accessioning.');
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Request Retest
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignSuccess(true);
                    setTimeout(() => {
                      setIsSignSuccess(false);
                      setSelectedItem(null);
                    }, 1200);
                  }}
                  className="px-5 py-2 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={15} />
                  <span>{isSignSuccess ? 'Verified & Signed!' : 'Approve & Digitally Sign'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
