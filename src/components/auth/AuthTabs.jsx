import React from 'react';
import { motion } from 'framer-motion';

const AuthTabs = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'signin', label: 'Sign In' },
    { id: 'register', label: 'New Account' }
  ];

  const handleKeyDown = (e, tabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(tabId);
    }
  };

  return (
    <div 
      className="w-full bg-[#1A2030] p-1.5 rounded-2xl flex relative select-none"
      role="tablist"
      aria-label="Authentication Options"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={`
              flex-1 py-3.5 text-[15px] font-semibold rounded-xl relative z-10 
              transition-colors duration-300 cursor-pointer focus:outline-none
              ${isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}
            `}
          >
            {/* Sliding Pill Background using layoutId */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-[#3366FF] rounded-xl -z-10 shadow-[0_4px_15px_rgba(51,102,255,0.3)]"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <span className="relative z-20">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AuthTabs;
