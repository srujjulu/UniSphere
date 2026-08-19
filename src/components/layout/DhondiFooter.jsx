import React from 'react';

const DhondiFooter = ({ className = '' }) => {
  return (
    <footer className={`py-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 select-none ${className}`}>
      <span>Powered By</span>
      <span className="font-black tracking-wider text-[#0284C7] uppercase text-sm font-sans">
        DHONDI
      </span>
    </footer>
  );
};

export default DhondiFooter;
