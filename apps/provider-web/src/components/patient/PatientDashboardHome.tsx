import {
  Activity,
  CalendarCheck,
  Download,
  ExternalLink,
  FlaskConical,
  Pill,
  Receipt,
  Video,
} from 'lucide-react';
import React from 'react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import {
  PATIENT_APPOINTMENTS,
  PATIENT_LAB_REPORTS,
  PATIENT_PRESCRIPTIONS,
  PATIENT_VITALS,
} from '../../data/patientPortalData';

interface PatientDashboardHomeProps {
  onNavigate: (module: string) => void;
}

export const PatientDashboardHome: React.FC<PatientDashboardHomeProps> = ({
  onNavigate,
}) => {
  const nextAppointment = PATIENT_APPOINTMENTS.find((a) => a.status === 'Confirmed');
  const activePrescription = PATIENT_PRESCRIPTIONS[0];
  const recentVitals = PATIENT_VITALS[0];

  return (
    <div className="space-y-2">
      {/* 4 Primary KPI Cards matching PatientDirectory format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Next Appointment"
          icon={CalendarCheck}
          iconColor="text-[#006a4e]"
          value="Today 04:00 PM"
          subtitle="Prof. Dr. Tanvir Ahmed · Token #06"
        />
        <SummaryCard
          title="Active Prescriptions"
          icon={Pill}
          iconColor="text-[#006a4e]"
          value={`${PATIENT_PRESCRIPTIONS.length} Active E-Rx`}
          valueColor="text-[#006a4e]"
          subtitle="5 regular prescribed medicines"
        />
        <SummaryCard
          title="Diagnostic Reports"
          icon={FlaskConical}
          iconColor="text-amber-600"
          value={`${PATIENT_LAB_REPORTS.filter((r) => r.status === 'Ready').length} Ready Online`}
          valueColor="text-amber-600"
          subtitle="CBC & Lipid profile published"
        />
        <SummaryCard
          title="Hospital Billing Due"
          icon={Receipt}
          iconColor="text-[#006a4e]"
          value="$0.00"
          subtitle="All outpatient invoices cleared"
        />
      </SummaryCardGrid>

      {/* Upcoming Consultation Banner Card */}
      {nextAppointment && (
        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#edf6f2] text-[#006a4e] flex items-center justify-center font-bold text-base border border-[#006a4e]/20 shrink-0">
              {nextAppointment.tokenNo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-[#006a4e] animate-ping" />
                <h3 className="text-xs font-bold text-slate-900">
                  Confirmed: {nextAppointment.doctorName}
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-semibold border border-[#006a4e]/20">
                  {nextAppointment.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {nextAppointment.department} · {nextAppointment.room} · {nextAppointment.branch} · {nextAppointment.slotTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('appointments')}
              className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>View Appointment Slip</span>
            </button>

            {nextAppointment.teleconsultLink && (
              <button
                type="button"
                onClick={() => window.open(nextAppointment.teleconsultLink, '_blank')}
                className="px-3 py-1.5 rounded-[3px] bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Video Room</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Two Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Left: Active Prescriptions */}
        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#006a4e]" />
              <h3 className="text-xs font-bold text-slate-800">
                Active Medicines &amp; Digital Prescriptions
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('prescriptions')}
              className="text-[11px] font-semibold text-[#006a4e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            {activePrescription.medicines.map((med, idx) => (
              <div
                key={idx}
                className="p-2 rounded-[3px] bg-slate-50/70 border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">
                    {med.name} ({med.dosage})
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Dosage: {med.frequency} · {med.instruction} · {med.duration}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-[#006a4e] border border-emerald-200 font-semibold shrink-0">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Latest Diagnostic Lab Reports */}
        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#006a4e]" />
              <h3 className="text-xs font-bold text-slate-800">
                Diagnostic Lab &amp; Imaging Reports
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('lab-reports')}
              className="text-[11px] font-semibold text-[#006a4e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Reports</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            {PATIENT_LAB_REPORTS.map((rep) => (
              <div
                key={rep.id}
                className="p-2 rounded-[3px] bg-slate-50/70 border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 truncate">{rep.testName}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${rep.flag === 'Normal'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                    >
                      {rep.flag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{rep.resultSummary}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('lab-reports')}
                  className="px-2 py-1 rounded-[3px] bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[10.5px] shrink-0 cursor-pointer"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals & Biomarker Snapshot Row */}
      <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#006a4e]" />
            <h3 className="text-xs font-bold text-slate-800">
              Latest Recorded Vital Signs (Logged {recentVitals.date})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('vitals')}
            className="text-[11px] font-semibold text-[#006a4e] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Vitals History</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Blood Pressure</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">{recentVitals.bp}</span>
            <span className="text-[9px] text-amber-700 font-semibold">Elevated Stage 1</span>
          </div>

          <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Heart Rate</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">{recentVitals.heartRate} bpm</span>
            <span className="text-[9px] text-emerald-700 font-semibold">Normal Sinus</span>
          </div>

          <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Blood Glucose</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">{recentVitals.glucose.split(' ')[0]} mmol/L</span>
            <span className="text-[9px] text-emerald-700 font-semibold">Controlled</span>
          </div>

          <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">SpO2 (Oxygen)</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">{recentVitals.spo2}%</span>
            <span className="text-[9px] text-emerald-700 font-semibold">Optimal</span>
          </div>

          <div className="p-2 rounded-[3px] bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Weight</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">{recentVitals.weight} kg</span>
            <span className="text-[9px] text-slate-500 font-semibold">BMI: 26.8</span>
          </div>
        </div>
      </div>

      {/* Quick Service Hub matching Superadmin / Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onNavigate('appointments')}
          className="p-2.5 rounded-md bg-white border border-slate-200/80 shadow-2xs hover:bg-[#edf6f2] hover:border-[#006a4e]/30 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#006a4e]">
              Book Appointment
            </span>
            <CalendarCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006a4e]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Specialist slots &amp; OPD tokens</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('teleconsultation')}
          className="p-2.5 rounded-md bg-white border border-slate-200/80 shadow-2xs hover:bg-[#edf6f2] hover:border-[#006a4e]/30 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#006a4e]">
              Video Teleconsult
            </span>
            <Video className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006a4e]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Consult doctor from home</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('billing')}
          className="p-2.5 rounded-md bg-white border border-slate-200/80 shadow-2xs hover:bg-[#edf6f2] hover:border-[#006a4e]/30 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#006a4e]">
              Pay Invoices
            </span>
            <Receipt className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006a4e]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Online receipts &amp; payments</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('download-center')}
          className="p-2.5 rounded-md bg-white border border-slate-200/80 shadow-2xs hover:bg-[#edf6f2] hover:border-[#006a4e]/30 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#006a4e]">
              Download Center
            </span>
            <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006a4e]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Discharge sheets &amp; reports</p>
        </button>
      </div>
    </div>
  );
};
