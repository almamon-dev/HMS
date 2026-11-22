import {
  Activity,
  Award,
  Calendar,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  RotateCcw,
  Scan,
  Search,
  Stethoscope,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  AppointmentBookingContext,
  CONSULTATION_DAYS,
  DEPARTMENT_DOCTORS,
  DIAGNOSTIC_PACKAGES,
  DoctorDesignation,
  HOSPITAL_BRANCHES,
  LAB_TEST_ITEMS,
} from '../../data/appointmentData';

interface QuickServiceHubProps {
  onOpenAppointment: (context?: AppointmentBookingContext) => void;
}

type ServiceTab = 'doctor' | 'appointment' | 'tests';

interface ResultRowItem {
  id: string;
  primary: string;
  secondary: string;
  rightText: string;
  onSelect: () => void;
}

interface QuickFilterChip {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const DESIGNATION_FILTERS: QuickFilterChip[] = [
  {
    value: 'Professor',
    label: 'Professor',
    icon: <GraduationCap className="w-3.5 h-3.5 text-amber-600" />,
  },
  {
    value: 'Associate Professor',
    label: 'Associate Professor',
    icon: <Award className="w-3.5 h-3.5 text-[#0094b6]" />,
  },
  {
    value: 'Assistant Professor',
    label: 'Assistant Professor',
    icon: <UserCheck className="w-3.5 h-3.5 text-[#006a4e]" />,
  },
  {
    value: 'Doctor',
    label: 'Doctor',
    icon: <Stethoscope className="w-3.5 h-3.5 text-[#0094b6]" />,
  },
];

const TEST_CATEGORY_FILTERS: QuickFilterChip[] = [
  {
    value: 'Pathology',
    label: 'Pathology',
    icon: <FlaskConical className="w-3.5 h-3.5 text-[#0284c7]" />,
  },
  {
    value: 'Radiology & MRI',
    label: 'Radiology & MRI',
    icon: <Scan className="w-3.5 h-3.5 text-[#0284c7]" />,
  },
  {
    value: 'Cardiac',
    label: 'Cardiac',
    icon: <HeartPulse className="w-3.5 h-3.5 text-rose-600" />,
  },
  {
    value: 'Biochemistry',
    label: 'Biochemistry',
    icon: <Activity className="w-3.5 h-3.5 text-[#0284c7]" />,
  },
  {
    value: 'Package',
    label: 'Packages',
    icon: <Award className="w-3.5 h-3.5 text-amber-600" />,
  },
];

const TEST_CATEGORIES = [
  'Pathology',
  'Radiology & MRI',
  'Biochemistry',
  'Cardiac',
  'Diabetic',
  'Package',
];

const DOCK_SELECT_CLASS =
  'w-full appearance-none cursor-pointer bg-white border border-slate-200 rounded-[3px] px-3.5 py-2.5 pr-8 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0094b6]';

const DOCK_SEARCH_INPUT_CLASS =
  'w-full bg-white border border-slate-200 rounded-[3px] pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0094b6] focus:ring-1 focus:ring-[#0094b6]/20';

const ResultsTable: React.FC<{
  leftHeader: string;
  rightHeader: string;
  rows: ResultRowItem[];
  emptyMessage: string;
  themeColor: 'teal' | 'green' | 'blue';
}> = ({ leftHeader, rightHeader, rows, emptyMessage, themeColor }) => {
  const headerBg =
    themeColor === 'teal'
      ? 'bg-[#0094b6]'
      : themeColor === 'blue'
        ? 'bg-[#0284c7]'
        : 'bg-[#006a4e]';

  const rowHover =
    themeColor === 'teal'
      ? 'hover:bg-[#f0f9fa]'
      : themeColor === 'blue'
        ? 'hover:bg-[#f0f7ff]'
        : 'hover:bg-[#eef7f3]/70';

  const textHover =
    themeColor === 'teal'
      ? 'group-hover:text-[#0094b6]'
      : themeColor === 'blue'
        ? 'group-hover:text-[#0284c7]'
        : 'group-hover:text-[#006a4e]';

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden bg-white shadow-2xs">
      <div className={`${headerBg} text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold tracking-wide`}>
        <span>{leftHeader}</span>
        <span>{rightHeader}</span>
      </div>

      {rows.length > 0 ? (
        <div className="max-h-[260px] overflow-y-auto divide-y divide-slate-100">
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={row.onSelect}
              className={`w-full px-4 py-3 flex items-center justify-between gap-4 ${rowHover} text-left transition-colors cursor-pointer group`}
            >
              <div className="min-w-0">
                <div className={`text-xs sm:text-sm font-bold text-slate-900 ${textHover} transition-colors truncate`}>
                  {row.primary}
                </div>
                <div className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  {row.secondary}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold text-slate-600 ${textHover}`}>
                  {row.rightText}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 ${textHover}`} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-xs font-medium text-slate-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

const QuickFilterBar: React.FC<{
  chips: QuickFilterChip[];
  selectedValue: string;
  onSelect: (value: string) => void;
  hasAnyResettableFilter: boolean;
  onReset: () => void;
  themeColor: 'teal' | 'green' | 'blue';
  extraAction?: React.ReactNode;
}> = ({
  chips,
  selectedValue,
  onSelect,
  hasAnyResettableFilter,
  onReset,
  themeColor,
  extraAction,
}) => {
    const activeChipClass =
      themeColor === 'teal'
        ? 'bg-[#0094b6] text-white border-[#0094b6] shadow-2xs'
        : themeColor === 'blue'
          ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-2xs'
          : 'bg-[#006a4e] text-white border-[#006a4e] shadow-2xs';

    const inactiveChipClass =
      themeColor === 'teal'
        ? 'bg-[#f0f9fa] text-[#00728c] border-teal-200/80 hover:bg-[#e0f3f6]'
        : themeColor === 'blue'
          ? 'bg-[#f0f7ff] text-[#0369a1] border-sky-200/80 hover:bg-[#e0f0fe]'
          : 'bg-[#edf6f2] text-[#006a4e] border-emerald-200/80 hover:bg-[#dff1e9]';

    const clearColor =
      themeColor === 'teal'
        ? 'text-[#0094b6] hover:text-[#00728c]'
        : themeColor === 'blue'
          ? 'text-[#0284c7] hover:text-[#0369a1]'
          : 'text-[#006a4e] hover:text-[#00553e]';

    return (
      <div className="bg-white rounded-md border border-slate-200 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 hidden sm:block" />
          <div className="text-xs font-bold text-slate-700 text-center">
            Quick Filters
          </div>
          <div className="flex-1 flex items-center justify-end gap-3">
            {extraAction}
            {hasAnyResettableFilter && (
              <button
                type="button"
                onClick={onReset}
                className={`inline-flex items-center gap-1 text-[11px] font-bold ${clearColor} transition-colors cursor-pointer`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {chips.map((chip) => {
            const isActive = selectedValue === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => onSelect(isActive ? '' : chip.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${isActive ? activeChipClass : inactiveChipClass
                  }`}
              >
                <span className={isActive ? '[&_svg]:!text-white' : ''}>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

export const QuickServiceHub: React.FC<QuickServiceHubProps> = ({
  onOpenAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<ServiceTab>('doctor');

  // Find a Doctor state
  const [branch, setBranch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [day, setDay] = useState('');
  const [doctorQuery, setDoctorQuery] = useState('');
  const [designationFilter, setDesignationFilter] = useState<
    DoctorDesignation | ''
  >('');

  // Test Prices state
  const [testBranch, setTestBranch] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [testQuery, setTestQuery] = useState('');

  const allDoctors = useMemo(
    () =>
      Object.entries(DEPARTMENT_DOCTORS).flatMap(([dept, list]) =>
        list.map((doc) => ({ ...doc, department: dept }))
      ),
    []
  );

  const hasDoctorFilter = Boolean(
    branch || specialization || day || doctorQuery.trim() || designationFilter
  );

  const doctorRows = useMemo<ResultRowItem[]>(() => {
    const q = doctorQuery.trim().toLowerCase();
    return allDoctors
      .filter((doc) => {
        if (branch && !doc.branches.includes(branch)) return false;
        if (specialization && doc.department !== specialization) return false;
        if (day && !doc.days.includes(day)) return false;
        if (designationFilter && doc.designation !== designationFilter) {
          return false;
        }
        if (q) {
          const matchesQuery =
            doc.name.toLowerCase().includes(q) ||
            doc.title.toLowerCase().includes(q) ||
            doc.department.toLowerCase().includes(q);
          if (!matchesQuery) return false;
        }
        return true;
      })
      .map((doc) => ({
        id: `${doc.department}-${doc.name}`,
        primary: doc.name,
        secondary: `${doc.title} • ${branch || doc.branches.join(', ')} • ${doc.fee}`,
        rightText: doc.department,
        onSelect: () =>
          onOpenAppointment({
            visitType: 'opd',
            branch: branch || undefined,
            department: doc.department,
            doctorName: doc.name,
          }),
      }));
  }, [
    allDoctors,
    branch,
    specialization,
    day,
    doctorQuery,
    designationFilter,
    onOpenAppointment,
  ]);

  const hasTestFilter = Boolean(
    testBranch || testCategory || testQuery.trim()
  );

  const testRows = useMemo<ResultRowItem[]>(() => {
    const q = testQuery.trim().toLowerCase();
    const combined = [
      ...LAB_TEST_ITEMS,
      ...DIAGNOSTIC_PACKAGES.map((pkg) => ({
        name: pkg.name,
        price: pkg.price,
        category: 'Package',
        branches: [...HOSPITAL_BRANCHES],
        reportTime: pkg.meta,
      })),
    ];

    return combined
      .filter((item) => {
        if (testBranch && !item.branches.includes(testBranch)) return false;
        if (testCategory && item.category !== testCategory) return false;
        if (q) {
          const matchesQuery =
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q);
          if (!matchesQuery) return false;
        }
        return true;
      })
      .map((item) => ({
        id: `${item.category}-${item.name}`,
        primary: item.name,
        secondary: `${item.category} • ${item.reportTime} • ${testBranch || item.branches.join(', ')
          }`,
        rightText: item.price,
        onSelect: () =>
          onOpenAppointment({
            visitType: 'diagnostic',
            branch: testBranch || undefined,
            packageName: item.category === 'Package' ? item.name : undefined,
            testName: item.category !== 'Package' ? item.name : undefined,
          }),
      }));
  }, [testBranch, testCategory, testQuery, onOpenAppointment]);

  const handleScrollToPackages = () => {
    const el = document.getElementById('diagnostic');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onOpenAppointment({ visitType: 'diagnostic' });
    }
  };

  const resetDoctorFilters = () => {
    setBranch('');
    setSpecialization('');
    setDay('');
    setDoctorQuery('');
    setDesignationFilter('');
  };

  const resetTestFilters = () => {
    setTestBranch('');
    setTestCategory('');
    setTestQuery('');
  };

  // ── Render Tab Button with Distinct Colors for Each Service ──
  const renderTabButton = (
    id: ServiceTab,
    label: string,
    icon: React.ReactNode
  ) => {
    const isActive = activeTab === id;

    let buttonClass = '';
    if (id === 'doctor') {
      buttonClass = isActive
        ? 'bg-[#0094b6] text-white shadow-xs'
        : 'bg-[#f0f9fa] hover:bg-[#e0f4f7] text-[#00728c] border border-teal-200/80';
    } else if (id === 'appointment') {
      buttonClass = isActive
        ? 'bg-[#006a4e] text-white shadow-xs'
        : 'bg-[#eef7f3] hover:bg-[#dcf0e7] text-[#006a4e] border border-emerald-200/80';
    } else if (id === 'tests') {
      buttonClass = isActive
        ? 'bg-[#0284c7] text-white shadow-xs'
        : 'bg-[#f0f7ff] hover:bg-[#e0efff] text-[#0284c7] border border-sky-200/80';
    }

    return (
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => setActiveTab(id)}
        className={`w-full px-4 py-2.5 rounded-[4px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${buttonClass}`}
      >
        <span className={isActive ? 'text-white' : ''}>{icon}</span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <section
      id="find-doctor"
      aria-label="Quick Doctor Finder and Test Prices"
      className="bg-white pb-6 border-b border-emerald-100/70"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 relative z-20 rounded-xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] space-y-3.5">
          {/* Top 3 Full-Width Equal Tabs (Distinct Color for Each Service) */}
        <div
          role="tablist"
          aria-label="Quick Service Tabs"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
        >
          {renderTabButton(
            'doctor',
            'Find a Doctor',
            <Stethoscope className="w-4 h-4 shrink-0" />
          )}
          {renderTabButton(
            'appointment',
            'Book Appointment',
            <Calendar className="w-4 h-4 shrink-0" />
          )}
          {renderTabButton(
            'tests',
            'Test Prices',
            <FlaskConical className="w-4 h-4 shrink-0" />
          )}
        </div>

        {/* ════════════════════ TAB 1: FIND A DOCTOR (Teal Theme) ════════════════════ */}
        {activeTab === 'doctor' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  aria-label="Select Branch"
                  className={DOCK_SELECT_CLASS}
                >
                  <option value="">Select Branch</option>
                  {HOSPITAL_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  aria-label="Select Specialization"
                  className={DOCK_SELECT_CLASS}
                >
                  <option value="">Select Specialization</option>
                  {Object.keys(DEPARTMENT_DOCTORS).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  aria-label="Select Consultation Day"
                  className={DOCK_SELECT_CLASS}
                >
                  <option value="">Select Day</option>
                  {CONSULTATION_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={doctorQuery}
                onChange={(e) => setDoctorQuery(e.target.value)}
                placeholder="Search by doctor's name..."
                className={DOCK_SEARCH_INPUT_CLASS}
              />
              {doctorQuery && (
                <button
                  type="button"
                  onClick={() => setDoctorQuery('')}
                  aria-label="Clear doctor search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {hasDoctorFilter && (
              <div className="space-y-3 pt-1">
                <ResultsTable
                  leftHeader="Doctor Name & Specialty"
                  rightHeader="Department"
                  rows={doctorRows}
                  emptyMessage="No doctors matched your selection. Try clearing some filters."
                  themeColor="teal"
                />

                <QuickFilterBar
                  chips={DESIGNATION_FILTERS}
                  selectedValue={designationFilter}
                  onSelect={(val) =>
                    setDesignationFilter(val as DoctorDesignation | '')
                  }
                  hasAnyResettableFilter={hasDoctorFilter}
                  onReset={resetDoctorFilters}
                  themeColor="teal"
                />
              </div>
            )}
          </div>
        )}

        {/* ════════════════════ TAB 2: BOOK APPOINTMENT (Emerald Green Theme) ════════════════════ */}
        {activeTab === 'appointment' && (
          <button
            type="button"
            onClick={() => onOpenAppointment({ visitType: 'opd' })}
            className="w-full py-3.5 px-6 rounded-[4px] border-0 bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-extrabold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 shrink-0 text-emerald-200" />
            <span>Make An OPD Appointment Now</span>
          </button>
        )}

        {/* ════════════════════ TAB 3: TEST PRICES (Medical Blue Theme) ════════════════════ */}
        {activeTab === 'tests' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <select
                  value={testBranch}
                  onChange={(e) => setTestBranch(e.target.value)}
                  aria-label="Select Diagnostic Branch"
                  className={DOCK_SELECT_CLASS}
                >
                  <option value="">Select Branch</option>
                  {HOSPITAL_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  aria-label="Select Test Category"
                  className={DOCK_SELECT_CLASS}
                >
                  <option value="">Select Category</option>
                  {TEST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Search by test or package name..."
                className="w-full bg-white border border-slate-200 rounded-[3px] pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]/20"
              />
              {testQuery && (
                <button
                  type="button"
                  onClick={() => setTestQuery('')}
                  aria-label="Clear test search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {hasTestFilter && (
              <div className="space-y-3 pt-1">
                <ResultsTable
                  leftHeader="Test / Package Name"
                  rightHeader="Price"
                  rows={testRows}
                  emptyMessage="No lab tests or checkup packages matched your selection."
                  themeColor="blue"
                />

                <QuickFilterBar
                  chips={TEST_CATEGORY_FILTERS}
                  selectedValue={testCategory}
                  onSelect={setTestCategory}
                  hasAnyResettableFilter={hasTestFilter}
                  onReset={resetTestFilters}
                  themeColor="blue"
                  extraAction={
                    <button
                      type="button"
                      onClick={handleScrollToPackages}
                      className="text-[11px] font-bold text-[#0284c7] hover:text-[#0369a1] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      All Packages
                    </button>
                  }
                />
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </section>
  );
};

export default QuickServiceHub;
