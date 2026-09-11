import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderCheck,
  FileText,
  Users,
  Calendar,
  Building2,
  Search,
  Filter,
  Download,
  Eye,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Archive,
  RefreshCw,
  Award,
  Layers,
  GraduationCap,
  FileCheck
} from 'lucide-react';
import { getAllCampusEventsWithReportsAndAttendance, CMRTC_BRANCHES, getBranchWiseAttendanceSummary } from '../../utils/mockEventAttendance';
import { getStoredEventReports, reviewEventReport, statusBadges, REPORT_STATUSES } from '../../utils/mockEventReports';
import { downloadBranchAttendanceCSV, downloadAllCampusEventsMasterAttendanceCSV, downloadReportZIPArchive } from '../../utils/downloadManager';
import { generateOfficialEventReportPDF, generateBranchAttendancePDF, downloadQ2AttendanceSummaryPDF } from '../../utils/pdfGenerator';
import EventReportDetailsModal from './EventReportDetailsModal';
import EventBranchAttendanceModal from './EventBranchAttendanceModal';
import EventDocumentsModal from './EventDocumentsModal';

const FacultyReportsAndAttendance = ({ user, onToast = () => {} }) => {
  // Master event reports & attendance data
  const [eventsData, setEventsData] = useState(() => getAllCampusEventsWithReportsAndAttendance());
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  
  // Active Modals State
  const [activeReportModalEvent, setActiveReportModalEvent] = useState(null);
  const [activeAttendanceModalEvent, setActiveAttendanceModalEvent] = useState(null);
  const [activeDocumentsModalEvent, setActiveDocumentsModalEvent] = useState(null);
  const [activeDownloadDropdownId, setActiveDownloadDropdownId] = useState(null);

  // Refresh handler
  const handleRefresh = () => {
    setEventsData(getAllCampusEventsWithReportsAndAttendance());
    onToast('Refreshed event reports and verified attendance repository 🔄', 'info');
  };

  // Review Event Report Callback (Faculty Approvals)
  const handleReviewReport = (reportId, newStatus, comments) => {
    reviewEventReport(reportId, newStatus, comments, user?.name || 'Dr. Suresh Kumar (Faculty Coordinator)');
    setEventsData(getAllCampusEventsWithReportsAndAttendance());
  };

  // Unique list of clubs and categories for filter dropdowns
  const availableClubs = useMemo(() => {
    const clubsMap = new Map();
    eventsData.forEach(e => {
      if (e.clubId && e.clubName) {
        clubsMap.set(e.clubId, e.clubName);
      }
    });
    return Array.from(clubsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [eventsData]);

  const availableCategories = useMemo(() => {
    const set = new Set();
    eventsData.forEach(e => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set);
  }, [eventsData]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsData.filter(evt => {
      // 1. Text search (Title, Venue, Club, Description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title?.toLowerCase().includes(q);
        const matchClub = evt.clubName?.toLowerCase().includes(q);
        const matchVenue = evt.venue?.toLowerCase().includes(q);
        const matchDesc = evt.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchClub && !matchVenue && !matchDesc) return false;
      }

      // 2. Club filter
      if (selectedClub !== 'ALL' && evt.clubId !== selectedClub) return false;

      // 3. Category filter
      if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;

      // 4. Academic Year filter
      if (selectedAcademicYear !== 'ALL') {
        const year = evt.report?.academicYear || '2025-2026';
        if (year !== selectedAcademicYear) return false;
      }

      // 5. Date filter
      if (selectedDate && evt.date !== selectedDate) return false;

      // 6. Branch filter
      if (selectedBranch !== 'ALL') {
        const hasBranchAttendance = evt.branchBreakdown?.some(b => b.branch === selectedBranch && b.count > 0);
        if (!hasBranchAttendance) return false;
      }

      return true;
    });
  }, [eventsData, searchQuery, selectedClub, selectedCategory, selectedAcademicYear, selectedDate, selectedBranch]);

  // Overall Top Statistics
  const stats = useMemo(() => {
    const totalEvents = eventsData.length;
    const reportsAvailable = eventsData.filter(e => e.hasReport).length;
    const totalAttendance = eventsData.reduce((sum, e) => sum + (e.totalAttendance || 0), 0);
    const totalClubs = new Set(eventsData.map(e => e.clubId)).size;
    const verifiedReports = eventsData.filter(e => e.report?.status === REPORT_STATUSES.VERIFIED).length;

    return {
      totalEvents,
      reportsAvailable,
      totalAttendance,
      totalClubs,
      verifiedReports
    };
  }, [eventsData]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedClub('ALL');
    setSelectedCategory('ALL');
    setSelectedAcademicYear('ALL');
    setSelectedDate('');
    setSelectedBranch('ALL');
    onToast('Reset all filters', 'info');
  };

  // Export Master Attendance CSV
  const handleExportAllAttendance = () => {
    onToast('Compiling and downloading Master Attendance CSV for all events... 📊', 'info');
    const res = downloadAllCampusEventsMasterAttendanceCSV(eventsData);
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
  };

  // Export Institutional PDF Summary
  const handleExportInstitutionalPDF = () => {
    onToast('Generating Institutional Q2 Attendance Audit PDF... 📄', 'info');
    const res = downloadQ2AttendanceSummaryPDF();
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
  };

  // Individual Event Direct Downloads
  const handleDownloadPDFReport = (evt) => {
    onToast(`Generating official PDF report for "${evt.title}"... 📄`, 'info');
    const reportObj = evt.report || {
      eventTitle: evt.title,
      clubName: evt.clubName,
      eventDate: evt.date,
      venue: evt.venue,
      participantCount: evt.totalAttendance,
      summary: evt.description,
      status: evt.reportStatus
    };
    const res = generateOfficialEventReportPDF(reportObj);
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
    setActiveDownloadDropdownId(null);
  };

  const handleDownloadEventAttendanceCSV = (evt) => {
    onToast(`Exporting attendance CSV for "${evt.title}"... 📊`, 'info');
    const summary = getBranchWiseAttendanceSummary(evt.id, evt);
    const res = downloadBranchAttendanceCSV(evt, 'ALL BRANCHES', summary.records);
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
    setActiveDownloadDropdownId(null);
  };

  const handleDownloadEventAttendancePDF = (evt) => {
    onToast(`Generating attendance PDF for "${evt.title}"... 📄`, 'info');
    const summary = getBranchWiseAttendanceSummary(evt.id, evt);
    const res = generateBranchAttendancePDF(evt, 'ALL BRANCHES', summary.records);
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
    setActiveDownloadDropdownId(null);
  };

  const handleDownloadEventZIP = async (evt) => {
    onToast(`Packaging event documents and media for "${evt.title}" into ZIP... 📦`, 'info');
    const reportObj = evt.report || {
      eventTitle: evt.title,
      clubName: evt.clubName,
      eventDate: evt.date,
      venue: evt.venue
    };
    const res = await downloadReportZIPArchive(reportObj);
    if (res.success) {
      onToast(`Downloaded: ${res.filename} 🎉`, 'success');
    }
    setActiveDownloadDropdownId(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Module Banner Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-900 p-6 rounded-[28px] border border-blue-500/20 backdrop-blur-xl shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-[11px] uppercase tracking-wider border border-blue-500/30 flex items-center gap-1.5">
              <FolderCheck size={14} />
              <span>Faculty Academic & Administrative Audit Module</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              CMR Technical Campus
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Event Reports & Attendance Management
          </h2>

          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Centralized institutional repository for faculty coordinators to inspect campus post-event reports, verify branch-wise student attendance registers, review administrative documents, and audit accreditation compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
          <button
            onClick={handleExportAllAttendance}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <FileSpreadsheet size={15} />
            <span>Download All Attendance</span>
          </button>

          <button
            onClick={handleExportInstitutionalPDF}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS (4 KPIs Required) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Events */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Total Events</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalEvents}</span>
            <span className="text-xs text-blue-400 font-bold">Organized</span>
          </div>
          <p className="text-[11px] text-slate-500">Across all academic semesters</p>
        </div>

        {/* 2. Reports Available */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Reports Available</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileText size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{stats.reportsAvailable}</span>
            <span className="text-xs text-slate-400 font-bold">/ {stats.totalEvents} Events</span>
          </div>
          <p className="text-[11px] text-slate-500">{stats.verifiedReports} officially approved & verified</p>
        </div>

        {/* 3. Total Attendance */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Total Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{stats.totalAttendance.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-bold">Students</span>
          </div>
          <p className="text-[11px] text-slate-500">100% verified via QR check-ins</p>
        </div>

        {/* 4. Total Clubs */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Total Clubs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Building2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-400">{stats.totalClubs}</span>
            <span className="text-xs text-purple-400 font-bold">Monitored</span>
          </div>
          <p className="text-[11px] text-slate-500">Tech, Cultural, NCC, NSS & Sports</p>
        </div>
      </div>

      {/* WORKING FILTERS BAR */}
      <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Interactive Filters & Search</h3>
            <span className="text-[11px] text-slate-400 font-semibold">
              Showing {filteredEvents.length} of {eventsData.length} events
            </span>
          </div>

          {(searchQuery || selectedClub !== 'ALL' || selectedCategory !== 'ALL' || selectedAcademicYear !== 'ALL' || selectedDate || selectedBranch !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Filter 1: Search Event */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Search size={11} />
              <span>Search Event / Venue</span>
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event name, club, room..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Filter 2: Club */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Club</label>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs outline-none focus:border-amber-400 cursor-pointer font-medium"
            >
              <option value="ALL">🌟 All Clubs</option>
              {availableClubs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Filter 3: Event Category */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Event Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs outline-none focus:border-amber-400 cursor-pointer font-medium"
            >
              <option value="ALL">🎯 All Categories</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filter 4: Academic Year */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Academic Year</label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs outline-none focus:border-amber-400 cursor-pointer font-medium"
            >
              <option value="ALL">🎓 All Years</option>
              <option value="2025-2026">2025-2026 (Current)</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>

          {/* Filter 5: Date */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs outline-none focus:border-amber-400 cursor-pointer font-medium"
            />
          </div>
        </div>

        {/* Filter 6: Branch Selector Pills */}
        <div className="pt-2 border-t border-slate-800/60 space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <GraduationCap size={12} className="text-blue-400" />
            <span>Filter by Target Department / Branch:</span>
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
            {['ALL', ...CMRTC_BRANCHES].map(br => (
              <button
                key={br}
                onClick={() => setSelectedBranch(br)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs ${
                  selectedBranch === br
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {br === 'ALL' ? '🌐 All Branches' : br}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EVENTS TABLE & CARDS SECTION */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FolderCheck size={18} className="text-blue-400" />
              <span>Campus Events, Reports & Attendance Register</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select an event to inspect official summary reports, branch breakdown, documents, or export attendance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllAttendance}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <FileSpreadsheet size={13} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportInstitutionalPDF}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <FileText size={13} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Search size={24} />
            </div>
            <h4 className="text-base font-bold text-white">No campus events match your filters</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your search terms, club selection, branch filter, or academic year.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Events List Grid / Cards */
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const statusInfo = statusBadges[event.reportStatus] || statusBadges['Submitted'] || {
                label: event.reportStatus,
                icon: '⏳',
                badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              };

              const isDownloadOpen = activeDownloadDropdownId === event.id;

              return (
                <div
                  key={event.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
                >
                  {/* Event Main Header Row */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Event Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Club Badge */}
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {event.clubName}
                        </span>

                        {/* Category Badge */}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {event.category || 'Major Event'}
                        </span>

                        {/* Report Status Badge */}
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusInfo.badge}`}>
                          <span>{statusInfo.icon}</span>
                          <span>{event.reportStatus}</span>
                        </span>

                        <span className="text-[11px] text-slate-500 font-mono">
                          AY {event.report?.academicYear || '2025-2026'}
                        </span>
                      </div>

                      {/* Event Name */}
                      <h4 className="text-lg font-black text-white leading-snug hover:text-blue-400 transition-colors">
                        {event.title}
                      </h4>

                      {/* Key Meta Grid: Date, Venue, Participants, Docs, Photos */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-amber-400 shrink-0" />
                          <span className="truncate">{event.date}</span>
                        </div>

                        <div className="flex items-center gap-1.5" title={event.venue}>
                          <Building2 size={14} className="text-purple-400 shrink-0" />
                          <span className="truncate">{event.venue || 'CMRTC Campus'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-emerald-400 shrink-0" />
                          <span>
                            <strong className="text-emerald-400 font-bold">{event.totalAttendance}</strong> Participants
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700 flex items-center gap-1">
                            <FileCheck size={11} className="text-blue-400" />
                            <span>{event.documentsCount || 4} Docs</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700 flex items-center gap-1">
                            <ImageIcon size={11} className="text-pink-400" />
                            <span>{event.photosCount || 6} Photos</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Branch Participation Mini Breakdown */}
                    <div className="lg:w-72 p-3 rounded-xl bg-slate-900 border border-slate-800/80 shrink-0 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                        <span>Branch Turnout</span>
                        <span className="text-emerald-400 font-mono font-bold">{event.totalAttendance} Total</span>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-wrap">
                        {event.branchBreakdown?.slice(0, 5).map(b => (
                          <span 
                            key={b.branch} 
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700"
                            title={`${b.count} students (${b.percentage}%)`}
                          >
                            <strong className="text-white">{b.branch}:</strong> <span className="text-emerald-400 font-mono">{b.count}</span>
                          </span>
                        ))}
                        {(event.branchBreakdown?.length || 0) > 5 && (
                          <span className="text-[10px] text-slate-500 font-bold">
                            +{(event.branchBreakdown.length - 5)} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar (All 4 requested actions) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Action 1: View Event Report */}
                      <button
                        onClick={() => setActiveReportModalEvent(event.report || {
                          id: `rep-${event.id}`,
                          reportId: `CMRTC-ER-${event.id}`,
                          eventId: event.id,
                          eventTitle: event.title,
                          clubName: event.clubName,
                          eventDate: event.date,
                          venue: event.venue,
                          participantCount: event.totalAttendance,
                          summary: event.description,
                          status: event.reportStatus,
                          files: []
                        })}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <FileText size={14} />
                        <span>View Event Report</span>
                      </button>

                      {/* Action 2: View Attendance (Branch-Wise) */}
                      <button
                        onClick={() => setActiveAttendanceModalEvent(event)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <Users size={14} />
                        <span>View Attendance</span>
                      </button>

                      {/* Action 3: View Documents */}
                      <button
                        onClick={() => setActiveDocumentsModalEvent(event)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <FileCheck size={14} />
                        <span>View Documents</span>
                      </button>
                    </div>

                    {/* Action 4: Download Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDownloadDropdownId(isDownloadOpen ? null : event.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors"
                      >
                        <Download size={14} className="text-amber-400" />
                        <span>Download</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDownloadOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isDownloadOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 bottom-full mb-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-30 space-y-1"
                          >
                            <button
                              onClick={() => handleDownloadPDFReport(event)}
                              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-blue-600 flex items-center gap-2 cursor-pointer transition-colors text-left"
                            >
                              <FileText size={14} className="text-blue-400" />
                              <span>Download PDF Report</span>
                            </button>

                            <button
                              onClick={() => handleDownloadEventAttendanceCSV(event)}
                              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-emerald-600 flex items-center gap-2 cursor-pointer transition-colors text-left"
                            >
                              <FileSpreadsheet size={14} className="text-emerald-400" />
                              <span>Download Attendance (CSV)</span>
                            </button>

                            <button
                              onClick={() => handleDownloadEventAttendancePDF(event)}
                              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-blue-600 flex items-center gap-2 cursor-pointer transition-colors text-left"
                            >
                              <Download size={14} className="text-blue-400" />
                              <span>Download Attendance (PDF)</span>
                            </button>

                            <button
                              onClick={() => handleDownloadEventZIP(event)}
                              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-purple-600 flex items-center gap-2 cursor-pointer transition-colors text-left"
                            >
                              <Archive size={14} className="text-purple-400" />
                              <span>Download All Files (.zip)</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW EVENT REPORT DETAILS */}
      {activeReportModalEvent && (
        <EventReportDetailsModal
          isOpen={!!activeReportModalEvent}
          onClose={() => setActiveReportModalEvent(null)}
          report={activeReportModalEvent}
          userRole="faculty"
          user={user}
          onReviewSubmit={handleReviewReport}
          onToast={onToast}
        />
      )}

      {/* MODAL 2: VIEW BRANCH-WISE ATTENDANCE */}
      {activeAttendanceModalEvent && (
        <EventBranchAttendanceModal
          isOpen={!!activeAttendanceModalEvent}
          onClose={() => setActiveAttendanceModalEvent(null)}
          event={activeAttendanceModalEvent}
          onToast={onToast}
        />
      )}

      {/* MODAL 3: VIEW DOCUMENTS */}
      {activeDocumentsModalEvent && (
        <EventDocumentsModal
          isOpen={!!activeDocumentsModalEvent}
          onClose={() => setActiveDocumentsModalEvent(null)}
          event={activeDocumentsModalEvent}
          report={activeDocumentsModalEvent.report}
          onToast={onToast}
        />
      )}
    </div>
  );
};

export default FacultyReportsAndAttendance;
