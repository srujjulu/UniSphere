import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  DesignClubLogo 
} from '../utils/clubLogos';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const { user, logout } = useAuth();

  // If user is already authenticated (Success state navigation flow)
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0B1120] text-center p-6 select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-[#1A2030] p-10 rounded-[32px] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Campus!</h2>
          <p className="text-slate-400 mb-6 text-sm">You are signed in as <span className="text-slate-300 font-semibold">{user.email}</span></p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-[#FF8C32] text-white font-bold cursor-pointer transition-shadow shadow-[0_4px_15px_rgba(239,68,68,0.2)] hover:shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
          >
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Left Panel Rendering with subtle Parallax
  const renderLeftPanel = ({ logoStyle, headingStyle }) => (
    <>
      {/* College Logo Card */}
      <motion.div 
        style={logoStyle}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[24px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer p-4 mb-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        <CmrLogo />
      </motion.div>

      {/* College Name Spacing */}
      <div className="flex flex-col items-center gap-1 mb-4 select-none">
        <span className="text-[12px] md:text-[13px] font-semibold tracking-[3px] text-white uppercase">
          CMR Technical Campus
        </span>
        <span className="text-[10px] md:text-[11px] font-medium tracking-[2px] text-[#FF8C32] uppercase">
          Explore To Invent
        </span>
      </div>

      {/* Hero Heading */}
      <motion.h1 
        style={headingStyle}
        className="text-[40px] sm:text-[46px] md:text-[58px] lg:text-[72px] leading-[0.95] font-extrabold text-white mb-4 tracking-tighter flex flex-col items-center"
      >
        <span>Campus</span>
        <span className="bg-gradient-to-r from-[#FF8C32] to-[#FF5E36] bg-clip-text text-transparent pb-1">Clubs</span>
      </motion.h1>

      {/* Description */}
      <p className="text-[#94A3B8] text-sm md:text-[15px] leading-[1.7] max-w-[380px] sm:max-w-[420px] mx-auto mb-8 font-normal">
        Five unique clubs. Countless opportunities. One campus. Join the community that shapes future leaders.
      </p>

      {/* Club Logos Row */}
      <div className="flex gap-3 sm:gap-4 items-center justify-center flex-wrap mt-2">
        <ClubLogo name="Code Club" svg={<CodeClubLogo />} />
        <ClubLogo name="Photo Club" svg={<PhotoClubLogo />} />
        <ClubLogo name="Eco Club" svg={<EcoClubLogo />} />
        <ClubLogo name="Sports Club" svg={<SportsClubLogo />} />
        <ClubLogo name="Design Club" svg={<DesignClubLogo />} />
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
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <AuthLayout leftPanelContent={renderLeftPanel}>
      <motion.div 
        variants={formWrapperVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        {/* Auth Tabs */}
        <motion.div variants={formItemVariants}>
          <AuthTabs activeTab={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Welcome Headers */}
        <motion.div variants={formItemVariants} className="text-left select-none">
          <h2 className="text-3xl md:text-[44px] leading-[1.1] font-extrabold text-white tracking-tight">
            {activeTab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-base md:text-[17px] text-[#94A3B8] font-normal mt-2.5">
            {activeTab === 'signin' 
              ? 'Sign in to explore your clubs' 
              : 'Join the campus club community today'}
          </p>
        </motion.div>

        {/* Forms Switcher with AnimatePresence */}
        <motion.div variants={formItemVariants} className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'signin' ? (
              <motion.div
                key="signin-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <RegisterForm onSuccess={() => setActiveTab('signin')} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Logins */}
        <motion.div variants={formItemVariants}>
          <SocialLogin />
        </motion.div>

        {/* Bottom Switch Link */}
        <motion.div variants={formItemVariants} className="text-center mt-2">
          <p className="text-sm text-[#94A3B8] font-medium select-none">
            {activeTab === 'signin' ? (
              <>
                New to CMR Clubs?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[#FF8C32] font-bold cursor-pointer relative inline-flex items-center gap-0.5 group focus:outline-none focus-ring rounded"
                >
                  Create a free account
                  {/* Sliding Underline */}
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#FF8C32] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  {/* Hover slide effect */}
                  <motion.span 
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1"
                  >
                    &rarr;
                  </motion.span>
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-[#FF8C32] font-bold cursor-pointer relative inline-flex items-center gap-0.5 group focus:outline-none focus-ring rounded"
                >
                  Sign In
                  {/* Sliding Underline */}
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#FF8C32] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  <motion.span 
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1"
                  >
                    &rarr;
                  </motion.span>
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
