import React from 'react';

// CMR Technical Campus Main Logo
export const CmrLogo = () => (
  <svg 
    className="w-full h-full" 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="20" fill="white" />
    <path d="M50 20C40 38 48 50 50 55C52 50 60 38 50 20Z" fill="#F97316" />
    <path d="M50 30C36 43 40 54 44 57C48 53 46 43 50 30Z" fill="#EAB308" />
    <path d="M50 30C64 43 60 54 56 57C52 53 54 43 50 30Z" fill="#22C55E" />
    <path d="M50 40C30 48 32 58 37 60C44 57 40 49 50 40Z" fill="#3B82F6" />
    <path d="M50 40C70 48 68 58 63 60C56 57 60 49 50 40Z" fill="#A855F7" />
    <text x="50" y="76" fill="#0B1120" fontSize="12" fontWeight="800" fontFamily="Inter, sans-serif" textAnchor="middle">CMR</text>
    <text x="50" y="86" fill="#F97316" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.5">CAMPUS</text>
  </svg>
);

// 1. Akriti Club Logo (Visual Arts & Drama)
export const AkritiLogo = () => (
  <svg viewBox="0 0 200 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20 C60 20 40 50 40 85 C40 120 70 145 100 145 C130 145 160 120 160 85 C160 50 140 20 100 20 Z" fill="#FEE2E2" opacity="0.2"/>
    <path d="M85 30 C70 40 55 60 55 85 C55 105 70 125 90 130 C75 120 70 100 75 80 C80 60 95 45 105 35 Z" fill="#881337" />
    <path d="M115 35 C110 30 120 25 125 30 C130 25 140 30 135 35 C140 40 135 50 130 45 C125 50 115 45 118 40 C112 40 110 35 115 35 Z" fill="#E11D48" />
    <path d="M95 45 Q115 55 110 75 Q115 85 100 95 Q115 105 90 120" stroke="#881337" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="104" cy="62" r="3" fill="#E11D48" />
    <text x="100" y="152" textAnchor="middle" fill="#881337" fontSize="24" fontFamily="serif" fontWeight="bold">आकृति</text>
    <text x="100" y="172" textAnchor="middle" fill="#E11D48" fontSize="16" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1">AKRITI</text>
  </svg>
);

// 2. Codeholics Logo (Tech & Coding)
export const CodeClubLogo = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="25" y="65" fill="#000000" fontSize="42" fontFamily="sans-serif" fontWeight="900" letterSpacing="1">
      C
    </text>
    <g transform="translate(82, 50)">
      <circle r="22" fill="none" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="0" cy="0" rx="22" ry="9" fill="none" stroke="#000" strokeWidth="1.8" />
      <ellipse cx="0" cy="0" rx="9" ry="22" fill="none" stroke="#000" strokeWidth="1.8" />
      <line x1="-22" y1="0" x2="22" y2="0" stroke="#000" strokeWidth="1.8" />
      <line x1="0" y1="-22" x2="0" y2="22" stroke="#000" strokeWidth="1.8" />
    </g>
    <text x="112" y="65" fill="#000000" fontSize="42" fontFamily="sans-serif" fontWeight="900" letterSpacing="1">
      DE
    </text>
    <g transform="translate(42, 115)">
      <circle r="18" fill="none" stroke="#DC2626" strokeWidth="6" strokeDasharray="90 15" strokeLinecap="round" transform="rotate(-30)" />
    </g>
    <text x="72" y="125" fill="#000000" fontSize="38" fontFamily="sans-serif" fontWeight="900" letterSpacing="1">
      HOLICS
    </text>
  </svg>
);

// 3. Film & Photography Logo
export const PhotoClubLogo = () => (
  <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 15,25 H 75 V 45 H 35 V 70 H 70 V 90 H 35 V 135 H 15 Z" fill="#0F172A" />
    <path d="M 165,25 H 225 V 135 H 205 V 90 H 165 V 25 Z M 185,45 V 70 H 205 V 45 Z" fill="#0F172A" />
    <rect x="185" y="10" width="30" height="8" rx="2" fill="#0F172A" />

    <g transform="translate(120, 80)">
      <circle r="42" fill="#0F172A" />
      <circle r="36" fill="white" />
      <path d="M 0,0 L -25,-15 L -10,-32 Z" fill="#A855F7" />
      <path d="M 0,0 L -10,-32 L 15,-30 Z" fill="#EF4444" />
      <path d="M 0,0 L 15,-30 L 32,-10 Z" fill="#F97316" />
      <path d="M 0,0 L 32,-10 L 25,18 Z" fill="#EAB308" />
      <path d="M 0,0 L 25,18 L -5,32 Z" fill="#22C55E" />
      <path d="M 0,0 L -5,32 L -28,10 Z" fill="#3B82F6" />
      <circle r="12" fill="#0F172A" opacity="0.15" />
    </g>

    <text x="120" y="154" textAnchor="middle" fill="#0F172A" fontSize="14" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.5">
      Film And Photography
    </text>
  </svg>
);

// 4. The Lexis Club Logo (Literary & Language)
export const EcoClubLogo = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="62" stroke="#F472B6" strokeWidth="6" opacity="0.3" filter="blur(2px)" />
    <circle cx="100" cy="100" r="60" fill="white" stroke="#E0F2FE" strokeWidth="4" />
    
    <path id="topArc" d="M 38,100 A 62,62 0 0,1 162,100" fill="none" />
    <path id="bottomArc" d="M 162,100 A 62,62 0 0,1 38,100" fill="none" />
    
    <text fontSize="14" fontWeight="800" fontFamily="serif" fill="#000" textAnchor="middle">
      <textPath href="#topArc" startOffset="50%">CMRTC</textPath>
    </text>
    <text fontSize="12" fontWeight="800" fontFamily="serif" fill="#000" textAnchor="middle">
      <textPath href="#bottomArc" startOffset="50%">THE LEXIS CLUB</textPath>
    </text>

    <path d="M 80,125 C 70,90 100,70 100,100 C 100,115 80,120 125,125 C 100,122 88,110 88,95 C 88,75 75,95 80,125 Z" fill="#15803D" />
    
    <g transform="translate(112, 102) scale(0.6)">
      <path d="M 0,-15 C -8,0 -12,12 0,20 C 12,12 8,0 0,-15 Z" fill="#C084FC" />
      <path d="M -5,-10 C -15,-2 -15,10 -3,18 C -10,8 -5,0 -5,-10 Z" fill="#A855F7" />
      <path d="M 5,-10 C 15,-2 15,10 3,18 C 10,8 5,0 5,-10 Z" fill="#A855F7" />
    </g>
  </svg>
);

// 5. NCC (National Cadet Corps) Logo
export const DesignClubLogo = () => (
  <svg viewBox="0 0 160 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20,10 H 60 V 135 C 40,118 24,92 20,10 Z" fill="#DC2626" />
    <path d="M 60,10 H 100 V 155 C 80,160 80,160 60,135 Z" fill="#1E3A8A" />
    <path d="M 100,10 H 140 C 136,92 120,118 100,155 Z" fill="#0284C7" />

    <g transform="translate(80, 75)">
      <circle r="36" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="6 3" />
      <circle r="26" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="2" />
      <text x="0" y="7" textAnchor="middle" fill="#F59E0B" fontSize="18" fontFamily="serif" fontWeight="bold">
        NCC
      </text>
    </g>

    <path d="M 30,155 L 80,148 L 130,155 L 125,175 L 80,168 L 35,175 Z" fill="#0F172A" />
    <text x="80" y="165" textAnchor="middle" fill="#F59E0B" fontSize="9" fontFamily="serif" fontWeight="bold">
      एकता और अनुशासन
    </text>
  </svg>
);

// 6. NSS (National Service Scheme) Logo
export const NssLogo = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer dark blue circle */}
    <circle cx="100" cy="100" r="95" fill="#1E3A5F" />
    <circle cx="100" cy="100" r="90" fill="none" stroke="#FFFFFF" strokeWidth="2" />
    
    {/* Inner white circle */}
    <circle cx="100" cy="100" r="60" fill="#FFFFFF" />
    
    {/* Red wheel — central hub */}
    <circle cx="100" cy="100" r="12" fill="#D32F2F" />
    <circle cx="100" cy="100" r="8" fill="#FFFFFF" />
    <circle cx="100" cy="100" r="4" fill="#D32F2F" />
    
    {/* Red wheel spokes (8 spokes) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line
        key={angle}
        x1="100"
        y1="100"
        x2={100 + 50 * Math.cos((angle * Math.PI) / 180)}
        y2={100 + 50 * Math.sin((angle * Math.PI) / 180)}
        stroke="#D32F2F"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ))}
    
    {/* Red outer wheel rim */}
    <circle cx="100" cy="100" r="50" fill="none" stroke="#D32F2F" strokeWidth="4" />
    
    {/* Curved petals between spokes */}
    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => {
      const r = 32;
      const x = 100 + r * Math.cos((angle * Math.PI) / 180);
      const y = 100 + r * Math.sin((angle * Math.PI) / 180);
      return (
        <circle key={angle} cx={x} cy={y} r="8" fill="#D32F2F" opacity="0.25" />
      );
    })}

    {/* Top arc text — Hindi */}
    <path id="nssTopArc" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
    <text fontSize="14" fontWeight="800" fontFamily="sans-serif" fill="#FFFFFF" textAnchor="middle">
      <textPath href="#nssTopArc" startOffset="50%">राष्ट्रीय सेवा योजना</textPath>
    </text>

    {/* Bottom arc text — English */}
    <path id="nssBottomArc" d="M 170,108 A 70,70 0 0,1 30,108" fill="none" />
    <text fontSize="11" fontWeight="800" fontFamily="sans-serif" fill="#FFFFFF" textAnchor="middle" letterSpacing="2">
      <textPath href="#nssBottomArc" startOffset="50%">NATIONAL SERVICE SCHEME</textPath>
    </text>
  </svg>
);

// Alias exports for clarity
export const LexisClubLogo = EcoClubLogo;
export const NccLogo = DesignClubLogo;
export const SportsClubLogo = AkritiLogo;
