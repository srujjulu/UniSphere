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
        y: -10, 
        rotate: 3,
        boxShadow: "0 12px 28px -5px rgba(255, 140, 50, 0.3)"
      }}
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
