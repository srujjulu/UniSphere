import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 1.2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Easing function outQuad for smoother deceleration
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const StatsBar = () => {
  // Stat items definitions
  const stats = [
    { 
      label: 'Live visitors', 
      value: 36, 
      color: 'text-emerald-400',
      hasDot: true 
    },
    { 
      label: 'Total visits', 
      value: 3882, 
      color: 'text-[#4F8BFF]' 
    },
    { 
      label: 'Clubs', 
      value: 5, 
      color: 'text-[#FF8A2A]' 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.055)', borderColor: 'rgba(255, 255, 255, 0.12)' }}
      className="w-full h-auto min-h-[64px] rounded-[18px] border border-white/8 backdrop-blur-xl bg-white/4 flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 py-4 md:py-0 gap-4 md:gap-0 transition-colors duration-300 select-none shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
    >
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          {/* Stat Item */}
          <div className="flex items-center gap-3">
            {stat.hasDot && (
              <div className="relative w-2.5 h-2.5 flex items-center justify-center">
                {/* Pulsing Breathing Green Dot */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
            )}
            <span className="text-sm font-semibold text-slate-400 font-sans tracking-wide">
              {stat.label}
            </span>
            <span className={`text-lg font-extrabold font-mono ${stat.color}`}>
              <AnimatedCounter value={stat.value} />
            </span>
          </div>

          {/* Separator - Visible on Desktop between items */}
          {index < stats.length - 1 && (
            <div className="hidden md:block w-[1px] h-6 bg-white/10" />
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default StatsBar;
