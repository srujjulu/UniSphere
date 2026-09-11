import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  FileText, 
  FileSpreadsheet, 
  FileCheck, 
  Download, 
  Eye, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Archive,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { downloadReportFile, downloadReportZIPArchive } from '../../utils/downloadManager';
import { generateOfficialEventReportPDF } from '../../utils/pdfGenerator';

const EventDocumentsModal = ({
  isOpen,
  onClose,
  event,
  report,
  onToast = () => {}
}) => {
  const [selectedDocCategory, setSelectedDocCategory] = useState('ALL');
  const [isPackagingZip, setIsPackagingZip] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  if (!isOpen || !event) return null;

  const eventTitle = event.title || event.eventTitle || 'Campus Event';
  const clubName = event.clubName || 'Student Club';
  const eventDate = event.date || event.eventDate || '2026-08-25';

  // Construct files list either from report or generated default compliance files
  const defaultFiles = [
    {
      id: `doc-rep-${event.id}-1`,
      category: 'official_report',
      name: `Official_Event_Report_${event.id}.pdf`,
      type: 'application/pdf',
      size: '2.4 MB',
      description: 'Comprehensive post-activity report with executive summary and faculty endorsement.',
      uploadedAt: eventDate
    },
    {
      id: `doc-rep-${event.id}-2`,
      category: 'attendance_sheet',
      name: `Verified_Branch_Attendance_Register.xlsx`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: '186 KB',
      description: 'Official student check-in register across all engineering branches with QR timestamps.',
      uploadedAt: eventDate
    },
    {
      id: `doc-rep-${event.id}-3`,
      category: 'permission_letter',
      name: `Dean_Student_Affairs_Permission_Order.pdf`,
      type: 'application/pdf',
      size: '430 KB',
      description: 'Administrative approval and venue allocation sanction letter.',
      uploadedAt: eventDate
    },
    {
      id: `doc-rep-${event.id}-4`,
      category: 'budget_expense',
      name: `Audited_Expenditure_and_Bills.xlsx`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: '95 KB',
      description: 'Financial voucher statements and vendor settlement reconciliation.',
      uploadedAt: eventDate
    },
    {
      id: `doc-rep-${event.id}-5`,
      category: 'brochure_poster',
      name: `Event_Official_Brochure_Poster.png`,
      type: 'image/png',
      size: '3.1 MB',
      url: event.image || '/images/codeholics/codeholics-hack-the-verse.png',
      description: 'Approved publicity poster and registration promotional flyer.',
      uploadedAt: eventDate
    }
  ];

  const files = (report?.files && report.files.length > 0) ? report.files : defaultFiles;

  const filteredFiles = files.filter(f => {
    if (selectedDocCategory === 'ALL') return true;
    return f.category === selectedDocCategory;
  });

  const handleDownloadSingle = (file) => {
    onToast(`Downloading document: ${file.name}... ⬇`, 'info');
    downloadReportFile(file, report || { eventTitle, clubName, eventDate });
  };

  const handleDownloadOfficialPDF = () => {
    onToast(`Generating official PDF summary for "${eventTitle}"... 📄`, 'info');
    const res = generateOfficialEventReportPDF(report || {
      eventTitle,
      clubName,
      eventDate,
      venue: event.venue,
      participantCount: event.participantCount || event.totalAttendance || 120,
      summary: event.description || 'Institutional campus event report.',
      status: 'Verified / Approved'
    });
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
  };

  const handleDownloadAllZIP = async () => {
    setIsPackagingZip(true);
    onToast(`Archiving all documents and media into ZIP package... 📦`, 'info');
    const res = await downloadReportZIPArchive(report || {
      eventTitle,
      clubName,
      eventDate,
      files
    });
    setIsPackagingZip(false);
    if (res.success) {
      onToast(`Downloaded: ${res.filename} 🎉`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/70 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Institutional Document Repository
              </span>
              <span className="text-xs text-slate-400 font-semibold">{clubName}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {eventTitle} — Event Documents & Archives
            </h3>

            <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
              <span>{eventDate}</span>
              <span>•</span>
              <span>{event.venue || 'CMRTC Campus'}</span>
              <span>•</span>
              <strong className="text-emerald-400 font-bold">{files.length} Official Files Available</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              onClick={handleDownloadOfficialPDF}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <FileText size={14} />
              <span>Official PDF</span>
            </button>

            <button
              onClick={handleDownloadAllZIP}
              disabled={isPackagingZip}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Archive size={14} />
              <span>Download ZIP</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar text-xs text-slate-300">
          {/* Categories Tab */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {[
              { id: 'ALL', label: 'All Documents' },
              { id: 'official_report', label: 'Official Reports' },
              { id: 'attendance_sheet', label: 'Attendance Sheets' },
              { id: 'permission_letter', label: 'Sanctions & Permissions' },
              { id: 'budget_expense', label: 'Budget & Invoices' },
              { id: 'brochure_poster', label: 'Posters & Media' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedDocCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs ${
                  selectedDocCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredFiles.map((file) => {
              const isSpreadsheet = file.name.endsWith('.xlsx') || file.name.endsWith('.csv');
              const isImage = file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.category === 'event_photos';
              const isPdf = file.name.endsWith('.pdf');

              return (
                <div
                  key={file.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 transition-all flex flex-col justify-between gap-3 group shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                      {isSpreadsheet ? (
                        <FileSpreadsheet size={22} className="text-emerald-400" />
                      ) : isImage ? (
                        <ImageIcon size={22} className="text-pink-400" />
                      ) : (
                        <FileText size={22} className="text-blue-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono font-black text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                          {file.category?.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{file.size || 'Verified'}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white truncate" title={file.name}>
                        {file.name}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {file.description || `Official institutional file submitted for ${eventTitle}.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 mt-1">
                    <span className="text-[10px] text-slate-400">Uploaded: {file.uploadedAt || eventDate}</span>

                    <div className="flex items-center gap-2">
                      {isImage && (
                        <button
                          onClick={() => setPreviewImage(file.url || event.image || '/images/codeholics/codeholics-hack-the-verse.png')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye size={12} />
                          <span>Preview</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDownloadSingle(file)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs transition-all active:scale-95"
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drive & Cloud Archive Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>NAAC & UGC Accreditation Compliance Archive</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                All event documents and circulars are digitally timestamped and retained for collegiate quality audits.
              </p>
            </div>

            <button
              onClick={handleDownloadAllZIP}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors whitespace-nowrap"
            >
              <Archive size={14} />
              <span>Download Full Event Bundle (.zip)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadOfficialPDF}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download size={13} />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Image Preview Sub-Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDocumentsModal;
