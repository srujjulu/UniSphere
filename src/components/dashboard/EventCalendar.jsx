import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  clubColors, 
  getStoredCalendarEvents, 
  saveCalendarEvent, 
  toggleStudentEventRegistration 
} from '../../utils/mockCalendarEvents';
import { mockClubs } from '../../utils/mockClubs';
import CalendarEventModal from './CalendarEventModal';

const EventCalendar = ({ onToast }) => {
  const { user } = useAuth();
  const studentRoll = user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA';
  const isCoreTeam = user?.role === 'core' || user?.role === 'admin';

  // Calendar Date State (Default August 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // 0-indexed month 7 = August
  const [events, setEvents] = useState([]);
  
  // Modal & Selection State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Category & Club Filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeClubId, setActiveClubId] = useState('All');

  // Create Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newClubId, setNewClubId] = useState('codeholics');
  const [newCategory, setNewCategory] = useState('Workshops');
  const [newDateStr, setNewDateStr] = useState('2026-08-28');
  const [newTimeStr, setNewTimeStr] = useState('02:00 PM - 05:00 PM');
  const [newVenueStr, setNewVenueStr] = useState('CMRTC Seminar Hall 2');
  const [newDescStr, setNewDescStr] = useState('');

  // Load and sync calendar events
  useEffect(() => {
    const loadEvents = () => {
      setEvents(getStoredCalendarEvents());
    };
    loadEvents();
    window.addEventListener('storage', loadEvents);
    return () => window.removeEventListener('storage', loadEvents);
  }, []);

  // Filtered Events List
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchCategory = activeCategory === 'All' || 
        (activeCategory === 'Workshops' && (evt.category === 'Workshops' || evt.status === 'Workshops')) ||
        (activeCategory === 'Competitions' && evt.category === 'Competitions') ||
        (activeCategory === 'Holidays' && (evt.category === 'Holiday' || evt.status === 'Holiday')) ||
        (activeCategory === 'Upcoming' && evt.status === 'Upcoming') ||
        (activeCategory === 'Completed' && evt.status === 'Completed');

      const matchClub = activeClubId === 'All' || evt.clubId === activeClubId;
      return matchCategory && matchClub;
    });
  }, [events, activeCategory, activeClubId]);

  // Calendar Math Computation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date(2026, 7, 1)); // Reset to August 2026 default
  };

  // Map events by date (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [filteredEvents]);

  const handleEventClick = (evt, e) => {
    e?.stopPropagation();
    setSelectedEvent(evt);
    setIsModalOpen(true);
  };

  const handleToggleRegister = (eventId) => {
    toggleStudentEventRegistration(eventId, studentRoll);
    const updated = getStoredCalendarEvents();
    setEvents(updated);
    const refreshedEvt = updated.find(e => e.id === eventId);
    setSelectedEvent(refreshedEvt);

    const isReg = refreshedEvt?.registeredStudents?.includes(studentRoll);
    if (onToast) {
      onToast(
        isReg 
          ? `🎉 Registered for "${refreshedEvt.title}"! Entry pass added.` 
          : `Cancelled registration for "${refreshedEvt.title}"`,
        isReg ? 'success' : 'info'
      );
    }
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const clubInfo = mockClubs.find(c => c.id === newClubId) || mockClubs[0];
    const createdEvent = {
      id: `cal-${Date.now()}`,
      title: newTitle.trim(),
      clubId: newClubId,
      clubName: clubInfo.name,
      category: newCategory,
      date: newDateStr,
      time: newTimeStr,
      venue: newVenueStr,
      seats: '0/150 Open',
      status: newCategory === 'Holiday' ? 'Holiday' : 'Upcoming',
      registeredStudents: [],
      description: newDescStr.trim() || `Official campus ${newCategory} organized by ${clubInfo.name}.`
    };

    saveCalendarEvent(createdEvent);
    setEvents(getStoredCalendarEvents());
    setIsCreateModalOpen(false);
    setNewTitle('');
    if (onToast) {
      onToast(`🎉 Created Calendar Event "${createdEvent.title}" for ${clubInfo.name}!`, 'success');
    }
  };

  return (
    <div className="space-y-6 font-sans select-none pb-8">
      {/* 1. Header Banner & Action Bar */}
      <div className="bg-slate-900/80 p-6 sm:p-8 rounded-[32px] border border-slate-800 backdrop-blur-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[11px] uppercase tracking-widest border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
              <CalendarIcon size={14} />
              <span>Campus Calendar & Event Sprints</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CMRTC College Event Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Interactive monthly calendar displaying workshops, competitions, holidays, and cultural fest schedules across all campus clubs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Add Event Button for Core Team / Admin */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-pink-600/25 transition-all duration-200 active:scale-95 flex items-center gap-2 border border-white/20"
          >
            <Plus size={16} />
            <span>Create Calendar Event</span>
          </button>
        </div>
      </div>

      {/* 2. Color Legend Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">
          Club Color Coding:
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(clubColors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${val.bg} border border-white/20`} />
              <span className="text-[11px] font-extrabold text-slate-300">{val.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Filter Tabs & Month Switcher Navigation Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Workshops', 'Competitions', 'Holidays', 'Upcoming', 'Completed'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Month Navigation Control */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={resetToToday}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer border border-slate-700"
          >
            Today
          </button>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-extrabold text-sm text-white px-2 min-w-[130px] text-center font-mono">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Full Monthly Interactive Grid */}
      <div className="rounded-[32px] bg-slate-900/80 border border-slate-800 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl overflow-x-auto">
        {/* Days Header Row */}
        <div className="grid grid-cols-7 gap-2 min-w-[700px] mb-3 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <div 
              key={d} 
              className={`py-2 text-xs font-black uppercase tracking-wider ${
                i === 0 || i === 6 ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date Boxes Grid */}
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {/* Previous Month Blank Offset Cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div 
              key={`blank-${idx}`} 
              className="min-h-[100px] sm:min-h-[120px] rounded-2xl bg-slate-950/30 border border-slate-800/30 p-2 opacity-30" 
            />
          ))}

          {/* Current Month Active Days Cells */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
            const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = dateStr === '2026-08-06'; // Match current simulated date

            return (
              <div
                key={dateStr}
                className={`min-h-[100px] sm:min-h-[125px] rounded-2xl p-2 sm:p-2.5 border transition-all flex flex-col justify-between group ${
                  isToday 
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-md shadow-blue-500/10' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                      isToday 
                        ? 'bg-blue-600 text-white font-black' 
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-extrabold font-mono text-slate-400">
                      {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                    </span>
                  )}
                </div>

                {/* Event Chips List */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-none">
                  {dayEvents.map((evt) => {
                    const theme = clubColors[evt.clubId] || clubColors.codeholics;
                    const isRegistered = evt.registeredStudents?.includes(studentRoll);

                    return (
                      <div
                        key={evt.id}
                        onClick={(e) => handleEventClick(evt, e)}
                        className={`p-1.5 rounded-xl ${theme.bg} text-white font-bold text-[10px] cursor-pointer shadow-sm hover:brightness-125 transition-all flex items-center justify-between gap-1`}
                        title={`${evt.title} (${evt.time})`}
                      >
                        <span className="truncate leading-tight font-extrabold">{evt.title}</span>
                        {isRegistered && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" title="Registered" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Event Detail Popup Modal */}
      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        studentRoll={studentRoll}
        onToggleRegister={handleToggleRegister}
        onToast={onToast}
      />

      {/* 6. Create Calendar Event Modal Form */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] p-6 sm:p-8 space-y-5 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Plus size={20} className="text-pink-400" />
                <span>Create Calendar Event</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI & Full-Stack Developer Bootcamp"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Organizing Club</label>
                  <select
                    value={newClubId}
                    onChange={(e) => setNewClubId(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none"
                  >
                    {mockClubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    <option value="holiday">Campus Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none"
                  >
                    <option value="Workshops">Workshops</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Cultural Fest">Cultural Fest</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Event Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={newDateStr}
                    onChange={(e) => setNewDateStr(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    value={newTimeStr}
                    onChange={(e) => setNewTimeStr(e.target.value)}
                    placeholder="e.g. 02:00 PM - 05:00 PM"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Campus Venue</label>
                <input
                  type="text"
                  value={newVenueStr}
                  onChange={(e) => setNewVenueStr(e.target.value)}
                  placeholder="e.g. Seminar Hall 2 / Tech Lab 4"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  value={newDescStr}
                  onChange={(e) => setNewDescStr(e.target.value)}
                  placeholder="Event description..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md"
                >
                  Publish to Calendar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
