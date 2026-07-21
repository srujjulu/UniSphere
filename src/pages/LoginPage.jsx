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

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const { user, logout } = useAuth();

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
        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-[22px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer p-3.5 mb-4 sm:mb-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        <CmrLogo />
      </motion.div>

      {/* College Name Spacing */}
      <div className="flex flex-col items-center gap-1 mb-3 sm:mb-4 select-none">
        <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-semibold tracking-[3px] text-white uppercase">
          CMR Technical Campus
        </span>
        <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-medium tracking-[2px] text-[#FF8C32] uppercase">
          Explore To Invent
        </span>
      </div>

      {/* Hero Heading */}
      <motion.h1 
        style={headingStyle}
        className="text-[36px] sm:text-[44px] lg:text-[56px] xl:text-[68px] leading-[0.95] font-extrabold text-white mb-3 sm:mb-4 tracking-tighter flex flex-col items-center"
      >
        <span>Campus</span>
        <span className="bg-gradient-to-r from-[#FF8C32] to-[#FF5E36] bg-clip-text text-transparent pb-1">Clubs</span>
      </motion.h1>

      {/* Description */}
      <p className="text-[#94A3B8] text-xs sm:text-sm lg:text-[15px] leading-[1.6] max-w-[340px] sm:max-w-[420px] mx-auto mb-6 sm:mb-8 font-normal px-2">
        Six unique clubs. Countless opportunities. One campus. Join the community that shapes future leaders.
      </p>

      {/* Club Logos Row */}
      <div className="flex gap-3 sm:gap-4 items-center justify-center flex-wrap mt-2">
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
        className="flex flex-col gap-4 sm:gap-5 lg:gap-6"
      >
        {/* Auth Tabs */}
        <motion.div variants={formItemVariants}>
          <AuthTabs activeTab={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Welcome Headers */}
        <motion.div variants={formItemVariants} className="text-left select-none">
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] leading-[1.15] font-extrabold text-white tracking-tight">
            {activeTab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] font-normal mt-1.5 sm:mt-2">
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
                <LoginForm onSuccess={() => navigate('/dashboard')} />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
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
