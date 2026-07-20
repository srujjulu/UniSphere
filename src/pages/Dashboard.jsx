import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Search } from 'lucide-react';

import DashboardLayout from '../components/layout/DashboardLayout';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/dashboard/HeroSection';
import StatsBar from '../components/dashboard/StatsBar';
import ClubGrid from '../components/dashboard/ClubGrid';
import ClubDetailsModal from '../components/dashboard/ClubDetailsModal';
import SearchInput from '../components/ui/SearchInput';
import Skeleton from '../components/ui/Skeleton';
import Toast from '../components/ui/Toast';
import { mockClubs } from '../utils/mockClubs';

const Dashboard = () => {
  const navigate = useNavigate();
  // Loading & State
  const [initialLoading, setInitialLoading] = useState(true);
  const [joinedClubIds, setJoinedClubIds] = useState([]);
  const [joiningClubId, setJoiningClubId] = useState(null);
  
  // Modal & Toast lists
  const [selectedClub, setSelectedClub] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Search & Filter Settings
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  // Trigger loading state simulator
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Toast controls
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 4s
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation to dedicated club page
  const handleJoinToggle = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  // Filter & Sort Logic
  const filteredAndSortedClubs = useMemo(() => {
    let result = [...mockClubs];

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
  }, [activeCategory, searchQuery, sortBy]);

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
        <StatsBar />

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
              onMoreClick={(club) => setSelectedClub(club)}
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
    </DashboardLayout>
  );
};

export default Dashboard;
