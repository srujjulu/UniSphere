import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  Lock, 
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
    bgGradient: 'from-[#E60023] via-[#F41C38] to-[#FF5E62]',
    cardBg: 'bg-white text-slate-900 border-rose-100',
    titleColor: 'text-[#E11D48]',
    subtitleColor: 'text-slate-500',
    buttonBg: 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-[0_4px_15px_rgba(225,29,72,0.4)]',
    inputBg: 'bg-[#F8FAFC] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#E11D48] focus:bg-white',
    accentText: 'Create your account and start your artistic journey',
    talents: ['Dancing', 'Singing & Vocals', 'Theater & Natak', 'Instrumental Music', 'Drawing & Fine Arts', 'Mimicry & Standup']
  },
  codeholics: {
    bgGradient: 'from-[#0A0A12] via-[#120D1D] to-[#1F0707]',
    cardBg: 'bg-[#140F21] text-white border-red-500/30',
    titleColor: 'text-[#EF4444]',
    subtitleColor: 'text-slate-400',
    buttonBg: 'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-[0_0_20px_rgba(185,28,28,0.4)]',
    inputBg: 'bg-[#1A142A] border-red-500/20 text-white placeholder-slate-500 focus:border-[#EF4444] focus:bg-[#1F1832]',
    accentText: 'Create your account and build futuristic tech',
    talents: ['Web Development', 'AI & Machine Learning', 'Competitive Coding', 'Cybersecurity', 'App Development', 'UI/UX Design']
  },
  ncc: {
    bgGradient: 'from-[#081226] via-[#0D234C] to-[#0284C7]',
    cardBg: 'bg-[#0B1A36] text-white border-amber-500/30',
    titleColor: 'text-[#F59E0B]',
    subtitleColor: 'text-slate-300',
    buttonBg: 'bg-[#1E3A8A] hover:bg-[#172554] text-amber-300 border border-amber-500/40 shadow-[0_0_20px_rgba(30,58,138,0.5)]',
    inputBg: 'bg-[#122446] border-amber-500/20 text-white placeholder-slate-400 focus:border-[#F59E0B] focus:bg-[#172D56]',
    accentText: 'Create your account and serve with discipline',
    talents: ['Drill & Parade', 'Weapons Training', 'Trekking & Adventure', 'Social Service', 'Cultural Performance', 'Sports & Fitness']
  },
  photography: {
    bgGradient: 'from-[#090717] via-[#2E1065] to-[#581C87]',
    cardBg: 'bg-[#1D1036] text-white border-purple-500/30',
    titleColor: 'text-[#C084FC]',
    subtitleColor: 'text-slate-400',
    buttonBg: 'bg-[#6B21A8] hover:bg-[#581C87] text-white shadow-[0_0_20px_rgba(107,33,168,0.5)]',
    inputBg: 'bg-[#271647] border-purple-500/20 text-white placeholder-slate-400 focus:border-[#C084FC] focus:bg-[#2F1B56]',
    accentText: 'Create your account and capture visual stories',
    talents: ['DSLR Photography', 'Mobile Photography', 'Cinematography', 'Video Editing', 'Lighting & Production', 'Photo Editing (Lightroom/Photoshop)']
  },
  lexis: {
    bgGradient: 'from-[#021F17] via-[#064E3B] to-[#0D5C46]',
    cardBg: 'bg-[#053024] text-white border-emerald-500/30',
    titleColor: 'text-[#34D399]',
    subtitleColor: 'text-slate-300',
    buttonBg: 'bg-[#047857] hover:bg-[#065F46] text-white shadow-[0_0_20px_rgba(4,120,87,0.5)]',
    inputBg: 'bg-[#0A3D2F] border-emerald-500/20 text-white placeholder-slate-400 focus:border-[#34D399] focus:bg-[#0F4A39]',
    accentText: 'Create your account and raise your voice',
    talents: ['Debating & Public Speaking', 'Model UN (MUN)', 'Poetry & Spoken Word', 'Creative Writing', 'Anchoring & Hosting', 'Journalism & Content']
  },
  nss: {
    bgGradient: 'from-[#0A1628] via-[#1E3A5F] to-[#2C1810]',
    cardBg: 'bg-[#0F1E35] text-white border-red-600/30',
    titleColor: 'text-[#EF5350]',
    subtitleColor: 'text-slate-300',
    buttonBg: 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-[0_0_20px_rgba(211,47,47,0.4)]',
    inputBg: 'bg-[#162A48] border-red-500/20 text-white placeholder-slate-400 focus:border-[#EF5350] focus:bg-[#1C3356]',
    accentText: 'Create your account and serve the community',
    talents: ['Blood Donation Drives', 'Swachh Bharat Campaigns', 'Village Adoption Program', 'Tree Plantation Drive', 'Disaster Awareness', 'Youth Leadership']
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

const ClubSignUpPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  
  const clubData = mockClubs.find((c) => c.id === clubId) || mockClubs[0];
  const theme = clubThemes[clubId] || clubThemes.codeholics;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [talent, setTalent] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
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

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number');
      return;
    }

    if (!talent) {
      setErrorMsg('Please select your talent/interest');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (!agreedTerms) {
      setErrorMsg('Please agree to the terms and conditions');
      return;
    }

    // Success registration
    setIsSuccess(true);
    addToast(`Successfully registered for ${clubData.name}! 🎉`, 'success');
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bgGradient} text-slate-900 flex flex-col justify-between relative overflow-x-hidden font-sans select-none py-6`}>
      <Toast toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-20">
        <button
          onClick={() => navigate(`/club/${clubData.id}`)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm transition-all cursor-pointer border border-white/20 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90 border border-white/15">
          <GraduationCap size={16} className="text-yellow-300" />
          <span>CMRTC Club Registration</span>
        </div>
      </header>

      {/* Main Container Form */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10 w-full max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full rounded-[32px] p-7 md:p-9 shadow-2xl ${theme.cardBg} border backdrop-blur-xl relative`}
        >
          {/* Floating Top Logo Badge */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-24 h-24 bg-white rounded-2xl p-3 shadow-xl mx-auto mb-5 flex items-center justify-center border border-slate-100"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              {getClubLogo(clubData.id)}
            </div>
          </motion.div>

          {/* Heading & Subtitle */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${theme.titleColor}`}>
              Join {clubData.name} Club
            </h2>
            <p className={`text-xs md:text-sm font-medium ${theme.subtitleColor} mt-1.5`}>
              {theme.accentText}
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-emerald-400">Account Created!</h3>
              <p className="text-sm font-medium opacity-90 max-w-xs mx-auto">
                Welcome to {clubData.name}! Your member profile for <strong>{fullName}</strong> has been registered.
              </p>
              <div className="pt-3 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/club/${clubData.id}`)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wider uppercase cursor-pointer transition-all ${theme.buttonBg}`}
                >
                  Explore {clubData.name} Page
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Go to All Clubs Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Error Alert */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all ${theme.inputBg}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all ${theme.inputBg}`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all ${theme.inputBg}`}
                  />
                </div>
              </div>

              {/* Your Talent / Interest */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Your Talent / Domain
                </label>
                <div className="relative">
                  <Sparkles size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  <select
                    value={talent}
                    onChange={(e) => setTalent(e.target.value)}
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none cursor-pointer appearance-none transition-all ${theme.inputBg}`}
                  >
                    <option value="" disabled className="bg-slate-900 text-white">Select your talent</option>
                    {theme.talents.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 6 characters)"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all ${theme.inputBg}`}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all ${theme.inputBg}`}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2.5 pt-1 select-none">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs font-medium opacity-80 cursor-pointer">
                  I agree to the terms and conditions and privacy policy
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full h-13 rounded-2xl font-extrabold text-sm tracking-wider uppercase cursor-pointer mt-2 transition-all duration-200 active:scale-95 ${theme.buttonBg}`}
              >
                Create Account
              </button>

              {/* Already have an account? Sign In link */}
              <div className="text-center pt-3">
                <p className="text-xs font-medium opacity-80">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate(`/club/${clubData.id}/signin`)}
                    className={`font-bold underline cursor-pointer hover:opacity-100 ${theme.titleColor}`}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs font-medium text-white/70">
        &copy; {new Date().getFullYear()} CMR Technical Campus. All rights reserved.
      </footer>
    </div>
  );
};

export default ClubSignUpPage;
