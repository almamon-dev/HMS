import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DOCTOR_TASKS, DoctorClinicalTask } from '../../data/doctorPortalData';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { TableActionButtons } from '../common/TableActionButtons';

export const DoctorTasksView: React.FC = () => {
  const [tasks, setTasks] = useState<DoctorClinicalTask[]>(DOCTOR_TASKS);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [patientRef, setPatientRef] = useState('');
  const [dueTime, setDueTime] = useState('06:00 PM Today');
  const [priority, setPriority] = useState<DoctorClinicalTask['priority']>('High');
  const [category, setCategory] = useState<DoctorClinicalTask['category']>('Review');

  // 4 Superadmin-Styled KPI Cards
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;
    const urgent = tasks.filter((t) => t.priority === 'STAT Urgent' || t.priority === 'High').length;
    return { total, pending, completed, urgent };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchCategory;
    });
  }, [tasks, categoryFilter]);

  const handleToggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: DoctorClinicalTask = {
      id: `tsk-${Date.now()}`,
      title: title.trim(),
      description,
      patientRef,
      dueTime,
      priority,
      completed: false,
      category,
    };

    setTasks([newTask, ...tasks]);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setPatientRef('');
  };

  const columns: DataTableColumn<DoctorClinicalTask>[] = [
    {
      key: 'status',
      header: 'Done',
      align: 'center',
      render: (r) => (
        <input
          type="checkbox"
          checked={r.completed}
          onChange={() => handleToggleDone(r.id)}
          className="w-4 h-4 rounded text-[#006a4e] focus:ring-[#006a4e] cursor-pointer"
        />
      ),
    },
    {
      key: 'title',
      header: 'Duty Task & Patient Ref',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div>
          <div
            className={`font-bold leading-tight ${r.completed ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
          >
            {r.title}
          </div>
          {r.patientRef && (
            <div className="text-[11px] font-semibold text-emerald-800">
              Ref: {r.patientRef}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Clinical Action Details',
      render: (r) => (
        <div className="text-slate-600 max-w-xs truncate" title={r.description}>
          {r.description}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] whitespace-nowrap">
          {r.category}
        </span>
      ),
    },
    {
      key: 'dueTime',
      header: 'Due Deadline',
      sortable: true,
      sortValue: (r) => r.dueTime,
      render: (r) => (
        <span className="text-slate-700 font-semibold whitespace-nowrap">
          {r.dueTime}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      sortValue: (r) => r.priority,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${r.priority === 'STAT Urgent'
            ? 'bg-rose-100 text-rose-800'
            : r.priority === 'High'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600'
            }`}
        >
          {r.priority}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <TableActionButtons
            onEdit={() => handleToggleDone(r.id)}
            onDelete={() => handleDeleteTask(r.id)}
            editTitle="Toggle task completion"
            deleteTitle="Delete task"
          />
        </div>
      ),
    },
  ];

  const toolbarFilters = (
    <DropdownSelect
      value={categoryFilter}
      onChange={(val) => setCategoryFilter(val)}
      width="w-44"
      options={[
        { label: 'All Categories', value: 'All' },
        { label: 'Review', value: 'Review' },
        { label: 'Discharge', value: 'Discharge' },
        { label: 'Prescription', value: 'Prescription' },
        { label: 'Call', value: 'Call' },
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
      <span>Add Clinical Task</span>
    </button>
  );

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards matching Appointment format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Action Items"
          icon={Clock}
          iconColor="text-[#006a4e]"
          value={`${stats.total} Tasks`}
          subtitle="Scheduled clinical workflows"
        />
        <SummaryCard
          title="Pending Execution"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          value={`${stats.pending} Pending`}
          valueColor="text-amber-700"
          subtitle="Awaiting physician action"
        />
        <SummaryCard
          title="High / STAT Priority"
          icon={Users}
          iconColor="text-rose-600"
          value={`${stats.urgent} STAT`}
          valueColor="text-rose-700"
          subtitle="Critical ICU and discharge orders"
        />
        <SummaryCard
          title="Completed Tasks"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          value={`${stats.completed} Done`}
          valueColor="text-emerald-700"
          subtitle="Fulfilled in today's duty shift"
        />
      </SummaryCardGrid>

      {/* Appointment-Styled Enterprise DataTable */}
      <DataTable<DoctorClinicalTask>
        data={filteredTasks}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search task title, description, or patient ref..."
        searchFilter={(item, query) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          (Boolean(item.patientRef) && item.patientRef!.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        }
        filters={toolbarFilters}
        actionButton={toolbarActions}
        emptyMessage="No clinical tasks found for the selected filter."
        showSerial={true}
      />

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Add Clinical Duty Task
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Check postoperative ECG for Ward 302"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Description / Action Required
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specific clinical steps or instruction..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Patient / Bed Ref
                  </label>
                  <input
                    type="text"
                    value={patientRef}
                    onChange={(e) => setPatientRef(e.target.value)}
                    placeholder="UHID or Cabin 402"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Due Time
                  </label>
                  <input
                    type="text"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="06:00 PM Today"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="STAT Urgent">STAT Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-[#006a4e]"
                  >
                    <option value="Review">Review</option>
                    <option value="Discharge">Discharge</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Call">Call</option>
                  </select>
                </div>
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
