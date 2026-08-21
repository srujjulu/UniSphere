import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import LiveClock from './LiveClock';

const roleLabels = {
  student: 'Student',
  core: 'Core Team',
  faculty: 'Faculty Coordinator',
  admin: 'Administrator',
};

const roleColors = {
  student: 'from-blue-600 to-indigo-600',
  core: 'from-pink-500 to-rose-600',
  faculty: 'from-amber-500 to-orange-500',
  admin: 'from-purple-600 to-indigo-600',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const userNameDisplay = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const roleLabel = roleLabels[user?.role] || 'Student';
  const avatarGradient = roleColors[user?.role] || 'from-blue-600 to-indigo-600';

  return (
    <nav className="h-[68px] w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      {/* Left side: CMR Brand Identity */}
      <div 
        className="flex items-center gap-3 cursor-pointer group select-none" 
        onClick={() => navigate('/')}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <img src="/tc.jpeg" alt="CMRTC" className="w-full h-full object-contain" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <img src="/UniSphere.png" alt="UniSphere" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-slate-900 font-sans">
              <span className="font-extrabold text-slate-900 tracking-wider">CMRTC</span> <span className="font-normal text-slate-600 text-sm">{user ? roleLabel : 'UniSphere'}</span>
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 tracking-wide">
            CMR Technical Campus
          </span>
        </div>
      </div>

      {/* Center Navigation Links for Guests */}
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-600">
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
            className="px-4 py-1.5 rounded-full hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all cursor-pointer bg-transparent border-none outline-none"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right side: Live Clock & Profile Actions */}
      <div className="flex items-center gap-4 sm:gap-6 select-none">
        {/* Live Institutional Clock */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <LiveClock />
        </div>

        {user ? (
          <div className="flex items-center gap-2.5">
            {/* Clean Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-sm text-white shadow-sm flex-shrink-0`}>
                  {userInitial}
                </div>
                {/* Name */}
                <span className="hidden md:block text-[12px] font-bold text-slate-800 max-w-[90px] truncate leading-none">
                  {userNameDisplay.toUpperCase()}
                </span>
                {/* Chevron */}
                <ChevronDown
                  size={13}
                  className={`hidden md:block text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
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
                    className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-base text-white shadow flex-shrink-0`}>
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">{userNameDisplay.toUpperCase()}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{roleLabel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2 space-y-0.5">
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/dashboard'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer text-left"
                      >
                        <LayoutDashboard size={15} className="text-blue-600 flex-shrink-0" />
                        My Dashboard
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer text-left"
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
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

