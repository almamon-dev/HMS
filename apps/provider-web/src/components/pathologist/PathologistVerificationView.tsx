import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  FlaskConical,
  Microscope,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  CURRENT_PATHOLOGIST,
  LAB_VERIFICATION_QUEUE_DATA,
  LabTestVerificationItem,
} from '../../data/pathologistPortalData';

export const PathologistVerificationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'retest' | 'delta'>('pending');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<LabTestVerificationItem | null>(null);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [interpretationInput, setInterpretationInput] = useState<string>('');

  const pendingItems = LAB_VERIFICATION_QUEUE_DATA.filter(
    (i) => i.verificationStatus === 'Pending Verification'
  );
  const deltaItems = LAB_VERIFICATION_QUEUE_DATA.filter((i) => Boolean(i.deltaCheckNote));

  // Determine items based on active tab
  let currentList = pendingItems;
  if (activeTab === 'delta') {
    currentList = deltaItems;
  }

  // Filter list by category and priority
  const filteredList = currentList.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    return true;
  });

  const handleOpenReview = (item: LabTestVerificationItem) => {
    setSelectedItem(item);
    setInterpretationInput(item.pathologistInterpretation || '');
    setIsSigned(false);
  };

  const columns: DataTableColumn<LabTestVerificationItem>[] = [
    {
      key: 'patientName',
      header: 'Patient Information',
      className: 'w-48',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div className="w-48">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs truncate max-w-[95px]">{r.patientName}</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[9.5px] font-semibold bg-slate-100 text-slate-700 shrink-0">
              {r.uhid}
            </span>
          </div>
          <div className="text-[10.5px] text-slate-500 font-medium mt-0.5 truncate">
            <span className="text-[#006a4e] font-semibold">{r.bedNumber || r.patientType}</span> · <span>Ref: {r.referringDoctor}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'testName',
      header: 'Test & Department',
      className: 'max-w-[170px]',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r) => (
        <div className="max-w-[170px]">
          <span className="font-semibold text-slate-800 text-xs block truncate" title={r.testName}>{r.testName}</span>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
            <span className="text-teal-700 font-bold">{r.testCode}</span> · <span>{r.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'parameters',
      header: 'Observed Parameters & Flags',
      className: 'max-w-[220px]',
      render: (r) => (
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {r.parameters.map((p) => (
            <span
              key={p.id}
              className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono ${
                p.flag === 'Critical'
                  ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                  : p.flag === 'High'
                  ? 'bg-amber-100 text-amber-800 font-semibold'
                  : p.flag === 'Low'
                  ? 'bg-sky-100 text-sky-800 font-semibold'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-sans font-medium text-slate-600">{p.name}:</span>
              <span className="font-bold">{p.observedValue}</span>
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'deltaCheck',
      header: 'Delta & Priority',
      className: 'max-w-[160px]',
      sortable: true,
      sortValue: (r) => (r.isCritical ? 0 : 1),
      render: (r) => (
        <div className="space-y-1 max-w-[160px]">
          <div className="flex items-center gap-1">
            {r.isCritical ? (
              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                <AlertTriangle size={9} />
                CRITICAL
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {r.priority}
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-mono">{r.analyzedAt}</span>
          </div>
          {r.deltaCheckNote ? (
            <div className="p-1 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[9.5px] font-medium leading-tight truncate" title={r.deltaCheckNote}>
              ⚠️ {r.deltaCheckNote}
            </div>
          ) : (
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <CheckCircle size={10} className="text-emerald-500" />
              Normal delta
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      className: 'w-20',
      render: (r) => (
        <button
          type="button"
          onClick={() => handleOpenReview(r)}
          className="px-2.5 py-1.5 rounded-lg bg-[#006a4e] text-white hover:bg-[#00523c] font-semibold text-xs transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Eye size={12} />
          <span>Verify</span>
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
            <CheckCircle2 size={24} className="text-[#006a4e]" />
            <span>Result Verification & Clinical Approval</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pathologist primary sign-off console: Review instrument results, investigate delta variance flags, and authorize digital signature.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (pendingItems.length > 0) handleOpenReview(pendingItems[0]);
            }}
            className="px-4 py-2 bg-[#006a4e] hover:bg-[#00523c] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle size={15} />
            <span>Verify Next Sample ({pendingItems.length})</span>
          </button>
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
          <Clock size={16} />
          <span>Pending Verification</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            (6)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delta')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'delta'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle size={16} />
          <span>Delta Check Variance</span>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            (3)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verified')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'verified'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Verified & Signed Today</span>
          <span className="text-xs font-mono font-medium text-slate-500">
            (185)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('retest')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'retest'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <RefreshCw size={16} />
          <span>Retest Requested</span>
          <span className="text-xs font-mono font-medium text-slate-500">
            (2)
          </span>
        </button>
      </div>

      {/* Main Single-Layer Surface: Standard Hospital DataTable */}
      <DataTable<LabTestVerificationItem>
        data={filteredList}
        columns={columns}
        showSerial={true}
        searchPlaceholder="Search patient, UHID, barcode, test..."
        searchFilter={(r, q) =>
          r.patientName.toLowerCase().includes(q) ||
          r.uhid.toLowerCase().includes(q) ||
          r.sampleBarcode.toLowerCase().includes(q) ||
          r.testName.toLowerCase().includes(q) ||
          r.referringDoctor.toLowerCase().includes(q)
        }
        toolbarFilters={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter size={14} className="text-slate-400" />
              <span>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#006a4e]"
              >
                <option value="All">All Categories</option>
                <option value="Hematology">Hematology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Immunology & Serology">Immunology</option>
                <option value="Histopathology & Cytology">Histopathology</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#006a4e]"
              >
                <option value="All">All Priorities</option>
                <option value="STAT / Emergency">STAT / Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
          </div>
        }
      />

      {/* Comprehensive Verification & Sign-off Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Top Bar */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#006a4e] shrink-0">
                  <Microscope size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {selectedItem.testName}
                    </h3>
                    {selectedItem.isCritical && (
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-600 text-white animate-pulse">
                        CRITICAL VALUE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order ID: {selectedItem.billNo} • Barcode: {selectedItem.sampleBarcode} • Analyzed: {selectedItem.analyzedAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Patient & Specimen Context Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10.5px] font-bold uppercase">Patient</span>
                  <span className="font-bold text-slate-800 text-[13px]">{selectedItem.patientName}</span>
                  <span className="block text-slate-500 font-mono text-[11px]">{selectedItem.ageGender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px] font-bold uppercase">Hospital UHID</span>
                  <span className="font-mono font-bold text-slate-800 text-[13px]">{selectedItem.uhid}</span>
                  <span className="block text-teal-700 font-medium text-[11px]">{selectedItem.bedNumber || selectedItem.patientType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px] font-bold uppercase">Specimen & Tube</span>
                  <span className="font-bold text-teal-800 text-[13px]">{selectedItem.sampleType}</span>
                  <span className="block text-slate-500 text-[11px]">Laboratory Accession Passed</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px] font-bold uppercase">Ordering Physician</span>
                  <span className="font-bold text-slate-800 text-[13px]">{selectedItem.referringDoctor}</span>
                  <span className="block text-slate-500 text-[11px]">{selectedItem.doctorDepartment}</span>
                </div>
              </div>

              {/* Observed Assay Parameter Results Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Analyzed Parameters vs Biological Reference Intervals</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Technologist: {selectedItem.technicianName}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/90 text-slate-600 font-bold text-[11px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Parameter Name</th>
                        <th className="py-3 px-4">Observed Value</th>
                        <th className="py-3 px-4">Reference Interval</th>
                        <th className="py-3 px-4">Unit</th>
                        <th className="py-3 px-4">Previous Value</th>
                        <th className="py-3 px-4 text-center">Diagnostic Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedItem.parameters.map((p) => (
                        <tr
                          key={p.id}
                          className={
                            p.flag === 'Critical'
                              ? 'bg-rose-50/70 font-semibold'
                              : p.flag === 'High' || p.flag === 'Low'
                              ? 'bg-amber-50/40'
                              : ''
                          }
                        >
                          <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                            {p.name}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900 text-[13px]">
                            {p.observedValue}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            {p.referenceRange}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500">
                            {p.unit}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500">
                            {p.previousValue || '—'}
                          </td>
                          <td className="py-2.5 px-4 text-center font-sans">
                            {p.flag ? (
                              <span
                                className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                  p.flag === 'Critical'
                                    ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                                    : p.flag === 'High'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-sky-500 text-white'
                                }`}
                              >
                                {p.flag}
                              </span>
                            ) : (
                              <span className="text-[10.5px] text-emerald-600 font-semibold">
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

              {/* Delta Check & Technical Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                    <AlertTriangle size={15} />
                    <span>Delta Variance Investigation</span>
                  </div>
                  <p className="text-amber-950 text-xs leading-relaxed">
                    {selectedItem.deltaCheckNote || 'Delta check compared against historical results within acceptable limits.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-slate-700 mb-1">
                    <FlaskConical size={15} />
                    <span>Technician Notes ({selectedItem.technicianName})</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {selectedItem.technicianNotes || 'Automated analyzer run performed in duplicate. Quality control passed.'}
                  </p>
                </div>
              </div>

              {/* Pathologist Clinical Interpretation & Morphology Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Pathologist Clinical Impression & Diagnostic Interpretation
                </label>
                <textarea
                  value={interpretationInput}
                  onChange={(e) => setInterpretationInput(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] text-slate-800 bg-white leading-relaxed"
                  placeholder="Type official clinical interpretation, diagnostic advice, or further recommended investigations..."
                />
              </div>

              {/* Digital Signature Credentials Stamp */}
              <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#006a4e] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-[13px]">
                      {CURRENT_PATHOLOGIST.name}
                    </div>
                    <div className="text-teal-800 text-[11px]">
                      {CURRENT_PATHOLOGIST.designation} • {CURRENT_PATHOLOGIST.qualification}
                    </div>
                    <div className="text-slate-500 font-mono text-[10.5px]">
                      Registration: {CURRENT_PATHOLOGIST.bmdcRegNo}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[10.5px] font-mono font-bold bg-[#006a4e] text-white px-2.5 py-1 rounded-md">
                    DIGITAL TOKEN: VALID
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel & Close
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    alert('Sample rejected. Technician notified to collect fresh specimen.');
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Reject Sample
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Retest ordered for analyzer re-run.');
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Request Retest
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSigned(true);
                    setTimeout(() => {
                      setIsSigned(false);
                      setSelectedItem(null);
                    }, 1200);
                  }}
                  className="px-5 py-2 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={15} />
                  <span>{isSigned ? 'Report Signed & Dispatched!' : 'Approve & Digitally Sign'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
