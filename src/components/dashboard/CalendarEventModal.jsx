import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, Award, CheckCircle2, TicketCheck, Sparkles, Share2, QrCode, Star } from 'lucide-react';
import { clubColors } from '../../utils/mockCalendarEvents';
import StudentQRScannerModal from './StudentQRScannerModal';
import EventFeedbackModal from './EventFeedbackModal';
import { 
  AkritiLogo,
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  DesignClubLogo,
  NssLogo 
} from '../../utils/clubLogos';

const getClubLogoSvg = (clubId) => {
  switch (clubId) {
    case 'akriti': return <AkritiLogo />;
    case 'codeholics': return <CodeClubLogo />;
    case 'photography': return <PhotoClubLogo />;
    case 'lexis': return <EcoClubLogo />;
    case 'ncc': return <DesignClubLogo />;
    case 'nss': return <NssLogo />;
    default: return <CodeClubLogo />;
  }
};

const CalendarEventModal = ({ 
  isOpen, 
  onClose, 
  event, 
  studentRoll = '237R1A05BA', 
  onToggleRegister,
  onToast 
}) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  if (!isOpen || !event) return null;

  const colorTheme = clubColors[event.clubId] || clubColors.codeholics;
  const isRegistered = event.registeredStudents?.includes(studentRoll);
  const isHoliday = event.category === 'Holiday' || event.clubId === 'holiday';

  const handleRegistrationClick = () => {
    if (isHoliday) {
      if (onToast) onToast('Campus Holiday event. No registration required.', 'info');
      return;
    }
    if (onToggleRegister) {
      onToggleRegister(event.id);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden text-slate-100 select-none"
          >
            {/* Top Banner Header */}
            <div className={`p-6 sm:p-8 bg-slate-950/80 border-b border-slate-800 relative overflow-hidden`}>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${colorTheme.badge}`}>
                    {event.clubName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-extrabold text-[10px] uppercase border border-slate-700">
                    {event.category}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Event Name */}
              <div className="mt-4 space-y-1 relative z-10">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {event.title}
                </h2>
              </div>
            </div>

            {/* Modal Details Grid Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Event Date</p>
                    <p className="text-xs font-mono font-bold text-white mt-0.5">{event.date}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Timing</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{event.time}</p>
                  </div>
                </div>

                {/* Venue */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Campus Venue</p>
                    <p className="text-xs font-extrabold text-white mt-0.5">{event.venue}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
                  {event.description}
                </div>
              )}

              {/* Registration Status & QR Scan Banner */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Current Status</p>
                    <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      {isHoliday ? (
                        <span className="text-slate-400 font-bold">Campus Holiday 🏖️</span>
                      ) : isRegistered ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Registered Member Pass Active
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">Registration Open • {event.seats}</span>
                      )}
                    </p>
                  </div>

                  {!isHoliday && (
                    <button
                      onClick={handleRegistrationClick}
                      className={`px-4 py-2 rounded-xl font-extrabold text-xs tracking-wider uppercase cursor-pointer shadow-lg transition-all active:scale-95 flex items-center gap-1.5 ${
                        isRegistered 
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40' 
                          : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <X size={14} />
                          <span>Cancel Pass</span>
                        </>
                      ) : (
                        <>
                          <TicketCheck size={14} />
                          <span>Register Now</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Scan QR Attendance & Feedback Action for Registered Student */}
                {isRegistered && !isHoliday && (
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={() => setIsScannerOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <QrCode size={15} />
                      <span>Scan QR Attendance</span>
                    </button>

                    <button
                      onClick={() => setIsFeedbackOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span>Rate Event & Feedback ⭐</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => onToast && onToast(`Shared event link for "${event.title}" 🔗`, 'info')}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 size={14} />
                <span>Share Event</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Student QR Attendance Scanner Modal */}
      <StudentQRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        event={event}
        studentRoll={studentRoll}
        onToast={onToast}
      />

      {/* Student Event Feedback Modal */}
      <EventFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        event={event}
        studentRoll={studentRoll}
        onToast={onToast}
      />
    </>
  );
};

export default CalendarEventModal;
