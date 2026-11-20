import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Eye,
  Info,
  ShieldAlert,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  DOCTOR_NOTIFICATIONS,
  DoctorNotificationItem,
} from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

export const DoctorNotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<DoctorNotificationItem[]>(DOCTOR_NOTIFICATIONS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [selectedNotif, setSelectedNotif] = useState<DoctorNotificationItem | null>(null);

  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => n.unread).length;
    const critical = notifications.filter((n) => n.type === 'critical').length;
    const info = notifications.filter((n) => n.type === 'info').length;
    return { total, unread, critical, info };
  }, [notifications]);

  const filteredNotifs = useMemo(() => {
    if (statusFilter === 'unread') return notifications.filter((n) => n.unread);
    if (statusFilter === 'critical') return notifications.filter((n) => n.type === 'critical');
    return notifications;
  }, [notifications, statusFilter]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const columns: DataTableColumn<DoctorNotificationItem>[] = [
    {
      key: 'type',
      header: 'Severity',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.type,
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border ${r.type === 'critical'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : r.type === 'alert'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
        >
          {r.type === 'critical' && <ShieldAlert className="w-3 h-3 text-rose-600" />}
          {r.type === 'alert' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
          {r.type === 'info' && <Info className="w-3 h-3 text-slate-500" />}
          <span className="capitalize">{r.type}</span>
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      sortValue: (r) => r.timestamp,
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap text-xs font-medium">
          {r.timestamp}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Subject & Clinical Source',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            {r.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e]" />}
            <span>{r.title}</span>
          </div>
          <div className="text-[11px] text-slate-500">{r.message}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[10px] font-semibold border ${r.unread
            ? 'bg-[#edf6f2] text-[#006a4e] border-[#006a4e]/30'
            : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
        >
          {r.unread ? 'Unread' : 'Read'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setSelectedNotif(r)}
            className="px-2 py-1 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3 h-3 text-[#006a4e]" />
            <span>View</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleRead(r.id)}
            className="px-2 py-1 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            {r.unread ? 'Mark Read' : 'Mark Unread'}
          </button>
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={statusFilter}
      onChange={(val) => setStatusFilter(val as any)}
      width="w-48"
      options={[
        { label: `All Notifications (${stats.total})`, value: 'all' },
        { label: `Unread Only (${stats.unread})`, value: 'unread' },
        { label: `Critical STAT (${stats.critical})`, value: 'critical' },
      ]}
    />
  );

  const toolbarActions = (
    <button
      type="button"
      onClick={handleMarkAllRead}
      className="h-8 px-3 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-[#006a4e]" />
      <span>Mark All Read</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Notifications"
          icon={Bell}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Alerts`}
          subtitle="All inbox alerts & logs"
        />
        <SummaryCard
          title="Unread"
          icon={Eye}
          iconColor="text-[#006a4e]"
          value={`${stats.unread} Unread`}
          valueColor="text-[#006a4e]"
          subtitle="Pending doctor acknowledgment"
        />
        <SummaryCard
          title="Critical STAT"
          icon={ShieldAlert}
          iconColor="text-rose-600"
          value={`${stats.critical} Emergency`}
          valueColor="text-rose-700"
          subtitle="Immediate clinical response"
        />
        <SummaryCard
          title="System & Updates"
          icon={Info}
          iconColor="text-cyan-600"
          value={`${stats.info} Notices`}
          valueColor="text-cyan-700"
          subtitle="Hospital department advisories"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorNotificationItem>
        data={filteredNotifs}
        columns={columns}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search notifications by title or message..."
        searchFilter={(r, q) => {
          const lq = q.toLowerCase();
          return r.title.toLowerCase().includes(lq) || r.message.toLowerCase().includes(lq);
        }}
        showSerial={true}
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyTitle="No clinical notifications found."
      />

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-md border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-800">
                  Clinical Notification Detail
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border ${selectedNotif.type === 'critical'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                >
                  {selectedNotif.type}
                </span>
                <span className="text-slate-500">{selectedNotif.timestamp}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedNotif.title}</h4>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {selectedNotif.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  handleToggleRead(selectedNotif.id);
                  setSelectedNotif(null);
                }}
                className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold cursor-pointer"
              >
                {selectedNotif.unread ? 'Mark as Read' : 'Keep Unread'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
