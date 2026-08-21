import React from 'react';
import { motion } from 'framer-motion';

const ClubLogo = ({ svg, name, index = 0 }) => {
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{
        repeat: Infinity,
        duration: 2.8 + (index % 3) * 0.3,
        ease: "easeInOut",
        delay: index * 0.15
      }}
      whileHover={{ 
        scale: 1.12, 
        y: -6, 
        rotate: 2,
        boxShadow: "0 12px 24px -4px rgba(37, 99, 235, 0.22)"
      }}
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center shadow-md hover:shadow-xl border border-slate-100 cursor-pointer overflow-hidden p-2 sm:p-2.5 select-none transition-shadow duration-300"
      title={name}
      aria-label={`${name} Logo`}
      role="img"
    >
      {svg}
    </motion.div>
  );
};

export default ClubLogo;
