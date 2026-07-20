import React from 'react';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative bg-[#090E1B] text-white overflow-x-hidden select-none">
      {/* 30s slow-moving blueprint grid background */}
      <div 
        className="absolute inset-0 z-0 blueprint-grid pointer-events-none opacity-40" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
          animation: 'dashboard-grid-float 35s linear infinite'
        }}
      />

      {/* Dynamic 20% Opacity Glow circles behind dashboard contents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="glow-circle-blue absolute w-[500px] h-[500px] top-[-10%] left-[5%] rounded-full blur-[200px] opacity-20" />
        <div className="glow-circle-orange absolute w-[450px] h-[450px] top-[40%] right-[10%] rounded-full blur-[200px] opacity-20" />
        <div className="glow-circle-purple absolute w-[400px] h-[400px] bottom-[5%] left-[25%] rounded-full blur-[200px] opacity-15" />
      </div>

      {/* Main Container Wrapper */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
