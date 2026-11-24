import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Plus,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  QUALITY_CONTROL_DATA,
  QualityControlRecord,
  TURNAROUND_TIME_STATS,
} from '../../data/pathologistPortalData';

interface CatalogTestItem {
  code: string;
  name: string;
  category: string;
  tube: string;
  specimen: string;
  turnaround: string;
  criticalLimit: string;
  price: string;
}

interface PathologistMastersViewProps {
  initialSubTab?: 'catalog' | 'qc' | 'analytics';
}

export const PathologistMastersView: React.FC<PathologistMastersViewProps> = ({
  initialSubTab = 'catalog',
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'qc' | 'analytics'>(initialSubTab);

  const catalogTests: CatalogTestItem[] = [
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

  // Catalog Columns
  const catalogColumns: DataTableColumn<CatalogTestItem>[] = [
    {
      key: 'code',
      header: 'Test Code & Name',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.name}</span>
          <span className="text-[10.5px] text-teal-700 font-mono font-bold">{r.code}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Department',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => (
        <span className="font-medium text-slate-800 text-xs">{r.category}</span>
      ),
    },
    {
      key: 'tube',
      header: 'Vacutainer Tube / Specimen',
      sortable: true,
      sortValue: (r) => r.tube,
      render: (r) => (
        <div>
          <span className="font-medium text-slate-800 text-xs block">{r.tube}</span>
          <span className="text-[10.5px] text-slate-500">{r.specimen}</span>
        </div>
      ),
    },
    {
      key: 'criticalLimit',
      header: 'Critical Panic Limits',
      render: (r) => (
        <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10.5px] font-mono font-medium block max-w-xs">
          {r.criticalLimit}
        </span>
      ),
    },
    {
      key: 'turnaround',
      header: 'Target TAT',
      sortable: true,
      sortValue: (r) => r.turnaround,
      render: (r) => (
        <span className="font-mono text-slate-700 text-xs">{r.turnaround}</span>
      ),
    },
    {
      key: 'price',
      header: 'Standard Rate',
      align: 'right',
      sortable: true,
      sortValue: (r) => Number(r.price.replace(/[^0-9]/g, '')),
      render: (r) => (
        <span className="font-mono font-bold text-slate-900 text-xs">{r.price}</span>
      ),
    },
  ];

  // QC Columns
  const qcColumns: DataTableColumn<QualityControlRecord>[] = [
    {
      key: 'instrumentName',
      header: 'Instrument / Analyzer',
      sortable: true,
      sortValue: (r) => r.instrumentName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.instrumentName}</span>
          <span className="text-[10.5px] text-teal-700 font-mono">QC ID: {r.id}</span>
        </div>
      ),
    },
    {
      key: 'assayParameter',
      header: 'Assay & Control Lot',
      sortable: true,
      sortValue: (r) => r.assayParameter,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{r.assayParameter}</span>
          <span className="text-[10.5px] text-slate-500 font-mono">{r.controlLevel} • {r.controlLotNo}</span>
        </div>
      ),
    },
    {
      key: 'targetMean',
      header: 'Target Mean (SD)',
      render: (r) => (
        <span className="font-mono text-slate-700 text-xs">{r.targetMean} (±{r.standardDeviation})</span>
      ),
    },
    {
      key: 'observedValue',
      header: 'Observed Value',
      sortable: true,
      sortValue: (r) => r.observedValue,
      render: (r) => (
        <span className="font-mono font-bold text-slate-900 text-xs">{r.observedValue}</span>
      ),
    },
    {
      key: 'westgardRule',
      header: 'Westgard Rule Status',
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
            r.westgardRule.includes('In Control')
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {r.westgardRule.includes('In Control') ? (
            <CheckCircle size={11} />
          ) : (
            <AlertTriangle size={11} />
          )}
          {r.westgardRule}
        </span>
      ),
    },
    {
      key: 'technologistName',
      header: 'Technologist & Run Time',
      sortable: true,
      sortValue: (r) => r.runTime,
      render: (r) => (
        <div>
          <span className="text-slate-800 font-medium text-xs block">{r.technologistName}</span>
          <span className="text-[11px] text-slate-400 font-mono">{r.runTime}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'QC Decision',
      align: 'right',
      render: (r) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
            r.status === 'Accepted'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

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
            ({QUALITY_CONTROL_DATA.length})
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

      {/* Main Single-Layer Surface: Standard Hospital DataTable */}
      {activeTab === 'catalog' && (
        <DataTable<CatalogTestItem>
          data={catalogTests}
          columns={catalogColumns}
          showSerial={true}
          searchPlaceholder="Search test name, code, category..."
          searchFilter={(r, q) =>
            r.name.toLowerCase().includes(q) ||
            r.code.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q)
          }
          toolbarActions={
            <button
              type="button"
              onClick={() => alert('Add New Test Master dialog')}
              className="px-3.5 py-1.5 bg-[#006a4e] text-white hover:bg-[#00523c] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Test Master</span>
            </button>
          }
        />
      )}

      {activeTab === 'qc' && (
        <DataTable<QualityControlRecord>
          data={QUALITY_CONTROL_DATA}
          columns={qcColumns}
          showSerial={true}
          searchPlaceholder="Search instrument QC by analyzer, parameter, lot..."
          searchFilter={(r, q) =>
            r.instrumentName.toLowerCase().includes(q) ||
            r.assayParameter.toLowerCase().includes(q) ||
            r.controlLotNo.toLowerCase().includes(q)
          }
          toolbarActions={
            <button
              type="button"
              onClick={() => alert('New IQC Calibration Run initiated.')}
              className="px-3 py-1.5 bg-[#006a4e] text-white hover:bg-[#00523c] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Run Instrument QC</span>
            </button>
          }
        />
      )}

      {/* Tab 3: Turnaround Time (TAT) Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-6">
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
  );
};
