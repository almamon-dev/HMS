import {
  CalendarCheck,
  Clock,
  Mail,
  Phone,
  Stethoscope,
  Video,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  MY_DOCTORS_LIST,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

interface SpecialistDirectoryItem {
  id: string;
  name: string;
  title: string;
  department: string;
  room: string;
  branch: string;
  days: string;
  timeSlot: string;
  fee: number;
  phone: string;
  email: string;
  telehealth: boolean;
}

const ALL_SPECIALISTS: SpecialistDirectoryItem[] = [
  {
    id: 'doc-tanvir',
    name: 'Prof. Dr. Tanvir Ahmed',
    title: 'Senior Consultant & Professor',
    department: 'Cardiology & Interventional',
    room: 'Room 302, Level 3',
    branch: 'Dhanmondi Main Wing',
    days: 'Sat, Mon, Wed, Thu',
    timeSlot: '04:00 PM - 09:00 PM',
    fee: 50.0,
    phone: '+880 1712-345678',
    email: 'tanvir.cardio@greenhospital.org',
    telehealth: true,
  },
  {
    id: 'doc-farhana',
    name: 'Dr. Farhana Yasmin',
    title: 'Associate Professor & Diabetologist',
    department: 'Endocrinology & Diabetology',
    room: 'Room 205, Level 2',
    branch: 'Dhanmondi Main Wing',
    days: 'Sun, Tue, Thu',
    timeSlot: '05:00 PM - 09:30 PM',
    fee: 35.0,
    phone: '+880 1715-998877',
    email: 'farhana.diab@greenhospital.org',
    telehealth: true,
  },
  {
    id: 'doc-mahmud',
    name: 'Dr. Mahmudul Hasan',
    title: 'Consultant Physician',
    department: 'Internal Medicine',
    room: 'Room 308, Level 3',
    branch: 'Dhanmondi Main Wing',
    days: 'Daily except Friday',
    timeSlot: '10:00 AM - 02:00 PM',
    fee: 40.0,
    phone: '+880 1819-556677',
    email: 'mahmud.med@greenhospital.org',
    telehealth: false,
  },
  {
    id: 'doc-sadia',
    name: 'Dr. Sadia Afrin',
    title: 'Assistant Professor & Neurologist',
    department: 'Neurology & Stroke Center',
    room: 'Room 410, Level 4',
    branch: 'Dhanmondi Main Wing',
    days: 'Mon, Wed, Fri',
    timeSlot: '03:00 PM - 07:00 PM',
    fee: 45.0,
    phone: '+880 1720-112233',
    email: 'sadia.neuro@greenhospital.org',
    telehealth: true,
  },
  {
    id: 'doc-khalid',
    name: 'Prof. Dr. Khalid Bin Salam',
    title: 'Chief of Orthopedic Surgery',
    department: 'Orthopedic & Joint Replacement',
    room: 'Room 501, Level 5',
    branch: 'Uttara Satellite Wing',
    days: 'Sat, Sun, Tue',
    timeSlot: '04:00 PM - 08:00 PM',
    fee: 55.0,
    phone: '+880 1733-445566',
    email: 'khalid.ortho@greenhospital.org',
    telehealth: false,
  },
];

interface PatientDoctorsViewProps {
  mode?: 'find' | 'my';
  onBookDoctor?: (doctorName: string) => void;
}

export const PatientDoctorsView: React.FC<PatientDoctorsViewProps> = ({
  mode = 'find',
  onBookDoctor,
}) => {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistDirectoryItem | null>(null);

  const displayList = useMemo(() => {
    let list = ALL_SPECIALISTS;
    if (mode === 'my') {
      const myDoctorNames = MY_DOCTORS_LIST.map((d) => d.name);
      list = list.filter((d) => myDoctorNames.includes(d.name));
    }
    if (departmentFilter !== 'All') {
      list = list.filter((d) => d.department.includes(departmentFilter));
    }
    return list;
  }, [mode, departmentFilter]);

  const columns: DataTableColumn<SpecialistDirectoryItem>[] = [
    {
      key: 'name',
      header: 'Specialist Name',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSpecialist(r);
          }}
          className="font-bold text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
        >
          {r.name}
          <span className="block text-[10px] text-slate-500 font-normal">{r.title}</span>
        </button>
      ),
    },
    {
      key: 'department',
      header: 'Department / Specialty',
      sortable: true,
      sortValue: (r) => r.department,
      render: (r) => (
        <span className="font-semibold text-slate-900 text-xs">{r.department}</span>
      ),
    },
    {
      key: 'room',
      header: 'Chamber / Branch',
      render: (r) => (
        <div>
          <div className="font-medium text-slate-800 text-xs">{r.room}</div>
          <div className="text-[10px] text-slate-500">{r.branch}</div>
        </div>
      ),
    },
    {
      key: 'days',
      header: 'OPD Schedule & Timing',
      render: (r) => (
        <div>
          <div className="text-slate-800 font-medium text-xs">{r.days}</div>
          <div className="text-[10px] text-[#006a4e] font-semibold flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {r.timeSlot}
          </div>
        </div>
      ),
    },
    {
      key: 'fee',
      header: 'Consultation Fee',
      sortable: true,
      sortValue: (r) => r.fee,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ${r.fee.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              if (onBookDoctor) {
                onBookDoctor(r.name);
              } else {
                alert(`Redirecting to booking appointment with ${r.name}`);
              }
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#006a4e] hover:bg-[#00523d] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-xs"
          >
            <CalendarCheck className="w-3 h-3" />
            Book
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <SummaryCardGrid>
        <SummaryCard
          title={mode === 'my' ? 'Primary Care Team' : 'Hospital Specialists'}
          icon={Stethoscope}
          iconColor="text-[#006a4e]"
          value={mode === 'my' ? '3 Doctors' : '38+ Consultants'}
          subtitle={mode === 'my' ? 'Managing regular health' : 'All clinical faculties'}
        />
        <SummaryCard
          title="Clinical Specialties"
          icon={Stethoscope}
          iconColor="text-cyan-600"
          value="16 Centers"
          valueColor="text-cyan-700"
          subtitle="Super-specialized OPDs"
        />
        <SummaryCard
          title="Telehealth Video OPD"
          icon={Video}
          iconColor="text-emerald-600"
          value="24 Online Doctors"
          valueColor="text-emerald-700"
          subtitle="Instant virtual consultations"
        />
        <SummaryCard
          title="OPD Chamber Hours"
          icon={Clock}
          iconColor="text-[#006a4e]"
          value="8 AM - 10 PM"
          valueColor="text-[#006a4e]"
          subtitle="Morning & Evening sessions"
        />
      </SummaryCardGrid>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
        <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Filter Department:</span>
            <DropdownSelect
              options={[
                { value: 'All', label: 'All Departments' },
                { value: 'Cardiology', label: 'Cardiology' },
                { value: 'Endocrinology', label: 'Endocrinology' },
                { value: 'Internal Medicine', label: 'Internal Medicine' },
                { value: 'Neurology', label: 'Neurology' },
                { value: 'Orthopedic', label: 'Orthopedic Surgery' },
              ]}
              value={departmentFilter}
              onChange={setDepartmentFilter}
              className="w-48"
            />
          </div>

          <span className="text-[11px] text-slate-500">
            Showing {displayList.length} specialists in {mode === 'my' ? 'My Doctors' : 'Doctor Directory'}
          </span>
        </div>

        <DataTable<SpecialistDirectoryItem>
          columns={columns}
          data={displayList}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search doctors by name, specialty or qualification..."
          searchFilter={(item, query) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.department.toLowerCase().includes(query.toLowerCase()) ||
            item.title.toLowerCase().includes(query.toLowerCase())
          }
          defaultSort={{ key: 'name', order: 'asc' }}
          showSerial={true}
          emptyMessage="No doctors found matching criteria."
          onRowClick={(item) => setSelectedSpecialist(item)}
        />
      </div>

      {/* Doctor Quick View Card */}
      {selectedSpecialist && (
        <div className="bg-white border border-[#006a4e]/25 rounded-[3px] p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#006a4e]" />
              <h4 className="text-xs font-bold text-slate-900">
                Specialist Profile: {selectedSpecialist.name}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSpecialist(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500 block text-[10px]">Academic Title &amp; Rank:</span>
                <span className="font-bold text-slate-900">{selectedSpecialist.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Specialization:</span>
                <span className="font-semibold text-slate-800">{selectedSpecialist.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Consultation Fee:</span>
                <span className="font-extrabold text-[#006a4e]">${selectedSpecialist.fee.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500 block text-[10px]">Chamber Location:</span>
                <span className="font-semibold text-slate-800">{selectedSpecialist.room} ({selectedSpecialist.branch})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">OPD Schedule:</span>
                <span className="font-semibold text-slate-800">{selectedSpecialist.days} ({selectedSpecialist.timeSlot})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Telehealth Available:</span>
                <span className="font-semibold text-emerald-700">
                  {selectedSpecialist.telehealth ? 'Yes · Online Video Chamber Active' : 'No · In-Person OPD Only'}
                </span>
              </div>
            </div>

            <div className="space-y-2 flex flex-col justify-between">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3 h-3 text-[#006a4e]" />
                  <span>{selectedSpecialist.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 truncate">
                  <Mail className="w-3 h-3 text-[#006a4e]" />
                  <span>{selectedSpecialist.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onBookDoctor) {
                    onBookDoctor(selectedSpecialist.name);
                  } else {
                    alert(`Booking consultation with ${selectedSpecialist.name}`);
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                Book Consultation Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
