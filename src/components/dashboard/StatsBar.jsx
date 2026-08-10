import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, Compass } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 1.0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
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

const StatsBar = ({ totalVisits }) => {
  const stats = [
    { 
      label: 'Live active visitors', 
      value: 36, 
      color: 'text-emerald-400',
      icon: Users,
      hasDot: true 
    },
    { 
      label: 'Total club impressions', 
      value: totalVisits !== undefined ? totalVisits : 5904, 
      color: 'text-indigo-400',
      icon: Eye
    },
    { 
      label: 'Official campus clubs', 
      value: 6, 
      color: 'text-amber-400',
      icon: Compass 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="w-full rounded-2xl border border-white/[0.08] backdrop-blur-xl bg-[#0E1526]/60 flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 py-3.5 gap-4 md:gap-0 shadow-lg"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <React.Fragment key={stat.label}>
            <div className="flex items-center gap-3.5 py-1">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400">
                <Icon size={16} />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  {stat.hasDot && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                  <span className={`text-base sm:text-lg font-black font-mono tracking-tight leading-none ${stat.color}`}>
                    <AnimatedCounter value={stat.value} />
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>

            {index < stats.length - 1 && (
              <div className="hidden md:block w-[1px] h-8 bg-white/[0.08]" />
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};

export default StatsBar;

