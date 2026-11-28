import React, { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle,
  CheckCircle2,
  DollarSign,
  Download,
  Eye,
  FileCheck2,
  Package,
  PackageCheck,
  Plus,
  Printer,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import {
  PharmacySupplier,
  getStoredSuppliers,
  addSupplier,
  saveStoredSuppliers,
} from '../../data/pharmacySuppliersData';

export interface PurchaseOrderItem {
  id: string;
  itemName: string;
  genericName: string;
  dosageForm: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  itemCount: number;
  paymentTerms: string;
  destination: string;
  urgency: 'Standard' | 'Urgent' | 'Emergency';
  notes?: string;
  items: PurchaseOrderItem[];
  status: 'Draft' | 'Sent to Vendor' | 'Partially Received' | 'GRN Completed & Closed';
  threeWayMatch: boolean;
  challanNo?: string;
  grnNo?: string;
}

// Available Medicines Catalog for Quick Line Item Addition
const MEDICINE_CATALOG = [
  { name: 'Napa Extra (500mg+65mg) Tablet', generic: 'Paracetamol + Caffeine', form: 'Tablet', defaultPrice: 2.5 },
  { name: 'Seclo 20 (20mg) Capsule', generic: 'Omeprazole', form: 'Capsule', defaultPrice: 5.0 },
  { name: 'Maxpro 20 (20mg) Capsule', generic: 'Esomeprazole', form: 'Capsule', defaultPrice: 7.0 },
  { name: 'Ciprocin 500 (500mg) Tablet', generic: 'Ciprofloxacin', form: 'Tablet', defaultPrice: 14.0 },
  { name: 'Fexo 120 (120mg) Tablet', generic: 'Fexofenadine HCl', form: 'Tablet', defaultPrice: 9.0 },
  { name: 'Azithrocin 500 (500mg) Tablet', generic: 'Azithromycin', form: 'Tablet', defaultPrice: 35.0 },
  { name: 'Human Albumin 20% 50ml IV', generic: 'Human Normal Albumin', form: 'Infusion', defaultPrice: 4800.0 },
  { name: 'Meropenem 1g IV Injection', generic: 'Meropenem Trihydrate', form: 'Injection', defaultPrice: 1150.0 },
  { name: 'Insulin Glargine 100IU/ml Cartridge', generic: 'Insulin Glargine', form: 'Injection', defaultPrice: 850.0 },
  { name: 'Oral Rehydration Salts (ORS) Sachet', generic: 'Oral Electrolytes Formula', form: 'Powder', defaultPrice: 6.5 },
];

const MEDICINE_DROPDOWN_OPTIONS = MEDICINE_CATALOG.map((m) => ({
  label: `${m.name} · ${m.generic}`,
  value: m.name,
}));

const DEFAULT_VENDOR_FALLBACK = [
  'Square Pharmaceuticals Ltd.',
  'Beximco Pharmaceuticals Ltd.',
  'Incepta Pharmaceuticals Ltd.',
  'Renata Limited',
  'Acme Laboratories Ltd.',
  'Eskayef Pharmaceuticals Ltd.',
  'Opsonin Pharma Ltd.',
  'Aristopharma Ltd.',
];

const DESTINATION_OPTIONS = [
  'Central Medical Store (CMS) - Main Depot',
  'Dhanmondi OPD Pharmacy Depot',
  'Uttara Branch Pharmacy Depot',
  'Chittagong Central Medical Depot',
];

const PAYMENT_TERMS_OPTIONS = [
  'Net 30 Days',
  'Net 45 Days',
  'Net 60 Days',
  'Cash on Delivery (COD)',
  'Advance LC 100%',
];

const URGENCY_OPTIONS = [
  'Standard',
  'Urgent',
  'Emergency',
];

const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-01',
    poNumber: 'PO-2026-0192',
    vendorName: 'Square Pharmaceuticals Ltd.',
    orderDate: '2026-11-18',
    expectedDelivery: '2026-11-24',
    totalAmount: 1850000,
    itemCount: 24,
    paymentTerms: 'Net 30 Days',
    destination: 'Central Medical Store (CMS) - Main Depot',
    urgency: 'Standard',
    status: 'Sent to Vendor',
    threeWayMatch: false,
    challanNo: 'CH-SQ-9841',
    notes: 'Scheduled monthly high-velocity oral tablet restock.',
    items: [
      {
        id: 'POI-101',
        itemName: 'Napa Extra (500mg+65mg) Tablet',
        genericName: 'Paracetamol + Caffeine',
        dosageForm: 'Tablet',
        quantity: 200000,
        unitPrice: 2.5,
        totalPrice: 500000,
      },
      {
        id: 'POI-102',
        itemName: 'Seclo 20 (20mg) Capsule',
        genericName: 'Omeprazole',
        dosageForm: 'Capsule',
        quantity: 150000,
        unitPrice: 5.0,
        totalPrice: 750000,
      },
      {
        id: 'POI-103',
        itemName: 'Ciprocin 500 (500mg) Tablet',
        genericName: 'Ciprofloxacin',
        dosageForm: 'Tablet',
        quantity: 42857,
        unitPrice: 14.0,
        totalPrice: 600000,
      },
    ],
  },
  {
    id: 'PO-02',
    poNumber: 'PO-2026-0188',
    vendorName: 'Beximco Pharmaceuticals Ltd.',
    orderDate: '2026-11-14',
    expectedDelivery: '2026-11-19',
    totalAmount: 1240000,
    itemCount: 18,
    paymentTerms: 'Net 45 Days',
    destination: 'Central Medical Store (CMS) - Main Depot',
    urgency: 'Standard',
    status: 'GRN Completed & Closed',
    threeWayMatch: true,
    challanNo: 'BEX-CH-44910',
    grnNo: 'GRN-2026-1104',
    notes: 'Restock of gastro & respiratory formulations.',
    items: [
      {
        id: 'POI-201',
        itemName: 'Maxpro 20 (20mg) Capsule',
        genericName: 'Esomeprazole',
        dosageForm: 'Capsule',
        quantity: 100000,
        unitPrice: 7.0,
        totalPrice: 700000,
      },
      {
        id: 'POI-202',
        itemName: 'Azithrocin 500 (500mg) Tablet',
        genericName: 'Azithromycin',
        dosageForm: 'Tablet',
        quantity: 15428,
        unitPrice: 35.0,
        totalPrice: 540000,
      },
    ],
  },
  {
    id: 'PO-03',
    poNumber: 'PO-2026-0185',
    vendorName: 'Incepta Pharmaceuticals Ltd.',
    orderDate: '2026-11-10',
    expectedDelivery: '2026-11-15',
    totalAmount: 980000,
    itemCount: 12,
    paymentTerms: 'Net 30 Days',
    destination: 'Central Medical Store (CMS) - Main Depot',
    urgency: 'Emergency',
    status: 'GRN Completed & Closed',
    threeWayMatch: true,
    challanNo: 'INC-2026-881',
    grnNo: 'GRN-2026-1092',
    notes: 'Emergency critical care antibiotics order.',
    items: [
      {
        id: 'POI-301',
        itemName: 'Meropenem 1g IV Injection',
        genericName: 'Meropenem Trihydrate',
        dosageForm: 'Injection',
        quantity: 852,
        unitPrice: 1150.0,
        totalPrice: 980000,
      },
    ],
  },
  {
    id: 'PO-04',
    poNumber: 'PO-2026-0182',
    vendorName: 'Renata Limited',
    orderDate: '2026-11-06',
    expectedDelivery: '2026-11-12',
    totalAmount: 760000,
    itemCount: 10,
    paymentTerms: 'Net 30 Days',
    destination: 'Central Medical Store (CMS) - Main Depot',
    urgency: 'Standard',
    status: 'GRN Completed & Closed',
    threeWayMatch: true,
    challanNo: 'REN-DC-7832',
    grnNo: 'GRN-2026-1077',
    notes: 'Hormone & vitamin supplements buffer replenishment.',
    items: [
      {
        id: 'POI-401',
        itemName: 'Fexo 120 (120mg) Tablet',
        genericName: 'Fexofenadine HCl',
        dosageForm: 'Tablet',
        quantity: 84444,
        unitPrice: 9.0,
        totalPrice: 760000,
      },
    ],
  },
  {
    id: 'PO-05',
    poNumber: 'PO-2026-0180',
    vendorName: 'Acme Laboratories Ltd.',
    orderDate: '2026-11-01',
    expectedDelivery: '2026-11-08',
    totalAmount: 540000,
    itemCount: 8,
    paymentTerms: 'Cash on Delivery (COD)',
    destination: 'Central Medical Store (CMS) - Main Depot',
    urgency: 'Standard',
    status: 'GRN Completed & Closed',
    threeWayMatch: true,
    challanNo: 'ACM-CH-0921',
    grnNo: 'GRN-2026-1051',
    notes: 'Pediatric drops and oral rehydration bulk restock.',
    items: [
      {
        id: 'POI-501',
        itemName: 'Oral Rehydration Salts (ORS) Sachet',
        genericName: 'Oral Electrolytes Formula',
        dosageForm: 'Powder',
        quantity: 83076,
        unitPrice: 6.5,
        totalPrice: 540000,
      },
    ],
  },
];

interface OrderItemInput {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export const PharmacistPurchasesView: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Suppliers Registry State
  const [suppliers, setSuppliers] = useState<PharmacySupplier[]>(() => getStoredSuppliers());
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isSuppliersDirectoryOpen, setIsSuppliersDirectoryOpen] = useState(false);

  // New Supplier Form State
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierCode, setNewSupplierCode] = useState('');
  const [newSupplierContact, setNewSupplierContact] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newSupplierAddress, setNewSupplierAddress] = useState('');
  const [newSupplierDrugLicense, setNewSupplierDrugLicense] = useState('');
  const [newSupplierTradeLicense, setNewSupplierTradeLicense] = useState('');
  const [newSupplierPaymentTerms, setNewSupplierPaymentTerms] = useState('Net 30 Days');
  const [newSupplierCategory, setNewSupplierCategory] = useState('Allopathic / Finished Formulations');

  // Supplier Search Query in Directory Modal
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');

  // Multi-Item Create Purchase Order Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState(suppliers[0]?.name || DEFAULT_VENDOR_FALLBACK[0]);
  const [destination, setDestination] = useState(DESTINATION_OPTIONS[0]);
  const [orderDate, setOrderDate] = useState('2026-11-23');
  const [expectedDelivery, setExpectedDelivery] = useState('2026-11-28');
  const [paymentTerms, setPaymentTerms] = useState(PAYMENT_TERMS_OPTIONS[0]);
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Emergency'>('Standard');
  const [notes, setNotes] = useState('');

  // Multiple Line Items State
  const [orderItems, setOrderItems] = useState<OrderItemInput[]>([
    {
      id: 'item-1',
      itemName: MEDICINE_CATALOG[0].name,
      quantity: 50000,
      unitPrice: MEDICINE_CATALOG[0].defaultPrice,
    },
    {
      id: 'item-2',
      itemName: MEDICINE_CATALOG[1].name,
      quantity: 30000,
      unitPrice: MEDICINE_CATALOG[1].defaultPrice,
    },
  ]);

  // Printable PO State
  const [printablePO, setPrintablePO] = useState<PurchaseOrder | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Computed Vendor Options from Dynamic Suppliers Registry
  const vendorOptions = useMemo(() => {
    return suppliers.map((s) => s.name);
  }, [suppliers]);

  // Filtered Suppliers for the Directory Modal
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearchQuery.trim()) return suppliers;
    const q = supplierSearchQuery.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.drugLicense.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [suppliers, supplierSearchQuery]);

  // Register New Supplier / Company
  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName.trim()) {
      showToast('Error: Company / Supplier name is required.');
      return;
    }

    const created = addSupplier({
      name: newSupplierName.trim(),
      code: newSupplierCode.trim() || newSupplierName.trim().slice(0, 4).toUpperCase(),
      contactPerson: newSupplierContact.trim() || 'Procurement Representative',
      phone: newSupplierPhone.trim() || '+880 1700-000000',
      email: newSupplierEmail.trim() || 'orders@pharmaceutical.local',
      address: newSupplierAddress.trim() || 'Industrial Area, Dhaka, Bangladesh',
      drugLicense: newSupplierDrugLicense.trim() || 'DL-DH-PENDING',
      tradeLicense: newSupplierTradeLicense.trim() || 'TR-PENDING',
      paymentTerms: newSupplierPaymentTerms,
      category: newSupplierCategory,
      status: 'Active',
    });

    const refreshed = getStoredSuppliers();
    setSuppliers(refreshed);
    setVendorName(created.name);
    setIsAddSupplierModalOpen(false);

    // Reset Form
    setNewSupplierName('');
    setNewSupplierCode('');
    setNewSupplierContact('');
    setNewSupplierPhone('');
    setNewSupplierEmail('');
    setNewSupplierAddress('');
    setNewSupplierDrugLicense('');
    setNewSupplierTradeLicense('');
    setNewSupplierPaymentTerms('Net 30 Days');

    showToast(`Supplier "${created.name}" registered & selected for purchase order!`);
  };

  // Remove Supplier
  const handleDeleteSupplier = (id: string, name: string) => {
    const hasOrders = purchaseOrders.some((po) => po.vendorName.toLowerCase() === name.toLowerCase());
    if (hasOrders) {
      showToast(`Cannot delete "${name}": Active purchase orders are assigned to this company.`);
      return;
    }
    const updated = suppliers.filter((s) => s.id !== id);
    setSuppliers(updated);
    saveStoredSuppliers(updated);
    showToast(`Supplier "${name}" removed from registry.`);
  };

  // Add Item Row
  const handleAddItem = () => {
    const nextMed = MEDICINE_CATALOG[orderItems.length % MEDICINE_CATALOG.length];
    setOrderItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        itemName: nextMed.name,
        quantity: 5000,
        unitPrice: nextMed.defaultPrice,
      },
    ]);
  };

  // Remove Item Row
  const handleRemoveItem = (id: string) => {
    if (orderItems.length <= 1) {
      showToast('A Purchase Order must contain at least 1 item.');
      return;
    }
    setOrderItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Handle Medicine Selection Change in Row
  const handleItemMedicineChange = (id: string, medName: string) => {
    const found = MEDICINE_CATALOG.find((m) => m.name === medName);
    setOrderItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            itemName: medName,
            unitPrice: found ? found.defaultPrice : it.unitPrice,
          };
        }
        return it;
      })
    );
  };

  // Handle Quantity Change in Row
  const handleItemQuantityChange = (id: string, qty: number) => {
    setOrderItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: Math.max(1, qty) } : it))
    );
  };

  // Handle Unit Price Change in Row
  const handleItemPriceChange = (id: string, price: number) => {
    setOrderItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, unitPrice: Math.max(0, price) } : it))
    );
  };

  // Live Multi-Item Calculations
  const totals = useMemo(() => {
    const totalQuantity = orderItems.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const totalAmount = orderItems.reduce(
      (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      0
    );
    return {
      totalQuantity,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  }, [orderItems]);

  // Handle PO Creation Submit
  const handleCreatePurchaseOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const nextPoNum = `PO-2026-${String(purchaseOrders.length + 193).padStart(4, '0')}`;

    const formattedItems: PurchaseOrderItem[] = orderItems.map((it, idx) => {
      const med = MEDICINE_CATALOG.find((m) => m.name === it.itemName) || {
        name: it.itemName,
        generic: 'Pharmaceutical Formulation',
        form: 'Tablet',
        defaultPrice: it.unitPrice,
      };
      const lineTotal = Math.round(it.quantity * it.unitPrice * 100) / 100;
      return {
        id: `POI-${Date.now()}-${idx}`,
        itemName: med.name,
        genericName: med.generic,
        dosageForm: med.form,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: lineTotal,
      };
    });

    const newPO: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      poNumber: nextPoNum,
      vendorName,
      orderDate,
      expectedDelivery,
      totalAmount: totals.totalAmount,
      itemCount: orderItems.length,
      paymentTerms,
      destination,
      urgency,
      notes: notes.trim() || 'Procurement order transmitted to supplier via Electronic Data Interchange (EDI).',
      items: formattedItems,
      status: 'Sent to Vendor',
      threeWayMatch: false,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    setSelectedPO(newPO);
    setIsCreateModalOpen(false);
    showToast(`Purchase Order ${nextPoNum} with ${orderItems.length} SKUs transmitted to ${vendorName}!`);
  };

  // Complete GRN & 3-Way Match Verification
  const handleVerifyGRN = (poId: string) => {
    const grnNo = `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const challanNo = `CH-GEN-${Math.floor(10000 + Math.random() * 90000)}`;
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          const updated: PurchaseOrder = {
            ...po,
            status: 'GRN Completed & Closed',
            threeWayMatch: true,
            grnNo,
            challanNo: po.challanNo || challanNo,
          };
          if (selectedPO?.id === poId) {
            setSelectedPO(updated);
          }
          return updated;
        }
        return po;
      })
    );
    showToast(`3-Way Match verified! Goods Receipt Note ${grnNo} posted to Central Inventory.`);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['PO Number', 'Vendor', 'Order Date', 'Expected Delivery', 'SKUs', 'Total Amount (BDT)', 'Status', '3-Way Match'];
    const rows = filteredOrders.map((p) => [
      p.poNumber,
      `"${p.vendorName}"`,
      p.orderDate,
      p.expectedDelivery,
      p.itemCount,
      p.totalAmount,
      `"${p.status}"`,
      p.threeWayMatch ? 'Verified' : 'Pending GRN',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Purchase_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Purchase Orders exported to CSV.');
  };

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (statusFilter !== 'All' && !po.status.toLowerCase().includes(statusFilter.toLowerCase())) {
        return false;
      }
      if (vendorFilter !== 'All' && po.vendorName !== vendorFilter) {
        return false;
      }
      return true;
    });
  }, [purchaseOrders, statusFilter, vendorFilter]);

  const stats = useMemo(() => {
    const total = purchaseOrders.length;
    const pendingGrn = purchaseOrders.filter((p) => !p.threeWayMatch).length;
    const verified = purchaseOrders.filter((p) => p.threeWayMatch).length;
    const totalSpend = purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0);
    return { total, pendingGrn, verified, totalSpend };
  }, [purchaseOrders]);

  const columns: DataTableColumn<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO Number',
      sortable: true,
      sortValue: (r) => r.poNumber,
      render: (r) => (
        <span className="font-mono font-semibold text-[#006a4e] text-xs">
          {r.poNumber}
        </span>
      ),
    },
    {
      key: 'vendorName',
      header: 'Manufacturer / Vendor',
      sortable: true,
      sortValue: (r) => r.vendorName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">
            {r.vendorName}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {r.destination.split('-')[0]}
          </span>
        </div>
      ),
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      sortable: true,
      sortValue: (r) => r.orderDate,
      render: (r) => (
        <span className="text-xs text-slate-600 font-mono font-medium">
          {r.orderDate}
        </span>
      ),
    },
    {
      key: 'expectedDelivery',
      header: 'Expected Delivery',
      sortable: true,
      sortValue: (r) => r.expectedDelivery,
      render: (r) => (
        <span className="text-xs text-slate-600 font-mono font-medium">
          {r.expectedDelivery}
        </span>
      ),
    },
    {
      key: 'itemCount',
      header: 'SKUs Count',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.itemCount,
      render: (r) => (
        <span className="text-xs font-semibold text-slate-700">
          {r.itemCount} SKUs
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'PO Value (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.totalAmount,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ৳ {r.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'threeWayMatch',
      header: '3-Way Match',
      align: 'center',
      sortable: true,
      sortValue: (r) => (r.threeWayMatch ? 1 : 0),
      render: (r) =>
        r.threeWayMatch ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        ) : (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-[3px] border border-amber-200">
            Pending GRN
          </span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium border whitespace-nowrap ${
            r.status.includes('Completed')
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : r.status === 'Sent to Vendor'
              ? 'bg-sky-50 text-sky-800 border-sky-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {r.status}
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
            onClick={() => setSelectedPO(r)}
            className="px-2 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <Eye className="w-3 h-3" />
            <span>Inspect PO</span>
          </button>
        </div>
      ),
    },
  ];

  // Superadmin Header Actions
  const headerActions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => {
          setIsCreateModalOpen(true);
        }}
        className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Create Purchase Order</span>
      </button>

      <button
        type="button"
        onClick={() => setIsAddSupplierModalOpen(true)}
        className="h-8 px-2.5 rounded-[3px] bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Supplier</span>
      </button>

      <button
        type="button"
        onClick={() => setIsSuppliersDirectoryOpen(true)}
        className="h-8 px-2.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
      >
        <Building2 className="w-3.5 h-3.5 text-slate-500" />
        <span>Suppliers Directory ({suppliers.length})</span>
      </button>

      <button
        type="button"
        onClick={handleExportCsv}
        className="h-8 px-2.5 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Export CSV</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-2 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Summary Metric Cards Matching Superadmin Directory Format (No borders, No hovers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Active Purchase Orders</span>
            <ShoppingCart className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-[#006a4e] leading-none">
              {stats.total} Orders
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Procurement pipeline active</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Pending GRN Receipts</span>
            <Truck className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-amber-700 leading-none">
              {stats.pendingGrn} Shipments
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Awaiting warehouse intake & match</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">3-Way Match Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#006a4e]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-[#006a4e] leading-none">
              {stats.verified} Verified
            </span>
          </div>
          <p className="text-[10px] text-slate-500">PO vs Invoice vs Physical GRN</p>
        </div>

        <div className="bg-white rounded-[3px] p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-700">Total Procurement Value</span>
            <DollarSign className="w-3.5 h-3.5 text-[#0c2e4b]" />
          </div>
          <div className="my-1">
            <span className="text-base font-extrabold text-slate-900 leading-none">
              ৳ {(stats.totalSpend / 100000).toFixed(1)} Lakh
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Total audited supplier commitments</p>
        </div>
      </div>

      {/* Selected Purchase Order Quick View Card (Matching Superadmin directory) */}
      {selectedPO && (
        <div className="bg-white border border-[#006a4e]/25 rounded-[3px] p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                  PO: {selectedPO.poNumber}
                </span>
                <span className="text-sm font-semibold text-slate-800">{selectedPO.vendorName}</span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    selectedPO.urgency === 'Emergency'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : selectedPO.urgency === 'Urgent'
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {selectedPO.urgency}
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-[#006a4e] border border-emerald-200">
                  {selectedPO.paymentTerms}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Destination: <span className="font-semibold text-slate-700">{selectedPO.destination}</span> · Order Date:{' '}
                <span className="font-mono text-slate-700">{selectedPO.orderDate}</span> · Expected Delivery:{' '}
                <span className="font-mono text-[#006a4e]">{selectedPO.expectedDelivery}</span>
              </p>
            </div>

            {/* Actions row with inline close button */}
            <div className="flex items-center gap-2 shrink-0">
              {!selectedPO.threeWayMatch && (
                <button
                  type="button"
                  onClick={() => handleVerifyGRN(selectedPO.id)}
                  className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Verify GRN & 3-Way Match</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPrintablePO(selectedPO)}
                className="h-8 px-3 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print PO</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPO(null)}
                className="h-8 px-2.5 rounded-[3px] border border-slate-300 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                aria-label="Close details"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* 3-Way Audit Trail Pipeline */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-[3px] border border-slate-200 flex items-start gap-2">
              <FileCheck2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-slate-800">1. Purchase Order (PO)</div>
                <div className="text-[10px] text-slate-500 font-mono">{selectedPO.poNumber} · Approved</div>
                <div className="text-[10px] font-semibold text-[#006a4e] mt-0.5">৳ {selectedPO.totalAmount.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-[3px] border border-slate-200 flex items-start gap-2">
              <Truck className={`w-4 h-4 shrink-0 mt-0.5 ${selectedPO.challanNo ? 'text-sky-600' : 'text-slate-400'}`} />
              <div>
                <div className="text-[11px] font-bold text-slate-800">2. Delivery Challan</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {selectedPO.challanNo ? `${selectedPO.challanNo} · In Transit` : 'Awaiting Supplier Dispatch'}
                </div>
                <div className="text-[10px] font-semibold text-slate-700 mt-0.5">Physical Goods Gatepass</div>
              </div>
            </div>

            <div className={`p-2.5 rounded-[3px] border flex items-start gap-2 ${
              selectedPO.threeWayMatch
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-amber-50/50 border-amber-200'
            }`}>
              <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${selectedPO.threeWayMatch ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div>
                <div className="text-[11px] font-bold text-slate-800">3. Physical GRN & 3-Way Match</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {selectedPO.grnNo ? `${selectedPO.grnNo} · Verified` : 'Pending Warehouse Inspection'}
                </div>
                <div className={`text-[10px] font-semibold mt-0.5 ${selectedPO.threeWayMatch ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {selectedPO.threeWayMatch ? 'Audit Closed & Approved for Payment' : 'Inspection Required'}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table within Quick View */}
          {selectedPO.items && selectedPO.items.length > 0 && (
            <div className="mt-3">
              <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Ordered SKU Line Items ({selectedPO.items.length})</span>
                <span className="text-slate-500 font-normal">Valuation: ৳ {selectedPO.totalAmount.toLocaleString()}</span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[10.5px]">
                    <tr>
                      <th className="py-1.5 px-2.5 font-semibold">#</th>
                      <th className="py-1.5 px-2.5 font-semibold">Medicine Description</th>
                      <th className="py-1.5 px-2.5 font-semibold">Generic & Form</th>
                      <th className="py-1.5 px-2.5 font-semibold text-right">Order Qty</th>
                      <th className="py-1.5 px-2.5 font-semibold text-right">Unit Trade Price (৳)</th>
                      <th className="py-1.5 px-2.5 font-semibold text-right">Total (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPO.items.map((it, idx) => (
                      <tr key={it.id || idx} className="hover:bg-slate-50/60">
                        <td className="py-1 px-2.5 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-1 px-2.5 font-semibold text-slate-800">{it.itemName}</td>
                        <td className="py-1 px-2.5 text-slate-600 text-[11px]">
                          {it.genericName} <span className="text-slate-400">({it.dosageForm})</span>
                        </td>
                        <td className="py-1 px-2.5 font-mono text-right font-medium text-slate-800">
                          {it.quantity.toLocaleString()} Pcs
                        </td>
                        <td className="py-1 px-2.5 font-mono text-right text-slate-700">
                          ৳ {it.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-1 px-2.5 font-mono text-right font-semibold text-slate-900">
                          ৳ {it.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enterprise DataTable Matching Superadmin Directory */}
      <DataTable<PurchaseOrder>
        data={filteredOrders}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search PO number, vendor, destination..."
        searchFilter={(item, query) =>
          item.poNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.vendorName.toLowerCase().includes(query.toLowerCase()) ||
          item.destination.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <div className="flex items-center gap-2">
            <DropdownSelect
              ariaLabel="Filter by status"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={['All', 'Sent to Vendor', 'GRN Completed & Closed', 'Draft']}
              width="w-44"
            />
            <DropdownSelect
              ariaLabel="Filter by vendor"
              value={vendorFilter}
              onChange={(val) => setVendorFilter(val)}
              options={['All', ...vendorOptions]}
              width="w-48"
            />
          </div>
        }
        headerActions={headerActions}
        emptyTitle="No purchase orders found"
        emptyDescription="No purchase orders match the selected filters."
        showSerial={true}
      />

      {/* ========================================================================= */}
      {/* MULTI-ITEM CREATE PURCHASE ORDER MODAL USING DROPDOWNSELECT COMPONENT      */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-[740px] w-full p-5 border border-slate-200 font-['Plus_Jakarta_Sans',sans-serif] max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create Manufacturer Purchase Order</h3>
                  <p className="text-[11px] text-slate-500">Initiate procurement order with multiple medicine line items</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form (Scrollable) */}
            <form onSubmit={handleCreatePurchaseOrder} className="space-y-3.5 mt-3 text-xs overflow-y-auto pr-1">
              {/* Row 1: Manufacturer & Receiving Depot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-700">Manufacturer / Supplier *</label>
                    <button
                      type="button"
                      onClick={() => setIsAddSupplierModalOpen(true)}
                      className="text-[11px] text-[#006a4e] hover:text-[#00553e] font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add New Company</span>
                    </button>
                  </div>
                  <DropdownSelect
                    native
                    options={[
                      ...vendorOptions.map((v) => ({ label: v, value: v })),
                      { label: '+ Add New Supplier / Company...', value: '__ADD_NEW_SUPPLIER__' },
                    ]}
                    value={vendorName}
                    onChange={(val) => {
                      if (val === '__ADD_NEW_SUPPLIER__') {
                        setIsAddSupplierModalOpen(true);
                      } else {
                        setVendorName(val);
                      }
                    }}
                    width="w-full"
                    className="w-full"
                  />
                </div>
                <div>
                  <DropdownSelect
                    native
                    label="Receiving Warehouse *"
                    options={DESTINATION_OPTIONS}
                    value={destination}
                    onChange={(val) => setDestination(val)}
                    width="w-full"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Row 2: Dates, Terms & Priority */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>

                <div>
                  <DropdownSelect
                    native
                    label="Payment Terms"
                    options={PAYMENT_TERMS_OPTIONS}
                    value={paymentTerms}
                    onChange={(val) => setPaymentTerms(val)}
                    width="w-full"
                    className="w-full"
                  />
                </div>

                <div>
                  <DropdownSelect
                    native
                    label="Requisition Priority"
                    options={URGENCY_OPTIONS}
                    value={urgency}
                    onChange={(val) => setUrgency(val as 'Standard' | 'Urgent' | 'Emergency')}
                    width="w-full"
                    className="w-full"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* MULTIPLE ITEMS SELECTION SECTION (FLAT, NO NESTED CARDS)                  */}
              {/* ========================================================================= */}
              <div className="pt-1">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span className="text-xs font-bold text-slate-800">
                      Procurement Line Items ({orderItems.length} SKUs)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Column Headers */}
                <div className="flex items-center gap-2.5 text-[10.5px] font-semibold text-slate-600 px-0.5 pb-1">
                  <div className="flex-1 min-w-0">Medicine / Formulation *</div>
                  <div className="w-24 shrink-0 text-right pr-2">Order Qty *</div>
                  <div className="w-24 shrink-0 text-right pr-2">Unit Price (৳) *</div>
                  <div className="w-28 shrink-0 text-right pr-2">Subtotal (৳)</div>
                  <div className="w-7 shrink-0"></div>
                </div>

                {/* Flat Item Rows (No nested cards, flex-1 medicine column, compact auto input widths) */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 divide-y divide-slate-100">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 pt-1.5 first:pt-0"
                    >
                      {/* Medicine Formulation (Auto Expands) */}
                      <div className="flex-1 min-w-0">
                        <DropdownSelect
                          native
                          options={MEDICINE_DROPDOWN_OPTIONS}
                          value={item.itemName}
                          onChange={(val) => handleItemMedicineChange(item.id, val)}
                          width="w-full"
                          className="w-full"
                        />
                      </div>

                      {/* Compact Order Qty */}
                      <div className="w-24 shrink-0">
                        <input
                          type="number"
                          min={1}
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          placeholder="Qty"
                          className="w-full h-8 px-2 font-mono text-right font-medium rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#006a4e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {/* Compact Unit Price */}
                      <div className="w-24 shrink-0">
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleItemPriceChange(item.id, parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                          className="w-full h-8 px-2 font-mono text-right font-medium rounded-[3px] border border-slate-300 text-xs focus:outline-hidden focus:border-[#006a4e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {/* Line Subtotal */}
                      <div className="w-28 shrink-0 flex items-center justify-end pr-2">
                        <span className="font-mono text-xs font-bold text-slate-900 text-right whitespace-nowrap">
                          ৳ {Math.round(item.quantity * item.unitPrice).toLocaleString()}
                        </span>
                      </div>

                      {/* Delete Row Button */}
                      <div className="w-7 shrink-0 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={orderItems.length <= 1}
                          className={`w-6 h-6 rounded-[3px] flex items-center justify-center transition-colors cursor-pointer ${
                            orderItems.length <= 1
                              ? 'opacity-25 cursor-not-allowed text-slate-300'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Summary Footer */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs px-0.5 gap-2">
                  <div className="text-slate-600 font-medium">
                    Total Physical Units:{' '}
                    <span className="font-mono font-bold text-slate-800">
                      {totals.totalQuantity.toLocaleString()} Pcs
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 font-medium">Grand Total Value:</span>
                    <span className="font-mono text-sm font-extrabold text-[#006a4e]">
                      ৳ {totals.totalAmount.toLocaleString()} BDT
                    </span>
                  </div>
                </div>
              </div>

              {/* Row: Notes & Order Date */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Procurement Notes & Storage Instructions
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Cold chain (2-8°C) mandatory. Provide manufacturer CoA with delivery."
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Order Date
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
                <div className="text-[11px] text-slate-500 font-medium">
                  {orderItems.length} SKUs · {totals.totalQuantity.toLocaleString()} Units · ৳ {totals.totalAmount.toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="h-8 px-3 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Create Purchase Order</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD NEW SUPPLIER / COMPANY NAME MODAL                                      */}
      {/* ========================================================================= */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-[620px] w-full p-5 border border-slate-200 font-['Plus_Jakarta_Sans',sans-serif] max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Pharmaceutical Supplier / Company</h3>
                  <p className="text-[11px] text-slate-500">Register a certified medicine manufacturer or procurement vendor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSupplierModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSupplier} className="space-y-3 mt-3 text-xs overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Company / Supplier Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Healthcare Pharmaceuticals Ltd."
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Short Code / Ticker
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HEALTHCARE"
                    value={newSupplierCode}
                    onChange={(e) => setNewSupplierCode(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Key Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Tanvir Hossain"
                    value={newSupplierContact}
                    onChange={(e) => setNewSupplierContact(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Official Mobile / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +880 1719-112233"
                    value={newSupplierPhone}
                    onChange={(e) => setNewSupplierPhone(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. orders@hpl.com.bd"
                    value={newSupplierEmail}
                    onChange={(e) => setNewSupplierEmail(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Drug Administration License No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DL-DH-1010"
                    value={newSupplierDrugLicense}
                    onChange={(e) => setNewSupplierDrugLicense(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Trade License No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TR-88227"
                    value={newSupplierTradeLicense}
                    onChange={(e) => setNewSupplierTradeLicense(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e]"
                  />
                </div>
                <div>
                  <DropdownSelect
                    native
                    label="Default Payment Terms"
                    options={PAYMENT_TERMS_OPTIONS}
                    value={newSupplierPaymentTerms}
                    onChange={(val) => setNewSupplierPaymentTerms(val)}
                    width="w-full"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Therapeutic / Supply Category
                </label>
                <select
                  value={newSupplierCategory}
                  onChange={(e) => setNewSupplierCategory(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#006a4e]"
                >
                  <option value="Allopathic / Finished Formulations">Allopathic / Finished Formulations</option>
                  <option value="Biologics, Vaccines & Cephalosporins">Biologics, Vaccines & Cephalosporins</option>
                  <option value="IV Infusions, Critical Care & Anesthetics">IV Infusions, Critical Care & Anesthetics</option>
                  <option value="Surgical, Medical Devices & Disposables">Surgical, Medical Devices & Disposables</option>
                  <option value="Specialty Formulations & Oncology">Specialty Formulations & Oncology</option>
                  <option value="General Consumer Healthcare">General Consumer Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Corporate / Depot Address
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Plot # 12, Tejgaon Industrial Area, Dhaka-1208, Bangladesh"
                  value={newSupplierAddress}
                  onChange={(e) => setNewSupplierAddress(e.target.value)}
                  className="w-full p-2 rounded-[3px] border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006a4e] resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-3.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Supplier & Company</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHARMACEUTICAL SUPPLIERS & COMPANIES DIRECTORY MODAL                       */}
      {/* ========================================================================= */}
      {isSuppliersDirectoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] shadow-2xl max-w-[960px] w-full p-5 border border-slate-200 font-['Plus_Jakarta_Sans',sans-serif] max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pharmaceutical Suppliers & Companies Directory ({suppliers.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Certified medicine manufacturers, accredited distributors & procurement partners
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierModalOpen(true)}
                  className="h-7 px-2.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New Supplier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSuppliersDirectoryOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="mt-3 mb-2 flex items-center justify-between gap-3 shrink-0">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search company by name, contact, phone, or license..."
                  value={supplierSearchQuery}
                  onChange={(e) => setSupplierSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-2.5 text-xs rounded-[3px] border border-slate-300 focus:outline-hidden focus:border-[#006a4e]"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                Showing <strong className="text-slate-800">{filteredSuppliers.length}</strong> registered companies
              </div>
            </div>

            {/* Table Container */}
            <div className="border border-slate-200 rounded-[3px] overflow-x-auto overflow-y-auto flex-1 min-h-[320px] max-h-[500px]">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#0c2e4b] text-white sticky top-0 z-10 text-[11px] font-semibold">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center">SL</th>
                    <th className="py-2 px-3">Company / Supplier Name</th>
                    <th className="py-2 px-3">Contact Person & Phone</th>
                    <th className="py-2 px-3">Drug / Trade License</th>
                    <th className="py-2 px-3">Default Terms</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No pharmaceutical companies match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((sup, idx) => (
                      <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900">{sup.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">{sup.code}</span>
                            <span>· {sup.address}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-medium text-slate-800">{sup.contactPerson}</div>
                          <div className="text-[11px] text-[#006a4e] font-mono">{sup.phone}</div>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px]">
                          <div><span className="text-slate-400">DGDA:</span> {sup.drugLicense}</div>
                          <div className="text-slate-500"><span className="text-slate-400">Trade:</span> {sup.tradeLicense}</div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                            {sup.paymentTerms}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 text-[11px] max-w-[150px] truncate" title={sup.category}>
                          {sup.category}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setVendorName(sup.name);
                                setIsSuppliersDirectoryOpen(false);
                                setIsCreateModalOpen(true);
                              }}
                              className="px-2 py-0.5 rounded-[2px] bg-[#006a4e] hover:bg-[#00553e] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                              title="Create PO with this supplier"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>Create PO</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSupplier(sup.id, sup.name)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete supplier"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                Authorized Supplier Master Data · Synced with DGDA & Hospital Procurement Policy
              </span>
              <button
                type="button"
                onClick={() => setIsSuppliersDirectoryOpen(false)}
                className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE PURCHASE ORDER PREVIEW MODAL                                    */}
      {/* ========================================================================= */}
      {printablePO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] p-6 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">GREENHOSPITAL HEALTHCARE SYSTEM</h2>
                <p className="text-xs text-slate-500">Central Medical Store (CMS) · Procurement Requisition</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-[#006a4e]">{printablePO.poNumber}</div>
                <div className="text-[11px] text-slate-500">{printablePO.orderDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div className="bg-slate-50 p-3 rounded-[3px] border border-slate-200">
                <div className="font-bold text-slate-700 mb-1">VENDOR INFORMATION:</div>
                <div className="font-semibold text-slate-900">{printablePO.vendorName}</div>
                <div className="text-slate-500">Pharmaceutical Supply Division</div>
                <div className="text-slate-500">Dhaka, Bangladesh</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-[3px] border border-slate-200">
                <div className="font-bold text-slate-700 mb-1">DELIVER TO:</div>
                <div className="font-semibold text-slate-900">{printablePO.destination}</div>
                <div className="text-slate-500">Terms: {printablePO.paymentTerms}</div>
                <div className="text-slate-500">Expected: {printablePO.expectedDelivery}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-[3px] overflow-hidden mb-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">SL</th>
                    <th className="py-2 px-3">Medicine Description</th>
                    <th className="py-2 px-3 text-right">Quantity</th>
                    <th className="py-2 px-3 text-right">Trade Price</th>
                    <th className="py-2 px-3 text-right">Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {printablePO.items.map((it, idx) => (
                    <tr key={it.id || idx}>
                      <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{it.itemName}</td>
                      <td className="py-2 px-3 font-mono text-right">{it.quantity.toLocaleString()} Pcs</td>
                      <td className="py-2 px-3 font-mono text-right">৳ {it.unitPrice.toFixed(2)}</td>
                      <td className="py-2 px-3 font-mono text-right font-bold text-slate-900">৳ {it.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/80 font-bold">
                    <td colSpan={4} className="py-2 px-3 text-right text-slate-700">Total Purchase Order Value:</td>
                    <td className="py-2 px-3 text-right font-mono text-[#006a4e]">৳ {printablePO.totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Authorized Electronic Requisition · Valid without manual physical seal.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintablePO(null)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="h-8 px-3 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
