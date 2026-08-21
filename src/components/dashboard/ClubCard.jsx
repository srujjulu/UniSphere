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
  const { user, isCoordinator } = useAuth();
  const isCoreTeam = Boolean(user && (user.role === 'core' || user.role === 'admin' || user.role === 'faculty' || isCoordinator));
  const logoSvg = clubLogoSvgs[club.id] || <AkritiLogo />;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full rounded-2xl bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-blue-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 text-left group relative overflow-hidden"
    >
      {/* Top subtle highlight shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main card info container */}
      <div className="flex flex-col gap-3.5 flex-1">
        {/* Top line: Logo and Category badge */}
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-slate-50 p-2 shadow-xs border border-slate-200 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0">
            {logoSvg}
          </div>
          <ClubCategoryBadge category={club.category} />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
            {club.name}
          </h3>
          <p className="text-xs text-slate-600 font-normal line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {club.subtitle || club.description}
          </p>
        </div>

        {/* Faculty Coordinator Info */}
        <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold bg-blue-50/80 px-3 py-2 rounded-xl border border-blue-100">
          <UserCheck size={14} className="text-blue-600 shrink-0" />
          <span className="truncate">Coordinator: {club.facultyCoordinator || 'Faculty Lead'}</span>
        </div>

        {/* 50-Member Quota & Capacity Status - Shown ONLY for Core Team / Coordinators */}
        {isCoreTeam && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-600">Membership Limit:</span>
              {club.membersCount >= 50 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  Quota Full (50/50)
                </span>
              ) : (
                <span className="text-emerald-600 font-mono text-[11px]">
                  {club.membersCount}/50 Enrolled ({50 - club.membersCount} spots left)
                </span>
              )}
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  club.membersCount >= 50 
                    ? 'bg-gradient-to-r from-rose-500 to-red-600' 
                    : club.membersCount >= 45 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}
                style={{ width: `${Math.min(100, (club.membersCount / 50) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-mono mt-auto">
          <div className="flex items-center gap-1.5">
            <Eye size={13} className="text-slate-400" />
            <span>{(club.views || 0).toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            <span>Est. {club.established}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-1">
        <button
          type="button"
          onClick={() => onMoreClick(club)}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 group-hover:border-transparent bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
        >
          <span>Explore Club Hub</span>
          <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ClubCard;
export { clubLogoSvgs };

