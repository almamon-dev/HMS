import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
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

type ServiceTab = 'appointment' | 'doctor' | 'tests' | 'checkup';

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
    icon: <FlaskConical className="w-3.5 h-3.5 text-[#006a4e]" />,
  },
  {
    value: 'Radiology & MRI',
    label: 'Radiology & MRI',
    icon: <Scan className="w-3.5 h-3.5 text-[#0094b6]" />,
  },
  {
    value: 'Cardiac',
    label: 'Cardiac',
    icon: <HeartPulse className="w-3.5 h-3.5 text-rose-600" />,
  },
  {
    value: 'Biochemistry',
    label: 'Biochemistry',
    icon: <Activity className="w-3.5 h-3.5 text-[#006a4e]" />,
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
  'w-full appearance-none cursor-pointer bg-transparent pr-5 text-xs font-bold text-slate-800 focus:outline-hidden';

const DOCK_SEARCH_INPUT_CLASS =
  'w-full bg-slate-50 border border-slate-200/90 rounded-[3px] pl-9 pr-9 py-2 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#006a4e] focus:bg-white';

const GreenResultsTable: React.FC<{
  leftHeader: string;
  rightHeader: string;
  rows: ResultRowItem[];
  emptyMessage: string;
}> = ({ leftHeader, rightHeader, rows, emptyMessage }) => (
  <div className="rounded-md border border-slate-200 overflow-hidden bg-white shadow-2xs">
    <div className="bg-[#006a4e] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold tracking-wide">
      <span>{leftHeader}</span>
      <span>{rightHeader}</span>
    </div>

    {rows.length > 0 ? (
      <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100">
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={row.onSelect}
            className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#eef7f3]/70 text-left transition-colors cursor-pointer group"
          >
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#006a4e] transition-colors truncate">
                {row.primary}
              </div>
              <div className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                {row.secondary}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-600 group-hover:text-[#006a4e]">
                {row.rightText}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#006a4e] group-hover:translate-x-0.5 transition-all" />
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

const QuickFilterBar: React.FC<{
  chips: QuickFilterChip[];
  selectedValue: string;
  onSelect: (value: string) => void;
  hasAnyResettableFilter: boolean;
  onReset: () => void;
  extraAction?: React.ReactNode;
}> = ({
  chips,
  selectedValue,
  onSelect,
  hasAnyResettableFilter,
  onReset,
  extraAction,
}) => (
  <div className="bg-slate-50 rounded-md border border-slate-200 px-4 py-2.5 space-y-2">
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
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0094b6] hover:text-[#006a4e] transition-colors cursor-pointer"
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-2xs'
                : 'bg-white text-[#006a4e] border-emerald-200/80 hover:bg-[#dff1e9]'
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

export const QuickServiceHub: React.FC<QuickServiceHubProps> = ({
  onOpenAppointment,
}) => {
  const departments = Object.keys(DEPARTMENT_DOCTORS);

  // Default active tab is 'appointment' (exact match with reference mockup)
  const [activeTab, setActiveTab] = useState<ServiceTab>('appointment');

  // Booking / Doctor state
  const [department, setDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [branch, setBranch] = useState('');
  const [day, setDay] = useState('');
  const [doctorQuery, setDoctorQuery] = useState('');
  const [designationFilter, setDesignationFilter] = useState<DoctorDesignation | ''>('');

  // Test Prices state
  const [testBranch, setTestBranch] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [testQuery, setTestQuery] = useState('');

  // Filtered doctors list for appointment select
  const availableDoctors = useMemo(() => {
    if (department && DEPARTMENT_DOCTORS[department]) {
      return DEPARTMENT_DOCTORS[department];
    }
    return Object.values(DEPARTMENT_DOCTORS).flat();
  }, [department]);

  // All doctors flattened for search tab
  const allDoctors = useMemo(
    () =>
      Object.entries(DEPARTMENT_DOCTORS).flatMap(([dept, list]) =>
        list.map((doc) => ({ ...doc, department: dept }))
      ),
    []
  );

  const hasDoctorFilter = Boolean(
    branch || department || day || doctorQuery.trim() || designationFilter
  );

  const doctorRows = useMemo<ResultRowItem[]>(() => {
    const q = doctorQuery.trim().toLowerCase();
    return allDoctors
      .filter((doc) => {
        if (branch && !doc.branches.includes(branch)) return false;
        if (department && doc.department !== department) return false;
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
        rightText: `${doc.fee} • Book`,
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
    department,
    day,
    doctorQuery,
    designationFilter,
    onOpenAppointment,
  ]);

  const hasTestFilter = Boolean(testBranch || testCategory || testQuery.trim());

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
        secondary: `${item.category} • ${item.reportTime} • ${
          testBranch || item.branches.join(', ')
        }`,
        rightText: `${item.price} • Book`,
        onSelect: () =>
          onOpenAppointment({
            visitType: 'diagnostic',
            branch: testBranch || undefined,
            packageName: item.category === 'Package' ? item.name : undefined,
            testName: item.category !== 'Package' ? item.name : undefined,
          }),
      }));
  }, [testBranch, testCategory, testQuery, onOpenAppointment]);

  const resetDoctorFilters = () => {
    setBranch('');
    setDepartment('');
    setDay('');
    setSelectedDoctor('');
    setDoctorQuery('');
    setDesignationFilter('');
  };

  const resetTestFilters = () => {
    setTestBranch('');
    setTestCategory('');
    setTestQuery('');
  };

  const handleBookSearch = () => {
    onOpenAppointment({
      visitType: 'opd',
      department: department || undefined,
      doctorName: selectedDoctor || undefined,
      date: selectedDate || undefined,
    });
  };

  return (
    <section
      id="find-doctor"
      aria-label="Quick Doctor Finder and Test Prices"
      className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 lg:-mt-14 pb-10"
    >
      <div className="bg-white rounded-[6px] sm:rounded-lg shadow-xl border border-slate-200/90 p-2.5 sm:p-3.5 space-y-3.5">
        {/* ════════════════════ TOP DOCK BAR (Exact layout & colors from reference mockup) ════════════════════ */}
        <div className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-3">
          {/* Left 4 Tabs (Clean active/inactive contrast) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Tab 1: Book Appointment */}
            <button
              type="button"
              onClick={() => setActiveTab('appointment')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'appointment'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* Tab 2: Find a Doctor */}
            <button
              type="button"
              onClick={() => setActiveTab('doctor')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'doctor'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Find a Doctor</span>
            </button>

            {/* Tab 3: Test Prices */}
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'tests'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Test Prices</span>
            </button>

            {/* Tab 4: Health Checkup */}
            <button
              type="button"
              onClick={() => setActiveTab('checkup')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'checkup'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Health Checkup</span>
            </button>
          </div>

          <div className="hidden xl:block h-9 w-px bg-slate-200" />

          {/* Right Selectors / Search (Dynamic based on Tab) */}
          {activeTab === 'appointment' && (
            <div className="w-full xl:w-auto flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
              {/* Department Dropdown */}
              <div className="w-full sm:w-auto flex-1 min-w-[140px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Department
                </label>
                <div className="relative flex items-center">
                  <select
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setSelectedDoctor('');
                    }}
                    className={DOCK_SELECT_CLASS}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Doctor Dropdown */}
              <div className="w-full sm:w-auto flex-1 min-w-[140px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Doctor
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className={DOCK_SELECT_CLASS}
                  >
                    <option value="">Select Doctor</option>
                    {availableDoctors.map((doc, idx) => (
                      <option key={`${doc.name}-${idx}`} value={doc.name}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Date Picker */}
              <div className="w-full sm:w-auto flex-1 min-w-[130px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Date
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={handleBookSearch}
                className="w-full sm:w-auto px-6 py-2.5 rounded-[4px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          )}

          {activeTab === 'doctor' && (
            <div className="w-full xl:w-auto flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
              {/* Branch */}
              <div className="w-full sm:w-auto flex-1 min-w-[130px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Branch
                </label>
                <div className="relative flex items-center">
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className={DOCK_SELECT_CLASS}
                  >
                    <option value="">Select Branch</option>
                    {HOSPITAL_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Department / Specialization */}
              <div className="w-full sm:w-auto flex-1 min-w-[140px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Specialization
                </label>
                <div className="relative flex items-center">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={DOCK_SELECT_CLASS}
                  >
                    <option value="">Select Specialization</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Day */}
              <div className="w-full sm:w-auto flex-1 min-w-[120px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Day
                </label>
                <div className="relative flex items-center">
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className={DOCK_SELECT_CLASS}
                  >
                    <option value="">Select Day</option>
                    {CONSULTATION_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="w-full xl:w-auto flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
              {/* Category */}
              <div className="w-full sm:w-auto flex-1 min-w-[140px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Category
                </label>
                <div className="relative flex items-center">
                  <select
                    value={testCategory}
                    onChange={(e) => setTestCategory(e.target.value)}
                    className={DOCK_SELECT_CLASS}
                  >
                    <option value="">Select Category</option>
                    {TEST_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Branch */}
              <div className="w-full sm:w-auto flex-1 min-w-[130px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
                <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                  Branch
                </label>
                <div className="relative flex items-center">
                  <select
                    value={testBranch}
                    onChange={(e) => setTestBranch(e.target.value)}
                    className={DOCK_SELECT_CLASS}
                  >
                    <option value="">Select Branch</option>
                    {HOSPITAL_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checkup' && (
            <div className="w-full xl:w-auto flex-1 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-[4px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>View All 8+ Health Packages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ════════════════════ EXPANDABLE RICH CONTENT (When in Doctor / Tests / Checkup Mode) ════════════════════ */}

        {/* Doctor Search & Live Results Table */}
        {activeTab === 'doctor' && (
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={doctorQuery}
                onChange={(e) => setDoctorQuery(e.target.value)}
                placeholder="Search by doctor name, title or specialty..."
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

            <GreenResultsTable
              leftHeader={`Doctors Available (${doctorRows.length})`}
              rightHeader="Consultation Fee"
              rows={doctorRows}
              emptyMessage="No doctors match the selected filters. Try choosing a different specialization or day."
            />

            <QuickFilterBar
              chips={DESIGNATION_FILTERS}
              selectedValue={designationFilter}
              onSelect={(val) => setDesignationFilter(val as DoctorDesignation | '')}
              hasAnyResettableFilter={hasDoctorFilter}
              onReset={resetDoctorFilters}
            />
          </div>
        )}

        {/* Test Prices Search & Live Results Table */}
        {activeTab === 'tests' && (
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Search by lab test name, category or package..."
                className={DOCK_SEARCH_INPUT_CLASS}
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

            <GreenResultsTable
              leftHeader={`Diagnostic Tests (${testRows.length})`}
              rightHeader="Price"
              rows={testRows}
              emptyMessage="No lab tests found matching your search. Please adjust your query."
            />

            <QuickFilterBar
              chips={TEST_CATEGORY_FILTERS}
              selectedValue={testCategory}
              onSelect={setTestCategory}
              hasAnyResettableFilter={hasTestFilter}
              onReset={resetTestFilters}
            />
          </div>
        )}

        {/* Health Checkup Quick Cards */}
        {activeTab === 'checkup' && (
          <div className="pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DIAGNOSTIC_PACKAGES.slice(0, 4).map((pkg) => (
                <div
                  key={pkg.name}
                  className="p-3.5 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#006a4e]/40 hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wider block">
                      Health Checkup
                    </span>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      {pkg.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {pkg.meta}
                    </p>
                    <div className="pt-1 flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Standard Routine Diagnostics</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-[#006a4e]">
                        {pkg.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenAppointment({
                          visitType: 'diagnostic',
                          packageName: pkg.name,
                        })
                      }
                      className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Book Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuickServiceHub;
