import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Film, MapPin, Calendar, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const defaultPhotoEvents = [
  {
    id: 'p1',
    title: 'Insta-Walk Photowalk 2026',
    subtitle: 'Guided Outdoor Street Photography',
    dates: 'November 10, 2026',
    location: 'Old City & Charminar, Hyderabad',
    gearReq: 'DSLR, Mirrorless or Smartphone',
    status: 'Registration Open',
    badgeBg: 'bg-purple-500/10 text-purple-600 border border-purple-200'
  },
  {
    id: 'p2',
    title: 'Short Film Gala 2026',
    subtitle: 'Annual Campus Film Screenings & Awards',
    dates: 'September 12, 2026',
    location: 'CMRTC Main Auditorium',
    gearReq: 'Short Film Submission (1-10 mins)',
    status: 'Registration Open',
    badgeBg: 'bg-purple-500/10 text-purple-600 border border-purple-200'
  },
  {
    id: 'p3',
    title: 'Lighting & Lightroom Masterclass',
    subtitle: 'Studio Lighting & Color Grading Workshop',
    dates: 'December 02, 2026',
    location: 'F9 Media Studio Lab',
    gearReq: 'Laptop with Adobe Lightroom / Photoshop',
    status: 'Coming Soon',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 border border-indigo-200'
  }
];

const PhotoWalksModal = ({ isOpen, onClose, clubName = 'Film & Photography Club' }) => {
  const [selectedEvent, setSelectedEvent] = useState(defaultPhotoEvents[0]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gearType, setGearType] = useState('DSLR Camera');
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsRegistered(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[28px] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-slate-900 my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/60 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6B21A8] flex items-center justify-center border border-purple-100 shadow-sm">
                <Camera size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{clubName} Photo Walks & Gala</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Register for outdoor photowalks, cinematography sessions, and short film galas
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {isRegistered ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Photo Walk Spot Confirmed! 📸</h4>
                <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
                  <strong className="text-[#6B21A8]">{fullName}</strong> is registered for <strong>{selectedEvent.title}</strong> using <em>{gearType}</em>.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Pass Code:</span>
                    <span className="font-bold text-[#6B21A8] font-mono">F9-PHOTO-2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Date:</span>
                    <span className="font-bold text-slate-800">{selectedEvent.dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Location:</span>
                    <span className="font-bold text-slate-800">{selectedEvent.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsRegistered(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 mt-4"
                >
                  Done & Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* Active Photo Events Selection Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Photo Walk / Media Event
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {defaultPhotoEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedEvent.id === evt.id
                            ? 'bg-purple-50/40 border-[#6B21A8] shadow-md ring-2 ring-purple-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${evt.badgeBg}`}>
                              {evt.status}
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-slate-900">{evt.title}</h5>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{evt.subtitle}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-1 text-[11px] font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-purple-600" />
                            {evt.dates}
                          </span>
                          <span className="flex items-center gap-1 text-slate-700 truncate">
                            <MapPin size={12} className="text-purple-600 shrink-0" />
                            {evt.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participant Registration Form */}
                <form onSubmit={handleRegister} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Camera size={16} className="text-[#6B21A8]" />
                      <span>Register for {selectedEvent.title}</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Participant Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#6B21A8]"
                      />
                    </div>

                    {/* Email / Roll No */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        College Email / Roll No
                      </label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="237r1a05ba@cmrtc.ac.in"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#6B21A8]"
                      />
                    </div>

                    {/* Camera / Gear Type */}
                    <div className="sm:col-span-2 space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Camera Gear / Equipment
                      </label>
                      <select
                        value={gearType}
                        onChange={(e) => setGearType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#6B21A8] cursor-pointer"
                      >
                        <option value="DSLR Camera">DSLR Camera (Canon / Nikon / Sony)</option>
                        <option value="Mirrorless Camera">Mirrorless Camera (Sony Alpha / Fujifilm)</option>
                        <option value="Smartphone (iPhone / Android)">Smartphone (iPhone / Android Flagship)</option>
                        <option value="Cinematic Drone">Cinematic Drone (DJI / Quadcopter)</option>
                        <option value="Action Camera">GoPro / Action Cam</option>
                      </select>
                    </div>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <Camera size={16} />
                    <span>Confirm Photo Walk Spot</span>
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PhotoWalksModal;
