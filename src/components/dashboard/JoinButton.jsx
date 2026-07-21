import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const categoryGradients = {
  Cultural: 'from-red-500 to-rose-600 shadow-red-500/20 hover:shadow-red-500/40 border-red-500/20 focus-ring',
  Technical: 'from-[#FF8A2A] to-[#FF5E36] shadow-[#FF8A2A]/20 hover:shadow-[#FF8A2A]/40 border-[#FF8A2A]/20 focus-ring',
  Photography: 'from-violet-500 to-purple-600 shadow-violet-500/20 hover:shadow-violet-500/40 border-violet-500/20 focus-ring',
  Literary: 'from-emerald-500 to-green-600 shadow-emerald-500/20 hover:shadow-emerald-500/40 border-emerald-500/20 focus-ring',
  Defence: 'from-[#4F8BFF] to-blue-600 shadow-[#4F8BFF]/20 hover:shadow-[#4F8BFF]/40 border-[#4F8BFF]/20 focus-ring',
  Service: 'from-[#D32F2F] to-[#B71C1C] shadow-red-600/20 hover:shadow-red-600/40 border-red-600/20 focus-ring',
};

const JoinButton = ({ 
  category, 
  isJoined, 
  isLoading, 
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Styling based on state
  const buttonGradient = categoryGradients[category] || categoryGradients.Technical;

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      disabled={isLoading}
      whileHover={!isJoined && !isLoading ? { y: -3, scale: 1.015 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      className={`
        w-full h-12 rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer select-none
        relative overflow-hidden flex items-center justify-center border transition-all duration-300
        ${isLoading 
          ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed pointer-events-none' 
          : isJoined 
            ? isHovered 
              ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_4px_15px_rgba(239,68,68,0.15)]' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : `bg-gradient-to-r ${buttonGradient} text-white shadow-lg`
        }
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="animate-spin" size={16} />
            <span>Processing...</span>
          </motion.div>
        ) : isJoined ? (
          <motion.div
            key="joined"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5"
          >
            {isHovered ? (
              <span className="font-bold text-red-500">Leave Club</span>
            ) : (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Joined</span>
              </>
            )}
          </motion.div>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-1"
          >
            <span>Join Club</span>
            <span>&rarr;</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default JoinButton;
