import {
  ChevronDown,
  Printer,
  RefreshCw,
  Search,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  BRANCH_AMBULANCE_DATA,
  BRANCH_APPOINTMENT_DATA,
  BRANCH_BIRTH_RECORD_DATA,
  BRANCH_BLOOD_DONOR_DATA,
  BRANCH_BLOOD_ISSUE_DATA,
  BRANCH_DEATH_RECORD_DATA,
  BRANCH_FINANCE_DATA,
  BRANCH_IPD_DATA,
  BRANCH_OPD_DATA,
  BRANCH_OT_DATA,
  BRANCH_PATHOLOGY_DATA,
  BRANCH_PAYROLL_DATA,
  BRANCH_PHARMACY_DATA,
  BRANCH_RADIOLOGY_DATA,
} from '../../../data/superadminBranchData';

export type TimeDurationOption =
  | 'Today'
  | 'This Week'
  | 'Last Week'
  | 'This Month'
  | 'Last Month'
  | 'Last 3 Months'
  | 'Last 6 Months'
  | 'Last 12 Months'
  | 'This Year'
  | 'Last Year'
  | 'Period';

// Branch signature palette
const BRANCH_COLORS: Record<string, string> = {
  'br-1': '#0094b6', // Central (Teal)
  'br-2': '#f59e0b', // North (Amber)
  'br-3': '#3b82f6', // West (Blue)
  'br-4': '#8b5cf6', // Port City (Purple)
  'br-5': '#10b981', // Sylhet (Emerald)
};

interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
}

const BranchDonutChart: React.FC<DonutChartProps> = ({ slices }) => {
  const total = slices.reduce((acc, s) => acc + s.value, 0);

  const slicesWithPct = slices.map((s) => ({
    ...s,
    pct: total > 0 ? (s.value / total) * 100 : 0,
  }));

  const radius = 36;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div className="flex flex-col items-center justify-center w-full py-1">
      {/* Legend at Top */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-2 max-w-[280px]">
        {slicesWithPct.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <span
              className="w-2.5 h-2.5 rounded-[3px] shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="truncate max-w-[130px] font-medium" title={s.name}>
              {s.name}
            </span>
            <span className="font-semibold text-slate-900">{Math.round(s.pct)}%</span>
          </div>
        ))}
      </div>

      {/* Circular Chart */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {total === 0 ? (
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-medium">
            0%
          </div>
        ) : (
          <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
            {slicesWithPct.map((s, idx) => {
              const dash = (s.value / total) * circumference;
              const offset = accumulated * circumference;
              accumulated += s.value / total;
              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={s.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

export const MultiBranchOverview: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [appliedBranch, setAppliedBranch] = useState<string>('all');

  const [timeDuration, setTimeDuration] = useState<TimeDurationOption>('Last Week');
  const [appliedTimeDuration, setAppliedTimeDuration] = useState<TimeDurationOption>('Last Week');

  const [dateFrom, setDateFrom] = useState<string>('2026-11-01');
  const [dateTo, setDateTo] = useState<string>('2026-11-20');
  const [appliedDateFrom, setAppliedDateFrom] = useState<string>('2026-11-01');
  const [appliedDateTo, setAppliedDateTo] = useState<string>('2026-11-20');

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = () => {
    setAppliedBranch(selectedBranch);
    setAppliedTimeDuration(timeDuration);
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Duration multiplier to dynamically scale telemetry figures based on selected period
  const durationMultiplier = useMemo(() => {
    switch (appliedTimeDuration) {
      case 'Today':
        return 0.15;
      case 'This Week':
        return 0.85;
      case 'Last Week':
        return 1.0;
      case 'This Month':
        return 3.6;
      case 'Last Month':
        return 4.2;
      case 'Last 3 Months':
        return 12.5;
      case 'Last 6 Months':
        return 25.0;
      case 'Last 12 Months':
        return 50.0;
      case 'This Year':
        return 46.0;
      case 'Last Year':
        return 52.0;
      case 'Period': {
        if (!appliedDateFrom || !appliedDateTo) return 1.0;
        const d1 = new Date(appliedDateFrom).getTime();
        const d2 = new Date(appliedDateTo).getTime();
        const days = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
        return Math.max(0.1, Number((days / 7).toFixed(2)));
      }
      default:
        return 1.0;
    }
  }, [appliedTimeDuration, appliedDateFrom, appliedDateTo]);

  const scaleInt = (val: number) => Math.max(0, Math.round(val * durationMultiplier));
  const scaleCur = (val: number) => Number((val * durationMultiplier).toFixed(2));

  // 1. Appointment Data
  const appointmentFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_APPOINTMENT_DATA
      : BRANCH_APPOINTMENT_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => {
      const tot = scaleInt(d.totalAppointment);
      const onl = scaleInt(d.onlineAppointment);
      const onlAmt = scaleCur(d.onlineAmount);
      const paid = scaleInt(d.patientPaid);
      const totPaid = scaleCur(d.totalPaid);
      return {
        ...d,
        totalAppointment: tot,
        onlineAppointment: onl,
        onlineAmount: onlAmt,
        patientPaid: paid,
        totalPaid: totPaid,
      };
    });
  }, [appliedBranch, durationMultiplier]);

  const appointmentSlices = useMemo(() => {
    return appointmentFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalAppointment,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [appointmentFiltered]);

  // 2. OPD Data
  const opdFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_OPD_DATA
      : BRANCH_OPD_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalOpd: scaleInt(d.totalOpd),
      rechecked: scaleInt(d.rechecked),
      paidAmount: scaleCur(d.paidAmount),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const opdSlices = useMemo(() => {
    return opdFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalOpd,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [opdFiltered]);

  // 3. IPD Data
  const ipdFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_IPD_DATA
      : BRANCH_IPD_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalIpd: scaleInt(d.totalIpd),
      discharged: scaleInt(d.discharged),
      paidAmount: scaleCur(d.paidAmount),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const ipdSlices = useMemo(() => {
    return ipdFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalIpd,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [ipdFiltered]);

  // 4. OT Data
  const otFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_OT_DATA
      : BRANCH_OT_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalOtCases: scaleInt(d.totalOtCases),
      totalOperation: scaleInt(d.totalOperation),
    }));
  }, [appliedBranch, durationMultiplier]);

  const otSlices = useMemo(() => {
    return otFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalOperation,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [otFiltered]);

  // 5. Pharmacy Data
  const pharmacyFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_PHARMACY_DATA
      : BRANCH_PHARMACY_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalBill: scaleInt(d.totalBill),
      billAmount: scaleCur(d.billAmount),
      paid: scaleInt(d.paid),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const pharmacySlices = useMemo(() => {
    return pharmacyFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalBill,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [pharmacyFiltered]);

  // 6. Pathology Data
  const pathologyFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_PATHOLOGY_DATA
      : BRANCH_PATHOLOGY_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalBill: scaleInt(d.totalBill),
      totalBillAmount: scaleCur(d.totalBillAmount),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const pathologySlices = useMemo(() => {
    return pathologyFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalBill,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [pathologyFiltered]);

  // 7. Radiology Data
  const radiologyFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_RADIOLOGY_DATA
      : BRANCH_RADIOLOGY_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalBill: scaleInt(d.totalBill),
      totalBillAmount: scaleCur(d.totalBillAmount),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const radiologySlices = useMemo(() => {
    return radiologyFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalBill,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [radiologyFiltered]);

  // 8. Blood Issue Data
  const bloodIssueFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_BLOOD_ISSUE_DATA
      : BRANCH_BLOOD_ISSUE_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalBill: scaleInt(d.totalBill),
      totalBillAmount: scaleCur(d.totalBillAmount),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const bloodIssueSlices = useMemo(() => {
    return bloodIssueFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalBill,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [bloodIssueFiltered]);

  // 9. Ambulance Data
  const ambulanceFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_AMBULANCE_DATA
      : BRANCH_AMBULANCE_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalBill: scaleInt(d.totalBill),
      totalBillAmount: scaleCur(d.totalBillAmount),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const ambulanceSlices = useMemo(() => {
    return ambulanceFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalBill,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [ambulanceFiltered]);

  // 10. Blood Donor Data
  const bloodDonorFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_BLOOD_DONOR_DATA
      : BRANCH_BLOOD_DONOR_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalDonor: scaleInt(d.totalDonor),
      totalDonation: scaleInt(d.totalDonation),
    }));
  }, [appliedBranch, durationMultiplier]);

  const bloodDonorSlices = useMemo(() => {
    return bloodDonorFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalDonation,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [bloodDonorFiltered]);

  // 11. Birth Record Data
  const birthRecordFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_BIRTH_RECORD_DATA
      : BRANCH_BIRTH_RECORD_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalBirth: scaleInt(d.totalBirth),
    }));
  }, [appliedBranch, durationMultiplier]);

  const birthRecordSlices = useMemo(() => {
    return birthRecordFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalBirth,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [birthRecordFiltered]);

  // 12. Death Record Data
  const deathRecordFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_DEATH_RECORD_DATA
      : BRANCH_DEATH_RECORD_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalDeath: scaleInt(d.totalDeath),
    }));
  }, [appliedBranch, durationMultiplier]);

  const deathRecordSlices = useMemo(() => {
    return deathRecordFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalDeath,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [deathRecordFiltered]);

  // 13. Finance Data
  const financeFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_FINANCE_DATA
      : BRANCH_FINANCE_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      totalIncome: scaleCur(d.totalIncome),
      totalExpense: scaleCur(d.totalExpense),
    }));
  }, [appliedBranch, durationMultiplier]);

  const financeSlices = useMemo(() => {
    return financeFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalIncome,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [financeFiltered]);

  // 14. Payroll Data
  const payrollFiltered = useMemo(() => {
    const raw = appliedBranch === 'all'
      ? BRANCH_PAYROLL_DATA
      : BRANCH_PAYROLL_DATA.filter((b) => b.branchId === appliedBranch);

    return raw.map((d) => ({
      ...d,
      grossSalary: scaleCur(d.grossSalary),
      totalDeductions: scaleCur(d.totalDeductions),
      netAmount: scaleCur(d.netAmount),
      totalPaid: scaleCur(d.totalPaid),
    }));
  }, [appliedBranch, durationMultiplier]);

  const payrollSlices = useMemo(() => {
    return payrollFiltered.map((d) => ({
      name: d.branchName,
      value: d.totalStaff,
      color: BRANCH_COLORS[d.branchId] || '#0094b6',
    }));
  }, [payrollFiltered]);

  return (
    <div className="space-y-3">
      {/* Top Filter Card exactly matching user screenshots */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">
              Overview
            </h3>
            <span className="px-2 py-0.5 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] text-[11px] font-semibold border border-[#0094b6]/20">
              {appliedTimeDuration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="h-7 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3 h-3 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Reload Telemetry</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="h-7 px-2.5 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Print View</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {/* Select Branch */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Select Branch <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                aria-label="Select branch for overview"
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setAppliedBranch(e.target.value);
                }}
                className="h-8 min-w-[240px] pl-2.5 pr-8 rounded-[3px] border border-slate-300 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-[#0094b6] cursor-pointer"
              >
                <option value="all">All Branch</option>
                <option value="br-1">Green Hospital Central (Main Branch)</option>
                <option value="br-2">Green Hospital North</option>
                <option value="br-3">Green Hospital West</option>
                <option value="br-4">Green Hospital Port City</option>
                <option value="br-5">Green Hospital Sylhet</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Time Duration exactly matching media_1795134039705_e9432cc8.png */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Time Duration <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                aria-label="Time Duration"
                value={timeDuration}
                onChange={(e) => {
                  const val = e.target.value as TimeDurationOption;
                  setTimeDuration(val);
                  setAppliedTimeDuration(val);
                }}
                className="h-8 min-w-[200px] pl-2.5 pr-8 rounded-[3px] border border-[#0094b6] bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#0094b6] cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="Last Week">Last Week</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last 12 Months">Last 12 Months</option>
                <option value="This Year">This Year</option>
                <option value="Last Year">Last Year</option>
                <option value="Period">Period</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0094b6] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Period Custom Date Pickers */}
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
                  className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#0094b6]"
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
                  className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#0094b6]"
                />
              </div>
            </>
          )}

          {/* Search Button matching reference image */}
          <button
            type="button"
            onClick={handleSearch}
            className="h-8 px-4 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* 1. Appointment Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Appointment</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Appointment</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Doctor Approved</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Online Appointment</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Online Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Offline / Desk</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Patient Paid</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {appointmentFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalAppointment}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-100">{r.doctorApproved}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-100">{r.onlineAppointment}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.onlineAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-100">{r.offlineDesk}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-100">{r.patientPaid}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{appointmentFiltered.reduce((s, d) => s + d.totalAppointment, 0)}</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">-</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{appointmentFiltered.reduce((s, d) => s + d.onlineAppointment, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{appointmentFiltered.reduce((s, d) => s + d.onlineAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">-</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{appointmentFiltered.reduce((s, d) => s + d.patientPaid, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{appointmentFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={appointmentSlices} />
          </div>
        </div>
      </div>

      {/* 2. OPD - Out Patient Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">OPD - Out Patient</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total OPD</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Rechecked</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Paid Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {opdFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalOpd}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-100">{r.rechecked}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.paidAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{opdFiltered.reduce((s, d) => s + d.totalOpd, 0)}</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{opdFiltered.reduce((s, d) => s + d.rechecked, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{opdFiltered.reduce((s, d) => s + d.paidAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{opdFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={opdSlices} />
          </div>
        </div>
      </div>

      {/* 3. IPD - In Patient Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">IPD - In Patient</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total IPD</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Discharged</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Paid Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {ipdFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalIpd}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-100">{r.discharged}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.paidAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{ipdFiltered.reduce((s, d) => s + d.totalIpd, 0)}</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{ipdFiltered.reduce((s, d) => s + d.discharged, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{ipdFiltered.reduce((s, d) => s + d.paidAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{ipdFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={ipdSlices} />
          </div>
        </div>
      </div>

      {/* 4. Operation Theatre Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Operation Theatre</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total OT Cases</th>
                  <th className="py-1.5 px-2.5 text-center font-bold">Total Operation</th>
                </tr>
              </thead>
              <tbody>
                {otFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalOtCases}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-emerald-700">{r.totalOperation}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{otFiltered.reduce((s, d) => s + d.totalOtCases, 0)}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-[#0094b6]">{otFiltered.reduce((s, d) => s + d.totalOperation, 0)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={otSlices} />
          </div>
        </div>
      </div>

      {/* 5. Pharmacy Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Pharmacy</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Bill</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Bill Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Paid Bills</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {pharmacyFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalBill}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.billAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-100">{r.paid}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{pharmacyFiltered.reduce((s, d) => s + d.totalBill, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{pharmacyFiltered.reduce((s, d) => s + d.billAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{pharmacyFiltered.reduce((s, d) => s + d.paid, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{pharmacyFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={pharmacySlices} />
          </div>
        </div>
      </div>

      {/* 6. Pathology Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Pathology</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Bill</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Total Bill Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {pathologyFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalBill}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.totalBillAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{pathologyFiltered.reduce((s, d) => s + d.totalBill, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{pathologyFiltered.reduce((s, d) => s + d.totalBillAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{pathologyFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={pathologySlices} />
          </div>
        </div>
      </div>

      {/* 7. Radiology Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Radiology</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Bill</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Total Bill Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {radiologyFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalBill}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.totalBillAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{radiologyFiltered.reduce((s, d) => s + d.totalBill, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{radiologyFiltered.reduce((s, d) => s + d.totalBillAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{radiologyFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={radiologySlices} />
          </div>
        </div>
      </div>

      {/* 8. Blood Issue Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Blood Issue</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Bill</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Total Bill Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {bloodIssueFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalBill}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.totalBillAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{bloodIssueFiltered.reduce((s, d) => s + d.totalBill, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{bloodIssueFiltered.reduce((s, d) => s + d.totalBillAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{bloodIssueFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={bloodIssueSlices} />
          </div>
        </div>
      </div>

      {/* 9. Ambulance Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Ambulance</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Bill</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Total Bill Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {ambulanceFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalBill}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.totalBillAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{ambulanceFiltered.reduce((s, d) => s + d.totalBill, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{ambulanceFiltered.reduce((s, d) => s + d.totalBillAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{ambulanceFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={ambulanceSlices} />
          </div>
        </div>
      </div>

      {/* 10. Blood Donor & Donation Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Blood Donor &amp; Donation</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Donor</th>
                  <th className="py-1.5 px-2.5 text-center font-bold">Total Donation</th>
                </tr>
              </thead>
              <tbody>
                {bloodDonorFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalDonor}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-rose-700">{r.totalDonation}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{bloodDonorFiltered.reduce((s, d) => s + d.totalDonor, 0)}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-rose-700">{bloodDonorFiltered.reduce((s, d) => s + d.totalDonation, 0)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={bloodDonorSlices} />
          </div>
        </div>
      </div>

      {/* 11. Birth Record Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Birth Record</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold">Total Birth</th>
                </tr>
              </thead>
              <tbody>
                {birthRecordFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-emerald-700">{r.totalBirth}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-emerald-700">{birthRecordFiltered.reduce((s, d) => s + d.totalBirth, 0)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={birthRecordSlices} />
          </div>
        </div>
      </div>

      {/* 12. Death Record Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Death Record</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold">Total Death</th>
                </tr>
              </thead>
              <tbody>
                {deathRecordFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-slate-700">{r.totalDeath}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-slate-900">{deathRecordFiltered.reduce((s, d) => s + d.totalDeath, 0)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={deathRecordSlices} />
          </div>
        </div>
      </div>

      {/* 13. Hospital Income & Expense Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Hospital Income &amp; Expense</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Total Income ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Expense ($)</th>
                </tr>
              </thead>
              <tbody>
                {financeFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-emerald-700 border-r border-slate-100">{r.totalIncome.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-rose-700">{r.totalExpense.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-emerald-700 border-r border-slate-200">{financeFiltered.reduce((s, d) => s + d.totalIncome, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-rose-700">{financeFiltered.reduce((s, d) => s + d.totalExpense, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={financeSlices} />
          </div>
        </div>
      </div>

      {/* 14. Staff Payroll Section */}
      <div className="bg-white border border-slate-200 rounded-[3px] p-3 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2">Staff Payroll</h4>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
          <div className="xl:col-span-9 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#edf2f7] text-slate-700 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold border-r border-slate-200">Branch</th>
                  <th className="py-1.5 px-2.5 text-center font-bold border-r border-slate-200">Total Staff</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Gross Salary ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Total Deductions ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold border-r border-slate-200">Net Amount ($)</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">Total Paid ($)</th>
                </tr>
              </thead>
              <tbody>
                {payrollFiltered.map((r) => (
                  <tr key={r.branchId} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-medium text-slate-800 border-r border-slate-100">{r.branchName}</td>
                    <td className="py-1.5 px-2.5 text-center font-semibold text-slate-900 border-r border-slate-100">{r.totalStaff}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.grossSalary.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-700 border-r border-slate-100">{r.totalDeductions.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-800 border-r border-slate-100">{r.netAmount.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">{r.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
                {appliedBranch === 'all' && (
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-1.5 px-2.5 border-r border-slate-200">Network Total</td>
                    <td className="py-1.5 px-2.5 text-center border-r border-slate-200">{payrollFiltered.reduce((s, d) => s + d.totalStaff, 0)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{payrollFiltered.reduce((s, d) => s + d.grossSalary, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{payrollFiltered.reduce((s, d) => s + d.totalDeductions, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right border-r border-slate-200">{payrollFiltered.reduce((s, d) => s + d.netAmount, 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0094b6]">{payrollFiltered.reduce((s, d) => s + d.totalPaid, 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="xl:col-span-3 border-l border-slate-100 pl-3">
            <BranchDonutChart slices={payrollSlices} />
          </div>
        </div>
      </div>
    </div>
  );
};
