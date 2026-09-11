import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Users, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  GraduationCap,
  Sparkles,
  Layers
} from 'lucide-react';
import { getBranchWiseAttendanceSummary, CMRTC_BRANCHES } from '../../utils/mockEventAttendance';
import { downloadBranchAttendanceCSV } from '../../utils/downloadManager';
import { generateBranchAttendancePDF } from '../../utils/pdfGenerator';

const EventBranchAttendanceModal = ({
  isOpen,
  onClose,
  event,
  onToast = () => {}
}) => {
  const [selectedBranchTab, setSelectedBranchTab] = useState('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  if (!isOpen || !event) return null;

  const attendanceData = getBranchWiseAttendanceSummary(event.id, {
    title: event.title,
    clubName: event.clubName,
    date: event.date,
    participants: event.participantCount || event.registeredCount || 120
  });

  const { totalStudents, branchBreakdown, records } = attendanceData;

  // Filter student records by branch & search query
  const filteredStudents = records.filter(s => {
    if (selectedBranchTab !== 'ALL' && s.branch !== selectedBranchTab) return false;
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      const matchName = s.studentName?.toLowerCase().includes(q);
      const matchRoll = s.rollNumber?.toLowerCase().includes(q);
      if (!matchName && !matchRoll) return false;
    }
    return true;
  });

  // Handlers for CSV & PDF
  const handleDownloadCSV = (branchName) => {
    onToast(`Generating ${branchName} attendance CSV for "${event.title}"... 📊`, 'info');
    const res = downloadBranchAttendanceCSV(event, branchName, records);
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
    }
  };

  const handleDownloadPDF = (branchName) => {
    onToast(`Generating ${branchName} official attendance PDF for "${event.title}"... 📄`, 'info');
    const res = generateBranchAttendancePDF(event, branchName, records);
    if (res.success) {
      setTimeout(() => onToast(`Downloaded: ${res.filename} 🎉`, 'success'), 300);
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
        <div className="p-6 border-b border-slate-800 bg-slate-950/70 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Institutional Attendance Repository
              </span>
              <span className="text-xs text-slate-400 font-semibold">{event.clubName}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {event.title} – Branch-Wise Attendance
            </h3>

            <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
              <span>{event.date}</span>
              <span>•</span>
              <span>{event.venue || 'CMRTC Campus'}</span>
              <span>•</span>
              <strong className="text-emerald-400 font-bold">{totalStudents} Total Students Attended</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              onClick={() => handleDownloadCSV('ALL BRANCHES')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <FileSpreadsheet size={14} />
              <span>Download All (CSV)</span>
            </button>

            <button
              onClick={() => handleDownloadPDF('ALL BRANCHES')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <FileText size={14} />
              <span>Download All (PDF)</span>
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
          {/* SECTION 1: BRANCH-WISE SUMMARY TABLE */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                <Users size={15} />
                <span>Department / Branch Attendance Summary</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-semibold">
                Verified via QR Check-in System
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Academic Branch</th>
                    <th className="py-3 px-4">Students Attended</th>
                    <th className="py-3 px-4">Participation Share</th>
                    <th className="py-3 px-4 text-right">Branch Downloads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-medium">
                  {branchBreakdown.map((b) => (
                    <tr key={b.branch} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-white">{b.branch}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-emerald-400 text-sm">{b.count}</span>
                        <span className="text-slate-400 text-[10px] ml-1">students</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full" 
                              style={{ width: `${b.percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-slate-300">{b.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadCSV(b.branch)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileSpreadsheet size={12} />
                            <span>CSV</span>
                          </button>

                          <button
                            onClick={() => handleDownloadPDF(b.branch)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileText size={12} />
                            <span>PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* All Branches Grand Total Row */}
                  <tr className="bg-slate-950 font-bold text-white border-t-2 border-slate-700">
                    <td className="py-3 px-4 uppercase text-[11px]">ALL BRANCHES (Grand Total)</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-400 font-extrabold text-sm">{totalStudents}</span>
                      <span className="text-slate-400 text-[10px] ml-1">students</span>
                    </td>
                    <td className="py-3 px-4 font-mono">100.0%</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownloadCSV('ALL BRANCHES')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} />
                          <span>Download All CSV</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPDF('ALL BRANCHES')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} />
                          <span>Download All PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: INTERACTIVE STUDENT ATTENDANCE ROSTER */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>Student Attendance Roster ({filteredStudents.length})</span>
                </h4>
                <p className="text-[11px] text-slate-400">Search and filter individual student check-in timestamps.</p>
              </div>

              {/* Student Search */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student or roll no..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Branch Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
              {['ALL', ...CMRTC_BRANCHES].map(br => (
                <button
                  key={br}
                  onClick={() => setSelectedBranchTab(br)}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedBranchTab === br
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {br}
                </button>
              ))}
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto max-h-72 rounded-xl border border-slate-800 custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-300 font-extrabold uppercase text-[10px] tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3">S.No</th>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Branch</th>
                    <th className="py-2.5 px-3">Sec</th>
                    <th className="py-2.5 px-3">Check-in Time</th>
                    <th className="py-2.5 px-3">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-medium">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st, i) => (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 text-slate-400">{i + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-amber-300">{st.rollNumber}</td>
                        <td className="py-2 px-3 text-white font-semibold">{st.studentName}</td>
                        <td className="py-2 px-3 text-blue-300 font-bold">{st.branch}</td>
                        <td className="py-2 px-3 text-slate-400">{st.section}</td>
                        <td className="py-2 px-3 text-slate-300 font-mono text-[11px]">{st.checkInTime}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30 inline-flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            <span>QR Verified</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No students found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadCSV('ALL BRANCHES')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download size={13} />
              <span>Export All Branches CSV</span>
            </button>
            <button
              onClick={() => handleDownloadPDF('ALL BRANCHES')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download size={13} />
              <span>Export All Branches PDF</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventBranchAttendanceModal;
