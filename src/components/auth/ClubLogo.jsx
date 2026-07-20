import React from 'react';
import { motion } from 'framer-motion';

const ClubLogo = ({ svg, name }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.08, 
        y: -6, 
        rotate: 2,
        boxShadow: "0 10px 25px -5px rgba(255, 140, 50, 0.2)"
      }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer overflow-hidden p-2 select-none"
      title={name}
      aria-label={`${name} Logo`}
      role="img"
    >
      {svg}
    </motion.div>
  );
};

export default ClubLogo;
