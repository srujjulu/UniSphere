import React, { useState, useEffect } from 'react';
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
  Image as ImageIcon,
  QrCode,
  Star,
  MessageSquare,
  ThumbsUp,
  Clock,
  FileCheck,
  Building,
  Edit,
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  Tag
} from 'lucide-react';
import RoleSidebar from '../layout/RoleSidebar';
import DhondiFooter from '../layout/DhondiFooter';
import ClubPhotoGalleryModal from './ClubPhotoGalleryModal';
import InfluencerSheetModal from './InfluencerSheetModal';
import EventCalendar from './EventCalendar';
import EventQRGeneratorModal from './EventQRGeneratorModal';
import { useAuth } from '../../context/AuthContext';
import { mockClubs, getClubSettings, saveClubSettings, getStoredClubs } from '../../utils/mockClubs';
import { getStoredRequests, updateRequestStatus } from '../../utils/mockRequests';
import { saveCertificate } from '../../utils/mockCertificates';
import { getStoredCalendarEvents, saveCalendarEvent, updateCalendarEventStatus } from '../../utils/mockCalendarEvents';
import { getEventFeedbackSummary, getAllFeedbackSummaries } from '../../utils/mockEventFeedback';
import { assignVolunteerHours, getStoredVolunteerRecords } from '../../utils/mockVolunteerHours';
import { getStoredAnnouncements, saveAnnouncement, deleteAnnouncement } from '../../utils/mockAnnouncements';
import { 
  getClubSponsors, 
  addClubSponsor, 
  updateClubSponsor, 
  deleteClubSponsor, 
  getClubExpenses, 
  addClubExpense, 
  updateClubExpense, 
  deleteClubExpense, 
  getClubFinancialSummary 
} from '../../utils/mockBudgetAndSponsors';
import { getStudentNameByRoll } from '../../utils/studentLookup';
import { requestsApi } from '../../services/api';
import { 
  downloadClubMonthlyParticipationPDF, 
  downloadClubFinancialStatementPDF, 
  downloadClubMembersCSV 
} from '../../utils/downloadManager';

const CoreTeamDashboard = () => {
  const { user } = useAuth();
  const [selectedClubId, setSelectedClubId] = useState(user?.assignedClub || 'codeholics');
  const [clubs, setClubs] = useState(getStoredClubs);
  const activeClub = clubs.find(c => c.id === selectedClubId) || clubs[0] || mockClubs[0];

  const [activeSection, setActiveSection] = useState('dashboard');
  const [allMemberRequests, setAllMemberRequests] = useState(getStoredRequests);
  const [events, setEvents] = useState(getStoredCalendarEvents);
  const [announcements, setAnnouncements] = useState(getStoredAnnouncements);
  const [sponsors, setSponsors] = useState(() => getClubSponsors(selectedClubId));
  const [expenses, setExpenses] = useState(() => getClubExpenses(selectedClubId));
  const [financialSummary, setFinancialSummary] = useState(() => getClubFinancialSummary(selectedClubId));
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isInfluencerOpen, setIsInfluencerOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedQREvent, setSelectedQREvent] = useState(null);
  const [toast, setToast] = useState('');

  // Club Configuration State & Persistence
  const [savedClubSettings, setSavedClubSettings] = useState(() => getClubSettings(selectedClubId));
  const [clubTitle, setClubTitle] = useState(() => getClubSettings(selectedClubId).name);
  const [clubSubtitle, setClubSubtitle] = useState(() => getClubSettings(selectedClubId).subtitle);
  const [clubRecruitment, setClubRecruitment] = useState(() => getClubSettings(selectedClubId).recruitment);

  // Sync configuration, sponsors, expenses, events & announcements on club change or storage events
  useEffect(() => {
    const settings = getClubSettings(selectedClubId);
    setSavedClubSettings(settings);
    setClubTitle(settings.name);
    setClubSubtitle(settings.subtitle);
    setClubRecruitment(settings.recruitment);
    setClubs(getStoredClubs());
    setSponsors(getClubSponsors(selectedClubId));
    setExpenses(getClubExpenses(selectedClubId));
    setFinancialSummary(getClubFinancialSummary(selectedClubId));
  }, [selectedClubId]);

  useEffect(() => {
    const handleStorage = () => {
      setEvents(getStoredCalendarEvents());
      setAllMemberRequests(getStoredRequests());
      setAnnouncements(getStoredAnnouncements());
      const settings = getClubSettings(selectedClubId);
      setSavedClubSettings(settings);
      setClubTitle(settings.name);
      setClubSubtitle(settings.subtitle);
      setClubRecruitment(settings.recruitment);
      setClubs(getStoredClubs());
      setSponsors(getClubSponsors(selectedClubId));
      setExpenses(getClubExpenses(selectedClubId));
      setFinancialSummary(getClubFinancialSummary(selectedClubId));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [selectedClubId]);

  const hasUnsavedChanges = 
    clubTitle.trim() !== (savedClubSettings.name || '').trim() ||
    clubSubtitle.trim() !== (savedClubSettings.subtitle || '').trim() ||
    clubRecruitment !== (savedClubSettings.recruitment || 'open');

  // Volunteer Hours Form State
  const [volRoll, setVolRoll] = useState('237R1A05BA');
  const [volName, setVolName] = useState(() => getStudentNameByRoll('237R1A05BA') || 'Student Member');
  const [volEvent, setVolEvent] = useState('Swachh Bharat Cleanliness & Greenery Drive');
  const [volHours, setVolHours] = useState('8');

  // Auto-populate volunteer student name when roll changes
  const handleVolRollChange = (val) => {
    setVolRoll(val);
    const resolved = getStudentNameByRoll(val);
    if (resolved) setVolName(resolved);
  };

  const handleAssignVolunteerHours = (e) => {
    e.preventDefault();
    if (!volRoll.trim() || !volHours) return;

    const studentRollClean = volRoll.trim().toUpperCase();
    const studentNameClean = volName.trim() || getStudentNameByRoll(studentRollClean) || 'Student Member';

    // Prevent duplicate assignment for the exact same event
    const volRecords = getStoredVolunteerRecords();
    const studentHist = volRecords[studentRollClean]?.history || [];
    const existingEvt = studentHist.find(h => h.eventTitle?.toLowerCase() === volEvent.trim().toLowerCase());

    if (existingEvt) {
      const confirmAdd = window.confirm(`Student ${studentRollClean} already has ${existingEvt.hours} hours logged for "${volEvent}". Do you want to add additional +${volHours} hours?`);
      if (!confirmAdd) return;
    }

    assignVolunteerHours({
      studentRoll: studentRollClean,
      studentName: studentNameClean,
      eventTitle: volEvent.trim(),
      clubName: activeClub.name,
      hours: Number(volHours),
      assignedBy: `${user?.name || 'Coordinator'} (${activeClub.name})`
    });

    window.dispatchEvent(new Event('storage'));
    triggerToast(`Assigned +${volHours} Volunteer Hours to ${studentNameClean} (${studentRollClean})! 🤝`);
  };

  // Certificate Upload Form State
  const [certEventName, setCertEventName] = useState('CMR HackFest 2026 36-Hour Hackathon');
  const [certTitle, setCertTitle] = useState('Certificate of Excellence');
  const [certStudentRoll, setCertStudentRoll] = useState('237R1A05BA');
  const [certStudentName, setCertStudentName] = useState(() => getStudentNameByRoll('237R1A05BA') || 'Student Member');
  const [certDescription, setCertDescription] = useState('Awarded for outstanding event participation and achievement.');
  const [certFile, setCertFile] = useState(null);

  // Auto-populate certificate student name when roll changes
  const handleCertRollChange = (val) => {
    setCertStudentRoll(val);
    if (val.trim().toUpperCase() === 'ALL') {
      setCertStudentName('All Registered Participants');
    } else {
      const resolved = getStudentNameByRoll(val);
      if (resolved) setCertStudentName(resolved);
    }
  };

  const handleUploadCertificate = (e) => {
    e.preventDefault();
    if (!certTitle.trim() || !certEventName.trim()) return;

    const isAll = certStudentRoll.trim().toUpperCase() === 'ALL';

    if (isAll) {
      // Find registered students for this completed event
      const targetEvt = events.find(ev => ev.title === certEventName);
      const participantRolls = targetEvt?.registeredStudents?.length > 0 
        ? targetEvt.registeredStudents 
        : ['237R1A05BA', '237R1A0512', '237R1A0445'];

      participantRolls.forEach((r, idx) => {
        const sName = getStudentNameByRoll(r) || `Student ${r}`;
        const newCert = {
          id: `cert-${Date.now()}-${idx}`,
          title: certTitle.trim(),
          eventName: certEventName.trim(),
          issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          clubId: activeClub.id,
          clubName: activeClub.name,
          studentRoll: r.toUpperCase(),
          studentName: sName,
          status: 'verified',
          verifiedBy: `${user?.name || 'Coordinator'} (${activeClub.name})`,
          credentialId: `CMRTC-2026-${activeClub.id.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          description: certDescription.trim(),
          templateFile: certFile ? certFile.name : null
        };
        saveCertificate(newCert);
      });

      window.dispatchEvent(new Event('storage'));
      triggerToast(`Issued ${participantRolls.length} Certificates to all attendees of "${certEventName}"! 📄`);
    } else {
      const rollClean = certStudentRoll.trim().toUpperCase();
      const nameClean = certStudentName.trim() || getStudentNameByRoll(rollClean) || 'Student Member';

      const newCert = {
        id: `cert-${Date.now()}`,
        title: certTitle.trim(),
        eventName: certEventName.trim(),
        issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        clubId: activeClub.id,
        clubName: activeClub.name,
        studentRoll: rollClean,
        studentName: nameClean,
        status: 'verified',
        verifiedBy: `${user?.name || 'Coordinator'} (${activeClub.name})`,
        credentialId: `CMRTC-2026-${activeClub.id.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        description: certDescription.trim(),
        templateFile: certFile ? certFile.name : null
      };

      saveCertificate(newCert);
      window.dispatchEvent(new Event('storage'));
      triggerToast(`Uploaded & Issued Certificate for ${nameClean} (${rollClean})! 📄 Visible in Student Portal.`);
    }

    setCertTitle('');
    setCertFile(null);
  };

  // Load requests from backend server and merge with local storage
  const fetchClubRequests = async () => {
    try {
      const res = await requestsApi.getForClub(selectedClubId);
      if (res?.data && Array.isArray(res.data)) {
        const local = getStoredRequests();
        const map = new Map();
        res.data.forEach(item => map.set(item.id, item));
        local.forEach(item => {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
        });
        setAllMemberRequests(Array.from(map.values()));
      }
    } catch (err) {
      console.warn('Backend requests fetch fallback:', err);
    }
  };

  useEffect(() => {
    fetchClubRequests();
  }, [selectedClubId]);

  // Filter requests for currently selected club or all clubs
  const memberRequests = allMemberRequests.filter(
    r => (selectedClubId === 'all' || r.clubId === selectedClubId || !r.clubId) && r.status === 'pending'
  );

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventBudget, setNewEventBudget] = useState('₹15,000');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annDetails, setAnnDetails] = useState('');
  const [annUrgency, setAnnUrgency] = useState('High Priority');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApproveMember = async (id, name) => {
    updateRequestStatus(id, 'approved');
    try {
      await requestsApi.updateStatus(id, 'approved');
    } catch (e) {
      console.warn('Backend status update fallback:', e);
    }
    setAllMemberRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Approved ${name} into ${activeClub.name}! ✅`);
  };

  const handleRejectMember = async (id, name) => {
    updateRequestStatus(id, 'rejected');
    try {
      await requestsApi.updateStatus(id, 'rejected');
    } catch (e) {
      console.warn('Backend status update fallback:', e);
    }
    setAllMemberRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Rejected membership request for ${name}. ❌`);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      triggerToast('⚠️ Please enter an Event Title');
      return;
    }

    const created = {
      id: `cal-${Date.now()}`,
      title: newEventTitle.trim(),
      clubId: activeClub.id,
      clubName: activeClub.name,
      category: 'Competitions',
      date: newEventDate.trim() || new Date().toISOString().split('T')[0],
      time: '10:00 AM - 04:00 PM',
      venue: `${activeClub.name} Hall / Campus Lab`,
      seats: '0/100 Registered',
      budget: newEventBudget.trim() || '₹15,000',
      status: 'Published',
      registeredStudents: [],
      description: `Official campus event organized by ${activeClub.name}.`
    };

    saveCalendarEvent(created);
    setEvents(getStoredCalendarEvents());
    window.dispatchEvent(new Event('storage'));
    setNewEventTitle('');
    setNewEventDate('');
    triggerToast(`Published event: ${created.title} for ${activeClub.name}! 🎉 Visible in Student Portal.`);
  };

  const handleMarkCompleted = (ev) => {
    const isConfirmed = window.confirm(`Mark event "${ev.title}" as Completed?\n\nThis will make it eligible for Certificate PDF uploading and Volunteer Hours assignment.`);
    if (!isConfirmed) return;

    updateCalendarEventStatus(ev.id, 'Completed');
    setEvents(getStoredCalendarEvents());
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Event "${ev.title}" marked as Completed! 📸 Ready for Certificates & Photo Gallery.`);
  };

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annDetails.trim()) {
      triggerToast('⚠️ Please enter both Announcement Title and Message body!');
      return;
    }

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      clubId: activeClub.id,
      club: activeClub.name,
      clubName: activeClub.name,
      title: annTitle.trim(),
      message: annDetails.trim(),
      details: annDetails.trim(),
      publisherName: `${user?.name || 'Club Coordinator'} (${activeClub.name})`,
      date: `${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} • ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      urgency: annUrgency,
      timestamp: Date.now()
    };

    saveAnnouncement(newAnnouncement);
    setAnnouncements(getStoredAnnouncements());
    window.dispatchEvent(new Event('storage'));
    setAnnTitle('');
    setAnnDetails('');
    triggerToast('Announcement published successfully to all students! 📢');
  };

  const handleDeleteAnnouncement = (annId, title) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    deleteAnnouncement(annId);
    setAnnouncements(getStoredAnnouncements());
    window.dispatchEvent(new Event('storage'));
    triggerToast('Announcement deleted successfully. 🗑️');
  };

  const handleSaveClubSettings = (e) => {
    e.preventDefault();
    if (!clubTitle.trim()) {
      triggerToast('⚠️ Club Official Title cannot be empty!');
      return;
    }
    if (!clubSubtitle.trim()) {
      triggerToast('⚠️ Tagline / Short Subtitle cannot be empty!');
      return;
    }

    const saved = saveClubSettings(activeClub.id, {
      name: clubTitle.trim(),
      subtitle: clubSubtitle.trim(),
      recruitment: clubRecruitment
    });

    setSavedClubSettings(saved);
    setClubs(getStoredClubs());
    window.dispatchEvent(new Event('storage'));
    triggerToast('Club configuration saved successfully! ⚙️');
  };

  // Filtered events for the active club
  const clubEvents = events.filter(
    e => (selectedClubId === 'all' || e.clubId === selectedClubId) && e.category !== 'Holiday'
  );

  // Completed events list for dropdown
  const completedEvents = events.filter(e => e.status === 'Completed' || e.status === 'completed');

  // Sponsor Form State
  const [isAddingSponsor, setIsAddingSponsor] = useState(false);
  const [editingSponsorId, setEditingSponsorId] = useState(null);
  const [spName, setSpName] = useState('');
  const [spAmount, setSpAmount] = useState('');
  const [spEvent, setSpEvent] = useState('');
  const [spDescription, setSpDescription] = useState('');
  const [spStatus, setSpStatus] = useState('Active');
  const [spContact, setSpContact] = useState('');

  const handleOpenAddSponsor = () => {
    setEditingSponsorId(null);
    setSpName('');
    setSpAmount('');
    setSpEvent(clubEvents[0]?.title || `${activeClub.name} Annual Activities`);
    setSpDescription('');
    setSpStatus('Active');
    setSpContact('');
    setIsAddingSponsor(true);
  };

  const handleOpenEditSponsor = (sp) => {
    setEditingSponsorId(sp.id);
    setSpName(sp.name || '');
    setSpAmount(String(sp.amount || ''));
    setSpEvent(sp.event || '');
    setSpDescription(sp.description || '');
    setSpStatus(sp.status || 'Active');
    setSpContact(sp.contact || '');
    setIsAddingSponsor(true);
  };

  const handleSaveSponsor = (e) => {
    e.preventDefault();
    if (!spName.trim() || !spAmount || Number(spAmount) <= 0 || !spEvent.trim() || !spDescription.trim()) {
      triggerToast('⚠️ Please fill all required sponsor fields with valid data!');
      return;
    }

    const payload = {
      name: spName.trim(),
      amount: Number(spAmount),
      event: spEvent.trim(),
      description: spDescription.trim(),
      status: spStatus,
      contact: spContact.trim()
    };

    if (editingSponsorId) {
      updateClubSponsor(selectedClubId, editingSponsorId, payload);
      triggerToast(`Updated sponsor "${spName.trim()}"! 💼`);
    } else {
      addClubSponsor(selectedClubId, payload);
      triggerToast(`Added new sponsor "${spName.trim()}" for ₹${Number(spAmount).toLocaleString()}! 💼`);
    }

    setSponsors(getClubSponsors(selectedClubId));
    setFinancialSummary(getClubFinancialSummary(selectedClubId));
    window.dispatchEvent(new Event('storage'));
    setIsAddingSponsor(false);
  };

  const handleDeleteSponsor = (sp) => {
    const isConfirmed = window.confirm(`Delete sponsor "${sp.name}"?\n\nThis will remove ₹${Number(sp.amount).toLocaleString()} from ${activeClub.name}'s total sponsorship revenue and adjust the available budget.`);
    if (!isConfirmed) return;

    deleteClubSponsor(selectedClubId, sp.id);
    setSponsors(getClubSponsors(selectedClubId));
    setFinancialSummary(getClubFinancialSummary(selectedClubId));
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Removed sponsor "${sp.name}". Recalculated club budget! 💼`);
  };

  // Budget / Expense Form State
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Event Expenses');
  const [expEvent, setExpEvent] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expDescription, setExpDescription] = useState('');

  const handleOpenAddExpense = () => {
    setEditingExpenseId(null);
    setExpTitle('');
    setExpAmount('');
    setExpCategory('Event Expenses');
    setExpEvent(clubEvents[0]?.title || `${activeClub.name} General`);
    setExpDate(new Date().toISOString().split('T')[0]);
    setExpDescription('');
    setIsAddingExpense(true);
  };

  const handleOpenEditExpense = (exp) => {
    setEditingExpenseId(exp.id);
    setExpTitle(exp.title || '');
    setExpAmount(String(exp.amount || ''));
    setExpCategory(exp.category || 'Event Expenses');
    setExpEvent(exp.event || '');
    setExpDate(exp.date || new Date().toISOString().split('T')[0]);
    setExpDescription(exp.description || '');
    setIsAddingExpense(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount || Number(expAmount) <= 0 || !expEvent.trim()) {
      triggerToast('⚠️ Please enter all required expense details!');
      return;
    }

    const payload = {
      title: expTitle.trim(),
      amount: Number(expAmount),
      category: expCategory,
      event: expEvent.trim(),
      date: expDate,
      description: expDescription.trim()
    };

    if (editingExpenseId) {
      updateClubExpense(selectedClubId, editingExpenseId, payload);
      triggerToast(`Updated expense entry "${expTitle.trim()}"! 🧾`);
    } else {
      addClubExpense(selectedClubId, payload);
      triggerToast(`Recorded expense "-₹${Number(expAmount).toLocaleString()}" for ${expTitle.trim()}! 🧾`);
    }

    setExpenses(getClubExpenses(selectedClubId));
    setFinancialSummary(getClubFinancialSummary(selectedClubId));
    window.dispatchEvent(new Event('storage'));
    setIsAddingExpense(false);
  };

  const handleDeleteExpense = (exp) => {
    const isConfirmed = window.confirm(`Delete expense "${exp.title}" (₹${Number(exp.amount).toLocaleString()})?\n\nThis will restore this amount to the club's available balance.`);
    if (!isConfirmed) return;

    deleteClubExpense(selectedClubId, exp.id);
    setExpenses(getClubExpenses(selectedClubId));
    setFinancialSummary(getClubFinancialSummary(selectedClubId));
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Deleted expense "${exp.title}". Recalculated balance! 💰`);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex font-sans select-none overflow-x-hidden">
      {/* Sidebar navigation */}
      <RoleSidebar
        currentRole="core"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 flex flex-col min-w-0 bg-[#0B1120] border-l border-slate-800/80 space-y-6">
        {/* Fixed Toast Notification */}
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

          <div className="relative space-y-3 max-w-2xl z-10 text-left">
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
              Approve pending student members for {activeClub.name}, organize events, manage corporate sponsors, and track club budget allocations.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="glass-card px-5 py-3 rounded-2xl border border-white/10 text-right space-y-0.5">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Pending Approvals</p>
              <p className="text-xl font-black text-pink-400">{memberRequests.length} Requests</p>
            </div>
            <div className="glass-card px-5 py-3 rounded-2xl border border-white/10 text-right space-y-0.5">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Available Balance</p>
              <p className="text-xl font-black text-emerald-400">₹{financialSummary.availableBalance.toLocaleString()}</p>
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
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-pink-500/30 transition-all duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black shadow-lg shadow-pink-500/10 border border-pink-500/30">
                  <UserCheck size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Applications</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">{memberRequests.length} Students</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-blue-500/30 transition-all duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shadow-lg shadow-blue-500/10 border border-blue-500/30">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Club Events</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">{clubEvents.length} Scheduled</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-emerald-500/30 transition-all duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shadow-lg shadow-emerald-500/10 border border-emerald-500/30">
                  <DollarSign size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Available Balance</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-0.5">₹{financialSummary.availableBalance.toLocaleString()}</h3>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl hover:border-purple-500/30 transition-all duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black shadow-lg shadow-purple-500/10 border border-purple-500/30">
                  <Award size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Sponsors</p>
                  <h3 className="text-2xl font-black text-white mt-0.5">{financialSummary.sponsorsCount} Corporate</h3>
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
                        <h4 className="font-bold text-white text-xs">{req.name || req.studentName} <span className="text-slate-400">({req.rollNo || req.studentRoll})</span></h4>
                        <p className="text-[11px] text-slate-400">{req.branch || 'CMR Student'} • Domain: <span className="text-pink-400 font-bold">{req.talent || 'General'}</span></p>
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
                  required
                  placeholder="Event Title (e.g. CodeSprint 2026)"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Date & Time (e.g. Oct 12, 2026)"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Budget Allocation (e.g. ₹15,000)"
                  value={newEventBudget}
                  onChange={(e) => setNewEventBudget(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Plus size={16} />
                <span>Publish Event</span>
              </button>
            </form>

            {/* Scheduled Events List */}
            <div className="space-y-3">
              {clubEvents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No events found for this club. Publish a new event above.</p>
              ) : (
                clubEvents.map((ev) => {
                  const regCount = ev.registeredStudents?.length || 0;
                  const isCompleted = ev.status === 'Completed' || ev.status === 'completed';
                  const isPendingApproval = ev.status === 'Pending Faculty Approval';

                  return (
                    <div key={ev.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-sm">{ev.title}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            isCompleted ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            isPendingApproval ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {isCompleted ? 'Completed' : isPendingApproval ? 'Pending Faculty Approval' : 'Published'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {ev.date} {ev.time ? `• ${ev.time}` : ''} • Participants: <span className="text-emerald-400 font-bold">{regCount} Registered</span> • Budget: <span className="text-white font-bold">{ev.budget || '₹15,000'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedQREvent(ev);
                            setIsQRModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold text-xs border border-pink-500/30 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <QrCode size={14} />
                          <span>QR & Attendance</span>
                        </button>

                        {isCompleted ? (
                          <button
                            onClick={() => setIsGalleryOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                          >
                            <Upload size={14} />
                            <span>Upload Photo Album</span>
                          </button>
                        ) : isPendingApproval ? (
                          <span className="text-xs text-amber-400 font-bold italic px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            Awaiting Faculty Sign-Off ⏳
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkCompleted(ev)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer transition-all active:scale-95"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Upload Certificate PDF Form */}
            <div className="pt-6 border-t border-slate-800 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-400" />
                <h4 className="text-lg font-black text-white">Upload Certificate PDF After Event Completion</h4>
              </div>
              <p className="text-xs text-slate-400">Issue official event certificates for participants & winners. Certificates will automatically appear in the corresponding student's "Certificates & Honors" section with dynamic details and PDF download.</p>

              <form onSubmit={handleUploadCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Completed Event *</label>
                  <select
                    value={certEventName}
                    onChange={(e) => setCertEventName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none"
                  >
                    {completedEvents.map((ev) => (
                      <option key={ev.id} value={ev.title}>{ev.title}</option>
                    ))}
                    {completedEvents.length === 0 && (
                      <>
                        <option value="CMR HackFest 2026 36-Hour Hackathon">CMR HackFest 2026 36-Hour Hackathon</option>
                        <option value="Word-Smith Parliamentary Debate & MUN">Word-Smith Parliamentary Debate & MUN</option>
                        <option value="Swachh Bharat Cleanliness Drive">Swachh Bharat Cleanliness Drive</option>
                        <option value="Pegasus 2025 Annual Cultural Fest Showcase">Pegasus 2025 Annual Cultural Fest Showcase</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Certificate Title / Category *</label>
                  <input
                    type="text"
                    required
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. Certificate of Excellence / Winner"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Student Roll Number (or 'ALL') *</label>
                  <input
                    type="text"
                    required
                    value={certStudentRoll}
                    onChange={(e) => handleCertRollChange(e.target.value)}
                    placeholder="e.g. 237R1A05BA or ALL"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={certStudentName}
                    onChange={(e) => setCertStudentName(e.target.value)}
                    placeholder="e.g. Srujanya Maringanti"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Certificate Template / PDF File (Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-amber-500 cursor-pointer flex items-center gap-1.5 transition-all">
                      <FileCheck size={14} className="text-amber-400" />
                      <span>{certFile ? certFile.name : 'Choose Certificate PDF / Image'}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setCertFile(e.target.files[0]);
                            triggerToast(`Selected certificate file: ${e.target.files[0].name} 📄`);
                          }
                        }}
                      />
                    </label>
                    {certFile && (
                      <button
                        type="button"
                        onClick={() => setCertFile(null)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove file
                      </button>
                    )}
                  </div>
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
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase cursor-pointer shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Upload size={16} />
                    <span>Upload & Issue Certificate PDF</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Assign Volunteer Hours Form */}
            <div className="pt-6 border-t border-slate-800 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-amber-400" />
                <h4 className="text-lg font-black text-white">Assign Volunteer Hours After Event Completion</h4>
              </div>
              <p className="text-xs text-slate-400">Log community service and voluntary participation hours for students in NSS drives and NCC drills.</p>

              <form onSubmit={handleAssignVolunteerHours} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Student Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={volRoll}
                    onChange={(e) => handleVolRollChange(e.target.value)}
                    placeholder="e.g. 237R1A05BA"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300 outline-none focus:border-amber-500"
                  />
                  {volName && <p className="text-[10px] text-slate-400 mt-1">Student: <strong className="text-white">{volName}</strong></p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Completed Service Event *</label>
                  <select
                    value={volEvent}
                    onChange={(e) => setVolEvent(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none"
                  >
                    <option value="Swachh Bharat Cleanliness & Greenery Drive">Swachh Bharat Cleanliness & Greenery Drive</option>
                    <option value="Republic Day Parade & Rifle Drill Training">Republic Day Parade & Rifle Drill Training</option>
                    <option value="Mega Blood Donation & Health Screening Camp">Mega Blood Donation & Health Screening Camp</option>
                    <option value="National Literacy & Orphanage Digital Drive">National Literacy & Orphanage Digital Drive</option>
                    <option value="CMRTC Eco-Green Plantation Drive">CMRTC Eco-Green Plantation Drive</option>
                    <option value="NCC Annual Training Camp (ATC 2026)">NCC Annual Training Camp (ATC 2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Volunteer Hours to Add</label>
                  <select
                    value={volHours}
                    onChange={(e) => setVolHours(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 outline-none"
                  >
                    <option value="4">+4 Volunteer Hours</option>
                    <option value="8">+8 Volunteer Hours</option>
                    <option value="12">+12 Volunteer Hours</option>
                    <option value="16">+16 Volunteer Hours</option>
                    <option value="24">+24 Volunteer Hours</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Clock size={16} />
                    <span>Assign Volunteer Hours 🤝</span>
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
                As a Coordinator, you can upload new event albums, edit photo captions, or delete assets. Uploaded albums immediately appear in the student Photo Gallery.
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

        {/* Section: Manage Sponsors */}
        {activeSection === 'manage-sponsors' && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Award size={22} className="text-emerald-400" />
                  <span>{activeClub.name} • Sponsor & Partner Management</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage corporate partnerships, brand sponsors, and allocated sponsorship funds.
                </p>
              </div>

              <button
                onClick={handleOpenAddSponsor}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
              >
                <Plus size={16} />
                <span>Add Sponsor</span>
              </button>
            </div>

            {/* Financial Summary Top Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Sponsorship Funds Raised</p>
                  <h4 className="text-2xl font-black text-emerald-400 mt-0.5">₹{financialSummary.totalSponsorship.toLocaleString()}</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <DollarSign size={20} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Corporate Sponsors</p>
                  <h4 className="text-2xl font-black text-purple-400 mt-0.5">{sponsors.length} Partners</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Building size={20} />
                </div>
              </div>
            </div>

            {/* Add / Edit Sponsor Form Modal / Card */}
            {isAddingSponsor && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveSponsor}
                className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Building size={16} className="text-emerald-400" />
                    <span>{editingSponsorId ? 'Edit Sponsor Partnership' : 'Add New Corporate Sponsor'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingSponsor(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sponsor / Company Name *</label>
                    <input
                      type="text"
                      required
                      value={spName}
                      onChange={(e) => setSpName(e.target.value)}
                      placeholder="e.g. Google Cloud Campus / Red Bull"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sponsorship Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={spAmount}
                      onChange={(e) => setSpAmount(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-emerald-400 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Event / Purpose Sponsored *</label>
                    <input
                      type="text"
                      required
                      value={spEvent}
                      onChange={(e) => setSpEvent(e.target.value)}
                      placeholder="e.g. CMR HackFest 2026 / Annual Fest"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sponsorship Status</label>
                    <select
                      value={spStatus}
                      onChange={(e) => setSpStatus(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 outline-none"
                    >
                      <option value="Active">Active • Received</option>
                      <option value="Confirmed">Confirmed • Pledge Verified</option>
                      <option value="In Discussion">In Discussion • MoU In Progress</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Contact Email / Representative</label>
                    <input
                      type="text"
                      value={spContact}
                      onChange={(e) => setSpContact(e.target.value)}
                      placeholder="e.g. sponsorships@company.com"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sponsor Deliverables & Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={spDescription}
                      onChange={(e) => setSpDescription(e.target.value)}
                      placeholder="Details on deliverables, stage banners, swag bags, cash prizes..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSponsor(false)}
                    className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    {editingSponsorId ? 'Update Sponsor' : 'Save Sponsor'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Sponsors Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white flex items-center justify-between">
                <span>Current Club Sponsors ({sponsors.length})</span>
                <span className="text-[11px] font-normal text-slate-400">Funds automatically sync to Manage Budget</span>
              </h4>

              {sponsors.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-3">
                  <Building size={32} className="text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No sponsors registered for {activeClub.name} yet.</p>
                  <button
                    onClick={handleOpenAddSponsor}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Add First Sponsor
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sponsors.map((sp) => (
                    <div
                      key={sp.id}
                      className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-white text-base leading-snug">{sp.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                            sp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            sp.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {sp.status || 'Active'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-lg">
                          <span>₹{Number(sp.amount).toLocaleString()}</span>
                          <span className="text-[11px] font-medium text-slate-400">Sponsorship</span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
                            <Tag size={12} />
                            <span>{sp.event}</span>
                          </p>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed">{sp.description}</p>
                          {sp.contact && (
                            <p className="text-[10px] text-slate-400">Contact: {sp.contact}</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-700/80 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditSponsor(sp)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSponsor(sp)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Manage Budget */}
        {activeSection === 'manage-budget' && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <DollarSign size={22} className="text-emerald-400" />
                  <span>{activeClub.name} • Annual Financial & Budget Management Hub</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Track allocated institutional budget, sponsorship revenue, itemized expenditures, and real-time available balances.
                </p>
              </div>

              <button
                onClick={handleOpenAddExpense}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-pink-900/20 active:scale-95 transition-all"
              >
                <Plus size={16} />
                <span>Record Expense</span>
              </button>
            </div>

            {/* A. Budget Overview Cards (4 Metric Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Base Club Budget</p>
                  <Wallet size={16} className="text-blue-400" />
                </div>
                <h4 className="text-2xl font-black text-white">₹{financialSummary.baseBudget.toLocaleString()}</h4>
                <p className="text-[10px] text-slate-400">Institutional allocation</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Sponsorship</p>
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black text-emerald-400">+₹{financialSummary.totalSponsorship.toLocaleString()}</h4>
                <p className="text-[10px] text-emerald-300 font-semibold">{sponsors.length} Corporate partners</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Expenses</p>
                  <TrendingDown size={16} className="text-rose-400" />
                </div>
                <h4 className="text-2xl font-black text-rose-400">-₹{financialSummary.totalExpenses.toLocaleString()}</h4>
                <p className="text-[10px] text-slate-400">{expenses.length} Expense debits logged</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/40 space-y-1 shadow-lg shadow-emerald-950/20">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider">Available Balance</p>
                  <DollarSign size={16} className="text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black text-emerald-400">₹{financialSummary.availableBalance.toLocaleString()}</h4>
                <p className="text-[10px] text-slate-400">Net available funds</p>
              </div>
            </div>

            {/* B. Add / Edit Expense Entry Form */}
            {isAddingExpense && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveExpense}
                className="bg-slate-800 p-6 rounded-2xl border border-pink-500/30 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Receipt size={16} className="text-pink-400" />
                    <span>{editingExpenseId ? 'Edit Expense Transaction' : 'Record New Club Expense / Debit'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingExpense(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Expense Title / Item *</label>
                    <input
                      type="text"
                      required
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      placeholder="e.g. Stage Lighting / High-Speed Routers"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={expAmount}
                      onChange={(e) => setExpAmount(e.target.value)}
                      placeholder="e.g. 7500"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-rose-400 outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Expense Category *</label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none"
                    >
                      <option value="Event Expenses">Event Expenses</option>
                      <option value="Venue">Venue & Sound</option>
                      <option value="Food & Refreshments">Food & Refreshments</option>
                      <option value="Equipment">Equipment & Tech</option>
                      <option value="Marketing">Marketing & Banners</option>
                      <option value="Travel">Travel & Logistics</option>
                      <option value="Prize Pool & Mementos">Prize Pool & Mementos</option>
                      <option value="Other">Other Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Related Event *</label>
                    <input
                      type="text"
                      required
                      value={expEvent}
                      onChange={(e) => setExpEvent(e.target.value)}
                      placeholder="e.g. CMR HackFest 2026"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Transaction Date *</label>
                    <input
                      type="date"
                      required
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description / Notes</label>
                    <input
                      type="text"
                      value={expDescription}
                      onChange={(e) => setExpDescription(e.target.value)}
                      placeholder="Invoice notes, vendor name..."
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingExpense(false)}
                    className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    {editingExpenseId ? 'Update Expense' : 'Record Expense'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* C. Budget & Expense Entries Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white flex items-center justify-between">
                <span>Itemized Club Expenditures ({expenses.length})</span>
                <span className="text-[11px] font-normal text-slate-400">Total Spent: ₹{financialSummary.totalExpenses.toLocaleString()}</span>
              </h4>

              {expenses.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-3">
                  <Receipt size={32} className="text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No expenses recorded for {activeClub.name} yet.</p>
                  <button
                    onClick={handleOpenAddExpense}
                    className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Record First Expense
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-extrabold">
                            {exp.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-semibold">
                            {exp.event}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar size={11} />
                            <span>{exp.date}</span>
                          </span>
                        </div>
                        <h5 className="font-extrabold text-white text-sm mt-0.5">{exp.title}</h5>
                        {exp.description && (
                          <p className="text-xs text-slate-400">{exp.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <span className="text-base font-black text-rose-400 font-mono">
                          -₹{Number(exp.amount).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditExpense(exp)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white cursor-pointer transition-colors"
                            title="Edit expense"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp)}
                            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 cursor-pointer transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Manage Club & Club Settings */}
        {(activeSection === 'manage-club' || activeSection === 'club-settings' || activeSection === 'core-team') && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Settings size={20} className="text-pink-400" />
                  <span>{activeClub.name} • Portal Configuration & Settings</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure official branding title, campus tagline, and student recruitment open/closed status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  savedClubSettings.recruitment === 'open'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  Status: {savedClubSettings.recruitment === 'open' ? 'Recruitment Active' : 'Recruitment Paused'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveClubSettings} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-5 max-w-2xl text-left shadow-lg">
              {/* Unsaved Changes Banner */}
              {hasUnsavedChanges && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>You have unsaved configuration changes</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setClubTitle(savedClubSettings.name);
                      setClubSubtitle(savedClubSettings.subtitle);
                      setClubRecruitment(savedClubSettings.recruitment);
                    }}
                    className="text-[11px] text-amber-200 hover:text-white underline cursor-pointer transition-colors"
                  >
                    Discard Changes
                  </button>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center justify-between">
                  <span>Club Official Title *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Appears across student & coordinator portals</span>
                </label>
                <input
                  type="text"
                  required
                  value={clubTitle}
                  onChange={(e) => setClubTitle(e.target.value)}
                  placeholder="e.g. Codeholics"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center justify-between">
                  <span>Tagline / Short Subtitle *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Short description or domain specialty</span>
                </label>
                <input
                  type="text"
                  required
                  value={clubSubtitle}
                  onChange={(e) => setClubSubtitle(e.target.value)}
                  placeholder="e.g. Coding & Tech Club / Visual Arts and Drama"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center justify-between">
                  <span>Member Recruitment Status *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Controls student application permissions</span>
                </label>
                <select
                  value={clubRecruitment}
                  onChange={(e) => setClubRecruitment(e.target.value)}
                  className={`w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold outline-none cursor-pointer focus:border-pink-500 transition-all ${
                    clubRecruitment === 'open' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <option value="open" className="bg-slate-900 text-emerald-400 font-bold">
                    Open • Accepting New Student Applications
                  </option>
                  <option value="closed" className="bg-slate-900 text-rose-400 font-bold">
                    Closed • Recruitment Paused
                  </option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                    hasUnsavedChanges
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-900/40 ring-2 ring-pink-400/50'
                      : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
                >
                  <Settings size={15} />
                  <span>Save Club Configuration</span>
                </button>

                {hasUnsavedChanges && (
                  <button
                    type="button"
                    onClick={() => {
                      setClubTitle(savedClubSettings.name);
                      setClubSubtitle(savedClubSettings.subtitle);
                      setClubRecruitment(savedClubSettings.recruitment);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Section: Core Team Leadership Roster */}
        {activeSection === 'core-team' && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Users size={20} className="text-pink-400" />
                  <span>{activeClub.name} • Core Leadership & Team Roster</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official office bearers, faculty mentor, and appointed student leads for academic year 2025-2026.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold">
                CMRTC Verified Roster
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase">
                  Faculty Coordinator
                </span>
                <h4 className="text-base font-black text-white">{activeClub.facultyCoordinator || 'Dr. K. Srinivasa Rao'}</h4>
                <p className="text-xs text-slate-400">Department Faculty Advisor & Sign-off Authority</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-extrabold uppercase">
                  Student Lead / President
                </span>
                <h4 className="text-base font-black text-white">{activeClub.studentLead || user?.name || 'Student President'}</h4>
                <p className="text-xs text-slate-400">Overall Club Executive & Campus Representative</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase">
                  Operations & Logistics Head
                </span>
                <h4 className="text-base font-black text-white">Rohit Sen</h4>
                <p className="text-xs text-slate-400">Stage, Sound, & Venue Logistics</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase">
                  Technical & Media Lead
                </span>
                <h4 className="text-base font-black text-white">Varun Reddy</h4>
                <p className="text-xs text-slate-400">Portal Updates, Graphics & Live Streaming</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                  Active Coordinator
                </span>
                <h4 className="text-base font-black text-emerald-400">{user?.name || 'Club Coordinator'}</h4>
                <p className="text-xs text-slate-400">Current Session Operator • {user?.email || 'coordinator@cmr.edu.in'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section: Upload Photos Console */}
        {activeSection === 'upload-photos' && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Upload size={20} className="text-pink-400" />
                  <span>{activeClub.name} • Event Photo Gallery & Media Assets</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload flagship event photos, hackathon highlights, and cultural showcases visible to all campus students.
                </p>
              </div>

              <button
                onClick={() => setIsGalleryOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-900/20 active:scale-95 transition-all"
              >
                <Upload size={16} />
                <span>Open Photo Upload Modal</span>
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black mx-auto">
                <ImageIcon size={28} />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="font-extrabold text-white text-base">Campus Photo Gallery Console</h4>
                <p className="text-xs text-slate-400">Launch the dedicated high-resolution photo uploader to add albums, tag event dates, and publish gallery highlights.</p>
              </div>
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95"
              >
                Launch Photo Uploader Console 📸
              </button>
            </div>
          </div>
        )}

        {/* Section: Coordinator Profile */}
        {activeSection === 'my-profile' && (
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-left">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <User size={20} className="text-pink-400" />
                <span>Coordinator Official Profile</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authenticated CMRTC Club Coordinator credentials and management permissions.
              </p>
            </div>

            <div className="max-w-2xl bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-700/80 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black text-xl border border-pink-500/30">
                  {user?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{user?.name || 'Club Coordinator'}</h4>
                  <p className="text-xs text-pink-400 font-bold">{activeClub.name} Coordinator</p>
                  <p className="text-xs text-slate-400 font-mono">{user?.email || 'coordinator@cmr.edu.in'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Club</span>
                  <span className="font-extrabold text-white">{activeClub.name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Portal Authority</span>
                  <span className="font-extrabold text-emerald-400">Core Team Executive</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Full Approve / Reject Members Queue */}
        {(activeSection === 'approve-members' || activeSection === 'membership-requests') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <UserCheck size={20} className="text-pink-400" />
                <span>Pending Membership Applications ({memberRequests.length})</span>
              </h3>
              <button
                onClick={() => {
                  triggerToast(`Exporting member roster for ${activeClub.name}... 📊`);
                  const res = downloadClubMembersCSV(selectedClubId, activeClub.name);
                  if (res.success) {
                    setTimeout(() => triggerToast(`Downloaded members roster: ${res.filename} 🎉`), 300);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 font-extrabold text-xs cursor-pointer border border-pink-500/30 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <FileText size={13} />
                <span>Export Members CSV</span>
              </button>
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
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Check size={14} />
                        <span>Approve Member</span>
                      </button>
                      <button
                        onClick={() => handleRejectMember(req.id, req.name)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
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
              {(() => {
                const allRegs = clubEvents.flatMap(e => 
                  (e.registeredStudents || []).map((roll, idx) => ({
                    roll,
                    name: getStudentNameByRoll(roll) || `Student ${roll}`,
                    event: e.title,
                    pass: `Seat #${idx + 1} (Confirmed)`
                  }))
                );

                if (allRegs.length === 0) {
                  return <p className="text-xs text-slate-400 py-6 text-center">No student registrations recorded yet for this club's events.</p>;
                }

                return allRegs.map((reg, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{reg.name} <span className="text-slate-400">({reg.roll})</span></h4>
                      <p className="text-[11px] text-slate-400">Event: <span className="text-pink-400 font-bold">{reg.event}</span></p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {reg.pass}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Section: Manage Announcements */}
        {activeSection === 'manage-announcements' && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6 text-left">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Bell size={20} className="text-amber-400" />
              <span>Post Club Announcement</span>
            </h3>

            <form onSubmit={handlePublishAnnouncement} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Auditions Open for Annual Fest / Hackathon Alert"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Announcement Message *</label>
                <textarea
                  rows={3}
                  required
                  value={annDetails}
                  onChange={(e) => setAnnDetails(e.target.value)}
                  placeholder="Enter full announcement details, instructions, and registration links..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Priority Urgency</label>
                <select
                  value={annUrgency}
                  onChange={(e) => setAnnUrgency(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 outline-none"
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Urgent">Urgent Alert</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Bell size={16} />
                <span>Publish Announcement</span>
              </button>
            </form>

            {/* Published Announcements Roster */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-sm font-black text-white flex items-center justify-between">
                <span>Campus Announcements Feed ({announcements.length})</span>
                <span className="text-[11px] font-normal text-slate-400">Broadcasted to all student accounts</span>
              </h4>

              {announcements.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No announcements published yet.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase">
                              {ann.club || ann.clubName}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              ann.urgency === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                              ann.urgency === 'High Priority' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                              'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {ann.urgency}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-white text-sm mt-1.5">{ann.title}</h5>
                        </div>

                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                          title="Delete announcement"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 font-medium leading-relaxed">{ann.message || ann.details}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                        <span>Posted by: <strong className="text-slate-200">{ann.publisherName || 'Coordinator'}</strong></span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{ann.date}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <button 
                  onClick={() => {
                    triggerToast(`Generating Monthly Participation Report for ${activeClub.name}... 📄`);
                    const res = downloadClubMonthlyParticipationPDF(selectedClubId, activeClub.name);
                    if (res.success) {
                      setTimeout(() => triggerToast(`Report downloaded successfully: ${res.filename} 🎉`), 300);
                    }
                  }} 
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-xs"
                >
                  Download PDF
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-sm">Quarterly Financial Statement</h4>
                <p className="text-xs text-slate-400">Sponsorship collections & expense vouchers.</p>
                <button 
                  onClick={() => {
                    triggerToast(`Generating Quarterly Financial Statement for ${activeClub.name}... 📄`);
                    const res = downloadClubFinancialStatementPDF(selectedClubId, activeClub.name);
                    if (res.success) {
                      setTimeout(() => triggerToast(`Report downloaded successfully: ${res.filename} 🎉`), 300);
                    }
                  }} 
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-xs"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Event Feedback & Satisfaction Analytics Panel */}
            <div className="pt-6 border-t border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Star size={18} className="text-amber-400 fill-amber-400" />
                    <span>Event Feedback & Student Reviews Analytics</span>
                  </h4>
                  <p className="text-xs text-slate-400">Real-time student ratings, feedback list, and most liked event comments.</p>
                </div>
              </div>

              {(() => {
                const summary = getEventFeedbackSummary('cal-9');
                return (
                  <div className="space-y-6">
                    {/* Top Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Average Rating</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-amber-400 font-mono">{summary.avgRating} ★</span>
                          <span className="text-xs text-slate-400 font-bold">/ 5.0 Rating</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Reviews</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-white font-mono">{summary.totalReviews}</span>
                          <span className="text-xs text-emerald-400 font-bold">Reviews Received</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Student Satisfaction</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-emerald-400 font-mono">98%</span>
                          <span className="text-xs text-slate-400 font-bold">Positive Feedback</span>
                        </div>
                      </div>
                    </div>

                    {/* Most Liked Comments */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <ThumbsUp size={14} className="text-amber-400" />
                        <span>Most Liked Student Comments</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {summary.mostLikedComments.map((rev) => (
                          <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">{rev.studentName} <span className="text-pink-400">({rev.rollNo})</span></span>
                              <span className="text-xs font-bold text-amber-400 font-mono">{rev.rating} ★</span>
                            </div>
                            <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                              <span>Date: {rev.date}</span>
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <ThumbsUp size={11} /> {rev.likes} Likes
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Feedback List */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-extrabold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <MessageSquare size={14} className="text-blue-400" />
                        <span>All Student Feedback & Reviews ({summary.feedbackList.length})</span>
                      </h5>
                      <div className="space-y-2">
                        {summary.feedbackList.map((rev) => (
                          <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-white">{rev.studentName}</span>
                                <span className="text-slate-400 font-mono text-[11px]">({rev.rollNo})</span>
                                <span className="text-amber-400 font-bold">{rev.rating} ★</span>
                              </div>
                              <p className="text-slate-300 italic">"{rev.comment}"</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Influencer Roster CTA inside Reports section */}
            <div className="bg-gradient-to-r from-pink-950/50 to-slate-900/80 p-6 rounded-3xl border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-400" />
                  <span>Campus Influencer & Audition Roster</span>
                </h4>
                <p className="text-xs text-slate-400">Monitor student creators across all clubs for event promotions and outreach calls.</p>
              </div>
              <button
                onClick={() => setIsInfluencerOpen(true)}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase cursor-pointer shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>View Influencer Roster</span>
              </button>
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
          initialClubId={selectedClubId || activeClub.id}
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

        {/* Event QR Code & Attendance Monitor Modal */}
        <EventQRGeneratorModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          event={selectedQREvent || { id: 'cal-4', title: 'CMR HackFest 2026' }}
          onToast={(msg, type) => triggerToast(msg)}
        />

        <DhondiFooter className="mt-8 pt-4 border-t border-slate-200" />
      </main>
    </div>
  );
};

export default CoreTeamDashboard;
