import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Plus,
  RefreshCw,
  Search,
  Sliders,
} from 'lucide-react';
import {
  QUALITY_CONTROL_DATA,
  TURNAROUND_TIME_STATS,
} from '../../data/pathologistPortalData';

interface PathologistMastersViewProps {
  initialSubTab?: 'catalog' | 'qc' | 'analytics';
}

export const PathologistMastersView: React.FC<PathologistMastersViewProps> = ({
  initialSubTab = 'catalog',
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'qc' | 'analytics'>(initialSubTab);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const catalogTests = [
    {
      code: 'HAEM-CBC-01',
      name: 'Complete Blood Count (CBC) with ESR',
      category: 'Hematology',
      tube: 'Lavender (EDTA)',
      specimen: 'Whole Blood',
      turnaround: '60 min',
      criticalLimit: 'Plt < 30,000 or > 1,000,000; Hb < 7.0 g/dL',
      price: '৳ 650',
    },
    {
      code: 'BIO-TROP-02',
      name: 'High-Sensitivity Cardiac Troponin-I (hs-cTnI)',
      category: 'Biochemistry',
      tube: 'Red / Gold (SST)',
      specimen: 'Serum',
      turnaround: '45 min',
      criticalLimit: '> 19.8 ng/L (99th URL)',
      price: '৳ 1,800',
    },
    {
      code: 'BIO-RFT-01',
      name: 'Renal Function Test (RFT / KFT) & Electrolytes',
      category: 'Biochemistry',
      tube: 'Red / Gold (SST)',
      specimen: 'Serum',
      turnaround: '90 min',
      criticalLimit: 'Potassium < 2.8 or > 6.0 mmol/L; Creatinine > 5.0 mg/dL',
      price: '৳ 1,400',
    },
    {
      code: 'BIO-LFT-01',
      name: 'Liver Function Test (LFT) with Enzymes',
      category: 'Biochemistry',
      tube: 'Red / Gold (SST)',
      specimen: 'Serum',
      turnaround: '90 min',
      criticalLimit: 'Total Bilirubin > 15 mg/dL; ALT/AST > 1,000 U/L',
      price: '৳ 1,200',
    },
    {
      code: 'BIO-GLUC-01',
      name: 'Fasting Blood Sugar (FBS) & HbA1c Glycated Hb',
      category: 'Biochemistry',
      tube: 'Grey (Fluoride) / EDTA',
      specimen: 'Plasma & Whole Blood',
      turnaround: '60 min',
      criticalLimit: 'Glucose < 45 mg/dL or > 450 mg/dL',
      price: '৳ 1,100',
    },
    {
      code: 'HAEM-COAG-01',
      name: 'Coagulation Profile (PT / INR & APTT)',
      category: 'Hematology',
      tube: 'Light Blue (Citrate)',
      specimen: 'Citrated Plasma',
      turnaround: '60 min',
      criticalLimit: 'INR > 4.5; APTT > 90 sec',
      price: '৳ 1,200',
    },
    {
      code: 'MIC-UR-01',
      name: 'Urine Routine & Microscopic Examination (R/M/E)',
      category: 'Clinical Pathology',
      tube: 'Sterile Cup',
      specimen: 'Midstream Urine',
      turnaround: '45 min',
      criticalLimit: 'Heavy proteinuria + casts in pregnancy',
      price: '৳ 350',
    },
    {
      code: 'IMM-VIR-01',
      name: 'Dengue NS1 Antigen & IgM/IgG Duo Rapid',
      category: 'Immunology & Serology',
      tube: 'Red / Gold (SST)',
      specimen: 'Serum',
      turnaround: '40 min',
      criticalLimit: 'NS1 Positive with severe thrombocytopenia',
      price: '৳ 1,200',
    },
  ];

  const filteredCatalog = catalogTests.filter((t) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Sliders size={24} className="text-[#006a4e]" />
            <span>Laboratory Master, Quality Control & Analytics</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Clinical assay catalog, biological reference ranges, Westgard internal IQC monitoring, and Turnaround Time (TAT) analytics.
          </p>
        </div>
      </div>

      {/* Horizontal Sub-tabs (Image 1 reference styling) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs md:text-sm font-semibold select-none overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'catalog'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders size={16} />
          <span>Laboratory Master Catalog</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            ({catalogTests.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qc')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'qc'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity size={16} />
          <span>Quality Control & Westgard Rules</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            (4)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'analytics'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 size={16} />
          <span>Turnaround Time (TAT) Analytics</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            (96.8%)
          </span>
        </button>
      </div>

      {/* Main Single-Layer Surface (NO nested cards) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Tab 1: Laboratory Master Catalog */}
        {activeTab === 'catalog' && (
          <div>
            <div className="p-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3">
              <div className="relative w-full max-w-md">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search test name, code, category..."
                  className="w-full text-xs bg-white pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                />
              </div>
              <button
                type="button"
                onClick={() => alert('Add New Test Master dialog')}
                className="px-3.5 py-1.5 bg-[#006a4e] text-white hover:bg-[#00523c] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus size={14} />
                <span>Add Test Master</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <th className="py-3 px-4">Test Code & Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Vacutainer Tube / Specimen</th>
                    <th className="py-3 px-4">Critical Panic Limits</th>
                    <th className="py-3 px-4">Target TAT</th>
                    <th className="py-3 px-4 text-right">Standard Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCatalog.map((t) => (
                    <tr key={t.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-[13px]">{t.name}</div>
                        <div className="text-[11px] text-teal-700 font-mono mt-0.5">{t.code}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800">{t.category}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{t.tube}</div>
                        <div className="text-[11px] text-slate-500">{t.specimen}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10.5px] font-mono font-medium block">
                          {t.criticalLimit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {t.turnaround}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-[13px]">
                        {t.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Quality Control & Westgard Rules */}
        {activeTab === 'qc' && (
          <div>
            <div className="p-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Daily Internal Quality Control (IQC) Run Log
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated validation against Westgard multi-rules (1-2s warning, 1-3s violation, 2-2s systemic shift).
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('New IQC Calibration Run initiated.')}
                className="px-3 py-1.5 bg-[#006a4e] text-white hover:bg-[#00523c] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Run Instrument QC</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <th className="py-3 px-4">Instrument / Analyzer</th>
                    <th className="py-3 px-4">Assay & Control Lot</th>
                    <th className="py-3 px-4">Target Mean (SD)</th>
                    <th className="py-3 px-4">Observed Value</th>
                    <th className="py-3 px-4">Westgard Rule Status</th>
                    <th className="py-3 px-4">Technologist & Run Time</th>
                    <th className="py-3 px-4 text-right">QC Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {QUALITY_CONTROL_DATA.map((qc) => (
                    <tr key={qc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-[13px]">
                          {qc.instrumentName}
                        </div>
                        <div className="text-[11px] text-teal-700 font-mono mt-0.5">
                          QC ID: {qc.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {qc.assayParameter}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {qc.controlLevel} • {qc.controlLotNo}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {qc.targetMean} (±{qc.standardDeviation})
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-[13px]">
                        {qc.observedValue}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                            qc.westgardRule.includes('In Control')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {qc.westgardRule.includes('In Control') ? (
                            <CheckCircle size={11} />
                          ) : (
                            <AlertTriangle size={11} />
                          )}
                          {qc.westgardRule}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">
                          {qc.technologistName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {qc.runTime}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
                            qc.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {qc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Turnaround Time (TAT) Analytics */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Laboratory Turnaround Time (TAT) Performance by Discipline
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target sample registration to digital report sign-off compliance monitored live across 520 diagnostic samples today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TURNAROUND_TIME_STATS.map((stat) => (
                <div
                  key={stat.category}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {stat.category}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {stat.testsProcessedToday} tests analyzed today
                      </span>
                    </div>
                    <span className="text-base font-extrabold text-[#006a4e]">
                      {stat.complianceRate}% On-Time
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Average: <strong>{stat.averageMinutes > 60 ? `${Math.round(stat.averageMinutes / 60)}h` : `${stat.averageMinutes}m`}</strong></span>
                      <span>Target: <strong>{stat.targetMinutes > 60 ? `${Math.round(stat.targetMinutes / 60)}h` : `${stat.targetMinutes}m`}</strong></span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#006a4e] h-full rounded-full transition-all"
                        style={{ width: `${stat.complianceRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Delays: {stat.delayedCount} tests</span>
                    <span className="text-emerald-700 font-semibold">Exceeding SLA Target</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
