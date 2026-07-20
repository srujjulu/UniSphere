import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SubmitButton from './SubmitButton';
import useAuth from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [passwordShake, setPasswordShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotHovered, setIsForgotHovered] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    clearErrors('root.serverError');
    setSubmitStatus('loading');
    
    const result = await login(data.email, data.password);
    
    if (result.success) {
      setSubmitStatus('success');
      if (onSuccess) {
        setTimeout(onSuccess, 800);
      }
    } else {
      setSubmitStatus('error');
      setPasswordShake(true);
      setError('root.serverError', { type: 'manual', message: result.message });
      
      // Reset button & input shake after animation completes
      setTimeout(() => {
        setSubmitStatus('idle');
        setPasswordShake(false);
      }, 500);
    }
  };

  const onError = (formErrors) => {
    setSubmitStatus('error');
    setPasswordShake(true);
    
    setTimeout(() => {
      setSubmitStatus('idle');
      setPasswordShake(false);
    }, 500);
  };

  // Stagger variants for premium loading
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  return (
    <motion.form 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit, onError)}
      className="w-full flex flex-col gap-4 sm:gap-5"
      noValidate
    >
      {/* Root Server Error Alert */}
      {errors.root?.serverError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium"
        >
          {errors.root.serverError.message}
        </motion.div>
      )}

      {/* Email Input */}
      <motion.div variants={itemVariants}>
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@cmr.edu.in"
          icon={Mail}
          error={errors.email}
          {...register('email')}
        />
      </motion.div>

      {/* Password Input */}
      <motion.div variants={itemVariants}>
        <PasswordField
          label="Password"
          name="password"
          placeholder="Min. 6 characters"
          error={errors.password}
          shake={passwordShake}
          {...register('password')}
        />
      </motion.div>

      {/* Remember me & Forgot Password */}
      <motion.div variants={itemVariants} className="flex items-center justify-between select-none">
        {/* Custom checkbox with ripple */}
        <label className="flex items-center gap-3 cursor-pointer group text-sm text-[#94A3B8] hover:text-white">
          <div className="relative w-5 h-5 flex items-center justify-center">
            {/* Ripple background effect */}
            <div className="absolute inset-0 rounded-md bg-[#3366FF]/10 scale-0 group-hover:scale-150 transition-transform duration-300 ease-out" />
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              className="sr-only" 
            />
            <div className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300
              ${rememberMe ? 'border-[#3366FF] bg-[#3366FF]' : 'border-slate-500 bg-transparent'}
            `}>
              {rememberMe && (
                <motion.svg 
                  className="w-3.5 h-3.5 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M20 6 9 17l-5-5" />
                </motion.svg>
              )}
            </div>
          </div>
          <span className="font-medium">Remember Me</span>
        </label>

        {/* Forgot password with sliding underline */}
        <a 
          href="#forgot" 
          onMouseEnter={() => setIsForgotHovered(true)}
          onMouseLeave={() => setIsForgotHovered(false)}
          className="text-sm font-semibold text-[#94A3B8] hover:text-[#3366FF] relative transition-colors duration-300 focus-ring focus:outline-none"
        >
          Forgot Password?
          <span 
            className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#3366FF] origin-left transition-transform duration-300 ease-out" 
            style={{ transform: isForgotHovered ? 'scaleX(1)' : 'scaleX(0)' }} 
          />
        </a>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="mt-2">
        <SubmitButton status={submitStatus}>
          Sign In &rarr;
        </SubmitButton>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
