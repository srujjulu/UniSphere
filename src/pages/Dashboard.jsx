import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/layout/DashboardLayout';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/dashboard/HeroSection';
import StatsBar from '../components/dashboard/StatsBar';
import ClubGrid from '../components/dashboard/ClubGrid';
import ClubDetailsModal from '../components/dashboard/ClubDetailsModal';
import SearchInput from '../components/ui/SearchInput';
import Skeleton from '../components/ui/Skeleton';
import Toast from '../components/ui/Toast';
import { getStoredClubs, incrementClubViews } from '../utils/mockClubs';

import useAuth from '../hooks/useAuth';
import { Building2, GraduationCap, ShieldCheck, ArrowRight, X, Search, Sparkles, BookOpen, Users } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Loading & State
  const [initialLoading, setInitialLoading] = useState(true);
  const [joinedClubIds] = useState([]);
  const [joiningClubId] = useState(null);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [targetClubName, setTargetClubName] = useState('');

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

  // Handle More details click & increment views
  const handleMoreClick = (club) => {
    const newViews = incrementClubViews(club.id);
    setClubsList((prev) =>
      prev.map((c) => (c.id === club.id ? { ...c, views: newViews } : c))
    );
    setSelectedClub({ ...club, views: newViews });
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

  return (
    <DashboardLayout>
      {/* Toast Notification Mount */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Navigation Header */}
      <Navbar />

      {/* Layout Grid Details */}
      <div id="home" className="flex-1 flex flex-col gap-8 sm:gap-10 py-6 sm:py-8 w-full">
        
        {/* Title Entrance Section */}
        <HeroSection />

        {/* glass counter metrics */}
        <StatsBar totalVisits={totalVisits} />

        {/* About CMR Technical Campus (College & Clubs Info Section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          id="about-cmrtc"
          className="w-full bg-[#0E1526]/70 p-6 sm:p-8 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6 text-left"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <Building2 size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">About CMR Technical Campus (CMRTC)</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Kandlakoya, Medchal Road, Hyderabad • NAAC A+ Accredited Autonomous Institution</p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 shrink-0">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Affiliated to JNTUH</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 font-normal leading-relaxed">
            <div className="space-y-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <h3 className="font-bold text-white text-sm text-indigo-300 flex items-center gap-2">
                <GraduationCap size={16} className="text-indigo-400" />
                <span>Academic Excellence</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                CMRTC provides engineering education across CSE, AI & ML, Data Science, ECE, IT, and Mechanical Engineering, fostering industry-ready technical talent.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <h3 className="font-bold text-white text-sm text-sky-300 flex items-center gap-2">
                <Sparkles size={16} className="text-sky-400" />
                <span>Dynamic Student Life</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Student development is powered by 6 active campus clubs organizing national hackathons, cultural festivals, photography tours, debates, and community services.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <h3 className="font-bold text-white text-sm text-emerald-300 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Verified Membership Portal</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Visitors can browse club details, events, and galleries. Enrolled CMRTC students log in with their college email and Roll Number to manage applications and certifications.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="w-full"
        >
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </motion.div>

        {/* Main Grid View */}
        <div id="explore-clubs" className="w-full flex-1 min-h-[350px]">
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
              className="w-full flex flex-col items-center justify-center p-14 text-center bg-[#0E1526]/50 border border-white/[0.06] rounded-3xl backdrop-blur-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">No Clubs Found</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm leading-relaxed">
                We couldn't find any campus clubs matching "{searchQuery}" under {activeCategory === 'All' ? 'any category' : `${activeCategory}`}.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer id="contact" className="w-full py-8 border-t border-white/[0.06] text-center text-xs text-slate-500 font-medium tracking-wider uppercase select-none mt-8">
        &copy; {new Date().getFullYear()} CMR Technical Campus · UniSphere Portal · All rights reserved.
      </footer>

      {/* Modal Popup Details */}
      <ClubDetailsModal
        club={selectedClub}
        isOpen={selectedClub !== null}
        onClose={() => setSelectedClub(null)}
        isJoined={selectedClub ? joinedClubIds.includes(selectedClub.id) : false}
        isJoining={selectedClub ? joiningClubId === selectedClub.id : false}
        onJoinToggle={() => selectedClub && handleJoinToggle(selectedClub.id)}
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

