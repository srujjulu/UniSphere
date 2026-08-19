import React from 'react';
import { Sparkles, Terminal, Camera, BookOpen, Shield, Heart } from 'lucide-react';

const categoryConfigs = {
  Cultural: {
    colorClass: 'text-rose-700 border-rose-200 bg-rose-50',
    icon: Sparkles,
  },
  Technical: {
    colorClass: 'text-blue-700 border-blue-200 bg-blue-50',
    icon: Terminal,
  },
  Photography: {
    colorClass: 'text-purple-700 border-purple-200 bg-purple-50',
    icon: Camera,
  },
  Literary: {
    colorClass: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    icon: BookOpen,
  },
  Defence: {
    colorClass: 'text-sky-700 border-sky-200 bg-sky-50',
    icon: Shield,
  },
  Service: {
    colorClass: 'text-amber-700 border-amber-200 bg-amber-50',
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

