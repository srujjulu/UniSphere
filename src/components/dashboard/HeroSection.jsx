import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Users, Calendar, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center space-y-8 py-6 px-4 select-none max-w-5xl mx-auto"
    >
      {/* Prominent CMR Technical Campus & UniSphere Dual Emblem Badge */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* CMR Technical Campus Official Logo */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: -2 }}
          className="relative group"
        >
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-pink-600 to-rose-600 opacity-40 blur-xl group-hover:opacity-75 transition duration-500" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2.5 shadow-2xl border border-white/20 flex flex-col items-center justify-center overflow-hidden">
            <img src="/tc.jpeg" alt="CMR Technical Campus Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </div>
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block mt-2">CMRTC Campus</span>
        </motion.div>

        {/* Divider badge */}
        <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/20 text-slate-400 font-black text-xs flex items-center justify-center shadow-lg">
          ✕
        </div>

        {/* UniSphere Portal Logo */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: 2 }}
          className="relative group"
        >
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 opacity-40 blur-xl group-hover:opacity-75 transition duration-500" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2.5 shadow-2xl border border-white/20 flex flex-col items-center justify-center overflow-hidden">
            <img src="/UniSphere.png" alt="UniSphere Logo" className="w-full h-full object-contain filter drop-shadow-md" />
          </div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mt-2">UniSphere Portal</span>
        </motion.div>
      </div>

      {/* Welcome & Accreditation Badge */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-black text-pink-400 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
          <GraduationCap size={16} className="text-pink-400 animate-pulse" />
          <span>CMR Technical Campus (CMRTC) • Official Portal</span>
        </span>
        <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1">
          <ShieldCheck size={14} />
          <span>NAAC A+ & NBA Accredited</span>
        </span>
      </div>

      {/* Main Headline */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Welcome to <span className="text-gradient-pink">CMR Technical Campus</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
          Empowering innovation, leadership, and cultural expression through 6 official student organizations. Discover our active campus clubs below or log in with your CMR student ID to join.
        </p>
      </div>

      {/* College Quick Highlights Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-2">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-1">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-1">
            <Users size={18} />
          </div>
          <p className="text-lg font-black text-white">10,000+</p>
          <p className="text-[11px] text-slate-400 font-bold uppercase">Campus Students</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-1">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-1">
            <Sparkles size={18} />
          </div>
          <p className="text-lg font-black text-white">6 Active</p>
          <p className="text-[11px] text-slate-400 font-bold uppercase">Student Clubs</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1">
            <Calendar size={18} />
          </div>
          <p className="text-lg font-black text-white">50+ Annual</p>
          <p className="text-[11px] text-slate-400 font-bold uppercase">Fests & Fests</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1">
            <Award size={18} />
          </div>
          <p className="text-lg font-black text-emerald-400">NAAC A+</p>
          <p className="text-[11px] text-slate-400 font-bold uppercase">Grade Ranking</p>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
