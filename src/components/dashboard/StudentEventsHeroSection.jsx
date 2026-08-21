import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  TicketCheck, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ChevronRight, 
  Share2, 
  Info, 
  Check, 
  X, 
  UserCheck, 
  Mail, 
  Phone,
  Bookmark,
  Award,
  AlertCircle,
  Download,
  ShieldCheck,
  User,
  GraduationCap
} from 'lucide-react';
import { 
  clubColors, 
  getEventCapacity, 
  registerStudentForEvent, 
  cancelStudentEventRegistration 
} from '../../utils/mockCalendarEvents';
import EventPassModal from './EventPassModal';
import { useAuth } from '../../context/AuthContext';

const StudentEventsHeroSection = ({ 
  events = [], 
  studentRoll = '237R1A05BA', 
  studentName = 'Srujanya Maringanti',
  onToast, 
  onOpenPassModal,
  onRefreshEvents
}) => {
  const { user } = useAuth();
  const [activeTimeFilter, setActiveTimeFilter] = useState('all'); // 'all' | 'today' | 'week' | 'month' | 'registered'
  const [selectedClubFilter, setSelectedClubFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null);

  // Registration Form State Modal
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [formName, setFormName] = useState(user?.name || studentName || 'Srujanya Maringanti');
  const [formRoll, setFormRoll] = useState(user?.rollNumber || user?.rollNo || studentRoll || '237R1A05BA');
  const [formEmail, setFormEmail] = useState(user?.email || '237r1a05ba@cmrtc.ac.in');
  const [formBranch, setFormBranch] = useState(user?.branch || 'Computer Science & Engineering (CSE)');
  const [formYear, setFormYear] = useState(user?.academicYear || '3rd Year • Semester 1');
  const [formPhone, setFormPhone] = useState(user?.phone || '+91 98765 43210');
  const [formNotes, setFormNotes] = useState('');

  // Pass Modal State
  const [passEvent, setPassEvent] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Sync initial user details into form
  useEffect(() => {
    if (user) {
      setFormName(user.name || studentName || 'Srujanya Maringanti');
      setFormRoll(user.rollNumber || user.rollNo || studentRoll || '237R1A05BA');
      setFormEmail(user.email || '237r1a05ba@cmrtc.ac.in');
      setFormBranch(user.branch || 'Computer Science & Engineering (CSE)');
      setFormYear(user.academicYear || '3rd Year • Semester 1');
      setFormPhone(user.phone || '+91 98765 43210');
    }
  }, [user, studentName, studentRoll]);

  // Filter non-holiday events
  const validEvents = events.filter(e => e.category !== 'Holiday');

  // Find nearest upcoming event (sorted by date)
  const now = new Date();
  const upcomingSorted = [...validEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const nearestEvent = upcomingSorted.find(e => new Date(e.date) >= new Date(now.setHours(0,0,0,0))) || upcomingSorted[0];

  // Countdown state for nearest event
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nearestEvent) return;

    const calculateTimeLeft = () => {
      const targetDate = new Date(`${nearestEvent.date}T09:00:00`);
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [nearestEvent]);

  // Filtering Logic
  const filteredEvents = validEvents.filter(evt => {
    // Club filter
    if (selectedClubFilter !== 'all' && evt.clubId !== selectedClubFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title?.toLowerCase().includes(q);
      const matchClub = evt.clubName?.toLowerCase().includes(q);
      const matchVenue = evt.venue?.toLowerCase().includes(q);
      if (!matchTitle && !matchClub && !matchVenue) return false;
    }

    // Time filter
    const evtDate = new Date(evt.date);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (activeTimeFilter === 'hackathons') {
      return evt.category === 'Hackathons' || evt.title?.toLowerCase().includes('hack');
    }

    if (activeTimeFilter === 'registered') {
      return evt.registeredStudents?.includes(formRoll || studentRoll);
    }

    if (activeTimeFilter === 'today') {
      const evtMidnight = new Date(evtDate);
      evtMidnight.setHours(0,0,0,0);
      return evtMidnight.getTime() === today.getTime();
    }

    if (activeTimeFilter === 'week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return evtDate >= today && evtDate <= nextWeek;
    }

    if (activeTimeFilter === 'month') {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return evtDate >= today && evtDate <= nextMonth;
    }

    return true;
  });

  // Open Registration Form Modal
  const handleOpenRegisterModal = (evt, e) => {
    if (e) e.stopPropagation();
    const currentRoll = formRoll || studentRoll;
    const isRegistered = evt.registeredStudents?.includes(currentRoll);

    if (isRegistered) {
      handleOpenPass(evt, e);
      return;
    }

    const capacity = getEventCapacity(evt);
    if (capacity.isFull) {
      if (onToast) onToast(`⚠️ Registration Full: No remaining seats for "${evt.title}".`, 'error');
      return;
    }

    setRegisteringEvent(evt);
  };

  // Submit Registration Form
  const handleConfirmRegistration = (e) => {
    e.preventDefault();
    if (!registeringEvent) return;

    if (!formName.trim() || !formRoll.trim() || !formEmail.trim() || !formPhone.trim()) {
      if (onToast) onToast('⚠️ Please fill in all required registration fields.', 'error');
      return;
    }

    const cleanRoll = formRoll.trim().toUpperCase();
    const cleanName = formName.trim();

    registerStudentForEvent(registeringEvent.id, cleanRoll);
    window.dispatchEvent(new Event('storage'));
    if (onRefreshEvents) onRefreshEvents();

    const registeredEvt = {
      ...registeringEvent,
      registeredStudents: [...(registeringEvent.registeredStudents || []), cleanRoll]
    };

    setRegisteringEvent(null);
    setPassEvent(registeredEvt);
    setIsPassModalOpen(true);

    if (onToast) onToast(`🎉 Confirmed: Official Entry Pass generated for ${cleanName} (${cleanRoll})!`, 'success');
  };

  // Open Confirmed Event Pass Modal
  const handleOpenPass = (evt, e) => {
    if (e) e.stopPropagation();
    setPassEvent(evt);
    setIsPassModalOpen(true);
    if (onOpenPassModal) onOpenPassModal(evt);
  };

  // Cancel Registration
  const handleCancelRegistration = (evt, e) => {
    if (e) e.stopPropagation();
    const currentRoll = formRoll || studentRoll || user?.rollNumber || user?.rollNo || '237R1A05BA';
    cancelStudentEventRegistration(evt.id, currentRoll);
    cancelStudentEventRegistration(evt.id, '237R1A05BA');
    if (user?.rollNumber) cancelStudentEventRegistration(evt.id, user.rollNumber);
    if (user?.rollNo) cancelStudentEventRegistration(evt.id, user.rollNo);

    if (passEvent?.id === evt.id) {
      setIsPassModalOpen(false);
      setPassEvent(null);
    }
    
    window.dispatchEvent(new Event('storage'));
    if (onRefreshEvents) onRefreshEvents();
    if (onToast) onToast(`Cancelled event registration for "${evt.title}". Seat released.`, 'info');
  };

  const getClubMeta = (clubId) => {
    return clubColors[clubId] || { name: 'Campus Flagship', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Sparkles size={18} />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Upcoming Campus Events & Hackathons
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse official competitions, workshops, and hackathons organized by CMRTC student clubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Campus Registrations</span>
          </span>
        </div>
      </div>

      {/* 1. FEATURED / NEAREST UPCOMING EVENT HERO BANNER */}
      {nearestEvent && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 transition-all">
          {/* Banner Background Image with High-Contrast Gradient */}
          <div className="absolute inset-0 z-0">
            <img 
              src={nearestEvent.image || '/images/codeholics/codeholics-hack-the-verse.png'} 
              alt={nearestEvent.title}
              className="w-full h-full object-cover object-center opacity-35 scale-105 filter blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left Info Column */}
            <div className="space-y-4 max-w-2xl text-left">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Flame size={13} className="fill-white" />
                  <span>Featured Flagship Event</span>
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getClubMeta(nearestEvent.clubId).badge}`}>
                  {nearestEvent.clubName || getClubMeta(nearestEvent.clubId).name}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-bold border border-white/10">
                  {nearestEvent.category || 'Competitions'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                  {nearestEvent.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mt-2 line-clamp-2 max-w-xl">
                  {nearestEvent.description}
                </p>
              </div>

              {/* Event Meta Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
                    <span className="text-xs font-extrabold text-white truncate">{nearestEvent.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
                    <span className="text-xs font-extrabold text-white truncate">{nearestEvent.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                    <span className="text-xs font-extrabold text-white truncate">{nearestEvent.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Action & Live Countdown Box */}
            <div className="w-full lg:w-80 bg-slate-950/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5 shrink-0 text-left">
              {/* Live Countdown Clock */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase mb-2">
                  <span className="flex items-center gap-1.5 text-pink-400">
                    <Clock size={14} />
                    <span>Event Starts In</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">LIVE SYNC</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-slate-900/90 border border-white/10 p-2 rounded-2xl">
                    <span className="text-xl sm:text-2xl font-black text-white block">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Days</span>
                  </div>
                  <div className="bg-slate-900/90 border border-white/10 p-2 rounded-2xl">
                    <span className="text-xl sm:text-2xl font-black text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
                  </div>
                  <div className="bg-slate-900/90 border border-white/10 p-2 rounded-2xl">
                    <span className="text-xl sm:text-2xl font-black text-white block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Mins</span>
                  </div>
                  <div className="bg-slate-900/90 border border-white/10 p-2 rounded-2xl">
                    <span className="text-xl sm:text-2xl font-black text-pink-400 block animate-pulse">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Secs</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Seat Capacity Progress */}
              {(() => {
                const capacity = getEventCapacity(nearestEvent);
                const percent = Math.min(100, Math.round((capacity.registered / capacity.max) * 100));

                return (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">{capacity.label}</span>
                      <span className="text-pink-400">{capacity.seatsLeft}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {nearestEvent.registeredStudents?.includes(formRoll || studentRoll) ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleOpenPass(nearestEvent, e)}
                      className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95 transition-all"
                    >
                      <TicketCheck size={16} />
                      <span>Pass Confirmed • View QR</span>
                    </button>
                    <button
                      onClick={(e) => handleCancelRegistration(nearestEvent, e)}
                      title="Cancel event registration"
                      className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : getEventCapacity(nearestEvent).isFull ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-700 text-center"
                  >
                    Registration Closed • Seats Full
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleOpenRegisterModal(nearestEvent, e)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Register Now (Fill Details)</span>
                    <ArrowRight size={15} />
                  </button>
                )}

                <button
                  onClick={() => setSelectedDetailEvent(nearestEvent)}
                  className="w-full py-2 text-center text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer transition-colors"
                >
                  View Full Event Details & Rules &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SEARCH & EVENT FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, club, or venue..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Time Filters Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'hackathons', label: '⚡ Hackathons' },
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'registered', label: 'My Registered Events' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveTimeFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTimeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Club Filter Select */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Club:</span>
          <select
            value={selectedClubFilter}
            onChange={(e) => setSelectedClubFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer w-full md:w-auto"
          >
            <option value="all">All Campus Clubs ({validEvents.length})</option>
            <option value="codeholics">Codeholics Tech ({validEvents.filter(e => e.clubId === 'codeholics').length})</option>
            <option value="akriti">AKRITI Cultural ({validEvents.filter(e => e.clubId === 'akriti').length})</option>
            <option value="lexis">The Lexis Literary ({validEvents.filter(e => e.clubId === 'lexis').length})</option>
            <option value="photography">Film & Photo ({validEvents.filter(e => e.clubId === 'photography').length})</option>
            <option value="ncc">NCC Cadet Corps ({validEvents.filter(e => e.clubId === 'ncc').length})</option>
            <option value="nss">NSS Unit ({validEvents.filter(e => e.clubId === 'nss').length})</option>
          </select>
        </div>
      </div>

      {/* Quick Club Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', name: 'All Campus Clubs', count: validEvents.length },
          { id: 'codeholics', name: 'Codeholics Tech', count: validEvents.filter(e => e.clubId === 'codeholics').length },
          { id: 'akriti', name: 'AKRITI Cultural', count: validEvents.filter(e => e.clubId === 'akriti').length },
          { id: 'lexis', name: 'The Lexis Club', count: validEvents.filter(e => e.clubId === 'lexis').length },
          { id: 'photography', name: 'Film & Photo (FAP)', count: validEvents.filter(e => e.clubId === 'photography').length },
          { id: 'ncc', name: 'NCC Unit', count: validEvents.filter(e => e.clubId === 'ncc').length },
          { id: 'nss', name: 'NSS Unit', count: validEvents.filter(e => e.clubId === 'nss').length },
        ].map(club => (
          <button
            key={club.id}
            onClick={() => setSelectedClubFilter(club.id)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
              selectedClubFilter === club.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>{club.name}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              selectedClubFilter === club.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {club.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. UPCOMING EVENTS CARDS GRID */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            {activeTimeFilter === 'registered' ? 'My Confirmed Event Passes' : 'Scheduled Club Events'} ({filteredEvents.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Click any card for full details</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Calendar size={24} />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">No events found matching your criteria</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try switching your filter or search query to view other scheduled club hackathons and workshops.
            </p>
            <button
              onClick={() => {
                setActiveTimeFilter('all');
                setSelectedClubFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map(evt => {
              const currentRoll = formRoll || studentRoll;
              const isRegistered = evt.registeredStudents?.includes(currentRoll);
              const capacity = getEventCapacity(evt);
              const isCompleted = evt.status === 'Completed' || evt.status === 'completed';

              return (
                <motion.div
                  key={evt.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setSelectedDetailEvent(evt)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  {/* Card Thumbnail Banner */}
                  <div className="h-44 relative bg-slate-900 overflow-hidden">
                    <img 
                      src={evt.image || '/images/codeholics/codeholics-hack-the-verse.png'} 
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Club Badge */}
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full font-extrabold text-[10px] uppercase shadow-md border ${getClubMeta(evt.clubId).badge}`}>
                      {evt.clubName || getClubMeta(evt.clubId).name}
                    </span>

                    {/* Registration Status Pill */}
                    <span className="absolute top-3 right-3">
                      {isRegistered ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-md">
                          <CheckCircle2 size={12} /> Registered
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[10px] shadow-md">
                          Completed
                        </span>
                      ) : capacity.isFull ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] shadow-md">
                          Full
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">
                          {capacity.seatsLeft}
                        </span>
                      )}
                    </span>

                    {/* Bottom Date Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-pink-400" />
                        <span>{evt.date}</span>
                      </span>
                      <span className="text-[11px] text-slate-300 font-mono">
                        {evt.time?.split(' - ')[0] || evt.time}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-purple-500" />
                          <span>{capacity.label}</span>
                        </span>
                        <span className="font-bold text-slate-700">{evt.category}</span>
                      </div>
                    </div>

                    {/* Registration / Action Footer Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {isRegistered ? (
                        <div className="w-full flex items-center gap-2">
                          <button
                            onClick={(e) => handleOpenPass(evt, e)}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                          >
                            <TicketCheck size={14} />
                            <span>View Pass</span>
                          </button>
                          <button
                            onClick={(e) => handleCancelRegistration(evt, e)}
                            title="Cancel Registration"
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : isCompleted ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-default"
                        >
                          Event Concluded
                        </button>
                      ) : capacity.isFull ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed border border-slate-200"
                        >
                          Seats Full
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleOpenRegisterModal(evt, e)}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <span>Register Now</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. EVENT REGISTRATION FORM MODAL (Students Fill/Verify Details) */}
      <AnimatePresence>
        {registeringEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-xl w-full border border-slate-200 shadow-2xl flex flex-col my-auto"
            >
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
                <button 
                  onClick={() => setRegisteringEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>

                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px] uppercase border border-blue-400/30">
                    Official Event Registration Form
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mt-1">
                    {registeringEvent.title}
                  </h3>
                  <p className="text-xs text-blue-200">
                    {registeringEvent.clubName} • {registeringEvent.date} ({registeringEvent.time})
                  </p>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleConfirmRegistration} className="p-6 space-y-4 text-left">
                <p className="text-xs text-slate-500 font-medium">
                  Please verify or enter your details below. Your official QR entry pass and attendee badge will be generated with these details.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Student Full Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Srujanya Maringanti"
                        className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Roll Number *
                    </label>
                    <div className="relative">
                      <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        required
                        value={formRoll}
                        onChange={(e) => setFormRoll(e.target.value)}
                        placeholder="e.g. 237R1A05BA"
                        className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white uppercase transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      College Email ID *
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. student@cmr.edu.in"
                        className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Mobile / Phone *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Department / Branch *
                    </label>
                    <select
                      value={formBranch}
                      onChange={(e) => setFormBranch(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                      <option value="CSE - Artificial Intelligence & ML">CSE - Artificial Intelligence & ML</option>
                      <option value="CSE - Data Science">CSE - Data Science</option>
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                      <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                      <option value="Mechanical Engineering (MECH)">Mechanical Engineering (MECH)</option>
                      <option value="Civil Engineering (CIVIL)">Civil Engineering (CIVIL)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Academic Year & Section *
                    </label>
                    <select
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="1st Year • Semester 1">1st Year • Semester 1</option>
                      <option value="1st Year • Semester 2">1st Year • Semester 2</option>
                      <option value="2nd Year • Semester 1">2nd Year • Semester 1</option>
                      <option value="2nd Year • Semester 2">2nd Year • Semester 2</option>
                      <option value="3rd Year • Semester 1">3rd Year • Semester 1</option>
                      <option value="3rd Year • Semester 2">3rd Year • Semester 2</option>
                      <option value="4th Year • Semester 1">4th Year • Semester 1</option>
                      <option value="4th Year • Semester 2">4th Year • Semester 2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Special Requirements / Team Name / Dietary (Optional)
                  </label>
                  <input 
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Team ByteCrafters / Vegetarian / First-time participant"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2 font-medium">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Free registration pass will be immediately issued with a verified scanning QR code.</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <TicketCheck size={15} />
                    <span>Confirm & Generate Event Pass</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. DETAILED EVENT VIEW MODAL */}
      <AnimatePresence>
        {selectedDetailEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Banner Header */}
              <div className="h-56 relative bg-slate-900 shrink-0">
                <img 
                  src={selectedDetailEvent.image || '/images/codeholics/codeholics-hack-the-verse.png'} 
                  alt={selectedDetailEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <button 
                  onClick={() => setSelectedDetailEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer z-10"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getClubMeta(selectedDetailEvent.clubId).badge}`}>
                    {selectedDetailEvent.clubName || getClubMeta(selectedDetailEvent.clubId).name}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedDetailEvent.title}
                  </h3>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-left text-xs">
                {/* Meta details cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Date & Time</span>
                    <p className="font-bold text-slate-900">{selectedDetailEvent.date}</p>
                    <p className="text-slate-500 text-[11px]">{selectedDetailEvent.time}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Venue Location</span>
                    <p className="font-bold text-slate-900 truncate">{selectedDetailEvent.venue}</p>
                    <p className="text-slate-500 text-[11px]">CMRTC Campus</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Available Seats</span>
                    {(() => {
                      const capacity = getEventCapacity(selectedDetailEvent);
                      return (
                        <>
                          <p className="font-black text-emerald-600">{capacity.seatsLeft}</p>
                          <p className="text-slate-500 text-[11px]">{capacity.label}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-slate-900">Event Overview & Description</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {selectedDetailEvent.description}
                  </p>
                </div>

                {/* Organizer Info */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-blue-700 block">Organizing Committee Contact</span>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-bold text-slate-900">{selectedDetailEvent.organizer?.name || 'Club Lead Coordinator'}</p>
                      <p className="text-slate-500 text-[11px]">{selectedDetailEvent.organizer?.email || 'coordinator@cmr.edu.in'}</p>
                    </div>
                    <span className="font-mono font-bold text-blue-700 text-xs">
                      {selectedDetailEvent.organizer?.phone || '+91 98765 43210'}
                    </span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                  {selectedDetailEvent.registeredStudents?.includes(formRoll || studentRoll) ? (
                    <div className="w-full flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          setSelectedDetailEvent(null);
                          handleOpenPass(selectedDetailEvent, e);
                        }}
                        className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <TicketCheck size={16} />
                        <span>View Confirmed Entry Pass</span>
                      </button>
                      <button
                        onClick={(e) => {
                          handleCancelRegistration(selectedDetailEvent, e);
                          setSelectedDetailEvent(null);
                        }}
                        className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs cursor-pointer"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        setSelectedDetailEvent(null);
                        handleOpenRegisterModal(selectedDetailEvent, e);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                    >
                      <TicketCheck size={16} />
                      <span>Fill Details & Register Now</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. EVENT PASS MODAL (Direct In-Component Rendering) */}
      <EventPassModal
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setPassEvent(null);
        }}
        event={passEvent}
        studentUser={{
          name: formName || studentName || 'Srujanya Maringanti',
          rollNumber: formRoll || studentRoll || '237R1A05BA',
          rollNo: formRoll || studentRoll || '237R1A05BA',
          email: formEmail || '237r1a05ba@cmrtc.ac.in',
          branch: formBranch || 'Computer Science & Engineering (CSE)'
        }}
        onToast={onToast}
      />
    </div>
  );
};

export default StudentEventsHeroSection;
