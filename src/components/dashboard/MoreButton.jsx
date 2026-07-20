import React from 'react';
import { motion } from 'framer-motion';

const MoreButton = ({ onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      whileTap={{ scale: 0.98 }}
      className="px-4 h-12 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group focus:outline-none focus-ring"
    >
      <span>More</span>
      <motion.span
        className="inline-block"
        variants={{
          hover: { x: 3 },
          initial: { x: 0 }
        }}
        initial="initial"
        whileHover="hover"
        transition={{ duration: 0.2 }}
        // We link hover states from button using group hover classes:
      >
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </motion.span>
    </motion.button>
  );
};

export default MoreButton;
