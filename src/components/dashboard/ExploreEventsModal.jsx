import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Ticket, 
  Info,
  Award
} from 'lucide-react';

const ExploreEventsModal = ({ isOpen, onClose, clubName, events = [], onRegister }) => {
  const [registeredIds, setRegisteredIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeEventModal, setActiveEventModal] = useState(null);

  if (!isOpen) return null;

  const handleRegisterToggle = (evt) => {
    const isAlready = registeredIds.includes(evt.id);
    if (isAlready) {
      setRegisteredIds((prev) => prev.filter((id) => id !== evt.id));
      if (onRegister) onRegister(evt, false);
    } else {
      setRegisteredIds((prev) => [...prev, evt.id]);
      if (onRegister) onRegister(evt, true);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Open') return e.status === 'Registration Open';
    if (selectedCategory === 'Confirmed') return e.status === 'Confirmed';
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090E1B]/80 backdrop-blur-md"
        />

        {/* Main Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Top Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-bold shadow-inner">
                <Sparkles size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                  {clubName} Portal
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Explore Club Events
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
            {['All', 'Open', 'Confirmed'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'All' ? 'All Events' : cat === 'Open' ? 'Registration Open' : 'Upcoming & Confirmed'}
              </button>
            ))}
          </div>

          {/* Events Scrollable Content */}
          <div className="overflow-y-auto p-6 space-y-4 flex-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Calendar size={36} className="mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">No events found in this category</p>
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const isReg = registeredIds.includes(evt.id);
                return (
                  <div
                    key={evt.id}
                    className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs">
                          {evt.tag}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1">
                          <MapPin size={12} />
                          {evt.venue || 'CMRTC Main Campus'}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                        {evt.desc || `Join us for ${evt.title} at ${clubName}! Experience learning, networking, and exciting rewards.`}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                        <span className="flex items-center gap-1 text-slate-700 font-mono">
                          <Clock size={14} className="text-amber-500" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Users size={14} />
                          {evt.seats || '150/200 Registered'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setActiveEventModal(evt)}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Info size={14} />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => handleRegisterToggle(evt)}
                        className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2 ${
                          isReg
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : evt.statusColor || 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {isReg ? (
                          <>
                            <CheckCircle2 size={15} />
                            <span>Registered ✔</span>
                          </>
                        ) : (
                          <>
                            <Ticket size={15} />
                            <span>{evt.status || 'Register Now'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Award size={15} className="text-indigo-600" />
              <span>Official Event Passes Issued by {clubName}</span>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer hover:bg-black transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>

        {/* Detailed Event Info Popup Sub-Modal */}
        {activeEventModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs">
                  {activeEventModal.tag}
                </span>
                <button
                  onClick={() => setActiveEventModal(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                {activeEventModal.title}
              </h3>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <p className="flex items-center gap-2">
                  <Clock size={15} className="text-amber-500" />
                  <span className="font-bold text-slate-800">Date:</span> {activeEventModal.date}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={15} className="text-red-500" />
                  <span className="font-bold text-slate-800">Venue:</span> {activeEventModal.venue || 'CMRTC Main Auditorium'}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={15} className="text-blue-500" />
                  <span className="font-bold text-slate-800">Organized By:</span> {clubName} Core Team
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {activeEventModal.desc || `Join the official event hosted by ${clubName}. Certificates of participation and physical passes will be provided at the venue.`}
              </p>

              <button
                onClick={() => {
                  handleRegisterToggle(activeEventModal);
                  setActiveEventModal(null);
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                {registeredIds.includes(activeEventModal.id) ? 'Cancel Registration' : 'Confirm Registration'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ExploreEventsModal;
