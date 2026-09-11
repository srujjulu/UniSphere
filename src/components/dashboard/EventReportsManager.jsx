import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Archive, 
  Layers, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Check, 
  X, 
  Sparkles,
  ChevronRight,
  FolderDown,
  RefreshCw
} from 'lucide-react';
import { 
  getStoredEventReports, 
  saveEventReport, 
  reviewEventReport, 
  deleteEventReport, 
  statusBadges, 
  REPORT_STATUSES 
} from '../../utils/mockEventReports';
import { generateOfficialEventReportPDF } from '../../utils/pdfGenerator';
import { downloadReportZIPArchive, downloadEventReportsSummaryCSV } from '../../utils/downloadManager';
import EventReportSubmitModal from './EventReportSubmitModal';
import EventReportDetailsModal from './EventReportDetailsModal';

const EventReportsManager = ({
  role = 'core', // 'core' | 'faculty' | 'admin' | 'student'
  selectedClubId = 'codeholics',
  activeClub = null,
  facultyUser = null,
  user = null,
  onToast = () => {}
}) => {
  const [reports, setReports] = useState(getStoredEventReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedClubFilter, setSelectedClubFilter] = useState(role === 'core' ? (selectedClubId || 'codeholics') : 'all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  const refreshReports = () => {
    setReports(getStoredEventReports());
  };

  // Club-specific filtering for Core Team
  const effectiveClubId = role === 'core' ? (selectedClubId || 'codeholics') : selectedClubFilter;

  // Filtered reports logic
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // Role scope filter
      if (role === 'core') {
        if (effectiveClubId !== 'all' && r.clubId !== effectiveClubId) return false;
      } else if (role === 'faculty') {
        // If specific club assigned to faculty
        if (selectedClubFilter !== 'all' && r.clubId !== selectedClubFilter) return false;
      } else if (role === 'admin') {
        if (selectedClubFilter !== 'all' && r.clubId !== selectedClubFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.eventTitle?.toLowerCase().includes(q);
        const matchesClub = r.clubName?.toLowerCase().includes(q);
        const matchesId = r.reportId?.toLowerCase().includes(q);
        const matchesCoord = r.facultyCoordinator?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesClub && !matchesId && !matchesCoord) return false;
      }

      // Status Filter
      if (selectedStatusFilter !== 'all') {
        if (r.status !== selectedStatusFilter) return false;
      }

      // Category Filter
      if (selectedCategoryFilter !== 'all') {
        if (r.category !== selectedCategoryFilter) return false;
      }

      // Academic Year Filter
      if (selectedYearFilter !== 'all') {
        if (r.academicYear !== selectedYearFilter) return false;
      }

      // Date Filter
      if (dateFilter) {
        if (r.eventDate !== dateFilter) return false;
      }

      return true;
    });
  }, [reports, role, effectiveClubId, selectedClubFilter, searchQuery, selectedStatusFilter, selectedCategoryFilter, selectedYearFilter, dateFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const scoped = role === 'core' 
      ? reports.filter(r => r.clubId === effectiveClubId)
      : reports;

    const total = scoped.length;
    const verified = scoped.filter(r => r.status === REPORT_STATUSES.VERIFIED).length;
    const pending = scoped.filter(r => r.status === REPORT_STATUSES.SUBMITTED || r.status === REPORT_STATUSES.UNDER_REVIEW).length;
    const changes = scoped.filter(r => r.status === REPORT_STATUSES.CHANGES_REQUESTED).length;
    const drafts = scoped.filter(r => r.status === REPORT_STATUSES.DRAFT).length;

    return { total, verified, pending, changes, drafts };
  }, [reports, role, effectiveClubId]);

  // Submit / Save handler
  const handleReportSave = (reportData, isDraft) => {
    const saved = saveEventReport(reportData);
    refreshReports();
    if (onToast) {
      onToast(
        isDraft 
          ? `Draft saved for "${saved.eventTitle}" 📄` 
          : `Event report submitted successfully for "${saved.eventTitle}"! 🚀`,
        'success'
      );
    }
  };

  // Review / Verification handler (Faculty & Admin)
  const handleReviewSubmit = (reportId, newStatus, comments) => {
    const reviewerName = facultyUser?.name || user?.name || (role === 'admin' ? 'Administration Cell' : 'Dr. Suresh Kumar');
    reviewEventReport(reportId, newStatus, comments, reviewerName);
    refreshReports();
  };

  // Quick Direct Review from card
  const handleQuickVerify = (report, e) => {
    e.stopPropagation();
    const reviewerName = facultyUser?.name || user?.name || 'Dr. Suresh Kumar';
    reviewEventReport(report.id, REPORT_STATUSES.VERIFIED, 'Verified and approved for institutional records.', reviewerName);
    refreshReports();
    if (onToast) onToast(`Approved "${report.eventTitle}"! Verified stamp added ✅`, 'success');
  };

  // Open details
  const handleOpenDetails = (report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  // Edit report
  const handleEditReport = (report, e) => {
    if (e) e.stopPropagation();
    setEditingReport(report);
    setIsSubmitModalOpen(true);
  };

  // Download single PDF
  const handleDownloadPDF = (report, e) => {
    if (e) e.stopPropagation();
    if (onToast) onToast(`Generating PDF for ${report.eventTitle}... 📄`, 'info');
    generateOfficialEventReportPDF(report);
  };

  // Download single ZIP
  const handleDownloadZIP = async (report, e) => {
    if (e) e.stopPropagation();
    if (onToast) onToast(`Packaging ZIP files for ${report.eventTitle}... 📦`, 'info');
    await downloadReportZIPArchive(report);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (onToast) onToast('Exporting Event Reports summary CSV... 📊', 'info');
    downloadEventReportsSummaryCSV(filteredReports);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. TOP HEADER & MAIN ACTION CTA */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <FileText size={12} />
              <span>Institutional Compliance</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500">CMRTC Digital Repository</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>📄 Event Reports & Activity Archive</span>
          </h2>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {role === 'core' 
              ? `Submit, track, and archive official event reports, attendance sheets, and expense vouchers for ${activeClub?.name || 'your club'}.`
              : role === 'faculty'
              ? 'Review and verify event reports submitted by student clubs. Provide feedback, request amendments, or grant official faculty verification.'
              : 'College-wide centralized event report collection repository for NAAC, IQAC, and institutional activity auditing.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {(role === 'core' || role === 'admin') && (
            <button
              onClick={() => {
                setEditingReport(null);
                setIsSubmitModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>+ Submit Event Report</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95 transition-all"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. STATISTICAL KPI CARDS (Admin & Faculty & Core) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Event Reports</span>
            <p className="text-2xl font-black text-white">{stats.total}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Archived Reports</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <FileText size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400">Pending Review</span>
            <p className="text-2xl font-black text-amber-400">{stats.pending}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Under Evaluation</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Clock size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Verified Reports</span>
            <p className="text-2xl font-black text-emerald-400">{stats.verified}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Faculty Approved</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-400">Changes Requested</span>
            <p className="text-2xl font-black text-rose-400">{stats.changes}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Action Required</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* 3. MULTI-CRITERIA FILTERS & SEARCH BAR */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event, club, ID..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs font-medium focus:border-blue-500 outline-none"
            />
          </div>

          {/* Club Filter (For Admin & Faculty) */}
          {role !== 'core' && (
            <div>
              <select
                value={selectedClubFilter}
                onChange={(e) => setSelectedClubFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="all">All Campus Clubs</option>
                <option value="codeholics">Codeholics Tech Club</option>
                <option value="akriti">AKRITI Cultural Club</option>
                <option value="lexis">The Lexis Literary Club</option>
                <option value="photography">Film & Photography Club</option>
                <option value="ncc">NCC Cadet Corps</option>
                <option value="nss">NSS Service Unit</option>
              </select>
            </div>
          )}

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="all">All Event Categories</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Workshops">Workshops</option>
              <option value="Competitions">Competitions</option>
              <option value="Cultural Fests">Cultural Fests</option>
              <option value="Social Drives">Social Drives</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="all">All Academic Years</option>
              <option value="2025-2026">AY 2025-2026</option>
              <option value="2024-2025">AY 2024-2025</option>
              <option value="2023-2024">AY 2023-2024</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          {[
            { id: 'all', label: 'All Reports' },
            { id: REPORT_STATUSES.VERIFIED, label: '🟢 Verified / Approved' },
            { id: REPORT_STATUSES.UNDER_REVIEW, label: '🔵 Under Review' },
            { id: REPORT_STATUSES.SUBMITTED, label: '🟠 Submitted' },
            { id: REPORT_STATUSES.CHANGES_REQUESTED, label: '🔴 Changes Requested' },
            { id: REPORT_STATUSES.DRAFT, label: '🟡 Drafts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. EVENT REPORT CARDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>Showing {filteredReports.length} Event Reports</span>
          <button
            onClick={refreshReports}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Refresh List</span>
          </button>
        </div>

        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => {
              const statusInfo = statusBadges[report.status] || statusBadges['Submitted'];
              const canEditThis = (role === 'core' || role === 'admin') && (report.status === REPORT_STATUSES.DRAFT || report.status === REPORT_STATUSES.CHANGES_REQUESTED || report.status === REPORT_STATUSES.SUBMITTED);
              const canFacultyReview = (role === 'faculty' || role === 'admin') && (report.status === REPORT_STATUSES.SUBMITTED || report.status === REPORT_STATUSES.UNDER_REVIEW || report.status === REPORT_STATUSES.CHANGES_REQUESTED);

              return (
                <motion.div
                  key={report.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleOpenDetails(report)}
                  className="bg-slate-900/80 hover:bg-slate-850 p-5 rounded-3xl border border-slate-800 hover:border-slate-700 shadow-xl space-y-4 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Report ID + Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {report.reportId || report.id}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusInfo.badge}`}>
                        <span>{statusInfo.icon}</span>
                        <span>{report.status}</span>
                      </span>
                    </div>

                    {/* Event Title & Club */}
                    <div>
                      <h4 className="text-base font-extrabold text-white leading-snug line-clamp-2">
                        {report.eventTitle}
                      </h4>
                      <p className="text-xs font-bold text-amber-400 mt-1">
                        {report.clubName}
                      </p>
                    </div>

                    {/* Summary Excerpt */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {report.summary || report.objective || 'Official event report.'}
                    </p>

                    {/* Meta Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar size={13} className="text-blue-400 shrink-0" />
                        <span className="truncate">{report.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{report.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Users size={13} className="text-purple-400 shrink-0" />
                        <span>{report.participantCount || 0} Participants</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText size={13} className="text-pink-400 shrink-0" />
                        <span>{report.files?.length || 0} Documents</span>
                      </div>
                    </div>

                    {/* Faculty Remarks Preview (if changes requested or approved) */}
                    {report.facultyComments && (
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-300 block mb-0.5">Faculty Feedback:</span>
                        <p className="line-clamp-2 italic">"{report.facultyComments}"</p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetails(report);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Eye size={13} />
                      <span>View Report</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {canEditThis && (
                        <button
                          type="button"
                          onClick={(e) => handleEditReport(report, e)}
                          title="Edit Report"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 cursor-pointer transition-colors"
                        >
                          <Edit size={13} />
                        </button>
                      )}

                      {canFacultyReview && (
                        <button
                          type="button"
                          onClick={(e) => handleQuickVerify(report, e)}
                          title="Quick Approve"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <Check size={13} />
                          <span>Approve</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDownloadPDF(report, e)}
                        title="Download PDF"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <Download size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDownloadZIP(report, e)}
                        title="Download ZIP Package"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <Archive size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <FileText size={40} className="text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No Event Reports Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No event reports match your current filter criteria. Try adjusting the filters or submit a new report.
            </p>
            {(role === 'core' || role === 'admin') && (
              <button
                onClick={() => {
                  setEditingReport(null);
                  setIsSubmitModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 mt-2"
              >
                <Plus size={14} />
                <span>Submit New Report</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Submit / Edit Modal */}
      <EventReportSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitReport={handleReportSave}
        activeClubId={effectiveClubId}
        activeClubName={activeClub?.name}
        editingReport={editingReport}
        user={user}
      />

      {/* Full Details & Review Modal */}
      <EventReportDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        report={selectedReport}
        userRole={role}
        user={user || facultyUser}
        onReviewSubmit={handleReviewSubmit}
        onEditReport={handleEditReport}
        onToast={onToast}
      />
    </div>
  );
};

export default EventReportsManager;
