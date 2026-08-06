import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, User, Video, Camera, Shield } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SubmitButton from './SubmitButton';
import useAuth from '../../hooks/useAuth';
import { saveInfluencer } from '../../utils/mockInfluencers';

const registerSchema = z.object({
  role: z.enum(['student', 'core', 'faculty', 'admin'], {
    required_error: 'Please select a system role',
  }),
  assignedClub: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .refine((val) => val.endsWith('@cmr.edu.in'), {
      message: 'Email must end with @cmr.edu.in to join Campus Clubs',
    }),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
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
    watch,
    formState: { errors }, 
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
      assignedClub: 'codeholics',
      name: '',
      email: '',
      instagram: '',
      youtube: '',
      password: ''
    },
    mode: 'onChange',
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    clearErrors('root.serverError');
    setSubmitStatus('loading');

    const rawInsta = (data.instagram || '').trim();
    const rawYt = (data.youtube || '').trim();

    const formattedInsta = rawInsta && rawInsta !== '-' ? (rawInsta.startsWith('@') ? rawInsta : `@${rawInsta}`) : '-';
    const formattedYt = rawYt && rawYt !== '-' ? (rawYt.startsWith('@') ? rawYt : `@${rawYt}`) : '-';

    // Auto add to Influencers Roster only if they entered a handle
    if (formattedInsta !== '-' || formattedYt !== '-') {
      saveInfluencer({
        id: `inf-${Date.now()}`,
        name: data.name,
        rollNo: `237R1A${Math.floor(1000 + Math.random() * 9000)}`,
        branch: 'CMR Student',
        clubId: data.assignedClub || 'codeholics',
        domain: 'Campus Creator',
        instagram: formattedInsta,
        instagramUrl: formattedInsta !== '-' ? `https://instagram.com/${formattedInsta.replace('@', '')}` : '#',
        youtube: formattedYt,
        youtubeUrl: formattedYt !== '-' ? `https://youtube.com/${formattedYt.replace('@', '')}` : '#',
        followers: '1.0K',
        subscribers: '500',
        status: 'Available for Auditions',
        bio: 'Newly registered campus student at CMRTC.'
      });
    }
    
    const result = await registerUser(data.email, data.password, data.role, data.assignedClub || 'codeholics');
    
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
      className="w-full flex flex-col gap-3 sm:gap-4 text-left"
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

      {/* Role Selection Dropdown */}
      <motion.div variants={itemVariants}>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield size={14} className="text-[#3366FF]" />
            <span>Select System Role *</span>
          </span>
        </label>
        <div className="relative">
          <select
            {...register('role')}
            className="w-full h-12 pl-4 pr-10 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-semibold outline-none focus:border-[#3366FF] transition-all appearance-none cursor-pointer"
          >
            <option value="student">🎓 Student Member</option>
            <option value="core">⚡ Club Core Team / Coordinator</option>
            <option value="faculty">👨‍🏫 Faculty Coordinator</option>
            <option value="admin">👑 Administrator</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      </motion.div>

      {/* Conditional Club Assignment for Coordinators */}
      {selectedRole === 'core' && (
        <motion.div variants={itemVariants}>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-pink-400 mb-1.5 flex items-center gap-1.5">
            <span>⚡ Which Campus Club Do You Coordinate? *</span>
          </label>
          <div className="relative">
            <select
              {...register('assignedClub')}
              className="w-full h-12 pl-4 pr-10 rounded-xl bg-[#0F172A] border border-pink-500/50 text-white text-sm font-semibold outline-none focus:border-pink-500 transition-all appearance-none cursor-pointer"
            >
              <option value="codeholics">Codeholics Tech Club</option>
              <option value="akriti">AKRITI Cultural Club</option>
              <option value="photography">Film & Photography Club</option>
              <option value="lexis">The Lexis Literary Club</option>
              <option value="ncc">NCC Cadet Corps</option>
              <option value="nss">NSS Service Scheme</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
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
          label="Email (@cmr.edu.in)"
          name="email"
          type="email"
          placeholder="yourname@cmr.edu.in"
          icon={Mail}
          error={errors.email}
          {...register('email')}
        />
      </motion.div>

      {/* Instagram Handle Input */}
      <motion.div variants={itemVariants}>
        <InputField
          label="Instagram Handle (Optional - type '-' if none)"
          name="instagram"
          type="text"
          placeholder="@your_insta_handle or -"
          icon={Camera}
          error={errors.instagram}
          {...register('instagram')}
        />
      </motion.div>

      {/* YouTube Channel Input */}
      <motion.div variants={itemVariants}>
        <InputField
          label="YouTube Channel / Handle (Optional - type '-' if none)"
          name="youtube"
          type="text"
          placeholder="@your_channel_name or -"
          icon={Video}
          error={errors.youtube}
          {...register('youtube')}
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
      <motion.div variants={itemVariants} className="mt-1">
        <SubmitButton status={submitStatus}>
          Create Account & Register Role &rarr;
        </SubmitButton>
      </motion.div>
    </motion.form>
  );
};

export default RegisterForm;
