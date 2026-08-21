import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Sparkles, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Discover',
    tagline: 'Find clubs and events',
    description: 'Explore verified student clubs, executive teams, upcoming campus hackathons, fests, and photo archives.',
    icon: Search,
    color: 'from-blue-600 to-indigo-600',
    iconColor: 'text-blue-600',
    bgLight: 'bg-blue-50/70 border-blue-100',
  },
  {
    step: '02',
    title: 'Join',
    tagline: 'Apply for club membership',
    description: 'Submit an online membership application with your college credentials and talent preferences in one click.',
    icon: UserPlus,
    color: 'from-emerald-600 to-teal-600',
    iconColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50/70 border-emerald-100',
  },
  {
    step: '03',
    title: 'Participate',
    tagline: 'Register for events and engage in activities',
    description: 'Get instant event confirmation passes, attend workshops, earn volunteer credit hours, and lead campus initiatives.',
    icon: Sparkles,
    color: 'from-purple-600 to-pink-600',
    iconColor: 'text-purple-600',
    bgLight: 'bg-purple-50/70 border-purple-100',
  },
];

const HowItWorksSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-6 select-none"
    >
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Workflow Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How It Works
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-normal leading-relaxed">
          Three streamlined steps empowering campus students to transition from discovery to verified leadership.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden group"
            >
              {/* Subtle Step Number in Background */}
              <span className="absolute top-4 right-4 text-4xl font-black font-mono text-slate-100 select-none pointer-events-none group-hover:text-slate-200 transition-colors">
                {item.step}
              </span>

              <div className="space-y-4 relative z-10">
                <div className={`w-11 h-11 rounded-xl ${item.bgLight} border flex items-center justify-center ${item.iconColor} shadow-2xs`}>
                  <Icon size={22} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono text-slate-400">{item.step}</span>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-blue-600">
                    {item.tagline}
                  </p>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                <span>Step {item.step} Complete</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
