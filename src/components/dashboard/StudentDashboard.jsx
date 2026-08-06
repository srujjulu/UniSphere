import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Download, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Award,
  ArrowRight
} from 'lucide-react';
import RoleSidebar from '../layout/RoleSidebar';
import ClubPhotoGalleryModal from './ClubPhotoGalleryModal';
import StudentPortfolio from './StudentPortfolio';
import { mockClubs } from '../../utils/mockClubs';
import { useAuth } from '../../context/AuthContext';
import { getStoredRequests, saveRequest, getApprovedClubsForStudent } from '../../utils/mockRequests';

const mockAnnouncements = [
  { id: '1', title: 'Pegasus 2026 Annual Cultural Fest Registrations Open!', date: 'August 03, 2026', club: 'AKRITI Club', urgency: 'High' },
  { id: '2', title: 'CMR HackFest 2026 36-Hour Hackathon Announced', date: 'August 02, 2026', club: 'Codeholics', urgency: 'Urgent' },
  { id: '3', title: 'Swachh Bharat Cleanliness Drive at Medchal', date: 'July 28, 2026', club: 'NSS Unit', urgency: 'Normal' }
];

const mockGalleryPhotos = [
  { id: 'p1', title: 'Pegasus Dance Auditions 2025', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80', club: 'AKRITI' },
  { id: 'p2', title: 'CMR HackFest Winner Awards', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80', club: 'Codeholics' },
  { id: 'p3', title: 'NCC Independence Day Parade', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80', club: 'NCC Unit' },
  { id: 'p4', title: 'Blood Donation Camp 2025', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&auto=format&fit=crop&q=80', club: 'NSS Unit' }
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [requests, setRequests] = useState(getStoredRequests);
  const [registeredEvents, setRegisteredEvents] = useState(['e1', 'e2']);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const studentRoll = user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA';
  const studentName = user?.name || 'Student Member';

  const [enrolledClubs, setEnrolledClubs] = useState(() => getApprovedClubsForStudent(studentRoll));

  // Sync approved clubs whenever local storage or requests state updates
  React.useEffect(() => {
    const syncApproved = () => {
      const current = getStoredRequests();
      setRequests(current);
      setEnrolledClubs(getApprovedClubsForStudent(studentRoll));
    };
    syncApproved();
    window.addEventListener('storage', syncApproved);
    return () => window.removeEventListener('storage', syncApproved);
  }, [studentRoll]);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApplyToClub = (club) => {
    saveRequest({
      id: `req-${Date.now()}`,
      name: studentName,
      rollNo: studentRoll,
      branch: 'CMR Student',
      clubId: club.id,
      clubName: club.name,
      talent: club.category || 'General Member',
      email: user?.email || `${studentRoll.toLowerCase()}@cmr.edu.in`,
      status: 'pending',
      date: 'Just now'
    });
    setRequests(getStoredRequests());
    triggerToast(`Submitted join application for ${club.name}! ⏳ Sent to ${club.name} coordinators.`);
  };

  const handleDownload = (photoTitle) => {
    triggerToast(`Downloading high-res ${photoTitle}... 🚀`);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex font-sans select-none overflow-x-hidden">
      {/* Role Sidebar */}
      <RoleSidebar activeSection={activeSection} setActiveSection={setActiveSection} currentRole="student" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        {/* Toast Alert */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-xl border border-blue-400 flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{toast}</span>
          </motion.div>
        )}

        {/* Top Header Banner */}
        {activeSection !== 'my-portfolio' && (
          <div className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-[#0F172A]/90 via-indigo-950/40 to-[#0F172A]/90 p-8 rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-2xl">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-2 max-w-xl z-10">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-black text-[11px] uppercase tracking-widest border border-blue-500/30 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  🎓 Student Member Portal
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight text-gradient-blue">
                Welcome to Student Hub!
              </h1>
              <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                Browse official CMRTC clubs, manage annual membership fees, register for upcoming campus events, and view official announcements.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="glass-card px-5 py-3 rounded-2xl border border-white/10 text-right space-y-0.5">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Enrolled Clubs</p>
                <p className="text-xl font-black text-blue-400">{enrolledClubs.length} Clubs</p>
              </div>
              <div className="glass-card px-5 py-3 rounded-2xl border border-white/10 text-right space-y-0.5">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Registered Events</p>
                <p className="text-xl font-black text-emerald-400">{registeredEvents.length} Events</p>
              </div>
            </div>
          </div>
        )}

        {/* Section: Home Dashboard */}
        {activeSection === 'home' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shadow-lg shadow-blue-500/10 border border-blue-500/30">
                  <Compass size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Campus Clubs</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">6 Active</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shadow-lg shadow-emerald-500/10 border border-emerald-500/30">
                  <TicketCheck size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Event Passes</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">{registeredEvents.length} Active</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-amber-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shadow-lg shadow-amber-500/10 border border-amber-500/30">
                  <CreditCard size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Membership Fee</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-0.5">Paid • Valid 2026</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-purple-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black shadow-lg shadow-purple-500/10 border border-purple-500/30">
                  <Award size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Activity Credits</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">120 Points</h3>
                </div>
              </div>
            </div>

            {/* Enrolled Clubs Row */}
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass size={18} className="text-blue-400" />
                  <span>My Joined Clubs</span>
                </h3>
                <button 
                  onClick={() => setActiveSection('join-club')}
                  className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore All Clubs</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClubs.filter(c => enrolledClubs.includes(c.id)).map(club => (
                  <div key={club.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-white text-base">{club.name}</h4>
                      <p className="text-xs text-slate-400">{club.subtitle}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
                      Active Member
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: My Portfolio (Achievement Portfolio) */}
        {activeSection === 'my-portfolio' && (
          <StudentPortfolio onToast={(msg, type) => triggerToast(msg)} />
        )}

        {/* Section: Join Club (Explore All Campus Clubs) */}
        {activeSection === 'join-club' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <UserPlus size={20} className="text-pink-400" />
                  <span>Join Campus Student Clubs</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Explore CMRTC official student organizations and submit your membership application.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockClubs.map((club) => {
                const isJoined = enrolledClubs.includes(club.id);
                const reqMatch = requests.find(
                  r => r.clubId === club.id && (r.rollNo.toUpperCase() === studentRoll.toUpperCase() || r.email === user?.email)
                );
                const isPending = reqMatch?.status === 'pending';
                const isApproved = reqMatch?.status === 'approved' || isJoined;

                return (
                  <div key={club.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[10px] uppercase">
                          {club.category}
                        </span>
                        {isApproved ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                            Joined ✔
                          </span>
                        ) : isPending ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            Pending Approval ⏳
                          </span>
                        ) : null}
                      </div>
                      <h4 className="text-base font-black text-white">{club.name}</h4>
                      <p className="text-xs text-slate-400">{club.description || club.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold">{club.membersCount || '120+ Members'}</span>
                      {isApproved ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-400 font-bold text-xs border border-emerald-500/30 cursor-not-allowed">
                          Active Member
                        </button>
                      ) : isPending ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl bg-amber-950/40 text-amber-300 font-bold text-xs border border-amber-500/30 cursor-not-allowed">
                          Request Pending ⏳
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyToClub(club)}
                          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          Apply to Join
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section: Membership Status & Payment / My Clubs */}
        {(activeSection === 'membership-payment' || activeSection === 'my-clubs') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-400" />
                  <span>My Clubs & Membership Status</span>
                </h3>
                <p className="text-xs text-slate-400">View active memberships, fee payment receipts, and pending coordinator approval status across all campus clubs.</p>
              </div>

              <button
                onClick={() => setActiveSection('join-club')}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <UserPlus size={14} />
                <span>Apply to More Clubs</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockClubs.map((club) => {
                const reqMatch = requests.find(
                  r => r.clubId === club.id && (r.rollNo.toUpperCase() === studentRoll.toUpperCase() || r.email === user?.email)
                );
                const isApproved = enrolledClubs.includes(club.id) || reqMatch?.status === 'approved';
                const isPending = reqMatch?.status === 'pending';

                // Only show clubs the student has requested or joined in My Clubs view
                if (!isApproved && !isPending) return null;

                const feeLabel = club.id === 'ncc' || club.id === 'nss' ? 'Active • Free' : 'Active • Paid ₹250/yr';

                return (
                  <div 
                    key={club.id} 
                    className={`p-5 rounded-2xl bg-slate-800/80 border ${isApproved ? 'border-emerald-500/30' : 'border-amber-500/30'} space-y-3 flex flex-col justify-between`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-white text-base">{club.name}</h4>
                        {isApproved ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                            {feeLabel}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs">
                            Pending Core Approval ⏳
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">
                        {isApproved 
                          ? `Membership Valid until 2027. Full access to ${club.name} workshops, events & certification.` 
                          : `Application submitted on ${reqMatch?.date || 'Recent'}. Awaiting approval by ${club.name} Coordinators.`}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-700/60">
                      {isApproved ? (
                        <>
                          <button 
                            onClick={() => triggerToast(`Downloaded Membership Receipt PDF for ${club.name}`)}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all"
                          >
                            Download Fee Receipt
                          </button>
                          <button
                            onClick={() => navigate(`/club/${club.id}/member-dashboard`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>Member Portal</span>
                            <ArrowRight size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-amber-400/90 font-mono font-medium">
                          Application under review by {club.name} Lead
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* If no clubs are joined or requested yet */}
              {mockClubs.every(club => {
                const reqMatch = requests.find(r => r.clubId === club.id && (r.rollNo.toUpperCase() === studentRoll.toUpperCase() || r.email === user?.email));
                return !enrolledClubs.includes(club.id) && reqMatch?.status !== 'approved' && reqMatch?.status !== 'pending';
              }) && (
                <div className="col-span-full p-8 rounded-2xl bg-slate-800/40 text-center space-y-3">
                  <p className="text-sm font-bold text-slate-300">No active club memberships or pending applications found.</p>
                  <button
                    onClick={() => setActiveSection('join-club')}
                    className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Browse & Join Clubs
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Club Events & Registration */}
        {(activeSection === 'club-events' || activeSection === 'event-registration' || activeSection === 'my-registered-events') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Calendar size={20} className="text-blue-400" />
              <span>Upcoming Events & Registration Passes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-pink-400 uppercase">AKRITI Club</span>
                    <h4 className="font-extrabold text-white text-base">Pegasus 2026 Annual Cultural Fest</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                    Registered ✔
                  </span>
                </div>
                <p className="text-xs text-slate-400">CMR Auditorium • Seats Filled: 180/200</p>
                <button
                  onClick={() => triggerToast('Downloaded Event Entry QR Pass 🎫')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  View Event Pass
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-400 uppercase">Codeholics</span>
                    <h4 className="font-extrabold text-white text-base">CodeSprint 5.0 Coding Contest</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-extrabold text-xs">
                    Seats Full 🚫
                  </span>
                </div>
                <p className="text-xs text-slate-400">Computer Lab 4 • Seats Filled: 100/100 (Capacity Full)</p>
                <button
                  disabled
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs border border-slate-700 cursor-not-allowed"
                >
                  Registration Closed (Seats Full)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Announcements */}
        {activeSection === 'announcements' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Bell size={20} className="text-amber-400" />
              <span>Campus Club Announcements</span>
            </h3>

            <div className="space-y-3">
              {mockAnnouncements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">{ann.club}</span>
                    <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{ann.date}</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    {ann.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Photo Gallery (View & Download Only) */}
        {activeSection === 'photo-gallery' && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/30">
              <ImageIcon size={32} />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-white">Campus Club Photo Gallery</h3>
              <p className="text-xs text-slate-400">
                View & download high-resolution event albums organized by Club and Event.
              </p>
            </div>

            <button
              onClick={() => setIsGalleryModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-xl transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <ImageIcon size={18} />
              <span>Launch Photo Gallery Hub</span>
            </button>
          </div>
        )}

        {/* Club Photo Gallery Modal */}
        <ClubPhotoGalleryModal
          isOpen={isGalleryModalOpen || activeSection === 'photo-gallery'}
          onClose={() => {
            setIsGalleryModalOpen(false);
            if (activeSection === 'photo-gallery') setActiveSection('home');
          }}
          initialClubId="all"
          onToast={(msg) => triggerToast(msg)}
        />

        {/* Section: My Profile */}
        {activeSection === 'my-profile' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 max-w-xl">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <User size={20} className="text-indigo-400" />
              <span>Student Member Profile</span>
            </h3>

            <div className="space-y-3 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-xs">
              <p><strong>Name:</strong> Demo Student Member</p>
              <p><strong>Email:</strong> student@cmr.edu.in</p>
              <p><strong>Roll Number:</strong> 227R1A0501</p>
              <p><strong>Branch & Year:</strong> CSE - 3rd Year</p>
              <p><strong>Role Level:</strong> Student Member (Restricted Access)</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
