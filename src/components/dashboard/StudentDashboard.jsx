import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import DhondiFooter from '../layout/DhondiFooter';
import ClubPhotoGalleryModal from './ClubPhotoGalleryModal';
import StudentPortfolio from './StudentPortfolio';
import StudentCertificates from './StudentCertificates';
import EventCalendar from './EventCalendar';
import VolunteerTracker from './VolunteerTracker';
import { mockClubs } from '../../utils/mockClubs';
import { useAuth } from '../../context/AuthContext';
import { getStoredRequests, saveRequest, getApprovedClubsForStudent } from '../../utils/mockRequests';
import { requestsApi } from '../../services/api';

const mockAnnouncements = [
  { id: '1', title: 'Pegasus 2026 Annual Cultural Fest Registrations Open!', date: 'August 03, 2026', club: 'AKRITI Club', urgency: 'High' },
  { id: '2', title: 'CMR HackFest 2026 36-Hour Hackathon Announced', date: 'August 02, 2026', club: 'Codeholics', urgency: 'Urgent' },
  { id: '3', title: 'Swachh Bharat Cleanliness Drive at Medchal', date: 'July 28, 2026', club: 'NSS Unit', urgency: 'Normal' }
];

const mockGalleryPhotos = [
  { id: 'p1', title: 'Pegasus 2026 Live Concert', url: '/images/akriti/akriti-live-concert-stage.jpg', club: 'AKRITI' },
  { id: 'p2', title: 'Flashmob 2K25 Dance Showcase', url: '/images/akriti/akriti-flashmob-2k25.jpg', club: 'AKRITI' },
  { id: 'p3', title: 'Grand Raag Stage & Fireworks', url: '/images/akriti/akriti-grand-raag-concert.jpg', club: 'AKRITI' },
  { id: 'p4', title: 'Traditional Cultural Day & Bathukamma', url: '/images/akriti/akriti-traditional-fest.jpg', club: 'AKRITI' },
  { id: 'p5', title: 'Graduation Ceremony 2K26 Dignitaries Stage', url: '/images/fap/fap-graduation-ceremony-stage.jpg', club: 'FAP' },
  { id: 'p6', title: 'Graduation Ceremony Medal & Degree Awards', url: '/images/fap/fap-graduation-ceremony-awards.jpg', club: 'FAP' },
  { id: 'p7', title: 'Campus Fest Stage Anchoring Live Shoot', url: '/images/fap/fap-anchors-stage-event.jpg', club: 'FAP' },
  { id: 'p8', title: 'Esperanza 2K26 Mr & Ms Freshers Winners', url: '/images/lexis/lexis-esperanza-freshers-winners.jpg', club: 'Lexis' },
  { id: 'p9', title: 'Esperanza 2K26 Rampwalk & Cultural Night', url: '/images/lexis/lexis-esperanza-rampwalk.jpg', club: 'Lexis' },
  { id: 'p10', title: 'Esperanza 2K26 Faculty Felicitation Stage', url: '/images/lexis/lexis-esperanza-faculty-stage.jpg', club: 'Lexis' },
  { id: 'p11', title: 'ATC-V Annual Training Camp Trophy Victory', url: '/images/ncc/ncc-atc-camp-trophy-ceremony.jpg', club: 'NCC Unit' },
  { id: 'p12', title: 'Candlelight Tribute Vigil at Main Entrance', url: '/images/ncc/ncc-candlelight-vigil-entrance.jpg', club: 'NCC Unit' },
  { id: 'p13', title: 'Night Candlelight Memorial March', url: '/images/ncc/ncc-night-memorial-march.jpg', club: 'NCC Unit' },
  { id: 'p14', title: 'Sustainable Campus Impact Summit 2026', url: '/images/nss/nss-sustainable-campus-awards.jpg', club: 'NSS Unit' },
  { id: 'p15', title: 'Campus Clubs Inauguration & MOU Ceremony', url: '/images/nss/nss-campus-club-inauguration.jpg', club: 'NSS Unit' },
  { id: 'p16', title: 'Hack The Verse - National Level Hackathon', url: '/images/codeholics/codeholics-hack-the-verse.png', club: 'Codeholics' }
];

const StudentDashboard = () => {
  const navigate = useNavigate();
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
    const reqPayload = {
      id: `req-${Date.now()}`,
      name: studentName,
      studentName: studentName,
      rollNo: studentRoll,
      studentRoll: studentRoll,
      branch: 'CMR Student',
      clubId: club.id,
      clubName: club.name,
      talent: club.category || 'General Member',
      email: user?.email || `${studentRoll.toLowerCase()}@cmr.edu.in`,
      studentEmail: user?.email || `${studentRoll.toLowerCase()}@cmr.edu.in`,
      status: 'pending',
      date: 'Just now'
    };

    saveRequest(reqPayload);
    requestsApi.apply(reqPayload).catch(err => {
      console.warn('Backend sync failed (local copy saved):', err);
    });

    setRequests(getStoredRequests());
    triggerToast(`Submitted join application for ${club.name}! ⏳ Sent to ${club.name} coordinators.`);
  };

  const handleDownload = (photoTitle) => {
    triggerToast(`Downloading high-res ${photoTitle}... 🚀`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans select-none overflow-x-hidden">
      {/* Role Sidebar */}
      <RoleSidebar activeSection={activeSection} setActiveSection={setActiveSection} currentRole="student" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        {/* Toast Alert */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-xl border border-blue-500 flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{toast}</span>
          </motion.div>
        )}

        {/* Top Header Banner */}
        {activeSection !== 'my-portfolio' && activeSection !== 'volunteer-hours' && activeSection !== 'my-certificates' && activeSection !== 'event-calendar' && (
          <div className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="relative space-y-2 max-w-xl z-10 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[11px] uppercase tracking-widest border border-blue-200 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  🎓 Student Member Portal
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Welcome to Student Hub
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-normal leading-relaxed">
                Browse official CMRTC clubs, manage annual membership fees, register for upcoming campus events, and view official announcements.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 text-right space-y-0.5 shadow-xs">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Enrolled Clubs</p>
                <p className="text-xl font-black text-blue-600">{enrolledClubs.length} Clubs</p>
              </div>
              <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 text-right space-y-0.5 shadow-xs">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Registered Events</p>
                <p className="text-xl font-black text-emerald-600">{registeredEvents.length} Events</p>
              </div>
            </div>
          </div>
        )}

        {/* Section: Home Dashboard */}
        {activeSection === 'home' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:border-blue-300 transition-all duration-200 text-left">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black border border-blue-100">
                  <Compass size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Campus Clubs</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">6 Active</h3>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:border-emerald-300 transition-all duration-200 text-left">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black border border-emerald-100">
                  <TicketCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Event Passes</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">{registeredEvents.length} Active</h3>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:border-amber-300 transition-all duration-200 text-left">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black border border-amber-100">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Membership Fee</p>
                  <h3 className="text-2xl font-black text-emerald-600 mt-0.5">Paid • Valid 2026</h3>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:border-purple-300 transition-all duration-200 text-left">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black border border-purple-100">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Activity Credits</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">120 Points</h3>
                </div>
              </div>
            </div>

            {/* Enrolled Clubs Row */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Compass size={18} className="text-blue-600" />
                  <span>My Joined Clubs</span>
                </h3>
                <button 
                  onClick={() => setActiveSection('join-club')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore All Clubs</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClubs.filter(c => enrolledClubs.includes(c.id)).map(club => (
                  <div key={club.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-left">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{club.name}</h4>
                      <p className="text-xs text-slate-500">{club.subtitle}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px]">
                      Active Member
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: My Portfolio */}
        {activeSection === 'my-portfolio' && (
          <StudentPortfolio onToast={(msg) => triggerToast(msg)} />
        )}

        {/* Section: Volunteer Hours Tracker */}
        {activeSection === 'volunteer-hours' && (
          <VolunteerTracker onToast={(msg) => triggerToast(msg)} />
        )}

        {/* Section: My Certificates */}
        {activeSection === 'my-certificates' && (
          <StudentCertificates onToast={(msg) => triggerToast(msg)} />
        )}

        {/* Section: Event Calendar */}
        {activeSection === 'event-calendar' && (
          <EventCalendar onToast={(msg) => triggerToast(msg)} />
        )}

        {/* Section: Join Club */}
        {activeSection === 'join-club' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <UserPlus size={20} className="text-blue-600" />
                  <span>Join Campus Student Clubs</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Explore CMRTC official student organizations and submit your membership application.</p>
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
                  <div key={club.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase border border-blue-200">
                          {club.category}
                        </span>
                        {isApproved ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                            Joined ✔
                          </span>
                        ) : isPending ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                            Pending Approval ⏳
                          </span>
                        ) : null}
                      </div>
                      <h4 className="text-base font-black text-slate-900">{club.name}</h4>
                      <p className="text-xs text-slate-500">{club.description || club.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-semibold">{club.membersCount || '120+'} Members</span>
                      {isApproved ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 cursor-not-allowed">
                          Active Member
                        </button>
                      ) : isPending ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200 cursor-not-allowed">
                          Request Pending ⏳
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyToClub(club)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-all active:scale-95"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-600" />
                  <span>My Clubs & Membership Status</span>
                </h3>
                <p className="text-xs text-slate-500">View active memberships, fee payment receipts, and pending coordinator approval status across all campus clubs.</p>
              </div>

              <button
                onClick={() => setActiveSection('join-club')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
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

                if (!isApproved && !isPending) return null;

                const feeLabel = club.id === 'ncc' || club.id === 'nss' ? 'Active • Free' : 'Active • Paid ₹250/yr';

                return (
                  <div 
                    key={club.id} 
                    className={`p-5 rounded-xl bg-slate-50 border ${isApproved ? 'border-emerald-200' : 'border-amber-200'} space-y-3 flex flex-col justify-between`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-slate-900 text-base">{club.name}</h4>
                        {isApproved ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs">
                            {feeLabel}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-extrabold text-xs">
                            Pending Core Approval ⏳
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        {isApproved 
                          ? `Membership Valid until 2027. Full access to ${club.name} workshops, events & certification.` 
                          : `Application submitted on ${reqMatch?.date || 'Recent'}. Awaiting approval by ${club.name} Coordinators.`}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      {isApproved ? (
                        <>
                          <button 
                            onClick={() => triggerToast(`Downloaded Membership Receipt PDF for ${club.name}`)}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all"
                          >
                            Download Receipt
                          </button>
                          <button
                            onClick={() => navigate(`/club/${club.id}/member-dashboard`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>Member Portal</span>
                            <ArrowRight size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-amber-700 font-mono font-medium">
                          Application under review by {club.name} Lead
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {mockClubs.every(club => {
                const reqMatch = requests.find(r => r.clubId === club.id && (r.rollNo.toUpperCase() === studentRoll.toUpperCase() || r.email === user?.email));
                return !enrolledClubs.includes(club.id) && reqMatch?.status !== 'approved' && reqMatch?.status !== 'pending';
              }) && (
                <div className="col-span-full p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <p className="text-sm font-bold text-slate-600">No active club memberships or pending applications found.</p>
                  <button
                    onClick={() => setActiveSection('join-club')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Browse & Join Clubs
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Event Passes & Registration */}
        {activeSection === 'event-registration' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs text-left">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TicketCheck size={20} className="text-blue-600" />
              <span>Upcoming Events & Registration Passes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase">AKRITI Club</span>
                    <h4 className="font-extrabold text-slate-900 text-base">Pegasus 2026 Annual Cultural Fest</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs">
                    Registered ✔
                  </span>
                </div>
                <p className="text-xs text-slate-500">CMR Auditorium • Seats Filled: 180/200</p>
                <button
                  onClick={() => triggerToast('Downloaded Event Entry QR Pass 🎫')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  View Event Pass
                </button>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase">Codeholics</span>
                    <h4 className="font-extrabold text-slate-900 text-base">CodeSprint 5.0 Coding Contest</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-xs">
                    Seats Full 🚫
                  </span>
                </div>
                <p className="text-xs text-slate-500">Computer Lab 4 • Seats Filled: 100/100 (Capacity Full)</p>
                <button
                  disabled
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs border border-slate-200 cursor-not-allowed"
                >
                  Registration Closed (Seats Full)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Announcements */}
        {activeSection === 'announcements' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs text-left">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Bell size={20} className="text-amber-500" />
              <span>Campus Club Announcements</span>
            </h3>

            <div className="space-y-3">
              {mockAnnouncements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{ann.club}</span>
                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{ann.date}</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                    {ann.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Photo Gallery */}
        {activeSection === 'photo-gallery' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
              <ImageIcon size={32} />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-slate-900">Campus Club Photo Gallery</h3>
              <p className="text-xs text-slate-500">
                View & download high-resolution event albums organized by Club and Event.
              </p>
            </div>

            <button
              onClick={() => setIsGalleryModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-2 mx-auto"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 max-w-xl text-left shadow-xs">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              <span>Student Member Profile</span>
            </h3>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-700">
              <p><strong className="text-slate-900">Name:</strong> {user?.name || 'Demo Student Member'}</p>
              <p><strong className="text-slate-900">Email:</strong> {user?.email || 'student@cmr.edu.in'}</p>
              <p><strong className="text-slate-900">Roll Number:</strong> {studentRoll}</p>
              <p><strong className="text-slate-900">Branch & Year:</strong> CSE - 3rd Year</p>
            </div>
          </div>
        )}

        <DhondiFooter className="mt-8 pt-4 border-t border-slate-200" />
      </main>
    </div>
  );
};

export default StudentDashboard;
