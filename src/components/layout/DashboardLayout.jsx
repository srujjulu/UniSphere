import React from 'react';
import DhondiFooter from './DhondiFooter';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative bg-[#F8FAFC] text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {/* Subtle top ambient gradient */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[360px] pointer-events-none -z-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(79, 70, 229, 0.08), transparent 80%)'
        }}
      />

      {/* Main Container Wrapper */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1">
        {children}
      </div>

      {/* Institutional Portal Footer */}
      <DhondiFooter />
    </div>
  );
};

export default DashboardLayout;

