import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  KeyRound, 
  LogOut, 
  ChevronDown, 
  Shield, 
  GraduationCap, 
  Users, 
  Crown, 
  X, 
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth, roleLabels } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const roleIcons = {
  student: GraduationCap,
  core: Users,
  faculty: Shield,
  admin: Crown
};

const roleBadgeColors = {
  student: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  core: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  faculty: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
};

const ProfileDropdown = ({ onToast }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Change Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const RoleIcon = roleIcons[user?.role || 'student'] || GraduationCap;
  const roleLabel = roleLabels[user?.role || 'student'] || 'Student Member';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (onToast) onToast('Password updated successfully! 🔒', 'success');
    setIsPasswordModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative inline-block text-left select-none z-30">
      {/* Profile Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer shadow-md"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-indigo-600 to-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-inner">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
            {user?.name || 'CMRTC User'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
            {roleLabel}
          </p>
        </div>

        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-0 top-full mt-2 w-64 max-w-[calc(100vw-32px)] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 z-50 text-slate-200 space-y-3"
            >
              {/* Profile Card Header */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{user?.name || 'CMRTC Student'}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email || 'student@cmr.edu.in'}</p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-slate-800/80">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex items-center gap-1 ${roleBadgeColors[user?.role || 'student']}`}>
                    <RoleIcon size={11} />
                    <span>{roleLabel}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">CMRTC 2026</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-1 text-xs font-bold">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User size={15} className="text-blue-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <KeyRound size={15} className="text-amber-400" />
                  <span>Change Password</span>
                </button>

                <div className="pt-1 border-t border-slate-900">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* My Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black flex items-center gap-2">
                <User size={20} className="text-blue-400" />
                <span>CMRTC Official Student Profile</span>
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              <p><strong>Full Name:</strong> {user?.name || 'Demo Student'}</p>
              <p><strong>Institutional Email:</strong> {user?.email || 'student@cmr.edu.in'}</p>
              <p><strong>Roll / ID Number:</strong> 237R1A0501</p>
              <p><strong>Branch & Department:</strong> Computer Science Engineering (CSE)</p>
              <p><strong>Academic Year:</strong> 3rd Year • Section A</p>
              <p><strong>System Role:</strong> <span className="text-blue-400 font-bold">{roleLabel}</span></p>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black flex items-center gap-2">
                <KeyRound size={20} className="text-amber-400" />
                <span>Change Portal Password</span>
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-left">
              {passwordError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Current Password *</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase cursor-pointer shadow-md"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
