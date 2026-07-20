import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const AuthLayout = ({ children, leftPanelContent }) => {
  // Motion values for mouse movement parallax (Desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    // Only calculate parallax on desktop sizes (width > 1024px)
    if (window.innerWidth < 1024) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // range: -0.5 to 0.5
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Transform vectors for branding elements (subtle movement)
  const logoX = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);
  const logoY = useTransform(mouseY, [-0.5, 0.5], [-3, 3]);

  const headingX = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const headingY = useTransform(mouseY, [-0.5, 0.5], [-5, 5]);

  const glowX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

  return (
    <div 
      className="flex flex-col lg:flex-row h-screen h-svh w-full overflow-hidden bg-[#0B1120]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Branding Panel (55% desktop, 60% tablet, collapses to top on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[32vh] min-h-[220px] md:w-[60%] md:h-full lg:w-[55%] relative flex flex-col justify-center items-center overflow-hidden border-b border-slate-900 md:border-b-0 md:border-r border-slate-800/40 select-none"
      >
        {/* Animated Blueprint Grid */}
        <div className="blueprint-grid absolute inset-0 z-0" />

        {/* Dynamic Slow-Moving Glows (Parallax active) */}
        <motion.div 
          style={{ x: glowX, y: glowY }}
          className="absolute inset-0 z-1 pointer-events-none"
        >
          <div className="glow-circle-blue absolute w-[400px] h-[400px] -top-32 -left-12 rounded-full blur-[100px]" />
          <div className="glow-circle-purple absolute w-[450px] h-[450px] top-[30%] -right-24 rounded-full blur-[120px]" />
          <div className="glow-circle-orange absolute w-[350px] h-[350px] -bottom-24 left-[20%] rounded-full blur-[90px]" />
        </motion.div>

        {/* Branding Elements Passed from Page */}
        <div className="relative z-10 w-full flex flex-col justify-center items-center px-6 text-center">
          {leftPanelContent({ logoStyle: { x: logoX, y: logoY }, headingStyle: { x: headingX, y: headingY } })}
        </div>
      </motion.div>

      {/* Right Form Card Panel (45% desktop, 40% tablet, full on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1 md:w-[40%] md:h-full lg:w-[45%] h-[68vh] relative flex flex-col px-6 sm:px-12 md:px-8 lg:px-16 overflow-y-auto"
      >
        <div className="w-full max-w-[500px] mx-auto my-auto py-8 flex flex-col justify-center min-h-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
