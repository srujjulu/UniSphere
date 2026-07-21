import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap } from 'lucide-react';

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center mt-8 mb-6 px-4 select-none"
    >
      {/* Welcome Badge for 1st Year / New Students */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FF8A2A] mb-5 shadow-sm">
        <GraduationCap size={16} className="text-amber-400" />
        <span>Welcome to CMRTC • Explore All 6 Campus Clubs</span>
      </div>

      {/* Large Gradient Typography */}
      <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] leading-[1.0] font-black tracking-tight text-white font-display">
        Our{' '}
        <span className="bg-gradient-to-r from-white via-[#4F8BFF] to-[#FF8A2A] bg-clip-text text-transparent pb-1">
          Clubs
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300/80 text-base sm:text-lg md:text-xl leading-[1.7] max-w-[720px] mt-4 font-normal">
        Six official CMRTC campus clubs. Explore events, leads, and member activities — click any club card to learn more or sign in with your roll number.
      </p>
    </motion.section>
  );
};

export default HeroSection;
