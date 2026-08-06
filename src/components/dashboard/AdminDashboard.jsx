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
  Download
} from 'lucide-react';
import RoleSidebar from '../layout/RoleSidebar';
import { mockClubs } from '../../utils/mockClubs';
import InfluencerSheetModal from './InfluencerSheetModal';
import { getStoredCertificates } from '../../utils/mockCertificates';

const initialUserList = [
  { id: 'u1', name: 'Ananya Sharma', email: 'ananya@cmr.edu.in', role: 'student', rollNo: '227R1A05A1' },
  { id: 'u2', name: 'Rohan Verma', email: 'rohan@cmr.edu.in', role: 'core', rollNo: '217R1A04B2' },
  { id: 'u3', name: 'Dr. Suresh Kumar', email: 'suresh@cmr.edu.in', role: 'faculty', rollNo: 'FAC058' },
  { id: 'u4', name: 'Admin Root', email: 'admin@cmr.edu.in', role: 'admin', rollNo: 'ADM001' }
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('manage-all-clubs');
  const [users, setUsers] = useState(initialUserList);
  const [clubs, setClubs] = useState(mockClubs);
  const [allCertificates, setAllCertificates] = useState(getStoredCertificates);
  const [isInfluencerOpen, setIsInfluencerOpen] = useState(false);
  const [toast, setToast] = useState('');

  // New Club Form State
  const [newClubName, setNewClubName] = useState('');
  const [newClubCategory, setNewClubCategory] = useState('TECHNICAL');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    triggerToast(`Updated user role to ${newRole.toUpperCase()}! 👑`);
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
    triggerToast('Generated MySQL & Redis Database Backup (.sql / .json)! 💾');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex font-sans select-none overflow-x-hidden">
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
              <p className="text-lg font-black text-purple-400">1,240 Users</p>
            </div>
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Active Clubs</p>
              <p className="text-lg font-black text-emerald-400">{clubs.length} Clubs</p>
            </div>
          </div>
        </div>

        {/* Section: Manage All Clubs */}
        {activeSection === 'manage-all-clubs' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Layers size={20} className="text-purple-400" />
              <span>College Club Registry & Management</span>
            </h3>

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

        {/* Section: User & Role Management (RBAC Table) */}
        {(activeSection === 'manage-all-users' || activeSection === 'manage-roles' || activeSection === 'manage-faculty') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-purple-400" />
              <span>User Roster & Role-Based Access Control (RBAC)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">ID / Roll No</th>
                    <th className="p-3">Current System Role</th>
                    <th className="p-3 text-right">Assign New Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 text-slate-400">{u.email}</td>
                      <td className="p-3 font-mono">{u.rollNo}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase border ${
                          u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                          u.role === 'faculty' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          u.role === 'core' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                          'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="h-8 px-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white cursor-pointer outline-none focus:border-purple-500"
                        >
                          <option value="student">Student Member</option>
                          <option value="core">Core Team</option>
                          <option value="faculty">Faculty Coordinator</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section: Reports & All Certificates Registry */}
        {(activeSection === 'reports' || activeSection === 'system-settings') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Award size={20} className="text-amber-400" />
                  <span>College-Wide Uploaded Certificates Registry ({allCertificates.length})</span>
                </h3>
                <p className="text-xs text-slate-400">View and audit all digital certificates issued by core coordinators and verified by faculty.</p>
              </div>
              <button
                onClick={() => triggerToast('Exported Certificate Registry Audit Report CSV 📊')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
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
          </div>
        )}

        {/* Section: Analytics & Database Management */}
        {(activeSection === 'view-analytics' || activeSection === 'database-management' || activeSection === 'system-settings') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-purple-400" />
                <span>College Analytics Engine</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                  <span>Total Portal Visits Today</span>
                  <span className="font-bold text-emerald-400">5,904 Views</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                  <span>Active Live Visitors</span>
                  <span className="font-bold text-blue-400">36 Live Users</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                  <span>Total Registered Student Accounts</span>
                  <span className="font-bold text-white">1,240 Students</span>
                </div>
              </div>

              {/* Influencer Roster Access for Admin */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
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

            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Database size={18} className="text-emerald-400" />
                <span>MySQL & System Database Maintenance</span>
              </h3>
              <p className="text-xs text-slate-400">
                Perform emergency database backups, clean temporary log caches, and sync MySQL schemas.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleBackupDatabase}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Database size={15} />
                  <span>Backup MySQL Database</span>
                </button>
                <button
                  onClick={() => triggerToast('Flushed Redis temporary session cache! 🧹')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <RefreshCw size={15} />
                  <span>Flush Cache</span>
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
