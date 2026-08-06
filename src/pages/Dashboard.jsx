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
import { Building2, GraduationCap, ShieldCheck, ArrowRight, X } from 'lucide-react';

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
    const timer = setTimeout(() => setInitialLoading(false), 1200);
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
      <div className="flex-1 flex flex-col gap-10 py-10 w-full">
        
        {/* Title Entrance Section */}
        <HeroSection />

        {/* glass counter metrics */}
        <StatsBar totalVisits={totalVisits} />

        {/* About CMR Technical Campus (College & Clubs Info Section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full bg-gradient-to-r from-slate-900/80 via-indigo-950/40 to-slate-900/80 p-8 rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-6 text-left"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black border border-pink-500/30">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">About CMR Technical Campus (CMRTC)</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Kandlakoya, Medchal Road, Hyderabad • NAAC A+ Accredited Autonomous Institution</p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>Affiliated to JNTUH</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 font-medium leading-relaxed">
            <div className="space-y-2 p-5 rounded-2xl bg-slate-800/50 border border-white/5">
              <h3 className="font-extrabold text-white text-sm text-pink-400 flex items-center gap-2">
                <GraduationCap size={16} />
                <span>Academic Excellence</span>
              </h3>
              <p>
                CMRTC offers top-tier engineering education across CSE, AI & ML, Data Science, ECE, IT, and Mechanical Engineering, fostering industry-ready technical talent.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-800/50 border border-white/5">
              <h3 className="font-extrabold text-white text-sm text-blue-400 flex items-center gap-2">
                <Building2 size={16} />
                <span>Dynamic Campus Life</span>
              </h3>
              <p>
                Student development at CMRTC is fueled by 6 active campus clubs providing technical hackathons, cultural festivals, photography workshops, literary debates, and national service.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-800/50 border border-white/5">
              <h3 className="font-extrabold text-white text-sm text-emerald-400 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Official Membership Portal</span>
              </h3>
              <p>
                Prospective students and visitors can explore all club details below. Enrolled CMRTC students log in with their college email & Roll Number to submit membership applications.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
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
        <div className="w-full flex-1 min-h-[350px]">
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center p-16 text-center bg-white/3 border border-white/6 rounded-[28px] backdrop-blur-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">No Clubs Found</h3>
              <p className="text-slate-400 text-sm mt-1.5 max-w-sm leading-relaxed">
                We couldn't find any campus clubs matching "{searchQuery}" under {activeCategory === 'All' ? 'any category' : `${activeCategory}`}.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 px-6 py-3 rounded-xl bg-[#4F8BFF] hover:bg-[#4F8BFF]/90 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md hover:shadow-[0_4px_15px_rgba(79,139,255,0.3)] transition-all"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="w-full py-8 border-t border-white/5 text-center text-xs text-slate-500 font-semibold tracking-wider uppercase select-none mt-10">
        &copy; {new Date().getFullYear()} CMR Technical Campus. All rights reserved.
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#0F172A] border border-pink-500/30 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative"
          >
            <button
              onClick={() => setIsAuthPromptOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 rounded-full bg-white/5"
            >
              <X size={16} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
              <GraduationCap size={28} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-extrabold text-[10px] uppercase">
                CMRTC Student Portal Login
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Log In Required to Join {targetClubName}
              </h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                To submit a membership application for CMRTC campus clubs, students must log in with their official CMR Email (<span className="text-pink-400 font-bold">@cmr.edu.in</span>) and Roll Number.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsAuthPromptOpen(false);
                  navigate('/login');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25 cursor-pointer"
              >
                <span>Go to CMRTC Student Login</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setIsAuthPromptOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
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
