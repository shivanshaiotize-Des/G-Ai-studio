import React from 'react';

interface SSLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const SSLogo: React.FC<SSLogoProps> = ({ className = '', size = 48, glow = false }) => {
  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background glow effects */}
      {glow && (
        <span className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-md scale-110 pointer-events-none transition-all duration-300" />
      )}
      
      {/* Monogram Vector */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
      >
        <defs>
          <linearGradient id="ssGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="ssGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="ssBgGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon frame */}
        <polygon 
          points="50,6 88,28 88,72 50,94 12,72 12,28" 
          stroke="currentColor" 
          strokeWidth="3.5" 
          className="text-indigo-500/30 dark:text-purple-550/40"
          strokeLinejoin="round" 
        />
        
        {/* Subtle geometric grid background */}
        <line x1="50" y1="6" x2="50" y2="94" stroke="currentColor" strokeWidth="0.5" className="opacity-10 text-indigo-400" />
        <line x1="12" y1="28" x2="88" y2="72" stroke="currentColor" strokeWidth="0.5" className="opacity-10 text-indigo-400" />
        <line x1="12" y1="72" x2="88" y2="28" stroke="currentColor" strokeWidth="0.5" className="opacity-10 text-indigo-400" />

        {/* The first 'S' shape (Top and middle curve) */}
        <path 
          d="M 68 30 
             C 68 20, 32 20, 32 32 
             C 32 42, 68 44, 68 56 
             C 68 62, 55 64, 50 64" 
          className="stroke-[url(#ssGradLight)] dark:stroke-[url(#ssGradDark)]"
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* The second overlapping 'S' shape (Lower and middle curve, intertwined) */}
        <path 
          d="M 50 36 
             C 45 36, 32 38, 32 44 
             C 32 56, 68 58, 68 68 
             C 68 80, 32 80, 32 70" 
          className="stroke-[url(#ssGradLight)] dark:stroke-[url(#ssGradDark)]"
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* Interactive connection dots representing multi-platform synergy */}
        <circle cx="50" cy="6" r="3.5" className="fill-amber-500 animate-pulse" />
        <circle cx="88" cy="28" r="3" className="fill-amber-600 dark:fill-amber-400" />
        <circle cx="88" cy="72" r="3" className="fill-blue-500" />
        <circle cx="50" cy="94" r="3" className="fill-purple-500" />
        <circle cx="12" cy="72" r="3" className="fill-indigo-500" />
        <circle cx="12" cy="28" r="3" className="fill-emerald-500" />
      </svg>
    </div>
  );
};
