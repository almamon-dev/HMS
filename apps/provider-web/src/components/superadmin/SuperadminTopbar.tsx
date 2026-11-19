import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  User,
  Home,
  CheckCircle2,
  Stethoscope,
  Bed,
  FilePlus,
  Pill,
} from 'lucide-react';

interface SuperadminTopbarProps {
  currentModule: string;
  onToggleSidebar: () => void;
  onExitSuperadmin: () => void;
}

export const SuperadminTopbar: React.FC<SuperadminTopbarProps> = ({
  currentModule,
  onToggleSidebar,
  onExitSuperadmin,
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddSearch, setQuickAddSearch] = useState('');

  const quickActions = [
    { title: 'Add New Patient', icon: User, desc: 'Register OP/IP patient' },
    { title: 'Book Doctor Appointment', icon: Stethoscope, desc: 'Chamber appointment' },
    { title: 'New OPD Entry', icon: FilePlus, desc: 'Outpatient consultation' },
    { title: 'IPD Bed Admission', icon: Bed, desc: 'Admit to ward or cabin' },
    { title: 'Dispense Pharmacy Medicine', icon: Pill, desc: 'Create medicine bill' },
  ];

  const filteredActions = quickActions.filter((a) =>
    a.title.toLowerCase().includes(quickAddSearch.toLowerCase())
  );

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left: Sidebar Hamburger + Module Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Home className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-base capitalize leading-tight">
              {currentModule.replace('-', ' ')}
            </h1>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Super Admin Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search By Patient Name */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search By Patient Name, Phone or ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Quick Add (+), Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add (+) Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="h-9 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Quick Add Action"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {/* Quick Add Popover Panel */}
          {showQuickAdd && (
            <>
              <div
                onClick={() => setShowQuickAdd(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-800">Quick Operations</span>
                  <span className="text-[10px] text-teal-700 font-mono bg-teal-50 px-1.5 py-0.5 rounded">
                    Ctrl + K
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Type to filter..."
                  value={quickAddSearch}
                  onChange={(e) => setQuickAddSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 mb-2 focus:outline-hidden focus:border-teal-500"
                />
                <div className="space-y-1">
                  {filteredActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.title}
                        onClick={() => setShowQuickAdd(false)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">
                            {action.title}
                          </div>
                          <div className="text-[10px] text-slate-400">{action.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Superadmin Badge & Exit Portal Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            SA
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              Super Admin
              <CheckCircle2 className="w-3 h-3 text-teal-600 inline" />
            </div>
            <button
              onClick={onExitSuperadmin}
              className="text-[10px] text-teal-600 font-semibold hover:underline block cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

