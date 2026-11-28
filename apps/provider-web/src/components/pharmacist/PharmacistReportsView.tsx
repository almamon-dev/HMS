import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  DollarSign,
  Download,
  Layers,
  Printer,
  RefreshCw,
  TrendingUp,
  X,
} from 'lucide-react';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';

export interface BranchPerformanceRecord {
  id: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  branchType: string;
  city: string;
  incharge: string;
  transactionsCount: number;
  grossTurnover: number;
  cogs: number;
  netMargin: number;
  marginPercent: number;
  inventoryAsset: number;
  prescriptionsCount: number;
  otcCount: number;
  complianceScore: string;
  status: 'Operational' | 'High Turnover' | 'Stock Alert';
}

export interface ItemizedDispensingRecord {
  id: string;
  invoiceNo: string;
  dateTime: string;
  branchName: string;
  branchCode: string;
  patientOrDept: string;
  medicineName: string;
  genericName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'bKash MFS' | 'Corporate IPD';
  pharmacistName: string;
}

export interface AbcMedicineRecord {
  id: string;
  category: 'A' | 'B' | 'C';
  medicineName: string;
  genericName: string;
  dosageForm: string;
  branchCode: string;
  branchName: string;
  unitPrice: number;
  stockQty: number;
  totalValuation: number;
  capitalSharePercent: number;
  turnoverDays: number;
  auditRule: string;
}

export const ABC_MEDICINES_DATA: AbcMedicineRecord[] = [
  // Dhanmondi OPD Depot (DHA-02)
  {
    id: 'ABC-DHA-01',
    category: 'A',
    medicineName: 'Human Albumin 20% 50ml Inj',
    genericName: 'Albumin Human',
    dosageForm: 'IV Infusion Vial',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 4800.0,
    stockQty: 120,
    totalValuation: 576000,
    capitalSharePercent: 33.6,
    turnoverDays: 14,
    auditRule: 'Daily FEFO perpetual count & cold chain (2-8°C)',
  },
  {
    id: 'ABC-DHA-02',
    category: 'A',
    medicineName: 'Meropenem 1g IV Inj (Meronem)',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Powder for Injection',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 1150.0,
    stockQty: 520,
    totalValuation: 598000,
    capitalSharePercent: 34.9,
    turnoverDays: 16,
    auditRule: 'Restricted antibiotic ledger & daily cycle count',
  },
  {
    id: 'ABC-DHA-03',
    category: 'A',
    medicineName: 'Piperacillin + Tazobactam 4.5g Inj',
    genericName: 'Tazopen',
    dosageForm: 'IV Injection Vial',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 720.0,
    stockQty: 480,
    totalValuation: 345600,
    capitalSharePercent: 20.2,
    turnoverDays: 18,
    auditRule: 'Critical care reserve buffer & dual sign-off',
  },
  {
    id: 'ABC-DHA-04',
    category: 'A',
    medicineName: 'Enoxaparin 40mg/0.4ml Prefilled',
    genericName: 'Clexane',
    dosageForm: 'PFS Injection',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 650.0,
    stockQty: 300,
    totalValuation: 195000,
    capitalSharePercent: 11.4,
    turnoverDays: 15,
    auditRule: 'Anticoagulant protocol verification',
  },
  {
    id: 'ABC-DHA-05',
    category: 'B',
    medicineName: 'Lantus Solostar Insulin (100 IU/ml)',
    genericName: 'Insulin Glargine',
    dosageForm: 'Pre-filled Cartridge Pen',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 920.0,
    stockQty: 220,
    totalValuation: 202400,
    capitalSharePercent: 41.3,
    turnoverDays: 28,
    auditRule: 'Weekly stock level monitoring & auto-PO',
  },
  {
    id: 'ABC-DHA-06',
    category: 'B',
    medicineName: 'Esomeprazole 40mg IV Inj (Maxpro)',
    genericName: 'Esomeprazole Sodium',
    dosageForm: 'IV Injection Vial',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 95.0,
    stockQty: 1400,
    totalValuation: 133000,
    capitalSharePercent: 27.1,
    turnoverDays: 30,
    auditRule: 'Weekly stock reconciliation & batch expiry tracker',
  },
  {
    id: 'ABC-DHA-07',
    category: 'B',
    medicineName: 'Cefuroxime Axetil 500mg (Kilbac)',
    genericName: 'Cefuroxime',
    dosageForm: 'Film-coated Tablet',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 45.0,
    stockQty: 2100,
    totalValuation: 94500,
    capitalSharePercent: 19.3,
    turnoverDays: 32,
    auditRule: 'Bi-weekly stock inspection',
  },
  {
    id: 'ABC-DHA-08',
    category: 'B',
    medicineName: 'Rosuvastatin 20mg (Rovista)',
    genericName: 'Rosuvastatin Calcium',
    dosageForm: 'Film-coated Tablet',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 25.0,
    stockQty: 2400,
    totalValuation: 60000,
    capitalSharePercent: 12.2,
    turnoverDays: 35,
    auditRule: 'Automated reorder upon min threshold',
  },
  {
    id: 'ABC-DHA-09',
    category: 'C',
    medicineName: 'Napa Extra (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Oral Tablet (Strips)',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 2.5,
    stockQty: 38000,
    totalValuation: 95000,
    capitalSharePercent: 38.8,
    turnoverDays: 60,
    auditRule: 'Monthly bulk replenishment with 15-day safety buffer',
  },
  {
    id: 'ABC-DHA-10',
    category: 'C',
    medicineName: 'Oral Rehydration Salts (ORS Sachet)',
    genericName: 'Sodium Chloride + Glucose',
    dosageForm: 'Oral Powder Sachet',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 6.0,
    stockQty: 12000,
    totalValuation: 72000,
    capitalSharePercent: 29.4,
    turnoverDays: 65,
    auditRule: 'Monthly stock reorder',
  },
  {
    id: 'ABC-DHA-11',
    category: 'C',
    medicineName: 'Seclo 20mg (Omeprazole) Capsule',
    genericName: 'Omeprazole',
    dosageForm: 'Delayed-release Capsule',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 5.0,
    stockQty: 9000,
    totalValuation: 45000,
    capitalSharePercent: 18.4,
    turnoverDays: 70,
    auditRule: 'Monthly bulk ordering',
  },
  {
    id: 'ABC-DHA-12',
    category: 'C',
    medicineName: 'Disposable 5ml Syringe w/ Needle',
    genericName: 'Sterile Consumable',
    dosageForm: 'Medical Device Pack',
    branchCode: 'DHA-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    unitPrice: 8.0,
    stockQty: 4125,
    totalValuation: 33000,
    capitalSharePercent: 13.5,
    turnoverDays: 75,
    auditRule: 'Warehouse central stock transfer',
  },

  // Central Medical Store (CMS-01)
  {
    id: 'ABC-CMS-01',
    category: 'A',
    medicineName: 'Immune Globulin IV (IVIG 5g)',
    genericName: 'Human Normal Immunoglobulin',
    dosageForm: 'IV Infusion 100ml',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 18500.0,
    stockQty: 120,
    totalValuation: 2220000,
    capitalSharePercent: 46.3,
    turnoverDays: 14,
    auditRule: 'Perpetual electronic temperature log & daily physical count',
  },
  {
    id: 'ABC-CMS-02',
    category: 'A',
    medicineName: 'Human Albumin 20% 50ml Inj',
    genericName: 'Albumin Human',
    dosageForm: 'IV Infusion Vial',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 4800.0,
    stockQty: 310,
    totalValuation: 1488000,
    capitalSharePercent: 31.0,
    turnoverDays: 15,
    auditRule: 'Bi-daily cycle count & batch quarantine check',
  },
  {
    id: 'ABC-CMS-03',
    category: 'A',
    medicineName: 'Meropenem 1g IV Inj (Meronem)',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Powder for Injection',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 1150.0,
    stockQty: 945,
    totalValuation: 1086750,
    capitalSharePercent: 22.7,
    turnoverDays: 18,
    auditRule: 'Strict FEFO distribution to satellite depots',
  },
  {
    id: 'ABC-CMS-04',
    category: 'B',
    medicineName: 'Lantus Solostar Insulin (100 IU/ml)',
    genericName: 'Insulin Glargine',
    dosageForm: 'Pre-filled Cartridge Pen',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 920.0,
    stockQty: 680,
    totalValuation: 625600,
    capitalSharePercent: 45.7,
    turnoverDays: 28,
    auditRule: 'Weekly stock level monitoring & auto-PO',
  },
  {
    id: 'ABC-CMS-05',
    category: 'B',
    medicineName: 'Esomeprazole 40mg IV Inj (Maxpro)',
    genericName: 'Esomeprazole Sodium',
    dosageForm: 'IV Injection Vial',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 95.0,
    stockQty: 3950,
    totalValuation: 375250,
    capitalSharePercent: 27.4,
    turnoverDays: 32,
    auditRule: 'Weekly stock reconciliation & batch expiry tracker',
  },
  {
    id: 'ABC-CMS-06',
    category: 'B',
    medicineName: 'Cefuroxime Axetil 500mg (Kilbac)',
    genericName: 'Cefuroxime',
    dosageForm: 'Film-coated Tablet',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 45.0,
    stockQty: 8200,
    totalValuation: 369000,
    capitalSharePercent: 26.9,
    turnoverDays: 35,
    auditRule: 'Bi-weekly stock inspection',
  },
  {
    id: 'ABC-CMS-07',
    category: 'C',
    medicineName: 'Napa Extra (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Oral Tablet (Strips)',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 2.5,
    stockQty: 110000,
    totalValuation: 275000,
    capitalSharePercent: 40.1,
    turnoverDays: 60,
    auditRule: 'Monthly bulk replenishment with 30-day central buffer',
  },
  {
    id: 'ABC-CMS-08',
    category: 'C',
    medicineName: 'Oral Rehydration Salts (ORS Sachet)',
    genericName: 'Sodium Chloride + Glucose',
    dosageForm: 'Oral Powder Sachet',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 6.0,
    stockQty: 35000,
    totalValuation: 210000,
    capitalSharePercent: 30.7,
    turnoverDays: 65,
    auditRule: 'Monthly stock reorder',
  },
  {
    id: 'ABC-CMS-09',
    category: 'C',
    medicineName: 'Disposable 5ml Syringe w/ Needle',
    genericName: 'Sterile Consumable',
    dosageForm: 'Medical Device Pack',
    branchCode: 'CMS-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    unitPrice: 8.0,
    stockQty: 25000,
    totalValuation: 200000,
    capitalSharePercent: 29.2,
    turnoverDays: 75,
    auditRule: 'Central pallet inventory & carton audit',
  },

  // Uttara Branch Depot (UTT-03)
  {
    id: 'ABC-UTT-01',
    category: 'A',
    medicineName: 'Human Albumin 20% 50ml Inj',
    genericName: 'Albumin Human',
    dosageForm: 'IV Infusion Vial',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 4800.0,
    stockQty: 110,
    totalValuation: 528000,
    capitalSharePercent: 41.4,
    turnoverDays: 14,
    auditRule: 'Daily FEFO perpetual count & cold chain',
  },
  {
    id: 'ABC-UTT-02',
    category: 'A',
    medicineName: 'Meropenem 1g IV Inj (Meronem)',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Powder for Injection',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 1150.0,
    stockQty: 420,
    totalValuation: 483000,
    capitalSharePercent: 37.9,
    turnoverDays: 16,
    auditRule: 'Restricted antibiotic ledger & daily cycle count',
  },
  {
    id: 'ABC-UTT-03',
    category: 'A',
    medicineName: 'Piperacillin + Tazobactam 4.5g Inj',
    genericName: 'Tazopen',
    dosageForm: 'IV Injection Vial',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 720.0,
    stockQty: 365,
    totalValuation: 262800,
    capitalSharePercent: 20.6,
    turnoverDays: 18,
    auditRule: 'Critical care reserve buffer & dual sign-off',
  },
  {
    id: 'ABC-UTT-04',
    category: 'B',
    medicineName: 'Lantus Solostar Insulin (100 IU/ml)',
    genericName: 'Insulin Glargine',
    dosageForm: 'Pre-filled Cartridge Pen',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 920.0,
    stockQty: 180,
    totalValuation: 165600,
    capitalSharePercent: 45.5,
    turnoverDays: 28,
    auditRule: 'Weekly stock level monitoring & auto-PO',
  },
  {
    id: 'ABC-UTT-05',
    category: 'B',
    medicineName: 'Esomeprazole 40mg IV Inj (Maxpro)',
    genericName: 'Esomeprazole Sodium',
    dosageForm: 'IV Injection Vial',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 95.0,
    stockQty: 1100,
    totalValuation: 104500,
    capitalSharePercent: 28.7,
    turnoverDays: 30,
    auditRule: 'Weekly stock reconciliation & batch expiry tracker',
  },
  {
    id: 'ABC-UTT-06',
    category: 'B',
    medicineName: 'Cefuroxime Axetil 500mg (Kilbac)',
    genericName: 'Cefuroxime',
    dosageForm: 'Film-coated Tablet',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 45.0,
    stockQty: 2080,
    totalValuation: 93600,
    capitalSharePercent: 25.7,
    turnoverDays: 32,
    auditRule: 'Bi-weekly stock inspection',
  },
  {
    id: 'ABC-UTT-07',
    category: 'C',
    medicineName: 'Napa Extra (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Oral Tablet (Strips)',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 2.5,
    stockQty: 28000,
    totalValuation: 70000,
    capitalSharePercent: 38.5,
    turnoverDays: 60,
    auditRule: 'Monthly bulk replenishment with 15-day safety buffer',
  },
  {
    id: 'ABC-UTT-08',
    category: 'C',
    medicineName: 'Oral Rehydration Salts (ORS Sachet)',
    genericName: 'Sodium Chloride + Glucose',
    dosageForm: 'Oral Powder Sachet',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 6.0,
    stockQty: 10000,
    totalValuation: 60000,
    capitalSharePercent: 33.0,
    turnoverDays: 65,
    auditRule: 'Monthly stock reorder',
  },
  {
    id: 'ABC-UTT-09',
    category: 'C',
    medicineName: 'Disposable 5ml Syringe w/ Needle',
    genericName: 'Sterile Consumable',
    dosageForm: 'Medical Device Pack',
    branchCode: 'UTT-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    unitPrice: 8.0,
    stockQty: 6500,
    totalValuation: 52000,
    capitalSharePercent: 28.6,
    turnoverDays: 75,
    auditRule: 'Warehouse central stock transfer',
  },

  // Mirpur Branch (MIR-04)
  {
    id: 'ABC-MIR-01',
    category: 'A',
    medicineName: 'Human Albumin 20% 50ml Inj',
    genericName: 'Albumin Human',
    dosageForm: 'IV Infusion Vial',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 4800.0,
    stockQty: 85,
    totalValuation: 408000,
    capitalSharePercent: 41.3,
    turnoverDays: 14,
    auditRule: 'Daily FEFO perpetual count & cold chain',
  },
  {
    id: 'ABC-MIR-02',
    category: 'A',
    medicineName: 'Meropenem 1g IV Inj (Meronem)',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Powder for Injection',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 1150.0,
    stockQty: 340,
    totalValuation: 391000,
    capitalSharePercent: 39.6,
    turnoverDays: 16,
    auditRule: 'Restricted antibiotic ledger & daily cycle count',
  },
  {
    id: 'ABC-MIR-03',
    category: 'A',
    medicineName: 'Piperacillin + Tazobactam 4.5g Inj',
    genericName: 'Tazopen',
    dosageForm: 'IV Injection Vial',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 720.0,
    stockQty: 260,
    totalValuation: 187200,
    capitalSharePercent: 19.0,
    turnoverDays: 18,
    auditRule: 'Critical care reserve buffer & dual sign-off',
  },
  {
    id: 'ABC-MIR-04',
    category: 'B',
    medicineName: 'Lantus Solostar Insulin (100 IU/ml)',
    genericName: 'Insulin Glargine',
    dosageForm: 'Pre-filled Cartridge Pen',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 920.0,
    stockQty: 140,
    totalValuation: 128800,
    capitalSharePercent: 45.7,
    turnoverDays: 28,
    auditRule: 'Weekly stock level monitoring & auto-PO',
  },
  {
    id: 'ABC-MIR-05',
    category: 'B',
    medicineName: 'Esomeprazole 40mg IV Inj (Maxpro)',
    genericName: 'Esomeprazole Sodium',
    dosageForm: 'IV Injection Vial',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 95.0,
    stockQty: 850,
    totalValuation: 80750,
    capitalSharePercent: 28.6,
    turnoverDays: 30,
    auditRule: 'Weekly stock reconciliation & batch expiry tracker',
  },
  {
    id: 'ABC-MIR-06',
    category: 'B',
    medicineName: 'Cefuroxime Axetil 500mg (Kilbac)',
    genericName: 'Cefuroxime',
    dosageForm: 'Film-coated Tablet',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 45.0,
    stockQty: 1610,
    totalValuation: 72450,
    capitalSharePercent: 25.7,
    turnoverDays: 32,
    auditRule: 'Bi-weekly stock inspection',
  },
  {
    id: 'ABC-MIR-07',
    category: 'C',
    medicineName: 'Napa Extra (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Oral Tablet (Strips)',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 2.5,
    stockQty: 22000,
    totalValuation: 55000,
    capitalSharePercent: 39.0,
    turnoverDays: 60,
    auditRule: 'Monthly bulk replenishment with 15-day safety buffer',
  },
  {
    id: 'ABC-MIR-08',
    category: 'C',
    medicineName: 'Oral Rehydration Salts (ORS Sachet)',
    genericName: 'Sodium Chloride + Glucose',
    dosageForm: 'Oral Powder Sachet',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 6.0,
    stockQty: 8000,
    totalValuation: 48000,
    capitalSharePercent: 34.0,
    turnoverDays: 65,
    auditRule: 'Monthly stock reorder',
  },
  {
    id: 'ABC-MIR-09',
    category: 'C',
    medicineName: 'Disposable 5ml Syringe w/ Needle',
    genericName: 'Sterile Consumable',
    dosageForm: 'Medical Device Pack',
    branchCode: 'MIR-04',
    branchName: 'Mirpur Branch Pharmacy',
    unitPrice: 8.0,
    stockQty: 4750,
    totalValuation: 38000,
    capitalSharePercent: 27.0,
    turnoverDays: 75,
    auditRule: 'Warehouse central stock transfer',
  },

  // Chattogram Hub (CTG-05)
  {
    id: 'ABC-CTG-01',
    category: 'A',
    medicineName: 'Human Albumin 20% 50ml Inj',
    genericName: 'Albumin Human',
    dosageForm: 'IV Infusion Vial',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 4800.0,
    stockQty: 140,
    totalValuation: 672000,
    capitalSharePercent: 41.9,
    turnoverDays: 14,
    auditRule: 'Daily FEFO perpetual count & cold chain',
  },
  {
    id: 'ABC-CTG-02',
    category: 'A',
    medicineName: 'Meropenem 1g IV Inj (Meronem)',
    genericName: 'Meropenem Trihydrate',
    dosageForm: 'Powder for Injection',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 1150.0,
    stockQty: 530,
    totalValuation: 609500,
    capitalSharePercent: 38.0,
    turnoverDays: 16,
    auditRule: 'Restricted antibiotic ledger & daily cycle count',
  },
  {
    id: 'ABC-CTG-03',
    category: 'A',
    medicineName: 'Piperacillin + Tazobactam 4.5g Inj',
    genericName: 'Tazopen',
    dosageForm: 'IV Injection Vial',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 720.0,
    stockQty: 445,
    totalValuation: 320400,
    capitalSharePercent: 20.0,
    turnoverDays: 18,
    auditRule: 'Critical care reserve buffer & dual sign-off',
  },
  {
    id: 'ABC-CTG-04',
    category: 'B',
    medicineName: 'Lantus Solostar Insulin (100 IU/ml)',
    genericName: 'Insulin Glargine',
    dosageForm: 'Pre-filled Cartridge Pen',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 920.0,
    stockQty: 210,
    totalValuation: 193200,
    capitalSharePercent: 42.2,
    turnoverDays: 28,
    auditRule: 'Weekly stock level monitoring & auto-PO',
  },
  {
    id: 'ABC-CTG-05',
    category: 'B',
    medicineName: 'Cefuroxime Axetil 500mg (Kilbac)',
    genericName: 'Cefuroxime',
    dosageForm: 'Film-coated Tablet',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 45.0,
    stockQty: 3030,
    totalValuation: 136350,
    capitalSharePercent: 29.8,
    turnoverDays: 32,
    auditRule: 'Bi-weekly stock inspection',
  },
  {
    id: 'ABC-CTG-06',
    category: 'B',
    medicineName: 'Esomeprazole 40mg IV Inj (Maxpro)',
    genericName: 'Esomeprazole Sodium',
    dosageForm: 'IV Injection Vial',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 95.0,
    stockQty: 1350,
    totalValuation: 128250,
    capitalSharePercent: 28.0,
    turnoverDays: 30,
    auditRule: 'Weekly stock reconciliation & batch expiry tracker',
  },
  {
    id: 'ABC-CTG-07',
    category: 'C',
    medicineName: 'Napa Extra (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    dosageForm: 'Oral Tablet (Strips)',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 2.5,
    stockQty: 36000,
    totalValuation: 90000,
    capitalSharePercent: 39.3,
    turnoverDays: 60,
    auditRule: 'Monthly bulk replenishment with 15-day safety buffer',
  },
  {
    id: 'ABC-CTG-08',
    category: 'C',
    medicineName: 'Oral Rehydration Salts (ORS Sachet)',
    genericName: 'Sodium Chloride + Glucose',
    dosageForm: 'Oral Powder Sachet',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 6.0,
    stockQty: 12500,
    totalValuation: 75000,
    capitalSharePercent: 32.8,
    turnoverDays: 65,
    auditRule: 'Monthly stock reorder',
  },
  {
    id: 'ABC-CTG-09',
    category: 'C',
    medicineName: 'Disposable 5ml Syringe w/ Needle',
    genericName: 'Sterile Consumable',
    dosageForm: 'Medical Device Pack',
    branchCode: 'CTG-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    unitPrice: 8.0,
    stockQty: 8000,
    totalValuation: 64000,
    capitalSharePercent: 27.9,
    turnoverDays: 75,
    auditRule: 'Warehouse central stock transfer',
  },
];

export const BRANCH_RECORDS_DATA: BranchPerformanceRecord[] = [
  {
    id: 'BR-01',
    branchId: 'br-cms-01',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    branchCode: 'CMS-01',
    branchType: 'Central Hub & Warehouse',
    city: 'Dhaka',
    incharge: 'Dr. Shahed Kamal',
    transactionsCount: 1420,
    grossTurnover: 3840000,
    cogs: 2995200,
    netMargin: 844800,
    marginPercent: 22.0,
    inventoryAsset: 6850000,
    prescriptionsCount: 940,
    otcCount: 480,
    complianceScore: '99.8%',
    status: 'Operational',
  },
  {
    id: 'BR-02',
    branchId: 'br-dha-02',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    branchCode: 'DHA-02',
    branchType: 'Outpatient Dispensary',
    city: 'Dhaka',
    incharge: 'Md. Rafiqul Islam, M.Pharm',
    transactionsCount: 4850,
    grossTurnover: 4290000,
    cogs: 3174600,
    netMargin: 1115400,
    marginPercent: 26.0,
    inventoryAsset: 2450000,
    prescriptionsCount: 3820,
    otcCount: 1030,
    complianceScore: '99.4%',
    status: 'High Turnover',
  },
  {
    id: 'BR-03',
    branchId: 'br-utt-03',
    branchName: 'Uttara Branch Pharmacy Depot',
    branchCode: 'UTT-03',
    branchType: 'Satellite Store & OPD',
    city: 'Dhaka',
    incharge: 'Nusrat Jahan, B.Pharm',
    transactionsCount: 2910,
    grossTurnover: 2610000,
    cogs: 1983600,
    netMargin: 626400,
    marginPercent: 24.0,
    inventoryAsset: 1820000,
    prescriptionsCount: 2190,
    otcCount: 720,
    complianceScore: '98.9%',
    status: 'Operational',
  },
  {
    id: 'BR-04',
    branchId: 'br-mir-04',
    branchName: 'Mirpur Branch Pharmacy',
    branchCode: 'MIR-04',
    branchType: 'Satellite Dispensary',
    city: 'Dhaka',
    incharge: 'Tanvir Hasan',
    transactionsCount: 1890,
    grossTurnover: 1680000,
    cogs: 1260000,
    netMargin: 420000,
    marginPercent: 25.0,
    inventoryAsset: 1410000,
    prescriptionsCount: 1410,
    otcCount: 480,
    complianceScore: '98.2%',
    status: 'Operational',
  },
  {
    id: 'BR-05',
    branchId: 'br-ctg-05',
    branchName: 'Chattogram Hub Pharmacy Depot',
    branchCode: 'CTG-05',
    branchType: 'Regional Medical Depot',
    city: 'Chattogram',
    incharge: 'Farhan Chowdhury',
    transactionsCount: 1910,
    grossTurnover: 1820000,
    cogs: 1383200,
    netMargin: 436800,
    marginPercent: 24.0,
    inventoryAsset: 2290000,
    prescriptionsCount: 1480,
    otcCount: 430,
    complianceScore: '99.1%',
    status: 'Operational',
  },
];

export const ITEMIZED_DISPENSING_DATA: ItemizedDispensingRecord[] = [
  {
    id: 'TX-101',
    invoiceNo: 'INV-DHA-2026-9041',
    dateTime: '2026-11-23 15:42',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    branchCode: 'DHA-02',
    patientOrDept: 'OPD - Cardiology Walk-in',
    medicineName: 'Napa Extra (500mg+65mg) Tablet',
    genericName: 'Paracetamol + Caffeine',
    quantity: 60,
    unitPrice: 2.5,
    totalAmount: 150,
    paymentMethod: 'Cash',
    pharmacistName: 'Nusrat Jahan, B.Pharm',
  },
  {
    id: 'TX-102',
    invoiceNo: 'INV-DHA-2026-9040',
    dateTime: '2026-11-23 15:28',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    branchCode: 'DHA-02',
    patientOrDept: 'IPD ICU - Bed 04 (Dr. Rahman)',
    medicineName: 'Meropenem 1g IV Injection',
    genericName: 'Meropenem Trihydrate',
    quantity: 6,
    unitPrice: 1150.0,
    totalAmount: 6900,
    paymentMethod: 'Corporate IPD',
    pharmacistName: 'Md. Rafiqul Islam, M.Pharm',
  },
  {
    id: 'TX-103',
    invoiceNo: 'INV-CMS-2026-8412',
    dateTime: '2026-11-23 14:15',
    branchName: 'Central Medical Store (CMS) - Main Depot',
    branchCode: 'CMS-01',
    patientOrDept: 'Ward Indent #WI-882 (Nephrology)',
    medicineName: 'Human Albumin 20% 50ml IV',
    genericName: 'Human Normal Albumin',
    quantity: 10,
    unitPrice: 4800.0,
    totalAmount: 48000,
    paymentMethod: 'Corporate IPD',
    pharmacistName: 'Dr. Shahed Kamal',
  },
  {
    id: 'TX-104',
    invoiceNo: 'INV-UTT-2026-5519',
    dateTime: '2026-11-23 13:50',
    branchName: 'Uttara Branch Pharmacy Depot',
    branchCode: 'UTT-03',
    patientOrDept: 'OPD - Endocrinology (Prescription #7781)',
    medicineName: 'Insulin Glargine 100IU/ml Cartridge',
    genericName: 'Insulin Glargine',
    quantity: 4,
    unitPrice: 850.0,
    totalAmount: 3400,
    paymentMethod: 'bKash MFS',
    pharmacistName: 'Tanvir Hasan',
  },
  {
    id: 'TX-105',
    invoiceNo: 'INV-MIR-2026-3392',
    dateTime: '2026-11-23 13:12',
    branchName: 'Mirpur Branch Pharmacy',
    branchCode: 'MIR-04',
    patientOrDept: 'Emergency Resuscitation Unit',
    medicineName: 'Ciprocin 500 (500mg) Tablet',
    genericName: 'Ciprofloxacin',
    quantity: 28,
    unitPrice: 14.0,
    totalAmount: 392,
    paymentMethod: 'Credit Card',
    pharmacistName: 'Shahidul Alam',
  },
  {
    id: 'TX-106',
    invoiceNo: 'INV-CTG-2026-4401',
    dateTime: '2026-11-23 12:45',
    branchName: 'Chattogram Hub Pharmacy Depot',
    branchCode: 'CTG-05',
    patientOrDept: 'OPD - Gastroenterology',
    medicineName: 'Maxpro 20 (20mg) Capsule',
    genericName: 'Esomeprazole',
    quantity: 120,
    unitPrice: 7.0,
    totalAmount: 840,
    paymentMethod: 'Cash',
    pharmacistName: 'Farhan Chowdhury',
  },
  {
    id: 'TX-107',
    invoiceNo: 'INV-DHA-2026-9039',
    dateTime: '2026-11-23 11:30',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    branchCode: 'DHA-02',
    patientOrDept: 'OPD - Pediatrics',
    medicineName: 'Seclo 20 (20mg) Capsule',
    genericName: 'Omeprazole',
    quantity: 60,
    unitPrice: 5.0,
    totalAmount: 300,
    paymentMethod: 'Cash',
    pharmacistName: 'Nusrat Jahan, B.Pharm',
  },
  {
    id: 'TX-108',
    invoiceNo: 'INV-DHA-2026-9038',
    dateTime: '2026-11-23 10:15',
    branchName: 'Dhanmondi OPD Pharmacy Depot',
    branchCode: 'DHA-02',
    patientOrDept: 'OPD - Pulmonology Clinic',
    medicineName: 'Fexo 120 (120mg) Tablet',
    genericName: 'Fexofenadine HCl',
    quantity: 90,
    unitPrice: 9.0,
    totalAmount: 810,
    paymentMethod: 'bKash MFS',
    pharmacistName: 'Nusrat Jahan, B.Pharm',
  },
];

const BRANCH_DROPDOWN_OPTIONS = [
  { label: 'All Branches (Consolidated Hospital Network)', value: 'ALL' },
  { label: 'Dhanmondi OPD Pharmacy Depot (DHA-02)', value: 'DHA-02' },
  { label: 'Central Medical Store (CMS) - Main Depot (CMS-01)', value: 'CMS-01' },
  { label: 'Uttara Branch Pharmacy Depot (UTT-03)', value: 'UTT-03' },
  { label: 'Mirpur Branch Pharmacy (MIR-04)', value: 'MIR-04' },
  { label: 'Chattogram Hub Pharmacy Depot (CTG-05)', value: 'CTG-05' },
];

const REPORT_TYPE_OPTIONS = [
  { label: 'Branch Sales & Revenue Turnover', value: 'sales-revenue' },
  { label: 'Medication Dispensing & Clinical Prescriptions', value: 'dispensing-consumption' },
  { label: 'Branch Inventory Valuation & Stock Assets', value: 'stock-valuation' },
  { label: 'Near-Expiry & Aging Lot Risk Audit', value: 'expiry-audit' },
  { label: 'ABC Capital Consumption Matrix', value: 'abc-matrix' },
];

const TIME_DURATION_OPTIONS = [
  { label: 'Today (Real-time)', value: 'Today' },
  { label: 'This Week', value: 'This Week' },
  { label: 'This Month (Nov 2026)', value: 'This Month' },
  { label: 'Last Month (Oct 2026)', value: 'Last Month' },
  { label: 'Quarter to Date (Q4)', value: 'Quarter to Date' },
  { label: 'Fiscal Year 2026', value: 'Fiscal Year 2026' },
  { label: 'Custom Date Range', value: 'Custom Date Range' },
];

interface PharmacistReportsViewProps {
  initialTab?: 'matrix' | 'transactions' | 'abc';
}

export const PharmacistReportsView: React.FC<PharmacistReportsViewProps> = ({
  initialTab = 'matrix',
}) => {
  // Query Filters State
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [reportType, setReportType] = useState(() => {
    if (initialTab === 'abc') return 'abc-matrix';
    if (initialTab === 'transactions') return 'dispensing-consumption';
    return 'sales-revenue';
  });
  const [timeDuration, setTimeDuration] = useState('This Month');
  const [dateFrom, setDateFrom] = useState('2026-11-01');
  const [dateTo, setDateTo] = useState('2026-11-30');

  // Applied State for Query Lock
  const [appliedBranch, setAppliedBranch] = useState('ALL');
  const [appliedDuration, setAppliedDuration] = useState('This Month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active View Tab synced with sidebar submenu
  const [activeTab, setActiveTab] = useState<'matrix' | 'transactions' | 'abc'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      if (initialTab === 'abc') setReportType('abc-matrix');
      else if (initialTab === 'transactions') setReportType('dispensing-consumption');
      else if (initialTab === 'matrix') setReportType('sales-revenue');
    }
  }, [initialTab]);

  // Printable Statement Preview Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleGenerateReport = () => {
    setAppliedBranch(selectedBranch);
    setAppliedDuration(timeDuration);

    if (reportType === 'abc-matrix' || reportType === 'stock-valuation') {
      setActiveTab('abc');
    } else if (reportType === 'dispensing-consumption') {
      setActiveTab('transactions');
    } else if (reportType === 'sales-revenue') {
      setActiveTab('matrix');
    }

    const branchLabel =
      BRANCH_DROPDOWN_OPTIONS.find((b) => b.value === selectedBranch)?.label || selectedBranch;
    const reportLabel =
      REPORT_TYPE_OPTIONS.find((r) => r.value === reportType)?.label || reportType;
    showToast(`Report regenerated for: ${branchLabel} · ${reportLabel} (${timeDuration})`);
  };

  // Filtered Branch Records based on applied selection
  const filteredBranchRecords = useMemo(() => {
    if (appliedBranch === 'ALL') return BRANCH_RECORDS_DATA;
    return BRANCH_RECORDS_DATA.filter((r) => r.branchCode === appliedBranch);
  }, [appliedBranch]);

  // Filtered Itemized Transactions based on applied branch
  const filteredTransactions = useMemo(() => {
    if (appliedBranch === 'ALL') return ITEMIZED_DISPENSING_DATA;
    return ITEMIZED_DISPENSING_DATA.filter((t) => t.branchCode === appliedBranch);
  }, [appliedBranch]);

  // Current Branch Total Stock Asset for dynamic calculation
  const currentBranchAsset = useMemo(() => {
    if (appliedBranch === 'ALL') {
      return BRANCH_RECORDS_DATA.reduce((sum, b) => sum + b.inventoryAsset, 0);
    }
    return (
      BRANCH_RECORDS_DATA.find((b) => b.branchCode === appliedBranch)?.inventoryAsset || 2450000
    );
  }, [appliedBranch]);

  // Filtered ABC Medicines based on applied branch
  const filteredAbcMedicines = useMemo(() => {
    if (appliedBranch === 'ALL') return ABC_MEDICINES_DATA;
    return ABC_MEDICINES_DATA.filter((m) => m.branchCode === appliedBranch);
  }, [appliedBranch]);

  // Computed KPI Metrics dynamically adjusted for selected branch
  const kpiMetrics = useMemo(() => {
    if (appliedBranch === 'ALL') {
      const totalTurnover = BRANCH_RECORDS_DATA.reduce((sum, b) => sum + b.grossTurnover, 0);
      const totalInventory = BRANCH_RECORDS_DATA.reduce((sum, b) => sum + b.inventoryAsset, 0);
      const totalTransactions = BRANCH_RECORDS_DATA.reduce((sum, b) => sum + b.transactionsCount, 0);
      const totalNetMargin = BRANCH_RECORDS_DATA.reduce((sum, b) => sum + b.netMargin, 0);
      const avgMargin = (totalNetMargin / totalTurnover) * 100;
      return {
        turnoverStr: `৳ ${(totalTurnover / 100000).toFixed(1)} Lakh`,
        turnoverExact: totalTurnover,
        inventoryStr: `৳ ${(totalInventory / 100000).toFixed(1)} Lakh`,
        transactionsStr: `${totalTransactions.toLocaleString()} Transactions`,
        marginStr: `${avgMargin.toFixed(1)}%`,
        subtitle: 'Consolidated across all 5 active Hospital Depot Branches',
        badge: 'Enterprise Network',
      };
    } else {
      const branch = BRANCH_RECORDS_DATA.find((b) => b.branchCode === appliedBranch) || BRANCH_RECORDS_DATA[1];
      return {
        turnoverStr: `৳ ${(branch.grossTurnover / 100000).toFixed(2)} Lakh`,
        turnoverExact: branch.grossTurnover,
        inventoryStr: `৳ ${(branch.inventoryAsset / 100000).toFixed(2)} Lakh`,
        transactionsStr: `${branch.transactionsCount.toLocaleString()} Bills / Issues`,
        marginStr: `${branch.marginPercent.toFixed(1)}%`,
        subtitle: `${branch.branchName} · In-Charge: ${branch.incharge}`,
        badge: branch.branchCode,
      };
    }
  }, [appliedBranch]);

  // Handle Export CSV
  const handleExportCsv = () => {
    const branchLabel =
      BRANCH_DROPDOWN_OPTIONS.find((b) => b.value === appliedBranch)?.label || appliedBranch;

    if (activeTab === 'abc') {
      const header = [
        'Medicine Name',
        'Generic Name',
        'Dosage Form',
        'Branch Code',
        'Branch Name',
        'Current Stock (Pcs)',
        'Unit Price (BDT)',
        'Total Stock Valuation (BDT)',
        'Status',
      ];
      const rows = filteredAbcMedicines.map((m) => [
        `"${m.medicineName}"`,
        `"${m.genericName}"`,
        `"${m.dosageForm}"`,
        m.branchCode,
        `"${m.branchName}"`,
        m.stockQty,
        m.unitPrice,
        m.totalValuation,
        '"In Stock"',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Inventory_Valuation_${appliedBranch}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported Inventory Valuation CSV for: ${branchLabel}`);
      return;
    }

    if (activeTab === 'transactions') {
      const header = [
        'Invoice No',
        'Date Time',
        'Branch Code',
        'Branch Name',
        'Patient / Department',
        'Medicine Name',
        'Generic Name',
        'Quantity',
        'Unit Price (BDT)',
        'Total Amount (BDT)',
        'Payment Method',
        'Pharmacist',
      ];
      const rows = filteredTransactions.map((t) => [
        t.invoiceNo,
        t.dateTime,
        t.branchCode,
        `"${t.branchName}"`,
        `"${t.patientOrDept}"`,
        `"${t.medicineName}"`,
        `"${t.genericName}"`,
        t.quantity,
        t.unitPrice,
        t.totalAmount,
        `"${t.paymentMethod}"`,
        `"${t.pharmacistName}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Dispensing_Audit_${appliedBranch}_${appliedDuration.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported Dispensing Ledger CSV for: ${branchLabel}`);
      return;
    }

    const header = [
      'Branch Name',
      'Depot Code',
      'In-Charge Pharmacist',
      'Location',
      'Transaction Count',
      'Gross Sales (BDT)',
      'COGS (BDT)',
      'Net Margin (BDT)',
      'Margin %',
      'Inventory Asset (BDT)',
      'Operating Status',
    ];
    const rows = filteredBranchRecords.map((r) => [
      `"${r.branchName}"`,
      r.branchCode,
      `"${r.incharge}"`,
      r.city,
      r.transactionsCount,
      r.grossTurnover,
      r.cogs,
      r.netMargin,
      `${r.marginPercent}%`,
      r.inventoryAsset,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pharmacy_Report_${appliedBranch}_${appliedDuration.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported CSV for: ${branchLabel}`);
  };

  // Branch Performance Table Columns
  const branchColumns: DataTableColumn<BranchPerformanceRecord>[] = [
    {
      key: 'branchName',
      header: 'Pharmacy Branch Location & Depot',
      sortable: true,
      sortValue: (r) => r.branchName,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.branchName}</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-slate-100 text-slate-700">
              {r.branchCode}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
            <span>{r.branchType}</span>
            <span>·</span>
            <span className="text-[#006a4e]">Lead: {r.incharge}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'transactionsCount',
      header: 'Transaction Count',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.transactionsCount,
      render: (r) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 font-mono">
            {r.transactionsCount.toLocaleString()}
          </span>
          <div className="text-[10px] text-slate-400">
            {r.prescriptionsCount} Rx · {r.otcCount} OTC
          </div>
        </div>
      ),
    },
    {
      key: 'grossTurnover',
      header: 'Gross Sales Turnover',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.grossTurnover,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs font-mono">
            ৳ {r.grossTurnover.toLocaleString()}
          </span>
          <div className="text-[10px] text-slate-400">
            COGS: ৳ {r.cogs.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: 'netMargin',
      header: 'Net Margin (BDT / %)',
      align: 'center',
      sortable: true,
      sortValue: (r) => r.netMargin,
      render: (r) => (
        <div>
          <span className="font-bold text-[#006a4e] text-xs font-mono">
            ৳ {r.netMargin.toLocaleString()}
          </span>
          <div className="text-[10.5px] font-semibold text-emerald-700">
            {r.marginPercent.toFixed(1)}% Net Margin
          </div>
        </div>
      ),
    },
    {
      key: 'inventoryAsset',
      header: 'Stock Asset Value',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.inventoryAsset,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs font-mono">
            ৳ {r.inventoryAsset.toLocaleString()}
          </span>
          <div className="text-[10px] text-slate-400">
            Audit Score: {r.complianceScore}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Operating Status',
      align: 'center',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border ${
            r.status === 'High Turnover'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  // Itemized Dispensing Columns
  const transactionColumns: DataTableColumn<ItemizedDispensingRecord>[] = [
    {
      key: 'invoiceNo',
      header: 'Invoice & Time',
      sortable: true,
      sortValue: (r) => r.invoiceNo,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{r.invoiceNo}</span>
          <span className="text-[11px] text-slate-400 font-mono">{r.dateTime}</span>
        </div>
      ),
    },
    {
      key: 'branchName',
      header: 'Branch & Department',
      sortable: true,
      sortValue: (r) => r.branchName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{r.branchName}</span>
          <span className="text-[11px] text-slate-500">{r.patientOrDept}</span>
        </div>
      ),
    },
    {
      key: 'medicineName',
      header: 'Medicine / Formulation',
      sortable: true,
      sortValue: (r) => r.medicineName,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs block">{r.medicineName}</span>
          <span className="text-[11px] text-slate-500">{r.genericName}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Qty & Unit Price',
      align: 'right',
      render: (r) => (
        <div className="text-right">
          <span className="font-mono font-semibold text-slate-800 text-xs">{r.quantity} Pcs</span>
          <div className="text-[10px] text-slate-400 font-mono">@ ৳ {r.unitPrice.toFixed(2)}</div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total BDT',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.totalAmount,
      render: (r) => (
        <span className="font-mono font-bold text-[#006a4e] text-xs">
          ৳ {r.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment & Pharmacist',
      render: (r) => (
        <div>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
            {r.paymentMethod}
          </span>
          <div className="text-[10.5px] text-slate-500 mt-0.5">{r.pharmacistName}</div>
        </div>
      ),
    },
  ];

  // Computed Branch SKU and Unit totals for clean report summary
  const totalBranchSkus = useMemo(() => {
    if (appliedBranch === 'ALL') return 1500;
    if (appliedBranch === 'CMS-01') return 1350;
    if (appliedBranch === 'DHA-02') return 420;
    if (appliedBranch === 'UTT-03') return 360;
    if (appliedBranch === 'CTG-05') return 390;
    return 280;
  }, [appliedBranch]);

  const totalBranchUnits = useMemo(() => {
    if (appliedBranch === 'ALL') return 285400;
    if (appliedBranch === 'CMS-01') return 182000;
    if (appliedBranch === 'DHA-02') return 62800;
    if (appliedBranch === 'UTT-03') return 47500;
    if (appliedBranch === 'CTG-05') return 58400;
    return 36200;
  }, [appliedBranch]);

  // Clean, Non-Technical Inventory Valuation Table Columns
  const inventoryValuationColumns: DataTableColumn<AbcMedicineRecord>[] = [
    {
      key: 'medicineName',
      header: 'Medicine & Formulation',
      sortable: true,
      sortValue: (r) => r.medicineName,
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{r.medicineName}</span>
          <span className="text-[11px] text-slate-500 font-normal">
            {r.genericName} · <span className="text-slate-400">{r.dosageForm}</span>
          </span>
        </div>
      ),
    },
    {
      key: 'branchName',
      header: 'Depot Branch',
      sortable: true,
      sortValue: (r) => r.branchName,
      render: (r) => (
        <div>
          <span className="font-medium text-slate-800 text-xs block">{r.branchName}</span>
          <span className="text-[10px] font-mono text-slate-400">{r.branchCode}</span>
        </div>
      ),
    },
    {
      key: 'stockQty',
      header: 'Current Stock',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.stockQty,
      render: (r) => (
        <span className="font-mono font-bold text-slate-800 text-xs">
          {r.stockQty.toLocaleString()} Pcs
        </span>
      ),
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.unitPrice,
      render: (r) => (
        <span className="font-mono text-xs text-slate-700">
          ৳ {r.unitPrice.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'totalValuation',
      header: 'Total Value (BDT)',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.totalValuation,
      render: (r) => (
        <span className="font-mono font-extrabold text-[#006a4e] text-xs block">
          ৳ {r.totalValuation.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'auditRule',
      header: 'Status',
      align: 'center',
      render: () => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          In Stock
        </span>
      ),
    },
  ];

  const currentBranchLabel =
    BRANCH_DROPDOWN_OPTIONS.find((b) => b.value === appliedBranch)?.label || appliedBranch;

  return (
    <div className="space-y-2.5 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ENTERPRISE BRANCH-WISE REPORT CONFIGURATION & QUERY TOOLBAR                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[4px] border border-slate-200 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold">
              {activeTab === 'abc' ? (
                <Boxes className="w-4 h-4" />
              ) : activeTab === 'transactions' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {activeTab === 'abc'
                  ? 'Pharmacy Inventory Valuation Report'
                  : activeTab === 'transactions'
                  ? 'Medication Dispensing & Sales Audit Report'
                  : 'Hospital Pharmacy Multi-Branch Performance Report'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {activeTab === 'abc'
                  ? 'Branch-wise medicine stock quantity, unit cost, and total inventory value'
                  : activeTab === 'transactions'
                  ? 'Patient prescription fulfillment, counter sales, and transaction logs'
                  : 'Branch-wise sales turnover, drug dispensing audit, and margin analysis'}
              </p>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="h-8 px-3 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Official Statement</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="h-8 px-3 rounded-[3px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        {activeTab === 'abc' ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-0.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-semibold text-slate-700">Filter Branch:</span>
              <div className="w-80">
                <DropdownSelect
                  native
                  value={selectedBranch}
                  onChange={(val) => {
                    setSelectedBranch(val);
                    setAppliedBranch(val);
                    const label = BRANCH_DROPDOWN_OPTIONS.find((b) => b.value === val)?.label || val;
                    showToast(`Updated valuation report for: ${label}`);
                  }}
                  width="w-full"
                  className="w-full"
                  options={BRANCH_DROPDOWN_OPTIONS}
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Active Depot: <strong className="text-slate-900">{currentBranchLabel}</strong>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-0.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Select Pharmacy Branch <span className="text-rose-500">*</span>
              </label>
              <DropdownSelect
                native
                value={selectedBranch}
                onChange={(val) => setSelectedBranch(val)}
                width="w-full"
                className="w-full"
                options={BRANCH_DROPDOWN_OPTIONS}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Audit Period / Duration <span className="text-rose-500">*</span>
              </label>
              <DropdownSelect
                native
                value={timeDuration}
                onChange={(val) => setTimeDuration(val)}
                width="w-full"
                className="w-full"
                options={TIME_DURATION_OPTIONS}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleGenerateReport}
                className="w-full h-8 px-4 rounded-[3px] bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate Branch Report</span>
              </button>
            </div>
          </div>
        )}

        {/* Optional Custom Date Range Inputs */}
        {timeDuration === 'Custom Date Range' && activeTab !== 'abc' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Date From <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Date To <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[3px] border border-slate-300 text-xs text-slate-700 focus:outline-hidden focus:border-[#006a4e]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DYNAMIC EXECUTIVE SUMMARY KPI CARDS (CLEAN & CONTEXT-AWARE)               */}
      {/* ========================================================================= */}
      {activeTab === 'abc' ? (
        <SummaryCardGrid>
          <SummaryCard
            title="Total Stock Valuation"
            icon={Boxes}
            iconColor="text-[#006a4e]"
            value={`৳ ${(currentBranchAsset / 100000).toFixed(2)} Lakh`}
            subtitle={`Audited stock value (৳ ${currentBranchAsset.toLocaleString()})`}
            badge={
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {appliedBranch === 'ALL' ? 'All Branches' : appliedBranch}
              </span>
            }
          />
          <SummaryCard
            title="Total Medicine Formulations"
            icon={Layers}
            iconColor="text-[#006a4e]"
            value={`${totalBranchSkus.toLocaleString()} Formulations`}
            subtitle="Hospital active formulary items"
          />
          <SummaryCard
            title="Total Physical Stock Units"
            icon={TrendingUp}
            iconColor="text-[#006a4e]"
            value={`${totalBranchUnits.toLocaleString()} Pcs`}
            subtitle="Quantity available on shelves & racks"
          />
        </SummaryCardGrid>
      ) : activeTab === 'transactions' ? (
        <SummaryCardGrid>
          <SummaryCard
            title="Total Dispensed Amount"
            icon={DollarSign}
            iconColor="text-[#006a4e]"
            value={kpiMetrics.turnoverStr}
            subtitle={kpiMetrics.subtitle}
          />
          <SummaryCard
            title="Prescription Invoices"
            icon={TrendingUp}
            iconColor="text-[#006a4e]"
            value={kpiMetrics.transactionsStr}
            subtitle={`Audit period: ${appliedDuration}`}
          />
          <SummaryCard
            title="Average Margin"
            icon={Layers}
            iconColor="text-[#006a4e]"
            value={kpiMetrics.marginStr}
            subtitle="Realized on dispensed medication"
          />
        </SummaryCardGrid>
      ) : (
        <SummaryCardGrid>
          <SummaryCard
            title="Gross Sales Turnover"
            icon={DollarSign}
            iconColor="text-[#006a4e]"
            value={kpiMetrics.turnoverStr}
            subtitle={kpiMetrics.subtitle}
            badge={
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {kpiMetrics.badge}
              </span>
            }
          />
          <SummaryCard
            title="Formulary Stock Asset"
            icon={Boxes}
            iconColor="text-[#006a4e]"
            value={kpiMetrics.inventoryStr}
            subtitle="Audited perpetual valuation"
          />
          <SummaryCard
            title="Prescriptions & Sales Dispensed"
            icon={TrendingUp}
            iconColor="text-[#006a4e]"
            value={kpiMetrics.transactionsStr}
            subtitle={`Period: ${appliedDuration}`}
          />
          <SummaryCard
            title="Gross Profit Margin"
            icon={Layers}
            iconColor="text-[#006a4e]"
            value={kpiMetrics.marginStr}
            subtitle="Net realized margin over COGS"
            badge={
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Profitable
              </span>
            }
          />
        </SummaryCardGrid>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: MULTI-BRANCH PERFORMANCE DATA TABLE                               */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <DataTable<BranchPerformanceRecord>
          data={filteredBranchRecords}
          columns={branchColumns}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search by branch name, code, in-charge..."
          searchFilter={(item, query) =>
            item.branchName.toLowerCase().includes(query.toLowerCase()) ||
            item.branchCode.toLowerCase().includes(query.toLowerCase()) ||
            item.incharge.toLowerCase().includes(query.toLowerCase()) ||
            item.city.toLowerCase().includes(query.toLowerCase())
          }
          showSerial={true}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ITEMIZED DISPENSING & CLINICAL TRANSACTIONS TABLE                   */}
      {/* ========================================================================= */}
      {activeTab === 'transactions' && (
        <DataTable<ItemizedDispensingRecord>
          data={filteredTransactions}
          columns={transactionColumns}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search invoice #, medicine, patient, pharmacist..."
          searchFilter={(item, query) =>
            item.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
            item.medicineName.toLowerCase().includes(query.toLowerCase()) ||
            item.patientOrDept.toLowerCase().includes(query.toLowerCase()) ||
            item.pharmacistName.toLowerCase().includes(query.toLowerCase())
          }
          showSerial={true}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLEAN INVENTORY VALUATION REPORT TABLE                              */}
      {/* ========================================================================= */}
      {activeTab === 'abc' && (
        <DataTable<AbcMedicineRecord>
          data={filteredAbcMedicines}
          columns={inventoryValuationColumns}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search medicine by brand or generic name..."
          searchFilter={(item, query) =>
            item.medicineName.toLowerCase().includes(query.toLowerCase()) ||
            item.genericName.toLowerCase().includes(query.toLowerCase()) ||
            item.branchName.toLowerCase().includes(query.toLowerCase())
          }
          showSerial={true}
        />
      )}

      {/* ========================================================================= */}
      {/* FORMAL PRINTABLE HOSPITAL AUDIT STATEMENT MODAL                            */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[4px] shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] p-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Hospital Header Statement */}
            <div className="flex items-start justify-between border-b pb-4 mb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#006a4e] tracking-tight">
                  GREEN LIFE HOSPITAL HEALTHCARE SYSTEM
                </h2>
                <p className="text-xs font-semibold text-slate-800">
                  Directorate of Clinical Pharmacy & Supply Chain Operations
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  DGDA Pharmacy Reg No: DGDA-DH-PH-2024-8891 · VAT TIN: 8841-2094-11
                </p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#006a4e] font-mono text-xs font-bold border border-emerald-200 block">
                  OFFICIAL STATEMENT
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                  Date: {new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>

            {/* Statement Metadata */}
            <div className="bg-slate-50 border border-slate-200 rounded-[3px] p-3 mb-3 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Selected Branch Depot:</span>
                <strong className="text-slate-900">{currentBranchLabel}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Audit Period / Term:</span>
                <strong className="text-slate-900 font-mono">
                  {appliedDuration} (2026-11-01 to 2026-11-30)
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Audited Metric Category:</span>
                <strong className="text-slate-900">
                  {REPORT_TYPE_OPTIONS.find((r) => r.value === reportType)?.label || reportType}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Certified Lead Auditor:</span>
                <strong className="text-slate-900">Md. Rafiqul Islam, M.Pharm (Chief Pharmacist)</strong>
              </div>
            </div>

            {/* Financial Summary Table in Modal */}
            <div className="overflow-y-auto flex-1 min-h-[220px] mb-3">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead className="bg-[#0c2e4b] text-white text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Branch Location</th>
                    <th className="py-2 px-3 text-center">Transactions</th>
                    <th className="py-2 px-3 text-right">Gross Turnover</th>
                    <th className="py-2 px-3 text-right">Net Margin</th>
                    <th className="py-2 px-3 text-right">Stock Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBranchRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="py-2 px-3 font-sans font-medium text-slate-900">
                        {r.branchName} ({r.branchCode})
                      </td>
                      <td className="py-2 px-3 text-center">{r.transactionsCount.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">৳ {r.grossTurnover.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-[#006a4e] font-bold">
                        ৳ {r.netMargin.toLocaleString()} ({r.marginPercent}%)
                      </td>
                      <td className="py-2 px-3 text-right">৳ {r.inventoryAsset.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold font-mono text-slate-900">
                    <td className="py-2 px-3 font-sans">Total Statement Aggregate</td>
                    <td className="py-2 px-3 text-center">
                      {filteredBranchRecords
                        .reduce((sum, r) => sum + r.transactionsCount, 0)
                        .toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right">
                      ৳{' '}
                      {filteredBranchRecords
                        .reduce((sum, r) => sum + r.grossTurnover, 0)
                        .toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-[#006a4e]">
                      ৳{' '}
                      {filteredBranchRecords
                        .reduce((sum, r) => sum + r.netMargin, 0)
                        .toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right">
                      ৳{' '}
                      {filteredBranchRecords
                        .reduce((sum, r) => sum + r.inventoryAsset, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tripartite Official Authorization Signatures Block */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-center text-[10.5px] text-slate-500 mb-4 shrink-0">
              <div>
                <div className="border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-800">
                  Md. Rafiqul Islam, M.Pharm
                </div>
                <span>Prepared By (Chief Pharmacist)</span>
              </div>
              <div>
                <div className="border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-800">
                  Dr. Shahed Kamal, Pharm.D
                </div>
                <span>Verified By (Pharmacy Manager)</span>
              </div>
              <div>
                <div className="border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-800">
                  Prof. Dr. A.K. Azad
                </div>
                <span>Approved By (Medical Director)</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <span className="text-[11px] text-slate-400">
                Official Electronic Audit Document · Valid without physical hospital seal.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close Statement
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3.5 rounded-[3px] bg-[#006a4e] hover:bg-[#00553e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
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
