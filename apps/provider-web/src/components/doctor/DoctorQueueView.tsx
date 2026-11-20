import {
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  FlaskConical,
  RotateCcw,
  Stethoscope,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_LIVE_QUEUE, DoctorQueueItem } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

interface DoctorQueueViewProps {
  onStartConsultation: (queueItem: DoctorQueueItem) => void;
}

export const DoctorQueueView: React.FC<DoctorQueueViewProps> = ({
  onStartConsultation,
}) => {
  const [queue, setQueue] = useState<DoctorQueueItem[]>(DOCTOR_LIVE_QUEUE);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQueueItem, setSelectedQueueItem] = useState<DoctorQueueItem | null>(null);
  const [announcementMsg, setAnnouncementMsg] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = queue.length;
    const inChamber = queue.filter((q) => q.status === 'In Chamber').length;
    const waiting = queue.filter((q) => q.status === 'Waiting').length;
    const diagnostics = queue.filter((q) => q.status === 'In Diagnostics').length;
    return { total, inChamber, waiting, diagnostics };
  }, [queue]);

  const currentInChamber = useMemo(
    () => queue.find((q) => q.status === 'In Chamber'),
    [queue]
  );

  const waitingList = useMemo(
    () => queue.filter((q) => q.status === 'Waiting'),
    [queue]
  );

  const handleCallNext = () => {
    const nextWaiting = waitingList[0];
    if (!nextWaiting) {
      setAnnouncementMsg('No more patients waiting in the queue.');
      setTimeout(() => setAnnouncementMsg(null), 3000);
      return;
    }

    setQueue((prev) =>
      prev.map((item) => {
        if (item.status === 'In Chamber') {
          return { ...item, status: 'Completed' };
        }
        if (item.id === nextWaiting.id) {
          return { ...item, status: 'In Chamber' };
        }
        return item;
      })
    );

    setAnnouncementMsg(
      `Calling Token ${nextWaiting.tokenNo} - ${nextWaiting.patientName} (${nextWaiting.uhid}) to Doctor Chamber Room 302.`
    );
    setTimeout(() => setAnnouncementMsg(null), 5000);
  };

  const handleUpdateStatus = (id: string, newStatus: DoctorQueueItem['status']) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filteredQueue = useMemo(() => {
    if (statusFilter === 'all') return queue;
    return queue.filter((q) => q.status.toLowerCase().replace(/\s+/g, '-') === statusFilter);
  }, [queue, statusFilter]);

  const columns: DataTableColumn<DoctorQueueItem>[] = [
    {
      key: 'tokenNo',
      header: 'Token',
      sortable: true,
      sortValue: (r) => r.tokenNo,
      render: (r) => (
        <span className="font-extrabold text-[#006a4e]">
          {r.tokenNo}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name & UHID',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedQueueItem(r);
            }}
            className="text-slate-900 font-bold hover:text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.patientName}
          </button>
          <span className="text-[10px] text-slate-500">
            {r.uhid} • {r.age} yrs • {r.gender}
          </span>
        </div>
      ),
    },
    {
      key: 'visitType',
      header: 'Visit Type',
      sortable: true,
      sortValue: (r) => r.visitType,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border whitespace-nowrap ${r.visitType === 'Emergency'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : r.visitType === 'Telehealth'
              ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
        >
          {r.visitType}
        </span>
      ),
    },
    {
      key: 'arrivalTime',
      header: 'Arrival Time',
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap text-xs">
          {r.arrivalTime}
        </span>
      ),
    },
    {
      key: 'waitTime',
      header: 'Waiting Time',
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap text-xs font-mono">
          {r.waitTime}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (r) => (
        <span
          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${r.priority === 'Emergency'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : r.priority === 'Senior Citizen'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
        >
          {r.priority}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Queue Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'In Chamber') cls = 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/30 font-bold';
        else if (r.status === 'Waiting') cls = 'bg-amber-50 text-amber-700 border-amber-200';
        else if (r.status === 'In Diagnostics') cls = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        else if (r.status === 'Completed') cls = 'bg-emerald-50 text-emerald-700 border-emerald-200';

        return (
          <span className={`px-2 py-0.5 rounded-[3px] text-[11px] border whitespace-nowrap ${cls}`}>
            {r.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          {r.status === 'Waiting' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(r.id, 'In Chamber')}
              className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Call In
            </button>
          )}

          {r.status === 'In Chamber' && (
            <>
              <button
                type="button"
                onClick={() => onStartConsultation(r)}
                className="px-2 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3 h-3" />
                <span>Consult</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(r.id, 'In Diagnostics')}
                className="px-2 py-1 rounded-[3px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Send to Lab/Diagnostics"
              >
                <FlaskConical className="w-3 h-3" />
                <span>Diagnostics</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(r.id, 'Completed')}
                className="px-2 py-1 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </>
          )}

          {r.status === 'In Diagnostics' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(r.id, 'In Chamber')}
              className="px-2 py-1 rounded-[3px] bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resume</span>
            </button>
          )}

          {r.status === 'Completed' && (
            <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
              <span>Finished</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setSelectedQueueItem(r)}
            className="p-1 rounded-[3px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
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
        { label: 'All Statuses', value: 'all' },
        { label: 'Inside Chamber', value: 'in-chamber' },
        { label: 'Waiting Queue', value: 'waiting' },
        { label: 'In Diagnostics', value: 'in-diagnostics' },
        { label: 'Completed', value: 'completed' },
      ]}
    />
  );

  const toolbarActions = (
    <button
      type="button"
      onClick={handleCallNext}
      className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
    >
      <Volume2 className="w-3.5 h-3.5" />
      <span>Call Next Patient</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total in Queue"
          icon={Users}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Patients`}
          subtitle="Today's registered chamber queue"
        />
        <SummaryCard
          title="Inside Chamber"
          icon={Stethoscope}
          iconColor="text-[#006a4e]"
          value={currentInChamber ? currentInChamber.tokenNo : 'None'}
          valueColor="text-[#006a4e]"
          subtitle={currentInChamber ? currentInChamber.patientName : 'Chamber is ready'}
        />
        <SummaryCard
          title="Waiting Outside"
          icon={Clock}
          iconColor="text-amber-600"
          value={`${stats.waiting} Patients`}
          valueColor="text-amber-700"
          subtitle="Estimated wait ~15 min"
        />
        <SummaryCard
          title="In Diagnostics"
          icon={FlaskConical}
          iconColor="text-indigo-600"
          value={`${stats.diagnostics} Patients`}
          valueColor="text-indigo-700"
          subtitle="Awaiting lab / ECG re-entry"
        />
      </SummaryCardGrid>

      {/* Audio Announcement Alert Banner */}
      {announcementMsg && (
        <div className="bg-[#006a4e] text-white px-3 py-2 rounded-[3px] text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 animate-bounce shrink-0" />
            <span>{announcementMsg}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-[3px]">Announced on TV Display</span>
        </div>
      )}

      {/* Chamber Status Bar */}
      <div className="bg-white p-2.5 rounded-[3px] border border-slate-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[3px] bg-[#edf6f2] text-[#006a4e] flex items-center justify-center font-bold text-sm border border-[#006a4e]/20 shrink-0">
            {currentInChamber?.tokenNo || '--'}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              {currentInChamber
                ? `Currently Inside: ${currentInChamber.patientName} (${currentInChamber.uhid})`
                : 'Doctor Chamber Room 302 is Ready'}
            </div>
            <div className="text-[11px] text-slate-500">
              {currentInChamber
                ? `${currentInChamber.age} yrs • ${currentInChamber.gender} • Category: ${currentInChamber.visitType} • Wait Time: ${currentInChamber.waitTime}`
                : 'Next token in waiting line will be called upon clicking "Call Next Patient"'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentInChamber && (
            <button
              type="button"
              onClick={() => onStartConsultation(currentInChamber)}
              className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Start Consultation</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCallNext}
            className="px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#006a4e]" />
            <span>Call Next</span>
          </button>
        </div>
      </div>

      {/* Selected Queue Item Quick View Card matching Appointment format */}
      {selectedQueueItem && (
        <div className="bg-white border border-[#006a4e]/25 rounded-md p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#edf6f2] text-[#006a4e] font-bold text-sm flex items-center justify-center shrink-0">
                {selectedQueueItem.tokenNo}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedQueueItem.patientName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {selectedQueueItem.uhid}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedQueueItem.age} yrs • {selectedQueueItem.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category: <span className="font-medium text-slate-800">{selectedQueueItem.visitType}</span> • Arrived at: {selectedQueueItem.arrivalTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStartConsultation(selectedQueueItem)}
                className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Consult</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedQueueItem(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Queue Priority</p>
                <p className="font-medium text-slate-800">{selectedQueueItem.priority}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Wait Duration</p>
                <p className="font-medium text-slate-800 font-mono">{selectedQueueItem.waitTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Queue Status</p>
                <p className="font-semibold text-slate-800">{selectedQueueItem.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Action State</p>
                <p className="font-semibold text-emerald-700">Verified in Hall</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorQueueItem>
        data={filteredQueue}
        columns={columns}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search token, patient name, UHID, or visit type..."
        searchFilter={(r, q) => {
          const lq = q.toLowerCase();
          return (
            r.tokenNo.toLowerCase().includes(lq) ||
            r.patientName.toLowerCase().includes(lq) ||
            r.uhid.toLowerCase().includes(lq) ||
            r.visitType.toLowerCase().includes(lq)
          );
        }}
        showSerial={true}
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No patients found in live chamber queue."
        onRowClick={(item) => setSelectedQueueItem(item)}
      />
    </div>
  );
};
