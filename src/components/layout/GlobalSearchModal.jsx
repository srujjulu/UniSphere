import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Users, 
  Calendar, 
  Award, 
  Compass, 
  Bell, 
  Image as ImageIcon, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  Command
} from 'lucide-react';
import { queryGlobalSearch } from '../../utils/globalSearchIndex';

const typeIcons = {
  club: Compass,
  event: Calendar,
  certificate: Award,
  student: Users,
  announcement: Bell,
  gallery: ImageIcon,
  membership: UserCheck
};

const typeColors = {
  club: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  event: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  certificate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  student: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  announcement: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  gallery: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  membership: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
};

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Focus input automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Keyboard Shortcut: Ctrl + K or Cmd + K to open search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          const searchBtn = document.getElementById('global-search-trigger');
          if (searchBtn) searchBtn.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = queryGlobalSearch(searchTerm);

  const allResultsList = [
    ...results.clubs,
    ...results.events,
    ...results.students,
    ...results.certificates,
    ...results.announcements,
    ...results.gallery,
    ...results.memberships
  ];

  const filteredResults = allResultsList.filter(item => 
    activeCategory === 'All' || item.type.toLowerCase() === activeCategory.toLowerCase()
  );

  const handleItemClick = (item) => {
    onClose();
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden text-slate-100 select-none"
        >
          {/* Top Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
            <Search size={22} className="text-pink-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students, clubs, events, certificates, announcements..."
              className="w-full bg-transparent text-base sm:text-lg font-semibold text-white placeholder-slate-500 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
            >
              ESC
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="p-3 border-b border-slate-800/60 bg-slate-900/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {['All', 'Club', 'Event', 'Student', 'Certificate', 'Announcement', 'Gallery'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {cat}s
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-2 scrollbar-thin">
            {!searchTerm.trim() ? (
              /* Quick Suggestions Prompt */
              <div className="py-8 text-center space-y-3">
                <Sparkles size={32} className="mx-auto text-pink-400" />
                <h4 className="text-sm font-bold text-white">Start typing to search UniSphere</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Search student roll numbers (e.g. 237R1A05BA), clubs (Lexis, Codeholics, AKRITI), events (CMR HackFest), or certificates.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {['Codeholics', '237R1A05BA', 'CMR HackFest', 'MUN Certificate', 'Pegasus'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Search size={32} className="mx-auto text-slate-600" />
                <p className="font-bold text-slate-300">No matching search results found for "{searchTerm}"</p>
                <p className="text-[11px] text-slate-500">Try searching by club name, event title, or student roll number.</p>
              </div>
            ) : (
              filteredResults.map((item) => {
                const IconComponent = typeIcons[item.type] || Search;
                const colorClass = typeColors[item.type] || 'text-slate-300 bg-slate-800';

                return (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleItemClick(item)}
                    className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-pink-500/40 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${colorClass} border flex items-center justify-center flex-shrink-0 font-bold`}>
                        <IconComponent size={18} />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-pink-400 font-mono text-[10px]">
                            {item.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white truncate group-hover:text-pink-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-pink-600 text-slate-400 group-hover:text-white transition-all flex-shrink-0">
                      <ArrowRight size={16} />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Command size={13} />
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700">Ctrl + K</kbd> to open anytime</span>
            </span>
            <span className="font-extrabold text-slate-300">
              {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalSearchModal;
