import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  GraduationCap, 
  Mail, 
  MapPin, 
  Medal, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Users, 
  ExternalLink,
  Code,
  Heart,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApprovedClubsForStudent, getStoredRequests } from '../../utils/mockRequests';
import { mockClubs } from '../../utils/mockClubs';

const StudentPortfolio = ({ onToast }) => {
  const { user } = useAuth();

  const studentRoll = user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA';
  const studentName = user?.name || 'Srujan Maringanti';
  const studentDepartment = 'Computer Science & Engineering (CSE)';
  const academicYear = '3rd Year • Semester 1';

  // Get dynamic approved clubs
  const approvedClubIds = getApprovedClubsForStudent(studentRoll);
  const joinedClubsList = mockClubs.filter(c => approvedClubIds.includes(c.id));

  // Stat Counters
  const stats = [
    { id: 'clubs', label: 'Clubs Joined', value: `${joinedClubsList.length} Clubs`, icon: Users, color: 'from-blue-500 to-indigo-600', border: 'border-blue-500/30' },
    { id: 'events-reg', label: 'Events Registered', value: '5 Events', icon: Calendar, color: 'from-purple-500 to-pink-600', border: 'border-purple-500/30' },
    { id: 'events-att', label: 'Events Attended', value: '4 Attended', icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/30' },
    { id: 'vol-hours', label: 'Volunteer Hours', value: '32 Hours', icon: Clock, color: 'from-amber-500 to-orange-600', border: 'border-amber-500/30' },
    { id: 'certs', label: 'Certificates Earned', value: '6 Verified', icon: Award, color: 'from-rose-500 to-red-600', border: 'border-rose-500/30' },
    { id: 'leadership', label: 'Leadership Roles', value: '2 Roles', icon: Medal, color: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/30' }
  ];

  // Badges Earned
  const badges = [
    {
      id: 'b1',
      title: 'Tech Enthusiast',
      category: 'Technical Excellence',
      description: 'Participated in 3+ Hackathons & Competitive Coding Symposia.',
      icon: Code,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      glowColor: 'shadow-blue-500/20'
    },
    {
      id: 'b2',
      title: 'Event Volunteer',
      category: 'Social Impact',
      description: 'Logged 30+ Volunteer Hours in NSS Swachh Bharat & Blood Donation drives.',
      icon: Heart,
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      glowColor: 'shadow-red-500/20'
    },
    {
      id: 'b3',
      title: 'Cultural Performer',
      category: 'Arts & Stage',
      description: 'Featured stage performer in Pegasus Annual Cultural Fest.',
      icon: Sparkles,
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      glowColor: 'shadow-pink-500/20'
    },
    {
      id: 'b4',
      title: 'Club Leader',
      category: 'Campus Governance',
      description: 'Core Committee Member & Event Organizer at The Lexis Club.',
      icon: Medal,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glowColor: 'shadow-amber-500/20'
    },
    {
      id: 'b5',
      title: 'Active Member',
      category: 'Participation',
      description: 'Maintained 85%+ attendance in official CMRTC club meetings & workshops.',
      icon: ShieldCheck,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glowColor: 'shadow-emerald-500/20'
    }
  ];

  // Attended Events Timeline
  const timelineEvents = [
    {
      id: 't1',
      title: 'CMR HackFest 2026 36-Hour Hackathon',
      club: 'Codeholics Tech Club',
      date: 'September 05-07, 2026',
      role: 'Team Lead & Developer',
      achievement: '1st Runner Up • Certificate of Excellence',
      badgeTag: 'Hackathon'
    },
    {
      id: 't2',
      title: 'Inter-College Debate & Model UN (MUN)',
      club: 'The Lexis Club',
      date: 'August 30, 2026',
      role: 'Delegate (UNGA)',
      achievement: 'Best Delegate Award & Oratory Honor',
      badgeTag: 'Diplomacy'
    },
    {
      id: 't3',
      title: 'Swachh Bharat Cleanliness & Greenery Drive',
      club: 'NSS Unit CMRTC',
      date: 'July 28, 2026',
      role: 'Lead Student Volunteer',
      achievement: '8 Volunteer Hours Logged • Service Certificate',
      badgeTag: 'Community Service'
    },
    {
      id: 't4',
      title: 'Pegasus 2025 Annual Cultural Fest',
      club: 'AKRITI Cultural Club',
      date: 'December 15, 2025',
      role: 'Stage Performer',
      achievement: 'Winner Group Dance Competition',
      badgeTag: 'Cultural Fest'
    }
  ];

  // Certificates Earned List
  const certificates = [
    { id: 'c1', title: 'CMR HackFest 2026 - 1st Runner Up Certificate', issuer: 'Codeholics Tech Club', date: 'Sept 2026', credentialId: 'CMRTC-2026-CS-091' },
    { id: 'c2', title: 'Model United Nations Best Delegate Certification', issuer: 'The Lexis Club', date: 'Aug 2026', credentialId: 'CMRTC-2026-LX-044' },
    { id: 'c3', title: 'National Service Scheme (NSS) Volunteer Honor', issuer: 'NSS CMRTC Unit & Red Cross', date: 'July 2026', credentialId: 'CMRTC-2026-NSS-118' },
    { id: 'c4', title: 'React v19 & Web3 Bootcamp Completion', issuer: 'CMRTC Tech Society', date: 'June 2026', credentialId: 'CMRTC-2026-DEV-302' }
  ];

  const handleDownloadPDF = () => {
    if (onToast) {
      onToast(`📄 Generating Official Achievement Portfolio PDF for ${studentName}...`, 'success');
    }
    setTimeout(() => {
      if (onToast) {
        onToast(`🎉 Portfolio PDF (CMRTC_${studentRoll}_Portfolio.pdf) downloaded!`, 'success');
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans select-none pb-8">
      {/* 1. LinkedIn Style Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] bg-slate-900/80 border border-slate-800 backdrop-blur-2xl overflow-hidden shadow-2xl relative"
      >
        {/* Banner Cover Gradient */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <span className="px-3.5 py-1 rounded-full bg-black/40 text-blue-300 font-extrabold text-[11px] uppercase tracking-widest border border-blue-500/30 backdrop-blur-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Student Portfolio
            </span>
          </div>
        </div>

        {/* Profile Details Header Section */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-1.5 shadow-2xl shadow-blue-500/30 border-4 border-slate-900">
                  <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center text-white font-black text-4xl sm:text-5xl border border-white/10">
                    {studentName.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold border-2 border-slate-900 shadow-lg" title="Verified Campus Member">
                  ✓
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {studentName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/30">
                    {studentRoll}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <GraduationCap size={16} className="text-blue-400" />
                  <span>{studentDepartment} • {academicYear}</span>
                </p>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-500" />
                  <span>CMR Technical Campus (CMRTC), Hyderabad</span>
                </p>
              </div>
            </div>

            {/* Download PDF Action CTA */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 border border-white/20"
              >
                <Download size={16} />
                <span>Download Portfolio PDF</span>
              </button>
            </div>
          </div>

          {/* Professional Bio / Headline */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            💬 <strong className="text-white">Professional Headline:</strong> Full Stack Web Developer, Technical Lead at Codeholics Club, and Active Member of The Lexis Club. Passionate about AI agents, public speaking, hackathons, and community welfare initiatives at CMRTC.
          </div>
        </div>
      </motion.div>

      {/* 2. Statistics Grid Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles size={20} className="text-blue-400" />
          <span>Performance & Activity Metrics</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((st) => {
            const IconComponent = st.icon;
            return (
              <div 
                key={st.id}
                className={`p-5 rounded-2xl bg-slate-900/60 border ${st.border} backdrop-blur-xl space-y-3 shadow-xl hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {st.label}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center font-bold shadow-md`}>
                    <IconComponent size={20} />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {st.value}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Earned Badges Showcase */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Medal size={20} className="text-amber-400" />
          <span>Earned Achievement Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const BadgeIcon = badge.icon;
            return (
              <div 
                key={badge.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3 shadow-xl hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${badge.badgeColor} ${badge.glowColor} shadow-md flex items-center gap-1.5`}>
                    <BadgeIcon size={14} />
                    <span>{badge.title}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{badge.category}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Timeline of Attended Events */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Calendar size={20} className="text-purple-400" />
          <span>Recent Attended Events Timeline</span>
        </h3>

        <div className="p-6 sm:p-8 rounded-[28px] bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6 shadow-xl">
          <div className="relative border-l-2 border-slate-800 ml-3 sm:ml-4 space-y-8 pl-6 sm:pl-8">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Timeline Bullet Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-md group-hover:scale-125 transition-transform" />

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 hover:border-blue-500/40 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {evt.club}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      📅 {evt.date}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white">
                    {evt.title}
                  </h4>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-300">
                      Role: <span className="text-blue-400">{evt.role}</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      🏆 {evt.achievement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Verified Certificates Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Award size={20} className="text-emerald-400" />
          <span>Verified Certificates & Honors</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Issued by {cert.issuer}</span>
                  <span className="text-xs font-mono text-slate-400">{cert.date}</span>
                </div>
                <h4 className="text-base font-extrabold text-white">{cert.title}</h4>
                <p className="text-[11px] font-mono text-slate-500">Credential ID: {cert.credentialId}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={14} />
                  <span>Verified Authenticity</span>
                </span>
                <button
                  onClick={() => handleDownloadPDF()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPortfolio;
