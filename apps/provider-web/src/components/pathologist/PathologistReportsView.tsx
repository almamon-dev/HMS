import React, { useState } from 'react';
import {
  CheckCircle,
  Download,
  Eye,
  FileCheck,
  FileText,
  Printer,
  QrCode,
  Search,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  CURRENT_PATHOLOGIST,
  FINAL_LAB_REPORTS_DATA,
  FinalLabReportItem,
} from '../../data/pathologistPortalData';

export const PathologistReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signed' | 'amended' | 'dispatch'>('signed');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<FinalLabReportItem | null>(null);

  const filteredReports = FINAL_LAB_REPORTS_DATA.filter((r) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.reportNo.toLowerCase().includes(q) ||
      r.uhid.toLowerCase().includes(q) ||
      r.testName.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck size={24} className="text-[#006a4e]" />
            <span>Authorized Laboratory Reports & QR Verification</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Official signed diagnostic reports with cryptographic digital signature, QR code verification, and patient portal dispatch.
          </p>
        </div>
      </div>

      {/* Horizontal Sub-tabs (Image 1 reference styling) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs md:text-sm font-semibold select-none overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('signed')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'signed'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck size={16} />
          <span>Official Signed Reports</span>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            (4)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('amended')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'amended'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={16} />
          <span>Amended / Supplementary Reports</span>
          <span className="text-xs font-mono font-medium text-slate-500">
            (1)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={`flex items-center gap-2 pb-3 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'dispatch'
              ? 'text-[#006a4e] border-b-2 border-[#006a4e] -mb-[1px] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Share2 size={16} />
          <span>Dispatch & Delivery Status</span>
          <span className="text-xs font-mono font-medium text-slate-500">
            (185)
          </span>
        </button>
      </div>

      {/* Main Single-Layer Surface: Reports Table (NO nested cards) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient, report #, UHID, or test..."
              className="w-full text-xs bg-white pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredReports.length} authorized reports
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4">Report No & Barcode</th>
                <th className="py-3 px-4">Patient & UHID</th>
                <th className="py-3 px-4">Diagnostic Investigation</th>
                <th className="py-3 px-4">Overall Impression</th>
                <th className="py-3 px-4">Verified Time & Signatory</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-teal-800 text-[12.5px]">
                      {report.reportNo}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Bill: {report.billNo}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      BC: {report.barcode}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-[13px]">
                      {report.patientName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {report.uhid} • {report.ageGender}
                    </div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5">
                      Ref: {report.orderedBy}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {report.testName}
                    </div>
                    <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                      {report.category}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-slate-700 text-xs line-clamp-2 leading-relaxed">
                      {report.overallImpression}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">
                      {report.pathologistName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {report.verifiedAt}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle size={11} />
                      {report.deliveryStatus}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Downloads: {report.downloadCount}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1.5 rounded-lg bg-[#006a4e] text-white hover:bg-[#00523c] font-semibold text-xs transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>View Statement</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Diagnostic Statement Modal (Printable Document) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Actions Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10 print:hidden">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileCheck size={16} className="text-[#006a4e]" />
                <span>Diagnostic Pathology Statement Preview</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Downloading PDF for ${selectedReport.reportNo}...`)}
                  className="px-3 py-1.5 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-8 space-y-6 text-slate-900 font-sans">
              {/* Letterhead */}
              <div className="border-b-2 border-[#006a4e] pb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#006a4e] tracking-tight">
                    GREEN LIFE HOSPITAL
                  </h2>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Department of Laboratory Medicine & Diagnostic Pathology
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    32 Green Road, Dhanmondi, Dhaka-1205 • Tel: +880 2 9612345 • Lab Hotline: 10609
                  </p>
                </div>
                <div className="text-right">
                  <div className="p-2 border border-slate-300 rounded-lg inline-block bg-slate-50">
                    <QrCode size={48} className="text-slate-800" />
                  </div>
                  <span className="block text-[9px] font-mono text-slate-500 mt-1">
                    Verify: {selectedReport.qrVerificationCode}
                  </span>
                </div>
              </div>

              {/* Patient Demographics & Report Meta */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-500 font-medium">Patient Name: </span>
                    <strong className="text-slate-900">{selectedReport.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Age / Gender: </span>
                    <span className="font-mono text-slate-800">{selectedReport.ageGender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Hospital UHID: </span>
                    <span className="font-mono font-bold text-slate-900">{selectedReport.uhid}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Referring Consultant: </span>
                    <span className="text-slate-800 font-semibold">{selectedReport.orderedBy}</span>
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <div>
                    <span className="text-slate-500 font-medium">Report No: </span>
                    <span className="font-mono font-bold text-teal-800">{selectedReport.reportNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Order / Bill No: </span>
                    <span className="font-mono text-slate-800">{selectedReport.billNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Sample Barcode: </span>
                    <span className="font-mono text-slate-800">{selectedReport.barcode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Verified Timestamp: </span>
                    <span className="font-mono text-slate-800">{selectedReport.verifiedAt}</span>
                  </div>
                </div>
              </div>

              {/* Investigation Header */}
              <div className="text-center py-2 bg-teal-50 border-y border-teal-200">
                <h3 className="text-sm font-bold text-teal-900 tracking-wide uppercase">
                  {selectedReport.testName}
                </h3>
                <span className="text-[11px] text-teal-700 font-medium">
                  Discipline: {selectedReport.category}
                </span>
              </div>

              {/* Report Body / Clinical Impression */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Diagnostic Findings & Clinical Interpretation:
                </h4>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-800 font-medium">
                  {selectedReport.overallImpression}
                </div>
              </div>

              {/* Accredited Disclaimer */}
              <p className="text-[10px] text-slate-400 italic leading-normal">
                Note: Diagnostic laboratory tests must be correlated with clinical signs, patient history, and physical examination. In vitro diagnostic analysis performed on automated systems with daily internal IQC calibration.
              </p>

              {/* Pathologist Digital Signature Block */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                <div className="text-[10.5px] text-slate-500">
                  <span>Report Generated: 2026-11-24 10:45</span>
                  <br />
                  <span className="text-[9.5px]">Green Life Hospital LIS Core v4.2</span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base text-[#006a4e] font-bold mb-0.5">
                    Dr. Nusrat Jahan
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    {CURRENT_PATHOLOGIST.name}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {CURRENT_PATHOLOGIST.qualification}
                  </div>
                  <div className="text-[10.5px] text-teal-800 font-mono font-bold">
                    Reg: {CURRENT_PATHOLOGIST.bmdcRegNo}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
