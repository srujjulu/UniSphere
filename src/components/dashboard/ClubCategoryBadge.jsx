import React from 'react';
import { Sparkles, Terminal, Camera, BookOpen, Shield, Heart } from 'lucide-react';

const categoryConfigs = {
  Cultural: {
    colorClass: 'text-rose-300 border-rose-500/20 bg-rose-500/10',
    icon: Sparkles,
  },
  Technical: {
    colorClass: 'text-indigo-300 border-indigo-500/20 bg-indigo-500/10',
    icon: Terminal,
  },
  Photography: {
    colorClass: 'text-violet-300 border-violet-500/20 bg-violet-500/10',
    icon: Camera,
  },
  Literary: {
    colorClass: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
    icon: BookOpen,
  },
  Defence: {
    colorClass: 'text-sky-300 border-sky-500/20 bg-sky-500/10',
    icon: Shield,
  },
  Service: {
    colorClass: 'text-amber-300 border-amber-500/20 bg-amber-500/10',
    icon: Heart,
  }
};

const ClubCategoryBadge = ({ category }) => {
  const config = categoryConfigs[category] || {
    colorClass: 'text-slate-300 border-slate-500/20 bg-slate-500/10',
    icon: Sparkles,
  };

  const Icon = config.icon;

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] sm:text-[11px] 
      font-bold tracking-wider uppercase select-none w-fit transition-colors
      ${config.colorClass}
    `}>
      <Icon size={12} strokeWidth={2.2} />
      <span>{category}</span>
    </div>
  );
};

export default ClubCategoryBadge;
export { categoryConfigs };

