import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Users, Ticket, Image as ImageIcon, ArrowUpRight } from 'lucide-react';

const features = [
  {
    id: 'club-discovery',
    icon: Compass,
    title: 'Club Discovery',
    description: 'Explore official campus clubs across technical, cultural, photography, literary, and social service domains with detailed profiles and executive leads.',
    badge: 'Discovery',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: 'membership-mgmt',
    icon: Users,
    title: 'Membership Management',
    description: 'Submit verified student membership requests with university roll numbers and track real-time approvals from club faculty and student coordinators.',
    badge: 'RBAC Access',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 'event-reg',
    icon: Ticket,
    title: 'Event Registration',
    description: 'Reserve spots for university hackathons, cultural festivals, workshops, and drill camps with instant registration status and ticket tracking.',
    badge: 'Live Events',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    id: 'photo-albums',
    icon: ImageIcon,
    title: 'Event Photo Albums',
    description: 'Browse high-resolution event galleries, annual fest highlights, award ceremonies, and community drives curated directly by club media teams.',
    badge: 'Media Archive',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
  },
];

const FeaturesSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-6 select-none"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            UniSphere Features
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-normal leading-relaxed">
          Centralized architecture delivering seamless collaboration between campus administration, club leads, and students.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${feature.iconBg} border flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}>
                    <Icon size={20} />
                  </div>
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>Integrated Module</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
