import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/layout/DashboardLayout';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/dashboard/HeroSection';
import StatsBar from '../components/dashboard/StatsBar';
import FeaturesSection from '../components/dashboard/FeaturesSection';
import HowItWorksSection from '../components/dashboard/HowItWorksSection';
import ClubGrid from '../components/dashboard/ClubGrid';
import ClubDetailsModal from '../components/dashboard/ClubDetailsModal';
import ExploreEventsModal from '../components/dashboard/ExploreEventsModal';
import SearchInput from '../components/ui/SearchInput';
import Skeleton from '../components/ui/Skeleton';
import Toast from '../components/ui/Toast';
import { getStoredClubs, incrementClubViews } from '../utils/mockClubs';
import { initialCalendarEvents } from '../utils/mockCalendarEvents';
import useAuth from '../hooks/useAuth';
import { Building2, GraduationCap, ShieldCheck, ArrowRight, X, Search, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Loading & State
  const [initialLoading, setInitialLoading] = useState(true);
  const [joinedClubIds] = useState([]);
  const [joiningClubId] = useState(null);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [targetClubName, setTargetClubName] = useState('');
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  // Clubs List State with view count persistence
  const [clubsList, setClubsList] = useState(getStoredClubs);

  // Modal & Toast lists
  const [selectedClub, setSelectedClub] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Search & Filter Settings
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  // Sync stored clubs when returning to dashboard
  useEffect(() => {
    setClubsList(getStoredClubs());
  }, []);

  // Compute Total Visits across all clubs dynamically
  const totalVisits = useMemo(() => {
    return clubsList.reduce((sum, c) => sum + (c.views || 0), 0);
  }, [clubsList]);

  // Trigger loading state simulator
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const triggerToast = (msg) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: msg, type: 'info' }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle Join Toggle: Check if logged in first
  const handleJoinToggle = (clubId) => {
    const club = clubsList.find(c => c.id === clubId);
    const newViews = incrementClubViews(clubId);
    setClubsList((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, views: newViews } : c))
    );

    if (!user) {
      setTargetClubName(club?.name || 'Club');
      setIsAuthPromptOpen(true);
      return;
    }

    if (user.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate(`/club/${clubId}`);
    }
  };

  // Handle More details click & navigate to club hub page
  const handleMoreClick = (club) => {
    const newViews = incrementClubViews(club.id);
    setClubsList((prev) =>
      prev.map((c) => (c.id === club.id ? { ...c, views: newViews } : c))
    );
    navigate(`/club/${club.id}`);
  };

  // Filter & Sort Logic
  const filteredAndSortedClubs = useMemo(() => {
    let result = [...clubsList];

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter((club) => club.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (club) =>
          club.name.toLowerCase().includes(query) ||
          club.subtitle.toLowerCase().includes(query) ||
          club.description.toLowerCase().includes(query)
      );
    }

    // Sort Results
    result.sort((a, b) => {
      if (sortBy === 'Popular') {
        return b.views - a.views;
      }
      if (sortBy === 'Alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'Newest') {
        return b.established - a.established;
      }
      return 0;
    });

    return result;
  }, [clubsList, activeCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setSortBy('Popular');
  };

  const handleEventRegistration = (evt, isRegistering) => {
    if (!user) {
      setIsEventsModalOpen(false);
      setTargetClubName(evt?.clubName || 'Campus Event');
      setIsAuthPromptOpen(true);
      return;
    }

    if (isRegistering) {
      triggerToast(`Registered for ${evt.title}! 🎟️ Check your dashboard passes.`);
    } else {
      triggerToast(`Cancelled registration for ${evt.title}.`);
    }
  };

  return (
    <DashboardLayout>
      {/* Toast Notification Mount */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Navigation Header */}
      <Navbar />

      {/* Layout Grid Details */}
      <div id="home" className="flex flex-col gap-8 sm:gap-10 pt-4 pb-2 w-full">

        {/* 1. Title Entrance Section */}
        <HeroSection onViewEvents={() => setIsEventsModalOpen(true)} />

        {/* 2. Glass counter metrics */}
        <StatsBar totalVisits={totalVisits} />

        {/* 3. UniSphere Features Section */}
        <FeaturesSection />

        {/* 4. How It Works Section */}
        <HowItWorksSection />

        {/* 5. About CMR Technical Campus (College & Clubs Info Section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          id="about-cmrtc"
          className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-6 text-left relative overflow-hidden"
        >
          {/* Top subtle brand gradient highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">About CMR Technical Campus (CMRTC)</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Kandlakoya, Medchal Road, Hyderabad • NAAC A+ Accredited Autonomous Institution</p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>Affiliated to JNTUH</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 font-normal leading-relaxed">
            <div className="space-y-2.5 p-5 rounded-2xl bg-indigo-50/40 hover:bg-indigo-50/70 border border-indigo-100/70 transition-colors">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <GraduationCap size={16} />
                </div>
                <span>Academic Excellence</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                CMRTC provides engineering education across CSE, AI & ML, Data Science, ECE, IT, and Mechanical Engineering, fostering industry-ready technical talent.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-2xl bg-sky-50/40 hover:bg-sky-50/70 border border-sky-100/70 transition-colors">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <span>Dynamic Student Life</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Student development is powered by 6 active campus clubs organizing national hackathons, cultural festivals, photography tours, debates, and community services.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-2xl bg-emerald-50/40 hover:bg-emerald-50/70 border border-emerald-100/70 transition-colors">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <span>Verified Membership Portal</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Visitors can browse club details, events, and galleries. Enrolled CMRTC students log in with their college email and Roll Number to manage applications and certifications.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 6. Club Search & Category Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-left">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Campus Directory</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Official Student Clubs</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">Filter by category or search by club name and initiatives</p>
          </div>

          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </motion.div>

        {/* 7. Main Clubs Grid View */}
        <div id="explore-clubs" className="w-full pb-4">
          {initialLoading ? (
            <Skeleton />
          ) : filteredAndSortedClubs.length > 0 ? (
            <ClubGrid
              clubs={filteredAndSortedClubs}
              joinedClubIds={joinedClubIds}
              joiningClubId={joiningClubId}
              onJoinToggle={handleJoinToggle}
              onMoreClick={handleMoreClick}
            />
          ) : (
            /* Empty Search States */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center p-14 text-center bg-white border border-slate-200 rounded-3xl shadow-xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Clubs Found</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm leading-relaxed">
                We couldn't find any campus clubs matching "{searchQuery}" under {activeCategory === 'All' ? 'any category' : `${activeCategory}`}.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs transition-all"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal Popup Details */}
      <ClubDetailsModal
        club={selectedClub}
        isOpen={selectedClub !== null}
        onClose={() => setSelectedClub(null)}
        isJoined={selectedClub ? joinedClubIds.includes(selectedClub.id) : false}
        isJoining={selectedClub ? joiningClubId === selectedClub.id : false}
        onJoinToggle={() => selectedClub && handleJoinToggle(selectedClub.id)}
      />

      {/* Explore Campus Events Modal */}
      <ExploreEventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        clubName="CMRTC Campus"
        events={initialCalendarEvents}
        onRegister={handleEventRegistration}
      />

      {/* Student Login Required Modal */}
      {isAuthPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#0E1526] border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left relative"
          >
            <button
              onClick={() => setIsAuthPromptOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <GraduationCap size={24} />
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-wider">
                CMRTC Student Portal Login
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Log In Required to Join {targetClubName}
              </h3>
              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                To submit a membership application for CMRTC campus clubs, students must log in with their official CMR Email (<span className="text-indigo-300 font-semibold">@cmr.edu.in</span>) and Roll Number.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsAuthPromptOpen(false);
                  navigate('/login');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer transition-all active:scale-98"
              >
                <span>Go to CMRTC Student Login</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setIsAuthPromptOpen(false)}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                Continue Browsing Public Portal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
