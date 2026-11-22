import {
  Ambulance,
  CheckCircle2,
  ChevronDown,
  Eye,
  MoreVertical,
  Navigation,
  Plus,
  Printer,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  AmbulanceCallRecord,
  AmbulanceVehicle,
  AmbulanceVehicleType,
  SMART_AMBULANCE_CALLS,
  SMART_AMBULANCE_VEHICLES,
} from '../../../data/superadminAmbulanceData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type AmbulanceTab = 'calls' | 'fleet';

export const AmbulanceDirectory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AmbulanceTab>('calls');
  const [calls, setCalls] = useState<AmbulanceCallRecord[]>(SMART_AMBULANCE_CALLS);
  const [vehicles, setVehicles] = useState<AmbulanceVehicle[]>(SMART_AMBULANCE_VEHICLES);
  const [selectedCall, setSelectedCall] = useState<AmbulanceCallRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [showCallModal, setShowCallModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // Book Ambulance Call Form
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('+880 1711-');
  const [patientAddress, setPatientAddress] = useState('Dhanmondi, Dhaka');
  const [caseId, setCaseId] = useState('7498');
  const [selectedVehicleNo, setSelectedVehicleNo] = useState('DM-HA-11-2041');
  const [callDistance, setCallDistance] = useState(15);
  const [callRate, setCallRate] = useState(12);
  const [paidAmount, setPaidAmount] = useState(189);

  // Add Vehicle Form
  const [newVehNo, setNewVehNo] = useState('');
  const [newModel, setNewModel] = useState('Toyota HiAce Super Custom');
  const [newYear, setNewYear] = useState('2024');
  const [newDriver, setNewDriver] = useState('');
  const [newLicense, setNewLicense] = useState('DL-DH-901827');
  const [newDriverPhone, setNewDriverPhone] = useState('+880 1711-');
  const [newType, setNewType] = useState<AmbulanceVehicleType>('ICU Support Ambulance');
  const [newStation, setNewStation] = useState('Main Campus (Dhanmondi)');

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter((v) => v.status === 'Available').length;
    const dispatched = vehicles.filter((v) => v.status === 'Dispatched').length;
    const maintenance = vehicles.filter((v) => v.status === 'Maintenance').length;
    const activeTrips = calls.filter((c) => c.tripStatus === 'En Route').length;
    return { total, available, dispatched, maintenance, activeTrips };
  }, [vehicles, calls]);

  const handleCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const matchedVeh = vehicles.find((v) => v.vehicleNo === selectedVehicleNo) || vehicles[0];
    const amountVal = callDistance * callRate;
    const taxVal = Number((amountVal * 0.05).toFixed(2));
    const netVal = Number((amountVal + taxVal).toFixed(2));
    const paidVal = Math.min(netVal, paidAmount);
    const balVal = Number((netVal - paidVal).toFixed(2));

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newCall: AmbulanceCallRecord = {
      id: `amb-call-${Date.now()}`,
      billNo: `AMB ${1083 + calls.length}`,
      caseId: caseId || '-',
      patientName: patientName.trim(),
      patientContact,
      gender: 'Male',
      address: patientAddress,
      vehicleNo: matchedVeh.vehicleNo,
      vehicleModel: matchedVeh.vehicleModel,
      driverName: matchedVeh.driverName,
      driverContact: matchedVeh.driverContact,
      callDate: dateFormatted,
      distanceKm: callDistance,
      ratePerKm: callRate,
      amount: amountVal,
      discountAmount: 0,
      taxAmount: taxVal,
      netAmount: netVal,
      paidAmount: paidVal,
      balanceAmount: balVal,
      tripStatus: 'En Route',
    };

    setCalls((prev) => [newCall, ...prev]);
    // Set vehicle status to Dispatched
    setVehicles((prev) =>
      prev.map((v) => (v.vehicleNo === selectedVehicleNo ? { ...v, status: 'Dispatched' } : v))
    );

    setShowCallModal(false);
    setPatientName('');
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehNo.trim()) return;

    const newVeh: AmbulanceVehicle = {
      id: `veh-${Date.now()}`,
      vehicleNo: newVehNo.trim(),
      vehicleModel: newModel,
      yearMade: newYear,
      driverName: newDriver.trim() || 'Assigned Driver',
      driverLicense: newLicense,
      driverContact: newDriverPhone,
      vehicleType: newType,
      status: 'Available',
      baseStation: newStation,
    };

    setVehicles((prev) => [...prev, newVeh]);
    setShowVehicleModal(false);
    setNewVehNo('');
    setNewDriver('');
  };

  // Columns for Ambulance Call Table
  const callColumns: DataTableColumn<AmbulanceCallRecord>[] = [
    {
      key: 'billNo',
      header: 'Bill No',
      sortable: true,
      sortValue: (r) => r.billNo,
      render: (r: AmbulanceCallRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCall(r);
          }}
          className="text-[#0094b6] hover:underline font-bold text-left cursor-pointer whitespace-nowrap"
        >
          {r.billNo}
        </button>
      ),
    },
    {
      key: 'caseId',
      header: 'Case ID',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.caseId,
      render: (r: AmbulanceCallRecord) => (
        <span className="text-slate-700 font-semibold">{r.caseId}</span>
      ),
    },
    {
      key: 'callDate',
      header: 'Call Date',
      sortable: true,
      sortValue: (r) => r.callDate,
      render: (r: AmbulanceCallRecord) => (
        <span className="text-slate-800 whitespace-nowrap font-medium text-[10.5px]">
          {r.callDate}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r: AmbulanceCallRecord) => (
        <div className="leading-tight">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCall(r);
            }}
            className="text-slate-900 font-semibold hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.patientName}
          </button>
          <span className="text-[10px] text-slate-500">{r.patientContact}</span>
        </div>
      ),
    },
    {
      key: 'vehicleInfo',
      header: 'Vehicle Model & No',
      sortable: true,
      sortValue: (r) => r.vehicleNo,
      render: (r: AmbulanceCallRecord) => (
        <div className="leading-tight">
          <div className="font-semibold text-slate-800 text-[11px]">{r.vehicleNo}</div>
          <div className="text-[10px] text-slate-500 truncate max-w-xs">{r.vehicleModel}</div>
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver Name',
      render: (r: AmbulanceCallRecord) => (
        <div className="leading-tight">
          <div className="text-slate-800 font-medium">{r.driverName}</div>
          <div className="text-[10px] text-slate-500">{r.driverContact}</div>
        </div>
      ),
    },
    {
      key: 'distanceKm',
      header: 'Distance',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.distanceKm,
      render: (r: AmbulanceCallRecord) => `${r.distanceKm} km`,
    },
    {
      key: 'netAmount',
      header: 'Net Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netAmount,
      render: (r: AmbulanceCallRecord) => (
        <span className="font-bold text-slate-900">{r.netAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.paidAmount,
      render: (r: AmbulanceCallRecord) => (
        <span className="font-semibold text-emerald-700">{r.paidAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'balanceAmount',
      header: 'Balance ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.balanceAmount,
      render: (r: AmbulanceCallRecord) => (
        <span
          className={`font-semibold ${r.balanceAmount > 0 ? 'text-rose-600' : 'text-slate-700'
            }`}
        >
          {r.balanceAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'tripStatus',
      header: 'Trip Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.tripStatus,
      render: (r: AmbulanceCallRecord) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] ${r.tripStatus === 'Completed'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : r.tripStatus === 'En Route'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
        >
          {r.tripStatus}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: AmbulanceCallRecord, idx?: number) => {
        const isNearBottom = (idx ?? 0) >= 5;
        return (
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionId((prev) => (prev === r.id ? null : r.id));
              }}
              className="w-5 h-5 rounded-[3px] hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer mx-auto"
              title="More actions"
              aria-label="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {activeActionId === r.id && (
              <div
                className={`absolute right-0 ${isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                  } w-36 bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-40 text-left divide-y divide-slate-100`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCall(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#f0f8fa] hover:text-[#0094b6] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0094b6]" />
                    <span>View Bill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCall(r);
                      setActiveActionId(null);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Slip</span>
                  </button>
                  {r.tripStatus === 'En Route' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCalls((prev) =>
                          prev.map((c) => (c.id === r.id ? { ...c, tripStatus: 'Completed' } : c))
                        );
                        setActiveActionId(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[11px] text-emerald-700 hover:bg-emerald-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Complete Trip</span>
                    </button>
                  )}
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCalls((prev) => prev.filter((item) => item.id !== r.id));
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Columns for Ambulance Fleet Table
  const vehicleColumns: DataTableColumn<AmbulanceVehicle>[] = [
    {
      key: 'vehicleNo',
      header: 'Vehicle No',
      sortable: true,
      sortValue: (r) => r.vehicleNo,
      render: (r: AmbulanceVehicle) => (
        <span className="font-bold text-[#0094b6]">{r.vehicleNo}</span>
      ),
    },
    {
      key: 'vehicleModel',
      header: 'Vehicle Model',
      sortable: true,
      sortValue: (r) => r.vehicleModel,
      render: (r: AmbulanceVehicle) => (
        <div>
          <span className="font-semibold text-slate-900">{r.vehicleModel}</span>
          <span className="text-[10px] text-slate-500 ml-1">({r.yearMade})</span>
        </div>
      ),
    },
    {
      key: 'vehicleType',
      header: 'Ambulance Type',
      align: 'center',
      render: (r: AmbulanceVehicle) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] ${r.vehicleType.includes('ICU')
            ? 'bg-rose-50 text-rose-800 border border-rose-200'
            : r.vehicleType.includes('Cardiac')
              ? 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
        >
          {r.vehicleType}
        </span>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver Name',
      sortable: true,
      sortValue: (r) => r.driverName,
      render: (r: AmbulanceVehicle) => r.driverName,
    },
    {
      key: 'driverLicense',
      header: 'License No',
      render: (r: AmbulanceVehicle) => (
        <span className="font-mono text-slate-600 text-[10.5px]">{r.driverLicense}</span>
      ),
    },
    {
      key: 'driverContact',
      header: 'Driver Contact',
      render: (r: AmbulanceVehicle) => r.driverContact,
    },
    {
      key: 'baseStation',
      header: 'Base Station',
      render: (r: AmbulanceVehicle) => (
        <span className="text-slate-600 truncate max-w-xs block">{r.baseStation}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r: AmbulanceVehicle) => (
        <span
          className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] ${r.status === 'Available'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : r.status === 'Dispatched'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: AmbulanceVehicle, idx?: number) => {
        const isNearBottom = (idx ?? 0) >= 5;
        return (
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionId((prev) => (prev === r.id ? null : r.id));
              }}
              className="w-5 h-5 rounded-[3px] hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer mx-auto"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {activeActionId === r.id && (
              <div
                className={`absolute right-0 ${isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                  } w-36 bg-white border border-slate-200 rounded-[3px] shadow-lg py-1 z-40 text-left`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVehicleNo(r.vehicleNo);
                    setShowCallModal(true);
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>Dispatch Trip</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVehicles((prev) =>
                      prev.map((v) =>
                        v.id === r.id
                          ? {
                            ...v,
                            status: v.status === 'Maintenance' ? 'Available' : 'Maintenance',
                          }
                          : v
                      )
                    );
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-500" />
                  <span>{r.status === 'Maintenance' ? 'Mark Ready' : 'Maintenance'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVehicles((prev) => prev.filter((v) => v.id !== r.id));
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Toolbar Filters matching PatientDirectory
  const toolbarFilters = (
    <div className="relative">
      <select
        aria-label="Filter by ambulance view"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as AmbulanceTab)}
        className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
      >
        <option value="calls">Ambulance Calls Registry</option>
        <option value="fleet">Ambulance Fleet Directory</option>
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  );

  // Toolbar Actions matching PatientDirectory
  const toolbarActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setShowCallModal(true)}
        className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Ambulance Call</span>
      </button>

      <button
        type="button"
        onClick={() => setShowVehicleModal(true)}
        className="h-8 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Ambulance className="w-3.5 h-3.5" />
        <span>Add Ambulance</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 min-w-0 w-full overflow-hidden">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Fleet Units</span>
            <Ambulance className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {metrics.total} Ambulances
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Across 3 metropolitan base stations</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Ready at Base</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              {metrics.available} Available
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Drivers &amp; EMT staff standing by</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">En Route Active Trips</span>
            <Navigation className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {metrics.dispatched} En Route
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Live GPS tracking active dispatch</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Maintenance Bay</span>
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-700 leading-none">
              {metrics.maintenance} In Garage
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Routine mechanical safety inspections</p>
        </div>
      </div>

      {/* Selected Call Invoice / Trip Quick View Card */}
      {selectedCall && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#f0f8fa] text-[#0094b6] font-bold text-sm flex items-center justify-center">
                <Ambulance className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedCall.billNo}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    Case #{selectedCall.caseId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[3px] border text-[11px] font-semibold ${selectedCall.tripStatus === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                  >
                    {selectedCall.tripStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-800">{selectedCall.patientName}</strong> ({selectedCall.patientContact}) · Vehicle: {selectedCall.vehicleNo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-3 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close trip quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Driver &amp; Mobile</p>
              <p className="font-semibold text-slate-800">{selectedCall.driverName} ({selectedCall.driverContact})</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Trip Distance</p>
              <p className="font-bold text-slate-900">{selectedCall.distanceKm} km</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Net Amount</p>
              <p className="font-bold text-slate-900">${selectedCall.netAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Paid Amount</p>
              <p className="font-bold text-emerald-700">${selectedCall.paidAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Tab View with Reusable DataTable */}
      {activeTab === 'calls' ? (
        <DataTable<AmbulanceCallRecord>
          title="Ambulance Calls Registry"
          subtitle="Patient emergency pickup logs, distance billing, and transit statuses"
          data={calls}
          columns={callColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by bill no, patient, vehicle no, driver, or case ID..."
          searchFilter={(r, q) =>
            r.billNo.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.vehicleNo.toLowerCase().includes(q) ||
            r.driverName.toLowerCase().includes(q) ||
            r.caseId.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No ambulance calls found"
          emptyDescription="No dispatch trips matching the search query."
        />
      ) : (
        <DataTable<AmbulanceVehicle>
          title="Ambulance Fleet Directory"
          subtitle="Hospital fleet vehicles, equipment classifications, and maintenance status"
          data={vehicles}
          columns={vehicleColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by vehicle no, model, driver, or license..."
          searchFilter={(r, q) =>
            r.vehicleNo.toLowerCase().includes(q) ||
            r.vehicleModel.toLowerCase().includes(q) ||
            r.driverName.toLowerCase().includes(q) ||
            r.driverLicense.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No ambulance vehicles found"
          emptyDescription="No vehicles in fleet matching the filter."
        />
      )}

      {/* Modal: Book Ambulance Call */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Ambulance className="w-4 h-4 text-[#0094b6]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Ambulance Call Dispatch &amp; Bill
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCallSubmit} className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Patient Name (UHID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Rachel Priest (1162)"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Patient Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientContact}
                    onChange={(e) => setPatientContact(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Select Ambulance Vehicle *
                  </label>
                  <select
                    value={selectedVehicleNo}
                    onChange={(e) => setSelectedVehicleNo(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.vehicleNo}>
                        {v.vehicleNo} - {v.vehicleModel} ({v.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Case ID
                  </label>
                  <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Pickup / Destination Address *
                </label>
                <input
                  type="text"
                  required
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              {/* Financial Distance Calculation */}
              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-[3px]">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Distance (Km)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={callDistance}
                    onChange={(e) => setCallDistance(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Rate / Km ($)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={callRate}
                    onChange={(e) => setCallRate(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Paid Amount ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCallModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#0094b6] hover:bg-[#007f9c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Dispatch Ambulance &amp; Print Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Ambulance */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Ambulance className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Register Ambulance Vehicle
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVehicleModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleVehicleSubmit} className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehNo}
                    onChange={(e) => setNewVehNo(e.target.value)}
                    placeholder="DM-HA-11-2050"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Year Made
                  </label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  required
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Ambulance Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                >
                  <option value="ICU Support Ambulance">ICU Support Ambulance</option>
                  <option value="Cardiac Mobile Unit">Cardiac Mobile Unit</option>
                  <option value="Standard AC Ambulance">Standard AC Ambulance</option>
                  <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Assigned Driver
                  </label>
                  <input
                    type="text"
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    placeholder="Driver name"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Driver Phone
                  </label>
                  <input
                    type="text"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    License No
                  </label>
                  <input
                    type="text"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Base Station
                  </label>
                  <input
                    type="text"
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#006a4e] hover:bg-[#00523c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Add to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceDirectory;
