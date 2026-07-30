import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Trophy, Calendar, Users, CheckCircle2, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';

const defaultHackathons = [
  {
    id: 'h1',
    title: 'CMR HackFest 2026',
    subtitle: '36-Hour Flagship National Hackathon',
    dates: 'September 05-07, 2026',
    prizePool: '₹1,50,000',
    venue: 'CMRTC Tech Innovation Lab & Auditorium',
    teamSize: '1 - 4 Developers',
    status: 'Registration Open',
    badgeBg: 'bg-red-500/10 text-red-600 border border-red-200',
    tracks: ['AI & Machine Learning', 'Full-Stack Web/App', 'Cybersecurity', 'Web3 & Cloud']
  },
  {
    id: 'h2',
    title: 'CodeWar Sprints 2026',
    subtitle: 'Speed Algorithmic & DSA Contest',
    dates: 'November 15, 2026',
    prizePool: '₹50,000 + Swag',
    venue: 'Online & CMRTC Computer Labs',
    teamSize: 'Individual Solo Hacker',
    status: 'Registration Open',
    badgeBg: 'bg-amber-500/10 text-amber-600 border border-amber-200',
    tracks: ['DSA Sprints', 'Dynamic Programming', 'Graph Theory']
  },
  {
    id: 'h3',
    title: 'AI & Full-Stack Buildathon',
    subtitle: 'Hands-on Web Dev & LLM Agent Building',
    dates: 'October 01, 2026',
    prizePool: 'Cloud Credits & Internships',
    venue: 'CMRTC Innovation Center',
    teamSize: '1 - 3 Developers',
    status: 'Coming Soon',
    badgeBg: 'bg-blue-500/10 text-blue-600 border border-blue-200',
    tracks: ['React v19 Sprints', 'LLM RAG Agents', 'UI/UX Prototypes']
  }
];

const HackathonsModal = ({ isOpen, onClose, clubName = 'Codeholics Club' }) => {
  const [selectedHackathon, setSelectedHackathon] = useState(defaultHackathons[0]);
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('AI & Machine Learning');
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!teamName.trim() || !leaderName.trim()) return;

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
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EF4444] flex items-center justify-center border border-red-100 shadow-sm">
                <Code size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{clubName} Hackathons & Sprints</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Register your team for upcoming hackathons, coding sprints, and tech challenges
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
                <h4 className="text-xl font-bold text-slate-900">Registration Confirmed! 🚀</h4>
                <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
                  Team <strong className="text-[#EF4444]">{teamName}</strong> led by <strong>{leaderName}</strong> is registered for <strong>{selectedHackathon.title}</strong> under the <em>{selectedTrack}</em> track.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Pass Code:</span>
                    <span className="font-bold text-[#EF4444] font-mono">HACK-2026-X89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Dates:</span>
                    <span className="font-bold text-slate-800">{selectedHackathon.dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Venue:</span>
                    <span className="font-bold text-slate-800">CMRTC Tech Lab</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsRegistered(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 mt-4"
                >
                  Done & Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* Active Hackathons Selection Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Active & Upcoming Hackathons
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {defaultHackathons.map((hack) => (
                      <div
                        key={hack.id}
                        onClick={() => setSelectedHackathon(hack)}
                        className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedHackathon.id === hack.id
                            ? 'bg-red-50/40 border-[#EF4444] shadow-md ring-2 ring-red-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${hack.badgeBg}`}>
                              {hack.status}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                              <Trophy size={13} />
                              {hack.prizePool}
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-slate-900">{hack.title}</h5>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{hack.subtitle}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {hack.dates.split(',')[0]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {hack.teamSize.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Registration Form */}
                <form onSubmit={handleRegister} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Rocket size={16} className="text-[#EF4444]" />
                      <span>Register Team for {selectedHackathon.title}</span>
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      Prize: <strong className="text-emerald-600">{selectedHackathon.prizePool}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Team Name */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Team Name
                      </label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. AlgoRhythms"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>

                    {/* Team Leader Name */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Team Leader Name
                      </label>
                      <input
                        type="text"
                        required
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        placeholder="Leader Full Name"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#EF4444]"
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
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>

                    {/* Track Selection */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Hackathon Track
                      </label>
                      <select
                        value={selectedTrack}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#EF4444] cursor-pointer"
                      >
                        {selectedHackathon.tracks.map((tr) => (
                          <option key={tr} value={tr}>{tr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <Rocket size={16} />
                    <span>Register Team for {selectedHackathon.title}</span>
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

export default HackathonsModal;
