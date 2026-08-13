import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Download, CheckCircle2, UserX, Users, BarChart3, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { getAttendanceMetrics, getStoredAttendanceRecords } from '../../utils/mockQRAttendance';

const EventQRGeneratorModal = ({ isOpen, onClose, event, onToast }) => {
  const [metrics, setMetrics] = useState(() => (event?.id ? getAttendanceMetrics(event.id) : { totalRegistrations: 0, checkedIn: 0, absentCount: 0, attendanceRate: 0, records: [] }));

  useEffect(() => {
    if (event?.id) {
      setMetrics(getAttendanceMetrics(event.id));
    }
  }, [event?.id]);

  if (!isOpen || !event) return null;

  const handleDownloadQR = () => {
    if (onToast) onToast(`📄 Exported high-resolution QR Pass PNG for "${event.title}"!`, 'success');
  };

  const refreshData = () => {
    if (event?.id) {
      setMetrics(getAttendanceMetrics(event.id));
      if (onToast) onToast('🔄 Attendance roster updated!', 'info');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden text-slate-100 select-none"
        >
          {/* Top Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-pink-400" />
              <span className="font-black text-sm tracking-wide text-white">
                Core Team Event QR Code & Attendance Monitor
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Grid Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Interactive QR Code Pass */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 text-center">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[10px] uppercase tracking-wider border border-pink-500/30">
                    Official Event QR Pass
                  </span>
                  <h4 className="text-base font-extrabold text-white line-clamp-1">{event.title}</h4>
                </div>

                {/* Styled QR Code Box */}
                <div className="w-48 h-48 bg-white p-3 rounded-2xl border-4 border-pink-500/40 shadow-2xl relative flex items-center justify-center">
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                    {/* SVG QR Matrix Simulation Patterns */}
                    <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                    {/* Random Matrix Modules */}
                    <rect x="35" y="5" width="10" height="10" />
                    <rect x="50" y="15" width="10" height="10" />
                    <rect x="35" y="35" width="30" height="30" rx="3" />
                    <rect x="75" y="45" width="15" height="15" />
                    <rect x="15" y="40" width="10" height="20" />
                    <rect x="70" y="70" width="20" height="20" />
                    <rect x="45" y="75" width="15" height="15" />
                  </svg>
                  {/* Center Brand Icon */}
                  <div className="absolute w-10 h-10 rounded-xl bg-slate-900 border-2 border-white flex items-center justify-center text-pink-400 font-black text-[10px] shadow-md">
                    CMRTC
                  </div>
                </div>

                <p className="text-[10px] font-mono text-slate-400 break-all bg-slate-900 p-2 rounded-xl border border-slate-800 max-w-full">
                  {metrics.payload}
                </p>

                <button
                  onClick={handleDownloadQR}
                  className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Download size={14} />
                  <span>Download QR Pass Image</span>
                </button>
              </div>

              {/* Right Column: Attendance Metrics & Roster Lists */}
              <div className="md:col-span-7 space-y-4">
                {/* Gauge Stat Bar */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <BarChart3 size={15} className="text-pink-400" />
                      <span>Live Attendance Gauge</span>
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {metrics.percentage}% Present
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700 p-0.5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                      style={{ width: `${metrics.percentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase font-extrabold">Total</p>
                      <p className="text-sm font-black text-white">{metrics.total}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-[10px] text-emerald-400 uppercase font-extrabold">Present</p>
                      <p className="text-sm font-black text-emerald-400">{metrics.presentCount}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-[10px] text-red-400 uppercase font-extrabold">Absent</p>
                      <p className="text-sm font-black text-red-400">{metrics.absentCount}</p>
                    </div>
                  </div>
                </div>

                {/* Present Students Roster List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>Present Students ({metrics.presentList.length})</span>
                    </h5>
                    <button
                      onClick={refreshData}
                      className="text-[11px] font-bold text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {metrics.presentList.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                        No students have scanned QR attendance yet.
                      </p>
                    ) : (
                      metrics.presentList.map((st, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-extrabold text-white">{st.name} </span>
                            <span className="font-mono font-bold text-pink-300">({st.rollNo})</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            ✓ {st.scannedAt}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Absent Students List */}
                {metrics.absentList.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-extrabold text-slate-400 flex items-center gap-1.5">
                      <UserX size={14} className="text-red-400" />
                      <span>Absent Students ({metrics.absentList.length})</span>
                    </h5>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {metrics.absentList.map((st, i) => (
                        <div key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                          <span>{st.name} ({st.rollNo})</span>
                          <span className="text-[10px] font-extrabold text-red-400">Absent ❌</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <ShieldCheck size={14} className="text-pink-400" />
              <span>UniSphere QR Attendance Engine Active</span>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
            >
              Close Monitor
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventQRGeneratorModal;
