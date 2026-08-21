import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowRight,
  Edit3,
  Phone,
  BookOpen,
  GraduationCap,
  Save,
  X
} from 'lucide-react';
import RoleSidebar from '../layout/RoleSidebar';
import DhondiFooter from '../layout/DhondiFooter';
import ClubPhotoGalleryModal from './ClubPhotoGalleryModal';
import StudentPortfolio from './StudentPortfolio';
import StudentCertificates from './StudentCertificates';
import EventCalendar from './EventCalendar';
import VolunteerTracker from './VolunteerTracker';
import EventPassModal from './EventPassModal';
import StudentEventsHeroSection from './StudentEventsHeroSection';
import { mockClubs, getStoredClubs } from '../../utils/mockClubs';
import { useAuth } from '../../context/AuthContext';
import { getStoredRequests, saveRequest, getApprovedClubsForStudent, cancelStudentClubRequest } from '../../utils/mockRequests';
import { getStoredCalendarEvents, toggleStudentEventRegistration } from '../../utils/mockCalendarEvents';
import { getStudentCertificates } from '../../utils/mockCertificates';
import { getStudentVolunteerRecord } from '../../utils/mockVolunteerHours';
import { downloadClubReceiptPDF } from '../../utils/pdfGenerator';
import { getStoredAnnouncements } from '../../utils/mockAnnouncements';
import { requestsApi } from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [clubs, setClubs] = useState(getStoredClubs);
  const [requests, setRequests] = useState(getStoredRequests);
  const [events, setEvents] = useState(getStoredCalendarEvents);
  const [announcements, setAnnouncements] = useState(getStoredAnnouncements);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedPassEvent, setSelectedPassEvent] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Student Member');
  const [editBranch, setEditBranch] = useState(user?.branch || 'Computer Science & Engineering (CSE)');
  const [editYear, setEditYear] = useState(user?.academicYear || '3rd Year • Semester 1');
  const [editPhone, setEditPhone] = useState(user?.phone || '+91 98765 43210');

  const studentRoll = user?.rollNumber || user?.rollNo || (user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA');
  const studentName = user?.name || 'Student Member';

  const [enrolledClubs, setEnrolledClubs] = useState(() => getApprovedClubsForStudent(studentRoll));

  useEffect(() => {
    const syncAll = () => {
      const currentReqs = getStoredRequests();
      setRequests(currentReqs);
      setEnrolledClubs(getApprovedClubsForStudent(studentRoll));
      setEvents(getStoredCalendarEvents());
      setAnnouncements(getStoredAnnouncements());
      setClubs(getStoredClubs());
    };
    syncAll();
    window.addEventListener('storage', syncAll);
    return () => window.removeEventListener('storage', syncAll);
  }, [studentRoll]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || 'Student Member');
      setEditBranch(user.branch || 'Computer Science & Engineering (CSE)');
      setEditYear(user.academicYear || '3rd Year • Semester 1');
      setEditPhone(user.phone || '+91 98765 43210');
    }
  }, [user]);

  const registeredEvents = events.filter(e => e.registeredStudents?.includes(studentRoll));
  const studentCerts = getStudentCertificates(studentRoll, studentName);
  const volunteerRecord = getStudentVolunteerRecord(studentRoll, studentName, user?.branch);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const activeOrPendingClubIds = Array.from(new Set([
    ...enrolledClubs,
    ...requests
      .filter(r => (r.rollNo.toUpperCase() === studentRoll.toUpperCase() || r.email === user?.email) && r.status === 'pending')
      .map(r => r.clubId)
  ]));
  const isMaxClubsReached = activeOrPendingClubIds.length >= 2;

  const handleApplyToClub = (club) => {
    if (club.recruitment === 'closed') {
      triggerToast(`⚠️ Recruitment is currently closed for ${club.name}.`);
      return;
    }

    if (activeOrPendingClubIds.length >= 2) {
      triggerToast('⚠️ Limit Reached: Students are allowed to join a maximum of 2 campus clubs.');
      return;
    }

    const reqPayload = {
      id: `req-${Date.now()}`,
      name: studentName,
      studentName: studentName,
      rollNo: studentRoll,
      studentRoll: studentRoll,
      branch: user?.branch || 'CSE',
      clubId: club.id,
      clubName: club.name,
      talent: club.category || 'General Member',
      email: user?.email || `${studentRoll.toLowerCase()}@cmr.edu.in`,
      studentEmail: user?.email || `${studentRoll.toLowerCase()}@cmr.edu.in`,
      status: 'pending',
      date: 'Just now'
    };

    const res = saveRequest(reqPayload);
    if (res && res.success === false) {
      triggerToast(`⚠️ ${res.error || 'Unable to join club.'}`);
      return;
    }

    requestsApi.apply(reqPayload).catch(err => {
      console.warn('Backend sync fallback:', err);
    });

    setRequests(getStoredRequests());
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Application submitted to ${club.name}! ⏳ Pending Coordinator Approval.`);
  };

  const handleCancelClubApplication = (clubId, clubName) => {
    cancelStudentClubRequest(clubId, studentRoll);
    if (user?.email) cancelStudentClubRequest(clubId, user.email);
    setRequests(getStoredRequests());
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Withdrew application for ${clubName || 'club'}.`);
  };

  const handleToggleEventReg = (eventId) => {
    toggleStudentEventRegistration(eventId, studentRoll);
    const updated = getStoredCalendarEvents();
    setEvents(updated);
    const currentEvt = updated.find(e => e.id === eventId);
    const isNowRegistered = currentEvt?.registeredStudents?.includes(studentRoll);
    triggerToast(
      isNowRegistered 
        ? `🎉 Registered for "${currentEvt.title}"! Entry pass generated.` 
        : `Cancelled registration for "${currentEvt.title}"`
    );
  };

  const handleViewPass = (event) => {
    setSelectedPassEvent(event);
    setIsPassModalOpen(true);
  };

  const handleDownloadReceipt = (club) => {
    triggerToast(`📄 Generating Official Fee Receipt for ${club.name}...`);
    const result = downloadClubReceiptPDF(club, user);
    if (result.success) {
      setTimeout(() => {
        triggerToast(`🎉 Receipt downloaded: ${result.filename}`);
      }, 500);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({
        name: editName,
        branch: editBranch,
        academicYear: editYear,
        phone: editPhone
      });
    }
    setIsEditingProfile(false);
    triggerToast('🎉 Profile updated successfully!');
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-900 flex font-sans select-none overflow-hidden">
      <RoleSidebar activeSection={activeSection} setActiveSection={setActiveSection} currentRole="student" />

      <div className="flex-1 flex flex-col h-screen overflow-hidden max-w-7xl mx-auto p-6 md:p-8 space-y-6 w-full min-w-0">
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

        {/* FIXED TOP HEADER: Welcome to Student Hub Banner */}
        {activeSection !== 'my-portfolio' && activeSection !== 'volunteer-hours' && activeSection !== 'my-certificates' && activeSection !== 'event-calendar' && (
          <div className="shrink-0 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs z-10">
            <div className="relative space-y-2 max-w-xl z-10 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[11px] uppercase tracking-widest border border-blue-200 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span>Welcome back, {studentName}</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-500">[{studentRoll}]</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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

        {/* SCROLLABLE MAIN CONTENT AREA (Below Fixed Welcome Header) */}
        <main className="flex-1 overflow-y-auto space-y-6 pr-1.5 scrollbar-thin">
          {activeSection === 'home' && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:border-blue-300 transition-all duration-200 text-left">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black border border-blue-100">
                  <Compass size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Campus Clubs</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">{enrolledClubs.length} Joined</h3>
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
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">{volunteerRecord.totalHours * 10 || 120} Points</h3>
                </div>
              </div>
            </div>

            {/* 1. UPCOMING EVENTS HERO & EXPLORER SECTION (Main Hero Dashboard) */}
            <StudentEventsHeroSection
              events={events}
              studentRoll={studentRoll}
              studentName={studentName}
              onToast={(msg, type) => triggerToast(msg)}
              onOpenPassModal={(evt) => {
                setSelectedPassEvent(evt);
                setIsPassModalOpen(true);
              }}
              onRefreshEvents={() => setEvents(getStoredCalendarEvents())}
            />

            {/* 2. MY JOINED CLUBS SECTION */}
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
                {enrolledClubs.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 col-span-full">
                    <p className="text-xs font-bold text-slate-600">You haven't joined any campus clubs yet.</p>
                    <p className="text-[11px] text-slate-500">Each student can join up to 2 clubs. Explore clubs to submit your application!</p>
                    <button
                      onClick={() => setActiveSection('join-club')}
                      className="mt-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Browse Clubs (Max 2 Allowed)
                    </button>
                  </div>
                ) : (
                  clubs.filter(c => enrolledClubs.includes(c.id)).map(club => (
                    <div key={club.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-left">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{club.name}</h4>
                        <p className="text-xs text-slate-500">{club.subtitle}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px]">
                        Active Member
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Latest Announcements Section on Home */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bell size={18} className="text-blue-600" />
                    <span>Latest Campus Announcements</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Stay updated with official broadcasts from club coordinators and college authorities.</p>
                </div>
                <button 
                  onClick={() => setActiveSection('announcements')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>View All Notices</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.slice(0, 4).map((ann) => (
                  <div key={ann.id} className="p-4.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-300 transition-colors shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-[10px]">
                          {ann.club || ann.clubName || 'Official'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{ann.date}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{ann.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.message || ann.details}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Publisher: <strong className="text-slate-700">{ann.publisherName || 'Coordinator'}</strong></span>
                      <span className={`font-bold ${ann.urgency === 'Critical' ? 'text-rose-600' : 'text-blue-600'}`}>{ann.urgency || 'Notice'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            </div>
          )}

        {activeSection === 'my-portfolio' && (
          <StudentPortfolio onToast={(msg) => triggerToast(msg)} />
        )}

        {activeSection === 'volunteer-hours' && (
          <VolunteerTracker onToast={(msg) => triggerToast(msg)} />
        )}

        {activeSection === 'my-certificates' && (
          <StudentCertificates onToast={(msg) => triggerToast(msg)} />
        )}

        {activeSection === 'event-calendar' && (
          <EventCalendar onToast={(msg) => triggerToast(msg)} />
        )}

        {/* FEED & NOTICES / ANNOUNCEMENTS TAB */}
        {activeSection === 'announcements' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Bell size={20} className="text-blue-600" />
                  <span>Campus Broadcasts & Club Notices</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time official announcements published by CMRTC club coordinators and administrators.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                {announcements.length} Live Notices
              </span>
            </div>

            <div className="space-y-3.5">
              {announcements.map((ann) => (
                <div 
                  key={ann.id} 
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all duration-200 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px] uppercase">
                        {ann.club || ann.clubName || 'Campus Broadcast'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        ann.urgency === 'Critical' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : ann.urgency === 'High Priority' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {ann.urgency || 'Official Notice'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{ann.date}</span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-base font-extrabold text-slate-900">{ann.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{ann.message || ann.details}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Published by: <strong className="text-slate-800">{ann.publisherName || 'Club Coordinator'}</strong></span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      <Sparkles size={12} /> Verified CMRTC Announcement
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: JOIN CLUBS */}
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

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isMaxClubsReached 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  Joined/Applied: <strong>{activeOrPendingClubIds.length}/2 Max</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clubs.map((club) => {
                const isJoined = enrolledClubs.includes(club.id);
                const reqMatch = requests.find(
                  r => r.clubId === club.id && (r.rollNo.toUpperCase() === studentRoll.toUpperCase() || r.email === user?.email)
                );
                const isPending = reqMatch?.status === 'pending';
                const isApproved = reqMatch?.status === 'approved' || isJoined;
                const isClosed = club.recruitment === 'closed';

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
                        ) : isClosed ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                            Recruitment Closed 🚫
                          </span>
                        ) : null}
                      </div>
                      <h4 className="text-base font-black text-slate-900">{club.name}</h4>
                      <p className="text-xs text-slate-500">{club.subtitle || club.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-semibold">{club.membersCount || '120+'} Members</span>
                      {isApproved ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 cursor-not-allowed">
                          Active Member
                        </button>
                      ) : isPending ? (
                        <div className="flex items-center gap-2">
                          <button disabled className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200 cursor-not-allowed">
                            Pending ⏳
                          </button>
                          <button
                            onClick={() => handleCancelClubApplication(club.id, club.name)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold cursor-pointer transition-colors"
                            title="Withdraw application"
                          >
                            Withdraw
                          </button>
                        </div>
                      ) : isClosed ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs border border-slate-300 cursor-not-allowed" title="Recruitment is currently paused for this club.">
                          Recruitment Closed
                        </button>
                      ) : isMaxClubsReached ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs border border-slate-300 cursor-not-allowed" title="Limit reached: Students can join a maximum of 2 clubs.">
                          Max 2 Clubs Reached 🚫
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

        {(activeSection === 'membership-payment' || activeSection === 'my-clubs') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-600" />
                  <span>My Clubs & Membership Status</span>
                </h3>
                <p className="text-xs text-slate-500">View active memberships, fee payment receipts, and pending coordinator approval status across campus clubs (Max 2 Clubs per Student).</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isMaxClubsReached ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  Quota: <strong>{activeOrPendingClubIds.length}/2 Active/Pending Clubs</strong>
                </span>
                <button
                  onClick={() => setActiveSection('join-club')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Browse All Clubs</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 items-stretch">
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
                    className={`p-6 rounded-2xl border ${
                      isApproved 
                        ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300' 
                        : 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                    } space-y-4 flex flex-col justify-between h-full transition-all duration-200`}
                  >
                    <div className="space-y-2.5 text-left">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <h4 className="font-black text-slate-900 text-lg tracking-tight">{club.name}</h4>
                        {isApproved ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{feeLabel}</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-xs flex items-center gap-1 shadow-2xs">
                            <span>Pending Core Approval ⏳</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {isApproved 
                          ? `Membership Valid until 2027. Full access to ${club.name} workshops, events, and authentic certifications.` 
                          : `Application submitted on ${reqMatch?.date || 'Recent'}. Currently under review by ${club.name} student coordinators.`}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                      {isApproved ? (
                        <>
                          <button 
                            onClick={() => handleDownloadReceipt(club)}
                            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all shadow-xs active:scale-95"
                          >
                            Download Receipt
                          </button>
                          <button
                            onClick={() => navigate(`/club/${club.id}/member-dashboard`)}
                            className="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors border border-slate-200/60"
                          >
                            <span>Member Portal</span>
                            <ArrowRight size={13} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                            <span>⏳ Under review by {club.name} Lead</span>
                          </span>
                          <button
                            onClick={() => handleCancelClubApplication(club.id, club.name)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer transition-colors"
                          >
                            Withdraw Application
                          </button>
                        </div>
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

        {activeSection === 'event-registration' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <StudentEventsHeroSection
              events={events}
              studentRoll={studentRoll}
              studentName={studentName}
              onToast={(msg, type) => triggerToast(msg)}
              onOpenPassModal={(evt) => {
                setSelectedPassEvent(evt);
                setIsPassModalOpen(true);
              }}
              onRefreshEvents={() => setEvents(getStoredCalendarEvents())}
            />
          </div>
        )}

        {activeSection === 'announcements' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Bell size={20} className="text-amber-500" />
                <span>Campus Club Announcements & Notice Feed</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {announcements.length} Active Notices
              </span>
            </div>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No campus announcements available.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-slate-300 transition-all shadow-2xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px] uppercase border border-blue-200">
                            {ann.club || ann.clubName}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            ann.urgency === 'Urgent' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            ann.urgency === 'High Priority' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            {ann.urgency}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 mt-1">{ann.title}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-normal leading-relaxed">{ann.message || ann.details}</p>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                      <span>Posted by: <strong className="text-slate-800 font-semibold">{ann.publisherName || 'Club Coordinator'}</strong></span>
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Clock size={12} />
                        <span>{ann.date}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

        <ClubPhotoGalleryModal
          isOpen={isGalleryModalOpen || activeSection === 'photo-gallery'}
          onClose={() => {
            setIsGalleryModalOpen(false);
            if (activeSection === 'photo-gallery') setActiveSection('home');
          }}
          initialClubId="all"
          onToast={(msg) => triggerToast(msg)}
        />

        <EventPassModal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          event={selectedPassEvent}
          studentUser={user}
          onToast={(msg) => triggerToast(msg)}
        />

        {(activeSection === 'my-profile' || activeSection === 'profile') && (
          <div className="space-y-6 max-w-3xl text-left">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                    {studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{studentName}</h3>
                    <p className="text-xs font-mono font-bold text-blue-600">Roll No: {studentRoll}</p>
                    <p className="text-xs text-slate-500">{user?.email || `${studentRoll.toLowerCase()}@cmr.edu.in`}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs cursor-pointer border border-blue-200 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 size={14} />
                  <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>

              {!isEditingProfile ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap size={14} className="text-blue-600" />
                      <span>Branch / Department</span>
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">{user?.branch || 'Computer Science & Engineering (CSE)'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen size={14} className="text-purple-600" />
                      <span>Academic Year</span>
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">{user?.academicYear || '3rd Year • Semester 1'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Phone size={14} className="text-emerald-600" />
                      <span>Contact Phone</span>
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">{user?.phone || '+91 98765 43210'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Award size={14} className="text-amber-600" />
                      <span>Extracurricular Standing</span>
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">{enrolledClubs.length} Active Clubs • {studentCerts.length} Certificates</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Student Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department / Branch</label>
                      <input
                        type="text"
                        required
                        value={editBranch}
                        onChange={(e) => setEditBranch(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Year</label>
                      <input
                        type="text"
                        required
                        value={editYear}
                        onChange={(e) => setEditYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Save size={14} />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Global Event Pass Modal */}
        <EventPassModal
          isOpen={isPassModalOpen}
          onClose={() => {
            setIsPassModalOpen(false);
            setSelectedPassEvent(null);
          }}
          event={selectedPassEvent}
          studentUser={{
            name: user?.name || studentName || 'Srujanya Maringanti',
            rollNumber: studentRoll || '237R1A05BA',
            rollNo: studentRoll || '237R1A05BA',
            email: user?.email || '237r1a05ba@cmrtc.ac.in',
            branch: user?.branch || 'Computer Science & Engineering (CSE)'
          }}
          onToast={(msg, type) => triggerToast(msg)}
        />

        {/* Club Photo Gallery Modal */}
        <ClubPhotoGalleryModal
          isOpen={isGalleryModalOpen}
          onClose={() => setIsGalleryModalOpen(false)}
          onToast={(msg, type) => triggerToast(msg)}
        />

        <DhondiFooter className="mt-8 pt-4 border-t border-slate-200" />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
