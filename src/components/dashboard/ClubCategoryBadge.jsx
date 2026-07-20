import React from 'react';
import { Sparkles, Terminal, Camera, BookOpen, Shield } from 'lucide-react';

const categoryConfigs = {
  Cultural: {
    colorClass: 'text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/15',
    icon: Sparkles,
  },
  Technical: {
    colorClass: 'text-[#FF8A2A] border-[#FF8A2A]/30 bg-[#FF8A2A]/10 hover:bg-[#FF8A2A]/15',
    icon: Terminal,
  },
  Photography: {
    colorClass: 'text-violet-400 border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/15',
    icon: Camera,
  },
  Literary: {
    colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15',
    icon: BookOpen,
  },
  Defence: {
    colorClass: 'text-[#4F8BFF] border-[#4F8BFF]/30 bg-[#4F8BFF]/10 hover:bg-[#4F8BFF]/15',
    icon: Shield,
  }
};

const ClubCategoryBadge = ({ category }) => {
  const config = categoryConfigs[category] || {
    colorClass: 'text-slate-400 border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/15',
    icon: Sparkles,
  };

  const Icon = config.icon;

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] sm:text-[11px] 
      font-bold tracking-[1.5px] uppercase select-none transition-colors duration-300 w-fit
      ${config.colorClass}
    `}>
      <Icon size={12} strokeWidth={2.5} />
      <span>{category}</span>
    </div>
  );
};

export default ClubCategoryBadge;
export { categoryConfigs };
