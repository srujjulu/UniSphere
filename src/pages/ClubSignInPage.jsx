import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  LogIn, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Toast from '../components/ui/Toast';
import { mockClubs } from '../utils/mockClubs';
import { 
  AkritiLogo,
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  DesignClubLogo,
  NssLogo 
} from '../utils/clubLogos';

const clubThemes = {
  akriti: {
    bgGradient: 'from-[#4A0010] via-[#881337] to-[#E11D48]',
    cardBg: 'bg-white text-slate-900 border-rose-100',
    titleColor: 'text-[#E11D48]',
    buttonBg: 'bg-[#881337] hover:bg-[#6B0D2B] text-white shadow-md',
    inputFocus: 'focus:border-[#E11D48] focus:ring-rose-500/20'
  },
  codeholics: {
    bgGradient: 'from-[#0A0A12] via-[#120D1D] to-[#1F0707]',
    cardBg: 'bg-white text-slate-900 border-slate-100',
    titleColor: 'text-[#EF4444]',
    buttonBg: 'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-[0_4px_15px_rgba(185,28,28,0.4)]',
    inputFocus: 'focus:border-[#EF4444] focus:ring-red-500/20'
  },
  ncc: {
    bgGradient: 'from-[#081226] via-[#0D234C] to-[#0284C7]',
    cardBg: 'bg-white text-slate-900 border-slate-100',
    titleColor: 'text-[#1E3A8A]',
    buttonBg: 'bg-[#1E3A8A] hover:bg-[#172554] text-amber-300 shadow-md',
    inputFocus: 'focus:border-[#1E3A8A] focus:ring-blue-500/20'
  },
  photography: {
    bgGradient: 'from-[#090717] via-[#2E1065] to-[#581C87]',
    cardBg: 'bg-white text-slate-900 border-slate-100',
    titleColor: 'text-[#6B21A8]',
    buttonBg: 'bg-[#6B21A8] hover:bg-[#581C87] text-white shadow-md',
    inputFocus: 'focus:border-[#6B21A8] focus:ring-purple-500/20'
  },
  lexis: {
    bgGradient: 'from-[#021F17] via-[#064E3B] to-[#0D5C46]',
    cardBg: 'bg-white text-slate-900 border-slate-100',
    titleColor: 'text-[#047857]',
    buttonBg: 'bg-[#047857] hover:bg-[#065F46] text-white shadow-md',
    inputFocus: 'focus:border-[#047857] focus:ring-emerald-500/20'
  },
  nss: {
    bgGradient: 'from-[#0A1628] via-[#1E3A5F] to-[#2C1810]',
    cardBg: 'bg-white text-slate-900 border-slate-100',
    titleColor: 'text-[#D32F2F]',
    buttonBg: 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-md',
    inputFocus: 'focus:border-[#D32F2F] focus:ring-red-500/20'
  }
};

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
    case 'nss':
      return <NssLogo />;
    default:
      return <CodeClubLogo />;
  }
};

// Roll Number Validation Helper (01-100 or AA-AZ, BA-BZ, CA-CZ, DA-DZ, EA-EZ, FA-FZ)
const validateCmrtcRollNumber = (rollStr) => {
  if (!rollStr) return false;
  const cleanStr = rollStr.trim().toLowerCase();
  
  // Format: College Prefix (\d{3}[a-z]\d[a-z]\d{2}) + Suffix ((01-100) or (AA-FZ))
  const rollRegex = /^(\d{3}[a-z]\d[a-z]\d{2})((?:0[1-9]|[1-9][0-9]|100)|(?:[a-f][a-z]))$/i;
  
  return rollRegex.test(cleanStr);
};

const ClubSignInPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  
  const clubData = mockClubs.find((c) => c.id === clubId) || mockClubs[0];
  const theme = clubThemes[clubId] || clubThemes.codeholics;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your college email address');
      return;
    }

    if (!cleanPassword) {
      setErrorMsg('Please enter your password');
      return;
    }

    // Authentication Success
    addToast(`Successfully signed into ${clubData.name}! 🎉`, 'success');
    
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.7 }
    });

    // Direct redirect to Club Member Dashboard
    navigate(`/club/${clubData.id}/member-dashboard`);
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bgGradient} text-white flex flex-col justify-between relative overflow-x-hidden font-sans select-none`}>
      <Toast toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <button
          onClick={() => navigate(`/club/${clubData.id}`)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm transition-all cursor-pointer border border-white/20 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to {clubData.name} Page</span>
        </button>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90 border border-white/15">
          <GraduationCap size={16} className="text-yellow-300" />
          <span>UniSphere • CMRTC Student Portal</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10 w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full rounded-[32px] p-8 shadow-2xl ${theme.cardBg} border backdrop-blur-xl relative`}
        >
          {/* Top UniSphere & Club Logo Badge */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center border border-slate-100 overflow-hidden">
              <img src="/UniSphere.png" alt="UniSphere Logo" className="w-full h-full object-contain" />
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl p-2.5 shadow-lg flex items-center justify-center border border-slate-100">
              {getClubLogo(clubData.id)}
            </div>
          </motion.div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-black tracking-tight ${theme.titleColor}`}>
              {clubData.name} Student Sign In
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Enter your college email address & password
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                College Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@cmrtc.ac.in"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white ${theme.inputFocus} transition-all`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white ${theme.inputFocus} transition-all`}
                />
              </div>
            </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl ${theme.buttonBg} font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all mt-2 active:scale-95`}
              >
                <LogIn size={18} />
                <span>Sign In to {clubData.name}</span>
              </button>

              {/* Don't have an account link */}
              <div className="text-center pt-2">
                <p className="text-xs font-medium text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => navigate(`/club/${clubData.id}/signup`)}
                    className={`font-bold underline cursor-pointer hover:opacity-80 ${theme.titleColor}`}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-white/80 text-xs font-medium relative z-20">
        <p>UniSphere Student Portal • CMR Technical Campus, Hyderabad</p>
      </footer>
    </div>
  );
};

export default ClubSignInPage;
