import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Calendar } from 'lucide-react';
import ClubCategoryBadge from './ClubCategoryBadge';
import JoinButton from './JoinButton';
import MoreButton from './MoreButton';
import { 
  CmrLogo, 
  AkritiLogo,
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  DesignClubLogo 
} from '../../utils/clubLogos';

const clubLogoSvgs = {
  akriti: <AkritiLogo />,
  lexis: <EcoClubLogo />,
  photography: <PhotoClubLogo />,
  ncc: <DesignClubLogo />,
  codeholics: <CodeClubLogo />
};

const clubAccents = {
  akriti: 'bg-gradient-to-r from-[#881337] to-[#E11D48] shadow-[0_2px_12px_rgba(225,29,72,0.6)]',
  codeholics: 'bg-gradient-to-r from-[#DC2626] to-[#475569] shadow-[0_2px_12px_rgba(220,38,38,0.6)]',
  ncc: 'bg-gradient-to-r from-[#DC2626] via-[#1E3A8A] to-[#0284C7] shadow-[0_2px_12px_rgba(30,58,138,0.6)]',
  photography: 'bg-gradient-to-r from-[#A855F7] via-[#EF4444] to-[#3B82F6] shadow-[0_2px_12px_rgba(168,85,247,0.6)]',
  lexis: 'bg-gradient-to-r from-[#15803D] via-[#10B981] to-[#C084FC] shadow-[0_2px_12px_rgba(21,128,61,0.6)]'
};

const clubBorderHovers = {
  akriti: 'hover:border-rose-500/40 hover:shadow-[0_20px_40px_rgba(225,29,72,0.25)]',
  codeholics: 'hover:border-red-500/40 hover:shadow-[0_20px_40px_rgba(220,38,38,0.25)]',
  ncc: 'hover:border-blue-500/40 hover:shadow-[0_20px_40px_rgba(30,58,138,0.25)]',
  photography: 'hover:border-purple-500/40 hover:shadow-[0_20px_40px_rgba(168,85,247,0.25)]',
  lexis: 'hover:border-emerald-500/40 hover:shadow-[0_20px_40px_rgba(21,128,61,0.25)]'
};

// Sub-component for animating card stat counters once on mount
const StatCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    let totalDuration = 1000; // 1s
    let incrementTime = Math.abs(Math.floor(totalDuration / end));
    incrementTime = Math.max(incrementTime, 8); // clamp to min 8ms

    const timer = setInterval(() => {
      start += Math.ceil(end / 80); // chunk incremental step
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

const ClubCard = ({ 
  club, 
  isJoined, 
  onJoinToggle, 
  onMoreClick, 
  isJoining 
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowState, setGlowState] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return; // Parallax is desktop-only
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Cursor position relative to card boundaries
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate 4 degrees maximum
    const rx = -((y - centerY) / centerY) * 4;
    const ry = ((x - centerX) / centerX) * 4;
    
    setRotateX(rx);
    setRotateY(ry);
    setGlowState({ x, y, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowState((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  const logoSvg = clubLogoSvgs[club.id] || <CodeClubLogo />;
  const borderHoverClass = clubBorderHovers[club.id] || clubBorderHovers.codeholics;
  const accentClass = clubAccents[club.id] || clubAccents.codeholics;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className={`
        w-full rounded-[24px] bg-white/4 border border-white/8 backdrop-blur-xl p-7
        relative flex flex-col justify-between transition-all duration-300 select-none
        ${isHovered ? 'shadow-[0_20px_40px_rgba(0,0,0,0.4)] -translate-y-2' : 'shadow-[0_8px_24px_rgba(0,0,0,0.2)]'}
        ${borderHoverClass}
      `}
    >
      {/* Category Colored Top Accent Line (Animates height on hover) */}
      <motion.div 
        animate={{ height: isHovered ? 6 : 4 }}
        transition={{ duration: 0.25 }}
        className={`absolute top-0 left-0 w-full rounded-t-[24px] ${accentClass}`}
      />

      {/* 3D Cursor Lighting Radial Glow Effect */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[24px] z-0 transition-opacity duration-300"
        style={{
          opacity: glowState.opacity,
          background: `radial-gradient(circle 140px at ${glowState.x}px ${glowState.y}px, rgba(255,255,255,0.12), transparent 85%)`
        }}
      />

      {/* Main card info container */}
      <div className="relative z-10 flex flex-col gap-5">
        {/* Top line: Logo and Category badge */}
        <div className="flex justify-between items-start">
          {/* Logo Card */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md cursor-pointer p-2"
          >
            {logoSvg}
          </motion.div>
          <ClubCategoryBadge category={club.category} />
        </div>

        {/* Title & Subtitle */}
        <div className="text-left">
          <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug">
            {club.name}
          </h3>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            {club.subtitle}
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex gap-4 border-y border-white/5 py-3.5 text-xs text-slate-400 font-semibold font-mono justify-start">
          <div className="flex items-center gap-1.5">
            <Eye size={14} className="text-slate-500" />
            <span><StatCounter value={club.views} /> views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-500" />
            <span>Est. {club.established}</span>
          </div>
        </div>
      </div>

      {/* Actions (Join Button, More Button) */}
      <div className="relative z-10 flex items-center gap-3 mt-6">
        <div className="flex-1">
          <JoinButton
            category={club.category}
            isJoined={isJoined}
            isLoading={isJoining}
            onClick={onJoinToggle}
          />
        </div>
        <MoreButton onClick={onMoreClick} />
      </div>
    </motion.div>
  );
};

export default ClubCard;
export { clubLogoSvgs };
