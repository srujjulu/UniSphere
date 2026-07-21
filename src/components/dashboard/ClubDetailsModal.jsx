import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Users, BookOpen } from 'lucide-react';
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
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!club) return null;

  const logoSvg = clubLogoSvgs[club.id] || <BookOpen />;

  // Gallery items mock colors per category
  const galleryColors = {
    Cultural: ['bg-red-500/10 border-red-500/20', 'bg-rose-500/10 border-rose-500/20', 'bg-pink-500/10 border-pink-500/20'],
    Technical: ['bg-[#FF8A2A]/10 border-[#FF8A2A]/20', 'bg-amber-500/10 border-amber-500/20', 'bg-yellow-500/10 border-yellow-500/20'],
    Photography: ['bg-violet-500/10 border-violet-500/20', 'bg-purple-500/10 border-purple-500/20', 'bg-fuchsia-500/10 border-fuchsia-500/20'],
    Literary: ['bg-emerald-500/10 border-emerald-500/20', 'bg-green-500/10 border-green-500/20', 'bg-teal-500/10 border-teal-500/20'],
    Defence: ['bg-[#4F8BFF]/10 border-[#4F8BFF]/20', 'bg-blue-500/10 border-blue-500/20', 'bg-indigo-500/10 border-indigo-500/20'],
    Service: ['bg-red-500/10 border-red-500/20', 'bg-blue-900/10 border-blue-900/20', 'bg-red-600/10 border-red-600/20'],
  };

  const currentGalleryColors = galleryColors[club.category] || galleryColors.Technical;

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
            className="absolute inset-0 bg-[#090E1B]/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl bg-[#171E2F] border border-white/10 rounded-[28px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-10 flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2.5 transition-colors cursor-pointer focus:outline-none focus-ring"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-8 flex flex-col gap-6 md:gap-8">
              {/* Header: Logo, Name, Badges */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex-shrink-0"
                >
                  {logoSvg}
                </motion.div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <span className="text-xs font-bold tracking-[1.5px] uppercase text-[#FF8A2A] font-sans">
                    {club.category} CLUB
                  </span>
                  <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {club.name}
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">{club.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <div className="text-left flex flex-col gap-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">About the Club</h4>
                <p className="text-slate-300 text-[15px] leading-[1.65] font-normal">
                  {club.description}
                </p>
              </div>

              {/* Coordinator Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border-y border-white/5 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/5 text-slate-300">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Faculty Coord.</span>
                    <span className="text-sm font-bold text-slate-200">{club.facultyCoordinator}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/5 text-slate-300">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Student Lead</span>
                    <span className="text-sm font-bold text-slate-200">{club.studentLead}</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="text-left flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Upcoming Events</h4>
                <div className="flex flex-col gap-3">
                  {club.events.map((evt) => (
                    <div 
                      key={evt.id} 
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/4 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <span className="text-sm font-semibold text-white">{evt.title}</span>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#FF8A2A] font-bold">
                        <Calendar size={14} />
                        <span>{evt.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Preview */}
              <div className="text-left flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Gallery Preview</h4>
                <div className="grid grid-cols-3 gap-3">
                  {currentGalleryColors.map((colorClass, idx) => (
                    <div 
                      key={idx}
                      className={`h-24 rounded-2xl border flex items-center justify-center text-xs font-semibold text-slate-400 ${colorClass}`}
                    >
                      <span>Photo {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-6 bg-[#090E1B]/50 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Member stats */}
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Users size={16} />
                <span>{club.membersCount + (isJoined ? 1 : 0)} active members</span>
              </div>

              {/* Join CTA */}
              <div className="w-full sm:w-[200px]">
                <JoinButton
                  category={club.category}
                  isJoined={isJoined}
                  isLoading={isJoining}
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
