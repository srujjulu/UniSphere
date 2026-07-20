import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordField = React.forwardRef(({ 
  label, 
  name, 
  placeholder, 
  error, 
  shake = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Trigger shake effect when shake prop becomes true
  useEffect(() => {
    if (shake) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const shakeVariants = {
    shake: {
      x: [0, -8, 8, -8, 8, -4, 4, 0],
      transition: { duration: 0.4 }
    },
    idle: { x: 0 }
  };

  return (
    <motion.div 
      variants={shakeVariants}
      animate={shouldShake ? "shake" : "idle"}
      className="flex flex-col w-full text-left gap-1.5"
    >
      {/* Label */}
      <label 
        htmlFor={name}
        className="text-[11px] sm:text-[12px] font-bold tracking-[2px] text-slate-400 uppercase select-none"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative w-full">
        {/* Animated Lock Icon */}
        <motion.div 
          animate={{ 
            color: error ? '#FF4D4D' : isFocused ? '#3366FF' : '#94A3B8',
            scale: isFocused ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
        >
          <Lock size={18} strokeWidth={2.2} />
        </motion.div>

        {/* Input Control */}
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          className={`
            w-full h-[50px] sm:h-[54px] pl-[46px] pr-12 rounded-[16px] bg-[#222839] text-white text-sm sm:text-base placeholder-white/50
            border-2 transition-all duration-300 outline-none select-text
            ${error 
              ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
              : isFocused 
                ? 'border-[#3366FF] shadow-[0_0_20px_rgba(51,102,255,0.25)]' 
                : 'border-transparent hover:border-slate-600'
            }
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />

        {/* Eye Toggle Button */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer select-none focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {showPassword ? (
              <motion.div
                key="eye-off"
                initial={{ opacity: 0, rotate: -15 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <EyeOff size={18} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="eye"
                initial={{ opacity: 0, rotate: 15 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Eye size={18} strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Error message */}
      <div className="min-h-[18px] overflow-hidden relative">
        <AnimatePresence>
          {error && (
            <motion.p
              id={`${name}-error`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-[12px] font-medium text-red-500 select-none"
            >
              {error.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
