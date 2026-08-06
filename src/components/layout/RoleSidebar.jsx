import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import ProfileDropdown from './ProfileDropdown';
import { 
  Home, 
  Compass, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  TicketCheck, 
  Bell, 
  Image as ImageIcon, 
  Bookmark, 
  User, 
  Users, 
  UserCheck, 
  PlusCircle, 
  Upload, 
  DollarSign, 
  Award, 
  FileText, 
  Settings, 
  ShieldCheck, 
  CheckSquare, 
  BarChart3, 
  Layers, 
  Database, 
  Crown, 
  GraduationCap, 
  Shield, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Briefcase,
  Search
} from 'lucide-react';
import { useAuth, roleLabels } from '../../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';

const menuByRole = {
  student: [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'alumni-network', label: 'Alumni Network', icon: GraduationCap },
    { id: 'my-portfolio', label: 'My Portfolio', icon: Briefcase },
    { id: 'volunteer-hours', label: 'Volunteer Hours', icon: Clock },
    { id: 'my-certificates', label: 'My Certificates', icon: Award },
    { id: 'event-calendar', label: 'Event Calendar', icon: Calendar },
    { id: 'my-clubs', label: 'My Clubs', icon: Compass },
    { id: 'join-club', label: 'Join Club', icon: UserPlus },
    { id: 'membership-payment', label: 'Membership Status & Payment', icon: CreditCard },
    { id: 'club-events', label: 'Club Events', icon: Calendar },
    { id: 'event-registration', label: 'Event Registration', icon: TicketCheck },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'photo-gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'my-registered-events', label: 'My Registered Events', icon: Bookmark },
    { id: 'my-profile', label: 'My Profile', icon: User },
  ],
  core: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'alumni-network', label: 'Alumni Network', icon: GraduationCap },
    { id: 'event-calendar', label: 'Event Calendar', icon: Calendar },
    { id: 'manage-club', label: 'Manage Club', icon: Users },
    { id: 'membership-requests', label: 'Approve/Reject Members', icon: UserCheck },
    { id: 'manage-events', label: 'Manage Events', icon: PlusCircle },
    { id: 'event-registrations', label: 'View Event Registrations', icon: TicketCheck },
    { id: 'upload-photos', label: 'Upload Event Photos', icon: Upload },
    { id: 'manage-announcements', label: 'Manage Announcements', icon: Bell },
    { id: 'manage-sponsors', label: 'Manage Sponsors', icon: Award },
    { id: 'manage-budget', label: 'Manage Budget', icon: DollarSign },
    { id: 'core-team', label: 'Manage Core Team', icon: Users },
    { id: 'view-reports', label: 'View Reports', icon: FileText },
    { id: 'club-settings', label: 'Club Settings', icon: Settings },
  ],
  faculty: [
    { id: 'club-activities', label: 'View Club Activities', icon: Compass },
    { id: 'alumni-network', label: 'Alumni Network', icon: GraduationCap },
    { id: 'event-calendar', label: 'Event Calendar', icon: Calendar },
    { id: 'approve-events', label: 'Approve Major Events', icon: CheckSquare },
    { id: 'monitor-members', label: 'Monitor Members', icon: Users },
    { id: 'view-reports', label: 'View Reports', icon: FileText },
    { id: 'view-announcements', label: 'View Announcements', icon: Bell },
    { id: 'monitor-budgets', label: 'Monitor Budgets', icon: DollarSign },
  ],
  admin: [
    { id: 'manage-all-clubs', label: 'Manage All Clubs', icon: Layers },
    { id: 'alumni-network', label: 'Alumni Network', icon: GraduationCap },
    { id: 'event-calendar', label: 'Event Calendar', icon: Calendar },
    { id: 'manage-all-users', label: 'Manage All Users', icon: Users },
    { id: 'manage-roles', label: 'Manage Roles', icon: ShieldCheck },
    { id: 'manage-faculty', label: 'Manage Faculty Coordinators', icon: Shield },
    { id: 'view-analytics', label: 'View Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
    { id: 'database-management', label: 'Database Management', icon: Database },
  ]
};

const roleBadgeColors = {
  student: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  core: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  faculty: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
};

const roleIcons = {
  student: GraduationCap,
  core: Users,
  faculty: Shield,
  admin: Crown
};

const RoleSidebar = ({ activeSection, setActiveSection, currentRole = 'student' }) => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isOpenMobile, setIsIsOpenMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const effectiveRole = user?.role || currentRole;
  const menuItems = menuByRole[effectiveRole] || menuByRole.student;
  const RoleIcon = roleIcons[effectiveRole] || GraduationCap;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsIsOpenMobile(!isOpenMobile)}
          className="p-2.5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl flex items-center gap-2 text-xs font-bold"
        >
          {isOpenMobile ? <X size={18} /> : <Menu size={18} />}
          <span>Menu</span>
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpenMobile && (
        <div
          onClick={() => setIsIsOpenMobile(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-72 bg-[#090D18]/90 border-r border-white/10 p-5 flex flex-col justify-between z-50 transition-all duration-300 backdrop-blur-3xl select-none shadow-2xl
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand Header & Notification / Profile Controls */}
          <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 p-2 shadow-lg shadow-pink-500/20 flex items-center justify-center border border-white/20">
                <img src="/UniSphere.png" alt="UniSphere Logo" className="w-full h-full object-contain filter drop-shadow" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight leading-none text-gradient-pink">UniSphere</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CMRTC Portal</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                title="Search UniSphere (Ctrl + K)"
              >
                <Search size={16} className="text-pink-400" />
              </button>
              <NotificationCenter />
              <ProfileDropdown />
            </div>
          </div>

          {/* Current User & Role Badge */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-lg space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-indigo-600 to-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-inner ring-2 ring-white/10">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate">{user?.name || 'Logged User'}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email || 'user@cmr.edu.in'}</p>
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-extrabold flex items-center justify-between shadow-sm ${roleBadgeColors[effectiveRole]}`}>
              <span className="flex items-center gap-1.5 truncate">
                <RoleIcon size={14} />
                <span>{roleLabels[effectiveRole]}</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>

          {/* Navigation Menu List */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[48vh] pr-1">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Role Modules
            </p>
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsOpenMobile(false);
                  }}
                  className={`
                    w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-500/25 border border-white/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <IconComp size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white/80 animate-pulse" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-3 px-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <LogOut size={16} />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </aside>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default RoleSidebar;
