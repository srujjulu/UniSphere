import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Shield, UserCheck, GraduationCap, Crown, Sparkles } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SubmitButton from './SubmitButton';
import useAuth from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'College Email is required' })
    .email({ message: 'Invalid email address' })
    .refine((val) => {
      const lower = val.trim().toLowerCase();
      return lower.endsWith('@cmr.edu.in') || lower.endsWith('@cmrtc.ac.in') || lower.endsWith('@cmrg.ac.in') || lower.endsWith('@cmr.ac.in');
    }, {
      message: 'Only official college emails (@cmr.edu.in / @cmrtc.ac.in) are permitted',
    }),
  password: z.string()
    .min(4, { message: 'Password must be at least 4 characters' }),
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
    setValue,
    formState: { errors }, 
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange',
  });

  const handleQuickDemo = (email, pass) => {
    setValue('email', email);
    setValue('password', pass);
  };

  const onSubmit = async (data) => {
    clearErrors('root.serverError');
    setSubmitStatus('loading');
    
    const result = await login(data.email, data.password);
    
    if (result.success) {
      setSubmitStatus('success');
      if (onSuccess) {
        setTimeout(onSuccess, 600);
      }
    } else {
      setSubmitStatus('error');
      setPasswordShake(true);
      setError('root.serverError', { type: 'manual', message: result.message });
      
      setTimeout(() => {
        setSubmitStatus('idle');
        setPasswordShake(false);
      }, 500);
    }
  };

  const onError = () => {
    setSubmitStatus('error');
    setPasswordShake(true);
    
    setTimeout(() => {
      setSubmitStatus('idle');
      setPasswordShake(false);
    }, 500);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  return (
    <motion.form 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit, onError)}
      className="w-full flex flex-col gap-4 sm:gap-4 text-left"
      noValidate
    >
      {/* Root Server Error Alert */}
      {errors.root?.serverError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium"
        >
          {errors.root.serverError.message}
        </motion.div>
      )}

      {/* Email Input */}
      <motion.div variants={itemVariants}>
        <InputField
          label="College Email"
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
          placeholder="Min. 4 characters"
          error={errors.password}
          shake={passwordShake}
          {...register('password')}
        />
      </motion.div>

      {/* Quick Demo Role Selector Pills */}
      <motion.div variants={itemVariants} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={12} className="text-amber-500" />
          <span>Quick Demo Logins:</span>
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickDemo('student@cmr.edu.in', 'Cmrtc#Student2026!')}
            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-all text-left truncate flex items-center gap-1 cursor-pointer"
          >
            <GraduationCap size={12} />
            <span>Student Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('core@cmr.edu.in', 'Cmrtc#Core2026!')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-all text-left truncate flex items-center gap-1 cursor-pointer"
          >
            <UserCheck size={12} />
            <span>Core Team Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('faculty@cmr.edu.in', 'Cmrtc#Faculty2026!')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-bold transition-all text-left truncate flex items-center gap-1 cursor-pointer"
          >
            <Shield size={12} />
            <span>Faculty Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin@cmr.edu.in', 'Cmrtc#Admin2026!')}
            className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold transition-all text-left truncate flex items-center gap-1 cursor-pointer"
          >
            <Crown size={12} />
            <span>Admin Demo</span>
          </button>
        </div>
      </motion.div>

      {/* Remember me & Forgot Password */}
      <motion.div variants={itemVariants} className="flex items-center justify-between select-none">
        <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-slate-600 hover:text-slate-900">
          <input 
            type="checkbox" 
            checked={rememberMe} 
            onChange={(e) => setRememberMe(e.target.checked)} 
            className="rounded border-slate-300 text-blue-600" 
          />
          <span className="font-semibold">Remember Me</span>
        </label>

        <a 
          href="#forgot" 
          onMouseEnter={() => setIsForgotHovered(true)}
          onMouseLeave={() => setIsForgotHovered(false)}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 relative transition-colors duration-200 focus:outline-none"
        >
          Forgot Password?
          <span 
            className="absolute bottom-0 left-0 w-full h-[1.5px] bg-blue-600 origin-left transition-transform duration-200 ease-out" 
            style={{ transform: isForgotHovered ? 'scaleX(1)' : 'scaleX(0)' }} 
          />
        </a>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="mt-1">
        <SubmitButton status={submitStatus}>
          Sign In to Portal &rarr;
        </SubmitButton>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
