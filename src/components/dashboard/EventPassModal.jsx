import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, TicketCheck, Calendar, MapPin, Clock, User, QrCode, ShieldCheck } from 'lucide-react';
import { downloadEventPassPDF } from '../../utils/pdfGenerator';

const EventPassModal = ({ isOpen, onClose, event, studentUser, onToast }) => {
  if (!isOpen || !event) return null;

  const studentName = studentUser?.name || 'Student Member';
  const studentRoll = studentUser?.rollNumber || studentUser?.rollNo || '237R1A05BA';
  const passId = `PASS-${studentRoll}-${event.id || 'EVT'}`;

  const handleDownload = () => {
    if (onToast) {
      onToast(`📄 Generating Official Entry Pass PDF for ${event.title}...`, 'info');
    }
    const result = downloadEventPassPDF(event, studentUser);
    if (result.success && onToast) {
      setTimeout(() => {
        onToast(`🎉 Pass downloaded: ${result.filename}`, 'success');
      }, 500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden text-slate-100 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <TicketCheck size={20} className="text-blue-400" />
              <span className="font-extrabold text-sm tracking-wide text-white">
                Official Campus Event Entry Pass
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Pass Card Container */}
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-b from-blue-950/60 to-slate-950 rounded-2xl border border-blue-500/30 p-6 space-y-5 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Institution Header */}
              <div className="space-y-1 border-b border-slate-800/80 pb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  CMR Technical Campus • Hyderabad
                </p>
                <h3 className="text-lg font-black text-white leading-tight">
                  {event.title}
                </h3>
                <p className="text-xs font-bold text-blue-400">{event.clubName || 'CMRTC Club'}</p>
              </div>

              {/* Attendee Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-left bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-extrabold">Student Name</p>
                  <p className="font-bold text-white truncate">{studentName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-extrabold">Roll Number</p>
                  <p className="font-mono font-bold text-amber-400">{studentRoll}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-extrabold">Date & Time</p>
                  <p className="font-semibold text-slate-200">{event.date || 'August 2026'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-extrabold">Campus Venue</p>
                  <p className="font-semibold text-slate-200 truncate">{event.venue || 'CMRTC Auditorium'}</p>
                </div>
              </div>

              {/* Pass QR & Verification Code */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-md mx-auto">
                <div className="w-32 h-32 bg-slate-950 rounded-xl flex flex-col items-center justify-center p-2 text-center text-white space-y-1 font-mono text-[9px]">
                  <QrCode size={48} className="text-blue-400 mx-auto" />
                  <p className="font-black text-amber-400 text-[10px]">SCAN AT ENTRY</p>
                  <p className="text-slate-400 truncate w-28">{studentRoll}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold text-slate-400">Pass Code: {passId}</p>
                <p className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Authenticated Event Registration Pass</span>
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Download size={14} />
              <span>Download Ticket PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventPassModal;
