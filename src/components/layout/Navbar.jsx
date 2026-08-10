import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const roleLabels = {
  student: 'Student Member',
  core: 'Core Team',
  faculty: 'Faculty Coordinator',
  admin: 'Administrator',
};

const roleColors = {
  student: 'from-indigo-500 to-blue-600',
  core: 'from-pink-500 to-rose-600',
  faculty: 'from-amber-500 to-orange-500',
  admin: 'from-violet-500 to-purple-600',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [onlineCount, setOnlineCount] = useState(34);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
  const userNameDisplay = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const roleLabel = roleLabels[user?.role] || 'Member';
  const avatarGradient = roleColors[user?.role] || 'from-indigo-500 to-blue-600';

  return (
    <nav className="h-[72px] w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/[0.07] backdrop-blur-2xl bg-[#080C16]/80 sticky top-0 z-50 transition-all">
      {/* Left side: Integrated Brand Identity */}
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => navigate('/')}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/95 p-1 shadow-md border border-white/20 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <img src="/tc.jpeg" alt="CMRTC" className="w-full h-full object-contain" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/95 p-1 shadow-md border border-white/20 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <img src="/UniSphere.png" alt="UniSphere" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-extrabold tracking-tight text-white font-display">UniSphere</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/20 tracking-wider">
              PORTAL
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">
            CMR Technical Campus
          </span>
        </div>
      </div>

      {/* Center Navigation Links for Guests */}
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-slate-300">
        {[
          { label: 'Home', target: 'home' },
          { label: 'About Campus', target: 'about-cmrtc' },
          { label: 'Clubs', target: 'explore-clubs' },
          { label: 'Contact', target: 'contact' },
        ].map((link) => (
          <button
            key={link.label}
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                  const el = document.getElementById(link.target);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
              } else {
                const el = document.getElementById(link.target);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            }}
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer bg-transparent border-none outline-none"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right side: Live Pulse, Search, Profile / Auth Actions */}
      <div className="flex items-center gap-3 sm:gap-4 select-none">
        {/* Live Users Counter */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs font-medium text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={onlineCount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="text-emerald-400 font-bold"
              >
                {onlineCount}
              </motion.span>
            </AnimatePresence>
            <span className="text-slate-400">online</span>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-2.5">
            <NotificationCenter />

            {/* Clean Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.10] transition-all duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-sm text-white shadow-sm flex-shrink-0`}>
                  {userInitial}
                </div>
                {/* Name (md+) */}
                <span className="hidden md:block text-[12px] font-semibold text-slate-200 max-w-[80px] truncate leading-none">
                  {userNameDisplay.toUpperCase()}
                </span>
                {/* Chevron */}
                <ChevronDown
                  size={13}
                  className={`hidden md:block text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl bg-[#0F1627]/95 backdrop-blur-2xl border border-white/[0.10] shadow-2xl shadow-black/40 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3.5 border-b border-white/[0.07]">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-base text-white shadow flex-shrink-0`}>
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-white truncate leading-tight">{userNameDisplay.toUpperCase()}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{roleLabel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2 space-y-0.5">
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/dashboard'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-slate-200 hover:bg-white/[0.07] hover:text-white transition-all cursor-pointer text-left"
                      >
                        <LayoutDashboard size={15} className="text-indigo-400 flex-shrink-0" />
                        My Dashboard
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer text-left"
                      >
                        <LogOut size={15} className="flex-shrink-0" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

