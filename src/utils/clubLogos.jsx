import React from 'react';

// Reusable clean SVG icons for clubs

export const CmrLogo = () => (
  <svg 
    className="w-full h-full" 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background card white styling */}
    <rect width="100" height="100" rx="20" fill="white" />
    
    {/* Lotus/Leaf Design */}
    <path d="M50 20C40 38 48 50 50 55C52 50 60 38 50 20Z" fill="#F97316" />
    <path d="M50 30C36 43 40 54 44 57C48 53 46 43 50 30Z" fill="#EAB308" />
    <path d="M50 30C64 43 60 54 56 57C52 53 54 43 50 30Z" fill="#22C55E" />
    <path d="M50 40C30 48 32 58 37 60C44 57 40 49 50 40Z" fill="#3B82F6" />
    <path d="M50 40C70 48 68 58 63 60C56 57 60 49 50 40Z" fill="#A855F7" />

    {/* Text Initials */}
    <text 
      x="50" 
      y="76" 
      fill="#0B1120" 
      fontSize="12" 
      fontWeight="800" 
      fontFamily="Inter, sans-serif" 
      textAnchor="middle"
    >
      CMR
    </text>
    <text 
      x="50" 
      y="86" 
      fill="#F97316" 
      fontSize="7" 
      fontWeight="700" 
      fontFamily="Inter, sans-serif" 
      textAnchor="middle"
      letterSpacing="0.5"
    >
      CAMPUS
    </text>
  </svg>
);

export const CodeClubLogo = () => (
  <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

export const PhotoClubLogo = () => (
  <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

export const EcoClubLogo = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 3a9 9 0 019 9v1a9 9 0 01-9 9m0-18a9 9 0 00-9 9v1a9 9 0 009 9m-9-9h18" />
  </svg>
);

export const SportsClubLogo = () => (
  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

export const DesignClubLogo = () => (
  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37a2.121 2.121 0 113 3l-9.37 9.37a2.121 2.121 0 01-1.06.58L8.14 20.3a.75.75 0 01-.94-.94l.58-3.328a2.122 2.122 0 01.58-1.06z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122L3 21m12-16a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
