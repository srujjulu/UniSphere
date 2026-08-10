import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthTabs from '../components/auth/AuthTabs';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import SocialLogin from '../components/auth/SocialLogin';
import ClubLogo from '../components/auth/ClubLogo';
import { 
  CmrLogo, 
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  SportsClubLogo, 
  DesignClubLogo,
  NssLogo 
} from '../utils/clubLogos';
import useAuth from '../hooks/useAuth';
import { ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const { user } = useAuth();

  // If user is already authenticated, redirect straight to /dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  // Left Panel Rendering with subtle Parallax
  const renderLeftPanel = ({ logoStyle, headingStyle }) => (
    <>
      {/* College Logo Card */}
      <motion.div 
        style={logoStyle}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2 mb-4 border border-white/20 overflow-hidden"
      >
        <CmrLogo />
      </motion.div>

      {/* Verified Institutional Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-3">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>CMR Technical Campus · NAAC A+</span>
      </div>

      {/* Hero Heading */}
      <motion.h1 
        style={headingStyle}
        className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight leading-tight"
      >
        Student Club <span className="text-gradient-indigo">Community Portal</span>
      </motion.h1>

      {/* Description */}
      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-[420px] mx-auto mb-6 font-normal">
        Connect with campus leaders, register for flagship events, track volunteer hours, and access verified certifications.
      </p>

      {/* Club Logos Row */}
      <div className="flex gap-2.5 sm:gap-3 items-center justify-center flex-wrap mt-1">
        <ClubLogo name="Code Club" svg={<CodeClubLogo />} index={0} />
        <ClubLogo name="Photo Club" svg={<PhotoClubLogo />} index={1} />
        <ClubLogo name="Eco Club" svg={<EcoClubLogo />} index={2} />
        <ClubLogo name="Sports Club" svg={<SportsClubLogo />} index={3} />
        <ClubLogo name="Design Club" svg={<DesignClubLogo />} index={4} />
        <ClubLogo name="NSS Club" svg={<NssLogo />} index={5} />
      </div>
    </>
  );

  // Stagger animation for the right form components
  const formWrapperVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <AuthLayout leftPanelContent={renderLeftPanel}>
      <motion.div 
        variants={formWrapperVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5 sm:gap-6 bg-[#0E1526]/70 p-6 sm:p-8 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-xl"
      >
        {/* Auth Tabs */}
        <motion.div variants={formItemVariants}>
          <AuthTabs activeTab={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Welcome Headers */}
        <motion.div variants={formItemVariants} className="text-left select-none">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeTab === 'signin' ? 'Welcome Back' : 'Create Student Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            {activeTab === 'signin' 
              ? 'Log in to manage your campus club memberships' 
              : 'Join the campus club network with your CMR ID'}
          </p>
        </motion.div>

        {/* Forms Switcher with AnimatePresence */}
        <motion.div variants={formItemVariants} className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'signin' ? (
              <motion.div
                key="signin-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm onSuccess={() => navigate('/dashboard')} />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <RegisterForm onSuccess={() => navigate('/dashboard')} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Logins */}
        <motion.div variants={formItemVariants}>
          <SocialLogin />
        </motion.div>

        {/* Bottom Switch Link */}
        <motion.div variants={formItemVariants} className="text-center">
          <p className="text-xs text-slate-400 font-medium select-none">
            {activeTab === 'signin' ? (
              <>
                New to CMR Clubs?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Create an account &rarr;
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Sign In &rarr;
                </button>
              </>
            )}
          </p>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;

