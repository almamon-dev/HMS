import {
  CheckCircle2,
  Download,
  Eye,
  FileCheck,
  FileText,
  FolderArchive,
  Heart,
  ShieldAlert,
  Upload,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DropdownSelect } from '../common/DropdownSelect';
import { SummaryCard, SummaryCardGrid } from '../common/SummaryCard';

interface MedicalDocumentItem {
  id: string;
  title: string;
  category: 'Diagnostic Scan' | 'Insurance Claim' | 'Clinical Referral' | 'Lab Record';
  fileName: string;
  date: string;
  fileSize: string;
  source: 'Hospital Lab' | 'Self-Uploaded' | 'Physician Office';
}

const INITIAL_DOCUMENTS: MedicalDocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Color Doppler Echocardiogram DICOM Disk Archive',
    category: 'Diagnostic Scan',
    fileName: 'ECHO_20261120_DICOM.zip',
    date: '20 Nov 2026',
    fileSize: '48.2 MB',
    source: 'Hospital Lab',
  },
  {
    id: 'doc-02',
    title: 'Digital Chest X-Ray PA High-Res Image',
    category: 'Diagnostic Scan',
    fileName: 'CHEST_XRAY_PA_3918.dcm',
    date: '15 Oct 2026',
    fileSize: '18.4 MB',
    source: 'Hospital Lab',
  },
  {
    id: 'doc-03',
    title: 'Annual Corporate Health Insurance Claim Slip',
    category: 'Insurance Claim',
    fileName: 'INSURANCE_CLAIM_2026.pdf',
    date: '16 Oct 2026',
    fileSize: '1.2 MB',
    source: 'Self-Uploaded',
  },
  {
    id: 'doc-04',
    title: 'Cardiology Interventional Referral Recommendation',
    category: 'Clinical Referral',
    fileName: 'REFERRAL_DR_TANVIR_2025.pdf',
    date: '15 Dec 2025',
    fileSize: '840 KB',
    source: 'Physician Office',
  },
  {
    id: 'doc-05',
    title: 'COVID-19 Full Immunization Vaccine Certificate',
    category: 'Lab Record',
    fileName: 'COVID_VACCINE_CERT.pdf',
    date: '10 Aug 2024',
    fileSize: '450 KB',
    source: 'Self-Uploaded',
  },
];

interface PatientMedicalRecordsViewProps {
  mode?: 'history' | 'documents';
}

export const PatientMedicalRecordsView: React.FC<PatientMedicalRecordsViewProps> = ({
  mode = 'history',
}) => {
  const [documents, setDocuments] = useState<MedicalDocumentItem[]>(INITIAL_DOCUMENTS);
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Diagnostic Scan' | 'Insurance Claim' | 'Clinical Referral' | 'Lab Record'>('Diagnostic Scan');
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocumentItem | null>(null);

  const filteredDocuments = useMemo(() => {
    if (docCategoryFilter === 'All') return documents;
    return documents.filter((d) => d.category === docCategoryFilter);
  }, [documents, docCategoryFilter]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newDoc: MedicalDocumentItem = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      fileName: `${newTitle.replace(/\s+/g, '_').toLowerCase()}.pdf`,
      date: 'Today (20 Nov 2026)',
      fileSize: '2.4 MB',
      source: 'Self-Uploaded',
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
    setNewTitle('');
  };

  const docColumns: DataTableColumn<MedicalDocumentItem>[] = [
    {
      key: 'title',
      header: 'Document Title',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDoc(r);
            }}
            className="font-bold text-[#006a4e] hover:underline text-left cursor-pointer whitespace-nowrap block"
          >
            {r.title}
          </button>
          <span className="text-[10px] text-slate-500 font-mono">{r.fileName}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20">
          {r.category}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Upload Date',
      sortable: true,
      sortValue: (r) => r.date,
      render: (r) => (
        <span className="text-slate-700 whitespace-nowrap text-xs font-medium">
          {r.date}
        </span>
      ),
    },
    {
      key: 'fileSize',
      header: 'File Size',
      sortable: true,
      sortValue: (r) => r.fileSize,
      render: (r) => (
        <span className="text-slate-600 text-xs font-mono">{r.fileSize}</span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      sortValue: (r) => r.source,
      render: (r) => (
        <span className="text-slate-800 text-xs font-medium">{r.source}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedDoc(r)}
            className="p-1 hover:bg-[#edf6f2] text-[#006a4e] rounded transition-colors cursor-pointer"
            title="Preview Document"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => alert(`Downloading document: ${r.fileName}`)}
            className="p-1 hover:bg-slate-100 text-slate-600 rounded transition-colors cursor-pointer"
            title="Download File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 4 Summary Metric Cards */}
      <SummaryCardGrid>
        {mode === 'history' ? (
          <>
            <SummaryCard
              title="Chronic Illnesses"
              icon={Heart}
              iconColor="text-rose-600"
              value="2 Diagnoses"
              subtitle="Hypertension & Type 2 DM"
            />
            <SummaryCard
              title="Drug Allergies"
              icon={ShieldAlert}
              iconColor="text-amber-600"
              value="2 Reported"
              valueColor="text-amber-700"
              subtitle="Penicillin & Sulfa drugs"
            />
            <SummaryCard
              title="Procedures & Surgeries"
              icon={FileCheck}
              iconColor="text-[#006a4e]"
              value="1 Angiogram"
              valueColor="text-[#006a4e]"
              subtitle="Dec 2025 · Inpatient stay"
            />
            <SummaryCard
              title="Immunization Status"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
              value="Up-to-Date"
              valueColor="text-emerald-700"
              subtitle="COVID, Hep B, Influenza"
            />
          </>
        ) : (
          <>
            <SummaryCard
              title="Total Documents"
              icon={FolderArchive}
              iconColor="text-[#006a4e]"
              value={`${documents.length} Files`}
              subtitle="Archived cloud records"
            />
            <SummaryCard
              title="Diagnostic Scans"
              icon={FolderArchive}
              iconColor="text-cyan-600"
              value="2 Image Disks"
              valueColor="text-cyan-700"
              subtitle="Echo & Chest X-Ray"
            />
            <SummaryCard
              title="Insurance Claims"
              icon={FileText}
              iconColor="text-amber-600"
              value="1 Claim File"
              valueColor="text-amber-700"
              subtitle="Corporate claim slip"
            />
            <SummaryCard
              title="Clinical Referrals"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
              value="1 Letter"
              valueColor="text-emerald-700"
              subtitle="Cardiology recommendation"
            />
          </>
        )}
      </SummaryCardGrid>

      {mode === 'history' ? (
        /* Detailed Medical History Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Chronic Diseases Card */}
          <div className="bg-white border border-slate-300 rounded-[3px] p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold text-slate-900">Chronic Illnesses &amp; Conditions</h4>
              </div>
              <span className="text-[10px] text-slate-500">Verified by Medical Board</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 bg-rose-50/50 border border-rose-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-900">Essential Systemic Hypertension</span>
                  <span className="text-[10px] font-semibold text-rose-700">7 Years Duration</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Controlled with daily Bisoprolol 2.5mg and lifestyle salt restriction.
                </p>
              </div>

              <div className="p-2 bg-amber-50/50 border border-amber-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900">Type 2 Diabetes Mellitus</span>
                  <span className="text-[10px] font-semibold text-amber-700">4 Years Duration</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Managed with Metformin 500mg and Linagliptin 5mg. Target HbA1c &lt; 7.0%.
                </p>
              </div>
            </div>
          </div>

          {/* Allergies & Alerts Card */}
          <div className="bg-white border border-slate-300 rounded-[3px] p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-900">Reported Drug &amp; Environmental Allergies</h4>
              </div>
              <span className="text-[10px] text-rose-600 font-bold">Critical Alert</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 bg-amber-50/50 border border-amber-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900">Penicillin Group Antibiotics</span>
                  <span className="text-[10px] font-semibold text-rose-700">Severe Anaphylaxis Risk</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  History of urticaria and facial angioedema with Ampicillin. Contraindicated.
                </p>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Sulfonamides (Sulfa drugs)</span>
                  <span className="text-[10px] font-semibold text-amber-700">Moderate Sensitivity</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Mild maculopapular rash reported. Avoid Co-trimoxazole.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Documents DataTable Card */
        <div className="bg-white border border-slate-300 rounded-[3px] shadow-xs">
          <div className="p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Filter Category:</span>
              <DropdownSelect
                options={[
                  { value: 'All', label: 'All Documents' },
                  { value: 'Diagnostic Scan', label: 'Diagnostic Scans' },
                  { value: 'Insurance Claim', label: 'Insurance Claims' },
                  { value: 'Clinical Referral', label: 'Clinical Referrals' },
                  { value: 'Lab Record', label: 'Lab Records' },
                ]}
                value={docCategoryFilter}
                onChange={setDocCategoryFilter}
                className="w-48"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Document
              </button>
            </div>
          </div>

          <DataTable
            columns={docColumns}
            data={filteredDocuments}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Search files by title, filename or source..."
            searchFilter={(item, query) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.fileName.toLowerCase().includes(query.toLowerCase()) ||
              item.category.toLowerCase().includes(query.toLowerCase())
            }
            defaultSort={{ key: 'date', order: 'desc' }}
            showSerial={true}
            emptyMessage="No documents found."
            onRowClick={(item) => setSelectedDoc(item)}
          />
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[3px] shadow-2xl max-w-md w-full p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">Upload Medical Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. Previous Echocardiogram 2024"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Document Category
                </label>
                <DropdownSelect
                  options={[
                    { value: 'Diagnostic Scan', label: 'Diagnostic Scan' },
                    { value: 'Insurance Claim', label: 'Insurance Claim' },
                    { value: 'Clinical Referral', label: 'Clinical Referral' },
                    { value: 'Lab Record', label: 'Lab Record' },
                  ]}
                  value={newCategory}
                  onChange={(v) => setNewCategory(v as any)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Select File (PDF, PNG, JPG, DICOM)
                </label>
                <input
                  type="file"
                  className="w-full px-2.5 py-2 border border-dashed border-slate-300 rounded text-xs text-slate-600 bg-slate-50 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                >
                  Upload &amp; Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Selected Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[3px] shadow-2xl max-w-md w-full p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-slate-900">{selectedDoc.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-800">{selectedDoc.category}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">File Name &amp; Size</span>
                <span className="font-mono text-slate-700">{selectedDoc.fileName} ({selectedDoc.fileSize})</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Uploaded By / Date</span>
                <span className="text-slate-800">{selectedDoc.source} • {selectedDoc.date}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert(`Downloading ${selectedDoc.fileName}`)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
