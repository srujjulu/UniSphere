import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, User } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SubmitButton from './SubmitButton';
import useAuth from '../../hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .refine((val) => val.endsWith('@cmr.edu.in'), {
      message: 'Email must end with @cmr.edu.in to join Campus Clubs',
    }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser } = useAuth();
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [passwordShake, setPasswordShake] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    clearErrors('root.serverError');
    setSubmitStatus('loading');
    
    const result = await registerUser(data.email, data.password);
    
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
      className="w-full flex flex-col gap-6"
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

      {/* Name Input */}
      <motion.div variants={itemVariants}>
        <InputField
          label="Full Name"
          name="name"
          type="text"
          placeholder="John Doe"
          icon={User}
          error={errors.name}
          {...register('name')}
        />
      </motion.div>

      {/* Email Input */}
      <motion.div variants={itemVariants}>
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="yourname@cmr.edu.in"
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

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="mt-2">
        <SubmitButton status={submitStatus}>
          Create Account &rarr;
        </SubmitButton>
      </motion.div>
    </motion.form>
  );
};

export default RegisterForm;
