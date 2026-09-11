import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Upload, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  Image as ImageIcon, 
  Trash2, 
  AlertCircle, 
  FileCheck, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { getStoredCalendarEvents } from '../../utils/mockCalendarEvents';
import { REPORT_STATUSES } from '../../utils/mockEventReports';

const EventReportSubmitModal = ({
  isOpen,
  onClose,
  onSubmitReport,
  activeClubId,
  activeClubName,
  editingReport = null,
  user
}) => {
  // 1. Available Events for this club
  const allEvents = getStoredCalendarEvents();
  const clubEvents = activeClubId && activeClubId !== 'all'
    ? allEvents.filter(e => e.clubId === activeClubId)
    : allEvents;

  // Form State
  const [selectedEventId, setSelectedEventId] = useState(editingReport?.eventId || (clubEvents[0]?.id || ''));
  const [eventTitle, setEventTitle] = useState(editingReport?.eventTitle || (clubEvents[0]?.title || ''));
  const [clubName, setClubName] = useState(editingReport?.clubName || activeClubName || 'CMRTC Club');
  const [category, setCategory] = useState(editingReport?.category || 'Hackathons');
  const [eventDate, setEventDate] = useState(editingReport?.eventDate || '2026-08-25');
  const [startTime, setStartTime] = useState(editingReport?.startTime || '09:00 AM');
  const [endTime, setEndTime] = useState(editingReport?.endTime || '05:00 PM');
  const [venue, setVenue] = useState(editingReport?.venue || 'Room No: 21, Block B (Tech Innovation Center & CS Labs)');
  const [mode, setMode] = useState(editingReport?.mode || 'Offline');

  // Report Details
  const [objective, setObjective] = useState(editingReport?.objective || '');
  const [summary, setSummary] = useState(editingReport?.summary || '');
  const [activities, setActivities] = useState(editingReport?.activities || '');
  const [chiefGuest, setChiefGuest] = useState(editingReport?.chiefGuest || '');
  const [facultyCoordinator, setFacultyCoordinator] = useState(editingReport?.facultyCoordinator || 'Dr. Suresh Kumar');
  const [participantCount, setParticipantCount] = useState(editingReport?.participantCount || 100);
  const [volunteerCount, setVolunteerCount] = useState(editingReport?.volunteerCount || 15);
  const [outcome, setOutcome] = useState(editingReport?.outcome || '');
  const [highlights, setHighlights] = useState(editingReport?.highlights || '');
  const [achievements, setAchievements] = useState(editingReport?.achievements || '');
  const [challenges, setChallenges] = useState(editingReport?.challenges || '');
  const [suggestions, setSuggestions] = useState(editingReport?.suggestions || '');

  // Files State (7 categories)
  const [files, setFiles] = useState(editingReport?.files || []);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Event selection change -> prefill event meta
  const handleEventSelect = (evtId) => {
    setSelectedEventId(evtId);
    const matched = allEvents.find(e => e.id === evtId);
    if (matched) {
      setEventTitle(matched.title || '');
      setCategory(matched.category || 'Competitions');
      setEventDate(matched.date || '2026-08-25');
      setVenue(matched.venue || 'CMRTC Main Campus');
      if (matched.time) {
        const parts = matched.time.split('-');
        if (parts[0]) setStartTime(parts[0].trim());
        if (parts[1]) setEndTime(parts[1].trim());
      }
      if (matched.description && !summary) {
        setSummary(matched.description);
      }
    }
  };

  // Sync initial editing report if supplied
  useEffect(() => {
    if (editingReport) {
      setSelectedEventId(editingReport.eventId || '');
      setEventTitle(editingReport.eventTitle || '');
      setClubName(editingReport.clubName || activeClubName || 'CMRTC Club');
      setCategory(editingReport.category || 'Hackathons');
      setEventDate(editingReport.eventDate || '2026-08-25');
      setStartTime(editingReport.startTime || '09:00 AM');
      setEndTime(editingReport.endTime || '05:00 PM');
      setVenue(editingReport.venue || 'Room No: 21, Block B');
      setMode(editingReport.mode || 'Offline');
      setObjective(editingReport.objective || '');
      setSummary(editingReport.summary || '');
      setActivities(editingReport.activities || '');
      setChiefGuest(editingReport.chiefGuest || '');
      setFacultyCoordinator(editingReport.facultyCoordinator || 'Dr. Suresh Kumar');
      setParticipantCount(editingReport.participantCount || 100);
      setVolunteerCount(editingReport.volunteerCount || 15);
      setOutcome(editingReport.outcome || '');
      setHighlights(editingReport.highlights || '');
      setAchievements(editingReport.achievements || '');
      setChallenges(editingReport.challenges || '');
      setSuggestions(editingReport.suggestions || '');
      setFiles(editingReport.files || []);
      setIsConfirmed(true);
    } else if (clubEvents.length > 0 && !selectedEventId) {
      handleEventSelect(clubEvents[0].id);
    }
  }, [editingReport, activeClubId]);

  // File Upload Handlers
  const handleFileUpload = (category, e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length === 0) return;

    const newFiles = uploadedFiles.map((file, idx) => {
      const fileId = `file-${Date.now()}-${idx}`;
      const isImg = file.type.startsWith('image/');
      let url = null;
      if (isImg) {
        url = URL.createObjectURL(file);
      }
      return {
        id: fileId,
        category,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
    });

    setFiles(prev => [...prev, ...newFiles]);

    // If photos, update preview list
    if (category === 'event_photos') {
      const imgUrls = newFiles.filter(f => f.url).map(f => ({ id: f.id, name: f.name, url: f.url }));
      setPhotoPreviews(prev => [...prev, ...imgUrls]);
    }
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setPhotoPreviews(prev => prev.filter(p => p.id !== fileId));
  };

  // Submission / Draft Handler
  const handleFormSubmit = (isDraft = false) => {
    setErrorMessage('');

    if (!isDraft) {
      if (!eventTitle.trim()) {
        setErrorMessage('Please specify the Event Title.');
        return;
      }
      if (!objective.trim()) {
        setErrorMessage('Please provide the Event Objective.');
        return;
      }
      if (!summary.trim()) {
        setErrorMessage('Please provide the Event Summary description.');
        return;
      }
      if (!isConfirmed) {
        setErrorMessage('Please check the confirmation box verifying that the submitted details are correct.');
        return;
      }
    }

    const reportPayload = {
      ...(editingReport || {}),
      eventId: selectedEventId,
      eventTitle: eventTitle.trim(),
      clubId: activeClubId || editingReport?.clubId || 'codeholics',
      clubName: clubName || editingReport?.clubName || 'CMRTC Student Club',
      category,
      eventDate,
      startTime,
      endTime,
      venue,
      mode,
      objective,
      summary,
      activities,
      chiefGuest,
      facultyCoordinator,
      participantCount: Number(participantCount) || 0,
      volunteerCount: Number(volunteerCount) || 0,
      outcome,
      highlights,
      achievements,
      challenges,
      suggestions,
      status: isDraft ? REPORT_STATUSES.DRAFT : REPORT_STATUSES.SUBMITTED,
      submittedBy: user ? `${user.name || 'Coordinator'} (${user.rollNumber || user.rollNo || '217R1A0588'})` : (editingReport?.submittedBy || 'Student Lead (217R1A0588)'),
      submittedAt: editingReport?.submittedAt || new Date().toISOString(),
      facultyComments: editingReport?.facultyComments || (isDraft ? 'Draft saved by coordinator.' : 'Report submitted and queued for faculty review.'),
      files
    };

    onSubmitReport(reportPayload, isDraft);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {editingReport ? 'Edit / Resubmit Event Report' : 'Submit Official Event Report'}
              </h3>
              <p className="text-xs text-slate-400">
                {clubName} • Institutional Record & Faculty Review Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar text-xs text-slate-300">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. EVENT INFORMATION */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <span>1. Event Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Select Completed Event *</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => handleEventSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none cursor-pointer"
                >
                  {clubEvents.map(e => (
                    <option key={e.id} value={e.id} className="bg-slate-900 text-white">
                      {e.title} ({e.date})
                    </option>
                  ))}
                  <option value="custom" className="bg-slate-900 text-white">-- Other / Unlisted Event --</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. CMR HackFest 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Organizing Club</label>
                <input
                  type="text"
                  value={clubName}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Event Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Hackathons">Hackathons & Coding Sprints</option>
                  <option value="Workshops">Workshops & Masterclasses</option>
                  <option value="Competitions">Competitions & Tournaments</option>
                  <option value="Cultural Fests">Cultural Fests & Performances</option>
                  <option value="Social Drives">Social Drives & Cleanliness</option>
                  <option value="Sports">Sports & Fitness Bootcamps</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Campus Venue (Room No & Block)</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Room No: 21, Block B (Tech Innovation Center)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Delivery Mode</label>
                <div className="grid grid-cols-3 gap-2 pt-0.5">
                  {['Offline', 'Online', 'Hybrid'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        mode === m 
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-800" />

          {/* 2. EVENT REPORT DETAILS */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <span>2. Event Report Details</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Event Objective *</label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Explain the primary purpose and learning goals of conducting this event..."
                  className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Brief Description / Event Summary *</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Detailed summary of the program flow, student participation, and execution..."
                  className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Activities Conducted</label>
                <textarea
                  rows={2}
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="List sessions, keynote rounds, technical challenges, or cultural rounds conducted..."
                  className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Chief Guest / Speaker Details</label>
                  <input
                    type="text"
                    value={chiefGuest}
                    onChange={(e) => setChiefGuest(e.target.value)}
                    placeholder="Name, designation, organization..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Faculty Coordinator</label>
                  <input
                    type="text"
                    value={facultyCoordinator}
                    onChange={(e) => setFacultyCoordinator(e.target.value)}
                    placeholder="Faculty name & department..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Number of Participants</label>
                  <input
                    type="number"
                    value={participantCount}
                    onChange={(e) => setParticipantCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Number of Volunteers</label>
                  <input
                    type="number"
                    value={volunteerCount}
                    onChange={(e) => setVolunteerCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Event Outcome</label>
                <textarea
                  rows={2}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Key deliverables, knowledge gained, prototypes built, or social impact achieved..."
                  className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Key Highlights</label>
                <textarea
                  rows={2}
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  placeholder="Notable moments, audience reactions, VIP visits..."
                  className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Student Achievements / Winners</label>
                <textarea
                  rows={2}
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Winner names, positions, prize amount, certificates awarded..."
                  className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Challenges Faced</label>
                  <textarea
                    rows={2}
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="Logistical, technical, or venue challenges..."
                    className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Suggestions / Future Improvements</label>
                  <textarea
                    rows={2}
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder="Recommendations for future event editions..."
                    className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-800" />

          {/* 3. MEDIA & DOCUMENTATION (Multi-file upload with 7 categories) */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span>3. Media & Documentation Attachments</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Category 1: Official Report */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-white block">1. Official Event Report</span>
                  <span className="text-[10px] text-slate-400">PDF, DOC, DOCX</span>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Attach Report</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('official_report', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Category 2: Brochure / Poster */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-white block">2. Event Brochure / Poster</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG</span>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Attach Poster</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('brochure_poster', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Category 3: Attendance Sheet */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-white block">3. Attendance Sheet</span>
                  <span className="text-[10px] text-slate-400">PDF, Excel / XLSX, CSV</span>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Attach Attendance</span>
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv"
                    onChange={(e) => handleFileUpload('attendance_sheet', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Category 4: Event Photos */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-white block">4. Event Photos (Multi-Upload)</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG (With Live Preview)</span>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <ImageIcon size={14} />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('event_photos', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Category 5: Permission Letter */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-white block">5. Permission Letter / Approval</span>
                  <span className="text-[10px] text-slate-400">Signed PDF document</span>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Attach Sanction</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('permission_letter', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Category 6: Budget / Expense */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-white block">6. Budget / Expense Report</span>
                  <span className="text-[10px] text-slate-400">PDF, Excel XLSX, Vouchers</span>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Attach Financials</span>
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv"
                    onChange={(e) => handleFileUpload('budget_expense', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Category 7: Additional Docs */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2 sm:col-span-2 lg:col-span-3">
                <div>
                  <span className="font-bold text-white block">7. Additional Supporting Documents / Media</span>
                  <span className="text-[10px] text-slate-400">Brochures, press clippings, certificates, or feedback summaries</span>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Attach Extra Documents</span>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('additional_docs', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Uploaded Documents List */}
            {files.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 block">
                  Attached Documents ({files.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {files.map(f => (
                    <div key={f.id} className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck size={16} className="text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <p className="font-bold text-white truncate text-xs">{f.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{f.category.replace('_', ' ')} • {f.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(f.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 block">
                  Event Photos Preview ({photoPreviews.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {photoPreviews.map(p => (
                    <div key={p.id} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 group">
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(p.id)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-slate-950/80 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-[1px] bg-slate-800" />

          {/* Confirmation Checkbox */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-800 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-300 leading-relaxed select-none">
                ☑ I confirm that the submitted event information, participant tallies, and uploaded documents are authentic and verified by the club coordinators for institutional review.
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFormSubmit(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-extrabold text-xs cursor-pointer transition-all active:scale-95"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleFormSubmit(false)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <CheckCircle2 size={15} />
              <span>Submit Event Report</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventReportSubmitModal;
