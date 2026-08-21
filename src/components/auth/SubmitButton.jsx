import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const SubmitButton = ({ 
  children, 
  status = 'idle', // 'idle' | 'loading' | 'success' | 'error'
  onClick, 
  disabled,
  ...props 
}) => {
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    if (status === 'error') {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const shakeVariants = {
    shake: {
      x: [0, -8, 8, -8, 8, -4, 4, 0],
      transition: { duration: 0.4 }
    },
    idle: { x: 0 }
  };

  // Determine classes based on status
  const getButtonBg = () => {
    if (status === 'success') {
      return 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_4px_20px_rgba(16,185,129,0.35)]';
    }
    return 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_4px_20px_rgba(37,99,235,0.28)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.38)]';
  };

  return (
    <motion.button
      variants={shakeVariants}
      animate={shouldShake ? "shake" : "idle"}
      whileHover={status === 'idle' ? { y: -1, scale: 1.005 } : {}}
      whileTap={status === 'idle' ? { scale: 0.985 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      type="submit"
      disabled={status === 'loading' || status === 'success' || disabled}
      onClick={onClick}
      className={`
        w-full h-[52px] rounded-[16px] text-white font-bold text-base cursor-pointer
        relative overflow-hidden flex items-center justify-center select-none
        border-none outline-none focus-ring transition-all duration-300
        ${getButtonBg()}
        ${(disabled || status === 'loading' || status === 'success') ? 'cursor-not-allowed pointer-events-none' : ''}
      `}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            <Loader2 className="animate-spin text-white" size={24} />
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center gap-2"
          >
            <svg 
              className="w-7 h-7 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <motion.path 
                d="M20 6 9 17l-5-5" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              />
            </svg>
          </motion.div>
        )}

        {status !== 'loading' && status !== 'success' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default SubmitButton;
