import {
  Activity,
  BedDouble,
  Building2,
  CalendarCheck2,
  ChevronDown,
  Clock,
  FlaskConical,
  HeartPulse,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Stethoscope,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface SuperadminOverviewProps {
  onSelectModule: (module: string) => void;
}

interface TokenRecord {
  token: string;
  uhid: string;
  patientName: string;
  ageGender: string;
  doctor: string;
  department: string;
  chamber: string;
  visitType: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  time: string;
  status: 'In Consultation' | 'Calling' | 'Waiting' | 'Completed';
}

const INITIAL_QUEUE: TokenRecord[] = [
  {
    token: 'TK-01',
    uhid: '1072',
    patientName: 'Aadish Mody',
    ageGender: '34y/F',
    doctor: 'Dr. Reyan Jain (9011)',
    department: 'Cardiology',
    chamber: 'Ch-101',
    visitType: 'First Visit',
    priority: 'Normal',
    time: '02:00 PM',
    status: 'In Consultation',
  },
  {
    token: 'TK-02',
    uhid: '1026',
    patientName: 'Sultana Razia',
    ageGender: '38y/F',
    doctor: 'Dr. Farhana Yasmin (9013)',
    department: 'Gynecology',
    chamber: 'Ch-104',
    visitType: 'Follow-up',
    priority: 'Urgent',
    time: '10:00 AM',
    status: 'Calling',
  },
  {
    token: 'TK-03',
    uhid: '1027',
    patientName: 'Tanveer Chowdhury',
    ageGender: '45y/M',
    doctor: 'Dr. Kamrul Islam (9014)',
    department: 'Orthopedics',
    chamber: 'Ch-202',
    visitType: 'First Visit',
    priority: 'Normal',
    time: '10:30 AM',
    status: 'Waiting',
  },
  {
    token: 'TK-04',
    uhid: '1028',
    patientName: 'Jannatul Ferdous',
    ageGender: '29y/F',
    doctor: 'Dr. Tariqul Anwar (9015)',
    department: 'Neuromedicine',
    chamber: 'Ch-301',
    visitType: 'Emergency Triage',
    priority: 'Emergency',
    time: '11:00 AM',
    status: 'In Consultation',
  },
  {
    token: 'TK-05',
    uhid: '1029',
    patientName: 'Monirul Haque',
    ageGender: '52y/M',
    doctor: 'Dr. Nafisa Chowdhury (9016)',
    department: 'Pediatrics',
    chamber: 'Ch-205',
    visitType: 'Report Review',
    priority: 'Normal',
    time: '11:30 AM',
    status: 'Waiting',
  },
  {
    token: 'TK-06',
    uhid: '1030',
    patientName: 'Nusrat Jahan',
    ageGender: '24y/F',
    doctor: 'Prof. Dr. Tanvir Ahmed (9010)',
    department: 'Cardiology',
    chamber: 'Ch-102',
    visitType: 'Follow-up',
    priority: 'Urgent',
    time: '12:00 PM',
    status: 'Waiting',
  },
  {
    token: 'TK-07',
    uhid: '1031',
    patientName: 'Mohammad Rahim',
    ageGender: '61y/M',
    doctor: 'Dr. Reyan Jain (9011)',
    department: 'Cardiology',
    chamber: 'Ch-101',
    visitType: 'Follow-up',
    priority: 'Normal',
    time: '02:30 PM',
    status: 'Waiting',
  },
  {
    token: 'TK-08',
    uhid: '1032',
    patientName: 'Farhana Kabir',
    ageGender: '41y/F',
    doctor: 'Dr. Farhana Yasmin (9013)',
    department: 'Gynecology',
    chamber: 'Ch-104',
    visitType: 'Report Review',
    priority: 'Normal',
    time: '10:45 AM',
    status: 'Completed',
  },
];

const WARD_MATRIX = [
  {
    ward: 'ICU / CCU (Critical Care)',
    building: 'Bldg A, 2nd Fl',
    total: 15,
    occupied: 14,
    vacant: 1,
    rate: 93,
    status: 'Near Full',
    statusClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    ward: 'Male General Ward',
    building: 'Bldg B, 3rd Fl',
    total: 35,
    occupied: 25,
    vacant: 10,
    rate: 71,
    status: 'Normal',
    statusClass: 'bg-emerald-50 text-[#006a4e] border-emerald-200',
  },
  {
    ward: 'Female General Ward',
    building: 'Bldg B, 4th Fl',
    total: 35,
    occupied: 26,
    vacant: 9,
    rate: 74,
    status: 'Normal',
    statusClass: 'bg-emerald-50 text-[#006a4e] border-emerald-200',
  },
  {
    ward: 'Pediatric / NICU Ward',
    building: 'Bldg A, 1st Fl',
    total: 15,
    occupied: 9,
    vacant: 6,
    rate: 60,
    status: 'Normal',
    statusClass: 'bg-emerald-50 text-[#006a4e] border-emerald-200',
  },
  {
    ward: 'Post-Operative Recovery',
    building: 'Bldg A, 3rd Fl',
    total: 10,
    occupied: 6,
    vacant: 4,
    rate: 60,
    status: 'Normal',
    statusClass: 'bg-emerald-50 text-[#006a4e] border-emerald-200',
  },
  {
    ward: 'VIP Executive Cabins',
    building: 'Bldg C, 5th Fl',
    total: 10,
    occupied: 4,
    vacant: 6,
    rate: 40,
    status: 'Available',
    statusClass: 'bg-sky-50 text-sky-700 border-sky-200',
  },
];

const DOCTOR_ROSTER = [
  {
    doctor: 'Dr. Reyan Jain (9011)',
    specialty: 'Cardiology',
    chamber: 'Ch-101',
    shift: '08:00 - 14:00',
    queued: 18,
    status: 'In Chamber',
    statusClass: 'bg-emerald-50 text-[#006a4e]',
  },
  {
    doctor: 'Dr. Farhana Yasmin (9013)',
    specialty: 'Gynecology & Obs',
    chamber: 'Ch-104',
    shift: '09:00 - 15:00',
    queued: 14,
    status: 'In Chamber',
    statusClass: 'bg-emerald-50 text-[#006a4e]',
  },
  {
    doctor: 'Dr. Kamrul Islam (9014)',
    specialty: 'Orthopedic Surgery',
    chamber: 'Ch-202',
    shift: '08:00 - 14:00',
    queued: 12,
    status: 'In Surgery',
    statusClass: 'bg-amber-50 text-amber-700',
  },
  {
    doctor: 'Dr. Tariqul Anwar (9015)',
    specialty: 'Neuromedicine',
    chamber: 'Ch-301',
    shift: '10:00 - 16:00',
    queued: 8,
    status: 'In Chamber',
    statusClass: 'bg-emerald-50 text-[#006a4e]',
  },
  {
    doctor: 'Dr. Nafisa Chowdhury (9016)',
    specialty: 'Pediatrics',
    chamber: 'Ch-205',
    shift: '08:00 - 14:00',
    queued: 15,
    status: 'On Break',
    statusClass: 'bg-slate-100 text-slate-700',
  },
  {
    doctor: 'Prof. Dr. Tanvir Ahmed (9010)',
    specialty: 'Cardiothoracic',
    chamber: 'Ch-102',
    shift: '08:00 - 14:00',
    queued: 20,
    status: 'In Chamber',
    statusClass: 'bg-emerald-50 text-[#006a4e]',
  },
];

export const SuperadminOverview: React.FC<SuperadminOverviewProps> = ({
  onSelectModule,
}) => {
  const [queue, setQueue] = useState<TokenRecord[]>(INITIAL_QUEUE);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState('10:42 AM');

  const departments = [
    'All Departments',
    'Cardiology',
    'Gynecology',
    'Orthopedics',
    'Neuromedicine',
    'Pediatrics',
  ];

  const filteredQueue = queue.filter((item) => {
    const matchesDept =
      selectedDeptFilter === 'All Departments' ||
      item.department === selectedDeptFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uhid.includes(searchQuery) ||
      item.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleRefresh = () => {
    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleToggleTokenStatus = (tokenNum: string) => {
    setQueue((prev) =>
      prev.map((t) => {
        if (t.token !== tokenNum) return t;
        if (t.status === 'Calling') return { ...t, status: 'In Consultation' };
        if (t.status === 'In Consultation') return { ...t, status: 'Completed' };
        if (t.status === 'Waiting') return { ...t, status: 'Calling' };
        return { ...t, status: 'Waiting' };
      })
    );
  };

  return (
    <div className="space-y-2 min-w-0 w-full overflow-hidden">
      {/* 1. Station Control & System Command Strip (Java Swing Ribbon Style) */}
      <div className="bg-white border border-slate-300 rounded-[3px] px-2.5 py-1.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Station Status Info */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-[3px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">Online</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="font-semibold text-slate-900">
                Central Operations Station
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Dhanmondi • Uttara • Mirpur</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded-[3px]">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Morning OPD (08:00 - 14:00)</span>
              <span className="text-slate-300">•</span>
              <span>20 Nov 2026</span>
            </div>
          </div>

          {/* Quick Action Button Toolbar */}
          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => onSelectModule('patient')}
              className="inline-flex items-center gap-1 px-2 py-1 font-semibold bg-[#006a4e] text-white hover:bg-[#00523c] rounded-[3px] transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Register Patient</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectModule('appointment')}
              className="inline-flex items-center gap-1 px-2 py-1 font-semibold bg-white border border-[#006a4e] text-[#006a4e] hover:bg-[#edf6f2] rounded-[3px] transition-colors cursor-pointer"
            >
              <CalendarCheck2 className="w-3 h-3" />
              <span>Book Appointment</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectModule('ipd')}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-1 font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-[3px] transition-colors cursor-pointer"
            >
              <BedDouble className="w-3 h-3 text-slate-500" />
              <span>Bed Admission</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              title={`Last refreshed at ${lastRefreshed}`}
              className="inline-flex items-center gap-1 px-1.5 py-1 font-semibold bg-slate-50 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-[3px] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync ({lastRefreshed})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Operational Metric Counters (6-Tile Compact Java Matrix) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Metric 1: OPD Registrations */}
        <div
          onClick={() => onSelectModule('opd')}
          className="bg-white border border-slate-300 rounded-[3px] p-2 flex flex-col justify-between shadow-xs hover:border-[#006a4e] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">
              OPD Registrations
            </span>
            <Stethoscope className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <div className="text-base font-extrabold text-slate-900 leading-none">
              142
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              98 Gen • 44 Spec
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="text-emerald-700 font-semibold">71% Done</span>
            <span className="text-[#006a4e] font-semibold underline">Manage</span>
          </div>
        </div>

        {/* Metric 2: IPD Bed Occupancy */}
        <div className="bg-white border border-slate-300 rounded-[3px] p-2 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">
              IPD Bed Occupancy
            </span>
            <BedDouble className="w-3.5 h-3.5 text-sky-700" />
          </div>
          <div className="my-1">
            <div className="text-base font-extrabold text-slate-900 leading-none">
              84 <span className="text-[11px] font-normal text-slate-500">/ 120</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              70% Occ • 36 Vac
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="text-sky-700 font-semibold">14 ICU Beds</span>
            <span className="text-slate-400">6 Cabins</span>
          </div>
        </div>

        {/* Metric 3: Today's Appointments */}
        <div
          onClick={() => onSelectModule('appointment')}
          className="bg-white border border-slate-300 rounded-[3px] p-2 flex flex-col justify-between shadow-xs hover:border-[#006a4e] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">
              Appointments
            </span>
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <div className="text-base font-extrabold text-slate-900 leading-none">
              60
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              42 Appr • 12 Pend
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="text-amber-700 font-semibold">6 Cancel</span>
            <span className="text-[#006a4e] font-semibold underline">Manage</span>
          </div>
        </div>

        {/* Metric 4: Emergency Cases */}
        <div className="bg-white border border-slate-300 rounded-[3px] p-2 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">
              Emergency & Trauma
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="my-1">
            <div className="text-base font-extrabold text-rose-600 leading-none">
              9 Active
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              3 Red • 6 Obs
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="text-rose-700 font-semibold">Triage Live</span>
            <span className="text-slate-400">Staffed</span>
          </div>
        </div>

        {/* Metric 5: OT Surgeries */}
        <div className="bg-white border border-slate-300 rounded-[3px] p-2 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">
              OT Surgeries
            </span>
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="my-1">
            <div className="text-base font-extrabold text-slate-900 leading-none">
              6 Cases
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              2 Running • 4 Sched
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="text-indigo-700 font-semibold">OT-1,2 Busy</span>
            <span className="text-slate-400">OT-3 Ready</span>
          </div>
        </div>

        {/* Metric 6: Diagnostic Orders */}
        <div
          onClick={() => onSelectModule('radiology')}
          className="bg-white border border-slate-300 rounded-[3px] p-2 flex flex-col justify-between shadow-xs hover:border-[#0094b6] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">
              Diagnostics / Imaging
            </span>
            <FlaskConical className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <div className="text-base font-extrabold text-slate-900 leading-none">
              48 Orders
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              24 Done • 24 Proc
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="text-emerald-700 font-semibold">50% Done</span>
            <span className="text-[#0094b6] font-semibold underline">Radiology</span>
          </div>
        </div>
      </div>

      {/* 3. Central Operational Workstation (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 min-w-0 w-full overflow-hidden">
        {/* Left Column: Live Consultation Token Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-[3px] flex flex-col min-w-0 overflow-hidden shadow-xs">
          {/* Workstation Header */}
          <div className="px-2.5 py-1.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#006a4e]" />
              <h3 className="text-[11px] font-bold text-slate-800">
                Live Consultation Token Queue
              </h3>
            </div>

            {/* Department Dropdown & Search */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 text-slate-700 text-[10.5px] font-semibold pl-1.5 pr-5 py-0.5 rounded-[3px] focus:outline-none cursor-pointer"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative w-32 sm:w-36">
                <input
                  type="text"
                  placeholder="Filter token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-[10.5px] pl-5 pr-1.5 py-0.5 rounded-[3px] focus:outline-none placeholder:text-slate-400"
                />
                <Search className="w-2.5 h-2.5 text-slate-400 absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* JTable Style Grid */}
          <div className="overflow-x-auto table-hover-scrollbar flex-1 min-w-0">
            <table className="w-full text-left text-[11px] border-collapse min-w-[580px]">
              <thead>
                <tr className="bg-[#f1f5f9] text-slate-700 font-bold border-b border-slate-200 text-xs">
                  <th className="py-2 px-2.5 w-14 border-r border-slate-200/60 whitespace-nowrap">Token</th>
                  <th className="py-2 px-2.5 w-16 border-r border-slate-200/60 whitespace-nowrap">UHID</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">Patient Name</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">Doctor</th>
                  <th className="py-2 px-2.5 w-20 border-r border-slate-200/60 whitespace-nowrap">Dept</th>
                  <th className="py-2 px-2 w-14 border-r border-slate-200/60 text-center whitespace-nowrap">Priority</th>
                  <th className="py-2 px-2 w-16 border-r border-slate-200/60 text-center whitespace-nowrap">Time</th>
                  <th className="py-2 px-2.5 w-24 border-r border-slate-200/60 text-center whitespace-nowrap">Status</th>
                  <th className="py-2 px-2 w-12 text-center whitespace-nowrap">Act</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-5 text-center text-slate-400 text-xs">
                      No queue records match filter.
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((item) => {
                    const isCalling = item.status === 'Calling';
                    const isInConsult = item.status === 'In Consultation';
                    const isCompleted = item.status === 'Completed';

                    return (
                      <tr
                        key={item.token}
                        className={`hover:bg-slate-50 transition-colors ${isCalling
                          ? 'bg-amber-50/50'
                          : isInConsult
                            ? 'bg-emerald-50/30'
                            : ''
                          }`}
                      >
                        <td className="py-2 px-2.5 border-r border-slate-200/60 font-bold text-slate-800 whitespace-nowrap">
                          <span className="inline-block px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px]">
                            {item.token}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200/60 text-[#006a4e] font-semibold whitespace-nowrap">
                          {item.uhid}
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">
                            {item.patientName}
                          </span>{' '}
                          <span className="text-[10px] text-slate-400">
                            ({item.ageGender})
                          </span>
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">
                          <span className="text-slate-800">
                            {item.doctor}
                          </span>{' '}
                          <span className="text-[10px] text-slate-400">
                            [{item.chamber}]
                          </span>
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200/60 text-slate-600 whitespace-nowrap">
                          {item.department}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200/60 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold ${item.priority === 'Emergency'
                              ? 'bg-rose-100 text-rose-800'
                              : item.priority === 'Urgent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200/60 text-center text-slate-500 text-[11px] whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200/60 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold ${isInConsult
                              ? 'bg-emerald-50 text-[#006a4e] border border-emerald-200'
                              : isCalling
                                ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                                : isCompleted
                                  ? 'bg-slate-100 text-slate-500 border border-slate-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleTokenStatus(item.token)}
                            className="px-1.5 py-0.5 text-[10.5px] font-semibold bg-white border border-slate-300 text-slate-700 hover:border-[#006a4e] hover:text-[#006a4e] rounded-[3px] transition-colors cursor-pointer"
                          >
                            {isCalling
                              ? 'Enter'
                              : isInConsult
                                ? 'Done'
                                : isCompleted
                                  ? 'Reset'
                                  : 'Call'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Statusbar */}
          <div className="px-2 py-1 border-t border-slate-200 bg-slate-50 text-[10.5px] text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>
                Tokens: <strong>{filteredQueue.length}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span>
                Avg Wait: <strong>14 min</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-semibold">
                Normal Flow
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectModule('appointment')}
              className="text-[#006a4e] font-semibold hover:underline cursor-pointer"
            >
              Full Appointment List →
            </button>
          </div>
        </div>

        {/* Right Column: Ward & Bed Occupancy Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-300 rounded-[3px] flex flex-col min-w-0 overflow-hidden shadow-xs">
          {/* Header */}
          <div className="px-2.5 py-1.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-sky-700" />
              <h3 className="text-[11px] font-bold text-slate-800">
                Ward &amp; Bed Occupancy Matrix
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onSelectModule('ipd')}
              className="text-[10.5px] font-semibold text-[#006a4e] hover:underline cursor-pointer"
            >
              Manage IPD →
            </button>
          </div>

          {/* JTable Matrix */}
          <div className="overflow-x-auto table-hover-scrollbar flex-1 min-w-0">
            <table className="w-full text-left text-xs border-collapse min-w-[360px]">
              <thead>
                <tr className="bg-[#f1f5f9] text-slate-700 font-bold border-b border-slate-200 text-xs">
                  <th className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">Ward / Unit</th>
                  <th className="py-2 px-2 w-12 border-r border-slate-200/60 text-center whitespace-nowrap">Total</th>
                  <th className="py-2 px-2 w-12 border-r border-slate-200/60 text-center whitespace-nowrap">Occ</th>
                  <th className="py-2 px-2 w-12 border-r border-slate-200/60 text-center whitespace-nowrap">Vac</th>
                  <th className="py-2 px-2.5 w-20 border-r border-slate-200/60 text-center whitespace-nowrap">Rate</th>
                  <th className="py-2 px-2 w-16 text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WARD_MATRIX.map((w) => (
                  <tr key={w.ward} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{w.ward}</span>{' '}
                      <span className="text-[10px] text-slate-400">({w.building})</span>
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/60 text-center font-bold text-slate-700 whitespace-nowrap">
                      {w.total}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/60 text-center font-bold text-slate-900 whitespace-nowrap">
                      {w.occupied}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/60 text-center font-bold text-emerald-700 whitespace-nowrap">
                      {w.vacant}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-[1px] overflow-hidden">
                          <div
                            className={`h-full ${w.rate >= 90
                              ? 'bg-rose-500'
                              : w.rate >= 70
                                ? 'bg-[#006a4e]'
                                : 'bg-sky-500'
                              }`}
                            style={{ width: `${w.rate}%` }}
                          />
                        </div>
                        <span className="text-[10.5px] font-bold text-slate-700 w-7 text-right">
                          {w.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold border ${w.statusClass}`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bed Inventory Progress Bar */}
          <div className="px-2 py-1.5 border-t border-slate-200 bg-slate-50 space-y-1">
            <div className="flex justify-between text-[10.5px] text-slate-600 font-semibold">
              <span>Bed Capacity</span>
              <span>84 / 120 Beds (70%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-[1px] overflow-hidden flex">
              <div
                className="bg-[#006a4e] h-full"
                style={{ width: '70%' }}
                title="Occupied: 84"
              />
              <div
                className="bg-emerald-400 h-full"
                style={{ width: '27%' }}
                title="Vacant: 32"
              />
              <div
                className="bg-amber-400 h-full"
                style={{ width: '3%' }}
                title="Cleaning: 4"
              />
            </div>
            <div className="flex items-center justify-between text-[9.5px] text-slate-500">
              <span>Occupied: 84</span>
              <span>Available: 32</span>
              <span>Sanitizing: 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Operational Workstations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 min-w-0 w-full overflow-hidden">
        {/* Left: Doctor On-Duty Roster (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-[3px] flex flex-col min-w-0 overflow-hidden shadow-xs">
          <div className="px-2.5 py-1.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#006a4e]" />
              <h3 className="text-[11px] font-bold text-slate-800">
                Doctor On-Duty Roster &amp; Chamber Allocation
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold bg-emerald-50 text-[#006a4e] border border-emerald-200 px-1.5 py-0.2 rounded-[3px]">
                6 Doctors Present
              </span>
              <button
                type="button"
                onClick={() => onSelectModule('duty-roster')}
                className="text-[10px] font-semibold text-[#0094b6] hover:underline cursor-pointer"
              >
                Manage Roster &rarr;
              </button>
            </div>
          </div>

          <div className="overflow-x-auto table-hover-scrollbar flex-1 min-w-0">
            <table className="w-full text-left text-xs border-collapse min-w-[540px]">
              <thead>
                <tr className="bg-[#f1f5f9] text-slate-700 font-bold border-b border-slate-200 text-xs">
                  <th className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">Consultant Doctor</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">Specialty</th>
                  <th className="py-2 px-2 border-r border-slate-200/60 whitespace-nowrap">Chamber</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 whitespace-nowrap">Shift</th>
                  <th className="py-2 px-2 w-14 border-r border-slate-200/60 text-center whitespace-nowrap">Queued</th>
                  <th className="py-2 px-2.5 w-24 text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DOCTOR_ROSTER.map((doc) => (
                  <tr key={doc.doctor} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2.5 border-r border-slate-200/60 font-semibold text-slate-800 whitespace-nowrap">
                      {doc.doctor}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200/60 text-slate-600 whitespace-nowrap">
                      {doc.specialty}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/60 font-semibold text-slate-700 whitespace-nowrap">
                      {doc.chamber}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200/60 text-slate-500 text-[11px] whitespace-nowrap">
                      {doc.shift}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200/60 text-center font-bold text-slate-900 whitespace-nowrap">
                      {doc.queued}
                    </td>
                    <td className="py-2 px-2.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold ${doc.statusClass}`}
                      >
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-2 py-1 border-t border-slate-200 bg-slate-50 text-[10.5px] text-slate-500 flex items-center justify-between">
            <span>Shift Rotation: 02:00 PM (Evening)</span>
            <span className="text-[#006a4e] font-semibold cursor-pointer hover:underline">
              Print Roster
            </span>
          </div>
        </div>

        {/* Right: Hospital Critical Services (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-300 rounded-[3px] flex flex-col min-w-0 overflow-hidden shadow-xs">
          <div className="px-2.5 py-1.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              <h3 className="text-[11px] font-bold text-slate-800">
                Critical Facility &amp; Logistics Control
              </h3>
            </div>

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="p-2 space-y-1.5 flex-1 min-w-0">
            {/* Facility 1: Medical Oxygen */}
            <div className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    Central Oxygen Plant
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Pressure: 145 PSI • Purity: 99.3%
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-emerald-700">94%</span>
                <div className="text-[9.5px] text-slate-400">Nominal</div>
              </div>
            </div>

            {/* Facility 2: Blood Bank */}
            <div
              onClick={() => onSelectModule('blood-bank')}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between gap-2 hover:border-[#0094b6] hover:bg-white cursor-pointer transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    Blood Bank Units
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  A+: <strong className="text-rose-600">4</strong> • B+: 18 • O+: 22 • AB+: 9
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-900">53 Units</span>
                <div className="text-[9.5px] text-amber-700 font-semibold">1 Alert</div>
              </div>
            </div>

            {/* Facility 3: Pharmacy */}
            <div
              onClick={() => onSelectModule('pharmacy')}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between gap-2 hover:border-[#0094b6] hover:bg-white cursor-pointer transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    Central Dispensary
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  142 Orders • 14 Pending
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-900">90% Done</span>
                <div className="text-[9.5px] text-emerald-700 font-semibold">Active</div>
              </div>
            </div>

            {/* Facility 4: Ambulance Fleet */}
            <div
              onClick={() => onSelectModule('ambulance')}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between gap-2 hover:border-[#0094b6] hover:bg-white cursor-pointer transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    Ambulance Fleet
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  AMB-01 (St-1) • AMB-02 (En Route) • AMB-03 (St-2)
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-emerald-700">3 / 4 Ready</span>
                <div className="text-[9.5px] text-slate-400">1 Dispatched</div>
              </div>
            </div>

            {/* Facility 5: Multi-Branch & QR Attendance Quick Row */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => onSelectModule('multi-branch')}
                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between text-left hover:border-[#0094b6] hover:bg-white cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold text-slate-800 truncate">
                    Multi Branch
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">
                    5 Active Campuses
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#006a4e]">100% Sync</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectModule('qr-attendance')}
                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between text-left hover:border-[#0094b6] hover:bg-white cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold text-slate-800 truncate">
                    QR Attendance
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">
                    156 Checked-In
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700">Active</span>
              </button>
            </div>
          </div>

          <div className="px-2 py-1 border-t border-slate-200 bg-slate-50 text-[10.5px] text-slate-500 flex items-center justify-between">
            <span>Telemetry: 100% Signal</span>
            <span className="text-slate-400">CMD-DHN-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};
