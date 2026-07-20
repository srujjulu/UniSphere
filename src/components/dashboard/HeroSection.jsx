import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center mt-12 mb-8 px-4 select-none"
    >
      {/* Large Gradient Typography */}
      <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] leading-[1.0] font-black tracking-tight text-white font-display">
        Our{' '}
        <span className="bg-gradient-to-r from-white via-[#4F8BFF] to-[#FF8A2A] bg-clip-text text-transparent pb-1">
          Clubs
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300/80 text-base sm:text-lg md:text-xl leading-[1.7] max-w-[650px] mt-4 font-normal">
        Five exceptional clubs, each with its own identity. Click a card to learn more &mdash; or join right away to start your journey.
      </p>
    </motion.section>
  );
};

export default HeroSection;
