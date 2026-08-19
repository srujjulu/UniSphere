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
      className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-slate-900 selection:bg-blue-500 selection:text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Institutional Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full py-10 lg:py-0 shrink-0 lg:w-[50%] xl:w-[52%] lg:min-h-screen relative flex flex-col justify-center items-center overflow-hidden border-b border-slate-200 lg:border-b-0 lg:border-r bg-white select-none"
      >
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(37, 99, 235, 0.12), transparent 70%)'
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
        className="w-full flex-1 lg:w-[50%] xl:w-[48%] lg:min-h-screen relative flex flex-col px-4 sm:px-8 md:px-12 lg:px-16 overflow-y-auto justify-center py-8 lg:py-12 bg-[#F8FAFC]"
      >
        <div className="w-full max-w-[440px] mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;

