import React, { useState } from 'react';
import {
  AlertTriangle,
  Barcode,
  CheckCircle,
  FileText,
  FlaskConical,
  Microscope,
  Printer,
  RefreshCw,
  Search,
  TestTube2,
  X,
} from 'lucide-react';
import {
  LAB_PATIENT_REQUESTS_DATA,
  LAB_SAMPLE_TRACKING_DATA,
  LabSampleItem,
} from '../../data/pathologistPortalData';

interface PathologistWorklistViewProps {
  initialSubTab?: 'requests' | 'processing' | 'samples';
}

export const PathologistWorklistView: React.FC<PathologistWorklistViewProps> = ({
  initialSubTab = 'requests',
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'processing' | 'samples'>(initialSubTab);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBarcodeSample, setSelectedBarcodeSample] = useState<LabSampleItem | null>(null);

  const filteredRequests = LAB_PATIENT_REQUESTS_DATA.filter((r) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.uhid.toLowerCase().includes(q) ||
      r.sampleBarcode.toLowerCase().includes(q) ||
      r.referringDoctor.toLowerCase().includes(q)
    );
  });

  const filteredSamples = LAB_SAMPLE_TRACKING_DATA.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.patientName.toLowerCase().includes(q) ||
      s.barcode.toLowerCase().includes(q) ||
      s.uhid.toLowerCase().includes(q) ||
      s.testName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FlaskConical size={24} className="text-[#006a4e]" />
            <span>Operations & Sample Worklist</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            End-to-end specimen lifecycle: Patient test orders, automated analyzer queues, accessioning, and barcode tracking.
          </p>
        </div>
      </div>

      {/* Horizontal Sub-tabs (Image 1 reference styling) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs md:text-sm font-semibold select-none overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'requests'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={16} />
          <span>Patient Requests</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            (4)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('processing')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'processing'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Microscope size={16} />
          <span>Test Processing Queue</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            (4)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'samples'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TestTube2 size={16} />
          <span>Sample Tracking & Barcodes</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            (4)
          </span>
        </button>
      </div>

      {/* Main Single-Layer Surface: Table View (NO nested cards) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by patient, UHID, barcode, test..."
              className="w-full text-xs bg-white pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active view: {activeTab === 'requests' ? 'Test Requests' : activeTab === 'processing' ? 'Analyzer Queue' : 'Specimens'}
          </span>
        </div>

        {/* Tab 1: Patient Requests */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                  <th className="py-3 px-4">Order No & Date</th>
                  <th className="py-3 px-4">Patient & UHID</th>
                  <th className="py-3 px-4">Tests Ordered</th>
                  <th className="py-3 px-4">Referring Doctor & Clinical Notes</th>
                  <th className="py-3 px-4">Specimen Status</th>
                  <th className="py-3 px-4 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-teal-800 text-[12.5px]">
                        {req.orderNo}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {req.requestedAt}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        BC: {req.sampleBarcode}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-[13px]">
                        {req.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {req.uhid} • {req.ageGender}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {req.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {req.testsOrdered.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-900 text-[11px] rounded font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800">
                        {req.referringDoctor}
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5 italic">
                        "{req.clinicalIndication}"
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle size={11} />
                        {req.sampleStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          req.priority === 'STAT / Emergency'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Test Processing Queue */}
        {activeTab === 'processing' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                  <th className="py-3 px-4">Barcode & Sample ID</th>
                  <th className="py-3 px-4">Patient & Ward</th>
                  <th className="py-3 px-4">Assay Investigation</th>
                  <th className="py-3 px-4">Target Analyzer Machine</th>
                  <th className="py-3 px-4">Assay Stage</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSamples.map((sample, idx) => (
                  <tr key={sample.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">{sample.barcode}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{sample.tubeType}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{sample.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{sample.uhid}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{sample.testName}</div>
                      <div className="text-[11px] text-slate-500">{sample.sampleType}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {idx === 0
                          ? 'Sysmex XN-1000 Automated Hematology'
                          : idx === 1
                          ? 'Roche Cobas e411 ECLIA'
                          : idx === 2
                          ? 'Beckman AU480 Clinical Chemistry'
                          : 'Stago Compact Max Coagulation'}
                      </div>
                      <div className="text-[10.5px] text-teal-700 font-mono">Channel Calibrated</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#006a4e] h-full rounded-full"
                            style={{ width: `${(idx + 1) * 25}%` }}
                          />
                        </div>
                        <span className="text-[10.5px] font-mono text-slate-500">
                          {(idx + 1) * 25}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <RefreshCw size={11} className="animate-spin" />
                        In Automated Run
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Sample Tracking & Barcodes */}
        {activeTab === 'samples' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                  <th className="py-3 px-4">Barcode & Tube Type</th>
                  <th className="py-3 px-4">Patient & UHID</th>
                  <th className="py-3 px-4">Assay Specimen</th>
                  <th className="py-3 px-4">Collection Info</th>
                  <th className="py-3 px-4">Specimen Quality Condition</th>
                  <th className="py-3 px-4 text-right">Barcode Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-teal-900 text-[13px]">{sample.barcode}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10.5px] font-medium bg-slate-100 text-slate-700">
                        {sample.tubeType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-[13px]">{sample.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{sample.uhid}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{sample.testName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{sample.sampleType}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{sample.collectedBy}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{sample.collectedAt}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          sample.condition === 'Optimal'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sample.condition === 'Mildly Lipemic'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sample.condition === 'Optimal' ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
                        {sample.condition}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedBarcodeSample(sample)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 text-xs transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Barcode size={14} className="text-teal-700" />
                        <span>Print Barcode</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Barcode Print Preview Modal */}
      {selectedBarcodeSample && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Barcode size={18} className="text-[#006a4e]" />
                <span>Thermal Tube Label</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedBarcodeSample(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Label Simulation */}
            <div className="bg-white p-4 border-2 border-dashed border-slate-300 rounded-xl space-y-2 text-center">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                GREEN LIFE HOSPITAL LAB
              </div>
              <div className="font-mono text-xl font-extrabold tracking-widest py-2 bg-slate-100 rounded">
                |||||| | ||||| |||
              </div>
              <div className="font-mono font-bold text-sm text-slate-900">
                {selectedBarcodeSample.barcode}
              </div>
              <div className="text-xs font-bold text-slate-800 text-left pt-1 border-t border-slate-200">
                {selectedBarcodeSample.patientName}
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{selectedBarcodeSample.uhid}</span>
                <span>{selectedBarcodeSample.tubeType.split(' ')[0]}</span>
              </div>
              <div className="text-left text-[11px] text-teal-800 font-semibold truncate">
                Test: {selectedBarcodeSample.testName}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBarcodeSample(null)}
                className="flex-1 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Barcode sent to Zebra thermal lab printer.');
                  setSelectedBarcodeSample(null);
                }}
                className="flex-1 py-2 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer size={13} />
                <span>Print Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
