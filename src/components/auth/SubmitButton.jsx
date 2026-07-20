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
      return 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_4px_25px_rgba(16,185,129,0.4)]';
    }
    return 'bg-gradient-to-r from-[#3366FF] to-[#FF8C32] hover:shadow-[0_8px_30px_rgba(255,140,50,0.5)] shadow-[0_4px_20px_rgba(255,140,50,0.3)]';
  };

  return (
    <motion.button
      variants={shakeVariants}
      animate={shouldShake ? "shake" : "idle"}
      whileHover={status === 'idle' ? { y: -2, scale: 1.01 } : {}}
      whileTap={status === 'idle' ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      type="submit"
      disabled={status === 'loading' || status === 'success' || disabled}
      onClick={onClick}
      className={`
        w-full h-[62px] rounded-[18px] text-white font-bold text-lg cursor-pointer
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
