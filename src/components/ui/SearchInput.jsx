import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, X } from 'lucide-react';

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
    <div className="w-full flex flex-col gap-4 select-none text-left">
      {/* Search Input and Sort Row */}
      <div className="flex flex-col md:flex-row items-center gap-3 w-full">
        {/* Search Field */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={18} strokeWidth={2} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs by keyword, domain, or activities..."
            className="w-full h-12 pl-11 pr-10 rounded-xl bg-[#0E1526]/80 hover:bg-[#131D34] focus:bg-[#131D34] border border-white/[0.08] hover:border-white/[0.15] focus:border-indigo-500 text-white placeholder-slate-400 outline-none transition-all duration-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Custom Sort Select dropdown */}
        <div className="relative w-full md:w-52 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-xl bg-[#0E1526]/80 hover:bg-[#131D34] border border-white/[0.08] hover:border-white/[0.15] text-slate-200 font-semibold text-xs sm:text-sm outline-none cursor-pointer appearance-none transition-all duration-200 focus:border-indigo-500"
            aria-label="Sort Clubs"
          >
            <option value="Popular" className="bg-[#0E1526] text-white">Most Popular (Views)</option>
            <option value="Alphabetical" className="bg-[#0E1526] text-white">Alphabetical (A-Z)</option>
            <option value="Newest" className="bg-[#0E1526] text-white">Established Year</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Category:
        </span>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`
                px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border cursor-pointer relative transition-all duration-200 focus:outline-none
                ${isActive 
                  ? 'border-indigo-500/40 bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                  : 'border-white/[0.07] bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.12]'
                }
              `}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchInput;

