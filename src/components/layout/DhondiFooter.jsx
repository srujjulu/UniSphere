import React from 'react';

const DhondiFooter = ({ className = '' }) => {
  return (
    <footer 
      id="contact" 
      className={`w-full py-5 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 text-xs text-slate-400 font-medium ${className}`}
    >
      <div className="text-center sm:text-left">
        &copy; {new Date().getFullYear()} CMR Technical Campus · UniSphere Campus Portal · All rights reserved.
      </div>
      <div className="flex items-center gap-1.5 mt-2 sm:mt-0 select-none">
        <span>Powered By</span>
        <span className="font-black tracking-wider text-[#38BDF8] uppercase text-xs font-sans">
          DHONDI
        </span>
      </div>
    </footer>
  );
};

export default DhondiFooter;
