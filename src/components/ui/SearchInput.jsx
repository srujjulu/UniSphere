import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

const categories = ['All', 'Cultural', 'Technical', 'Photography', 'Literary', 'Defence', 'Service'];

const SearchInput = ({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory, 
  sortBy, 
  setSortBy 
}) => {
  return (
    <div className="w-full flex flex-col gap-6 select-none text-left">
      {/* Search Input and Sort Row */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        {/* Search Field */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={20} strokeWidth={2.2} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs by name, subtitle, or description..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/4 hover:bg-white/6 focus:bg-white/8 border border-white/8 hover:border-white/12 focus:border-[#4F8BFF] text-white placeholder-slate-400 outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_0_20px_rgba(79,139,255,0.15)] text-sm"
          />
        </div>

        {/* Custom Sort Select dropdown */}
        <div className="relative w-full md:w-56 flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-14 pl-4 pr-10 rounded-2xl bg-white/4 hover:bg-white/6 border border-white/8 hover:border-white/12 text-slate-200 font-semibold text-sm outline-none cursor-pointer appearance-none transition-all duration-300"
            aria-label="Sort Clubs"
          >
            <option value="Popular" className="bg-[#171E2F]">Popularity (Views)</option>
            <option value="Alphabetical" className="bg-[#171E2F]">Alphabetical</option>
            <option value="Newest" className="bg-[#171E2F]">Newest (Est.)</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Animated Filter Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full flex-wrap">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer relative transition-all duration-300 focus:outline-none
                ${isActive 
                  ? 'border-transparent text-white shadow-md shadow-[#4F8BFF]/10' 
                  : 'border-white/8 bg-transparent text-slate-400 hover:text-white hover:border-white/15'
                }
              `}
            >
              {/* Sliding Background Indicator for active item */}
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#4F8BFF] to-[#3B82F6] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchInput;
