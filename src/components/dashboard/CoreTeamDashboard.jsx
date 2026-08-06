import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  PlusCircle, 
  TicketCheck, 
  Upload, 
  Bell, 
  Award, 
  DollarSign, 
  FileText, 
  Settings, 
  Check, 
  X, 
  Plus, 
  Sparkles, 
  Trash2, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import RoleSidebar from '../layout/RoleSidebar';
import ClubPhotoGalleryModal from './ClubPhotoGalleryModal';
import InfluencerSheetModal from './InfluencerSheetModal';
import EventCalendar from './EventCalendar';
import { useAuth } from '../../context/AuthContext';
import { mockClubs } from '../../utils/mockClubs';
import { getStoredRequests, updateRequestStatus } from '../../utils/mockRequests';
import { saveCertificate } from '../../utils/mockCertificates';

const mockEventsList = [
  { id: 'ev1', title: 'CMR HackFest 2026', date: 'Sept 05-07, 2026', seats: '150/200', budget: '₹25,000' },
  { id: 'ev2', title: 'CodeSprint 5.0 Coding Contest', date: 'August 20, 2026', seats: '85/100', budget: '₹8,000' }
];

const CoreTeamDashboard = () => {
  const { user } = useAuth();
  const [selectedClubId, setSelectedClubId] = useState(user?.assignedClub || 'codeholics');
  const activeClub = mockClubs.find(c => c.id === selectedClubId) || mockClubs[0];

  const [activeSection, setActiveSection] = useState('dashboard');
  const [allMemberRequests, setAllMemberRequests] = useState(getStoredRequests);
  const [events, setEvents] = useState(mockEventsList);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isInfluencerOpen, setIsInfluencerOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Certificate Upload Form State
  const [certEventName, setCertEventName] = useState('CMR HackFest 2026');
  const [certTitle, setCertTitle] = useState('Certificate of Excellence');
  const [certStudentRoll, setCertStudentRoll] = useState('237R1A05BA');
  const [certStudentName, setCertStudentName] = useState('Student Member');
  const [certDescription, setCertDescription] = useState('Awarded for outstanding event participation and achievement.');

  const handleUploadCertificate = (e) => {
    e.preventDefault();
    if (!certTitle.trim() || !certEventName.trim()) return;

    const newCert = {
      id: `cert-${Date.now()}`,
      title: certTitle.trim(),
      eventName: certEventName.trim(),
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      clubId: activeClub.id,
      clubName: activeClub.name,
      studentRoll: certStudentRoll.trim().toUpperCase(),
      studentName: certStudentName.trim(),
      status: 'pending_verification',
      verifiedBy: 'Pending Faculty Oversight',
      credentialId: `CMRTC-2026-${activeClub.id.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      description: certDescription.trim()
    };

    saveCertificate(newCert);
    setCertTitle('');
    triggerToast(`Uploaded & Issued Certificate for ${newCert.studentRoll}! 📄 Sent to Faculty Verification queue.`);
  };

  // Filter requests for currently selected club or all clubs
  const memberRequests = allMemberRequests.filter(
    r => (selectedClubId === 'all' || r.clubId === selectedClubId || !r.clubId) && r.status === 'pending'
  );

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventBudget, setNewEventBudget] = useState('₹10,000');

  // Photo Upload State
  const [uploadTitle, setUploadTitle] = useState('');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApproveMember = (id, name) => {
    updateRequestStatus(id, 'approved');
    setAllMemberRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
    triggerToast(`Approved ${name} into ${activeClub.name}! ✅`);
  };

  const handleRejectMember = (id, name) => {
    updateRequestStatus(id, 'rejected');
    setAllMemberRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
    triggerToast(`Rejected membership request for ${name}. ❌`);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const created = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      date: newEventDate || 'Upcoming 2026',
      seats: '0/100',
      budget: newEventBudget
    };
    setEvents([created, ...events]);
    setNewEventTitle('');
    setNewEventDate('');
    triggerToast(`Created event: ${created.title} for ${activeClub.name}! 🎉`);
  };

  const handlePhotoUpload = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    triggerToast(`Uploaded "${uploadTitle}" to ${activeClub.name} Photo Gallery! 📸`);
    setUploadTitle('');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex font-sans select-none overflow-x-hidden">
      <RoleSidebar activeSection={activeSection} setActiveSection={setActiveSection} currentRole="core" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Toast Alert */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-pink-600 text-white font-bold text-xs shadow-xl border border-pink-400 flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{toast}</span>
          </motion.div>
        )}

        {/* Top Header Banner */}
        <div className="relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-gradient-to-r from-[#0F172A]/90 via-pink-950/40 to-[#0F172A]/90 p-8 rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-3 max-w-2xl z-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-black text-[11px] uppercase tracking-widest border border-pink-500/30 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                ⚡ Core Team Coordinator Dashboard
              </span>

              {/* Interactive Managed Club Selector */}
              <div className="relative inline-block">
                <select
                  value={selectedClubId}
                  onChange={(e) => setSelectedClubId(e.target.value)}
                  className="h-8 pl-3 pr-8 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black text-xs outline-none cursor-pointer shadow-lg shadow-pink-600/25 appearance-none border border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  <option value="all" className="bg-slate-900 text-amber-400 font-bold">
                    🌟 View All Clubs Requests
                  </option>
                  {mockClubs.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white font-semibold">
                      Managed Club: {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight text-gradient-pink">
              {activeClub.name} Coordinator Control
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              Approve pending student members for {activeClub.name}, organize events, upload photo gallery assets, and manage budget allocations.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="glass-card px-5 py-3 rounded-2xl border border-white/10 text-right space-y-0.5">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Pending Approvals</p>
              <p className="text-xl font-black text-pink-400">{memberRequests.length} Requests</p>
            </div>
            <div className="glass-card px-5 py-3 rounded-2xl border border-white/10 text-right space-y-0.5">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Club Budget</p>
              <p className="text-xl font-black text-emerald-400">₹45,000</p>
            </div>
          </div>
        </div>

        {/* Section: Event Calendar */}
        {activeSection === 'event-calendar' && (
          <EventCalendar onToast={(msg, type) => triggerToast(msg)} />
        )}

        {/* Section: Core Dashboard Overview */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-pink-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black shadow-lg shadow-pink-500/10 border border-pink-500/30">
                  <UserCheck size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Applications</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">{memberRequests.length} Students</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shadow-lg shadow-blue-500/10 border border-blue-500/30">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Club Events</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">{events.length} Scheduled</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shadow-lg shadow-emerald-500/10 border border-emerald-500/30">
                  <DollarSign size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Remaining Budget</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-0.5">₹45,000</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-purple-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black shadow-lg shadow-purple-500/10 border border-purple-500/30">
                  <Award size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Sponsors</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">4 Corporate</h3>
                </div>
              </div>
            </div>

            {/* Quick Member Approval Box */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <UserCheck size={18} className="text-pink-400" />
                <span>Pending Student Membership Requests</span>
              </h3>

              {memberRequests.length === 0 ? (
                <p className="text-xs text-slate-400">No pending student membership requests.</p>
              ) : (
                <div className="space-y-2">
                  {memberRequests.map((req) => (
                    <div key={req.id} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs">{req.name} <span className="text-slate-400">({req.rollNo})</span></h4>
                        <p className="text-[11px] text-slate-400">{req.branch} • Domain: <span className="text-pink-400 font-bold">{req.talent}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveMember(req.id, req.name)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectMember(req.id, req.name)}
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Manage Events */}
        {activeSection === 'manage-events' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <PlusCircle size={20} className="text-pink-400" />
              <span>Event Creation & Management Hub</span>
            </h3>

            {/* Create Event Form */}
            <form onSubmit={handleCreateEvent} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="text-sm font-extrabold text-white">Create New Club Event</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Event Title (e.g. CodeSprint 2026)"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  placeholder="Date & Time (e.g. Oct 12, 2026)"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  placeholder="Budget Allocation (e.g. ₹15,000)"
                  value={newEventBudget}
                  onChange={(e) => setNewEventBudget(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Publish Event</span>
              </button>
            </form>

            {/* Scheduled Events List */}
            <div className="space-y-3">
              {[
                { id: 'ev1', title: 'CMR HackFest 2026', date: 'Sept 05-07, 2026', seats: '150/200', budget: '₹25,000', status: 'Published' },
                { id: 'ev2', title: 'Pegasus 2026 Cultural Fest', date: 'Oct 15, 2026', seats: '0/500', budget: '₹1,50,000', status: 'Pending Faculty Approval' },
                { id: 'ev3', title: 'CodeSprint 5.0 Hackathon', date: 'July 10, 2026', seats: '100/100', budget: '₹8,000', status: 'Completed' }
              ].map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-sm">{ev.title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        ev.status === 'Published' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        ev.status === 'Completed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ev.date} • Participants: <span className="text-emerald-400 font-bold">{ev.seats}</span> • Budget: <span className="text-white font-bold">{ev.budget}</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.status === 'Completed' ? (
                      <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>Upload Photo Album</span>
                      </button>
                    ) : ev.status === 'Pending Faculty Approval' ? (
                      <span className="text-xs text-amber-400 font-bold italic">Awaiting Faculty Sign-Off ⏳</span>
                    ) : (
                      <button
                        onClick={() => triggerToast(`Event "${ev.title}" marked as Completed! 📸`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Certificate PDF Form */}
            <div className="pt-6 border-t border-slate-800 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-400" />
                <h4 className="text-lg font-black text-white">Upload Certificate PDF After Event Completion</h4>
              </div>
              <p className="text-xs text-slate-400">Issue official event certificates for participants & winners. Certificates will be sent to Faculty Verification queue and automatically appear in the Student Dashboard.</p>

              <form onSubmit={handleUploadCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Completed Event</label>
                  <select
                    value={certEventName}
                    onChange={(e) => setCertEventName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none"
                  >
                    <option value="CMR HackFest 2026">CMR HackFest 2026</option>
                    <option value="Pegasus 2026 Cultural Fest">Pegasus 2026 Cultural Fest</option>
                    <option value="Word-Smith Parliamentary Debate">Word-Smith Parliamentary Debate</option>
                    <option value="Swachh Bharat Cleanliness Drive">Swachh Bharat Cleanliness Drive</option>
                    <option value="F9 Insta-Walk Photowalk">F9 Insta-Walk Photowalk</option>
                    <option value="NCC Parade Drills">NCC Parade Drills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Certificate Title / Category</label>
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. Certificate of Excellence / Winner"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Student Roll Number (or 'ALL')</label>
                  <input
                    type="text"
                    value={certStudentRoll}
                    onChange={(e) => setCertStudentRoll(e.target.value)}
                    placeholder="e.g. 237R1A05BA or ALL"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={certStudentName}
                    onChange={(e) => setCertStudentName(e.target.value)}
                    placeholder="e.g. Student Member"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Citation / Achievement Description</label>
                  <input
                    type="text"
                    value={certDescription}
                    onChange={(e) => setCertDescription(e.target.value)}
                    placeholder="Short description of achievement..."
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase cursor-pointer shadow-lg flex items-center gap-2 active:scale-95"
                  >
                    <Upload size={16} />
                    <span>Upload & Issue Certificate PDF</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Section: Upload Photos */}
        {activeSection === 'upload-photos' && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/30">
              <Upload size={32} />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-white">Event Photo Album Manager</h3>
              <p className="text-xs text-slate-400">
                As a Coordinator, you can upload new event albums, edit photo captions, or delete assets.
              </p>
            </div>

            <button
              onClick={() => setIsGalleryOpen(true)}
              className="px-8 py-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-xl transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Upload size={18} />
              <span>Open Photo Upload & Gallery Console</span>
            </button>
          </div>
        )}

        {/* Section: Manage Sponsors & Budget */}
        {(activeSection === 'manage-sponsors' || activeSection === 'manage-budget') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-400" />
              <span>Sponsor Sponsorships & Club Budget Allocation</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-sm">Google Cloud Campus</h4>
                <p className="text-xs text-emerald-400 font-black">Sponsorship: ₹20,000</p>
                <p className="text-[11px] text-slate-400">Title sponsor for HackFest 2026.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-sm">Red Bull Student Energy</h4>
                <p className="text-xs text-emerald-400 font-black">Sponsorship: ₹15,000</p>
                <p className="text-[11px] text-slate-400">Beverage sponsor for all campus hackathons.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-sm">Postman API Network</h4>
                <p className="text-xs text-emerald-400 font-black">Sponsorship: ₹10,000</p>
                <p className="text-[11px] text-slate-400">Swag & workshop API partner.</p>
              </div>
            </div>
          </div>
        )}
        {/* Section: Manage Club & Club Settings */}
        {(activeSection === 'manage-club' || activeSection === 'club-settings') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Settings size={20} className="text-pink-400" />
              <span>{activeClub.name} • Portal Configuration & Settings</span>
            </h3>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Club Official Title</label>
                <input
                  type="text"
                  readOnly
                  value={activeClub.name}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tagline / Short Subtitle</label>
                <input
                  type="text"
                  defaultValue={activeClub.subtitle || 'Official Campus Student Club'}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Member Recruitment Status</label>
                <select className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 outline-none">
                  <option value="open">Open • Accepting New Student Applications</option>
                  <option value="closed">Closed • Recruitment Paused</option>
                </select>
              </div>

              <button
                onClick={() => triggerToast(`Saved settings for ${activeClub.name}! ⚙️`)}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md"
              >
                Save Club Configuration
              </button>
            </div>
          </div>
        )}

        {/* Section: Full Approve / Reject Members Queue */}
        {activeSection === 'approve-members' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <UserCheck size={20} className="text-pink-400" />
                <span>Pending Membership Applications ({memberRequests.length})</span>
              </h3>
            </div>

            {memberRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pending membership applications.</p>
            ) : (
              <div className="space-y-3">
                {memberRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-white text-sm">{req.name} <span className="text-slate-400 text-xs">({req.rollNo})</span></h4>
                      <p className="text-xs text-slate-400 mt-0.5">{req.branch} • Domain: <span className="text-pink-400 font-bold">{req.talent}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveMember(req.id, req.name)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Approve Member</span>
                      </button>
                      <button
                        onClick={() => handleRejectMember(req.id, req.name)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section: View Event Registrations */}
        {activeSection === 'event-registrations' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <TicketCheck size={20} className="text-blue-400" />
              <span>Event Participant Registrations Roster</span>
            </h3>

            <div className="space-y-2">
              {[
                { name: 'Ananya Sharma', roll: '227R1A05A1', event: 'CMR HackFest 2026', pass: 'Seat #14 (Confirmed)' },
                { name: 'Rohan Verma', roll: '217R1A04B2', event: 'Pegasus 2026 Cultural Fest', pass: 'Seat #42 (Confirmed)' },
                { name: 'Kavya Teja', roll: '237R1A05C3', event: 'CodeSprint 5.0', pass: 'Seat #88 (Confirmed)' }
              ].map((reg, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">{reg.name} <span className="text-slate-400">({reg.roll})</span></h4>
                    <p className="text-[11px] text-slate-400">Event: <span className="text-pink-400 font-bold">{reg.event}</span></p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    {reg.pass}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Manage Announcements */}
        {activeSection === 'manage-announcements' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Bell size={20} className="text-amber-400" />
              <span>Post Club Announcement</span>
            </h3>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <input
                type="text"
                placeholder="Announcement Headline..."
                className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
              />
              <textarea
                rows={3}
                placeholder="Announcement details..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
              />
              <button
                onClick={() => triggerToast(`Published announcement for ${activeClub.name}! 📢`)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs cursor-pointer"
              >
                Publish Announcement
              </button>
            </div>
          </div>
        )}

        {/* Section: View Reports */}
        {activeSection === 'view-reports' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <FileText size={20} className="text-emerald-400" />
              <span>Club Activity & Audit Reports</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-sm">Monthly Participation Report</h4>
                <p className="text-xs text-slate-400">Total active members & event attendance log.</p>
                <button onClick={() => triggerToast('Downloaded Participation PDF')} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Download PDF</button>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-sm">Quarterly Financial Statement</h4>
                <p className="text-xs text-slate-400">Sponsorship collections & expense vouchers.</p>
                <button onClick={() => triggerToast('Downloaded Statement PDF')} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Download PDF</button>
              </div>
            </div>
          </div>
        )}

        {/* Club Photo Gallery Modal */}
        <ClubPhotoGalleryModal
          isOpen={isGalleryOpen || activeSection === 'upload-photos'}
          onClose={() => {
            setIsGalleryOpen(false);
            if (activeSection === 'upload-photos') setActiveSection('dashboard');
          }}
          initialClubId="all"
          onToast={(msg) => triggerToast(msg)}
        />

        {/* Influencer Sheet Modal */}
        <InfluencerSheetModal
          isOpen={isInfluencerOpen}
          onClose={() => setIsInfluencerOpen(false)}
          clubName="CMRTC Campus"
          currentClubId="all"
          onToast={(msg, type) => triggerToast(msg)}
        />
      </main>
    </div>
  );
};

export default CoreTeamDashboard;
