import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FlaskConical,
  Printer,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  PATIENT_LAB_REPORTS,
  PatientLabReportItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const PatientLabReportsView: React.FC = () => {
  const [reports] = useState<PatientLabReportItem[]>(PATIENT_LAB_REPORTS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState<PatientLabReportItem | null>(null);

  const stats = useMemo(() => {
    const total = reports.length;
    const ready = reports.filter((r) => r.status === 'Ready').length;
    const normal = reports.filter((r) => r.flag === 'Normal').length;
    const abnormal = reports.filter((r) => r.flag !== 'Normal').length;
    return { total, ready, normal, abnormal };
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (statusFilter === 'All') return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  const columns: DataTableColumn<PatientLabReportItem>[] = [
    {
      key: 'orderNumber',
      header: 'Order No',
      sortable: true,
      sortValue: (r) => r.orderNumber,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedReport(r);
          }}
          className="font-bold text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.orderNumber}
        </button>
      ),
    },
    {
      key: 'testName',
      header: 'Investigation / Test Panel',
      sortable: true,
      sortValue: (r) => r.testName,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.testName}</div>
          <div className="text-[10px] text-slate-500">{r.department}</div>
        </div>
      ),
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      sortable: true,
      sortValue: (r) => r.orderDate,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-xs font-medium">
          {r.orderDate}
        </span>
      ),
    },
    {
      key: 'reportDate',
      header: 'Report Published',
      sortable: true,
      sortValue: (r) => r.reportDate,
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap text-xs">
          {r.reportDate}
        </span>
      ),
    },
    {
      key: 'resultSummary',
      header: 'Findings Summary',
      render: (r) => (
        <span className="text-slate-800 font-medium block truncate max-w-sm" title={r.resultSummary}>
          {r.resultSummary}
        </span>
      ),
    },
    {
      key: 'flag',
      header: 'Clinical Flag',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold border whitespace-nowrap ${r.flag === 'Normal'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
        >
          {r.flag}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border whitespace-nowrap ${r.status === 'Ready'
            ? 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/20'
            : 'bg-slate-100 text-slate-600 border-slate-200'
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
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedReport(r);
            }}
            className="px-2 py-1 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3 h-3 text-[#006a4e]" />
            <span>Report</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.print();
            }}
            className="p-1 rounded-[3px] hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            title="Print or Download PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Investigations"
          icon={FlaskConical}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Orders`}
          subtitle="Hematology, biochemistry & cardiac"
        />
        <SummaryCard
          title="Reports Published"
          icon={CheckCircle2}
          iconColor="text-[#006a4e]"
          value={`${stats.ready} Ready`}
          valueColor="text-[#006a4e]"
          subtitle="Available for online review & PDF"
        />
        <SummaryCard
          title="Normal Parameters"
          icon={Activity}
          iconColor="text-emerald-600"
          value={`${stats.normal} Tests`}
          valueColor="text-emerald-700"
          subtitle="Within physiological standard range"
        />
        <SummaryCard
          title="Elevated Biomarkers"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          value={`${stats.abnormal} Flagged`}
          valueColor="text-amber-600"
          subtitle="Lipid profile elevated"
        />
      </SummaryCardGrid>

      {/* Selected Report Quick View Card matching PatientDirectory */}
      {selectedReport && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                LAB
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedReport.testName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedReport.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${selectedReport.flag === 'Normal'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                  >
                    {selectedReport.flag}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Department: {selectedReport.department} · Order: {selectedReport.orderDate} · Published: {selectedReport.reportDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Report</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close report view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-3 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Laboratory Evaluated Findings:</div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs leading-relaxed">
              {selectedReport.resultSummary}
            </div>
          </div>
        </div>
      )}

      {/* CarrierDirect-Style Reusable DataTable matching PatientDirectory */}
      <DataTable<PatientLabReportItem>
        data={filteredReports}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search by test name, order number, or department..."
        searchFilter={(row, query) =>
          row.testName.toLowerCase().includes(query) ||
          row.orderNumber.toLowerCase().includes(query) ||
          row.department.toLowerCase().includes(query)
        }
        toolbarFilters={
          <DropdownSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            width="w-36"
            options={['All', 'Ready', 'Processing']}
          />
        }
        defaultPageSize={30}
        pageSizeOptions={[15, 30, 50, 100]}
        emptyTitle="No lab reports found"
        emptyDescription="There are no pathology reports recorded under the selected filter."
        onRowClick={(row) => setSelectedReport(row)}
        showSerial={true}
      />
    </div>
  );
};
