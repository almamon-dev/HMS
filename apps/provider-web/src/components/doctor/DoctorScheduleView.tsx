import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_SCHEDULES, DoctorScheduleSlot } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorScheduleView: React.FC = () => {
  const [schedules, setSchedules] = useState<DoctorScheduleSlot[]>(DOCTOR_SCHEDULES);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Slot Form
  const [day, setDay] = useState('Monday');
  const [branch, setBranch] = useState('Dhanmondi Main Wing');
  const [room, setRoom] = useState('Room 302, Level 3');
  const [session, setSession] = useState<DoctorScheduleSlot['session']>('Evening Chamber');
  const [timeRange, setTimeRange] = useState('05:00 PM - 09:00 PM');
  const [maxPatients, setMaxPatients] = useState('20');

  // 4 Superadmin-Styled KPI Cards
  const stats = useMemo(() => {
    const totalSlots = schedules.length;
    const activeSlots = schedules.filter((s) => s.status === 'Active').length;
    const totalCapacity = schedules.reduce((acc, s) => acc + s.maxPatients, 0);
    const totalBooked = schedules.reduce((acc, s) => acc + s.bookedCount, 0);
    return { totalSlots, activeSlots, totalCapacity, totalBooked };
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((slot) => {
      const matchesStatus = statusFilter === 'All' || slot.status === statusFilter;
      return matchesStatus;
    });
  }, [schedules, statusFilter]);

  const handleToggleStatus = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus: DoctorScheduleSlot['status'] =
            s.status === 'Active' ? 'On Leave' : 'Active';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: DoctorScheduleSlot = {
      id: `sch-${Date.now()}`,
      day,
      branch,
      room,
      session,
      timeRange,
      slotDuration: '15 mins',
      maxPatients: Number(maxPatients) || 20,
      bookedCount: 0,
      status: 'Active',
    };

    setSchedules([...schedules, newSlot]);
    setShowAddModal(false);
  };

  const columns: DataTableColumn<DoctorScheduleSlot>[] = [
    {
      key: 'day',
      header: 'Day & Session',
      sortable: true,
      sortValue: (r) => r.day,
      render: (r) => (
        <div>
          <div className="font-extrabold text-slate-900 leading-tight">{r.day}</div>
          <div className="text-[11px] font-semibold text-[#006a4e]">{r.session}</div>
        </div>
      ),
    },
    {
      key: 'branch',
      header: 'Hospital Branch Campus',
      sortable: true,
      sortValue: (r) => r.branch,
      render: (r) => (
        <span className="font-semibold text-slate-800">
          {r.branch}
        </span>
      ),
    },
    {
      key: 'room',
      header: 'Chamber Room',
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap">
          {r.room}
        </span>
      ),
    },
    {
      key: 'timeRange',
      header: 'Duty Hours',
      sortable: true,
      sortValue: (r) => r.timeRange,
      render: (r) => (
        <span className="font-bold text-slate-800 whitespace-nowrap">
          {r.timeRange}
        </span>
      ),
    },
    {
      key: 'slotDuration',
      header: 'Slot Duration',
      render: (r) => (
        <span className="text-slate-500 whitespace-nowrap">
          {r.slotDuration}
        </span>
      ),
    },
    {
      key: 'bookedCount',
      header: 'Patient Load / Capacity',
      sortable: true,
      sortValue: (r) => r.bookedCount,
      render: (r) => (
        <div className="whitespace-nowrap">
          <span className="font-extrabold text-slate-900">{r.bookedCount}</span>
          <span className="text-slate-400"> / {r.maxPatients} patients</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.status === 'Active'
            ? 'bg-emerald-100 text-emerald-800'
            : r.status === 'Full'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
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
        <div className="flex items-center justify-end whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleToggleStatus(r.id)}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${r.status === 'Active'
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
          >
            {r.status === 'Active' ? 'Mark Leave' : 'Mark Active'}
          </button>
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={statusFilter}
      onChange={(val) => setStatusFilter(val)}
      width="w-40"
      options={[
        { label: 'All Statuses', value: 'All' },
        { label: 'Active', value: 'Active' },
        { label: 'Full', value: 'Full' },
        { label: 'On Leave', value: 'On Leave' },
      ]}
    />
  );

  const toolbarActions = (
    <button
      type="button"
      onClick={() => setShowAddModal(true)}
      className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Add Chamber Slot</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Weekly Chamber Slots"
          icon={Calendar}
          iconColor="text-[#006a4e]"
          value={`${stats.totalSlots} Slots`}
          subtitle="Across Dhanmondi & Uttara"
        />
        <SummaryCard
          title="Active Sessions"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={`${stats.activeSlots} Available`}
          valueColor="text-emerald-700"
          subtitle="Open for patient booking"
        />
        <SummaryCard
          title="Total Patient Capacity"
          icon={Users}
          iconColor="text-cyan-600"
          value={`${stats.totalCapacity} Slots`}
          valueColor="text-cyan-700"
          subtitle="Maximum weekly patient capacity"
        />
        <SummaryCard
          title="Current Bookings"
          icon={Clock}
          iconColor="text-amber-600"
          value={`${stats.totalBooked} Booked`}
          valueColor="text-amber-700"
          subtitle="Reserved consultation tokens"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorScheduleSlot>
        data={filteredSchedules}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by day, branch, session or room..."
        searchFilter={(item, query) =>
          item.day.toLowerCase().includes(query.toLowerCase()) ||
          item.branch.toLowerCase().includes(query.toLowerCase()) ||
          item.session.toLowerCase().includes(query.toLowerCase()) ||
          item.room.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No timetable slots found for the selected filter."
        showSerial={true}
      />

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Add Doctor Chamber Timetable Slot
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Day of Week
                  </label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Chamber Session
                  </label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Morning OPD">Morning OPD</option>
                    <option value="Evening Chamber">Evening Chamber</option>
                    <option value="IPD Rounds">IPD Rounds</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Hospital Branch Campus
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                >
                  <option value="Dhanmondi Main Wing">Dhanmondi Main Wing</option>
                  <option value="Uttara Branch Campus">Uttara Branch Campus</option>
                  <option value="Mirpur Wing">Mirpur Wing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Chamber Room No.
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Room 302, Level 3"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Max Patient Quota
                  </label>
                  <input
                    type="number"
                    value={maxPatients}
                    onChange={(e) => setMaxPatients(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Time Range
                </label>
                <input
                  type="text"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  placeholder="05:00 PM - 09:00 PM"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
