import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative bg-[#080C16] text-slate-100 overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Subtle ambient spotlight header aura */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99, 102, 241, 0.14), transparent 80%)'
        }}
      />
      
      {/* Secondary soft background ambient glow */}
      <div 
        className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] pointer-events-none -z-0 rounded-full blur-[140px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%)'
        }}
      />

      {/* Main Container Wrapper */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

