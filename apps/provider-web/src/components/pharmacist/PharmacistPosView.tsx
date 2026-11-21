import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Minus,
  PauseCircle,
  Phone,
  Plus,
  Printer,
  RotateCcw,
  Search,
  ShoppingCart,
  Smartphone,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react';

interface MedicineCatalogItem {
  id: string;
  barcode: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  rackLocation: string;
  batches: { batchNo: string; expiry: string; stock: number; mrp: number }[];
}

interface BillLineItem {
  id: string;
  medicineId: string;
  barcode: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  selectedBatch: string;
  expiry: string;
  stockAvailable: number;
  unitPrice: number;
  quantity: number;
  discountPercent: number;
}

interface HeldBill {
  id: string;
  billNo: string;
  customerName: string;
  customerPhone: string;
  customerType: 'walkin' | 'patient';
  patientUhid?: string;
  items: BillLineItem[];
  heldAt: string;
  totalAmount: number;
}

interface AdmittedPatient {
  uhid: string;
  name: string;
  age: number;
  gender: string;
  bedNo: string;
  ward: string;
  doctor: string;
  phone: string;
}

export const PharmacistPosView: React.FC = () => {
  // Master Medicine Catalog with Multiple Batches & Rack Locations
  const catalog: MedicineCatalogItem[] = [
    {
      id: 'MED-01',
      barcode: '89410101',
      brandName: 'Napa Extra',
      genericName: 'Paracetamol + Caffeine',
      dosageForm: 'Tablet',
      strength: '500mg + 65mg',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      rackLocation: 'Rack A-02',
      batches: [
        { batchNo: 'NP-2026-A1', expiry: '2026-12', stock: 450, mrp: 3.5 },
        { batchNo: 'NP-2027-B2', expiry: '2027-04', stock: 1200, mrp: 3.5 },
      ],
    },
    {
      id: 'MED-02',
      barcode: '89410102',
      brandName: 'Monas 10mg',
      genericName: 'Montelukast Sodium',
      dosageForm: 'Chewable Tab',
      strength: '10mg',
      manufacturer: 'Acme Laboratories Ltd.',
      rackLocation: 'Rack B-14',
      batches: [
        { batchNo: 'MN-2025-C4', expiry: '2027-04', stock: 220, mrp: 17.0 },
      ],
    },
    {
      id: 'MED-03',
      barcode: '89410103',
      brandName: 'Maxpro 20mg',
      genericName: 'Esomeprazole Magnesium',
      dosageForm: 'Capsule',
      strength: '20mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      rackLocation: 'Rack A-05',
      batches: [
        { batchNo: 'MX-2026-E2', expiry: '2026-11', stock: 340, mrp: 9.0 },
        { batchNo: 'MX-2027-F1', expiry: '2027-06', stock: 800, mrp: 9.0 },
      ],
    },
    {
      id: 'MED-04',
      barcode: '89410104',
      brandName: 'Azithrocin 500mg',
      genericName: 'Azithromycin Dihydrate',
      dosageForm: 'Tablet',
      strength: '500mg',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      rackLocation: 'Rack C-08',
      batches: [
        { batchNo: 'AZ-2025-B9', expiry: '2026-08', stock: 95, mrp: 35.0 },
      ],
    },
    {
      id: 'MED-05',
      barcode: '89410105',
      brandName: 'Bextram Gold',
      genericName: 'Multivitamin & Minerals',
      dosageForm: 'Tablet',
      strength: '32 Nutrients',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      rackLocation: 'Rack D-01',
      batches: [
        { batchNo: 'BX-2026-G1', expiry: '2027-01', stock: 180, mrp: 12.0 },
      ],
    },
    {
      id: 'MED-06',
      barcode: '89410106',
      brandName: 'Sergel 20mg',
      genericName: 'Esomeprazole Trihydrate',
      dosageForm: 'Capsule',
      strength: '20mg',
      manufacturer: 'Healthcare Pharmaceuticals',
      rackLocation: 'Rack A-08',
      batches: [
        { batchNo: 'SG-2025-X7', expiry: '2026-09', stock: 500, mrp: 8.0 },
      ],
    },
    {
      id: 'MED-07',
      barcode: '89410107',
      brandName: 'Ceftron 1g IV/IM',
      genericName: 'Ceftriaxone Sodium',
      dosageForm: 'Injection',
      strength: '1g',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      rackLocation: 'Cold Storage #2',
      batches: [
        { batchNo: 'CF-2026-04', expiry: '2026-10', stock: 85, mrp: 195.0 },
      ],
    },
    {
      id: 'MED-08',
      barcode: '89410108',
      brandName: 'Plagrin 75mg',
      genericName: 'Clopidogrel Bisulfate',
      dosageForm: 'Tablet',
      strength: '75mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      rackLocation: 'Rack B-03',
      batches: [
        { batchNo: 'CL-2026-03', expiry: '2027-02', stock: 240, mrp: 14.0 },
      ],
    },
    {
      id: 'MED-09',
      barcode: '89410109',
      brandName: 'ORS Oral Rehydration Salt',
      genericName: 'Oral Electrolyte Powder',
      dosageForm: 'Sachet',
      strength: 'Standard WHO Sachet',
      manufacturer: 'SMC Enterprise Ltd.',
      rackLocation: 'Rack E-02',
      batches: [
        { batchNo: 'ORS-2026-01', expiry: '2027-05', stock: 600, mrp: 6.0 },
      ],
    },
    {
      id: 'MED-10',
      barcode: '89410110',
      brandName: 'Savlon Antiseptic 100ml',
      genericName: 'Chlorhexidine + Cetrimide',
      dosageForm: 'Liquid',
      strength: '100ml',
      manufacturer: 'ACI Limited',
      rackLocation: 'Rack F-04',
      batches: [
        { batchNo: 'SV-2026-08', expiry: '2028-01', stock: 110, mrp: 48.0 },
      ],
    },
    {
      id: 'MED-11',
      barcode: '89410111',
      brandName: 'Ceevit 250mg',
      genericName: 'Ascorbic Acid (Vitamin C)',
      dosageForm: 'Chewable Tab',
      strength: '250mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      rackLocation: 'Rack D-04',
      batches: [
        { batchNo: 'CV-2026-99', expiry: '2027-08', stock: 350, mrp: 2.0 },
      ],
    },
    {
      id: 'MED-12',
      barcode: '89410112',
      brandName: 'Ace Plus',
      genericName: 'Paracetamol + Caffeine',
      dosageForm: 'Tablet',
      strength: '500mg + 65mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      rackLocation: 'Rack A-03',
      batches: [
        { batchNo: 'AC-2026-44', expiry: '2027-03', stock: 420, mrp: 3.0 },
      ],
    },
  ];

  // Admitted Inpatients Directory for UHID Billing
  const admittedPatients: AdmittedPatient[] = [
    {
      uhid: 'UHID-2026-1042',
      name: 'Mrs. Sultana Razia',
      age: 45,
      gender: 'Female',
      bedNo: 'Bed 402',
      ward: 'Inpatient General Ward',
      doctor: 'Dr. Sabrina Hossain',
      phone: '01712-445566',
    },
    {
      uhid: 'UHID-2026-1055',
      name: 'Mr. Kamal Uddin',
      age: 58,
      gender: 'Male',
      bedNo: 'Cabin 208',
      ward: 'Cardiology Care',
      doctor: 'Prof. Dr. Ahsan Ali',
      phone: '01819-332211',
    },
    {
      uhid: 'UHID-2026-1089',
      name: 'Master Ayan Ahmed',
      age: 8,
      gender: 'Male',
      bedNo: 'Bed P-04',
      ward: 'Pediatric Ward 3A',
      doctor: 'Dr. Fahmida Shireen',
      phone: '01911-889900',
    },
  ];

  // Fast OTC Quick-Add Medicines (Shwapno Touch Counter Style)
  const quickPickMedicines = [
    { id: 'MED-01', name: 'Napa Extra', price: '৳ 3.50', form: 'Tab' },
    { id: 'MED-03', name: 'Maxpro 20', price: '৳ 9.00', form: 'Cap' },
    { id: 'MED-02', name: 'Monas 10', price: '৳ 17.00', form: 'Tab' },
    { id: 'MED-06', name: 'Sergel 20', price: '৳ 8.00', form: 'Cap' },
    { id: 'MED-04', name: 'Azithrocin', price: '৳ 35.00', form: 'Tab' },
    { id: 'MED-09', name: 'ORS Saline', price: '৳ 6.00', form: 'Sachet' },
    { id: 'MED-10', name: 'Savlon 100ml', price: '৳ 48.00', form: 'Liquid' },
    { id: 'MED-11', name: 'Ceevit 250', price: '৳ 2.00', form: 'Tab' },
  ];

  // Bill & Header State
  const [billNo, setBillNo] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [customerType, setCustomerType] = useState<'walkin' | 'patient'>('walkin');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<AdmittedPatient | null>(null);
  const [prescribingDoctor, setPrescribingDoctor] = useState('OTC / Self-Prescribed');

  // Search & Cart
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<MedicineCatalogItem[]>([]);
  const [cart, setCart] = useState<BillLineItem[]>([
    {
      id: 'cart-1',
      medicineId: 'MED-01',
      barcode: '89410101',
      brandName: 'Napa Extra',
      genericName: 'Paracetamol + Caffeine',
      dosageForm: 'Tablet',
      strength: '500mg + 65mg',
      selectedBatch: 'NP-2026-A1',
      expiry: '2026-12',
      stockAvailable: 450,
      unitPrice: 3.5,
      quantity: 10,
      discountPercent: 0,
    },
    {
      id: 'cart-2',
      medicineId: 'MED-03',
      barcode: '89410103',
      brandName: 'Maxpro 20mg',
      genericName: 'Esomeprazole Magnesium',
      dosageForm: 'Capsule',
      strength: '20mg',
      selectedBatch: 'MX-2026-E2',
      expiry: '2026-11',
      stockAvailable: 340,
      unitPrice: 9.0,
      quantity: 14,
      discountPercent: 0,
    },
  ]);

  // Financial & Settlement State
  const [overallDiscountPercent, setOverallDiscountPercent] = useState<number>(0);
  const [tenderCash, setTenderCash] = useState<string>('200');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'card' | 'mfs' | 'credit'>('cash');
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [showHeldModal, setShowHeldModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [printSuccessModal, setPrintSuccessModal] = useState(false);
  const [lastCompletedBill, setLastCompletedBill] = useState<any>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode/search on load and keyboard hotkeys (F1, F2, F3, F4, F8, F10, Esc)
  useEffect(() => {
    searchInputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'F3' && cart.length > 0) {
        e.preventDefault();
        handleHoldBill();
      }
      if (e.key === 'F4' && heldBills.length > 0) {
        e.preventDefault();
        setShowHeldModal(true);
      }
      if (e.key === 'F8') {
        e.preventDefault();
        setShowPatientModal(true);
      }
      if (e.key === 'F10' && cart.length > 0) {
        e.preventDefault();
        handleCompleteSale();
      }
      if (e.key === 'Escape') {
        setShowHeldModal(false);
        setShowPatientModal(false);
        setShowShortcutsModal(false);
        setPrintSuccessModal(false);
        setSearchSuggestions([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, heldBills]);

  // Handle Search input change & live dropdown suggestions
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (!val.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const q = val.toLowerCase();
    const matches = catalog.filter(
      (m) =>
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.barcode.includes(q) ||
        m.manufacturer.toLowerCase().includes(q)
    );
    setSearchSuggestions(matches);
  };

  // Add Item to Bill
  const addItemToBill = (medicine: MedicineCatalogItem, chosenBatch?: any) => {
    const batch = chosenBatch || medicine.batches[0];
    const existing = cart.find(
      (item) => item.medicineId === medicine.id && item.selectedBatch === batch.batchNo
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const newLine: BillLineItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        medicineId: medicine.id,
        barcode: medicine.barcode,
        brandName: medicine.brandName,
        genericName: medicine.genericName,
        dosageForm: medicine.dosageForm,
        strength: medicine.strength,
        selectedBatch: batch.batchNo,
        expiry: batch.expiry,
        stockAvailable: batch.stock,
        unitPrice: batch.mrp,
        quantity: 1,
        discountPercent: 0,
      };
      setCart((prev) => [newLine, ...prev]);
    }

    setSearchInput('');
    setSearchSuggestions([]);
    searchInputRef.current?.focus();
  };

  // Quick Add helper from pill
  const handleQuickAdd = (medId: string) => {
    const med = catalog.find((m) => m.id === medId);
    if (med) {
      addItemToBill(med);
    }
  };

  // Barcode Submission
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const directMatch = catalog.find(
      (m) =>
        m.barcode === searchInput.trim() ||
        m.brandName.toLowerCase() === searchInput.trim().toLowerCase()
    );
    if (directMatch) {
      addItemToBill(directMatch);
    } else if (searchSuggestions.length > 0) {
      addItemToBill(searchSuggestions[0]);
    }
  };

  // Update item quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as BillLineItem[]
    );
  };

  const setDirectQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  // Change batch for a cart line item
  const changeBatch = (itemId: string, newBatchNo: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const med = catalog.find((m) => m.id === item.medicineId);
          const foundBatch = med?.batches.find((b) => b.batchNo === newBatchNo);
          if (foundBatch) {
            return {
              ...item,
              selectedBatch: foundBatch.batchNo,
              expiry: foundBatch.expiry,
              stockAvailable: foundBatch.stock,
              unitPrice: foundBatch.mrp,
            };
          }
        }
        return item;
      })
    );
  };

  // Bill Calculations
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const grossSubtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discountAmount = (grossSubtotal * overallDiscountPercent) / 100;
  const vatAmount = (grossSubtotal - discountAmount) * 0.05; // 5% Govt VAT
  const netPayable = Math.round(grossSubtotal - discountAmount + vatAmount);

  const tenderedNumeric = parseFloat(tenderCash) || 0;
  const changeDue = Math.max(0, Math.round(tenderedNumeric - netPayable));

  // Quick Cash Denomination buttons
  const addQuickTender = (amt: number) => {
    setTenderCash(amt.toString());
  };

  // Hold current bill
  const handleHoldBill = () => {
    if (cart.length === 0) return;
    const newHold: HeldBill = {
      id: `hold-${Date.now()}`,
      billNo,
      customerName,
      customerPhone,
      customerType,
      patientUhid: selectedPatient?.uhid,
      items: [...cart],
      heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalAmount: netPayable,
    };
    setHeldBills((prev) => [newHold, ...prev]);
    setCart([]);
    setBillNo(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  // Recall held bill
  const handleRecallBill = (held: HeldBill) => {
    setCart(held.items);
    setBillNo(held.billNo);
    setCustomerName(held.customerName);
    setCustomerPhone(held.customerPhone);
    setCustomerType(held.customerType);
    if (held.patientUhid) {
      const p = admittedPatients.find((pat) => pat.uhid === held.patientUhid);
      if (p) setSelectedPatient(p);
    }
    setHeldBills((prev) => prev.filter((h) => h.id !== held.id));
    setShowHeldModal(false);
  };

  // Select Admitted Patient
  const handleSelectPatient = (p: AdmittedPatient) => {
    setSelectedPatient(p);
    setCustomerType('patient');
    setCustomerName(p.name);
    setCustomerPhone(p.phone);
    setPrescribingDoctor(p.doctor);
    setShowPatientModal(false);
  };

  // Complete & Checkout
  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    const saleRecord = {
      billNo,
      customerName: selectedPatient ? `${selectedPatient.name} (${selectedPatient.uhid})` : customerName,
      customerPhone: selectedPatient ? selectedPatient.phone : customerPhone,
      customerType,
      bedNo: selectedPatient?.bedNo,
      ward: selectedPatient?.ward,
      doctor: prescribingDoctor,
      items: cart,
      subtotal: grossSubtotal,
      discount: discountAmount,
      vat: vatAmount,
      total: netPayable,
      tendered: tenderedNumeric,
      change: changeDue,
      paymentMode,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setLastCompletedBill(saleRecord);
    setPrintSuccessModal(true);
    setCart([]);
    setBillNo(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setSelectedPatient(null);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
  };

  return (
    <div className="space-y-2 select-none">
      {/* 1. Top Enterprise Register Session Ribbon */}
      <div className="bg-[#0c2e4b] text-white rounded-[3px] p-2.5 px-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse" />
            <span className="font-bold tracking-tight text-white">Green Hospital Pharmacy POS</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200 font-medium">Terminal POS-02 (Counter 2)</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-200">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cashier: <strong className="text-white">Md. Rafiqul Islam</strong> (Shift A)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Quick Action Hotkey Buttons */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="px-2 py-0.5 rounded-[3px] bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="View keyboard hotkeys [F1]"
          >
            <HelpCircle className="w-3 h-3 text-slate-300" />
            <span>Hotkeys [F1]</span>
          </button>

          {/* Held Bills Badge & Trigger */}
          <button
            type="button"
            onClick={() => setShowHeldModal(true)}
            className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              heldBills.length > 0
                ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Recall parked bills [F4]"
          >
            <PauseCircle className="w-3 h-3" />
            <span>Parked ({heldBills.length}) [F4]</span>
          </button>

          {/* Reprint Last Bill */}
          {lastCompletedBill && (
            <button
              type="button"
              onClick={() => setPrintSuccessModal(true)}
              className="px-2 py-0.5 rounded-[3px] bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Reprint last completed receipt"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              <span>Reprint Last</span>
            </button>
          )}

          {/* Real-time Clock */}
          <div className="text-slate-300 font-mono text-[11px] bg-slate-900/70 px-2 py-0.5 rounded-[3px] border border-slate-700 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Active Bill Number */}
          <div className="font-mono font-bold text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-[3px] border border-emerald-500/40">
            {billNo}
          </div>
        </div>
      </div>

      {/* 2. Customer & Inpatient Quick Profile Ribbon */}
      <div className="bg-white border border-slate-200/90 rounded-[3px] p-2.5 px-3 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-2.5 text-xs items-center">
        {/* Customer Type Selector */}
        <div className="md:col-span-3 flex items-center gap-1.5">
          <span className="text-slate-500 font-semibold whitespace-nowrap">Mode:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-[3px] border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setCustomerType('walkin');
                setSelectedPatient(null);
                setCustomerName('Walk-in Customer');
                setPrescribingDoctor('OTC / Self-Prescribed');
              }}
              className={`px-2.5 py-1 rounded-[2px] text-xs font-semibold cursor-pointer transition-all ${
                customerType === 'walkin'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Walk-in (OTC)
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomerType('patient');
                setShowPatientModal(true);
              }}
              className={`px-2.5 py-1 rounded-[2px] text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                customerType === 'patient'
                  ? 'bg-[#006a4e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Lookup Hospital Inpatient [F8]"
            >
              <Building2 className="w-3 h-3" />
              <span>Hospital UHID [F8]</span>
            </button>
          </div>
        </div>

        {/* Customer / Patient Name Display & Edit */}
        <div className="md:col-span-3">
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] focus:bg-white focus:outline-none focus:border-[#006a4e] font-medium"
            />
          </div>
        </div>

        {/* Customer Phone & Loyalty */}
        <div className="md:col-span-3">
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Mobile Phone (017...)"
              className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] focus:bg-white focus:outline-none focus:border-[#006a4e] font-medium"
            />
          </div>
        </div>

        {/* Prescribing Doctor / Inpatient Bed Reference */}
        <div className="md:col-span-3 flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={prescribingDoctor}
              onChange={(e) => setPrescribingDoctor(e.target.value)}
              placeholder="Doctor / Prescriber..."
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] focus:bg-white focus:outline-none focus:border-[#006a4e] font-medium"
            />
          </div>
          {customerType === 'patient' && selectedPatient && (
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-[3px] border border-emerald-200 whitespace-nowrap">
              {selectedPatient.bedNo}
            </span>
          )}
        </div>
      </div>

      {/* 3. Main Operational Workstation: Barcode Scanner + Scanned Items Grid + Right Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* Left 8 Cols: Barcode Input + Quick OTC Pills + Live Table */}
        <div className="lg:col-span-8 space-y-2">
          {/* Universal Barcode Scanner & Live Autocomplete Box */}
          <div className="relative bg-white border border-slate-200/90 rounded-[3px] p-2 shadow-xs">
            <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Scan barcode or type medicine brand / generic name (Hotkey: F2)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#f8faf9] border border-slate-200 rounded-[3px] focus:outline-none focus:border-[#006a4e] focus:bg-white font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item [Enter]</span>
              </button>
            </form>

            {/* Instant Floating Autocomplete Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="absolute left-2 right-2 top-full mt-1 bg-white rounded-[3px] border border-slate-300 shadow-xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 flex items-center justify-between">
                  <span>Found {searchSuggestions.length} Matching Medicines in Formulary</span>
                  <span>Click to add with Earliest FEFO Batch</span>
                </div>
                {searchSuggestions.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => addItemToBill(med)}
                    className="p-2.5 hover:bg-emerald-50/60 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{med.brandName}</span>
                        <span className="text-[11px] text-slate-500 font-medium">({med.genericName} • {med.strength})</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                          {med.dosageForm}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{med.manufacturer}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">Barcode: {med.barcode}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">{med.rackLocation}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-[#006a4e] text-xs font-mono">
                        ৳ {med.batches[0]?.mrp.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Batch: <span className="font-semibold text-slate-700">{med.batches[0]?.batchNo}</span> (Stock: {med.batches[0]?.stock})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shwapno-Style Fast Moving Medicines Quick Bar (Touch / Click Pills) */}
          <div className="bg-white border border-slate-200/90 rounded-[3px] p-2 px-3 shadow-xs flex items-center gap-2 text-xs overflow-x-auto">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Fast OTC:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {quickPickMedicines.map((qp) => (
                <button
                  key={qp.id}
                  type="button"
                  onClick={() => handleQuickAdd(qp.id)}
                  className="px-2 py-1 rounded-[3px] bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 text-[11px] font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
                >
                  <Plus className="w-2.5 h-2.5 text-emerald-600" />
                  <span>{qp.name}</span>
                  <span className="font-mono font-bold text-emerald-700">{qp.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core POS Data Grid Table */}
          <div className="bg-white border border-slate-200/90 rounded-[3px] shadow-xs overflow-hidden">
            <div className="p-2.5 px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5 text-[#006a4e]" />
                <span className="font-bold text-slate-800">Scanned Order Items</span>
                <span className="text-slate-500 font-medium">({cart.length} SKUs in active ticket)</span>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleHoldBill}
                      className="px-2.5 py-1 rounded-[3px] bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Park / Hold bill to serve next customer [F3]"
                    >
                      <PauseCircle className="w-3 h-3 text-amber-600" />
                      <span>Hold Bill [F3]</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCart([])}
                      className="px-2.5 py-1 rounded-[3px] bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto min-h-[340px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c2e4b] text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Medicine & Generic</th>
                    <th className="py-2.5 px-3 min-w-[140px]">FEFO Batch & Expiry</th>
                    <th className="py-2.5 px-2 text-center w-16">Stock</th>
                    <th className="py-2.5 px-3 text-center min-w-[120px]">Qty</th>
                    <th className="py-2.5 px-3 text-right w-20">Unit MRP</th>
                    <th className="py-2.5 px-3 text-right min-w-[90px]">Total (৳)</th>
                    <th className="py-2.5 px-2 text-center w-12">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-24 text-center text-slate-400">
                        <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
                        <p className="font-semibold text-slate-700 text-sm">Cart is currently empty</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                          Scan a barcode, search formulary by pressing <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono text-slate-700">F2</kbd>, or click Fast OTC pills above to begin cashiering.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    cart.map((item, idx) => {
                      const catalogEntry = catalog.find((m) => m.id === item.medicineId);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{item.brandName}</div>
                            <div className="text-[11px] text-slate-500">{item.genericName} ({item.strength})</div>
                            <div className="text-[10px] text-[#006a4e] font-mono mt-0.5">
                              {item.dosageForm} • Barcode: {item.barcode}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            {catalogEntry && catalogEntry.batches.length > 1 ? (
                              <select
                                value={item.selectedBatch}
                                onChange={(e) => changeBatch(item.id, e.target.value)}
                                className="font-mono text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#006a4e]"
                              >
                                {catalogEntry.batches.map((b) => (
                                  <option key={b.batchNo} value={b.batchNo}>
                                    {b.batchNo} (Exp: {b.expiry})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div>
                                <span className="font-mono font-bold text-slate-800 text-[11px] block">
                                  {item.selectedBatch}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">Exp: {item.expiry}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-600 text-[11px]">
                            <span className={item.stockAvailable < 50 ? 'text-amber-600 font-bold' : ''}>
                              {item.stockAvailable}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => setDirectQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 text-center py-0.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-[2px] text-xs focus:outline-none focus:border-[#006a4e]"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                            ৳ {item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 font-mono">
                            ৳ {(item.unitPrice * item.quantity).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Quick Bar: Item counts & Fast shortcuts */}
            <div className="p-2.5 px-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-4">
                <span>Total SKUs: <strong className="text-slate-900">{cart.length} items</strong></span>
                <span>Total Quantity: <strong className="text-slate-900">{totalUnits} units</strong></span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>Hotkeys:</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">F2: Search</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">F3: Hold</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">F8: UHID</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">F10: Checkout</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Settlement / Cash Register Console */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white border border-slate-200/90 rounded-[3px] shadow-xs p-3.5 space-y-3">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Payment & Settlement Console</span>
              <span className="text-[11px] text-slate-500 font-mono">Register #02</span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Subtotal</span>
                <span className="font-semibold text-slate-900 font-mono">৳ {grossSubtotal.toFixed(2)}</span>
              </div>

              {/* Special Discount Row */}
              <div className="flex items-center justify-between text-slate-600">
                <span>Special Discount</span>
                <div className="flex items-center gap-1">
                  {[0, 5, 7.5, 10].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setOverallDiscountPercent(d)}
                      className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold cursor-pointer transition-colors ${
                        overallDiscountPercent === d
                          ? 'bg-[#006a4e] text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {d}%
                    </button>
                  ))}
                  <span className="font-mono text-rose-600 text-xs font-semibold ml-1">
                    -৳ {discountAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Govt VAT (5%)</span>
                <span className="font-mono text-slate-700">৳ {vatAmount.toFixed(2)}</span>
              </div>

              {/* Net Payable Big High-Contrast Display */}
              <div className="p-3 rounded-[3px] bg-[#0c2e4b] text-white flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold tracking-wide text-emerald-400 block">
                    Net Payable
                  </span>
                  <span className="text-[10px] text-slate-300">Inclusive of 5% tax</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white font-mono leading-none tracking-tight">
                    ৳ {netPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-600 block">Payment Mode</span>
              <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`py-2 text-center rounded-[3px] border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    paymentMode === 'cash'
                      ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('card')}
                  className={`py-2 text-center rounded-[3px] border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    paymentMode === 'card'
                      ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card / POS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('mfs')}
                  className={`py-2 text-center rounded-[3px] border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    paymentMode === 'mfs'
                      ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>bKash / MFS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('credit')}
                  className={`py-2 text-center rounded-[3px] border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    paymentMode === 'credit'
                      ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>IPD Ledger</span>
                </button>
              </div>
            </div>

            {/* Tender Amount & Change Due Calculation (Shwapno Superstore Standard) */}
            <div className="p-2.5 rounded-[3px] bg-slate-50 border border-slate-200 space-y-2 text-xs">
              {/* Quick Cash Note Denomination Buttons */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Quick Cash Notes:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => addQuickTender(netPayable)}
                    className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] cursor-pointer"
                    title="Exact Amount"
                  >
                    Exact
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuickTender(100)}
                    className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono font-bold text-[10px] cursor-pointer"
                  >
                    ৳100
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuickTender(500)}
                    className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono font-bold text-[10px] cursor-pointer"
                  >
                    ৳500
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuickTender(1000)}
                    className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono font-bold text-[10px] cursor-pointer"
                  >
                    ৳1000
                  </button>
                </div>
              </div>

              {/* Cash Tendered Input */}
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-semibold">Cash Tendered / Received</label>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    value={tenderCash}
                    onChange={(e) => setTenderCash(e.target.value)}
                    className="w-full text-right pr-2.5 pl-6 py-1 font-bold text-slate-900 bg-white border border-slate-300 rounded-[2px] focus:outline-none focus:border-[#006a4e]"
                  />
                </div>
              </div>

              {/* Change to Return Display */}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/80">
                <span className="text-slate-700 font-semibold">Change to Return</span>
                <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ৳ {changeDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Complete Sale & Print Receipt Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCompleteSale}
              className="w-full py-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Complete Sale & Print Receipt [F10] (৳ {netPayable})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hospital Inpatient UHID Directory Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-300 w-full max-w-xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#006a4e]" />
                <h3 className="font-bold text-sm text-slate-900">Hospital Admitted Patients (UHID Lookup)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPatientModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {admittedPatients.map((pat) => (
                <div
                  key={pat.uhid}
                  onClick={() => handleSelectPatient(pat)}
                  className="p-3 rounded-[3px] border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{pat.name}</span>
                      <span className="font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                        {pat.uhid}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {pat.age}y/{pat.gender} • <strong className="text-slate-700">{pat.bedNo}</strong> ({pat.ward})
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Consultant: {pat.doctor} • Phone: {pat.phone}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-[3px] bg-[#006a4e] text-white font-semibold cursor-pointer shrink-0"
                  >
                    Select Patient
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Held Bills (Parked Queues) Modal */}
      {showHeldModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-300 w-full max-w-lg p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <PauseCircle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">Held Bills (Parked Queues)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHeldModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {heldBills.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <PauseCircle className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                <p>No bills currently parked on hold.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {heldBills.map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 rounded-[3px] border border-slate-200 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {h.customerName} ({h.billNo})
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {h.items.length} items • Parked at {h.heldAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#006a4e] font-mono">৳ {h.totalAmount}</span>
                      <button
                        type="button"
                        onClick={() => handleRecallBill(h)}
                        className="px-2.5 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white font-semibold cursor-pointer"
                      >
                        Recall
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-300 w-full max-w-md p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0c2e4b]" />
                <h3 className="font-bold text-sm text-slate-900">Keyboard Shortcuts (Fast Cashiering)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Focus Barcode / Medicine Search</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">F2</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Park / Hold Current Bill</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">F3</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Recall Parked Bills</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">F4</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Lookup Hospital Inpatient (UHID)</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">F8</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Complete Sale & Print Receipt</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">F10</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Close Open Modal / Dialog</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESC/POS 80mm Thermal Receipt Print Preview Modal */}
      {printSuccessModal && lastCompletedBill && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-300 w-full max-w-sm p-4 space-y-3 font-mono text-xs">
            <div className="text-center border-b border-dashed border-slate-300 pb-2">
              <h2 className="font-bold text-sm text-slate-900">Green Hospital Pharmacy</h2>
              <p className="text-[10px] text-slate-500">Dhanmondi, Dhaka-1205 • Tel: +880 1711-000005</p>
              <p className="text-[10px] text-slate-600 mt-1">Invoice: {lastCompletedBill.billNo}</p>
              <p className="text-[10px] text-slate-400">{lastCompletedBill.date} • {lastCompletedBill.time}</p>
            </div>

            <div className="text-[11px] text-slate-600 space-y-0.5">
              <p>Customer: <strong className="text-slate-900">{lastCompletedBill.customerName}</strong></p>
              {lastCompletedBill.customerPhone && <p>Phone: {lastCompletedBill.customerPhone}</p>}
              {lastCompletedBill.bedNo && <p>Bed/Ward: {lastCompletedBill.bedNo} ({lastCompletedBill.ward})</p>}
              <p>Cashier: Md. Rafiqul Islam (Pos-02)</p>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
              {lastCompletedBill.items.map((it: any, i: number) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="truncate max-w-[180px]">{it.brandName} x{it.quantity}</span>
                  <span className="font-bold">৳ {(it.unitPrice * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between">
                <span>Gross Subtotal:</span>
                <span>৳ {lastCompletedBill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Special Discount:</span>
                <span>-৳ {lastCompletedBill.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Govt VAT (5%):</span>
                <span>৳ {lastCompletedBill.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-slate-200 pt-1">
                <span>Paid Total:</span>
                <span>৳ {lastCompletedBill.total}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-0.5">
                <span>Tendered:</span>
                <span>৳ {lastCompletedBill.tendered}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Change Returned:</span>
                <span>৳ {lastCompletedBill.change}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-2">
              Thank you for choosing Green Hospital Pharmacy!
              <br />
              Medicines once sold can only be returned if foil is intact within 7 days.
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-1.5 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Thermal Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintSuccessModal(false)}
                className="px-4 py-1.5 rounded-[3px] border border-slate-300 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
