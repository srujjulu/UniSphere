import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Music, 
  Calendar, 
  LogIn, 
  UserPlus, 
  MapPin, 
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Toast from '../components/ui/Toast';

// Akriti Custom Branding Logo SVG
const AkritiLogo = () => (
  <svg viewBox="0 0 200 180" className="w-36 h-28 max-w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stylized woman face outline & floral motif */}
    <path 
      d="M100 20 C60 20 40 50 40 85 C40 120 70 145 100 145 C130 145 160 120 160 85 C160 50 140 20 100 20 Z" 
      fill="#FEE2E2" 
      opacity="0.2"
    />
    {/* Artistic hair silhouette */}
    <path 
      d="M85 30 C70 40 55 60 55 85 C55 105 70 125 90 130 C75 120 70 100 75 80 C80 60 95 45 105 35 Z" 
      fill="#881337" 
    />
    {/* Red flower in hair */}
    <path 
      d="M115 35 C110 30 120 25 125 30 C130 25 140 30 135 35 C140 40 135 50 130 45 C125 50 115 45 118 40 C112 40 110 35 115 35 Z" 
      fill="#E11D48" 
    />
    {/* Face profile line */}
    <path 
      d="M95 45 Q115 55 110 75 Q115 85 100 95 Q115 105 90 120" 
      stroke="#881337" 
      strokeWidth="3.5" 
      strokeLinecap="round"
    />
    {/* Bindi dot */}
    <circle cx="104" cy="62" r="3" fill="#E11D48" />

    {/* Hindi Devanagari text "आकृति" */}
    <text x="100" y="152" textAnchor="middle" fill="#881337" fontSize="24" fontFamily="serif" fontWeight="bold">
      आकृति
    </text>
    {/* English text "Akriti" */}
    <text x="100" y="172" textAnchor="middle" fill="#E11D48" fontSize="16" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1">
      AKRITI
    </text>
  </svg>
);

const AkritiClubPage = () => {
  const navigate = useNavigate();
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
      addToast('You have left Akriti Club', 'info');
    } else {
      setIsJoined(true);
      addToast('Welcome to Akriti Club! 🎉', 'success');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E60023] via-[#F41C38] to-[#FF5E62] text-white flex flex-col justify-between relative overflow-x-hidden font-sans">
      <Toast toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Header / Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm transition-all cursor-pointer border border-white/20 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to UniSphere</span>
        </button>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 border border-white/15">
          <Sparkles size={14} className="text-yellow-300" />
          <span>Official CMRTC Cultural Club</span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center max-w-5xl mx-auto w-full relative z-10">
        
        {/* Top Logo Container Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-5 shadow-2xl mb-8 border border-red-100 flex items-center justify-center w-56 h-36 transform hover:scale-105 transition-transform duration-300"
        >
          <AkritiLogo />
        </motion.div>

        {/* Welcome Banner Titles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 max-w-3xl"
        >
          <h2 className="text-white text-lg md:text-xl font-bold tracking-widest uppercase opacity-95">
            WELCOME TO THE
          </h2>
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight drop-shadow-md">
            AKRITI CLUB
          </h1>
        </motion.div>

        {/* Club Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/95 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed font-normal"
        >
          A vibrant student organization at CMRTC creating platforms for young artists to showcase their talents in dancing, singing, mimicry, instrumental music, and cultural performances.
        </motion.p>

        {/* 3 Stats & Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 mb-10 text-left"
        >
          {/* Card 1 */}
          <div className="bg-white rounded-[24px] p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#ED1C24] flex items-center justify-center mb-5 shadow-sm">
              <Users size={24} />
            </div>
            <h3 className="text-[#ED1C24] text-xl font-bold tracking-tight">
              500+ Members
            </h3>
            <p className="text-slate-600 text-sm font-medium mt-1.5 leading-snug">
              Passionate artists and cultural enthusiasts
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[24px] p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#ED1C24] flex items-center justify-center mb-5 shadow-sm">
              <Music size={24} />
            </div>
            <h3 className="text-[#ED1C24] text-xl font-bold tracking-tight">
              Multiple Arts
            </h3>
            <p className="text-slate-600 text-sm font-medium mt-1.5 leading-snug">
              Dance, music, theater, and more
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[24px] p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#ED1C24] flex items-center justify-center mb-5 shadow-sm">
              <Calendar size={24} />
            </div>
            <h3 className="text-[#ED1C24] text-xl font-bold tracking-tight">
              Major Events
            </h3>
            <p className="text-slate-600 text-sm font-medium mt-1.5 leading-snug">
              Pegasus, Efflorescence, and more
            </p>
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
            className="bg-white text-[#ED1C24] hover:bg-red-50 font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2.5 text-base transition-all duration-200 cursor-pointer border border-white/80 active:scale-95"
          >
            <LogIn size={20} />
            <span>Sign In</span>
          </button>

          {/* Join Now Button */}
          <button
            onClick={handleJoinToggle}
            className={`font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2.5 text-base transition-all duration-200 cursor-pointer active:scale-95 ${
              isJoined 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-[#7A000A] hover:bg-[#600007] text-white'
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

      {/* Footer Location & Copyright Info */}
      <footer className="w-full py-6 text-center text-white/90 text-sm font-medium space-y-1 relative z-20 mt-6">
        <div className="flex items-center justify-center gap-1.5 text-white/95">
          <MapPin size={16} className="text-yellow-300" />
          <span>CMRTC Campus, Hyderabad, Telangana, India</span>
        </div>
        <p className="text-white/80 text-xs">
          Promoting cultural diversity and artistic excellence since 2015
        </p>
      </footer>
    </div>
  );
};

export default AkritiClubPage;
