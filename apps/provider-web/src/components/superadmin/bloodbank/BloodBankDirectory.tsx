import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Droplet,
  Droplets,
  Eye,
  HeartHandshake,
  MoreVertical,
  Plus,
  Printer,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  BLOOD_GROUP_STOCKS,
  BloodDonationBagRecord,
  BloodDonorRecord,
  BloodIssueRecord,
  SMART_BLOOD_DONATION_BAGS,
  SMART_BLOOD_DONORS,
  SMART_BLOOD_ISSUES,
} from '../../../data/superadminBloodBankData';
import { DataTable, DataTableColumn } from '../../common/DataTable';

type BloodBankTab = 'issues' | 'donors' | 'donations' | 'stock';

export const BloodBankDirectory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BloodBankTab>('issues');
  const [issues, setIssues] = useState<BloodIssueRecord[]>(SMART_BLOOD_ISSUES);
  const [donors, setDonors] = useState<BloodDonorRecord[]>(SMART_BLOOD_DONORS);
  const [donations, setDonations] = useState<BloodDonationBagRecord[]>(SMART_BLOOD_DONATION_BAGS);

  const [selectedIssue, setSelectedIssue] = useState<BloodIssueRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Issue Blood Form State
  const [formPatientName, setFormPatientName] = useState('');
  const [formCaseId, setFormCaseId] = useState('7495');
  const [formDoctorName, setFormDoctorName] = useState('Dr. Reyan Jain (9011)');
  const [formBloodGroup, setFormBloodGroup] = useState('B+');
  const [formComponent, setFormComponent] = useState<BloodIssueRecord['component']>('PRBC');
  const [formBagNo, setFormBagNo] = useState('BAG-9190');
  const [formDonorName, setFormDonorName] = useState('Mahmudur Rahman');
  const [formAmount, setFormAmount] = useState(120);
  const [formDiscount, setFormDiscount] = useState(0);
  const [formPaidAmount, setFormPaidAmount] = useState(126);

  // Add Donor Form State
  const [donorName, setDonorName] = useState('');
  const [donorAge, setDonorAge] = useState(26);
  const [donorGender, setDonorGender] = useState<'Male' | 'Female'>('Male');
  const [donorGroup, setDonorGroup] = useState('O+');
  const [donorMobile, setDonorMobile] = useState('+880 1711-');
  const [donorFather, setDonorFather] = useState('');
  const [donorAddress, setDonorAddress] = useState('Dhaka, Bangladesh');

  // Receive Donation Form State
  const [donationDonorName, setDonationDonorName] = useState('Tanvir Hossain');
  const [donationGroup, setDonationGroup] = useState('O+');
  const [donationBagNo, setDonationBagNo] = useState('BAG-9195');
  const [donationVolume, setDonationVolume] = useState(450);
  const [donationLot, setDonationLot] = useState('LOT-26O-120');

  useEffect(() => {
    const handleOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  const totalReserveBags = useMemo(() => {
    return BLOOD_GROUP_STOCKS.reduce((sum, item) => sum + item.totalBags, 0);
  }, []);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim()) return;

    const taxVal = Number(((formAmount - formDiscount) * 0.05).toFixed(2));
    const netVal = Number((formAmount - formDiscount + taxVal).toFixed(2));
    const paidVal = Math.min(netVal, formPaidAmount);
    const balanceVal = Number((netVal - paidVal).toFixed(2));

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newIssue: BloodIssueRecord = {
      id: `bl-issue-${Date.now()}`,
      issueNo: `BLB ${4013 + issues.length}`,
      caseId: formCaseId || '-',
      date: dateFormatted,
      patientName: formPatientName.trim(),
      patientId: `${1170 + issues.length}`,
      doctorName: formDoctorName,
      donorName: formDonorName,
      bagNo: formBagNo,
      bloodGroup: formBloodGroup,
      component: formComponent,
      amount: formAmount,
      discountAmount: formDiscount,
      discountPercent: formAmount > 0 ? Number(((formDiscount / formAmount) * 100).toFixed(1)) : 0,
      taxAmount: taxVal,
      taxPercent: 5,
      netAmount: netVal,
      paidAmount: paidVal,
      balanceAmount: balanceVal,
      crossMatchingStatus: 'Compatible',
    };

    setIssues((prev) => [newIssue, ...prev]);
    setShowIssueModal(false);
    setFormPatientName('');
  };

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) return;

    const newDonor: BloodDonorRecord = {
      id: `donor-${Date.now()}`,
      donorId: `DNR-${1011 + donors.length}`,
      donorName: donorName.trim(),
      gender: donorGender,
      age: donorAge,
      bloodGroup: donorGroup,
      mobile: donorMobile,
      fatherName: donorFather || '-',
      address: donorAddress,
      lastDonationDate: 'Today',
      totalDonations: 1,
    };

    setDonors((prev) => [newDonor, ...prev]);
    setShowDonorModal(false);
    setDonorName('');
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    const newBag: BloodDonationBagRecord = {
      id: `bag-${Date.now()}`,
      bagNo: donationBagNo,
      donorName: donationDonorName,
      donorId: `DNR-${1001 + Math.floor(Math.random() * 10)}`,
      bloodGroup: donationGroup,
      donateDate: dateFormatted,
      volumeMl: donationVolume,
      lotNo: donationLot,
      component: 'Whole Blood',
      expiryDate: '35 Days from today',
      screeningStatus: 'Verified',
    };

    setDonations((prev) => [newBag, ...prev]);
    setShowDonationModal(false);
  };

  // Columns for Blood Issue Table
  const issueColumns: DataTableColumn<BloodIssueRecord>[] = [
    {
      key: 'issueNo',
      header: 'Bill No',
      sortable: true,
      sortValue: (r) => r.issueNo,
      render: (r: BloodIssueRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIssue(r);
          }}
          className="text-[#0094b6] hover:underline font-bold text-left cursor-pointer whitespace-nowrap"
        >
          {r.issueNo}
        </button>
      ),
    },
    {
      key: 'caseId',
      header: 'Case ID',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.caseId,
      render: (r: BloodIssueRecord) => (
        <span className="text-slate-700 font-semibold">{r.caseId}</span>
      ),
    },
    {
      key: 'date',
      header: 'Issue Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r: BloodIssueRecord) => (
        <span className="text-slate-800 whitespace-nowrap font-medium text-[10.5px]">
          {r.date}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Received By (Patient)',
      sortable: true,
      sortValue: (r) => r.patientName,
      render: (r: BloodIssueRecord) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIssue(r);
          }}
          className="text-slate-900 font-medium hover:text-[#0094b6] hover:underline text-left cursor-pointer whitespace-nowrap"
        >
          {r.patientName}
        </button>
      ),
    },
    {
      key: 'doctorName',
      header: 'Doctor Name',
      sortable: true,
      sortValue: (r) => r.doctorName,
      render: (r: BloodIssueRecord) => (
        <span className="text-slate-800 font-medium whitespace-nowrap">{r.doctorName}</span>
      ),
    },
    {
      key: 'donorAndBag',
      header: 'Donor / Bag No',
      render: (r: BloodIssueRecord) => (
        <div className="leading-tight">
          <div className="font-semibold text-slate-800">{r.bagNo}</div>
          <div className="text-[10px] text-slate-500">{r.donorName}</div>
        </div>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.bloodGroup,
      render: (r: BloodIssueRecord) => (
        <span className="px-1.5 py-0.5 rounded-[3px] font-bold text-[10.5px] bg-rose-50 text-rose-700 border border-rose-200">
          {r.bloodGroup}
        </span>
      ),
    },
    {
      key: 'component',
      header: 'Component',
      align: 'center',
      render: (r: BloodIssueRecord) => (
        <span className="px-1.5 py-0.5 rounded-[3px] font-medium text-[10px] bg-sky-50 text-sky-800 border border-sky-200">
          {r.component}
        </span>
      ),
    },
    {
      key: 'netAmount',
      header: 'Net Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.netAmount,
      render: (r: BloodIssueRecord) => (
        <span className="font-bold text-slate-900">{r.netAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.paidAmount,
      render: (r: BloodIssueRecord) => (
        <span className="font-semibold text-emerald-700">{r.paidAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'balanceAmount',
      header: 'Balance ($)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.balanceAmount,
      render: (r: BloodIssueRecord) => (
        <span
          className={`font-semibold ${r.balanceAmount > 0 ? 'text-rose-600' : 'text-slate-700'
            }`}
        >
          {r.balanceAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: BloodIssueRecord, idx?: number) => {
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
                      setSelectedIssue(r);
                      setActiveActionId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#f0f8fa] hover:text-[#0094b6] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0094b6]" />
                    <span>View Slip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssue(r);
                      setActiveActionId(null);
                      setTimeout(() => window.print(), 150);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Slip</span>
                  </button>
                </div>
                <div className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIssues((prev) => prev.filter((item) => item.id !== r.id));
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

  // Columns for Blood Donor Table
  const donorColumns: DataTableColumn<BloodDonorRecord>[] = [
    {
      key: 'donorId',
      header: 'Donor ID',
      sortable: true,
      sortValue: (r) => r.donorId,
      render: (r: BloodDonorRecord) => (
        <span className="font-bold text-[#0094b6]">{r.donorId}</span>
      ),
    },
    {
      key: 'donorName',
      header: 'Donor Name',
      sortable: true,
      sortValue: (r) => r.donorName,
      render: (r: BloodDonorRecord) => (
        <span className="font-semibold text-slate-900">{r.donorName}</span>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.bloodGroup,
      render: (r: BloodDonorRecord) => (
        <span className="px-1.5 py-0.5 rounded-[3px] font-bold text-[10.5px] bg-rose-50 text-rose-700 border border-rose-200">
          {r.bloodGroup}
        </span>
      ),
    },
    {
      key: 'ageGender',
      header: 'Age / Gender',
      render: (r: BloodDonorRecord) => `${r.age} Yrs / ${r.gender}`,
    },
    {
      key: 'mobile',
      header: 'Contact No',
      render: (r: BloodDonorRecord) => r.mobile,
    },
    {
      key: 'address',
      header: 'Address',
      render: (r: BloodDonorRecord) => (
        <span className="text-slate-600 truncate max-w-xs block">{r.address}</span>
      ),
    },
    {
      key: 'lastDonationDate',
      header: 'Last Donation',
      render: (r: BloodDonorRecord) => r.lastDonationDate,
    },
    {
      key: 'totalDonations',
      header: 'Total Donations',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.totalDonations,
      render: (r: BloodDonorRecord) => (
        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-[3px]">
          {r.totalDonations} Times
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: BloodDonorRecord, idx?: number) => {
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
                    setDonationDonorName(r.donorName);
                    setDonationGroup(r.bloodGroup);
                    setShowDonationModal(true);
                    setActiveActionId(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-[#edf6f2] hover:text-[#006a4e] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 text-rose-500" />
                  <span>Receive Blood</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDonors((prev) => prev.filter((d) => d.id !== r.id));
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

  // Columns for Blood Donation Bags Table
  const donationColumns: DataTableColumn<BloodDonationBagRecord>[] = [
    {
      key: 'bagNo',
      header: 'Bag No',
      sortable: true,
      sortValue: (r) => r.bagNo,
      render: (r: BloodDonationBagRecord) => (
        <span className="font-bold text-[#0094b6]">{r.bagNo}</span>
      ),
    },
    {
      key: 'donorName',
      header: 'Donor Name',
      sortable: true,
      sortValue: (r) => r.donorName,
      render: (r: BloodDonationBagRecord) => (
        <span className="font-semibold text-slate-900">{r.donorName}</span>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.bloodGroup,
      render: (r: BloodDonationBagRecord) => (
        <span className="px-1.5 py-0.5 rounded-[3px] font-bold text-[10.5px] bg-rose-50 text-rose-700 border border-rose-200">
          {r.bloodGroup}
        </span>
      ),
    },
    {
      key: 'donateDate',
      header: 'Donation Date',
      render: (r: BloodDonationBagRecord) => r.donateDate,
    },
    {
      key: 'volumeMl',
      header: 'Volume',
      align: 'right',
      render: (r: BloodDonationBagRecord) => `${r.volumeMl} ml`,
    },
    {
      key: 'lotNo',
      header: 'Lot No',
      render: (r: BloodDonationBagRecord) => (
        <span className="text-slate-600 font-mono text-[10.5px]">{r.lotNo}</span>
      ),
    },
    {
      key: 'component',
      header: 'Component',
      align: 'center',
      render: (r: BloodDonationBagRecord) => r.component,
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      render: (r: BloodDonationBagRecord) => r.expiryDate,
    },
    {
      key: 'screeningStatus',
      header: 'Screening Test',
      align: 'center',
      render: (r: BloodDonationBagRecord) => (
        <span className="px-1.5 py-0.5 rounded-[3px] font-semibold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          {r.screeningStatus}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      render: (r: BloodDonationBagRecord) => (
        <button
          type="button"
          onClick={() => setDonations((prev) => prev.filter((b) => b.id !== r.id))}
          className="w-5 h-5 rounded-[3px] border border-slate-300 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center cursor-pointer mx-auto"
          title="Delete record"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      ),
    },
  ];

  // Toolbar Filters matching PatientDirectory
  const toolbarFilters = (
    <>
      <div className="relative">
        <select
          aria-label="Filter by blood bank module"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as BloodBankTab)}
          className="h-8 pl-2.5 pr-7 rounded-[3px] border border-slate-200 bg-white text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#0094b6] cursor-pointer"
        >
          <option value="issues">Blood Issue Registry</option>
          <option value="donors">Blood Donors Directory</option>
          <option value="donations">Blood Donation Bags</option>
          <option value="stock">Components &amp; Reserve Matrix</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </>
  );

  // Toolbar Actions matching PatientDirectory
  const toolbarActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setShowIssueModal(true)}
        className="h-8 px-3 rounded-[3px] bg-[#0094b6] hover:bg-[#007f9c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Issue Blood</span>
      </button>

      <button
        type="button"
        onClick={() => setShowDonorModal(true)}
        className="h-8 px-2.5 rounded-[3px] bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Add Donor</span>
      </button>

      <button
        type="button"
        onClick={() => setShowDonationModal(true)}
        className="h-8 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <HeartHandshake className="w-3.5 h-3.5" />
        <span>Blood Donation</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 min-w-0 w-full overflow-hidden">
      {/* 4 Summary Metric Cards matching PatientDirectory format */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Cold Storage Reserve</span>
            <Droplets className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              {totalReserveBags} Units
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Total screened whole &amp; component bags</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Dispatched Issues</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-emerald-700 leading-none">
              {issues.length} Issues
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Cross-matched and released to wards</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Registered Donors</span>
            <Users className="w-3.5 h-3.5 text-[#0094b6]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-[#0094b6] leading-none">
              {donors.length} Donors
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Active voluntary &amp; replacement donors</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Screening Status</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-600 leading-none">
              {donations.length} Bags Tested
            </span>
          </div>
          <p className="text-[10px] text-slate-500">HIV, HBV, HCV, Syphilis, Malaria clear</p>
        </div>
      </div>

      {/* Real-Time 8-Group Blood Stock Ribbon */}
      <div className="bg-white border border-slate-300 rounded-[3px] p-2 shadow-xs">
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Droplet className="w-3.5 h-3.5 text-rose-600" />
            <span>Blood Group Reserve Telemetry</span>
            <span className="text-[10.5px] font-normal text-slate-500">
              (Total {totalReserveBags} Units In Cold Storage)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Low Stock
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> Critical
            </span>
          </div>
        </div>

        {/* 8 Blood Group Tiles */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {BLOOD_GROUP_STOCKS.map((st) => (
            <div
              key={st.group}
              className={`p-1.5 rounded-[3px] border flex flex-col justify-between transition-colors ${st.status === 'Critical'
                ? 'bg-rose-50/70 border-rose-300 text-rose-900'
                : st.status === 'Low'
                  ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-black">{st.group}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${st.status === 'Critical'
                    ? 'bg-rose-600'
                    : st.status === 'Low'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                    }`}
                />
              </div>
              <div className="my-0.5">
                <div className="text-sm font-extrabold leading-none">{st.totalBags}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Bags</div>
              </div>
              <div className="text-[8.5px] text-slate-500 border-t border-slate-200/50 pt-0.5 truncate">
                PRBC:{st.prbc} Plt:{st.platelets}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Blood Issue Slip Quick View Card */}
      {selectedIssue && (
        <div className="bg-white border border-[#0094b6]/30 rounded-md p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-rose-50 text-rose-600 font-bold text-sm flex items-center justify-center">
                {selectedIssue.bloodGroup}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedIssue.issueNo}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                    Bag #{selectedIssue.bagNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    {selectedIssue.crossMatchingStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-800">{selectedIssue.patientName}</strong> · Doctor: {selectedIssue.doctorName}
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
                onClick={() => setSelectedIssue(null)}
                className="w-8 h-8 rounded-[3px] border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                aria-label="Close issue quick view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Component</p>
              <p className="font-semibold text-slate-800">{selectedIssue.component}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Donor Name</p>
              <p className="font-medium text-slate-800">{selectedIssue.donorName}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Total Billed</p>
              <p className="font-bold text-slate-900">${selectedIssue.netAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Paid Amount</p>
              <p className="font-bold text-emerald-700">${selectedIssue.paidAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Tab View with DataTable */}
      {activeTab === 'issues' && (
        <DataTable<BloodIssueRecord>
          title="Blood Issue Registry"
          subtitle="Dispatched and cross-matched blood bags issued to inpatient departments"
          data={issues}
          columns={issueColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by issue no, patient, doctor, bag no, or blood group..."
          searchFilter={(r, q) =>
            r.issueNo.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.doctorName.toLowerCase().includes(q) ||
            r.bagNo.toLowerCase().includes(q) ||
            r.bloodGroup.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No blood issues found"
          emptyDescription="There are currently no blood issue records matching your search query."
        />
      )}

      {activeTab === 'donors' && (
        <DataTable<BloodDonorRecord>
          title="Blood Donor Directory"
          subtitle="Registered voluntary donors, blood groupings, and donation frequencies"
          data={donors}
          columns={donorColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by donor name, ID, blood group, or mobile..."
          searchFilter={(r, q) =>
            r.donorName.toLowerCase().includes(q) ||
            r.donorId.toLowerCase().includes(q) ||
            r.bloodGroup.toLowerCase().includes(q) ||
            r.mobile.includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No blood donors found"
          emptyDescription="No registered donor records matching your query."
        />
      )}

      {activeTab === 'donations' && (
        <DataTable<BloodDonationBagRecord>
          title="Blood Donation Inventory"
          subtitle="Screened whole blood bags and cold storage lot records"
          data={donations}
          columns={donationColumns}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Search by bag no, donor name, blood group, or lot..."
          searchFilter={(r, q) =>
            r.bagNo.toLowerCase().includes(q) ||
            r.donorName.toLowerCase().includes(q) ||
            r.bloodGroup.toLowerCase().includes(q) ||
            r.lotNo.toLowerCase().includes(q)
          }
          toolbarFilters={toolbarFilters}
          toolbarActions={toolbarActions}
          defaultPageSize={8}
          pageSizeOptions={[8, 12, 20, 30, 50, 100]}
          emptyTitle="No blood donation records found"
          emptyDescription="No collected blood bags found matching the filter."
        />
      )}

      {activeTab === 'stock' && (
        <div className="bg-white border border-slate-300 rounded-[3px] p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Blood Group &amp; Component Inventory Matrix
              </h3>
              <p className="text-[10.5px] text-slate-500">
                Detailed cold-storage inventory segmented by whole blood and component bags.
              </p>
            </div>
            <span className="text-xs font-bold text-[#006a4e]">
              Total Reserve: {totalReserveBags} Bags
            </span>
          </div>

          <div className="overflow-x-auto table-hover-scrollbar">
            <table className="w-full text-left text-[11px] border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-[#f1f5f9] text-slate-700 font-bold border-b border-slate-200 text-[10.5px]">
                  <th className="py-2 px-2.5 border-r border-slate-200/60">Blood Group</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 text-center">Status</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 text-center">Total Bags</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 text-center">Whole Blood</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 text-center">PRBC</th>
                  <th className="py-2 px-2.5 border-r border-slate-200/60 text-center">Platelets</th>
                  <th className="py-2 px-2.5 text-center">FFP (Plasma)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BLOOD_GROUP_STOCKS.map((st) => (
                  <tr key={st.group} className="hover:bg-slate-50 transition-colors">
                    <td className="py-1.5 px-2.5 border-r border-slate-200/60 font-black text-rose-700 text-xs">
                      {st.group}
                    </td>
                    <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded-[3px] font-semibold text-[9.5px] ${st.status === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : st.status === 'Low'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                          }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-center font-bold text-slate-900">
                      {st.totalBags}
                    </td>
                    <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-center text-slate-700">
                      {st.wholeBlood}
                    </td>
                    <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-center text-slate-700">
                      {st.prbc}
                    </td>
                    <td className="py-1.5 px-2.5 border-r border-slate-200/60 text-center text-slate-700">
                      {st.platelets}
                    </td>
                    <td className="py-1.5 px-2.5 text-center text-slate-700">
                      {st.ffp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Issue Blood */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Issue Blood / Component
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Patient Name (UHID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    placeholder="e.g. Rachel Priest (1162)"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Case ID
                  </label>
                  <input
                    type="text"
                    value={formCaseId}
                    onChange={(e) => setFormCaseId(e.target.value)}
                    placeholder="7495"
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-[#0094b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Blood Group *
                  </label>
                  <select
                    value={formBloodGroup}
                    onChange={(e) => setFormBloodGroup(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    {BLOOD_GROUP_STOCKS.map((st) => (
                      <option key={st.group} value={st.group}>
                        {st.group} ({st.totalBags} Avail)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Component *
                  </label>
                  <select
                    value={formComponent}
                    onChange={(e) => setFormComponent(e.target.value as any)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="PRBC">PRBC</option>
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Platelets">Platelets</option>
                    <option value="FFP">FFP</option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Bag No
                  </label>
                  <input
                    type="text"
                    value={formBagNo}
                    onChange={(e) => setFormBagNo(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Consultant Doctor
                  </label>
                  <select
                    value={formDoctorName}
                    onChange={(e) => setFormDoctorName(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Dr. Reyan Jain (9011)">Dr. Reyan Jain (9011)</option>
                    <option value="Dr. Kamrul Islam (9014)">Dr. Kamrul Islam (9014)</option>
                    <option value="Dr. Farhana Yasmin (9013)">Dr. Farhana Yasmin (9013)</option>
                    <option value="Prof. Dr. Tanvir Ahmed (9010)">Prof. Dr. Tanvir Ahmed (9010)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    value={formDonorName}
                    onChange={(e) => setFormDonorName(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              {/* Financial Row */}
              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-[3px]">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                    Discount ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
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
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#0094b6] hover:bg-[#007f9c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Issue Blood &amp; Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Donor */}
      {showDonorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900">
                  Register Blood Donor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDonorModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleDonorSubmit} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Donor Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Mahfuzul Alam"
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Blood Group
                  </label>
                  <select
                    value={donorGroup}
                    onChange={(e) => setDonorGroup(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    {BLOOD_GROUP_STOCKS.map((st) => (
                      <option key={st.group} value={st.group}>
                        {st.group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={donorAge}
                    onChange={(e) => setDonorAge(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Gender
                  </label>
                  <select
                    value={donorGender}
                    onChange={(e) => setDonorGender(e.target.value as any)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Mobile No
                  </label>
                  <input
                    type="text"
                    value={donorMobile}
                    onChange={(e) => setDonorMobile(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Father Name
                  </label>
                  <input
                    type="text"
                    value={donorFather}
                    onChange={(e) => setDonorFather(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Address
                </label>
                <input
                  type="text"
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDonorModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Register Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Receive Blood Donation */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-[3px] border border-slate-300 shadow-xl w-full max-w-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Receive Blood Donation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDonationModal(false)}
                className="w-5 h-5 rounded-[3px] text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleDonationSubmit} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                  Donor Name
                </label>
                <input
                  type="text"
                  required
                  value={donationDonorName}
                  onChange={(e) => setDonationDonorName(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Blood Group
                  </label>
                  <select
                    value={donationGroup}
                    onChange={(e) => setDonationGroup(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] bg-white text-[11px] focus:outline-none"
                  >
                    {BLOOD_GROUP_STOCKS.map((st) => (
                      <option key={st.group} value={st.group}>
                        {st.group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Bag No *
                  </label>
                  <input
                    type="text"
                    required
                    value={donationBagNo}
                    onChange={(e) => setDonationBagNo(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Volume (ml)
                  </label>
                  <input
                    type="number"
                    min={250}
                    max={500}
                    value={donationVolume}
                    onChange={(e) => setDonationVolume(Number(e.target.value))}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-0.5">
                    Lot / Batch No
                  </label>
                  <input
                    type="text"
                    value={donationLot}
                    onChange={(e) => setDonationLot(e.target.value)}
                    className="w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[11px] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-[3px] flex items-center gap-2 text-[10.5px] text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Screening protocol will automatically check HIV, HepB, HCV and VDRL.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="h-7 px-2.5 border border-slate-300 rounded-[3px] text-[11px] text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#006a4e] hover:bg-[#00523c] text-white rounded-[3px] text-[11px] font-semibold cursor-pointer shadow-xs"
                >
                  Store Bag in Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankDirectory;
