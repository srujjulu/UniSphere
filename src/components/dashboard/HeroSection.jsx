import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  UserCheck, 
  Image as ImageIcon 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { clubsApi, eventsApi, galleryApi } from '../../services/api';
import { getStoredRequests } from '../../utils/mockRequests';
import { initialCalendarEvents } from '../../utils/mockCalendarEvents';
import { getStoredClubs } from '../../utils/mockClubs';
import { clubMasterDrives } from '../../utils/mockGallery';

const HeroSection = ({ onViewEvents }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    clubs: 6,
    events: 10,
    requests: 40,
    albums: 15
  });

  // Dynamic API Sync with Graceful Local Fallback
  useEffect(() => {
    let isMounted = true;

    const fetchLiveStats = async () => {
      let liveClubs = 6;
      let liveEvents = 10;
      let liveRequests = 40;
      let liveAlbums = 15;

      try {
        const storedClubs = getStoredClubs();
        if (storedClubs?.length) liveClubs = storedClubs.length;

        const storedReqs = getStoredRequests();
        if (storedReqs?.length) liveRequests = Math.max(40, storedReqs.length);

        if (initialCalendarEvents?.length) {
          liveEvents = Math.max(10, initialCalendarEvents.length);
        }

        const totalMasterAlbums = Object.values(clubMasterDrives || {}).reduce(
          (acc, c) => acc + (c.totalAlbums || 0),
          0
        );
        if (totalMasterAlbums) liveAlbums = Math.max(15, totalMasterAlbums);

        // Attempt API queries if backend is reachable
        try {
          const clubRes = await clubsApi.getAll();
          if (clubRes?.data?.length) liveClubs = clubRes.data.length;
        } catch {
          // Keep fallback
        }

        try {
          const eventRes = await eventsApi.getAll();
          if (eventRes?.data?.length) liveEvents = Math.max(10, eventRes.data.length);
        } catch {
          // Keep fallback
        }

        try {
          const galleryRes = await galleryApi.getAll();
          if (galleryRes?.data?.length) liveAlbums = Math.max(15, galleryRes.data.length);
        } catch {
          // Keep fallback
        }

        if (isMounted) {
          setStats({
            clubs: liveClubs,
            events: liveEvents,
            requests: liveRequests,
            albums: liveAlbums
          });
        }
      } catch (err) {
        console.warn('Stats fetch fallback to default counts:', err);
      }
    };

    fetchLiveStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExploreClick = () => {
    const el = document.getElementById('explore-clubs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center space-y-8 py-4 sm:py-8 px-4 select-none max-w-5xl mx-auto"
    >
      {/* Verified Institutional Pill */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 shadow-xs"
      >
        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
        <span>CMR Technical Campus</span>
        <span className="text-slate-300">•</span>
        <span className="text-blue-900 font-semibold">NAAC A+ Autonomous Institution</span>
        <ShieldCheck size={14} className="text-emerald-600 ml-0.5" />
      </motion.div>

      {/* Main Punchy Editorial Headline */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
          Where Campus Life <span className="text-blue-600">Comes Alive</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Discover, join, and participate in campus clubs, events, and activities through one centralized platform.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handleExploreClick}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Compass size={16} />
          <span>Explore Clubs</span>
        </button>

        <button
          onClick={handleDashboardClick}
          className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          <span>Go to My Dashboard</span>
          <ArrowRight size={16} />
        </button>

        {onViewEvents && (
          <button
            onClick={onViewEvents}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Calendar size={16} className="text-blue-600" />
            <span>View Events</span>
          </button>
        )}
      </div>

      {/* College Quick Highlights Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-4">
        {/* 6+ Student Clubs */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-left transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 border border-blue-100">
            <Compass size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{stats.clubs}+</p>
          <p className="text-[11px] text-slate-500 font-semibold tracking-wide">Student Clubs</p>
        </div>

        {/* 10+ Events */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-left transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 border border-amber-100">
            <Calendar size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{stats.events}+</p>
          <p className="text-[11px] text-slate-500 font-semibold tracking-wide">Events</p>
        </div>

        {/* 40+ Membership Requests */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-left transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100">
            <UserCheck size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{stats.requests}+</p>
          <p className="text-[11px] text-slate-500 font-semibold tracking-wide">Membership Requests</p>
        </div>

        {/* 15+ Photo Albums */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-left transition-all hover:border-slate-300">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 border border-purple-100">
            <ImageIcon size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{stats.albums}+</p>
          <p className="text-[11px] text-slate-500 font-semibold tracking-wide">Photo Albums</p>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
