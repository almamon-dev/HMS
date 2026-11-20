import {
  Activity,
  ArrowUpRight,
  Download,
  Printer,
  Search,
  Stethoscope,
  TrendingUp,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

interface WeeklyClinicalReportItem {
  id: string;
  weekPeriod: string;
  opdVisits: number;
  teleconsultations: number;
  prescriptions: number;
  labOrders: number;
  radiologyOrders: number;
  grossAmount: number;
  doctorShare: number;
}

const REPORT_MOCK_DATA: WeeklyClinicalReportItem[] = [
  {
    id: 'rep-1',
    weekPeriod: 'Week 1 (Nov 01 - Nov 07)',
    opdVisits: 98,
    teleconsultations: 16,
    prescriptions: 92,
    labOrders: 42,
    radiologyOrders: 18,
    grossAmount: 4900,
    doctorShare: 3920,
  },
  {
    id: 'rep-2',
    weekPeriod: 'Week 2 (Nov 08 - Nov 14)',
    opdVisits: 112,
    teleconsultations: 20,
    prescriptions: 104,
    labOrders: 54,
    radiologyOrders: 24,
    grossAmount: 5600,
    doctorShare: 4480,
  },
  {
    id: 'rep-3',
    weekPeriod: 'Week 3 (Nov 15 - Nov 21)',
    opdVisits: 105,
    teleconsultations: 18,
    prescriptions: 98,
    labOrders: 48,
    radiologyOrders: 20,
    grossAmount: 5250,
    doctorShare: 4200,
  },
  {
    id: 'rep-4',
    weekPeriod: 'Week 4 (Nov 22 - Nov 28)',
    opdVisits: 97,
    teleconsultations: 14,
    prescriptions: 94,
    labOrders: 40,
    radiologyOrders: 15,
    grossAmount: 4850,
    doctorShare: 3880,
  },
];

export const DoctorReportsView: React.FC = () => {
  const [timeDuration, setTimeDuration] = useState('This Month');
  const [appliedDuration, setAppliedDuration] = useState('This Month');
  const [dateFrom, setDateFrom] = useState('2026-11-01');
  const [dateTo, setDateTo] = useState('2026-11-30');

  const handleSearch = () => {
    setAppliedDuration(timeDuration);
  };

  const columns: DataTableColumn<WeeklyClinicalReportItem>[] = [
    {
      key: 'weekPeriod',
      header: 'Reporting Period / Week',
      sortable: true,
      sortValue: (r) => r.weekPeriod,
      render: (r) => (
        <span className="font-semibold text-slate-900 whitespace-nowrap text-xs">
          {r.weekPeriod}
        </span>
      ),
    },
    {
      key: 'opdVisits',
      header: 'OPD Consultations',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.opdVisits,
      render: (r) => (
        <span className="font-bold text-slate-800">{r.opdVisits}</span>
      ),
    },
    {
      key: 'teleconsultations',
      header: 'Teleconsults',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.teleconsultations,
      render: (r) => (
        <span className="text-slate-700">{r.teleconsultations}</span>
      ),
    },
    {
      key: 'prescriptions',
      header: 'E-Prescriptions',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.prescriptions,
      render: (r) => (
        <span className="font-semibold text-[#006a4e]">{r.prescriptions}</span>
      ),
    },
    {
      key: 'labOrders',
      header: 'Lab Orders',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.labOrders,
      render: (r) => (
        <span className="text-slate-700">{r.labOrders}</span>
      ),
    },
    {
      key: 'radiologyOrders',
      header: 'Radiology Imaging',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.radiologyOrders,
      render: (r) => (
        <span className="text-slate-700">{r.radiologyOrders}</span>
      ),
    },
    {
      key: 'grossAmount',
      header: 'Gross Billed ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.grossAmount,
      render: (r) => (
        <span className="font-medium text-slate-800">
          ${r.grossAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'doctorShare',
      header: 'Doctor Net Share ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.doctorShare,
      render: (r) => (
        <span className="font-bold text-[#006a4e]">
          ${r.doctorShare.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Monthly Consultations"
          icon={Users}
          iconColor="text-[#006a4e]"
          value="412 Visits"
          subtitle={
            <span className="text-[10px] text-[#006a4e] font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+14.2% vs previous period</span>
            </span>
          }
        />
        <SummaryCard
          title="E-Rx Digital Adoption"
          icon={Stethoscope}
          iconColor="text-cyan-600"
          value="388 (94%)"
          valueColor="text-cyan-700"
          subtitle="Paperless clinical adoption"
        />
        <SummaryCard
          title="Diagnostic Yield"
          icon={Activity}
          iconColor="text-amber-600"
          value="76.4%"
          valueColor="text-amber-700"
          subtitle="194 laboratory tests evaluated"
        />
        <SummaryCard
          title="Doctor Net Share"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          value="$16,480.00"
          valueColor="text-emerald-700"
          subtitle="80% agreed hospital split"
        />
      </SummaryCardGrid>

      {/* Filter Card matching Image 4 & Image 5 */}
      <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800">
              Clinical Telemetry &amp; Volume Analytics
            </h3>
            <span className="px-2 py-0.5 rounded-[3px] bg-[#edf6f2] text-[#006a4e] text-[11px] font-semibold border border-[#006a4e]/20">
              {appliedDuration}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="h-7 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 pt-0.5">
          {/* Time Duration Dropdown matching Image 5 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Time Duration <span className="text-rose-500">*</span>
            </label>
            <DropdownSelect
              value={timeDuration}
              onChange={(val) => setTimeDuration(val)}
              width="w-52"
              options={[
                { label: 'Today', value: 'Today' },
                { label: 'This Week', value: 'This Week' },
                { label: 'Last Week', value: 'Last Week' },
                { label: 'This Month', value: 'This Month' },
                { label: 'Last Month', value: 'Last Month' },
                { label: 'Last 3 Months', value: 'Last 3 Months' },
                { label: 'Last 6 Months', value: 'Last 6 Months' },
                { label: 'Last 12 Months', value: 'Last 12 Months' },
                { label: 'This Year', value: 'This Year' },
                { label: 'Last Year', value: 'Last Year' },
                { label: 'Period', value: 'Period' },
              ]}
            />
          </div>

          {timeDuration === 'Period' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Date From <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Date To <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={handleSearch}
            className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Enterprise DataTable */}
      <DataTable<WeeklyClinicalReportItem>
        data={REPORT_MOCK_DATA}
        columns={columns}
        rowKey={(r) => r.id}
        searchPlaceholder="Filter report by week or metrics..."
        searchFilter={(r, q) => r.weekPeriod.toLowerCase().includes(q.toLowerCase())}
        showSerial={true}
        emptyTitle="No report rows generated for this period."
      />
    </div>
  );
};
