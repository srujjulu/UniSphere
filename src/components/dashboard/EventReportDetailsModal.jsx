import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Eye, 
  ShieldCheck, 
  FileCheck, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Send, 
  Archive, 
  Sparkles,
  MessageSquare,
  Building2,
  GraduationCap
} from 'lucide-react';
import { statusBadges, REPORT_STATUSES } from '../../utils/mockEventReports';
import { generateOfficialEventReportPDF } from '../../utils/pdfGenerator';
import { downloadReportFile, downloadReportZIPArchive } from '../../utils/downloadManager';

const EventReportDetailsModal = ({
  isOpen,
  onClose,
  report,
  userRole = 'student',
  user,
  onReviewSubmit,
  onEditReport,
  onToast
}) => {
  const [facultyComment, setFacultyComment] = useState(report?.facultyComments || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  if (!isOpen || !report) return null;

  const currentStatusInfo = statusBadges[report.status] || statusBadges['Submitted'];
  const canReview = userRole === 'faculty' || userRole === 'admin';
  const canEdit = (userRole === 'core' || userRole === 'admin') && (report.status === REPORT_STATUSES.DRAFT || report.status === REPORT_STATUSES.CHANGES_REQUESTED || report.status === REPORT_STATUSES.SUBMITTED);

  // Download complete PDF handler
  const handleDownloadPDF = () => {
    if (onToast) onToast(`Generating official PDF report for "${report.eventTitle}"... 📄`, 'info');
    const res = generateOfficialEventReportPDF(report);
    if (res.success && onToast) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
  };

  // Download complete ZIP archive handler
  const handleDownloadZIP = async () => {
    setIsProcessing(true);
    if (onToast) onToast(`Packaging all documents and photos into ZIP archive... 📦`, 'info');
    const res = await downloadReportZIPArchive(report);
    setIsProcessing(false);
    if (res.success && onToast) {
      onToast(`Downloaded: ${res.filename} 🎉`, 'success');
    }
  };

  // Single file download handler
  const handleDownloadFile = (file) => {
    if (onToast) onToast(`Downloading ${file.name}... ⬇`, 'info');
    downloadReportFile(file, report);
  };

  // Faculty Review Action
  const handleFacultyAction = (newStatus) => {
    if (onReviewSubmit) {
      onReviewSubmit(report.id, newStatus, facultyComment);
      if (onToast) {
        onToast(
          newStatus === REPORT_STATUSES.VERIFIED
            ? `Report for "${report.eventTitle}" verified & approved! ✅`
            : `Changes requested for "${report.eventTitle}". Club notified! ⚠️`,
          newStatus === REPORT_STATUSES.VERIFIED ? 'success' : 'info'
        );
      }
      onClose();
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
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {report.reportId || report.id}
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${currentStatusInfo.badge}`}>
                <span>{currentStatusInfo.icon}</span>
                <span>{report.status}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                AY {report.academicYear || '2025-2026'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {report.eventTitle}
            </h3>

            <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
              <strong className="text-amber-400 font-bold">{report.clubName}</strong>
              <span>•</span>
              <span>{report.eventDate}</span>
              <span>•</span>
              <span>{report.venue}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{report.participantCount || 0} Participants</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onEditReport) onEditReport(report);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Edit Report
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download size={14} />
              <span>PDF Report</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadZIP}
              disabled={isProcessing}
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

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar text-xs text-slate-300">
          {/* SECTION 1: EVENT OVERVIEW */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
              <FileText size={15} />
              <span>Section 1: Event Overview</span>
            </h4>

            <div>
              <span className="font-extrabold text-white block mb-0.5">Objective:</span>
              <p className="text-slate-300 leading-relaxed">{report.objective || 'No objective provided.'}</p>
            </div>

            <div>
              <span className="font-extrabold text-white block mb-0.5">Description & Summary:</span>
              <p className="text-slate-300 leading-relaxed">{report.summary || 'No summary description provided.'}</p>
            </div>

            {report.activities && (
              <div>
                <span className="font-extrabold text-white block mb-0.5">Activities Conducted:</span>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">{report.activities}</p>
              </div>
            )}
          </div>

          {/* SECTION 2: EVENT DETAILS */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2">
              <Calendar size={15} />
              <span>Section 2: Event Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Timing</span>
                <p className="font-bold text-white text-xs mt-0.5">
                  {report.eventDate} ({report.startTime} - {report.endTime})
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Mode: {report.mode || 'Offline'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus Venue</span>
                <p className="font-bold text-white text-xs mt-0.5">{report.venue}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">CMRTC Campus Location</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Coordinator</span>
                <p className="font-bold text-white text-xs mt-0.5">{report.facultyCoordinator}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Institutional Lead</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Chief Guest / Speaker</span>
                <p className="font-bold text-white text-xs mt-0.5">{report.chiefGuest || 'Internal Faculty & Mentors'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Guest Facilitator</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PARTICIPATION */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
              <Users size={15} />
              <span>Section 3: Participation & Volunteer Metrics</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <span className="text-2xl font-black text-white block">{report.participantCount || 0}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Participants</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <span className="text-2xl font-black text-purple-400 block">{report.volunteerCount || 0}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Student Volunteers</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <span className="text-2xl font-black text-emerald-400 block">100%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">QR Scan Accuracy</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <span className="text-2xl font-black text-blue-400 block">{report.files?.length || 0}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Documents Attached</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: OUTCOMES & ACHIEVEMENTS */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
              <Award size={15} />
              <span>Section 4: Key Outcomes & Achievements</span>
            </h4>

            {report.outcome && (
              <div>
                <span className="font-extrabold text-white block mb-0.5">Event Outcomes & Impact:</span>
                <p className="text-slate-300 leading-relaxed">{report.outcome}</p>
              </div>
            )}

            {report.highlights && (
              <div>
                <span className="font-extrabold text-white block mb-0.5">Key Highlights:</span>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">{report.highlights}</p>
              </div>
            )}

            {report.achievements && (
              <div>
                <span className="font-extrabold text-white block mb-0.5">Student Achievements / Winners:</span>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">{report.achievements}</p>
              </div>
            )}

            {(report.challenges || report.suggestions) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
                {report.challenges && (
                  <div>
                    <span className="font-extrabold text-rose-400 block mb-0.5">Challenges Faced:</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{report.challenges}</p>
                  </div>
                )}
                {report.suggestions && (
                  <div>
                    <span className="font-extrabold text-blue-400 block mb-0.5">Future Suggestions:</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{report.suggestions}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 5: MEDIA GALLERY */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-pink-400 tracking-wider flex items-center gap-2">
              <ImageIcon size={15} />
              <span>Section 5: Event Media Gallery</span>
            </h4>

            {report.files && report.files.filter(f => f.category === 'event_photos' || f.category === 'brochure_poster').length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.files.filter(f => f.category === 'event_photos' || f.category === 'brochure_poster').map((imgFile, idx) => (
                  <div 
                    key={imgFile.id || idx}
                    onClick={() => setActivePreviewImage(imgFile.url || '/images/codeholics/codeholics-hack-the-verse.png')}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 group cursor-pointer"
                  >
                    <img 
                      src={imgFile.url || '/images/codeholics/codeholics-hack-the-verse.png'} 
                      alt={imgFile.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-[10px]">
                      <Eye size={14} />
                      <span>View Full Image</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">No event photos attached yet.</p>
            )}
          </div>

          {/* SECTION 6: DOCUMENTS */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                <FileCheck size={15} />
                <span>Section 6: Attached Verification Documents</span>
              </h4>
              <button
                type="button"
                onClick={handleDownloadZIP}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Download size={13} />
                <span>Download All Files</span>
              </button>
            </div>

            {report.files && report.files.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {report.files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {file.name.endsWith('.xlsx') || file.name.endsWith('.csv') ? (
                        <FileSpreadsheet size={20} className="text-emerald-400 shrink-0" />
                      ) : (
                        <FileText size={20} className="text-blue-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <p className="font-bold text-white truncate text-xs">{file.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase">
                          {file.category?.replace('_', ' ')} • {file.size || 'Verified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(file)}
                        title="Download Document"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">No attached files uploaded for this report.</p>
            )}
          </div>

          {/* SECTION 7: FACULTY REVIEW & VERIFICATION */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
              <ShieldCheck size={15} />
              <span>Section 7: Faculty Coordinator Review & Verification</span>
            </h4>

            {report.reviewedBy && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-400">Reviewed By: </span>
                  <strong className="text-white font-bold">{report.reviewedBy}</strong>
                </div>
                <span className="text-slate-400">
                  {report.reviewedAt ? new Date(report.reviewedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Verified'}
                </span>
              </div>
            )}

            {canReview ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Faculty Remarks & Audit Comments:
                  </label>
                  <textarea
                    rows={3}
                    value={facultyComment}
                    onChange={(e) => setFacultyComment(e.target.value)}
                    placeholder="Enter formal verification feedback, accreditation audit remarks, or requested amendments..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:border-amber-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleFacultyAction(REPORT_STATUSES.CHANGES_REQUESTED)}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <AlertCircle size={14} />
                    <span>Request Changes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFacultyAction(REPORT_STATUSES.VERIFIED)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve & Verify</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Faculty Remarks:</span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {report.facultyComments || 'Pending review by assigned faculty coordinator.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadZIP}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Archive size={14} />
              <span>⬇ Download Complete Event Report</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Image Preview Sub-Modal */}
      {activePreviewImage && (
        <div 
          onClick={() => setActivePreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <img src={activePreviewImage} alt="Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setActivePreviewImage(null)}
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

export default EventReportDetailsModal;
