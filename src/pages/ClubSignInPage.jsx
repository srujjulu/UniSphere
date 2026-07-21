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
    cardBg: 'bg-white text-slate-900 border-rose-200',
    titleColor: 'text-[#E11D48]',
    buttonBg: 'bg-[#881337] hover:bg-[#6B0D2B] text-white',
    inputFocus: 'focus:border-[#E11D48] focus:ring-rose-500/20'
  },
  codeholics: {
    bgGradient: 'from-[#0A0A12] via-[#120D1D] to-[#1F0707]',
    cardBg: 'bg-[#140F21] text-white border-red-500/30',
    titleColor: 'text-[#EF4444]',
    buttonBg: 'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-[0_0_20px_rgba(185,28,28,0.4)]',
    inputFocus: 'focus:border-[#EF4444] focus:ring-red-500/20'
  },
  ncc: {
    bgGradient: 'from-[#081226] via-[#0D234C] to-[#0284C7]',
    cardBg: 'bg-[#0B1A36] text-white border-amber-500/30',
    titleColor: 'text-[#F59E0B]',
    buttonBg: 'bg-[#1E3A8A] hover:bg-[#172554] text-amber-300 border border-amber-500/40',
    inputFocus: 'focus:border-[#F59E0B] focus:ring-amber-500/20'
  },
  photography: {
    bgGradient: 'from-[#090717] via-[#2E1065] to-[#581C87]',
    cardBg: 'bg-[#1D1036] text-white border-purple-500/30',
    titleColor: 'text-[#C084FC]',
    buttonBg: 'bg-[#6B21A8] hover:bg-[#581C87] text-white',
    inputFocus: 'focus:border-[#C084FC] focus:ring-purple-500/20'
  },
  lexis: {
    bgGradient: 'from-[#021F17] via-[#064E3B] to-[#0D5C46]',
    cardBg: 'bg-[#053024] text-white border-emerald-500/30',
    titleColor: 'text-[#34D399]',
    buttonBg: 'bg-[#047857] hover:bg-[#065F46] text-white',
    inputFocus: 'focus:border-[#34D399] focus:ring-emerald-500/20'
  },
  nss: {
    bgGradient: 'from-[#0A1628] via-[#1E3A5F] to-[#2C1810]',
    cardBg: 'bg-[#0F1E35] text-white border-red-600/30',
    titleColor: 'text-[#EF5350]',
    buttonBg: 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-[0_0_20px_rgba(211,47,47,0.4)]',
    inputFocus: 'focus:border-[#EF5350] focus:ring-red-500/20'
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [signedInStudent, setSignedInStudent] = useState('');
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

    let cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg('Please enter your Roll Number or CMRTC college email address');
      return;
    }

    // Auto-append domain if user enters just the Roll Number (e.g. 237r1a05ba)
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@cmrtc.ac.in`;
    }

    if (!cleanPassword) {
      setErrorMsg('Please enter your Roll Number password');
      return;
    }

    // Extract roll number prefix before @
    const rollPart = cleanEmail.split('@')[0];

    // Check college email domain
    if (!cleanEmail.includes('@cmrtc') && !cleanEmail.includes('@cmr')) {
      setErrorMsg('Please enter a valid CMRTC college email (e.g. 237r1a0501@cmrtc.ac.in or 237r1a05BA@cmrtc.ac.in)');
      return;
    }

    // Validate roll number format (01-100 or AA-FZ)
    const isRollValid = validateCmrtcRollNumber(rollPart);
    if (!isRollValid) {
      setErrorMsg(`Invalid Roll Number format. Suffix must be 01-100 or AA-FZ (e.g. 237r1a0501, 237r1a05BA, or 237r1a05DZ)`);
      return;
    }

    // Validate password matches roll number
    if (cleanPassword !== rollPart) {
      setErrorMsg(`Incorrect password. Password must match your Roll Number (${rollPart.toUpperCase()})`);
      return;
    }

    // Authentication Success
    setIsSuccess(true);
    setSignedInStudent(rollPart.toUpperCase());
    addToast(`Successfully signed into ${clubData.name}! 🎉`, 'success');
    
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.7 }
    });
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
          <span>CMRTC Student Portal</span>
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
          {/* Top Logo Badge */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-24 h-24 bg-white rounded-2xl p-3 shadow-lg mx-auto mb-6 flex items-center justify-center border border-slate-100"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              {getClubLogo(clubData.id)}
            </div>
          </motion.div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-black tracking-tight ${theme.titleColor}`}>
              {clubData.name} Student Sign In
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Enter your college email & roll number password
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Welcome, Student {signedInStudent}!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                You are now signed into <span className="font-bold text-white">{clubData.name}</span> portal with official member access.
              </p>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => navigate(`/club/${clubData.id}/member-dashboard`)}
                  className={`w-full py-3.5 rounded-xl ${theme.buttonBg} font-bold text-sm cursor-pointer shadow-md transition-all active:scale-95`}
                >
                  Go to {clubData.name} Member Dashboard &rarr;
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer transition-all"
                >
                  Go to All Clubs Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
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
                    placeholder="237r1a05ba@cmrtc.ac.in"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none ${theme.inputFocus} transition-all`}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium pl-1">
                  Format: <code className="text-amber-300 font-mono">237r1a05ba@cmrtc.ac.in</code>
                </p>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password (Roll Number)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="237r1a05ba"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none ${theme.inputFocus} transition-all`}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium pl-1">
                  Password is your Roll Number (e.g. <code className="text-amber-300 font-mono">237r1a05ba</code>)
                </p>
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
                <p className="text-xs font-medium text-slate-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => navigate(`/club/${clubData.id}/signup`)}
                    className={`font-bold underline cursor-pointer hover:text-white ${theme.titleColor}`}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-white/80 text-xs font-medium relative z-20">
        <p>CMR Technical Campus Student Portal • Hyderabad, Telangana</p>
      </footer>
    </div>
  );
};

export default ClubSignInPage;
