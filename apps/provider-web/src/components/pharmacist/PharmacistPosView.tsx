import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  FileText,
  HelpCircle,
  Minus,
  PauseCircle,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { PharmacistReceiptView } from './PharmacistReceiptView';
import { PharmacistCheckoutView } from './PharmacistCheckoutView';
import { getAuthSession } from '../../utils/auth';
import { CURRENT_PATIENT } from '../../data/patientPortalData';
import { CURRENT_PHARMACIST } from '../../data/pharmacistPortalData';

export interface PosMedicine {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  unit: string;
  units_per_strip: number;
  units_per_box: number;
  requires_prescription: boolean;
  selling_price: number;
  box_selling_price?: number;
  available_stock: number;
  rackLocation: string;
  batches: { batchNo: string; expiry: string; stock: number; mrp: number }[];
}

export type SaleUnit = 'piece' | 'strip' | 'box';
export type DiscountType = 'fixed' | 'percent';

export interface CrmCustomer {
  id: string;
  name: string;
  phone?: string;
  loyalty_points: number;
  allergies?: string;
  uhid?: string;
  bedNo?: string;
  ward?: string;
  doctor?: string;
}

export interface CartItem {
  medicine: PosMedicine;
  qty: number;
  saleUnit: SaleUnit;
  selectedBatch: string;
}

export interface HeldBill {
  id: string;
  billNo: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  heldAt: string;
  totalAmount: number;
}

export interface BarcodeScanFeedback {
  ok: boolean;
  tone: 'success' | 'warning' | 'error';
  message: string;
}

function getPackSize(med: PosMedicine, unit: SaleUnit): number {
  if (unit === 'box') return Math.max(1, med.units_per_box || 1);
  if (unit === 'strip') return Math.max(1, med.units_per_strip || 1);
  return 1;
}

function getPackUnitPrice(med: PosMedicine, unit: SaleUnit): number {
  if (unit === 'box') {
    if (med.box_selling_price && med.box_selling_price > 0) {
      return med.box_selling_price;
    }
    return Math.round(med.selling_price * getPackSize(med, 'box') * 100) / 100;
  }
  if (unit === 'strip') {
    return Math.round(med.selling_price * getPackSize(med, 'strip') * 100) / 100;
  }
  return med.selling_price;
}

function getMaxSelectableQty(med: PosMedicine, unit: SaleUnit): number {
  return Math.floor(med.available_stock / getPackSize(med, unit));
}

// In-Cart Quantity Stepper with keyboard commit
function CartQtyInput({
  qty,
  max,
  name,
  onChangeQty,
}: {
  qty: number;
  max: number;
  name: string;
  onChangeQty: (nextQty: number) => void;
}) {
  const [draft, setDraft] = useState(String(qty));

  useEffect(() => {
    setDraft(String(qty));
  }, [qty]);

  const commitDraft = () => {
    const parsed = parseInt(draft, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setDraft('1');
      onChangeQty(1);
      return;
    }
    const clamped = Math.min(max, parsed);
    setDraft(String(clamped));
    onChangeQty(clamped);
  };

  return (
    <input
      type="number"
      min={1}
      max={max}
      value={draft}
      aria-label={`${name} quantity`}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        const parsed = parseInt(raw, 10);
        if (!Number.isNaN(parsed) && parsed >= 1) {
          onChangeQty(Math.min(max, parsed));
        }
      }}
      onBlur={commitDraft}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitDraft();
          (e.currentTarget as HTMLInputElement).blur();
        }
      }}
      onFocus={(e) => e.currentTarget.select()}
      className="h-6 w-11 rounded-[3px] border border-slate-200 bg-white px-1 text-center text-xs font-bold tabular-nums text-slate-900 focus:outline-none focus:ring-0"
    />
  );
}

export interface PharmacistPosViewProps {
  onNavigate?: (module: string) => void;
}

export const PharmacistPosView: React.FC<PharmacistPosViewProps> = ({ onNavigate: _onNavigate }) => {
  // Master Medicine Catalog with Multiple Batches, Packaging Specs, and Barcodes
  const medicines: PosMedicine[] = [
    {
      id: '1',
      sku: 'MED-01',
      barcode: '89410101',
      name: 'Napa Extra',
      generic_name: 'Paracetamol + Caffeine',
      dosage_form: 'Tablet',
      strength: '500mg + 65mg',
      unit: 'pcs',
      units_per_strip: 10,
      units_per_box: 200,
      requires_prescription: false,
      selling_price: 3.5,
      box_selling_price: 680,
      available_stock: 450,
      rackLocation: 'Rack A-02',
      batches: [
        { batchNo: 'NP-2026-A1', expiry: '2026-12', stock: 450, mrp: 3.5 },
        { batchNo: 'NP-2027-B2', expiry: '2027-04', stock: 1200, mrp: 3.5 },
      ],
    },
    {
      id: '2',
      sku: 'MED-02',
      barcode: '89410102',
      name: 'Monas 10mg',
      generic_name: 'Montelukast Sodium',
      dosage_form: 'Chewable Tab',
      strength: '10mg',
      unit: 'pcs',
      units_per_strip: 10,
      units_per_box: 30,
      requires_prescription: false,
      selling_price: 17.0,
      box_selling_price: 495,
      available_stock: 220,
      rackLocation: 'Rack B-14',
      batches: [
        { batchNo: 'MN-2025-C4', expiry: '2027-04', stock: 220, mrp: 17.0 },
      ],
    },
    {
      id: '3',
      sku: 'MED-03',
      barcode: '89410103',
      name: 'Maxpro 20mg',
      generic_name: 'Esomeprazole Magnesium',
      dosage_form: 'Capsule',
      strength: '20mg',
      unit: 'pcs',
      units_per_strip: 14,
      units_per_box: 70,
      requires_prescription: false,
      selling_price: 9.0,
      box_selling_price: 610,
      available_stock: 340,
      rackLocation: 'Rack A-05',
      batches: [
        { batchNo: 'MX-2026-E2', expiry: '2026-11', stock: 340, mrp: 9.0 },
        { batchNo: 'MX-2027-F1', expiry: '2027-06', stock: 800, mrp: 9.0 },
      ],
    },
    {
      id: '4',
      sku: 'MED-04',
      barcode: '89410104',
      name: 'Azithrocin 500mg',
      generic_name: 'Azithromycin Dihydrate',
      dosage_form: 'Tablet',
      strength: '500mg',
      unit: 'pcs',
      units_per_strip: 6,
      units_per_box: 18,
      requires_prescription: true,
      selling_price: 35.0,
      box_selling_price: 615,
      available_stock: 95,
      rackLocation: 'Rack C-08',
      batches: [
        { batchNo: 'AZ-2025-B9', expiry: '2026-08', stock: 95, mrp: 35.0 },
      ],
    },
    {
      id: '5',
      sku: 'MED-05',
      barcode: '89410105',
      name: 'Bextram Gold',
      generic_name: 'Multivitamin & Minerals',
      dosage_form: 'Tablet',
      strength: '32 Nutrients',
      unit: 'pcs',
      units_per_strip: 15,
      units_per_box: 30,
      requires_prescription: false,
      selling_price: 12.0,
      box_selling_price: 350,
      available_stock: 180,
      rackLocation: 'Rack D-01',
      batches: [
        { batchNo: 'BX-2026-G1', expiry: '2027-01', stock: 180, mrp: 12.0 },
      ],
    },
    {
      id: '6',
      sku: 'MED-06',
      barcode: '89410106',
      name: 'Sergel 20mg',
      generic_name: 'Esomeprazole Trihydrate',
      dosage_form: 'Capsule',
      strength: '20mg',
      unit: 'pcs',
      units_per_strip: 14,
      units_per_box: 70,
      requires_prescription: false,
      selling_price: 8.0,
      box_selling_price: 540,
      available_stock: 500,
      rackLocation: 'Rack A-08',
      batches: [
        { batchNo: 'SG-2025-X7', expiry: '2026-09', stock: 500, mrp: 8.0 },
      ],
    },
    {
      id: '7',
      sku: 'MED-07',
      barcode: '89410107',
      name: 'Ceftron 1g IV/IM',
      generic_name: 'Ceftriaxone Sodium',
      dosage_form: 'Injection',
      strength: '1g',
      unit: 'vial',
      units_per_strip: 1,
      units_per_box: 10,
      requires_prescription: true,
      selling_price: 195.0,
      box_selling_price: 1900,
      available_stock: 85,
      rackLocation: 'Cold Storage #2',
      batches: [
        { batchNo: 'CF-2026-04', expiry: '2026-10', stock: 85, mrp: 195.0 },
      ],
    },
    {
      id: '8',
      sku: 'MED-08',
      barcode: '89410108',
      name: 'Plagrin 75mg',
      generic_name: 'Clopidogrel Bisulfate',
      dosage_form: 'Tablet',
      strength: '75mg',
      unit: 'pcs',
      units_per_strip: 10,
      units_per_box: 30,
      requires_prescription: true,
      selling_price: 14.0,
      box_selling_price: 410,
      available_stock: 240,
      rackLocation: 'Rack B-03',
      batches: [
        { batchNo: 'CL-2026-03', expiry: '2027-02', stock: 240, mrp: 14.0 },
      ],
    },
    {
      id: '9',
      sku: 'MED-09',
      barcode: '89410109',
      name: 'ORS Oral Saline',
      generic_name: 'Oral Electrolyte Powder',
      dosage_form: 'Sachet',
      strength: 'Standard WHO Sachet',
      unit: 'sachet',
      units_per_strip: 1,
      units_per_box: 25,
      requires_prescription: false,
      selling_price: 6.0,
      box_selling_price: 145,
      available_stock: 600,
      rackLocation: 'Rack E-02',
      batches: [
        { batchNo: 'ORS-2026-01', expiry: '2027-05', stock: 600, mrp: 6.0 },
      ],
    },
    {
      id: '10',
      sku: 'MED-10',
      barcode: '89410110',
      name: 'Savlon Antiseptic 100ml',
      generic_name: 'Chlorhexidine + Cetrimide',
      dosage_form: 'Liquid',
      strength: '100ml',
      unit: 'bottle',
      units_per_strip: 1,
      units_per_box: 12,
      requires_prescription: false,
      selling_price: 48.0,
      box_selling_price: 560,
      available_stock: 110,
      rackLocation: 'Rack F-04',
      batches: [
        { batchNo: 'SV-2026-08', expiry: '2028-01', stock: 110, mrp: 48.0 },
      ],
    },
    {
      id: '11',
      sku: 'MED-11',
      barcode: '89410111',
      name: 'Ceevit 250mg',
      generic_name: 'Ascorbic Acid (Vitamin C)',
      dosage_form: 'Chewable Tab',
      strength: '250mg',
      unit: 'pcs',
      units_per_strip: 10,
      units_per_box: 100,
      requires_prescription: false,
      selling_price: 2.0,
      box_selling_price: 190,
      available_stock: 350,
      rackLocation: 'Rack D-04',
      batches: [
        { batchNo: 'CV-2026-99', expiry: '2027-08', stock: 350, mrp: 2.0 },
      ],
    },
  ];

  // Registered CRM Customers & Admitted Hospital Patients
  const customers: CrmCustomer[] = [
    {
      id: 'cust-1',
      name: 'Mrs. Sultana Razia',
      phone: '01712-445566',
      loyalty_points: 120,
      allergies: 'Penicillin, Sulfa Drugs',
      uhid: 'UHID-2026-1042',
      bedNo: 'Bed 402',
      ward: 'Inpatient General Ward',
      doctor: 'Dr. Sabrina Hossain',
    },
    {
      id: 'cust-2',
      name: 'Mr. Kamal Uddin',
      phone: '01819-332211',
      loyalty_points: 340,
      allergies: 'Aspirin (Bronchospasm)',
      uhid: 'UHID-2026-1055',
      bedNo: 'Cabin 208',
      ward: 'Cardiology Care',
      doctor: 'Prof. Dr. Ahsan Ali',
    },
    {
      id: 'cust-3',
      name: 'Dr. Tariqul Islam',
      phone: '01911-889900',
      loyalty_points: 580,
      uhid: 'UHID-2026-1089',
      bedNo: 'Doctor OPD #04',
      ward: 'Hospital Staff Care',
      doctor: 'Self / Consultant',
    },
  ];

  // State
  const [billNo, setBillNo] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [query, setQuery] = useState('');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'in_stock' | 'rx'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerType, setCustomerType] = useState<'walkin' | 'member'>('walkin');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState(() => {
    const session = getAuthSession();
    return session?.role.id === 'patient' ? CURRENT_PATIENT.name : CURRENT_PATIENT.name;
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    const session = getAuthSession();
    return session?.role.id === 'patient' ? CURRENT_PATIENT.phone : CURRENT_PATIENT.phone;
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mfs' | 'credit'>('cash');
  const [discountType, setDiscountType] = useState<DiscountType>('fixed');
  const [discount, setDiscount] = useState('0');
  const [tenderCash, setTenderCash] = useState<string>('0');
  const [isTenderCustom, setIsTenderCustom] = useState(false);
  const [scanStatus, setScanStatus] = useState<BarcodeScanFeedback | null>(null);
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [showHeldModal, setShowHeldModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Tariqul Islam (Cardiology)');
  const [careLocation, setCareLocation] = useState('Outpatient Dispensary (Counter 02)');
  const [currentView, setCurrentView] = useState<'pos' | 'checkout' | 'receipt'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.endsWith('/checkout')) return 'checkout';
      if (window.location.pathname.endsWith('/receipt')) return 'receipt';
    }
    return 'pos';
  });
  const [lastCompletedBill, setLastCompletedBill] = useState<any>(null);

  const scanInputRef = useRef<HTMLInputElement>(null);

  // Synchronize browser history / popstate for checkout and receipt pages
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.endsWith('/checkout')) {
        setCurrentView('checkout');
      } else if (window.location.pathname.endsWith('/receipt')) {
        setCurrentView('receipt');
      } else {
        setCurrentView('pos');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-focus barcode/search on load and keyboard hotkeys (F1, F2, F3, F4, F10, Esc)
  useEffect(() => {
    scanInputRef.current?.focus({ preventScroll: true });
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';

      if (e.key === 'F1') {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
      if (e.key === 'F2' || (!isEditable && e.key === '/')) {
        e.preventDefault();
        scanInputRef.current?.focus();
        scanInputRef.current?.select();
      }
      if (e.key === 'F3' && cart.length > 0) {
        e.preventDefault();
        handleHoldBill();
      }
      if (e.key === 'F4' && heldBills.length > 0) {
        e.preventDefault();
        setShowHeldModal(true);
      }
      if (e.key === 'F10' && cart.length > 0) {
        e.preventDefault();
        handleGoToCheckout();
      }
      if (e.key === 'Escape') {
        setShowHeldModal(false);
        setShowShortcutsModal(false);
      }

      // Auto capture barcode scanner wedged strokes when not inside an input
      if (
        !isEditable &&
        e.key.length === 1 &&
        e.key !== ' ' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        scanInputRef.current?.focus();
        setQuery((prev) => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [cart, heldBills]);

  // Dismiss scan status banner after 3.5 seconds
  useEffect(() => {
    if (!scanStatus) return;
    const timer = window.setTimeout(() => setScanStatus(null), 3500);
    return () => window.clearTimeout(timer);
  }, [scanStatus]);

  // Selected CRM customer
  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === customerId) ?? null,
    [customers, customerId]
  );

  // Cart item lookup map by medicine ID
  const cartById = useMemo(() => {
    const map = new Map<string, CartItem>();
    for (const item of cart) {
      map.set(item.medicine.id, item);
    }
    return map;
  }, [cart]);

  // Filtered Catalog: Initially empty until user enters search query or scans barcode
  const filteredMedicines = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return medicines.filter((m) => {
      if (catalogFilter === 'in_stock' && m.available_stock <= 0) {
        return false;
      }
      if (catalogFilter === 'rx' && !m.requires_prescription) {
        return false;
      }
      return (
        m.name.toLowerCase().includes(needle) ||
        m.generic_name.toLowerCase().includes(needle) ||
        m.sku.toLowerCase().includes(needle) ||
        m.barcode.toLowerCase().includes(needle)
      );
    });
  }, [medicines, query, catalogFilter]);

  // Add medicine to cart
  const addToCart = (med: PosMedicine, batchNo?: string) => {
    if (med.available_stock <= 0) return;
    const chosenBatch = batchNo || med.batches[0]?.batchNo || 'DEFAULT';

    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === med.id);
      if (existing) {
        const maxQty = getMaxSelectableQty(med, existing.saleUnit);
        if (existing.qty >= maxQty) return prev;
        return prev.map((c) =>
          c.medicine.id === med.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          medicine: med,
          qty: 1,
          saleUnit: 'piece',
          selectedBatch: chosenBatch,
        },
      ];
    });
  };

  // Update item quantity
  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id !== id) return item;
          const maxQty = getMaxSelectableQty(item.medicine, item.saleUnit);
          const nextQty = Math.min(maxQty, item.qty + delta);
          return nextQty <= 0 ? null : { ...item, qty: nextQty };
        })
        .filter((x): x is CartItem => x !== null)
    );
  };

  // Set direct quantity
  const setItemQty = (id: string, exactQty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.medicine.id !== id) return item;
        const maxQty = getMaxSelectableQty(item.medicine, item.saleUnit);
        const clamped = Math.max(1, Math.min(maxQty, exactQty));
        return { ...item, qty: clamped };
      })
    );
  };

  // Set packaging sale unit (piece, strip, box)
  const setItemSaleUnit = (id: string, nextUnit: SaleUnit) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.medicine.id !== id) return item;
        const maxQty = getMaxSelectableQty(item.medicine, nextUnit);
        if (maxQty <= 0) return item;
        return {
          ...item,
          saleUnit: nextUnit,
          qty: Math.max(1, Math.min(item.qty, maxQty)),
        };
      })
    );
  };

  // Commit scanned barcode item with audio feedback
  const commitScannedItem = (med: PosMedicine): BarcodeScanFeedback => {
    if (med.available_stock <= 0) {
      const feedback: BarcodeScanFeedback = {
        ok: false,
        tone: 'warning',
        message: `${med.name} (${med.sku}) is currently out of stock.`,
      };
      setScanStatus(feedback);
      setQuery('');
      return feedback;
    }

    const existingItem = cartById.get(med.id);
    const activeUnit: SaleUnit = existingItem?.saleUnit ?? 'piece';
    const maxQty = getMaxSelectableQty(med, activeUnit);
    if (existingItem && existingItem.qty >= maxQty) {
      const feedback: BarcodeScanFeedback = {
        ok: false,
        tone: 'warning',
        message: `Max stock reached for ${med.name} (${med.available_stock} ${med.unit}).`,
      };
      setScanStatus(feedback);
      setQuery('');
      return feedback;
    }

    addToCart(med);
    const feedback: BarcodeScanFeedback = {
      ok: true,
      tone: 'success',
      message: `Added: ${med.name} (${med.strength}) to order`,
    };
    setScanStatus(feedback);
    setQuery('');
    return feedback;
  };

  // Process item search input or Enter key
  const processScannedCode = (rawCode: string) => {
    const trimmed = rawCode.trim();
    const needle = trimmed.toLowerCase();
    if (!needle) return;

    const exactMatch = medicines.find(
      (m) =>
        m.name.toLowerCase() === needle ||
        m.sku.toLowerCase() === needle ||
        m.barcode.toLowerCase() === needle
    );
    if (exactMatch) {
      commitScannedItem(exactMatch);
      return;
    }

    if (filteredMedicines.length === 1 && filteredMedicines[0].available_stock > 0) {
      commitScannedItem(filteredMedicines[0]);
      return;
    }

    const notFound: BarcodeScanFeedback = {
      ok: false,
      tone: 'error',
      message: `No medicine matched "${trimmed}".`,
    };
    setScanStatus(notFound);
    setQuery('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processScannedCode(query);
    }
  };

  // Cart financial calculations
  const totalUnits = cart.reduce(
    (sum, item) => sum + item.qty * getPackSize(item.medicine, item.saleUnit),
    0
  );
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + getPackUnitPrice(item.medicine, item.saleUnit) * item.qty,
    0
  );

  const rawDiscountValue = Math.max(0, Number(discount) || 0);
  const effectiveDiscountPercent =
    discountType === 'percent' ? Math.min(100, rawDiscountValue) : 0;
  const discountAmount =
    discountType === 'percent'
      ? Math.min(
        subtotal,
        Math.round(((subtotal * effectiveDiscountPercent) / 100) * 100) / 100
      )
      : Math.min(subtotal, Math.round(rawDiscountValue * 100) / 100);

  const vatAmount = Math.round((subtotal - discountAmount) * 0.05 * 100) / 100; // 5% Govt VAT
  const grandTotal = Math.max(
    0,
    Math.round(subtotal - discountAmount + vatAmount)
  );

  const tenderedNumeric = parseFloat(tenderCash) || 0;
  const changeDue = Math.max(0, Math.round(tenderedNumeric - grandTotal));

  // Auto-sync tender cash to grandTotal when cart changes unless custom entered
  useEffect(() => {
    if (!isTenderCustom) {
      setTenderCash(grandTotal > 0 ? grandTotal.toString() : '0');
    }
  }, [grandTotal, isTenderCustom]);

  // Active or last completed money receipt data
  const activeReceiptData = useMemo(() => {
    if (cart.length > 0) {
      const session = getAuthSession();
      const finalCustName = selectedCustomer
        ? selectedCustomer.name
        : (customerName.trim() || CURRENT_PATIENT.name);
      const cashierName = session
        ? (session.role.id === 'pharmacist'
            ? CURRENT_PHARMACIST.name
            : `${session.role.title} (${session.email})`)
        : CURRENT_PHARMACIST.name;
      return {
        billNo,
        customerName: finalCustName,
        customerPhone: selectedCustomer?.phone || customerPhone || CURRENT_PATIENT.phone,
        uhid: selectedCustomer?.uhid || CURRENT_PATIENT.uhid,
        bedNo: selectedCustomer?.bedNo,
        ward: selectedCustomer?.ward,
        doctor: selectedCustomer?.doctor || 'OTC / Self-Prescribed',
        counter: 'Counter 02 (CMS Central Dispenser)',
        pharmacist: cashierName,
        items: cart,
        subtotal,
        discount: discountAmount,
        vat: vatAmount,
        total: grandTotal,
        tendered: tenderedNumeric > 0 ? tenderedNumeric : grandTotal,
        change: changeDue,
        paymentMethod,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLive: true,
      };
    }
    if (lastCompletedBill) {
      return { ...lastCompletedBill, isLive: false };
    }
    return null;
  }, [cart, billNo, selectedCustomer, customerName, customerPhone, subtotal, discountAmount, vatAmount, grandTotal, tenderedNumeric, changeDue, paymentMethod, lastCompletedBill]);

  // Hold current bill
  const handleHoldBill = () => {
    if (cart.length === 0) return;
    const finalCustName = selectedCustomer ? selectedCustomer.name : (customerName.trim() || 'Walk-in Customer');
    const newHold: HeldBill = {
      id: `hold-${Date.now()}`,
      billNo,
      customerName: finalCustName,
      customerPhone: selectedCustomer?.phone || customerPhone,
      items: [...cart],
      heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalAmount: grandTotal,
    };
    setHeldBills((prev) => [newHold, ...prev]);
    setCart([]);
    setBillNo(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  // Recall held bill
  const handleRecallBill = (held: HeldBill) => {
    setCart(held.items);
    setBillNo(held.billNo);
    const foundMember = customers.find((c) => c.name === held.customerName);
    if (foundMember) {
      setCustomerType('member');
      setCustomerId(foundMember.id);
    } else {
      setCustomerType('walkin');
      setCustomerId('');
      setCustomerName(held.customerName === 'Walk-in Customer' ? '' : held.customerName);
    }
    setCustomerPhone(held.customerPhone);
    setHeldBills((prev) => prev.filter((h) => h.id !== held.id));
    setShowHeldModal(false);
  };

  const handleGoToCheckout = () => {
    setCurrentView('checkout');
    if (!window.location.pathname.endsWith('/checkout')) {
      window.history.pushState(null, '', '/dashboard/pharmacist/checkout');
    }
  };

  const handleGoToPos = () => {
    setCurrentView('pos');
    if (!window.location.pathname.endsWith('/pos')) {
      window.history.pushState(null, '', '/dashboard/pharmacist/pos');
    }
  };

  const handleGoToReceipt = () => {
    if (activeReceiptData) {
      try {
        sessionStorage.setItem('pharmacy_active_receipt', JSON.stringify(activeReceiptData));
      } catch (err) {
        console.error('Failed to save receipt to sessionStorage', err);
      }
    }
    setCurrentView('receipt');
    if (!window.location.pathname.endsWith('/receipt')) {
      window.history.pushState(null, '', '/dashboard/pharmacist/receipt');
    }
  };

  const handleCompleteSaleFromCheckout = () => {
    if (cart.length === 0) return;
    const session = getAuthSession();
    const finalCustName = selectedCustomer
      ? selectedCustomer.name
      : (customerName.trim() || CURRENT_PATIENT.name);
    const finalPhone = selectedCustomer?.phone || customerPhone || CURRENT_PATIENT.phone;
    const cashierName = session
      ? (session.role.id === 'pharmacist'
          ? CURRENT_PHARMACIST.name
          : `${session.role.title} (${session.email})`)
      : CURRENT_PHARMACIST.name;
    const finalTendered = tenderedNumeric > 0 ? tenderedNumeric : grandTotal;
    const finalChange = Math.max(0, Math.round(finalTendered - grandTotal));
    const saleRecord = {
      billNo,
      customerName: finalCustName,
      customerPhone: finalPhone,
      uhid: selectedCustomer?.uhid || CURRENT_PATIENT.uhid,
      bedNo: selectedCustomer?.bedNo,
      ward: selectedCustomer?.ward,
      doctor: selectedCustomer?.doctor || doctorName,
      counter: 'Counter 02 (CMS Central Dispenser)',
      pharmacist: cashierName,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      vat: vatAmount,
      total: grandTotal,
      tendered: finalTendered,
      change: finalChange,
      paymentMethod,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setLastCompletedBill(saleRecord);
    try {
      sessionStorage.setItem('pharmacy_active_receipt', JSON.stringify(saleRecord));
    } catch (err) {
      console.error(err);
    }
    setCart([]);
    setDiscount('0');
    setScanStatus(null);
    setBillNo(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setCustomerId('');
    setCustomerType('walkin');
    setCustomerName('');
    setCustomerPhone('');
    setIsTenderCustom(false);

    // Transition straight to Official Money Receipt page!
    setCurrentView('receipt');
    window.history.pushState(null, '', '/dashboard/pharmacist/receipt');
  };

  const removeFromCart = (medId: string) => {
    setCart((prev) => prev.filter((it) => it.medicine.id !== medId));
  };

  if (currentView === 'checkout') {
    return (
      <PharmacistCheckoutView
        billNo={billNo}
        cart={cart}
        customers={customers}
        customerType={customerType}
        setCustomerType={setCustomerType}
        customerId={customerId}
        setCustomerId={setCustomerId}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        doctorName={doctorName}
        setDoctorName={setDoctorName}
        careLocation={careLocation}
        setCareLocation={setCareLocation}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        discountType={discountType}
        setDiscountType={setDiscountType}
        discount={discount}
        setDiscount={setDiscount}
        tenderCash={tenderCash}
        setTenderCash={setTenderCash}
        isTenderCustom={isTenderCustom}
        setIsTenderCustom={setIsTenderCustom}
        subtotal={subtotal}
        discountAmount={discountAmount}
        vatAmount={vatAmount}
        grandTotal={grandTotal}
        changeDue={changeDue}
        onBackToPos={handleGoToPos}
        onCompleteSale={handleCompleteSaleFromCheckout}
        onUpdateCartQty={updateQty}
        onRemoveCartItem={removeFromCart}
      />
    );
  }

  if (currentView === 'receipt') {
    return (
      <PharmacistReceiptView
        receiptData={activeReceiptData}
        onBackToPos={handleGoToPos}
        onProceedToCheckout={cart.length > 0 ? handleGoToCheckout : undefined}
      />
    );
  }

  return (
    <div className="space-y-2 select-none font-['Inter',sans-serif]">
      {/* Clean PageHeader matching pharmacy-saas */}
      <PageHeader
        title="Point of Sale"
        description="Central Medical Store · Counter 02"
      />

      {/* 3. Main Split View: Left Catalog (8 cols) + Right Order Register (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Column: Medicine Catalog List & Fast Barcode Terminal (8 cols) */}
        <div className="lg:col-span-8 min-w-0 rounded-[3px] border border-slate-200/90 bg-white overflow-hidden shadow-xs">
          {/* Top Catalog Toolbar */}
          <div className="px-3 py-2 border-b border-slate-200/80 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            {/* Search input with F2 badge */}
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-[#006a4e] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={scanInputRef}
                  type="text"
                  placeholder="Search Medicine"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-8 pr-12 py-1.5 text-xs bg-white border border-slate-200 rounded-[3px] focus:outline-none focus:ring-0 font-medium text-slate-900"
                />

              </div>
            </div>

            {/* Filter Tabs & Item Count */}
            <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0">
              {(
                [
                  { key: 'all', label: 'All' },
                  { key: 'in_stock', label: 'In Stock' },
                  { key: 'rx', label: 'Prescription' },
                ] as const
              ).map((tab) => {
                const active = catalogFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setCatalogFilter(tab.key)}
                    className={`h-7 px-2.5 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer ${active
                      ? 'bg-[#006a4e] text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
              <span className="ml-1 text-xs font-medium text-slate-500 tabular-nums">
                {query.trim() ? `${filteredMedicines.length} Found` : 'Search to list'}
              </span>
            </div>
          </div>

          {/* Scan Feedback Bar */}
          {scanStatus && (
            <div
              className={`px-3 py-1.5 border-b text-xs font-medium flex items-center justify-between gap-2 ${scanStatus.tone === 'success'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                : scanStatus.tone === 'warning'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-800'
                  : 'bg-rose-50/80 border-rose-200 text-rose-800'
                }`}
            >
              <span>{scanStatus.message}</span>
              <button
                type="button"
                onClick={() => setScanStatus(null)}
                className="text-xs opacity-75 hover:opacity-100 cursor-pointer font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* High-Density Medicine Catalog Table */}
          <div className="overflow-x-auto min-h-[380px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap select-none">
                  <th className="px-2.5 py-1.5">Item Code</th>
                  <th className="px-2.5 py-1.5">Medicine & Strength</th>
                  <th className="hidden xl:table-cell px-2.5 py-1.5">Generic</th>
                  <th className="px-2.5 py-1.5 text-right">Stock</th>
                  <th className="px-2.5 py-1.5 text-right">Price</th>
                  <th className="px-2.5 py-1.5 text-right w-[86px]">Cart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!query.trim() ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-20 text-center text-slate-400">
                      <div className="max-w-sm mx-auto flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#006a4e] flex items-center justify-center mb-3">
                          <Search className="w-6 h-6 stroke-[1.75]" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">Search Medicine Catalog</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Type medicine brand name, generic name, SKU or scan a barcode to find items.
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-slate-100 text-xs text-slate-600 font-medium">
                          <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700 text-xs">F2</kbd>
                          <span>Focus Search</span>
                          <span className="text-slate-300">•</span>
                          <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700 text-xs">Enter</kbd>
                          <span>Quick Add</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-slate-400">
                      <Search className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-1.5" />
                      <p className="text-sm font-bold text-slate-700">No medicines match "{query}"</p>
                      <p className="text-xs text-slate-500 mt-0.5">Press F2 to search another brand or generic name.</p>
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((med) => {
                    const outOfStock = med.available_stock <= 0;
                    const cartItem = cartById.get(med.id);
                    const cartQty = cartItem?.qty ?? 0;
                    const activeUnit: SaleUnit = cartItem?.saleUnit ?? 'piece';
                    const maxUnitQty = getMaxSelectableQty(med, activeUnit);

                    return (
                      <tr
                        key={med.id}
                        className={`transition-colors ${outOfStock
                          ? 'opacity-55 bg-slate-50/40'
                          : cartQty > 0
                            ? 'bg-emerald-50/50'
                            : 'hover:bg-slate-50/80'
                          }`}
                      >
                        {/* Item Code */}
                        <td className="px-2.5 py-1 text-xs font-semibold text-[#006a4e] whitespace-nowrap">
                          {med.sku}
                        </td>

                        {/* Medicine Name & Strength */}
                        <td className="px-2.5 py-1 text-xs max-w-[220px] 2xl:max-w-[280px]">
                          <div className="flex items-baseline gap-1.5 min-w-0">
                            <span className="font-bold text-slate-900 truncate" title={med.name}>
                              {med.name}
                            </span>
                            {med.strength && (
                              <span className="text-xs text-slate-500 shrink-0 font-medium">
                                {med.strength}
                              </span>
                            )}
                            {med.requires_prescription && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded shrink-0">
                                Rx Required
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                            <span className="xl:hidden">{med.generic_name} • </span>
                            <span>{med.dosage_form}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">{med.rackLocation}</span>
                          </div>
                        </td>

                        {/* Generic */}
                        <td className="hidden xl:table-cell px-2.5 py-1 text-xs text-slate-600 max-w-[150px]">
                          <span className="block truncate" title={med.generic_name}>
                            {med.generic_name}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-2.5 py-1 text-right text-xs whitespace-nowrap">
                          {outOfStock ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Out
                            </span>
                          ) : (
                            <span
                              className={`font-semibold tabular-nums ${med.available_stock <= 30
                                ? 'text-amber-600 font-bold'
                                : 'text-slate-700'
                                }`}
                            >
                              {med.available_stock} {med.unit}
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-2.5 py-1 text-right text-xs whitespace-nowrap">
                          <div className="font-bold text-slate-900 leading-snug">৳ {med.selling_price.toFixed(2)}</div>
                          {med.units_per_box > 1 && med.box_selling_price && (
                            <div className="text-[10px] font-medium text-slate-400 leading-none">
                              Box: ৳ {med.box_selling_price}
                            </div>
                          )}
                        </td>

                        {/* Cart Action Stepper or Add button */}
                        <td className="px-2.5 py-1 text-right whitespace-nowrap">
                          {cartQty > 0 ? (
                            <div className="inline-flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => updateQty(med.id, -1)}
                                className="h-5 w-5 rounded-[2px] border border-slate-200 bg-white flex items-center justify-center hover:border-[#006a4e] cursor-pointer"
                              >
                                <Minus className="h-3 w-3 text-slate-700" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-[#006a4e]">
                                {cartQty}
                              </span>
                              <button
                                type="button"
                                disabled={cartQty >= maxUnitQty}
                                onClick={() => updateQty(med.id, 1)}
                                className="h-5 w-5 rounded-[2px] border border-slate-200 bg-white flex items-center justify-center hover:border-[#006a4e] disabled:opacity-40 cursor-pointer"
                              >
                                <Plus className="h-3 w-3 text-slate-700" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={outOfStock}
                              onClick={() => addToCart(med)}
                              className="h-5.5 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs ml-auto"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Sticky Order Register (4 cols) */}
        <div className="lg:col-span-4 min-w-0 rounded-[3px] border border-slate-200/90 bg-white sticky top-2 overflow-hidden shadow-xs">
          {/* Order Register Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200/80 bg-slate-50/70 text-xs">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-[#006a4e]" />
              <h2 className="text-xs font-bold text-slate-900">Order Register</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                {totalUnits} pcs ({cart.length} lines)
              </span>
              <button
                type="button"
                disabled={!activeReceiptData}
                onClick={handleGoToReceipt}
                className="text-xs font-semibold text-[#006a4e] hover:underline cursor-pointer disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1"
                title="View Official Money Receipt Page"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Receipt</span>
              </button>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Cart Items List with Packaging Units Selector */}
          <div className="max-h-[calc(100vh-270px)] min-h-[300px] overflow-y-auto divide-y divide-slate-100 text-xs">
            {cart.length === 0 ? (
              <div className="px-4 py-16 text-center text-xs text-slate-400">
                <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
                <p className="font-bold text-slate-700 text-sm">Cart is empty</p>
                <p className="text-slate-400 text-xs mt-1">Search or scan barcode to add medicines to this sale.</p>
              </div>
            ) : (
              cart.map(({ medicine, qty, saleUnit }) => {
                const packSize = getPackSize(medicine, saleUnit);
                const packUnitPrice = getPackUnitPrice(medicine, saleUnit);
                const maxQty = getMaxSelectableQty(medicine, saleUnit);

                return (
                  <div
                    key={medicine.id}
                    className="px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 truncate">{medicine.name}</div>
                      <div className="text-xs text-slate-500 tabular-nums">
                        ৳ {packUnitPrice.toFixed(2)} × {qty}{' '}
                        {saleUnit === 'piece'
                          ? medicine.unit
                          : saleUnit === 'strip'
                            ? `strip (${packSize} pcs)`
                            : `box (${packSize} pcs)`}
                        {saleUnit !== 'piece' && (
                          <span className="ml-1 text-slate-700 font-semibold">= {qty * packSize} pcs</span>
                        )}
                      </div>

                      {/* Packaging Unit Switcher (Piece / Strip / Box) */}
                      {(medicine.units_per_strip > 1 || medicine.units_per_box > 1) && (
                        <div className="mt-1 inline-flex items-center rounded-[3px] border border-slate-200 overflow-hidden bg-slate-50">
                          {(['piece', 'strip', 'box'] as SaleUnit[])
                            .filter(
                              (u) =>
                                u === 'piece' ||
                                (u === 'strip' && medicine.units_per_strip > 1) ||
                                (u === 'box' && medicine.units_per_box > 1)
                            )
                            .map((u) => {
                              const uMax = getMaxSelectableQty(medicine, u);
                              const active = saleUnit === u;
                              const label =
                                u === 'piece'
                                  ? 'Pc'
                                  : u === 'strip'
                                    ? `Strip (${medicine.units_per_strip})`
                                    : `Box (${medicine.units_per_box})`;
                              return (
                                <button
                                  key={u}
                                  type="button"
                                  disabled={uMax <= 0}
                                  onClick={() => setItemSaleUnit(medicine.id, u)}
                                  className={`px-2 py-0.5 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${active
                                    ? 'bg-[#006a4e] text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    {/* Stepper & Line Price */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQty(medicine.id, -1)}
                          className="h-6 w-6 rounded-[2px] border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus className="h-3 w-3 text-slate-700" />
                        </button>
                        <CartQtyInput
                          qty={qty}
                          max={maxQty}
                          name={medicine.name}
                          onChangeQty={(nextQty) => setItemQty(medicine.id, nextQty)}
                        />
                        <button
                          type="button"
                          disabled={qty >= maxQty}
                          onClick={() => updateQty(medicine.id, 1)}
                          className="h-6 w-6 rounded-[2px] border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        >
                          <Plus className="h-3 w-3 text-slate-700" />
                        </button>
                      </div>

                      <span className="w-16 text-right font-bold text-slate-900 text-xs">
                        ৳ {(packUnitPrice * qty).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQty(medicine.id, -qty)}
                        aria-label={`Remove ${medicine.name}`}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Actions & Order Checkout CTA */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <div>
                <span className="text-slate-500 block text-[11px]">Cart Subtotal</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  ৳ {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Lines in Order</span>
                <span className="font-bold text-[#006a4e]">
                  {cart.length} items ({totalUnits} pcs)
                </span>
              </div>
            </div>

            {/* Action Buttons: Proceed to Checkout (New Page) & View Receipt */}
            <div className="space-y-1.5">
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleGoToCheckout}
                className="w-full py-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                title="Proceed to dedicated checkout page"
              >
                <Receipt className="h-4 w-4" />
                <span>
                  {cart.length > 0
                    ? `Proceed to Checkout · ৳ ${subtotal.toLocaleString()} →`
                    : 'Proceed to Checkout'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!activeReceiptData}
                  onClick={handleGoToReceipt}
                  className="flex-1 py-1.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="View official money receipt page"
                >
                  <FileText className="h-3.5 w-3.5 text-[#006a4e]" />
                  <span>Money Receipt Page</span>
                </button>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={handleHoldBill}
                    className="px-3 py-1.5 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-100 text-amber-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    title="Hold / Park current order"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Park [F3]</span>
                  </button>
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <p className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-0.5">
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Earliest expiry batch deduction applied automatically</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Held Bills (Parked Queues) Modal */}
      {showHeldModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-[3px] shadow-2xl border border-slate-300 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-xs font-['Inter',sans-serif] my-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[3px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <PauseCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">Held Bills (Parked Queues)</h3>
                  <p className="text-[11px] text-slate-500">Temporarily parked bills ready for recall</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHeldModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {heldBills.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <PauseCircle className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                  <p>No bills currently parked on hold.</p>
                </div>
              ) : (
                heldBills.map((h) => (
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
                      <span className="font-bold text-[#006a4e]">৳ {h.totalAmount}</span>
                      <button
                        type="button"
                        onClick={() => handleRecallBill(h)}
                        className="px-2.5 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white font-semibold cursor-pointer"
                      >
                        Recall
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHeldModal(false)}
                className="px-4 py-1.5 rounded-[3px] border border-slate-300 text-slate-700 font-semibold cursor-pointer hover:bg-slate-100 transition-colors text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-[3px] shadow-2xl border border-slate-300 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden text-xs font-['Inter',sans-serif] my-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[3px] bg-slate-100 text-[#0c2e4b] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">Keyboard Shortcuts (Fast Cashiering)</h3>
                  <p className="text-[11px] text-slate-500">POS hotkeys for rapid counter operations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              <div className="flex justify-between items-center p-2 rounded-[3px] bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Focus Barcode / Medicine Search</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded-[2px] font-bold text-slate-800">F2</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded-[3px] bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Park / Hold Current Bill</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded-[2px] font-bold text-slate-800">F3</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded-[3px] bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Recall Parked Bills</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded-[2px] font-bold text-slate-800">F4</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded-[3px] bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Complete Checkout & Print</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded-[2px] font-bold text-slate-800">F10</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded-[3px] bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Close Open Modal / Dialog</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded-[2px] font-bold text-slate-800">Esc</kbd>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 rounded-[3px] border border-slate-300 text-slate-700 font-semibold cursor-pointer hover:bg-slate-100 transition-colors text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
