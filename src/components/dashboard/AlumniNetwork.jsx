import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Globe, 
  ExternalLink,
  Award, 
  CheckCircle2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Building2, 
  Compass, 
  UserCheck,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getStoredAlumniList, 
  addAlumniRecord, 
  updateAlumniRecord, 
  verifyAlumniRecord, 
  deleteAlumniRecord 
} from '../../utils/mockAlumni';

const AlumniNetwork = ({ onToast }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const [alumniList, setAlumniList] = useState(getStoredAlumniList);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [clubFilter, setClubFilter] = useState('All');

  // Modal State for Adding/Editing Alumni (Admin)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formGradYear, setFormGradYear] = useState('2024');
  const [formDept, setFormDept] = useState('Computer Science & Engineering');
  const [formClub, setFormClub] = useState('Codeholics Tech Club');
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formAchievements, setFormAchievements] = useState('');

  const syncData = () => {
    setAlumniList(getStoredAlumniList());
  };

  useEffect(() => {
    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);

  const openAddModal = () => {
    setEditingAlumni(null);
    setFormName('');
    setFormGradYear('2024');
    setFormDept('Computer Science & Engineering');
    setFormClub('Codeholics Tech Club');
    setFormCompany('');
    setFormRole('');
    setFormLinkedin('');
    setFormAchievements('');
    setIsModalOpen(true);
  };

  const openEditModal = (alm) => {
    setEditingAlumni(alm);
    setFormName(alm.name);
    setFormGradYear(alm.gradYear);
    setFormDept(alm.department);
    setFormClub(alm.club);
    setFormCompany(alm.company);
    setFormRole(alm.role);
    setFormLinkedin(alm.linkedin);
    setFormAchievements(alm.achievements);
    setIsModalOpen(true);
  };

  const handleSaveAlumni = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formCompany.trim()) return;

    if (editingAlumni) {
      updateAlumniRecord(editingAlumni.id, {
        name: formName.trim(),
        gradYear: formGradYear,
        department: formDept,
        club: formClub,
        company: formCompany.trim(),
        role: formRole.trim(),
        linkedin: formLinkedin.trim(),
        achievements: formAchievements.trim()
      });
      if (onToast) onToast(`Updated profile for Alumni "${formName}" 🎓`, 'success');
    } else {
      addAlumniRecord({
        name: formName.trim(),
        gradYear: formGradYear,
        department: formDept,
        club: formClub,
        company: formCompany.trim(),
        role: formRole.trim(),
        linkedin: formLinkedin.trim() || `https://linkedin.com/in/${formName.toLowerCase().replace(/\s+/g, '-')}`,
        achievements: formAchievements.trim() || 'CMRTC Distinguished Alumni',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
      });
      if (onToast) onToast(`Added new Alumni record for "${formName}" 🎉`, 'success');
    }

    setIsModalOpen(false);
    syncData();
  };

  const handleVerify = (alm) => {
    verifyAlumniRecord(alm.id, `${user?.name || 'Faculty Member'} (${user?.department || 'CMRTC Faculty Board'})`);
    syncData();
    if (onToast) onToast(`Verified alumni credentials for ${alm.name}! ✅`, 'success');
  };

  const handleDelete = (id, name) => {
    deleteAlumniRecord(id);
    syncData();
    if (onToast) onToast(`Removed alumni record for ${name}.`, 'info');
  };

  const filteredAlumni = alumniList.filter(alm => {
    const matchesSearch = 
      alm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alm.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alm.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alm.achievements.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'All' || alm.department === departmentFilter;
    const matchesClub = clubFilter === 'All' || alm.club.toLowerCase().includes(clubFilter.toLowerCase());

    return matchesSearch && matchesDept && matchesClub;
  });

  return (
    <div className="space-y-8 font-sans select-none pb-8">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/80 p-6 sm:p-8 rounded-[32px] border border-slate-800 backdrop-blur-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[11px] uppercase tracking-widest border border-pink-500/30 flex items-center gap-1.5 shadow-sm">
              <GraduationCap size={14} className="text-pink-400" />
              <span>CMRTC Alumni Association</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CMRTC Global Alumni Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Connect with distinguished CMRTC graduates leading engineering, design, and research at top global corporations.
          </p>
        </div>

        {/* Admin Add Alumni CTA Button */}
        {role === 'admin' && (
          <button
            onClick={openAddModal}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-pink-500/25 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Add New Alumni</span>
          </button>
        )}
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, company, role..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Electronics & Communication Engg">ECE</option>
            <option value="Information Technology">IT</option>
            <option value="Electrical & Electronics Engg">EEE</option>
          </select>

          <select
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 outline-none cursor-pointer"
          >
            <option value="All">All Clubs</option>
            <option value="Codeholics">Codeholics Tech</option>
            <option value="AKRITI">AKRITI Cultural</option>
            <option value="Lexis">The Lexis Club</option>
            <option value="NCC">NCC Cadet Corps</option>
            <option value="NSS">NSS Unit</option>
          </select>
        </div>
      </div>

      {/* 3. Alumni Cards Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alm) => (
          <motion.div
            key={alm.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[28px] bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 backdrop-blur-xl p-6 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={alm.avatar}
                    alt={alm.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-pink-300 transition-colors">
                      {alm.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <GraduationCap size={14} className="text-pink-400" />
                      <span>Class of {alm.gradYear} • {alm.department.split(' ')[0]}</span>
                    </p>
                  </div>
                </div>

                {/* Verification Badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                  alm.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  <CheckCircle2 size={11} />
                  <span>{alm.status === 'verified' ? 'Verified ✓' : 'Pending Verification'}</span>
                </span>
              </div>

              {/* Company & Role Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1">
                    <Building2 size={12} className="text-blue-400" />
                    <span>Current Position</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px]">
                    {alm.company}
                  </span>
                </div>
                <p className="text-xs font-black text-white">{alm.role}</p>
              </div>

              {/* Club Membership Tag */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Club Affiliation:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[10px] border border-pink-500/30 flex items-center gap-1">
                  <Compass size={11} />
                  <span>{alm.club}</span>
                </span>
              </div>

              {/* Key Achievements */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} className="text-amber-400" />
                  <span>Key Achievements</span>
                </span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                  "{alm.achievements}"
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              {/* LinkedIn Profile Button */}
              <a
                href={alm.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Globe size={14} className="text-blue-400" />
                <span>LinkedIn Profile</span>
              </a>

              {/* Faculty Verification CTA */}
              {role === 'faculty' && alm.status !== 'verified' && (
                <button
                  onClick={() => handleVerify(alm)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <UserCheck size={14} />
                  <span>Verify Info</span>
                </button>
              )}

              {/* Admin Edit & Delete Controls */}
              {role === 'admin' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(alm)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
                    title="Edit Alumni Profile"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(alm.id, alm.name)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 transition-colors cursor-pointer"
                    title="Delete Alumni Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. Admin Add/Edit Alumni Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <GraduationCap size={22} className="text-pink-400" />
                  <span>{editingAlumni ? 'Edit Alumni Profile' : 'Add New Alumni Record'}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAlumni} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Vikram Aditya"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Graduation Year *</label>
                    <select
                      value={formGradYear}
                      onChange={(e) => setFormGradYear(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white outline-none"
                    >
                      {['2025', '2024', '2023', '2022', '2021', '2020', '2019'].map(y => (
                        <option key={y} value={y}>Class of {y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Department</label>
                    <select
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white outline-none"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Electronics & Communication Engg">ECE</option>
                      <option value="Information Technology">IT</option>
                      <option value="Electrical & Electronics Engg">EEE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Club Affiliation</label>
                    <select
                      value={formClub}
                      onChange={(e) => setFormClub(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white outline-none"
                    >
                      <option value="Codeholics Tech Club">Codeholics Tech Club</option>
                      <option value="AKRITI Cultural Club">AKRITI Cultural Club</option>
                      <option value="The Lexis Club">The Lexis Club</option>
                      <option value="NCC Cadet Corps">NCC Cadet Corps</option>
                      <option value="NSS Unit CMRTC">NSS Unit CMRTC</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Current Company *</label>
                    <input
                      type="text"
                      required
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="e.g. Google, Microsoft, Adobe"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Current Job Role</label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formLinkedin}
                    onChange={(e) => setFormLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Key Achievements & Leadership</label>
                  <textarea
                    rows={3}
                    value={formAchievements}
                    onChange={(e) => setFormAchievements(e.target.value)}
                    placeholder="Key highlights, awards, former club president role..."
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs uppercase shadow-md cursor-pointer"
                  >
                    {editingAlumni ? 'Save Changes' : 'Add Alumni Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlumniNetwork;
