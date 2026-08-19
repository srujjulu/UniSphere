import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import ProfileDropdown from './ProfileDropdown';
import { 
  Home, 
  Compass, 
  UserPlus, 
  Calendar, 
  TicketCheck, 
  Bell, 
  Image as ImageIcon, 
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
  Menu,
  X,
  Briefcase,
  Search,
  Clock,
  Pin,
  PinOff,
  KeyRound,
  MessageSquare
} from 'lucide-react';
import { useAuth, roleLabels } from '../../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';

const menuByRole = {
  student: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'announcements', label: 'Feed & Notices', icon: Bell },
    { id: 'my-portfolio', label: 'Academics & Portfolio', icon: Briefcase },
    { id: 'my-certificates', label: 'Certificates & Honors', icon: Award },
    { id: 'volunteer-hours', label: 'Volunteer Hours', icon: Clock },
    { id: 'event-calendar', label: 'Calendar', icon: Calendar },
    { id: 'my-clubs', label: 'My Clubs & Hub', icon: Compass },
    { id: 'join-club', label: 'Applications & Joining', icon: UserPlus },
    { id: 'event-registration', label: 'Passes & Registrations', icon: TicketCheck },
    { id: 'photo-gallery', label: 'Photo Gallery', icon: ImageIcon },
  ],
  core: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'event-calendar', label: 'Event Calendar', icon: Calendar },
    { id: 'manage-club', label: 'Manage Club', icon: Users },
    { id: 'membership-requests', label: 'Approve/Reject Members', icon: UserCheck },
    { id: 'manage-events', label: 'Manage Events', icon: PlusCircle },
    { id: 'event-registrations', label: 'Event Registrations', icon: TicketCheck },
    { id: 'upload-photos', label: 'Upload Photos', icon: Upload },
    { id: 'manage-announcements', label: 'Announcements', icon: Bell },
    { id: 'manage-sponsors', label: 'Manage Sponsors', icon: Award },
    { id: 'manage-budget', label: 'Manage Budget', icon: DollarSign },
    { id: 'core-team', label: 'Core Team Roster', icon: Users },
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
    { id: 'manage-faculty', label: 'Faculty Coordinators', icon: Shield },
    { id: 'view-analytics', label: 'View Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
    { id: 'database-management', label: 'Database Management', icon: Database },
  ]
};

const roleBadgeColors = {
  student: 'bg-blue-50 text-blue-700 border-blue-200',
  core: 'bg-rose-50 text-rose-700 border-rose-200',
  faculty: 'bg-amber-50 text-amber-700 border-amber-200',
  admin: 'bg-purple-50 text-purple-700 border-purple-200'
};

const roleIcons = {
  student: GraduationCap,
  core: Users,
  faculty: Shield,
  admin: Crown
};

const RoleSidebar = ({ activeSection, setActiveSection, currentRole = 'student' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);

  const effectiveRole = user?.role || currentRole;
  const menuItems = menuByRole[effectiveRole] || menuByRole.student;
  const RoleIcon = roleIcons[effectiveRole] || GraduationCap;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2.5 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-lg flex items-center gap-2 text-xs font-bold"
        >
          {isOpenMobile ? <X size={18} /> : <Menu size={18} />}
          <span>Menu</span>
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full ${isPinned ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 p-4 flex flex-col justify-between z-50 transition-all duration-200 select-none shadow-xs
        ${isOpenMobile ? 'translate-x-0 !w-64' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-4">
          {/* Top Pin / Collapse Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-100 p-1 flex items-center justify-center border border-slate-200 shrink-0">
                <img src="/tc.jpeg" alt="CMRTC" className="w-full h-full object-contain" />
              </div>
              {isPinned && (
                <div className="truncate text-left leading-tight">
                  <h3 className="text-xs font-black text-slate-900 truncate">CMRTC Portal</h3>
                  <span className="text-[10px] font-semibold text-slate-500">{roleLabels[effectiveRole]}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden lg:flex items-center justify-center cursor-pointer"
            >
              {isPinned ? <Pin size={14} className="text-slate-400 rotate-45" /> : <PinOff size={14} className="text-slate-400" />}
            </button>
          </div>

          {/* Quick Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Search size={14} className="text-slate-400" />
            {isPinned && <span className="truncate">Search modules...</span>}
          </button>

          {/* User Quick Info */}
          {isPinned && (
            <div className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-between ${roleBadgeColors[effectiveRole]}`}>
              <span className="flex items-center gap-1.5 truncate">
                <RoleIcon size={14} />
                <span className="truncate">{user?.name || 'Student Member'}</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
            </div>
          )}

          {/* Navigation Menu List */}
          <nav className="space-y-0.5 overflow-y-auto max-h-[52vh] pr-0.5">
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
                  title={item.label}
                  className={`
                    w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                    {isPinned && <span className="truncate">{item.label}</span>}
                  </div>
                  {isActive && isPinned && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout Action Controls */}
        <div className="pt-3 border-t border-slate-100 space-y-1">
          <button
            onClick={() => {
              setActiveSection('my-profile');
              setIsOpenMobile(false);
            }}
            title="Profile"
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <User size={16} className="text-slate-400" />
            {isPinned && <span className="truncate">Profile</span>}
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign Out"
            className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <LogOut size={16} className="text-rose-500" />
            {isPinned && <span className="truncate">Logout</span>}
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
