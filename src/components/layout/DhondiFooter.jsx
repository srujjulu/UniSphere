import React from 'react';

const DhondiFooter = ({ className = '' }) => {
  return (
    <footer 
      id="contact" 
      className={`w-full py-5 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 text-xs text-slate-500 font-medium ${className}`}
    >
      <div className="text-center sm:text-left">
        &copy; {new Date().getFullYear()} CMR Technical Campus · UniSphere Campus Portal · All rights reserved.
      </div>
      <div className="flex items-center gap-1.5 mt-2 sm:mt-0 select-none">
        <span>Powered By</span>
        <span className="font-black tracking-wider text-[#0284C7] uppercase text-xs font-sans">
          DHONDI
        </span>
      </div>
    </footer>
  );
};

export default DhondiFooter;
