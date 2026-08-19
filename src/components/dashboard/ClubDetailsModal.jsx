import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Users, BookOpen, Target, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clubLogoSvgs } from './ClubCard';
import JoinButton from './JoinButton';

const ClubDetailsModal = ({ 
  club, 
  isOpen, 
  onClose, 
  isJoined, 
  onJoinToggle, 
  isJoining 
}) => {
  const { user, isCoordinator } = useAuth();
  const isCoreTeam = Boolean(user && (user.role === 'core' || user.role === 'admin' || user.role === 'faculty' || isCoordinator));
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!club) return null;

  const logoSvg = clubLogoSvgs[club.id] || <BookOpen />;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl p-2 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-6 sm:p-8 flex flex-col gap-6">
              {/* Header: Logo, Name, Badges */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center p-2.5 shadow-xs border border-slate-200 shrink-0">
                  {logoSvg}
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600">
                    {club.category} CLUB · CMRTC
                  </span>
                  <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {club.name}
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-normal">{club.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <div className="text-left flex flex-col gap-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">About the Club</h4>
                <p className="text-slate-700 text-sm leading-relaxed font-normal">
                  {club.description}
                </p>
              </div>

              {/* Vision & Mission Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
                    <Target size={14} className="text-blue-600" />
                    <span>Vision</span>
                  </h4>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    To build an empowering campus ecosystem where students develop industry-leading technical skills, artistic excellence, and leadership values.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase text-sky-700 tracking-wider flex items-center gap-1.5">
                    <Compass size={14} className="text-sky-600" />
                    <span>Mission</span>
                  </h4>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Organize regular workshops, hackathons, cultural festivals, and community service projects that foster collaboration and career readiness.
                  </p>
                </div>
              </div>

              {/* Coordinator Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left border-y border-slate-200 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Faculty Coord.</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{club.facultyCoordinator}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Student Lead</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{club.studentLead}</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="text-left flex flex-col gap-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Events</h4>
                <div className="flex flex-col gap-2">
                  {club.events && club.events.map((evt) => (
                    <div 
                      key={evt.id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">{evt.title}</span>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-blue-600 font-semibold">
                        <Calendar size={13} />
                        <span>{evt.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Member stats & Quota status */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
                  <Users size={15} className="text-blue-600" />
                  <span>
                    {isCoreTeam 
                      ? `${Math.min(50, club.membersCount + (isJoined ? 1 : 0))}/50 Members Enrolled`
                      : `${club.membersCount || 0}+ Active Members`}
                  </span>
                </div>
                {isCoreTeam && (
                  club.membersCount >= 50 ? (
                    <span className="text-[11px] font-bold text-rose-600 font-mono">
                      ⚠️ 50-Member Quota Full · Registrations Closed
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">
                      ✅ {50 - club.membersCount} spots remaining before quota closes
                    </span>
                  )
                )}
              </div>

              {/* Join CTA */}
              <div className="w-full sm:w-[220px]">
                <JoinButton
                  category={club.category}
                  isJoined={isJoined}
                  isLoading={isJoining}
                  isFull={isCoreTeam ? club.membersCount >= 50 : false}
                  onClick={onJoinToggle}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClubDetailsModal;

