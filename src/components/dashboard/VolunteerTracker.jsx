import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, ShieldCheck, Sparkles, CheckCircle2, Heart, Download, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getStudentVolunteerRecord, 
  getStudentMilestones, 
  milestoneThresholds 
} from '../../utils/mockVolunteerHours';

const VolunteerTracker = ({ onToast }) => {
  const { user } = useAuth();
  const studentRoll = user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA';

  const [volunteerRecord, setVolunteerRecord] = useState(() => getStudentVolunteerRecord(studentRoll));

  useEffect(() => {
    const syncData = () => {
      setVolunteerRecord(getStudentVolunteerRecord(studentRoll));
    };
    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, [studentRoll]);

  const totalHours = volunteerRecord.totalHours || 0;
  const milestones = getStudentMilestones(totalHours);

  // Compute next milestone target
  const nextMilestone = milestoneThresholds.find(m => totalHours < m.hours) || milestoneThresholds[milestoneThresholds.length - 1];
  const prevMilestoneHours = milestoneThresholds.filter(m => totalHours >= m.hours).pop()?.hours || 0;
  const targetHours = nextMilestone.hours;
  const progressPercent = Math.min(100, Math.round((totalHours / targetHours) * 100));

  const handleDownloadAppreciationCert = (milestone) => {
    if (onToast) {
      onToast(`📄 Generating Official Volunteer Certificate for ${milestone.title}...`, 'success');
    }
  };

  return (
    <div className="space-y-8 font-sans select-none pb-8">
      {/* 1. Top Header Banner */}
      <div className="bg-slate-900/80 p-6 sm:p-8 rounded-[32px] border border-slate-800 backdrop-blur-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-widest border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Heart size={14} className="text-amber-400 fill-amber-400" />
              <span>NSS & NCC Service Tracking</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Volunteer Hours & Milestone Badges
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Track voluntary community service hours logged in NSS drives, NCC drills, and campus social initiatives. Unlock official appreciation credentials.
          </p>
        </div>

        {/* Total Hours Metric Badge */}
        <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 text-center space-y-1 w-full sm:w-auto shadow-xl">
          <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Total Logged Hours</p>
          <div className="flex items-center justify-center gap-1.5">
            <Clock size={24} className="text-amber-400" />
            <span className="text-3xl font-black text-amber-400 font-mono">{totalHours} Hours</span>
          </div>
        </div>
      </div>

      {/* 2. Milestone Progress Bar Container */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <span>Milestone Achievement Progress</span>
            </h3>
            <p className="text-xs text-slate-400">
              Next Goal: <strong className="text-amber-300">{nextMilestone.title} ({nextMilestone.hours} Hours)</strong>
            </p>
          </div>
          <span className="text-sm font-black text-amber-400 font-mono">
            {totalHours} / {targetHours} Hours ({progressPercent}%)
          </span>
        </div>

        {/* Glowing Progress Bar */}
        <div className="w-full h-4 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
          />
        </div>
      </div>

      {/* 3. Milestone Appreciation Badges Showcase Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Award size={20} className="text-amber-400" />
          <span>Earned Appreciation Badges & Credentials</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div
              key={m.level}
              className={`p-5 rounded-2xl border backdrop-blur-xl space-y-3 shadow-xl transition-all duration-200 ${
                m.unlocked 
                  ? 'bg-slate-900/80 border-amber-500/40 shadow-amber-500/10' 
                  : 'bg-slate-950/40 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{m.badge}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  m.unlocked ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {m.unlocked ? 'Unlocked ✓' : `Requires ${m.hours} Hrs`}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white">{m.title}</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{m.desc}</p>
              </div>

              {m.unlocked && (
                <button
                  onClick={() => handleDownloadAppreciationCert(m)}
                  className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download size={13} />
                  <span>Download Honor Certificate</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Volunteer Activity History Log Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Calendar size={20} className="text-blue-400" />
          <span>Completed Volunteer Activities Log</span>
        </h3>

        <div className="rounded-[28px] bg-slate-900/60 border border-slate-800 backdrop-blur-xl p-5 shadow-xl overflow-x-auto">
          {volunteerRecord.history?.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No volunteer hours logged yet. Participate in NSS cleanliness drives & NCC drills to log service hours!
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">Organizing Club</th>
                  <th className="py-3 px-4">Hours Logged</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Assigned By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                {volunteerRecord.history.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-white">{log.eventTitle}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px] border border-blue-500/30">
                        {log.clubName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">+{log.hours} Hours</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{log.date}</td>
                    <td className="py-3.5 px-4 text-slate-300 flex items-center gap-1">
                      <UserCheck size={14} className="text-emerald-400" />
                      <span>{log.assignedBy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerTracker;
