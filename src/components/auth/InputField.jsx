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
    <div className="flex flex-col w-full text-left gap-1.5">
      {/* Label */}
      <label 
        htmlFor={name}
        className="text-[11px] sm:text-[12px] font-bold tracking-[1.5px] text-slate-600 uppercase select-none"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative w-full">
        {/* Animated Icon Container */}
        {Icon && (
          <motion.div 
            animate={{ 
              color: error ? '#EF4444' : isFocused ? '#2563EB' : '#94A3B8',
              scale: isFocused ? 1.05 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <Icon size={18} strokeWidth={2.2} />
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
            w-full h-[50px] sm:h-[52px] pl-[46px] pr-4 rounded-[16px] bg-slate-50 text-slate-900 text-sm sm:text-base placeholder-slate-400
            border transition-all duration-200 outline-none select-text
            ${error 
              ? 'border-red-500 bg-red-50/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
              : isFocused 
                ? 'border-blue-600 bg-white ring-2 ring-blue-100' 
                : 'border-slate-200 hover:border-slate-300'
            }
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
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
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
