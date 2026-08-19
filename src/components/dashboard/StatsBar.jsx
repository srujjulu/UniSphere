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
      color: 'text-emerald-600',
      icon: Users,
      hasDot: true 
    },
    { 
      label: 'Total club impressions', 
      value: totalVisits !== undefined ? totalVisits : 5904, 
      color: 'text-blue-600',
      icon: Eye
    },
    { 
      label: 'Official campus clubs', 
      value: 6, 
      color: 'text-amber-600',
      icon: Compass 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="w-full rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 py-3.5 gap-4 md:gap-0 shadow-xs"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <React.Fragment key={stat.label}>
            <div className="flex items-center gap-3.5 py-1">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
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
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>

            {index < stats.length - 1 && (
              <div className="hidden md:block w-[1px] h-8 bg-slate-200" />
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};

export default StatsBar;

