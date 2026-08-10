import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const AuthLayout = ({ children, leftPanelContent }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const logoX = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);
  const logoY = useTransform(mouseY, [-0.5, 0.5], [-2, 2]);
  const headingX = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);
  const headingY = useTransform(mouseY, [-0.5, 0.5], [-3, 3]);

  return (
    <div 
      className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-[#080C16] text-white selection:bg-indigo-500/30 selection:text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Institutional Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full py-10 lg:py-0 shrink-0 lg:w-[50%] xl:w-[52%] lg:min-h-screen relative flex flex-col justify-center items-center overflow-hidden border-b border-white/[0.08] lg:border-b-0 lg:border-r bg-[#0B101E]/90 select-none"
      >
        {/* Subtle Ambient Spotlight */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.18), transparent 70%)'
          }}
        />

        {/* Branding Elements Passed from Page */}
        <div className="relative z-10 w-full flex flex-col justify-center items-center px-6 sm:px-12 text-center max-w-xl">
          {leftPanelContent({ logoStyle: { x: logoX, y: logoY }, headingStyle: { x: headingX, y: headingY } })}
        </div>
      </motion.div>

      {/* Right Form Card Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1 lg:w-[50%] xl:w-[48%] lg:min-h-screen relative flex flex-col px-4 sm:px-8 md:px-12 lg:px-16 overflow-y-auto justify-center py-8 lg:py-12"
      >
        <div className="w-full max-w-[440px] mx-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;

