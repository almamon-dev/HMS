import {
  Calendar,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  Search,
  Stethoscope,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  AppointmentBookingContext,
  DEPARTMENT_DOCTORS,
} from '../../data/appointmentData';

interface QuickServiceHubProps {
  onOpenAppointment: (context?: AppointmentBookingContext) => void;
}

type ServiceTab = 'appointment' | 'doctor' | 'prices' | 'checkup';

export const QuickServiceHub: React.FC<QuickServiceHubProps> = ({
  onOpenAppointment,
}) => {
  const departments = Object.keys(DEPARTMENT_DOCTORS);

  const [activeTab, setActiveTab] = useState<ServiceTab>('appointment');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Available doctors filtered by selected department
  const availableDoctors = useMemo(() => {
    if (selectedDept && DEPARTMENT_DOCTORS[selectedDept]) {
      return DEPARTMENT_DOCTORS[selectedDept];
    }
    return Object.values(DEPARTMENT_DOCTORS).flat();
  }, [selectedDept]);

  const handleSearch = () => {
    if (activeTab === 'prices') {
      onOpenAppointment({
        visitType: 'diagnostic',
        department: selectedDept || undefined,
      });
    } else if (activeTab === 'checkup') {
      onOpenAppointment({
        visitType: 'diagnostic',
        packageName: 'Executive Health Checkup Package',
      });
    } else {
      onOpenAppointment({
        visitType: 'opd',
        department: selectedDept || undefined,
        doctorName: selectedDoctor || undefined,
        date: selectedDate || undefined,
      });
    }
  };

  return (
    <section
      id="find-doctor"
      aria-label="Quick Doctor Finder and Booking Hub"
      className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 lg:-mt-12 pb-10"
    >
      <div className="bg-white rounded-[6px] sm:rounded-lg shadow-xl border border-slate-200/90 p-2 sm:p-2.5">
        <div className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-2.5 sm:gap-3">
          {/* Left Service Tabs (Pills) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Tab 1: Book Appointment */}
            <button
              type="button"
              onClick={() => setActiveTab('appointment')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 cursor-pointer ${
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
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 cursor-pointer ${
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
              onClick={() => setActiveTab('prices')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 cursor-pointer ${
                activeTab === 'prices'
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
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[4px] text-xs sm:text-[13px] font-bold flex items-center gap-2 cursor-pointer ${
                activeTab === 'checkup'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Health Checkup</span>
            </button>
          </div>

          {/* Vertical Divider */}
          <div className="hidden xl:block h-9 w-px bg-slate-200" />

          {/* Right Form Dropdowns & Search Button (Static, fixed width, never jumps) */}
          <div className="w-full xl:w-auto flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
            {/* Department Dropdown */}
            <div className="w-full sm:w-auto flex-1 min-w-[140px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200/90 hover:border-slate-300">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                Department
              </label>
              <div className="relative flex items-center">
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedDoctor('');
                  }}
                  className="w-full appearance-none bg-transparent pr-5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
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
                  className="w-full appearance-none bg-transparent pr-5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
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
              onClick={handleSearch}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-[4px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickServiceHub;
