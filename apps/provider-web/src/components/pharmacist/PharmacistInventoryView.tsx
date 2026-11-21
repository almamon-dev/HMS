import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Building2,
  Download,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { PageHeader } from '../common/PageHeader';

interface MedicineItem {
  id: string;
  code: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  category: string;
  centralStock: number;
  dhanmondiStock: number;
  uttaraStock: number;
  mirpurStock: number;
  unitPrice: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export const PharmacistInventoryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const medicines: MedicineItem[] = [
    {
      id: 'MED-101',
      code: 'PAR-EXTRA',
      brandName: 'Napa Extra',
      genericName: 'Paracetamol + Caffeine',
      dosageForm: 'Tablet',
      strength: '500mg + 65mg',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      category: 'Analgesics',
      centralStock: 12500,
      dhanmondiStock: 1400,
      uttaraStock: 850,
      mirpurStock: 620,
      unitPrice: 3.5,
      reorderLevel: 1000,
      status: 'In Stock',
    },
    {
      id: 'MED-102',
      code: 'ESO-MAX',
      brandName: 'Maxpro',
      genericName: 'Esomeprazole Magnesium',
      dosageForm: 'Capsule',
      strength: '20mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      category: 'Gastrointestinal',
      centralStock: 8400,
      dhanmondiStock: 920,
      uttaraStock: 480,
      mirpurStock: 310,
      unitPrice: 9.0,
      reorderLevel: 800,
      status: 'In Stock',
    },
    {
      id: 'MED-103',
      code: 'CEF-1G',
      brandName: 'Ceftron 1g IV/IM',
      genericName: 'Ceftriaxone Sodium',
      dosageForm: 'Injection (Vial)',
      strength: '1g',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      category: 'Antibiotics',
      centralStock: 140,
      dhanmondiStock: 25,
      uttaraStock: 15,
      mirpurStock: 10,
      unitPrice: 195.0,
      reorderLevel: 300,
      status: 'Critical',
    },
    {
      id: 'MED-104',
      code: 'MER-1G',
      brandName: 'Meronem 1g IV',
      genericName: 'Meropenem Trihydrate',
      dosageForm: 'Injection (Vial)',
      strength: '1g',
      manufacturer: 'Incepta Pharmaceuticals',
      category: 'Antibiotics',
      centralStock: 320,
      dhanmondiStock: 45,
      uttaraStock: 30,
      mirpurStock: 20,
      unitPrice: 1100.0,
      reorderLevel: 150,
      status: 'In Stock',
    },
    {
      id: 'MED-105',
      code: 'MON-10',
      brandName: 'Monas 10mg',
      genericName: 'Montelukast Sodium',
      dosageForm: 'Chewable Tab',
      strength: '10mg',
      manufacturer: 'Acme Laboratories Ltd.',
      category: 'Respiratory',
      centralStock: 2100,
      dhanmondiStock: 180,
      uttaraStock: 90,
      mirpurStock: 40,
      unitPrice: 17.0,
      reorderLevel: 400,
      status: 'Low Stock',
    },
    {
      id: 'MED-106',
      code: 'CLO-75',
      brandName: 'Plagrin 75mg',
      genericName: 'Clopidogrel Bisulfate',
      dosageForm: 'Tablet',
      strength: '75mg',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      category: 'Cardiovascular',
      centralStock: 4600,
      dhanmondiStock: 540,
      uttaraStock: 320,
      mirpurStock: 210,
      unitPrice: 14.0,
      reorderLevel: 500,
      status: 'In Stock',
    },
    {
      id: 'MED-107',
      code: 'AZI-500',
      brandName: 'Azithrocin 500mg',
      genericName: 'Azithromycin Dihydrate',
      dosageForm: 'Tablet',
      strength: '500mg',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      category: 'Antibiotics',
      centralStock: 3800,
      dhanmondiStock: 410,
      uttaraStock: 290,
      mirpurStock: 180,
      unitPrice: 35.0,
      reorderLevel: 400,
      status: 'In Stock',
    },
    {
      id: 'MED-108',
      code: 'SER-20',
      brandName: 'Sergel 20mg',
      genericName: 'Esomeprazole Trihydrate',
      dosageForm: 'Capsule',
      strength: '20mg',
      manufacturer: 'Healthcare Pharmaceuticals Ltd.',
      category: 'Gastrointestinal',
      centralStock: 6200,
      dhanmondiStock: 740,
      uttaraStock: 510,
      mirpurStock: 330,
      unitPrice: 8.0,
      reorderLevel: 600,
      status: 'In Stock',
    },
  ];

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchCat = selectedCategory === 'All' || m.category === selectedCategory;
      const matchStat = selectedStatus === 'All' || m.status === selectedStatus;
      return matchCat && matchStat;
    });
  }, [selectedCategory, selectedStatus]);

  const columns: DataTableColumn<MedicineItem>[] = [
    {
      key: 'brandName',
      header: 'Medicine & Brand',
      sortable: true,
      sortValue: (r) => r.brandName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">
            {r.brandName}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {r.genericName} • {r.strength}
          </span>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'SKU Code',
      sortable: true,
      sortValue: (r) => r.code,
      render: (r) => (
        <span className="font-mono text-xs font-bold text-[#006a4e]">
          {r.code}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Form & Category',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => (
        <div>
          <span className="text-xs font-semibold text-slate-700 block">
            {r.dosageForm}
          </span>
          <span className="text-[11px] text-slate-400">
            {r.category}
          </span>
        </div>
      ),
    },
    {
      key: 'manufacturer',
      header: 'Manufacturer',
      sortable: true,
      sortValue: (r) => r.manufacturer,
      render: (r) => (
        <span className="text-xs text-slate-700 font-medium whitespace-nowrap">
          {r.manufacturer}
        </span>
      ),
    },
    {
      key: 'centralStock',
      header: 'CMS Central',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.centralStock,
      render: (r) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {r.centralStock.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'dhanmondiStock',
      header: 'Dhanmondi',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.dhanmondiStock,
      render: (r) => (
        <span className="font-mono text-xs text-slate-700">
          {r.dhanmondiStock.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'uttaraStock',
      header: 'Uttara',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.uttaraStock,
      render: (r) => (
        <span className="font-mono text-xs text-slate-700">
          {r.uttaraStock.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'mirpurStock',
      header: 'Mirpur',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.mirpurStock,
      render: (r) => (
        <span className="font-mono text-xs text-slate-700">
          {r.mirpurStock.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'unitPrice',
      header: 'MRP (৳)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.unitPrice,
      render: (r) => (
        <span className="font-bold text-slate-900 text-xs">
          ৳ {r.unitPrice.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Health Status',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => {
        let cls = 'bg-slate-100 text-slate-700 border-slate-200';
        if (r.status === 'In Stock') cls = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
        else if (r.status === 'Low Stock') cls = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
        else if (r.status === 'Critical') cls = 'bg-rose-50 text-rose-800 border-rose-300 font-bold animate-pulse';

        return (
          <span className={`px-2 py-0.5 rounded-[3px] text-xs border whitespace-nowrap ${cls}`}>
            {r.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: () => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="px-2 py-1 rounded-[3px] bg-[#0c2e4b] hover:bg-[#081e31] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Transfer
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <PageHeader
        title="Inventory & Stock"
        description="Central Medical Store · Scoped formulary & batch stock valuation"
      />
      {/* 4 Summary Metric Cards matching Doctor Portal format */}
      <SummaryCardGrid>
        <SummaryCard
          title="Total Formulary SKUs"
          icon={Boxes}
          iconColor="text-[#006a4e]"
          value="1,480 SKUs"
          subtitle="Registered across all branches"
        />
        <SummaryCard
          title="Central Warehouse Stock"
          icon={Building2}
          iconColor="text-[#006a4e]"
          value="482,500 Units"
          subtitle="CMS central storage reserve"
        />
        <SummaryCard
          title="Low Stock Warning"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          value="14 SKUs"
          valueColor="text-amber-700"
          subtitle="Below safe reorder levels"
        />
        <SummaryCard
          title="Critical Shortage"
          icon={ShieldAlert}
          iconColor="text-rose-600"
          value="2 SKUs"
          valueColor="text-rose-700"
          subtitle="Emergency procurement required"
        />
      </SummaryCardGrid>

      {/* Enterprise DataTable matching Doctor Portal */}
      <DataTable<MedicineItem>
        data={filteredMedicines}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search brand, generic, SKU code, or manufacturer..."
        searchFilter={(item, query) =>
          item.brandName.toLowerCase().includes(query.toLowerCase()) ||
          item.genericName.toLowerCase().includes(query.toLowerCase()) ||
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.manufacturer.toLowerCase().includes(query.toLowerCase())
        }
        toolbarFilters={
          <div className="flex items-center gap-2">
            <DropdownSelect
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              options={['All', 'Analgesics', 'Gastrointestinal', 'Antibiotics', 'Respiratory', 'Cardiovascular']}
              width="w-36"
            />
            <DropdownSelect
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              options={['All', 'In Stock', 'Low Stock', 'Critical']}
              width="w-32"
            />
          </div>
        }
        headerActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2.5 py-1 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
          </div>
        }
        emptyTitle="No medicines found"
        emptyDescription="No formulary items match the selected filter criteria."
        showSerial={true}
      />
    </div>
  );
};
