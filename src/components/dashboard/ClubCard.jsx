import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Calendar } from 'lucide-react';
import ClubCategoryBadge from './ClubCategoryBadge';
import JoinButton from './JoinButton';
import MoreButton from './MoreButton';
import { 
  CmrLogo, 
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  SportsClubLogo, 
  DesignClubLogo 
} from '../../utils/clubLogos';

const clubLogoSvgs = {
  akriti: <SportsClubLogo />, // Red accent representation
  lexis: <EcoClubLogo />, // Green accent representation
  photography: <PhotoClubLogo />, // Purple accent representation
  ncc: <DesignClubLogo />, // Blue accent representation
  codeholics: <CodeClubLogo /> // Orange accent representation
};

const categoryAccents = {
  Cultural: 'bg-red-500 shadow-[0_2px_10px_rgba(239,68,68,0.5)]',
  Technical: 'bg-[#FF8A2A] shadow-[0_2px_10px_rgba(255,138,42,0.5)]',
  Photography: 'bg-violet-500 shadow-[0_2px_10px_rgba(139,92,246,0.5)]',
  Literary: 'bg-emerald-500 shadow-[0_2px_10px_rgba(34,197,94,0.5)]',
  Defence: 'bg-[#4F8BFF] shadow-[0_2px_10px_rgba(79,139,255,0.5)]',
};

const cardBorderHover = {
  Cultural: 'hover:border-red-500/35',
  Technical: 'hover:border-[#FF8A2A]/35',
  Photography: 'hover:border-violet-500/35',
  Literary: 'hover:border-emerald-500/35',
  Defence: 'hover:border-[#4F8BFF]/35',
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
  const borderHoverClass = cardBorderHover[club.category] || cardBorderHover.Technical;
  const accentClass = categoryAccents[club.category] || categoryAccents.Technical;

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
