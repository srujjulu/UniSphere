import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Calendar, UserCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ClubCategoryBadge from './ClubCategoryBadge';
import { 
  AkritiLogo,
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  DesignClubLogo,
  NssLogo 
} from '../../utils/clubLogos';

const clubLogoSvgs = {
  akriti: <AkritiLogo />,
  lexis: <EcoClubLogo />,
  photography: <PhotoClubLogo />,
  ncc: <DesignClubLogo />,
  codeholics: <CodeClubLogo />,
  nss: <NssLogo />
};

const ClubCard = ({ 
  club, 
  isJoined, 
  onJoinToggle, 
  onMoreClick, 
  isJoining 
}) => {
  const { user } = useAuth();
  const logoSvg = clubLogoSvgs[club.id] || <AkritiLogo />;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-2xl bg-[#0E1526]/80 hover:bg-[#121B30] border border-white/[0.08] hover:border-indigo-500/30 p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left group relative overflow-hidden"
    >
      {/* Top subtle highlight shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main card info container */}
      <div className="flex flex-col gap-4">
        {/* Top line: Logo and Category badge */}
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-white/95 p-2 shadow-sm border border-white/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            {logoSvg}
          </div>
          <ClubCategoryBadge category={club.category} />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-white tracking-tight leading-snug group-hover:text-indigo-300 transition-colors">
            {club.name}
          </h3>
          <p className="text-xs text-slate-400 font-normal line-clamp-2 leading-relaxed">
            {club.subtitle || club.description}
          </p>
        </div>

        {/* Faculty Coordinator Info */}
        <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-500/20">
          <UserCheck size={14} className="text-indigo-400 shrink-0" />
          <span className="truncate">Coordinator: {club.facultyCoordinator || 'Faculty Lead'}</span>
        </div>

        {/* 50-Member Quota & Capacity Status */}
        <div className="bg-slate-900/60 border border-white/[0.06] rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-400">Membership Limit:</span>
            {club.membersCount >= 50 ? (
              <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                Quota Full (50/50)
              </span>
            ) : (
              <span className="text-emerald-400 font-mono text-[11px]">
                {club.membersCount}/50 Enrolled ({50 - club.membersCount} spots left)
              </span>
            )}
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                club.membersCount >= 50 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                  : club.membersCount >= 45 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
              style={{ width: `${Math.min(100, (club.membersCount / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Eye size={13} className="text-slate-500" />
            <span>{(club.views || 0).toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-500" />
            <span>Est. {club.established}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-5 pt-1">
        <button
          type="button"
          onClick={() => onMoreClick(club)}
          className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98 ${
            club.membersCount >= 50
              ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-300'
              : 'bg-white/[0.05] group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 border-white/[0.08] group-hover:border-transparent text-slate-200 group-hover:text-white'
          }`}
        >
          <span>{club.membersCount >= 50 ? 'View Club (Full)' : 'Explore Club Hub'}</span>
          <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ClubCard;
export { clubLogoSvgs };

