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
      className="w-full bg-slate-100 p-1.5 rounded-2xl flex relative select-none border border-slate-200"
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
              flex-1 py-3 text-[14px] font-semibold rounded-xl relative z-10 
              transition-colors duration-200 cursor-pointer focus:outline-none
              ${isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            {/* Sliding Pill Background using layoutId */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white rounded-xl -z-10 shadow-sm border border-slate-200"
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
