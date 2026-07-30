import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Droplets, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const defaultBloodEvents = [
  {
    id: 'b1',
    title: 'Mega Campus Blood Donation Camp 2026',
    subtitle: 'Annual Blood Donation in Partnership with Red Cross',
    dates: 'August 14, 2026 (09:00 AM - 04:00 PM)',
    venue: 'CMRTC Indoor Sports Hall & Health Center',
    bank: 'Red Cross & Gandhi Hospital Blood Bank',
    status: 'Donor Registrations Open',
    badgeBg: 'bg-red-500/10 text-red-600 border border-red-200'
  },
  {
    id: 'b2',
    title: 'Swachh Bharat & Village Health Camp',
    subtitle: 'Free Health Checkups & Sanitation Drive',
    dates: 'August 20, 2026',
    venue: 'Adopted Village (Kandlakoya & Surroundings)',
    bank: 'NSS Medical Volunteer Squad',
    status: 'Volunteers Open',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
  },
  {
    id: 'b3',
    title: 'Emergency On-Call Blood Network',
    subtitle: '24x7 Emergency Blood Donor Registry for Hospitals',
    dates: 'Active 365 Days',
    venue: 'Emergency Hospital Dispatch Network',
    bank: 'Hyderabad Red Cross Emergency Cell',
    status: '24x7 Active Network',
    badgeBg: 'bg-rose-500/10 text-rose-600 border border-rose-200'
  }
];

const BloodDrivesModal = ({ isOpen, onClose, clubName = 'NSS Service Unit' }) => {
  const [selectedDrive, setSelectedDrive] = useState(defaultBloodEvents[0]);
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [participationType, setParticipationType] = useState('Blood Donor');
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!donorName.trim()) return;

    setIsRegistered(true);
    confetti({
      particleCount: 160,
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
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-100 shadow-sm">
                <Heart size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{clubName} Blood Drives & Health Camps</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Pledge to donate blood or volunteer for community health camps & emergency registries
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
                <h4 className="text-xl font-bold text-slate-900">Pledge Registered! ❤️</h4>
                <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
                  Thank you <strong className="text-[#DC2626]">{donorName}</strong> ({bloodGroup}) for registering as a <em>{participationType}</em> for <strong>{selectedDrive.title}</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Donor ID:</span>
                    <span className="font-bold text-[#DC2626] font-mono">NSS-DONOR-{bloodGroup}-2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Blood Group:</span>
                    <span className="font-bold text-slate-800">{bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Venue:</span>
                    <span className="font-bold text-slate-800">CMRTC Sports Hall</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsRegistered(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 mt-4"
                >
                  Done & Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* Active Blood Drives Selection Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Active Blood Donation Drives & Network
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {defaultBloodEvents.map((drive) => (
                      <div
                        key={drive.id}
                        onClick={() => setSelectedDrive(drive)}
                        className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedDrive.id === drive.id
                            ? 'bg-red-50/40 border-[#DC2626] shadow-md ring-2 ring-red-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${drive.badgeBg}`}>
                              {drive.status}
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-slate-900">{drive.title}</h5>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{drive.subtitle}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-1 text-[11px] font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-red-500" />
                            {drive.dates.split('(')[0]}
                          </span>
                          <span className="flex items-center gap-1 text-slate-700 truncate">
                            <MapPin size={12} className="text-red-500 shrink-0" />
                            {drive.venue.split('&')[0]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donor Registration Form */}
                <form onSubmit={handleRegister} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Droplets size={16} className="text-[#DC2626]" />
                      <span>Register for {selectedDrive.title}</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Donor / Volunteer Name
                      </label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#DC2626]"
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
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>

                    {/* Blood Group Selection */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#DC2626] cursor-pointer"
                      >
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                      </select>
                    </div>

                    {/* Participation Type */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Participation Role
                      </label>
                      <select
                        value={participationType}
                        onChange={(e) => setParticipationType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#DC2626] cursor-pointer"
                      >
                        <option value="Blood Donor">Blood Donor (Donate Blood)</option>
                        <option value="Student Volunteer">Student Volunteer / Coordinator</option>
                        <option value="On-Call Emergency Donor">On-Call Emergency Network Donor</option>
                      </select>
                    </div>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <Heart size={16} />
                    <span>Pledge & Register for Blood Drive</span>
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

export default BloodDrivesModal;
