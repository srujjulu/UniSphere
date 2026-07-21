import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { CmrLogo } from '../../utils/clubLogos';
import { LogOut, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [onlineCount, setOnlineCount] = useState(34);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Fluctuating live users count simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 28 && next <= 42 ? next : prev;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const userNameDisplay = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <nav className="h-[72px] w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 backdrop-blur-xl bg-[#090E1B]/60 sticky top-0 z-50">
      {/* Left side: College Logo & Portal Title */}
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center cursor-pointer p-1.5"
        >
          <CmrLogo />
        </motion.div>
        <div className="flex flex-col text-left leading-none">
          <span className="text-[14px] font-extrabold tracking-wide text-white uppercase font-display">CMR Campus</span>
          <span className="text-[11px] font-semibold text-[#FF8C32] tracking-wider uppercase">Clubs Portal</span>
        </div>
      </div>

      {/* Right side: Pulse Indicator, User Profile, Logout */}
      <div className="flex items-center gap-6 select-none">
        {/* Live Users Counter */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
          <div className="relative w-2.5 h-2.5 flex items-center justify-center">
            {/* Infinitely Pulsing Dot */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <div className="flex items-center gap-1 font-mono">
            <AnimatePresence mode="wait">
              <motion.span
                key={onlineCount}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="text-emerald-400 font-bold"
              >
                {onlineCount}
              </motion.span>
            </AnimatePresence>
            <span>online</span>
          </div>
        </div>

        {/* User Card (Avatar + Username) */}
        <div className="flex items-center gap-3">
          {/* Animated Avatar */}
          <motion.div
            whileHover={{ scale: 1.06, rotate: 2, boxShadow: "0 5px 15px rgba(255,140,50,0.25)" }}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3366FF] to-[#FF8C32] flex items-center justify-center font-bold text-sm text-white shadow-md cursor-pointer border border-white/10"
            title={user?.email}
          >
            {userInitial}
          </motion.div>
          <span className="hidden md:inline text-sm font-semibold text-slate-200">
            {userNameDisplay}
          </span>
        </div>

        {/* Logout Button with Slide Underline */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          className="text-sm font-semibold text-slate-400 hover:text-[#FF8C32] relative flex items-center gap-1.5 focus:outline-none focus-ring rounded px-1 transition-colors duration-300 cursor-pointer"
          aria-label="Logout"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
          <span 
            className="absolute bottom-[-4px] left-0 w-full h-[1.5px] bg-[#FF8C32] origin-left transition-transform duration-300 ease-out" 
            style={{ transform: isLogoutHovered ? 'scaleX(1)' : 'scaleX(0)' }}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
