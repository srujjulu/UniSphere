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
  Search,
  Clock
} from 'lucide-react';
import { useAuth, roleLabels } from '../../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';

const menuByRole = {
  student: [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'my-portfolio', label: 'My Portfolio', icon: Briefcase },
    { id: 'volunteer-hours', label: 'Volunteer Hours', icon: Clock },
    { id: 'my-certificates', label: 'My Certificates', icon: Award },
    { id: 'event-calendar', label: 'Event Calendar', icon: Calendar },
    { id: 'my-clubs', label: 'My Clubs & Memberships', icon: Compass },
    { id: 'join-club', label: 'Join Club', icon: UserPlus },
    { id: 'event-registration', label: 'Event Registration & Passes', icon: TicketCheck },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'photo-gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'my-profile', label: 'My Profile', icon: User },
  ],
  core: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
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
    { id: 'event-calendar', label: 'Event Calendar', icon: Calendar },
    { id: 'approve-events', label: 'Approve Major Events', icon: CheckSquare },
    { id: 'monitor-members', label: 'Monitor Members', icon: Users },
    { id: 'view-reports', label: 'View Reports', icon: FileText },
    { id: 'view-announcements', label: 'View Announcements', icon: Bell },
    { id: 'monitor-budgets', label: 'Monitor Budgets', icon: DollarSign },
  ],
  admin: [
    { id: 'manage-all-clubs', label: 'Manage All Clubs', icon: Layers },
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
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const effectiveRole = user?.role || currentRole;
  const menuItems = menuByRole[effectiveRole] || menuByRole.student;
  const RoleIcon = roleIcons[effectiveRole] || GraduationCap;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2.5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl flex items-center gap-2 text-xs font-bold"
        >
          {isOpenMobile ? <X size={18} /> : <Menu size={18} />}
          <span>Menu</span>
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-72 bg-[#0A0F1D] border-r border-white/[0.08] p-5 flex flex-col justify-between z-50 transition-all duration-300 select-none shadow-2xl
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand Header & Notification / Profile Controls */}
          <div className="flex items-center justify-between px-1 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/95 p-1 shadow-md flex items-center justify-center border border-white/20 overflow-hidden">
                <img src="/UniSphere.png" alt="UniSphere Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight leading-none">UniSphere</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>CMRTC Portal</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Search UniSphere (Ctrl + K)"
              >
                <Search size={15} className="text-indigo-400" />
              </button>
              <NotificationCenter />
              <ProfileDropdown />
            </div>
          </div>

          {/* Current User & Role Badge */}
          <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.07] space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Logged User'}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email || 'user@cmr.edu.in'}</p>
              </div>
            </div>

            <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-between ${roleBadgeColors[effectiveRole]}`}>
              <span className="flex items-center gap-1.5 truncate">
                <RoleIcon size={13} />
                <span>{roleLabels[effectiveRole]}</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>
          </div>

          {/* Navigation Menu List */}
          <nav className="space-y-1 overflow-y-auto max-h-[48vh] pr-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 text-left">
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
                    w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white/80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-3 border-t border-white/[0.08]">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
          >
            <LogOut size={15} />
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
