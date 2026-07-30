import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const defaultMunEvents = [
  {
    id: 'm1',
    title: 'CMRTC Model UN (MUN) 2026',
    subtitle: '3-Day International Diplomacy Conference',
    dates: 'October 18-20, 2026',
    venue: 'CMRTC Main Convention Hall',
    fees: '₹500 / Delegate',
    status: 'Applications Open',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200',
    committees: ['UNGA (DISEC)', 'UNHRC (Human Rights)', 'AIPPM (Indian Parliament)', 'UNSC (Security Council)']
  },
  {
    id: 'm2',
    title: 'Inter-College Parliamentary Debate',
    subtitle: '3v3 Asian Parliamentary Style Championship',
    dates: 'August 30, 2026',
    venue: 'Lexis Literary Hall',
    fees: 'Free Entry',
    status: 'Registration Open',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200',
    committees: ['Open Parliamentary Debate', 'Novice Speaker Category']
  },
  {
    id: 'm3',
    title: 'Word-Smith Poetry Slam & Open Mic',
    subtitle: 'Spoken Word Poetry & Public Oratory',
    dates: 'September 25, 2026',
    venue: 'CMRTC Outdoor Amphitheatre',
    fees: 'Free Entry',
    status: 'Registration Open',
    badgeBg: 'bg-teal-500/10 text-teal-600 border border-teal-200',
    committees: ['English Spoken Word', 'Hindi / Telugu Poetry']
  }
];

const MunDebatesModal = ({ isOpen, onClose, clubName = 'The Lexis Club' }) => {
  const [selectedMun, setSelectedMun] = useState(defaultMunEvents[0]);
  const [delegateName, setDelegateName] = useState('');
  const [email, setEmail] = useState('');
  const [committee, setCommittee] = useState('UNGA (DISEC)');
  const [countryPref, setCountryPref] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!delegateName.trim()) return;

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
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-100 shadow-sm">
                <Globe size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{clubName} MUN & Debates</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Apply as Delegate or Executive Board for Model UN conferences and parliamentary debates
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
                <h4 className="text-xl font-bold text-slate-900">Delegate Registration Confirmed! 🌐</h4>
                <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
                  Delegate <strong className="text-[#059669]">{delegateName}</strong> is registered for <strong>{selectedMun.title}</strong> under the <em>{committee}</em> committee.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Pass Code:</span>
                    <span className="font-bold text-[#059669] font-mono">LEXIS-MUN-2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Dates:</span>
                    <span className="font-bold text-slate-800">{selectedMun.dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Portfolio Pref:</span>
                    <span className="font-bold text-slate-800">{countryPref || 'Assigned Soon'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsRegistered(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 mt-4"
                >
                  Done & Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* Active MUN Events Selection Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Debate / MUN Conference
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {defaultMunEvents.map((mun) => (
                      <div
                        key={mun.id}
                        onClick={() => {
                          setSelectedMun(mun);
                          setCommittee(mun.committees[0]);
                        }}
                        className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedMun.id === mun.id
                            ? 'bg-emerald-50/40 border-[#059669] shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${mun.badgeBg}`}>
                              {mun.status}
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-slate-900">{mun.title}</h5>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{mun.subtitle}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                          <span>{mun.dates.split(',')[0]}</span>
                          <span className="font-bold text-emerald-600">{mun.fees}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delegate Registration Form */}
                <form onSubmit={handleRegister} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Globe size={16} className="text-[#059669]" />
                      <span>Register as Delegate for {selectedMun.title}</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Delegate Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={delegateName}
                        onChange={(e) => setDelegateName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#059669]"
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
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#059669]"
                      />
                    </div>

                    {/* Committee Selection */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Committee Preference
                      </label>
                      <select
                        value={committee}
                        onChange={(e) => setCommittee(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#059669] cursor-pointer"
                      >
                        {selectedMun.committees.map((com) => (
                          <option key={com} value={com}>{com}</option>
                        ))}
                      </select>
                    </div>

                    {/* Country / Portfolio Preference */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Country / Portfolio Preference
                      </label>
                      <input
                        type="text"
                        value={countryPref}
                        onChange={(e) => setCountryPref(e.target.value)}
                        placeholder="e.g. India, USA, United Kingdom"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#059669]"
                      />
                    </div>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <Globe size={16} />
                    <span>Apply as Delegate for {selectedMun.title}</span>
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

export default MunDebatesModal;
