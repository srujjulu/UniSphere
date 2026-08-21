import React from 'react';
import DhondiFooter from './DhondiFooter';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Subtle, soft top ambient light blue wash */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] pointer-events-none -z-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(224, 242, 254, 0.6) 0%, rgba(238, 242, 255, 0.3) 50%, transparent 80%)'
        }}
      />

      {/* Main Container Wrapper */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 pb-4">
        {children}
      </div>

      {/* Institutional Portal Footer */}
      <DhondiFooter />
    </div>
  );
};

export default DashboardLayout;

