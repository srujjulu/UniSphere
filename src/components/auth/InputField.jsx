import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = React.forwardRef(({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  error, 
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col w-full text-left gap-2">
      {/* Label */}
      <label 
        htmlFor={name}
        className="text-[12px] font-bold tracking-[2px] text-slate-400 uppercase select-none"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative w-full">
        {/* Animated Icon Container */}
        {Icon && (
          <motion.div 
            animate={{ 
              color: error ? '#FF4D4D' : isFocused ? '#3366FF' : '#94A3B8',
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <Icon size={20} strokeWidth={2.2} />
          </motion.div>
        )}

        {/* Input Control */}
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          className={`
            w-full h-[60px] pl-[54px] pr-5 rounded-[18px] bg-[#222839] text-white placeholder-white/60
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
      </div>

      {/* Error message */}
      <div className="h-5 overflow-hidden relative">
        <AnimatePresence>
          {error && (
            <motion.p
              id={`${name}-error`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-[13px] font-medium text-red-500 select-none"
            >
              {error.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
