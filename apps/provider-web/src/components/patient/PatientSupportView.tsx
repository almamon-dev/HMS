import {
  Bell,
  CheckCircle2,
  Clock,
  KeyRound,
  MessageSquare,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  User,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  CURRENT_PATIENT,
  PATIENT_NOTIFICATIONS,
  PatientNotificationItem,
} from '../../data/patientPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

interface PatientSupportViewProps {
  mode?: 'notifications' | 'support-messages' | 'settings' | 'profile';
}

export const PatientSupportView: React.FC<PatientSupportViewProps> = ({
  mode = 'notifications',
}) => {
  // Notifications State
  const [notifications, setNotifications] = useState<PatientNotificationItem[]>(PATIENT_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState('All');

  // Support Messages State
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'user' | 'support'; text: string; time: string }[]>([
    {
      id: 'cm-1',
      sender: 'support',
      text: 'Hello Md. Rahim Uddin, how can the GreenHospital Patient Care Team assist you today?',
      time: '10:30 AM',
    },
    {
      id: 'cm-2',
      sender: 'user',
      text: 'I have an appointment today at 4:00 PM with Dr. Tanvir Ahmed. Where do I report first?',
      time: '10:32 AM',
    },
    {
      id: 'cm-3',
      sender: 'support',
      text: 'Please visit the 3rd Floor OPD Reception counter to collect your verified chamber slip. Token #06 has already been reserved for you.',
      time: '10:34 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Settings / Profile State
  const [patientName, setPatientName] = useState(CURRENT_PATIENT.name);
  const [patientPhone, setPatientPhone] = useState(CURRENT_PATIENT.phone);
  const [patientEmail, setPatientEmail] = useState(CURRENT_PATIENT.email);
  const [patientAddress, setPatientAddress] = useState(CURRENT_PATIENT.address);
  const [emergencyContact, setEmergencyContact] = useState(CURRENT_PATIENT.emergencyContact);

  const filteredNotifications = useMemo(() => {
    if (notifFilter === 'All') return notifications;
    if (notifFilter === 'Unread') return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.type === notifFilter);
  }, [notifications, notifFilter]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: `cm-${Date.now()}`,
      sender: 'user' as const,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');

    // Auto reply simulation
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `cm-reply-${Date.now()}`,
          sender: 'support',
          text: 'Thank you for reaching out. A representative is reviewing your message.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const notifColumns: DataTableColumn<PatientNotificationItem>[] = [
    {
      key: 'title',
      header: 'Notification Subject & Message',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            {r.unread && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
            )}
            <span
              className={`text-xs ${r.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                }`}
            >
              {r.title}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 max-w-lg">{r.message}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      sortValue: (r) => r.type,
      render: (r) => (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20">
          {r.type}
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Time',
      sortable: true,
      sortValue: (r) => r.timestamp,
      render: (r) => (
        <span className="text-slate-600 whitespace-nowrap text-xs font-medium">
          {r.timestamp}
        </span>
      ),
    },
    {
      key: 'unread',
      header: 'Status',
      sortable: true,
      sortValue: (r) => (r.unread ? 1 : 0),
      render: (r) => (
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${r.unread
            ? 'bg-rose-50 text-rose-700 font-bold'
            : 'bg-slate-100 text-slate-600'
            }`}
        >
          {r.unread ? 'Unread' : 'Read'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <SummaryCardGrid>
        {mode === 'notifications' && (
          <>
            <SummaryCard
              title="Total Notifications"
              icon={Bell}
              iconColor="text-[#006a4e]"
              value={`${notifications.length} Alerts`}
              subtitle="System & clinical logs"
            />
            <SummaryCard
              title="Unread Messages"
              icon={Bell}
              iconColor="text-rose-600"
              value={`${notifications.filter((n) => n.unread).length} Unread`}
              valueColor="text-rose-700"
              subtitle="Action items pending"
            />
            <SummaryCard
              title="Clinical Reminders"
              icon={Clock}
              iconColor="text-amber-600"
              value="2 OPD Reminders"
              valueColor="text-amber-700"
              subtitle="Today consultation & lab"
            />
            <SummaryCard
              title="Hospital Notice"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
              value="Active Notice"
              valueColor="text-emerald-700"
              subtitle="Free preventive camp"
            />
          </>
        )}

        {mode === 'support-messages' && (
          <>
            <SummaryCard
              title="Support Session"
              icon={MessageSquareText}
              iconColor="text-[#006a4e]"
              value="Active"
              subtitle="Connected with Helpdesk"
            />
            <SummaryCard
              title="Emergency Helpline"
              icon={Phone}
              iconColor="text-rose-600"
              value="+880 9666-710600"
              valueColor="text-rose-700"
              subtitle="24/7 Rapid ambulance line"
            />
            <SummaryCard
              title="Average Response"
              icon={Clock}
              iconColor="text-[#006a4e]"
              value="< 5 Minutes"
              valueColor="text-[#006a4e]"
              subtitle="Priority hospital care"
            />
            <SummaryCard
              title="Helpdesk Status"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
              value="24/7 Desk Open"
              valueColor="text-emerald-700"
              subtitle="All services operational"
            />
          </>
        )}

        {(mode === 'settings' || mode === 'profile') && (
          <>
            <SummaryCard
              title="Hospital UHID"
              icon={User}
              iconColor="text-[#006a4e]"
              value={<span className="font-mono">{CURRENT_PATIENT.uhid}</span>}
              subtitle="Primary medical record ID"
            />
            <SummaryCard
              title="Verification"
              icon={ShieldCheck}
              iconColor="text-emerald-600"
              value="Verified Patient"
              valueColor="text-emerald-700"
              subtitle="NID linked & approved"
            />
            <SummaryCard
              title="Preferred Wing"
              icon={User}
              iconColor="text-[#006a4e]"
              value="Dhanmondi Wing"
              valueColor="text-[#006a4e]"
              subtitle="Main medical complex"
            />
            <SummaryCard
              title="Security Status"
              icon={KeyRound}
              iconColor="text-cyan-600"
              value="2FA Active"
              valueColor="text-cyan-700"
              subtitle="Protected patient account"
            />
          </>
        )}
      </SummaryCardGrid>

      {mode === 'notifications' && (
        <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
          <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Filter Alerts:</span>
              <DropdownSelect
                options={[
                  { value: 'All', label: 'All Alerts' },
                  { value: 'Unread', label: 'Unread Only' },
                  { value: 'appointment', label: 'Appointment Alerts' },
                  { value: 'lab', label: 'Lab Reports' },
                  { value: 'billing', label: 'Billing & Payments' },
                  { value: 'system', label: 'Hospital Announcements' },
                ]}
                value={notifFilter}
                onChange={setNotifFilter}
                className="w-48"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs font-bold text-[#006a4e] hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          </div>

          <DataTable
            columns={notifColumns}
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Search notifications..."
            searchFilter={(item, query) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.message.toLowerCase().includes(query.toLowerCase())
            }
            defaultSort={{ key: 'timestamp', order: 'asc' }}
            showSerial={true}
            emptyMessage="No notifications found."
          />
        </div>
      )}

      {mode === 'support-messages' && (
        <div className="bg-white border border-slate-300 rounded-[3px] p-3 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#006a4e]" />
              <h3 className="text-xs font-bold text-slate-900">
                Hospital Helpdesk &amp; Patient Navigation Support
              </h3>
            </div>
            <span className="text-[10px] text-slate-500">Live conversation history</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto p-2 bg-slate-50 rounded border border-slate-200">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
              >
                <div
                  className={`max-w-md p-2.5 rounded text-xs leading-relaxed ${msg.sender === 'user'
                    ? 'bg-[#006a4e] text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                    }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to patient support..."
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      )}

      {(mode === 'settings' || mode === 'profile') && (
        <div className="bg-white border border-slate-300 rounded-[3px] p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#006a4e]" />
              <h3 className="text-sm font-bold text-slate-900">
                Patient Profile &amp; Account Settings
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Patient Record
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Profile information updated successfully!');
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Hospital UHID</label>
                <input
                  type="text"
                  value={CURRENT_PATIENT.uhid}
                  disabled
                  className="w-full px-2.5 py-1.5 border border-slate-200 bg-slate-100 rounded text-xs font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">National ID / Passport</label>
                <input
                  type="text"
                  value={CURRENT_PATIENT.nationalId}
                  disabled
                  className="w-full px-2.5 py-1.5 border border-slate-200 bg-slate-100 rounded text-xs font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                <input
                  type="text"
                  value={CURRENT_PATIENT.bloodGroup}
                  disabled
                  className="w-full px-2.5 py-1.5 border border-slate-200 bg-slate-100 rounded text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Emergency Contact (Next of Kin)
                </label>
                <textarea
                  rows={2}
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
