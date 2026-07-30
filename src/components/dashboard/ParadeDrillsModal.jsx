import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Calendar, MapPin, CheckCircle2, Flag } from 'lucide-react';
import confetti from 'canvas-confetti';

const defaultDrillEvents = [
  {
    id: 'd1',
    title: 'Independence Day Ceremonial Parade 2026',
    subtitle: 'Ceremonial Guard of Honour & Battalion March Past',
    dates: 'August 15, 2026 (Reporting 06:00 AM)',
    venue: 'CMRTC Main Parade Ground',
    drillType: 'Guard of Honour & March Past',
    status: 'Cadet Reporting Open',
    badgeBg: 'bg-blue-500/10 text-blue-600 border border-blue-200'
  },
  {
    id: 'd2',
    title: 'Republic Day Camp (RDC) Selections',
    subtitle: 'Rigorous Physical Fitness & Drill Drill-Down',
    dates: 'September 10-12, 2026',
    venue: '1(T) Bn NCC Battalion Grounds',
    drillType: 'Obstacle Course & Drill Rigor',
    status: 'Selections Open',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
  },
  {
    id: 'd3',
    title: 'Weapons Training & Firing Simulator',
    subtitle: '.22 Rifle Strip-Down, Assembly & Firing Practice',
    dates: 'October 05, 2026',
    venue: 'NCC Firing Range Lab',
    drillType: 'Weapons Assembly & Firing',
    status: 'Enrolment Open',
    badgeBg: 'bg-amber-500/10 text-amber-600 border border-amber-200'
  }
];

const ParadeDrillsModal = ({ isOpen, onClose, clubName = 'NCC Cadets Unit' }) => {
  const [selectedDrill, setSelectedDrill] = useState(defaultDrillEvents[0]);
  const [cadetName, setCadetName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [rank, setRank] = useState('Cadet');
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!cadetName.trim()) return;

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
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center border border-blue-100 shadow-sm">
                <Shield size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{clubName} Parade Drills & Camps</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Register cadet attendance for Independence Day parades, RDC selections, and weapons training
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
                <h4 className="text-xl font-bold text-slate-900">Cadet Enrolled for Drill! 🎖️</h4>
                <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
                  Cadet <strong className="text-[#1D4ED8]">{cadetName}</strong> ({rank}) is registered for <strong>{selectedDrill.title}</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Drill Pass Code:</span>
                    <span className="font-bold text-[#1D4ED8] font-mono">NCC-DRILL-2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Rank:</span>
                    <span className="font-bold text-slate-800">{rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Reporting Venue:</span>
                    <span className="font-bold text-slate-800">CMRTC Parade Ground</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsRegistered(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 mt-4"
                >
                  Done & Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* Active Drill Events Selection Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Active Parade Drills & Battalion Camps
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {defaultDrillEvents.map((drill) => (
                      <div
                        key={drill.id}
                        onClick={() => setSelectedDrill(drill)}
                        className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedDrill.id === drill.id
                            ? 'bg-blue-50/40 border-[#1D4ED8] shadow-md ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${drill.badgeBg}`}>
                              {drill.status}
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-slate-900">{drill.title}</h5>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{drill.subtitle}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-1 text-[11px] font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-blue-600" />
                            {drill.dates.split('(')[0]}
                          </span>
                          <span className="flex items-center gap-1 text-slate-700 truncate">
                            <MapPin size={12} className="text-blue-600 shrink-0" />
                            {drill.venue.split('Ground')[0]} Ground
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cadet Registration Form */}
                <form onSubmit={handleRegister} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Flag size={16} className="text-[#1D4ED8]" />
                      <span>Register Cadet for {selectedDrill.title}</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Cadet Name */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Cadet Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cadetName}
                        onChange={(e) => setCadetName(e.target.value)}
                        placeholder="Enter Cadet Name"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>

                    {/* Regimental No */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Regimental / Cadet Roll No
                      </label>
                      <input
                        type="text"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        placeholder="TS/2023/SDA/10842"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>

                    {/* Rank Selection */}
                    <div className="sm:col-span-2 space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Cadet Rank
                      </label>
                      <select
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                      >
                        <option value="Senior Under Officer (SUO)">Senior Under Officer (SUO)</option>
                        <option value="Under Officer (UO)">Under Officer (UO)</option>
                        <option value="Company Quartermaster Sergeant (CQMS)">Company Quartermaster Sergeant (CQMS)</option>
                        <option value="Sergeant (SGT)">Sergeant (SGT)</option>
                        <option value="Corporal (CPL)">Corporal (CPL)</option>
                        <option value="Lance Corporal (LCPL)">Lance Corporal (LCPL)</option>
                        <option value="Cadet">Cadet (CDT)</option>
                      </select>
                    </div>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <Shield size={16} />
                    <span>Enrol Cadet for Drill</span>
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

export default ParadeDrillsModal;
