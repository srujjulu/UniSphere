import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Layers, 
  Users, 
  ShieldCheck, 
  Shield, 
  BarChart3, 
  FileText, 
  Settings, 
  Database, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2,
  Lock,
  Award,
  Download,
  Clock,
  Edit,
  Search,
  Check,
  X,
  Mail,
  Building2,
  GraduationCap
} from 'lucide-react';
import RoleSidebar from '../layout/RoleSidebar';
import { mockClubs, getGlobalSystemConfig, saveGlobalSystemConfig } from '../../utils/mockClubs';
import InfluencerSheetModal from './InfluencerSheetModal';
import EventCalendar from './EventCalendar';
import { getStoredCertificates } from '../../utils/mockCertificates';
import { getStoredVolunteerRecords, editStudentVolunteerHours } from '../../utils/mockVolunteerHours';
import { 
  downloadSQLDatabaseDump, 
  downloadJSONDatabaseSnapshot, 
  downloadCertificatesAuditCSV,
  triggerFileDownload 
} from '../../utils/downloadManager';

const initialUserList = [
  { id: 'u1', name: 'Ananya Sharma', email: 'ananya@cmr.edu.in', role: 'student', rollNo: '227R1A05A1', dept: 'CSE' },
  { id: 'u2', name: 'Rohan Verma', email: 'rohan@cmr.edu.in', role: 'core', rollNo: '217R1A04B2', dept: 'ECE' },
  { id: 'u3', name: 'Dr. Suresh Kumar', email: 'suresh@cmr.edu.in', role: 'faculty', rollNo: 'FAC058', dept: 'CSE' },
  { id: 'u4', name: 'Admin Root', email: 'admin@cmr.edu.in', role: 'admin', rollNo: 'ADM001', dept: 'Admin Cell' },
  { id: 'u5', name: 'Kavya Teja', email: 'kavya@cmr.edu.in', role: 'student', rollNo: '237R1A05C3', dept: 'IT' },
  { id: 'u6', name: 'Dr. K. Venkat Rao', email: 'venkatrao@cmr.edu.in', role: 'faculty', rollNo: 'FAC012', dept: 'CSE-AI/ML' },
  { id: 'u7', name: 'Sai Krishna', email: 'sai.k@cmr.edu.in', role: 'core', rollNo: '227R1A0588', dept: 'CSE' },
  { id: 'u8', name: 'Prof. Meenakshi Sundaram', email: 'meenakshi@cmr.edu.in', role: 'faculty', rollNo: 'FAC033', dept: 'Humanities & Sciences' }
];

const initialFacultyAssignments = [
  { clubId: 'akriti', clubName: 'AKRITI Cultural Club', facultyName: 'Dr. Suresh Kumar', designation: 'Dean Student Affairs', email: 'suresh@cmr.edu.in', dept: 'CSE', cabin: 'Block 2, Room 304' },
  { clubId: 'codeholics', clubName: 'Codeholics Tech Club', facultyName: 'Dr. K. Venkat Rao', designation: 'Head of Department', email: 'venkatrao@cmr.edu.in', dept: 'CSE-AI/ML', cabin: 'Block 1, HOD Office' },
  { clubId: 'lexis', clubName: 'The Lexis Literary Club', facultyName: 'Prof. Meenakshi Sundaram', designation: 'Senior Professor', email: 'meenakshi@cmr.edu.in', dept: 'Humanities & Sciences', cabin: 'Block 3, Room 102' },
  { clubId: 'photography', clubName: 'Film & Photography Club', facultyName: 'Dr. Rajesh Sharma', designation: 'Associate Professor', email: 'rajesh.ece@cmr.edu.in', dept: 'ECE', cabin: 'Block 1, Room 215' },
  { clubId: 'ncc', clubName: 'NCC Cadet Corps', facultyName: 'Major B. Satyanarayana', designation: 'Associate NCC Officer', email: 'satya.ncc@cmr.edu.in', dept: 'Mechanical', cabin: 'Parade Ground Cell' },
  { clubId: 'nss', clubName: 'NSS Service Unit', facultyName: 'Dr. P. Anitha', designation: 'NSS Program Officer', email: 'anitha.nss@cmr.edu.in', dept: 'Information Technology', cabin: 'Block 2, Room 108' }
];

const initialRbacMatrix = [
  { id: 'perm-1', module: 'Browse Clubs & Event Schedule', student: true, core: true, faculty: true, admin: true },
  { id: 'perm-2', module: 'Submit Join Requests & Pay Dues', student: true, core: false, faculty: false, admin: true },
  { id: 'perm-3', module: 'Event Ticket Registration & QR Passes', student: true, core: true, faculty: true, admin: true },
  { id: 'perm-4', module: 'Manage Club & Approve Members', student: false, core: true, faculty: true, admin: true },
  { id: 'perm-5', module: 'Create Events & Manage Budgets', student: false, core: true, faculty: true, admin: true },
  { id: 'perm-6', module: 'Upload Event Certificates & Service Hours', student: false, core: true, faculty: true, admin: true },
  { id: 'perm-7', module: 'Approve Major Events & Budget Release', student: false, core: false, faculty: true, admin: true },
  { id: 'perm-8', module: 'Verify & Sign Official Certificates', student: false, core: false, faculty: true, admin: true },
  { id: 'perm-9', module: 'Manage All Users & RBAC Permissions', student: false, core: false, faculty: false, admin: true },
  { id: 'perm-10', module: 'Database Backups & System Maintenance', student: false, core: false, faculty: false, admin: true }
];

const availableFacultyPool = [
  'Dr. Suresh Kumar (CSE)',
  'Dr. K. Venkat Rao (CSE-AI/ML)',
  'Prof. Meenakshi Sundaram (H&S)',
  'Dr. Rajesh Sharma (ECE)',
  'Major B. Satyanarayana (Mechanical)',
  'Dr. P. Anitha (IT)',
  'Dr. Ch. Ramesh (Civil)',
  'Prof. S. Narsimha (Data Science)'
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('manage-all-clubs');
  const [users, setUsers] = useState(initialUserList);
  const [clubs, setClubs] = useState(mockClubs);
  const [facultyAssignments, setFacultyAssignments] = useState(initialFacultyAssignments);
  const [rbacMatrix, setRbacMatrix] = useState(initialRbacMatrix);
  const [allCertificates, setAllCertificates] = useState(getStoredCertificates);
  const [isInfluencerOpen, setIsInfluencerOpen] = useState(false);
  const [toast, setToast] = useState('');

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserRoll, setNewUserRoll] = useState('');
  const [newUserDept, setNewUserDept] = useState('CSE');

  // New Club Form State
  const [newClubName, setNewClubName] = useState('');
  const [newClubCategory, setNewClubCategory] = useState('TECHNICAL');

  // Global System Configuration State
  const initialConfig = getGlobalSystemConfig();
  const [portalName, setPortalName] = useState(initialConfig.portalName || 'UniSphere - CMRTC Official Student Clubs Portal');
  const [emailDomain, setEmailDomain] = useState(initialConfig.emailDomain || '@cmr.edu.in');
  const [academicYear, setAcademicYear] = useState(initialConfig.academicYear || '2026-2027');
  const [recruitmentStatus, setRecruitmentStatus] = useState(initialConfig.recruitmentStatus || 'open');
  const [maintenanceMode, setMaintenanceMode] = useState(initialConfig.maintenanceMode || 'live');
  const [maxUploadLimit, setMaxUploadLimit] = useState(initialConfig.maxUploadLimit || '15');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Database Operations & Performance State
  const [redisMemory, setRedisMemory] = useState('24.6 MB / 512 MB');
  const [cacheHitRatio, setCacheHitRatio] = useState('99.1%');
  const [dbLatency, setDbLatency] = useState('1.2ms');
  const [tableStatus, setTableStatus] = useState('HEALTHY ✔');
  const [schemaHealth, setSchemaHealth] = useState('8 Tables Indexed');
  const [isFlushingRedis, setIsFlushingRedis] = useState(false);
  const [isOptimizingTables, setIsOptimizingTables] = useState(false);
  const [lastFlushedAt, setLastFlushedAt] = useState(null);
  const [lastOptimizedAt, setLastOptimizedAt] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    triggerToast(`Updated user role to ${newRole.toUpperCase()}! 👑`);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newUser = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      rollNo: newUserRoll.trim().toUpperCase() || `247R1A05${Math.floor(10 + Math.random() * 90)}`,
      dept: newUserDept
    };
    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRoll('');
    triggerToast(`Added new user account for ${newUser.name}! 👤`);
  };

  const handleDeleteUser = (userId, userName) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    triggerToast(`Removed user account for ${userName}. 🗑️`);
  };

  const handleReassignFaculty = (clubId, newFacultyStr) => {
    const facultyNameOnly = newFacultyStr.split(' (')[0];
    setFacultyAssignments(prev => prev.map(f => f.clubId === clubId ? { ...f, facultyName: facultyNameOnly } : f));
    triggerToast(`Assigned ${facultyNameOnly} to oversee ${clubId.toUpperCase()}! 🛡️`);
  };

  const handleTogglePermission = (permId, roleKey) => {
    setRbacMatrix(prev => prev.map(p => {
      if (p.id === permId) {
        const nextVal = !p[roleKey];
        return { ...p, [roleKey]: nextVal };
      }
      return p;
    }));
    triggerToast(`Updated ${roleKey.toUpperCase()} permission setting! 🔐`);
  };

  const handleCreateClub = (e) => {
    e.preventDefault();
    if (!newClubName.trim()) return;
    const newClub = {
      id: newClubName.toLowerCase().replace(/\s+/g, ''),
      name: newClubName.trim(),
      category: newClubCategory,
      subtitle: `${newClubCategory} Club of CMRTC`,
      views: 1,
      members: '1 (Lead)'
    };
    setClubs([...clubs, newClub]);
    setNewClubName('');
    triggerToast(`Created new college club: "${newClub.name}"! 🚀`);
  };

  const handleBackupDatabase = () => {
    triggerToast('Generating full MySQL database dump... 💾');
    const res = downloadSQLDatabaseDump(users);
    if (res.success) {
      setTimeout(() => triggerToast('Database backup downloaded: unisphere-database-backup.sql 🎉'), 300);
    }
  };

  const handleExportJSONSnapshot = () => {
    triggerToast('Generating JSON database snapshot... 📦');
    const res = downloadJSONDatabaseSnapshot(users);
    if (res.success) {
      setTimeout(() => triggerToast('JSON snapshot downloaded: unisphere-database-snapshot.json 🎉'), 300);
    }
  };

  const handleExportCertificatesAudit = () => {
    triggerToast('Generating Certificate Registry Audit CSV... 📊');
    const res = downloadCertificatesAuditCSV();
    if (res.success) {
      setTimeout(() => triggerToast('Audit report downloaded: certificates-audit.csv 🎉'), 300);
    }
  };

  const handleExportUsersCSV = () => {
    try {
      const headers = ['User ID', 'Full Name', 'Official Email', 'System Role', 'Roll / Employee No', 'Department / Cell'];
      const lines = [headers.join(',')];
      users.forEach(u => {
        const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
        lines.push([escape(u.id), escape(u.name), escape(u.email), escape(u.role), escape(u.rollNo), escape(u.dept)].join(','));
      });
      const csv = '\uFEFF' + lines.join('\r\n');
      triggerFileDownload(csv, 'unisphere-users-directory.csv', 'text/csv;charset=utf-8;');
      triggerToast('Downloaded Users Directory CSV: unisphere-users-directory.csv 🎉');
    } catch (e) {
      triggerToast('Error exporting users CSV');
    }
  };

  const handleExportClubsCSV = () => {
    try {
      const headers = ['Club ID', 'Club Name', 'Category', 'Description', 'Recruitment Status', 'Members Count'];
      const lines = [headers.join(',')];
      clubs.forEach(c => {
        const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
        lines.push([escape(c.id), escape(c.name), escape(c.category), escape(c.subtitle || c.description), escape(c.recruitment || 'open'), escape(c.membersCount || 50)].join(','));
      });
      const csv = '\uFEFF' + lines.join('\r\n');
      triggerFileDownload(csv, 'cmrtc-clubs-directory.csv', 'text/csv;charset=utf-8;');
      triggerToast('Downloaded Clubs Directory CSV: cmrtc-clubs-directory.csv 🎉');
    } catch (e) {
      triggerToast('Error exporting clubs CSV');
    }
  };

  const handleFlushRedisCache = () => {
    setIsFlushingRedis(true);
    triggerToast('Connecting to Redis in-memory cache... Purging temporary session keys 🧹');

    setTimeout(() => {
      try {
        sessionStorage.clear();
      } catch {}

      setRedisMemory('0.2 MB / 512 MB');
      setCacheHitRatio('100.0% (Clean)');
      setDbLatency('0.6ms');
      setLastFlushedAt(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsFlushingRedis(false);
      triggerToast('Flushed Redis in-memory cache successfully! Reclaimed 24.4 MB RAM 🧹⚡');
    }, 700);
  };

  const handleOptimizeTableIndexes = () => {
    setIsOptimizingTables(true);
    triggerToast('Running MySQL InnoDB OPTIMIZE & ANALYZE on all table indexes... ⚙️');

    setTimeout(() => {
      setTableStatus('OPTIMIZED ⚡');
      setSchemaHealth('8 Tables Defragmented • 100% Index Efficiency');
      setDbLatency('0.4ms');
      setLastOptimizedAt(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsOptimizingTables(false);
      triggerToast('Optimized and defragmented all MySQL table indexes! Latency down to 0.4ms ⚡');
    }, 900);
  };

  const handleSaveSystemConfig = (e) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    const updated = saveGlobalSystemConfig({
      portalName,
      emailDomain,
      academicYear,
      recruitmentStatus,
      maintenanceMode,
      maxUploadLimit
    });
    setTimeout(() => {
      setIsSavingSettings(false);
      triggerToast(`Saved global system configuration! Recruitment: ${recruitmentStatus.toUpperCase()} • Mode: ${maintenanceMode.toUpperCase()} ⚙️`);
    }, 400);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.rollNo.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans select-none overflow-x-hidden">
      {/* Role Sidebar */}
      <RoleSidebar activeSection={activeSection} setActiveSection={setActiveSection} currentRole="admin" />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-xl border border-purple-400 flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{toast}</span>
          </motion.div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900/80 p-6 rounded-[28px] border border-purple-500/30 backdrop-blur-xl">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-[11px] uppercase tracking-wider border border-purple-500/30">
              👑 Administrator System Console
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2">
              College-Wide Administration & RBAC Control
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Complete access to manage all college clubs, assign user roles, configure faculty coordinators, and maintain system databases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Total Users</p>
              <p className="text-lg font-black text-purple-400">{users.length} Registered</p>
            </div>
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Active Clubs</p>
              <p className="text-lg font-black text-emerald-400">{clubs.length} Clubs</p>
            </div>
          </div>
        </div>

        {/* Section: Event Calendar */}
        {activeSection === 'event-calendar' && (
          <EventCalendar onToast={(msg, type) => triggerToast(msg)} />
        )}

        {/* Section: Manage All Clubs */}
        {activeSection === 'manage-all-clubs' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Layers size={20} className="text-purple-400" />
                <span>College Club Registry & Management</span>
              </h3>
              <button
                onClick={handleExportClubsCSV}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-extrabold text-xs cursor-pointer border border-emerald-500/30 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Download size={13} />
                <span>Export Clubs Directory CSV</span>
              </button>
            </div>

            {/* Create Club Form */}
            <form onSubmit={handleCreateClub} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="text-sm font-extrabold text-white">Create New College Club</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Club Name (e.g. Robotics & IoT Club)"
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-purple-500"
                />
                <select
                  value={newClubCategory}
                  onChange={(e) => setNewClubCategory(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="TECHNICAL">TECHNICAL</option>
                  <option value="CULTURAL">CULTURAL</option>
                  <option value="PHOTOGRAPHY">PHOTOGRAPHY</option>
                  <option value="LITERARY">LITERARY</option>
                  <option value="DEFENCE">DEFENCE</option>
                  <option value="SERVICE">SERVICE</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Initialize College Club</span>
              </button>
            </form>

            {/* Clubs Table with Activate / Deactivate Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-base">{c.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{c.subtitle}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-[10px]">
                      {c.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/60">
                    <span className="text-slate-400">Club Status:</span>
                    <button
                      onClick={() => triggerToast(`Toggled ${c.name} status!`)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-extrabold text-[11px] border border-emerald-500/30 cursor-pointer"
                    >
                      Active ✔
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Faculty Lead:</span>
                    <span className="text-white font-bold">{c.facultyCoordinator || 'Dr. CMR Faculty'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1. Dedicated Section: Manage All Users */}
        {activeSection === 'manage-all-users' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Users size={20} className="text-purple-400" />
                  <span>College User Accounts Directory</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Search, add, filter, or remove student, core, and faculty accounts across campus.</p>
              </div>

              {/* Quick stats pills */}
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {users.filter(u => u.role === 'student').length} Students
                </span>
                <span className="px-3 py-1 rounded-xl bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  {users.filter(u => u.role === 'core').length} Core
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {users.filter(u => u.role === 'faculty').length} Faculty
                </span>
              </div>
            </div>

            {/* Quick Add User Form */}
            <form onSubmit={handleAddUser} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-3">
              <h4 className="text-xs font-black uppercase text-purple-300 tracking-wider">Quick Register New User</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-purple-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Email (@cmr.edu.in) *"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Roll / Employee ID"
                  value={newUserRoll}
                  onChange={(e) => setNewUserRoll(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white outline-none focus:border-purple-500"
                />
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none cursor-pointer"
                >
                  <option value="student">Student Member</option>
                  <option value="core">Core Team</option>
                  <option value="faculty">Faculty Coordinator</option>
                  <option value="admin">Administrator</option>
                </select>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md active:scale-95"
                >
                  <Plus size={14} />
                  <span>Add Account</span>
                </button>
              </div>
            </form>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, roll, email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  {['all', 'student', 'core', 'faculty', 'admin'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize cursor-pointer transition-colors ${
                        userRoleFilter === r
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleExportUsersCSV}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-extrabold text-xs cursor-pointer border border-purple-500/30 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
                >
                  <Download size={13} />
                  <span>Export Users CSV</span>
                </button>
              </div>
            </div>

            {/* User Directory Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">User Profile</th>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Roll / ID</th>
                    <th className="p-3.5">System Role</th>
                    <th className="p-3.5">Change Role</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        No users match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 font-black text-xs flex items-center justify-center border border-purple-500/30">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-white text-xs">{u.name}</p>
                            <p className="text-[10px] text-slate-500">{u.dept || 'Campus'}</p>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{u.email}</td>
                        <td className="p-3.5 font-mono font-bold text-purple-300">{u.rollNo}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase border ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            u.role === 'faculty' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            u.role === 'core' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="h-7 px-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white cursor-pointer outline-none focus:border-purple-500"
                          >
                            <option value="student">Student Member</option>
                            <option value="core">Core Team</option>
                            <option value="faculty">Faculty Coordinator</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Dedicated Section: Manage Roles (RBAC Matrix) */}
        {activeSection === 'manage-roles' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <ShieldCheck size={20} className="text-purple-400" />
                  <span>Role-Based Access Control (RBAC) & Permissions Engine</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Configure granular permission policies and capabilities for each user role in UniSphere.</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                RBAC Policy Active ✔
              </span>
            </div>

            {/* Role Explanation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-blue-500/30 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-blue-400">🎓 Student Member</span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">Join clubs, register for campus events, get QR passes, download certificates.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-pink-500/30 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-pink-400">⚡ Club Core Team</span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">Publish events, approve applicants, upload photo albums, issue participant certificates.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/30 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-amber-400">🛡️ Faculty Coordinator</span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">Oversight on major events, digital certificate verification, budget audit approvals.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-purple-500/30 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-purple-400">👑 System Administrator</span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">Full system governance, RBAC role assignment, MySQL backup & emergency controls.</p>
              </div>
            </div>

            {/* Granular Permission Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">System Module & Capability</th>
                    <th className="p-3.5 text-center text-blue-400">Student Member</th>
                    <th className="p-3.5 text-center text-pink-400">Club Core Team</th>
                    <th className="p-3.5 text-center text-amber-400">Faculty Coordinator</th>
                    <th className="p-3.5 text-center text-purple-400">System Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {rbacMatrix.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <Lock size={14} className="text-slate-500" />
                        <span>{item.module}</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleTogglePermission(item.id, 'student')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer border transition-all ${
                            item.student
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-400'
                          }`}
                        >
                          {item.student ? 'ALLOWED ✔' : 'DENIED ✕'}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleTogglePermission(item.id, 'core')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer border transition-all ${
                            item.core
                              ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-400'
                          }`}
                        >
                          {item.core ? 'ALLOWED ✔' : 'DENIED ✕'}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleTogglePermission(item.id, 'faculty')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer border transition-all ${
                            item.faculty
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-400'
                          }`}
                        >
                          {item.faculty ? 'ALLOWED ✔' : 'DENIED ✕'}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleTogglePermission(item.id, 'admin')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer border transition-all ${
                            item.admin
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-400'
                          }`}
                        >
                          {item.admin ? 'ALLOWED ✔' : 'DENIED ✕'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Dedicated Section: Manage Faculty Coordinators */}
        {activeSection === 'manage-faculty' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Shield size={20} className="text-amber-400" />
                  <span>Faculty Coordinators & Club Oversight Management</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Assign senior faculty coordinators, deans, and officers to oversee official student organizations.</p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30">
                {facultyAssignments.length} Official Coordinators
              </span>
            </div>

            {/* Grid of Campus Clubs & Assigned Faculty Coordinators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {facultyAssignments.map((f) => (
                <div key={f.clubId} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase">
                        {f.clubId.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">{f.dept}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-white">{f.clubName}</h4>
                      <p className="text-xs text-amber-400 font-bold mt-0.5">{f.designation}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-white font-extrabold">
                        <GraduationCap size={15} className="text-amber-400" />
                        <span>{f.facultyName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Mail size={13} />
                        <span>{f.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Building2 size={13} />
                        <span>{f.cabin}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 space-y-2">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400">Reassign Coordinator</label>
                    <select
                      value={`${f.facultyName} (${f.dept})`}
                      onChange={(e) => handleReassignFaculty(f.clubId, e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none cursor-pointer focus:border-amber-500"
                    >
                      {availableFacultyPool.map((fac, i) => (
                        <option key={i} value={fac}>{fac}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Reports & All Certificates Registry */}
        {activeSection === 'reports' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Award size={20} className="text-amber-400" />
                  <span>College-Wide Uploaded Certificates Registry ({allCertificates.length})</span>
                </h3>
                <p className="text-xs text-slate-400">View and audit all digital certificates issued by core coordinators and verified by faculty.</p>
              </div>
              <button
                onClick={handleExportCertificatesAudit}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Download size={14} />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allCertificates.map((cert) => (
                <div key={cert.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {cert.clubName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cert.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}`}>
                      {cert.status === 'verified' ? 'Verified ✅' : 'Pending Verification ⏳'}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">{cert.title}</h4>
                  <p className="text-xs text-slate-400">Event: <strong className="text-slate-200">{cert.eventName}</strong> • Recipient: <strong className="text-amber-400">{cert.studentRoll}</strong> ({cert.studentName})</p>
                  <p className="text-[11px] font-mono text-slate-500">ID: {cert.credentialId} • Issued: {cert.issueDate}</p>
                </div>
              ))}
            </div>

            {/* Section: Admin Volunteer Hours Audit & Editor */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Clock size={18} className="text-amber-400" />
                    <span>Admin Student Volunteer Hours Audit & Editor</span>
                  </h3>
                  <p className="text-xs text-slate-400">View and adjust total volunteer service hours for students across campus.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(getStoredVolunteerRecords()).map((rec) => (
                  <div key={rec.studentRoll} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-amber-400">{rec.studentRoll}</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">{rec.totalHours} Hours</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-white">{rec.studentName}</h4>
                      <p className="text-xs text-slate-400">{rec.department}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-700 flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={rec.totalHours}
                        id={`edit-vol-${rec.studentRoll}`}
                        className="w-20 h-8 px-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white outline-none"
                      />
                      <button
                        onClick={() => {
                          const val = document.getElementById(`edit-vol-${rec.studentRoll}`)?.value;
                          if (val !== undefined) {
                            editStudentVolunteerHours(rec.studentRoll, val, 'Admin Audit');
                            triggerToast(`Updated volunteer hours for ${rec.studentRoll} to ${val} Hours! 🛠️`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                      >
                        <Edit size={12} />
                        <span>Save Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: Analytics */}
        {activeSection === 'view-analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-purple-400" />
                <span>College Analytics Engine</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Total Portal Visits</p>
                  <p className="text-2xl font-black text-emerald-400">5,904 Views</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Active Live Visitors</p>
                  <p className="text-2xl font-black text-blue-400">36 Live Users</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Registered Student Accounts</p>
                  <p className="text-2xl font-black text-purple-400">{users.length} Registered</p>
                </div>
              </div>

              {/* Influencer Roster Access for Admin */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-pink-400" />
                    <span>Campus Influencer Roster</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage student creators & audition outreach</p>
                </div>
                <button
                  onClick={() => setIsInfluencerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles size={13} />
                  <span>Open Roster</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: System Settings */}
        {activeSection === 'system-settings' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Settings size={20} className="text-purple-400" />
                  <span>College Portal & System Global Configuration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure college domain restrictions, academic year sessions, recruitment schedules, and system preferences.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full font-extrabold text-[11px] border transition-all ${
                maintenanceMode === 'maintenance'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}>
                {maintenanceMode === 'maintenance' ? 'System Status: Maintenance Mode 🛠️' : 'System Status: Operational 🟢'}
              </span>
            </div>

            <form onSubmit={handleSaveSystemConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">Portal Name</label>
                  <input
                    type="text"
                    value={portalName}
                    onChange={(e) => setPortalName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">Authorized Email Domain</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900/80 border border-slate-700 font-mono text-xs font-bold text-purple-300"
                    />
                    <span className="px-2.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30 whitespace-nowrap">
                      Enforced ✔
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">Active Academic Year</label>
                  <select 
                    value={academicYear} 
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="2026-2027">Academic Year 2026 - 2027 (Current)</option>
                    <option value="2027-2028">Academic Year 2027 - 2028 (Upcoming)</option>
                    <option value="2028-2029">Academic Year 2028 - 2029 (Future Planning)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">Campus Club Recruitment Window</label>
                  <select 
                    value={recruitmentStatus} 
                    onChange={(e) => setRecruitmentStatus(e.target.value)}
                    className={`w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold outline-none cursor-pointer ${
                      recruitmentStatus === 'open' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    <option value="open">🟢 Open • Accepting Student Applications</option>
                    <option value="closed">🔴 Closed • Recruitment Paused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">System Maintenance Mode</label>
                  <select 
                    value={maintenanceMode} 
                    onChange={(e) => setMaintenanceMode(e.target.value)}
                    className={`w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold outline-none cursor-pointer ${
                      maintenanceMode === 'live' ? 'text-blue-400' : 'text-amber-400'
                    }`}
                  >
                    <option value="live">⚡ Live (Full Portal Access for Students & Faculty)</option>
                    <option value="maintenance">🛠️ Maintenance Mode (Admins Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">Max Media Upload Limit</label>
                  <select 
                    value={maxUploadLimit} 
                    onChange={(e) => setMaxUploadLimit(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="10">10 MB (Standard Photo & Certificate Upload)</option>
                    <option value="15">15 MB (Recommended)</option>
                    <option value="25">25 MB (High Resolution Albums)</option>
                    <option value="50">50 MB (Uncompressed Media)</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 pt-4 border-t border-slate-700 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className={`px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase cursor-pointer shadow-lg active:scale-95 transition-all flex items-center gap-2 ${
                    isSavingSettings ? 'opacity-80 cursor-wait' : ''
                  }`}
                >
                  <Save size={15} className={isSavingSettings ? 'animate-spin' : ''} />
                  <span>{isSavingSettings ? 'Saving Configuration...' : 'Save System Configuration'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section 2: Database Management */}
        {activeSection === 'database-management' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Database size={20} className="text-emerald-400" />
                  <span>MySQL & System Database Maintenance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect database engine status, trigger automated SQL dumps, flush memory caches, and audit table schemas.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                MySQL 8.0 • Connected ({dbLatency}) 🟢
              </span>
            </div>

            {/* Health & Engine Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Database Engine</p>
                <p className="text-lg font-black text-white">MySQL 8.0 Enterprise</p>
                <p className="text-[11px] text-emerald-400 font-bold">● Port 3306 • Latency: {dbLatency}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Redis Cache Memory</p>
                <p className="text-lg font-black text-emerald-400 font-mono">{redisMemory}</p>
                <p className="text-[11px] text-slate-400">
                  {lastFlushedAt ? `Flushed at ${lastFlushedAt}` : `Cache Hit Ratio: ${cacheHitRatio}`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Schema Health</p>
                <p className="text-lg font-black text-purple-300">{schemaHealth}</p>
                <p className="text-[11px] text-emerald-400 font-bold">
                  {lastOptimizedAt ? `● Optimized at ${lastOptimizedAt}` : '● Zero Corrupted Rows'}
                </p>
              </div>
            </div>

            {/* Database Tables Overview */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">Table Name</th>
                    <th className="p-3.5">Record Count</th>
                    <th className="p-3.5">Storage Engine</th>
                    <th className="p-3.5">Indexing Status</th>
                    <th className="p-3.5 text-right">Table Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40 font-mono text-[11px]">
                  <tr>
                    <td className="p-3.5 font-bold text-white font-sans">users</td>
                    <td className="p-3.5 text-purple-300">{users.length} rows</td>
                    <td className="p-3.5 text-slate-400">InnoDB</td>
                    <td className="p-3.5 text-emerald-400">PRIMARY (id, email)</td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold">{tableStatus}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white font-sans">clubs</td>
                    <td className="p-3.5 text-purple-300">{clubs.length} rows</td>
                    <td className="p-3.5 text-slate-400">InnoDB</td>
                    <td className="p-3.5 text-emerald-400">PRIMARY (id)</td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold">{tableStatus}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white font-sans">membership_requests</td>
                    <td className="p-3.5 text-purple-300">18 rows</td>
                    <td className="p-3.5 text-slate-400">InnoDB</td>
                    <td className="p-3.5 text-emerald-400">INDEX (clubId, rollNo)</td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold">{tableStatus}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white font-sans">certificates</td>
                    <td className="p-3.5 text-purple-300">{allCertificates.length} rows</td>
                    <td className="p-3.5 text-slate-400">InnoDB</td>
                    <td className="p-3.5 text-emerald-400">INDEX (credentialId)</td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold">{tableStatus}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white font-sans">volunteer_hours</td>
                    <td className="p-3.5 text-purple-300">84 rows</td>
                    <td className="p-3.5 text-slate-400">InnoDB</td>
                    <td className="p-3.5 text-emerald-400">INDEX (studentRoll)</td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold">{tableStatus}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Operations Bar */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="text-xs font-black uppercase text-white tracking-wider">Database Operations & Emergency Backups</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBackupDatabase}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <Database size={15} />
                  <span>Generate Full SQL Dump (.sql)</span>
                </button>
                <button
                  onClick={handleExportJSONSnapshot}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <Download size={15} />
                  <span>Export JSON Snapshot</span>
                </button>
                <button
                  onClick={handleFlushRedisCache}
                  disabled={isFlushingRedis}
                  className={`px-4 py-2.5 rounded-xl text-slate-200 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95 transition-all ${
                    isFlushingRedis ? 'bg-slate-700 opacity-80 cursor-wait' : 'bg-slate-800 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <RefreshCw size={15} className={isFlushingRedis ? 'animate-spin text-emerald-400' : ''} />
                  <span>{isFlushingRedis ? 'Flushing Redis...' : 'Flush Redis Cache'}</span>
                </button>
                <button
                  onClick={handleOptimizeTableIndexes}
                  disabled={isOptimizingTables}
                  className={`px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all ${
                    isOptimizingTables ? 'bg-blue-700 opacity-80 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Sparkles size={15} className={isOptimizingTables ? 'animate-spin text-amber-300' : ''} />
                  <span>{isOptimizingTables ? 'Optimizing Tables...' : 'Optimize Table Indexes'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Influencer Sheet Modal - Admin Full Access */}
      <InfluencerSheetModal
        isOpen={isInfluencerOpen}
        onClose={() => setIsInfluencerOpen(false)}
        clubName="CMRTC Campus (Admin View)"
        currentClubId="all"
        onToast={(msg) => triggerToast(msg)}
      />
    </div>
  );
};

export default AdminDashboard;

