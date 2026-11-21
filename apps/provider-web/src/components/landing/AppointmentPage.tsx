import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  KeyRound,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  Video,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  AppointmentBookingContext,
  DEPARTMENT_DOCTORS,
  DIAGNOSTIC_PACKAGES,
  HOSPITAL_BRANCHES,
  LAB_TEST_ITEMS,
  TIME_SLOTS,
  VisitType,
  getNextDateForWeekday,
  getTodayDateString,
  resolveDoctorSchedule,
} from '../../data/appointmentData';

interface AppointmentPageProps {
  initialContext?: AppointmentBookingContext;
  onBack: () => void;
}

type DiagnosticMode = 'package' | 'test';
type PatientMode = 'new' | 'registered';
type GenderOption = 'Male' | 'Female' | 'Other';

const VISIT_OPTIONS: {
  id: Exclude<VisitType, 'diagnostic'>;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
    {
      id: 'opd',
      label: 'In-Person OPD',
      subtitle: 'Hospital chamber visit',
      icon: Building2,
    },
    {
      id: 'tele',
      label: 'Video Consult',
      subtitle: 'Online specialist call',
      icon: Video,
    },
  ];

/**
 * Full-page online appointment booking keeping the 2-column layout (8/4)
 * with minimal clean styling, progressive doctor details, and serial summary.
 */
export const AppointmentPage: React.FC<AppointmentPageProps> = ({
  initialContext,
  onBack,
}) => {
  const departments = Object.keys(DEPARTMENT_DOCTORS);

  const [visitType, setVisitType] = useState<VisitType | ''>('');
  const [branch, setBranch] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [doctorIndex, setDoctorIndex] = useState<number>(-1);
  const [diagnosticMode, setDiagnosticMode] =
    useState<DiagnosticMode>('package');
  const [packageName, setPackageName] = useState<string>('');
  const [testName, setTestName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');

  const [patientMode, setPatientMode] = useState<PatientMode>('new');
  const [patientName, setPatientName] = useState<string>('');
  const [registeredId, setRegisteredId] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<GenderOption | ''>('');
  const [notes, setNotes] = useState<string>('');
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    // Nothing is pre-selected by default; only values explicitly passed
    // in via initialContext (e.g. from a doctor/package card) are applied.
    const nextVisit = initialContext?.visitType ?? '';
    const nextBranch =
      initialContext?.branch &&
        (HOSPITAL_BRANCHES as readonly string[]).includes(initialContext.branch)
        ? initialContext.branch
        : '';
    const nextDepartment =
      initialContext?.department && DEPARTMENT_DOCTORS[initialContext.department]
        ? initialContext.department
        : '';
    const deptDoctors = nextDepartment ? DEPARTMENT_DOCTORS[nextDepartment] : [];
    const matchedIdx = initialContext?.doctorName
      ? deptDoctors.findIndex((d) => d.name === initialContext.doctorName)
      : -1;

    setVisitType(nextVisit);
    setBranch(nextBranch);
    setDepartment(nextDepartment);
    setDoctorIndex(matchedIdx);

    setTestName('');
    setPackageName('');
    if (
      initialContext?.testName &&
      LAB_TEST_ITEMS.some((t) => t.name === initialContext.testName)
    ) {
      setDiagnosticMode('test');
      setTestName(initialContext.testName);
    } else if (
      initialContext?.packageName &&
      DIAGNOSTIC_PACKAGES.some((p) => p.name === initialContext.packageName)
    ) {
      setDiagnosticMode('package');
      setPackageName(initialContext.packageName);
    }

    setDate(initialContext?.date || '');
    setSelectedScheduleDay('');
    setTimeSlot('');
    setFormError('');
    setBookingRef(null);
  }, [initialContext]);

  const doctors = department ? DEPARTMENT_DOCTORS[department] ?? [] : [];
  const selectedDoctor = doctorIndex >= 0 ? doctors[doctorIndex] : undefined;
  const doctorSchedules = useMemo(
    () => (selectedDoctor ? resolveDoctorSchedule(selectedDoctor) : []),
    [selectedDoctor]
  );

  const selectedPackage = DIAGNOSTIC_PACKAGES.find(
    (p) => p.name === packageName
  );
  const selectedTest = LAB_TEST_ITEMS.find((t) => t.name === testName);

  const estimatedFee =
    (visitType === 'diagnostic'
      ? diagnosticMode === 'test'
        ? selectedTest?.price
        : selectedPackage?.price
      : visitType === 'tele'
        ? selectedDoctor?.videoFee ?? selectedDoctor?.fee
        : visitType === 'opd'
          ? selectedDoctor?.fee
          : undefined) ?? '—';

  const diagnosticTitle =
    (diagnosticMode === 'test' ? selectedTest?.name : selectedPackage?.name) ??
    'Not selected';

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    setDoctorIndex(-1);
    setSelectedScheduleDay('');
  };

  const handleSelectScheduleDay = (dayName: string) => {
    setSelectedScheduleDay(dayName);
    setDate(getNextDateForWeekday(dayName));
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitType) {
      setFormError('Please select a consultation type.');
      return;
    }
    if (!date) {
      setFormError('Please select a preferred date.');
      return;
    }
    if (!timeSlot) {
      setFormError('Please select a chamber slot.');
      return;
    }
    setFormError('');
    const serial = Math.floor(1000 + Math.random() * 9000);
    setBookingRef(`APT-${new Date().getFullYear()}-${serial}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 bg-[#f8faf9]">
      {/* Slim Minimal Page Header with Dynamic Theme based on Service */}
      <section
        className={`text-white py-5 sm:py-6 ${
          visitType === 'diagnostic'
            ? 'bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#0ea5e9]'
            : visitType === 'tele'
            ? 'bg-gradient-to-r from-[#00728c] via-[#0094b6] to-[#00b4d8]'
            : 'bg-gradient-to-r from-[#005941] via-[#006a4e] to-[#0094b6]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-emerald-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-cyan-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-white/40">/</span>
            <span>Online Appointment</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Online Doctor Appointment &amp; Checkup Booking
              </h1>
              <p className="text-xs text-emerald-50/85 mt-0.5">
                Instant digital serial confirmation across Dhanmondi, Uttara &amp; Mirpur
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[3px] bg-white/10 text-xs font-semibold self-start sm:self-auto shrink-0">
              <Phone className="w-3.5 h-3.5 text-cyan-200" />
              <span>Hotline: 10678</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {bookingRef ? (
          <div className="max-w-2xl mx-auto bg-white rounded-[3px] border border-slate-200 p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-[3px] bg-[#edf6f2] text-[#006a4e] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-[3px] bg-[#e6f6fa] text-[#007c99] text-xs font-bold">
                Serial Confirmed • {bookingRef}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Your Appointment Is Confirmed
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                SMS serial pass has been sent to{' '}
                <span className="font-semibold text-slate-800">{phone}</span>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[3px] p-4 text-left grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Patient</span>
                <span className="font-semibold text-slate-900">
                  {patientMode === 'registered'
                    ? `Patient ID: ${registeredId}`
                    : `${patientName}${gender || age
                      ? ` (${[gender, age ? `${age} yrs` : '']
                        .filter(Boolean)
                        .join(', ')})`
                      : ''
                    }`}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Branch</span>
                <span className="font-semibold text-slate-900">
                  {branch} Campus
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Date &amp; Slot</span>
                <span className="font-semibold text-[#006a4e]">
                  {date} • {timeSlot}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Payable Fee</span>
                <span className="font-bold text-[#0094b6]">
                  {estimatedFee}
                </span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-200/80">
                <span className="text-slate-500 block">
                  {visitType === 'diagnostic'
                    ? 'Diagnostic Service'
                    : 'Specialist & Chamber'}
                </span>
                <span className="font-semibold text-slate-900">
                  {visitType === 'diagnostic'
                    ? diagnosticTitle
                    : `${selectedDoctor?.name ?? '—'} (${department}) • ${visitType === 'tele'
                      ? 'Video Consult'
                      : selectedDoctor?.room ?? ''
                    }`}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] border border-slate-200 hover:border-[#0094b6] text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#0094b6]" />
                <span>Print Serial</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingRef(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] border border-emerald-200 bg-[#edf6f2] text-[#006a4e] text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Book Another</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Return Home</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Form (8 Cols) */}
            <form
              id="appointment-booking-form"
              onSubmit={handleSubmit}
              className="lg:col-span-8 bg-white rounded-[3px] border border-slate-200/90 p-5 sm:p-6 space-y-5"
            >
              {/* Consultation Type & Branch */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-7">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {VISIT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const active = visitType === option.id;
                      return (
                        <button
                          type="button"
                          key={option.id}
                          onClick={() => {
                            setVisitType(option.id);
                            setFormError('');
                          }}
                          className={`h-12 px-3.5 rounded-[3px] border text-left transition-colors cursor-pointer flex items-center gap-2.5 ${active
                            ? 'bg-[#006a4e] border-[#006a4e] text-white'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-[#0094b6]/50'
                            }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">
                              {option.label}
                            </div>
                            <div
                              className={`text-[10px] truncate ${active ? 'text-emerald-100' : 'text-slate-500'
                                }`}
                            >
                              {option.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hospital Branch
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      aria-label="Hospital Branch"
                      required
                      className="w-full h-12 appearance-none cursor-pointer bg-white border border-slate-200 rounded-[3px] pl-8 pr-9 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                    >
                      <option value="" disabled>
                        Select branch
                      </option>
                      {HOSPITAL_BRANCHES.map((item) => (
                        <option key={item} value={item}>
                          {item} Campus
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Specialist Doctor OR Pre-Selected Diagnostic */}
              {visitType === 'diagnostic' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-800">
                      Diagnostic Service Selection
                    </label>
                    <div className="inline-flex rounded-[3px] bg-slate-100 p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setDiagnosticMode('package')}
                        className={`px-3 py-1 rounded-[3px] font-semibold transition-colors cursor-pointer ${diagnosticMode === 'package'
                          ? 'bg-white text-[#006a4e]'
                          : 'text-slate-600'
                          }`}
                      >
                        Packages
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiagnosticMode('test')}
                        className={`px-3 py-1 rounded-[3px] font-semibold transition-colors cursor-pointer ${diagnosticMode === 'test'
                          ? 'bg-white text-[#006a4e]'
                          : 'text-slate-600'
                          }`}
                      >
                        Lab Tests
                      </button>
                    </div>
                  </div>

                  {diagnosticMode === 'package' ? (
                    <div className="relative">
                      <select
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        required
                        className="w-full h-10 appearance-none cursor-pointer bg-white border border-slate-200 rounded-[3px] pl-3 pr-9 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                      >
                        <option value="" disabled>
                          Select a package
                        </option>
                        {DIAGNOSTIC_PACKAGES.map((pkg) => (
                          <option key={pkg.name} value={pkg.name}>
                            {pkg.name} — {pkg.price} ({pkg.meta})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        required
                        className="w-full h-10 appearance-none cursor-pointer bg-white border border-slate-200 rounded-[3px] pl-3 pr-9 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                      >
                        <option value="" disabled>
                          Select a lab test
                        </option>
                        {LAB_TEST_ITEMS.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name} — {item.price} ({item.category})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Speciality / Department
                      </label>
                      <div className="relative">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={department}
                          onChange={(e) =>
                            handleDepartmentChange(e.target.value)
                          }
                          aria-label="Clinical Department"
                          required
                          className="w-full h-10 appearance-none cursor-pointer bg-white border border-slate-200 rounded-[3px] pl-8 pr-9 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                        >
                          <option value="" disabled>
                            Select department
                          </option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Specialist Doctor
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={doctorIndex}
                          onChange={(e) => {
                            setDoctorIndex(Number(e.target.value));
                            setSelectedScheduleDay('');
                          }}
                          aria-label="Specialist Doctor"
                          required
                          disabled={!department}
                          className="w-full h-10 appearance-none cursor-pointer bg-white border border-slate-200 rounded-[3px] pl-8 pr-9 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                        >
                          <option value={-1} disabled>
                            {department
                              ? 'Select doctor'
                              : 'Select department first'}
                          </option>
                          {doctors.map((doc, idx) => (
                            <option key={doc.name} value={idx}>
                              {doc.name} ({doc.fee})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details & Weekly Schedule */}
                  {selectedDoctor && (
                    <div className="rounded-[3px] border border-slate-200 bg-white overflow-hidden text-xs text-slate-700">
                      <div className="px-4 py-2.5 border-b border-slate-200 bg-[#edf6f2] text-center font-bold text-[#006a4e] text-[13px]">
                        Doctor Details
                      </div>

                      <div className="px-4 py-3 border-b border-slate-200 text-center space-y-1 leading-relaxed">
                        <p>
                          <span className="font-bold text-slate-900">Name :</span>{' '}
                          {selectedDoctor.name}
                        </p>
                        <p>
                          <span className="font-bold text-slate-900">
                            Speciality :
                          </span>{' '}
                          {department}
                        </p>
                        <p>
                          <span className="font-bold text-slate-900">
                            Experience :
                          </span>{' '}
                          {selectedDoctor.experience ?? selectedDoctor.title}
                        </p>
                      </div>

                      <div className="px-4 py-2.5 border-b border-slate-200 text-center">
                        <span className="font-bold text-slate-900">
                          General Appointment Fee :
                        </span>{' '}
                        <span className="font-semibold text-[#006a4e]">
                          {selectedDoctor.fee}
                        </span>
                      </div>

                      <div className="px-4 py-2.5 border-b border-slate-200 text-center">
                        <span className="font-bold text-slate-900">
                          Video Consultancy Fee :
                        </span>{' '}
                        <span className="font-semibold text-[#0094b6]">
                          {selectedDoctor.videoFee ?? selectedDoctor.fee}
                        </span>
                      </div>

                      <div className="px-4 py-2.5 border-b border-slate-200 text-center font-bold text-slate-900">
                        Schedule
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600">
                              <th className="px-4 py-2.5 font-semibold text-left border-b border-slate-200">
                                Appointment Type
                              </th>
                              <th className="px-4 py-2.5 font-semibold text-center border-b border-l border-slate-200">
                                Day
                              </th>
                              <th className="px-4 py-2.5 font-semibold text-center border-b border-l border-slate-200">
                                Schedule Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {doctorSchedules.map((slot, idx) => {
                              const isPicked = selectedScheduleDay === slot.day;
                              const rowBorder =
                                idx < doctorSchedules.length - 1
                                  ? 'border-b border-slate-200'
                                  : '';
                              return (
                                <tr
                                  key={slot.day}
                                  onClick={() =>
                                    handleSelectScheduleDay(slot.day)
                                  }
                                  title="Click to pick this day"
                                  className={`transition-colors cursor-pointer ${isPicked
                                      ? 'bg-[#edf6f2] text-[#006a4e] font-semibold'
                                      : 'hover:bg-slate-50'
                                    }`}
                                >
                                  <td className={`px-4 py-2.5 text-left ${rowBorder}`}>
                                    {slot.type}
                                  </td>
                                  <td
                                    className={`px-4 py-2.5 text-center border-l border-slate-200 ${rowBorder}`}
                                  >
                                    {slot.day}
                                  </td>
                                  <td
                                    className={`px-4 py-2.5 text-center border-l border-slate-200 ${rowBorder}`}
                                  >
                                    {slot.time}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <hr className="border-slate-100" />

              {/* Date & Time Slot */}
              <div className="space-y-3.5">
                {/* Preferred Date - Full Width */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={getTodayDateString()}
                    value={date}
                    onChange={(e) => {
                      const nextDate = e.target.value;
                      setDate(nextDate);
                      setSelectedScheduleDay('');
                      if (!nextDate) setTimeSlot('');
                      setFormError('');
                    }}
                    className="w-full h-10 bg-white border border-slate-200 rounded-[3px] px-3 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>

                {/* Chamber Slot on New Line */}
                {date && (
                  <div className="pt-0.5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Chamber Slot *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const active = timeSlot === slot;
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => {
                              setTimeSlot(slot);
                              setFormError('');
                            }}
                            className={`h-10 inline-flex items-center gap-1.5 px-3 rounded-[3px] border text-xs font-semibold transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#0094b6] border-[#0094b6] text-white'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-[#0094b6]/50'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              {/* Patient Info with Minimal New / Registered Switch */}
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800">
                    Patient Information
                  </label>
                  <div className="inline-flex rounded-[3px] bg-slate-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPatientMode('new')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] font-semibold transition-colors cursor-pointer ${patientMode === 'new'
                        ? 'bg-white text-[#006a4e]'
                        : 'text-slate-600'
                        }`}
                    >
                      <Users className="w-3 h-3" />
                      <span>New Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPatientMode('registered')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] font-semibold transition-colors cursor-pointer ${patientMode === 'registered'
                        ? 'bg-white text-[#006a4e]'
                        : 'text-slate-600'
                        }`}
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Already Registered</span>
                    </button>
                  </div>
                </div>

                {patientMode === 'new' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Md. Rafiqul Islam"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full h-10 bg-white border border-slate-200 rounded-[3px] px-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 bg-white border border-slate-200 rounded-[3px] px-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                      />
                    </div>

                    <div className="sm:col-span-3 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={120}
                          placeholder="35"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full h-10 bg-white border border-slate-200 rounded-[3px] px-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Gender
                        </label>
                        <div className="relative">
                          <select
                            value={gender}
                            onChange={(e) =>
                              setGender(e.target.value as GenderOption)
                            }
                            aria-label="Gender"
                            className="w-full h-10 appearance-none cursor-pointer bg-white border border-slate-200 rounded-[3px] pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                          >
                            <option value="" disabled>
                              Select
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UHID-2026-1042"
                        value={registeredId}
                        onChange={(e) => setRegisteredId(e.target.value)}
                        className="w-full h-10 bg-white border border-slate-200 rounded-[3px] px-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Registered Mobile *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 bg-white border border-slate-200 rounded-[3px] px-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Symptoms or checkup notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-200 rounded-[3px] px-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="pt-1 lg:hidden space-y-2">
                {formError && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 px-5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right Sticky Summary Sidebar (4 Cols — Same Layout) */}
            <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
              <div className="bg-white rounded-[3px] border border-slate-200/90 overflow-hidden">
                <div className="bg-[#006a4e] text-white px-5 py-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-200" />
                  <h3 className="text-sm font-bold">Appointment Summary</h3>
                </div>

                <div className="p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Branch</span>
                    <span className="font-semibold text-slate-900">
                      {branch ? `${branch} Campus` : '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Service Type</span>
                    <span className="font-semibold text-[#0094b6]">
                      {visitType === ''
                        ? '—'
                        : VISIT_OPTIONS.find((item) => item.id === visitType)
                          ?.label ?? 'Tests & Checkup'}
                    </span>
                  </div>

                  {visitType === 'diagnostic' ? (
                    <div className="pb-2 border-b border-slate-100 space-y-0.5">
                      <span className="text-slate-500 block">
                        Selected{' '}
                        {diagnosticMode === 'test' ? 'Lab Test' : 'Package'}
                      </span>
                      <span className="font-bold text-slate-900 block">
                        {diagnosticTitle}
                      </span>
                    </div>
                  ) : (
                    <div className="pb-2 border-b border-slate-100 space-y-0.5">
                      <span className="text-slate-500 block">
                        Specialist{department ? ` (${department})` : ''}
                      </span>
                      <span className="font-bold text-slate-900 block">
                        {selectedDoctor?.name ?? 'Not selected'}
                      </span>
                      {selectedDoctor && (
                        <span className="text-[11px] text-slate-500 block">
                          {visitType === 'tele'
                            ? 'Video Tele-Consult'
                            : selectedDoctor.room}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Date &amp; Slot</span>
                    <span className="font-semibold text-[#006a4e]">
                      {date || timeSlot
                        ? [date, timeSlot].filter(Boolean).join(' • ')
                        : '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-slate-600 font-semibold">
                      Estimated Fee
                    </span>
                    <span className="text-base font-extrabold text-[#006a4e]">
                      {estimatedFee}
                    </span>
                  </div>

                  {formError && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {formError}
                    </p>
                  )}
                  <button
                    type="submit"
                    form="appointment-booking-form"
                    className="w-full py-2.5 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Confirm Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[3px] border border-slate-200/90 p-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-[#006a4e]">
                  <ShieldCheck className="w-4 h-4 text-[#0094b6]" />
                  <span>Serial Guidelines</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Please arrive 15 minutes before your selected chamber slot. Consultation fees can be paid at the reception desk.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default AppointmentPage;
