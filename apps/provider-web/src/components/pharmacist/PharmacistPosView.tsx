import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  FileText,
  HelpCircle,
  Minus,
  PauseCircle,
  Plus,
  Printer,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import { HospitalLogo } from '../common/HospitalLogo';
import { PageHeader } from '../common/PageHeader';

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

export const PharmacistPosView: React.FC = () => {
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
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mfs' | 'credit'>('cash');
  const [discountType, setDiscountType] = useState<DiscountType>('fixed');
  const [discount, setDiscount] = useState('0');
  const [tenderCash, setTenderCash] = useState<string>('0');
  const [isTenderCustom, setIsTenderCustom] = useState(false);
  const [scanStatus, setScanStatus] = useState<BarcodeScanFeedback | null>(null);
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [showHeldModal, setShowHeldModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showMoneyReceiptModal, setShowMoneyReceiptModal] = useState(false);
  const [receiptFormat, setReceiptFormat] = useState<'standard' | 'thermal'>('standard');
  const [printSuccessModal, setPrintSuccessModal] = useState(false);
  const [lastCompletedBill, setLastCompletedBill] = useState<any>(null);

  const scanInputRef = useRef<HTMLInputElement>(null);

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
        setShowCheckoutModal((prev) => {
          if (prev) {
            handleCompleteCheckout();
            return false;
          }
          return true;
        });
      }
      if (e.key === 'Escape') {
        setShowHeldModal(false);
        setShowShortcutsModal(false);
        setShowCheckoutModal(false);
        setShowMoneyReceiptModal(false);
        setPrintSuccessModal(false);
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

  const handleDiscountTypeChange = (nextType: DiscountType) => {
    if (nextType === discountType) return;
    setDiscountType(nextType);
    const currentNum = Math.max(0, Number(discount) || 0);
    if (nextType === 'percent' && currentNum > 100) {
      setDiscount('100');
    }
  };

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
      const finalCustName = selectedCustomer ? selectedCustomer.name : (customerName.trim() || 'Walk-in Customer');
      return {
        billNo,
        customerName: finalCustName,
        customerPhone: selectedCustomer?.phone || customerPhone,
        bedNo: selectedCustomer?.bedNo,
        ward: selectedCustomer?.ward,
        doctor: selectedCustomer?.doctor || 'OTC / Self-Prescribed',
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

  // Complete checkout & show thermal receipt modal
  const handleCompleteCheckout = () => {
    if (cart.length === 0) return;
    const finalCustName = selectedCustomer ? selectedCustomer.name : (customerName.trim() || 'Walk-in Customer');
    const finalTendered = tenderedNumeric > 0 ? tenderedNumeric : grandTotal;
    const finalChange = Math.max(0, Math.round(finalTendered - grandTotal));
    const saleRecord = {
      billNo,
      customerName: finalCustName,
      customerPhone: selectedCustomer?.phone || customerPhone,
      bedNo: selectedCustomer?.bedNo,
      ward: selectedCustomer?.ward,
      doctor: selectedCustomer?.doctor || 'OTC / Self-Prescribed',
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
    setShowCheckoutModal(false);
    setPrintSuccessModal(true);
    setCart([]);
    setDiscount('0');
    setScanStatus(null);
    setBillNo(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setCustomerId('');
    setCustomerType('walkin');
    setCustomerName('');
    setCustomerPhone('');
    setIsTenderCustom(false);
  };

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
                onClick={() => setShowMoneyReceiptModal(true)}
                className="text-xs font-semibold text-[#006a4e] hover:underline cursor-pointer disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1"
                title="Preview Official Money Receipt"
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

          {/* Customer & Prescriber Form Area */}
          <div className="p-3 space-y-2.5 border-b border-slate-100 text-xs">
            {/* Customer Type Toggle: Walk-in (Manual) vs Registered Member Switch */}
            <div>
              <div className="flex items-center justify-between mb-1.5 select-none">
                <span className="text-xs font-bold text-slate-800">Customer / Patient</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={customerType === 'member'}
                  onClick={() => {
                    if (customerType === 'walkin') {
                      setCustomerType('member');
                    } else {
                      setCustomerType('walkin');
                      setCustomerId('');
                    }
                  }}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none group"
                  title="Toggle between Walk-in (Manual) and Registered Member"
                >
                  <span
                    className={`text-[11px] font-semibold transition-colors ${
                      customerType === 'member' ? 'text-[#006a4e]' : 'text-slate-500'
                    }`}
                  >
                    {customerType === 'member' ? 'Member' : 'Walk-in'}
                  </span>
                  <div
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                      customerType === 'member' ? 'bg-[#006a4e]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        customerType === 'member' ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Mode 1: Walk-in Manual Entry */}
              {customerType === 'walkin' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name (Optional)"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-[3px] focus:outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                  />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-[3px] focus:outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Mode 2: Registered Membership Selection */}
              {customerType === 'member' && (
                <div className="space-y-2">
                  <select
                    value={customerId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomerId(val);
                      const found = customers.find((c) => c.id === val);
                      if (found) {
                        setCustomerName(found.name);
                        setCustomerPhone(found.phone || '');
                      } else {
                        setCustomerName('');
                        setCustomerPhone('');
                      }
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-[3px] focus:outline-none focus:ring-0 font-medium text-slate-800"
                  >
                    <option value="">Select Hospital Member / Patient</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(${c.phone})` : ''} • {c.loyalty_points} Points ({c.uhid || 'Member'})
                      </option>
                    ))}
                  </select>

                  {/* Selected Member Detail Card */}
                  {selectedCustomer && (
                    <div className="p-2 rounded-[3px] bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{selectedCustomer.name}</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#006a4e] text-white font-bold text-[10px]">
                          ★ {selectedCustomer.loyalty_points} Pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600">
                        <span>{selectedCustomer.phone}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#006a4e]">{selectedCustomer.uhid}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inpatient Bed reference badge if admitted */}
            {selectedCustomer?.bedNo && (
              <div className="flex items-center gap-1.5 p-2 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>{selectedCustomer.bedNo}</strong> ({selectedCustomer.ward}) • Consultant:{' '}
                  {selectedCustomer.doctor}
                </span>
              </div>
            )}

            {/* Allergy Warning Alert Banner */}
            {selectedCustomer?.allergies && (
              <div className="flex items-center gap-2 rounded-[3px] border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                <span>Allergy Alert: {selectedCustomer.allergies}</span>
              </div>
            )}

            {/* Payment Method & Dual Discount Controls */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Payment</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-[3px] focus:bg-white focus:outline-none focus:ring-0 font-medium text-slate-800"
                >
                  <option value="cash">Cash Counter</option>
                  <option value="card">Debit / Credit Card</option>
                  <option value="mfs">Mobile Wallet</option>
                  <option value="credit">Indoor Patient Ledger</option>
                </select>
              </div>

              {/* Dual Discount Control (Fixed ৳ vs Percentage %) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Discount</label>
                  <div className="inline-flex rounded-[2px] border border-slate-200 overflow-hidden bg-slate-100">
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange('fixed')}
                      className={`px-2 py-0.5 text-xs font-bold cursor-pointer ${discountType === 'fixed'
                        ? 'bg-[#006a4e] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      ৳
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange('percent')}
                      className={`px-2 py-0.5 text-xs font-bold cursor-pointer ${discountType === 'percent'
                        ? 'bg-[#006a4e] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      %
                    </button>
                  </div>
                </div>

                <div className="flex h-[28px] items-center rounded-[3px] border border-slate-200 bg-white overflow-hidden">
                  {discountType === 'fixed' && (
                    <span className="px-2 h-full flex items-center text-xs font-bold text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
                      ৳
                    </span>
                  )}
                  <input
                    type="number"
                    min="0"
                    max={discountType === 'percent' ? 100 : undefined}
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    placeholder={discountType === 'percent' ? '0' : '0.00'}
                    className="h-full w-full min-w-0 bg-transparent px-2 text-xs font-semibold tabular-nums text-slate-900 focus:outline-none focus:ring-0"
                  />
                  {discountType === 'percent' && (
                    <span className="px-2 h-full flex items-center text-xs font-bold text-slate-500 bg-slate-50 border-l border-slate-200 select-none">
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items List with Packaging Units Selector */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
            {cart.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-slate-400">
                <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-1.5" />
                <p className="font-medium text-slate-600">No medicines in order</p>
                <p className="text-slate-400 text-xs mt-0.5">Search and add items to begin billing.</p>
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

          {/* Settlement Summary & Cash Tender Calculation */}
          <div className="p-3 bg-slate-50/70 border-t border-slate-200 space-y-2.5 text-xs">
            {/* Calculation Lines */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-slate-900 text-xs">
                  ৳ {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">
                  Discount
                  {discountType === 'percent' && effectiveDiscountPercent > 0
                    ? ` (${effectiveDiscountPercent}%)`
                    : ''}
                </span>
                <span className="font-semibold text-rose-600 text-xs">
                  -৳ {discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Government Tax (5%)</span>
                <span className="text-slate-700 text-xs font-semibold">৳ {vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm font-extrabold text-slate-900">
                <span>Total Payable (মোট বিল)</span>
                <span className="text-[#006a4e] text-base font-extrabold">
                  ৳ {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Cash Note Denomination Buttons */}
            <div className="p-2.5 rounded-[3px] bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">Tender Notes:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTenderCustom(false);
                      setTenderCash(grandTotal.toString());
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs cursor-pointer"
                  >
                    Exact
                  </button>
                  {[100, 500, 1000].map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => {
                        setIsTenderCustom(true);
                        setTenderCash(note.toString());
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                    >
                      ৳{note}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Received & Change Returned */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-slate-600 font-medium text-xs">Cash Received:</span>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">৳</span>
                  <input
                    type="number"
                    value={tenderCash}
                    onChange={(e) => {
                      setIsTenderCustom(true);
                      setTenderCash(e.target.value);
                    }}
                    className="w-full text-right pr-2.5 pl-6 py-1 font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-[2px] text-xs focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-slate-700 text-xs">
                <span className="font-semibold">Change to Return:</span>
                <span className="font-extrabold text-[#006a4e] text-sm">
                  ৳ {changeDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Complete Sale / Order Checkout & Money Receipt Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!activeReceiptData}
                onClick={() => setShowMoneyReceiptModal(true)}
                className="py-2.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Preview printable official money receipt"
              >
                <FileText className="h-4 w-4 text-[#006a4e]" />
                <span>Money Receipt</span>
              </button>

              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setShowCheckoutModal(true)}
                className="py-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Receipt className="h-4 w-4" />
                <span>
                  {cart.length > 0
                    ? `Checkout · ৳ ${grandTotal.toLocaleString()}`
                    : 'Checkout'}
                </span>
              </button>
            </div>

            {/* Earliest Expiry Batch Deduction Notice */}
            {cart.length > 0 && (
              <p className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Earliest expiry batch deduction applied automatically</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Checkout & Total Summary Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[3px] shadow-2xl border border-slate-300 w-full max-w-lg p-5 space-y-3.5 text-xs font-['Inter',sans-serif]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[3px] bg-emerald-100 text-[#006a4e] flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Order Checkout & Bill Summary</h3>
                  <p className="text-[11px] text-slate-500">
                    {billNo} • {selectedCustomer ? selectedCustomer.name : (customerName.trim() || 'Walk-in Customer')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prominent Kotu Hoice / Total Amount Banner */}
            <div className="p-3 rounded-[3px] bg-emerald-50 border border-emerald-300 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                  সর্বমোট প্রদেয় বিল / Total Payable
                </span>
                <p className="text-xs text-emerald-700">
                  {cart.reduce((sum, it) => sum + it.qty, 0)} items in order • Tax & Discount applied
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#006a4e]">
                  ৳ {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div className="border border-slate-200 rounded-[3px] overflow-hidden max-h-44 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-1.5 px-2.5 font-semibold">Medicine / Item</th>
                    <th className="py-1.5 px-2 font-semibold text-center">Unit</th>
                    <th className="py-1.5 px-2 font-semibold text-center">Qty</th>
                    <th className="py-1.5 px-2 font-semibold text-right">Rate</th>
                    <th className="py-1.5 px-2.5 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((it) => {
                    const packPrice = getPackUnitPrice(it.medicine, it.saleUnit);
                    return (
                      <tr key={it.medicine.id} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2.5">
                          <div className="font-semibold text-slate-900">{it.medicine.name}</div>
                          <div className="text-[11px] text-slate-500">{it.medicine.dosage_form} • {it.medicine.strength}</div>
                        </td>
                        <td className="py-1.5 px-2 text-center capitalize text-slate-600">{it.saleUnit}</td>
                        <td className="py-1.5 px-2 text-center font-bold text-slate-900">{it.qty}</td>
                        <td className="py-1.5 px-2 text-right text-slate-600">৳ {packPrice.toFixed(2)}</td>
                        <td className="py-1.5 px-2.5 text-right font-bold text-slate-900">৳ {(packPrice * it.qty).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Settlement Details & Payment Tender */}
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              {/* Left Column: Totals Calculation */}
              <div className="p-2.5 rounded-[3px] bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">৳ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Discount:</span>
                  <span className="font-semibold text-rose-600">
                    {discountAmount > 0 ? `-৳ ${discountAmount.toFixed(2)}` : '৳ 0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Govt Tax (5% VAT):</span>
                  <span className="font-semibold text-slate-800">৳ {vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-extrabold text-slate-900">
                  <span>Net Payable:</span>
                  <span className="text-[#006a4e]">৳ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Right Column: Payment & Change Calculation */}
              <div className="p-2.5 rounded-[3px] bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                {/* Payment Method Switcher */}
                <div className="flex gap-1">
                  {(['cash', 'card', 'mfs'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-1 rounded-[3px] text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-[#006a4e] text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {/* Tender Cash */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium text-[11px]">Cash Tendered:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsTenderCustom(false);
                          setTenderCash(grandTotal.toString());
                        }}
                        className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] cursor-pointer"
                      >
                        Exact
                      </button>
                      {[500, 1000].map((note) => (
                        <button
                          key={note}
                          type="button"
                          onClick={() => {
                            setIsTenderCustom(true);
                            setTenderCash(note.toString());
                          }}
                          className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] cursor-pointer"
                        >
                          ৳{note}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">৳</span>
                    <input
                      type="number"
                      value={tenderCash}
                      onChange={(e) => {
                        setIsTenderCustom(true);
                        setTenderCash(e.target.value);
                      }}
                      className="w-full text-right pr-2.5 pl-6 py-1 font-bold text-slate-900 bg-white border border-slate-300 rounded-[2px] text-xs focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                {/* Change */}
                <div className="flex items-center justify-between pt-0.5 border-t border-slate-200">
                  <span className="text-slate-600 font-semibold text-[11px]">Change to Return:</span>
                  <span className="font-extrabold text-[#006a4e] text-sm">
                    ৳ {changeDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-3.5 py-2 rounded-[3px] border border-slate-300 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 transition-colors text-xs"
                >
                  Back to Cart
                </button>
                <button
                  type="button"
                  onClick={() => setShowMoneyReceiptModal(true)}
                  className="px-3 py-2 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer transition-colors text-xs flex items-center gap-1"
                  title="Preview official money receipt"
                >
                  <FileText className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>Receipt Preview</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleCompleteCheckout}
                className="flex-1 py-2 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Checkout & Print (৳ {grandTotal.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Pharmacy Money Receipt Preview Modal */}
      {showMoneyReceiptModal && activeReceiptData && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-[3px] shadow-2xl border border-slate-300 w-full max-w-xl p-5 space-y-4 font-['Inter',sans-serif] text-xs">
            {/* Modal Control Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[3px] bg-emerald-100 text-[#006a4e] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Money Receipt Preview (মানি রিসিট প্রিভিউ)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeReceiptData.isLive ? 'Live Cart Order Preview' : 'Completed Official Receipt'} • Counter 02
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Format Toggle (Standard A4/A5 Memo vs Thermal POS Slip) */}
                <div className="inline-flex rounded-[3px] border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setReceiptFormat('standard')}
                    className={`px-2 py-0.5 rounded-[2px] font-semibold transition-colors cursor-pointer ${
                      receiptFormat === 'standard'
                        ? 'bg-[#006a4e] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Official Cash Memo
                  </button>
                  <button
                    type="button"
                    onClick={() => setReceiptFormat('thermal')}
                    className={`px-2 py-0.5 rounded-[2px] font-semibold transition-colors cursor-pointer ${
                      receiptFormat === 'thermal'
                        ? 'bg-[#006a4e] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    80mm Thermal Slip
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMoneyReceiptModal(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Preview Canvas */}
            {receiptFormat === 'standard' ? (
              /* Standard Official Hospital Money Receipt / Cash Memo */
              <div className="border border-slate-300 rounded-[3px] p-4 bg-slate-50/50 space-y-3.5 shadow-2xs text-slate-800">
                {/* Hospital Branding Header */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <HospitalLogo size="sm" showText={false} />
                    <div>
                      <h4 className="font-extrabold text-[#006a4e] text-sm leading-tight">
                        Green Life Hospital Ltd.
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-700">
                        Department of Pharmacy & Drug Administration
                      </p>
                      <p className="text-[10px] text-slate-500">
                        32, Green Road, Dhanmondi, Dhaka-1205 • Hotline: +880 1711-000005
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-[3px] bg-emerald-50 text-[#006a4e] font-extrabold text-[11px] border border-emerald-200 mb-1">
                      MONEY RECEIPT
                    </span>
                    <p className="text-[10.5px] text-slate-500">Invoice: <strong className="text-slate-900">{activeReceiptData.billNo}</strong></p>
                    <p className="text-[10.5px] text-slate-500">{activeReceiptData.date} • {activeReceiptData.time}</p>
                  </div>
                </div>

                {/* Patient / Customer & Dispensing Metadata */}
                <div className="grid grid-cols-2 gap-2.5 p-2.5 rounded-[3px] bg-white border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient / Customer:</span>
                    <span className="font-bold text-slate-900 text-xs">{activeReceiptData.customerName}</span>
                    {activeReceiptData.customerPhone && (
                      <span className="text-slate-500 text-[11px] block">Contact: {activeReceiptData.customerPhone}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Care Location & Doctor:</span>
                    <span className="font-semibold text-slate-800 text-xs">
                      {activeReceiptData.bedNo ? `Bed ${activeReceiptData.bedNo} (${activeReceiptData.ward})` : 'Outpatient (OPD Walk-in)'}
                    </span>
                    <span className="text-slate-500 text-[11px] block">{activeReceiptData.doctor}</span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-slate-200 rounded-[3px] overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="py-1.5 px-2 text-center w-8">#</th>
                        <th className="py-1.5 px-2.5">Item Description</th>
                        <th className="py-1.5 px-2 text-center">Packaging</th>
                        <th className="py-1.5 px-2 text-center">Qty</th>
                        <th className="py-1.5 px-2 text-right">Unit Rate</th>
                        <th className="py-1.5 px-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeReceiptData.items.map((it: CartItem, idx: number) => {
                        const packPrice = getPackUnitPrice(it.medicine, it.saleUnit);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="py-1.5 px-2 text-center text-slate-400 text-[11px]">{idx + 1}</td>
                            <td className="py-1.5 px-2.5">
                              <span className="font-bold text-slate-900">{it.medicine.name}</span>{' '}
                              <span className="text-slate-500 text-[11px]">({it.medicine.strength})</span>
                            </td>
                            <td className="py-1.5 px-2 text-center capitalize text-slate-600 text-[11px]">{it.saleUnit}</td>
                            <td className="py-1.5 px-2 text-center font-bold text-slate-900">{it.qty}</td>
                            <td className="py-1.5 px-2 text-right text-slate-600">৳ {packPrice.toFixed(2)}</td>
                            <td className="py-1.5 px-2.5 text-right font-bold text-slate-900">৳ {(packPrice * it.qty).toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="flex justify-between items-start pt-1">
                  <div className="space-y-1 text-[11px] text-slate-500 max-w-[240px]">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-100 text-[#006a4e] font-extrabold text-[10px]">PAID</span>
                      <span>Payment: <strong className="uppercase text-slate-800">{activeReceiptData.paymentMethod}</strong></span>
                    </div>
                    <p>Counter 02 · CMS Central Dispenser</p>
                    <p className="text-[10px] text-slate-400 italic">
                      * Medicines once sold are returnable within 7 days if foil remains intact with this receipt.
                    </p>
                  </div>

                  <div className="w-56 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-800">৳ {activeReceiptData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Discount:</span>
                      <span className="font-semibold text-rose-600">
                        {activeReceiptData.discount > 0 ? `-৳ ${activeReceiptData.discount.toFixed(2)}` : '৳ 0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Govt VAT (5%):</span>
                      <span className="font-semibold text-slate-800">৳ {activeReceiptData.vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-extrabold text-slate-900">
                      <span>Total Paid:</span>
                      <span className="text-[#006a4e]">৳ {activeReceiptData.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px] pt-0.5">
                      <span>Cash Received:</span>
                      <span>৳ {activeReceiptData.tendered.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Change Returned:</span>
                      <span className="font-bold text-emerald-700">৳ {activeReceiptData.change.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                  <div>
                    <p>Customer Signature: __________________</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">Md. Rafiqul Islam (Chief Pharmacist)</p>
                    <p>Authorized Signature &amp; Stamp</p>
                  </div>
                </div>
              </div>
            ) : (
              /* 80mm Thermal Receipt Preview */
              <div className="border border-slate-300 rounded-[3px] p-4 bg-white max-w-sm mx-auto space-y-2.5 shadow-2xs text-xs">
                <div className="text-center border-b border-dashed border-slate-300 pb-2 text-[11px] text-slate-500 space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-900">Green Life Hospital Ltd. Pharmacy</h4>
                  <p>Dhanmondi, Dhaka-1205 • Tel: +880 1711-000005</p>
                  <p className="text-slate-700 font-semibold mt-1">CASH MEMO / MONEY RECEIPT</p>
                  <p className="text-slate-600">{activeReceiptData.billNo} • {activeReceiptData.date} {activeReceiptData.time}</p>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p>Customer: <strong className="text-slate-900">{activeReceiptData.customerName}</strong></p>
                  {activeReceiptData.customerPhone && <p>Phone: {activeReceiptData.customerPhone}</p>}
                  {activeReceiptData.bedNo && <p>Bed/Ward: {activeReceiptData.bedNo} ({activeReceiptData.ward})</p>}
                  <p>Cashier: Md. Rafiqul Islam (Counter 02)</p>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-1.5 space-y-1">
                  {activeReceiptData.items.map((it: CartItem, i: number) => {
                    const packPrice = getPackUnitPrice(it.medicine, it.saleUnit);
                    return (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="truncate max-w-[190px] text-slate-800">
                          {it.medicine.name} ({it.saleUnit}) x{it.qty}
                        </span>
                        <span className="font-bold text-slate-900">৳ {(packPrice * it.qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>৳ {activeReceiptData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Discount:</span>
                    <span className="text-rose-600">-৳ {activeReceiptData.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Govt Tax (5%):</span>
                    <span>৳ {activeReceiptData.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm border-t border-slate-200 pt-1 text-slate-900">
                    <span>Total Paid:</span>
                    <span className="text-[#006a4e] font-extrabold">৳ {activeReceiptData.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Tendered:</span>
                    <span>৳ {activeReceiptData.tendered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Change Returned:</span>
                    <span className="font-bold text-emerald-700">৳ {activeReceiptData.change.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-2">
                  Thank you for choosing Green Life Hospital Pharmacy!
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowMoneyReceiptModal(false)}
                className="px-4 py-2 rounded-[3px] border border-slate-300 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 transition-colors text-xs"
              >
                Close Preview
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors text-xs shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                {activeReceiptData.isLive && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoneyReceiptModal(false);
                      setShowCheckoutModal(true);
                    }}
                    className="px-4 py-2 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors text-xs shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Proceed to Checkout</span>
                  </button>
                )}
              </div>
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
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold">F2</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Park / Hold Current Bill</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold">F3</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Recall Parked Bills</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold">F4</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Complete Checkout & Print</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold">F10</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Close Open Modal / Dialog</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESC/POS 80mm Thermal Receipt Print Preview Modal */}
      {printSuccessModal && lastCompletedBill && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[3px] shadow-2xl border border-slate-300 w-full max-w-sm p-4 space-y-3 font-['Inter',sans-serif] text-xs">
            {/* Success icon & confirmation */}
            <div className="text-center pb-2 border-b border-slate-200">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-[#006a4e] flex items-center justify-center mb-1.5">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Order Billed Successfully</h3>
              <p className="text-xs text-slate-500">
                {lastCompletedBill.billNo} • {lastCompletedBill.customerName}
              </p>
            </div>

            {/* Total Paid Prominent Box */}
            <div className="p-2.5 rounded-[3px] bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900">Total Amount (মোট পরিশোধিত):</span>
              <span className="text-base font-extrabold text-[#006a4e]">
                ৳ {lastCompletedBill.total.toLocaleString()}
              </span>
            </div>

            {/* Receipt Details Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-2 text-[11px] text-slate-500 space-y-0.5">
              <h4 className="font-bold text-xs text-slate-900">Green Life Hospital Ltd. Pharmacy</h4>
              <p>Dhanmondi, Dhaka-1205 • Tel: +880 1711-000005</p>
              <p className="text-slate-600">{lastCompletedBill.date} • {lastCompletedBill.time}</p>
              <p className="text-slate-600">Payment: <span className="font-semibold uppercase">{lastCompletedBill.paymentMethod}</span></p>
            </div>

            <div className="text-xs text-slate-600 space-y-0.5">
              <p>
                Customer: <strong className="text-slate-900">{lastCompletedBill.customerName}</strong>
              </p>
              {lastCompletedBill.customerPhone && <p>Phone: {lastCompletedBill.customerPhone}</p>}
              {lastCompletedBill.bedNo && (
                <p>
                  Bed/Ward: {lastCompletedBill.bedNo} ({lastCompletedBill.ward})
                </p>
              )}
              <p>Cashier: Md. Rafiqul Islam (Counter 02)</p>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
              {lastCompletedBill.items.map((it: CartItem, i: number) => {
                const packPrice = getPackUnitPrice(it.medicine, it.saleUnit);
                return (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="truncate max-w-[180px] text-slate-800">
                      {it.medicine.name} ({it.saleUnit}) x{it.qty}
                    </span>
                    <span className="font-bold text-slate-900">৳ {(packPrice * it.qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">৳ {lastCompletedBill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount:</span>
                <span className="font-semibold text-rose-600">-৳ {lastCompletedBill.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (5%):</span>
                <span className="font-semibold text-slate-800">৳ {lastCompletedBill.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-slate-200 pt-1 text-slate-900">
                <span>Total Paid:</span>
                <span className="text-[#006a4e] font-extrabold">৳ {lastCompletedBill.total}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-0.5">
                <span>Tendered:</span>
                <span className="font-semibold text-slate-800">৳ {lastCompletedBill.tendered}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Change Returned:</span>
                <span className="font-semibold text-emerald-700">৳ {lastCompletedBill.change}</span>
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
                Done / New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
