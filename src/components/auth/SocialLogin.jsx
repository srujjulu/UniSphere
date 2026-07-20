import React from 'react';
import { motion } from 'framer-motion';

const SocialLogin = () => {
  const providers = [
    {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
          />
          <path
            fill="#FBBC05"
            d="M16.04 15.345A7.055 7.055 0 0 1 12 16.909a7.08 7.08 0 0 1-6.733-4.855L1.24 15.17A11.93 11.93 0 0 0 12 24c2.932 0 5.732-1.043 7.848-2.915l-3.808-5.74Z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.273c0-.818-.073-1.609-.208-2.373H12v4.545h6.46a5.526 5.526 0 0 1-2.4 3.627l3.808 5.74c2.224-2.052 3.622-5.069 3.622-9.54Z"
          />
          <path
            fill="#34A853"
            d="M5.266 12.054a6.97 6.97 0 0 1 0-2.289L1.24 6.65a11.968 11.968 0 0 0 0 10.701l4.026-3.297Z"
          />
        </svg>
      )
    },
    {
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
          />
        </svg>
      )
    },
    {
      name: 'Microsoft',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 23 23">
          <path fill="#f3f2f1" d="M0 0h23v23H0z" />
          <path fill="#f25022" d="M1 1h10v10H1z" />
          <path fill="#7fba00" d="M12 1h10v10H12z" />
          <path fill="#01a4ef" d="M1 12h10v10H1z" />
          <path fill="#ffb900" d="M12 12h10v10H12z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className="h-[1px] bg-slate-800 flex-1" />
        <span className="text-[11px] font-bold tracking-[2px] text-slate-500 uppercase">Or continue with</span>
        <div className="h-[1px] bg-slate-800 flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {providers.map((p) => (
          <motion.button
            key={p.name}
            type="button"
            whileHover={{ scale: 1.03, y: -2, backgroundColor: '#222839' }}
            whileTap={{ scale: 0.98 }}
            className="h-[52px] rounded-2xl bg-[#1A2030] flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 cursor-pointer focus:outline-none focus-ring text-sm font-semibold text-slate-300 hover:text-white"
          >
            {p.icon}
            <span className="hidden sm:inline">{p.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;
