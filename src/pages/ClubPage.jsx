import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Music, 
  Calendar, 
  LogIn, 
  UserPlus, 
  MapPin, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Code,
  Shield,
  Camera,
  BookOpen,
  Award,
  Clock,
  Eye,
  UserCheck,
  Compass,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Toast from '../components/ui/Toast';
import AkritiClubPage from './AkritiClubPage';
import { mockClubs } from '../utils/mockClubs';
import { 
  AkritiLogo,
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  DesignClubLogo 
} from '../utils/clubLogos';

// Custom logo-matched theme configurations for every club
const clubThemes = {
  akriti: {
    bgGradient: 'from-[#4A0010] via-[#881337] to-[#E11D48]',
    badgeGlow: 'shadow-[0_0_50px_rgba(225,29,72,0.4)]',
    cardBg: 'bg-white/95 border-rose-200/50',
    cardText: 'text-[#E11D48]',
    cardDesc: 'text-slate-600',
    iconBadgeBg: 'bg-rose-50 text-[#E11D48]',
    joinBtnBg: 'bg-[#881337] hover:bg-[#6B0D2B] text-white',
    signBtnBg: 'bg-white text-[#E11D48] hover:bg-rose-50 border-white',
    tag: 'Official CMRTC Cultural & Performing Arts Club',
    tagBg: 'bg-rose-950/60 border-rose-400/30 text-rose-200',
    heroSubtitle: 'WELCOME TO THE',
    title: 'AKRITI CLUB',
    description: 'A vibrant student organization at CMRTC creating platforms for young artists to showcase their talents in dancing, singing, mimicry, instrumental music, and cultural performances.',
    features: [
      { icon: Users, label: '500+ Members', desc: 'Passionate artists and cultural enthusiasts' },
      { icon: Music, label: 'Multiple Arts', desc: 'Dance, music, theater, and more' },
      { icon: Calendar, label: 'Major Events', desc: 'Pegasus, Efflorescence, and more' }
    ]
  },
  codeholics: {
    bgGradient: 'from-[#0A0A12] via-[#120D1D] to-[#1F0707]',
    badgeGlow: 'shadow-[0_0_60px_rgba(220,38,38,0.45)]',
    cardBg: 'bg-[#140F21]/80 border-red-500/25 backdrop-blur-xl',
    cardText: 'text-[#EF4444]',
    cardDesc: 'text-slate-300',
    iconBadgeBg: 'bg-red-950/80 text-[#EF4444] border border-red-500/30',
    joinBtnBg: 'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-[0_0_20px_rgba(185,28,28,0.4)]',
    signBtnBg: 'bg-white text-[#DC2626] hover:bg-slate-100 border-white',
    tag: 'Premier Coding & Cyber Tech Society',
    tagBg: 'bg-red-950/70 border-red-500/40 text-red-300',
    heroSubtitle: 'WELCOME TO THE',
    title: 'CODEHOLICS CLUB',
    description: 'The epicenter of developer culture at CMR Campus. We host massive hackathons, competitive programming sprints, and hands-on developer bootcamps in Web Dev, AI/ML, and Cybersecurity.',
    features: [
      { icon: Code, label: '350+ Hackers', desc: 'Active developers, coders & AI builders' },
      { icon: Award, label: 'Annual Hackathons', desc: 'CMR HackFest & 24hr Code Sprints' },
      { icon: Calendar, label: 'Tech Workshops', desc: 'Hands-on Web Dev, AI/ML & Cloud labs' }
    ]
  },
  ncc: {
    bgGradient: 'from-[#081226] via-[#0D234C] to-[#0284C7]',
    badgeGlow: 'shadow-[0_0_60px_rgba(245,158,11,0.4)]',
    cardBg: 'bg-[#0B1A36]/85 border-amber-500/30 backdrop-blur-xl',
    cardText: 'text-[#F59E0B]',
    cardDesc: 'text-slate-200',
    iconBadgeBg: 'bg-blue-950/90 text-[#38BDF8] border border-amber-500/40',
    joinBtnBg: 'bg-[#1E3A8A] hover:bg-[#172554] text-amber-300 border border-amber-500/40 shadow-[0_0_20px_rgba(30,58,138,0.5)]',
    signBtnBg: 'bg-white text-[#1E3A8A] hover:bg-slate-100 border-white',
    tag: 'National Cadet Corps • Unity and Discipline',
    tagBg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
    heroSubtitle: 'HONOR & DISCIPLINE',
    title: 'NCC CMRTC UNIT',
    description: 'Fostering discipline, leadership, and patriotism. NCC cadets participate in national camps (RDC, TSC), daily parade drills, weapons training, trekking expeditions, and community service drives.',
    features: [
      { icon: Shield, label: '210+ Cadets', desc: 'Disciplined leaders & national representatives' },
      { icon: Award, label: 'National Camps', desc: 'Republic Day Parade & Thal Sainik Camps' },
      { icon: Calendar, label: 'Community Service', desc: 'Mega blood donation & social drives' }
    ]
  },
  photography: {
    bgGradient: 'from-[#090717] via-[#2E1065] to-[#581C87]',
    badgeGlow: 'shadow-[0_0_60px_rgba(168,85,247,0.4)]',
    cardBg: 'bg-[#1D1036]/85 border-purple-500/30 backdrop-blur-xl',
    cardText: 'text-[#C084FC]',
    cardDesc: 'text-slate-300',
    iconBadgeBg: 'bg-purple-950/80 text-[#A855F7] border border-purple-500/30',
    joinBtnBg: 'bg-[#6B21A8] hover:bg-[#581C87] text-white shadow-[0_0_20px_rgba(107,33,168,0.5)]',
    signBtnBg: 'bg-white text-[#7E22CE] hover:bg-slate-100 border-white',
    tag: 'F9 Visual Storytelling & Cinema Club',
    tagBg: 'bg-purple-950/70 border-purple-400/40 text-purple-200',
    heroSubtitle: 'THROUGH THE LENS',
    title: 'FILM & PHOTOGRAPHY',
    description: 'A community of visual storytellers. Whether you capture with a DSLR or a smartphone, our workshops in lighting, cinematography, and post-processing will help you capture life through a beautiful lens.',
    features: [
      { icon: Camera, label: '115+ Creators', desc: 'Photographers, cinematographers & editors' },
      { icon: Award, label: 'Short Film Gala', desc: 'Annual campus film screenings & awards' },
      { icon: Calendar, label: 'Insta-Walks', desc: 'Guided photowalks & lighting masterclasses' }
    ]
  },
  lexis: {
    bgGradient: 'from-[#021F17] via-[#064E3B] to-[#0D5C46]',
    badgeGlow: 'shadow-[0_0_60px_rgba(192,132,252,0.35)]',
    cardBg: 'bg-[#053024]/85 border-emerald-500/30 backdrop-blur-xl',
    cardText: 'text-[#34D399]',
    cardDesc: 'text-slate-200',
    iconBadgeBg: 'bg-emerald-950/80 text-[#C084FC] border border-purple-400/30',
    joinBtnBg: 'bg-[#047857] hover:bg-[#065F46] text-white shadow-[0_0_20px_rgba(4,120,87,0.5)]',
    signBtnBg: 'bg-white text-[#047857] hover:bg-slate-100 border-white',
    tag: 'Language & Literary Society',
    tagBg: 'bg-emerald-950/70 border-emerald-400/40 text-emerald-300',
    heroSubtitle: 'VOICE OF CMRTC',
    title: 'THE LEXIS CLUB',
    description: 'A hub for debaters, writers, poets, and public speakers. Lexis fosters creative expression and verbal excellence through speech contests, Model United Nations (MUN), and poetry slams.',
    features: [
      { icon: BookOpen, label: '98+ Speakers', desc: 'Debaters, writers & Model UN delegates' },
      { icon: Award, label: 'MUN & Debates', desc: 'Inter-college speech & debate championships' },
      { icon: Calendar, label: 'Poetry Slams', desc: 'Word-Smith open mic & creative jams' }
    ]
  }
};

// Logo resolver for clubs
const getClubLogo = (clubId) => {
  switch (clubId) {
    case 'akriti':
      return <AkritiLogo />;
    case 'codeholics':
      return <CodeClubLogo />;
    case 'photography':
      return <PhotoClubLogo />;
    case 'lexis':
      return <EcoClubLogo />;
    case 'ncc':
      return <DesignClubLogo />;
    default:
      return <CodeClubLogo />;
  }
};

const ClubPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  // Akriti custom bespoke page
  if (clubId === 'akriti') {
    return <AkritiClubPage />;
  }

  const clubData = mockClubs.find((c) => c.id === clubId) || mockClubs[0];
  const theme = clubThemes[clubId] || clubThemes.codeholics;

  const [isJoined, setIsJoined] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleJoinToggle = () => {
    if (isJoined) {
      setIsJoined(false);
      addToast(`You have left ${clubData.name}`, 'info');
    } else {
      setIsJoined(true);
      addToast(`Welcome to ${clubData.name}! 🎉`, 'success');
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bgGradient} text-white flex flex-col justify-between relative overflow-x-hidden font-sans select-none`}>
      <Toast toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Ambient Radial Color Halos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm transition-all cursor-pointer border border-white/20 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to All Clubs</span>
        </button>

        <div className={`flex items-center gap-2 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border ${theme.tagBg} shadow-sm`}>
          <Sparkles size={14} className="text-yellow-300" />
          <span>{theme.tag}</span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center max-w-5xl mx-auto w-full relative z-10">
        
        {/* Official Logo Container Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-white rounded-3xl p-5 ${theme.badgeGlow} mb-8 border border-white/40 flex items-center justify-center w-52 h-36 transform hover:scale-105 transition-transform duration-300 cursor-pointer`}
        >
          <div className="w-24 h-24 flex items-center justify-center">
            {getClubLogo(clubData.id)}
          </div>
        </motion.div>

        {/* Welcome Titles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 max-w-3xl"
        >
          <h2 className="text-white/90 text-lg md:text-xl font-bold tracking-widest uppercase opacity-95">
            {theme.heroSubtitle}
          </h2>
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight drop-shadow-lg">
            {theme.title}
          </h1>
        </motion.div>

        {/* Club Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/95 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed font-normal"
        >
          {theme.description}
        </motion.p>

        {/* 3 Stats & Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 mb-10 text-left"
        >
          {theme.features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div 
                key={idx} 
                className={`${theme.cardBg} rounded-[24px] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-full ${theme.iconBadgeBg} flex items-center justify-center mb-5 shadow-sm`}>
                  <IconComp size={24} />
                </div>
                <h3 className={`${theme.cardText} text-xl font-bold tracking-tight`}>
                  {feat.label}
                </h3>
                <p className={`${theme.cardDesc} text-sm font-medium mt-1.5 leading-snug`}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Club Coordinators & Details Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-4xl bg-black/25 backdrop-blur-xl rounded-[24px] p-6 border border-white/15 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 text-left shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-yellow-300 font-bold shadow-sm">
              <UserCheck size={22} />
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Faculty Coordinator</p>
              <p className="text-sm font-bold text-white mt-0.5">{clubData.facultyCoordinator}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 font-bold shadow-sm">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Student Lead</p>
              <p className="text-sm font-bold text-white mt-0.5">{clubData.studentLead}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sky-300 font-bold shadow-sm">
              <Eye size={22} />
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Established</p>
              <p className="text-sm font-bold text-white mt-0.5">Year {clubData.established}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
        >
          {/* Sign In Button */}
          <button
            onClick={() => navigate('/login')}
            className={`${theme.signBtnBg} font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2.5 text-base transition-all duration-200 cursor-pointer active:scale-95`}
          >
            <LogIn size={20} />
            <span>Sign In</span>
          </button>

          {/* Join Now Button */}
          <button
            onClick={handleJoinToggle}
            className={`font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2.5 text-base transition-all duration-200 cursor-pointer active:scale-95 ${
              isJoined 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(5,150,105,0.5)]' 
                : `${theme.joinBtnBg}`
            }`}
          >
            {isJoined ? (
              <>
                <CheckCircle2 size={20} />
                <span>Joined Club</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Join Now</span>
              </>
            )}
          </button>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="w-full py-6 text-center text-white/90 text-sm font-medium space-y-1 relative z-20 mt-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-1.5 text-white/95">
          <MapPin size={16} className="text-yellow-300" />
          <span>CMRTC Campus, Hyderabad, Telangana, India</span>
        </div>
        <p className="text-white/80 text-xs">
          Promoting student innovation, leadership and excellence since {clubData.established}
        </p>
      </footer>
    </div>
  );
};

export default ClubPage;
