import React from 'react';

interface TithiIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TithiIcon: React.FC<TithiIconProps> = ({ type, size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24';

  const CredIconWrapper = ({ children, glowColor = "var(--accent-glow)" }: { children: React.ReactNode, glowColor?: string }) => (
    <div className={`${dimensions} relative group transition-transform duration-700 hover:scale-110 flex items-center justify-center`}>
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"
        style={{ backgroundColor: glowColor }}
      ></div>
      <div className="relative z-10 w-full h-full flex items-center justify-center filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  );

  const renderIcon = () => {
    switch (type) {
      case 'Festival':
      case 'Ritual':
        return (
          <CredIconWrapper glowColor="var(--accent-glow)">
            <svg viewBox="0 0 100 100" className="w-[90%] h-[90%]">
              <defs>
                <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-light)" />
                  <stop offset="45%" stopColor="var(--accent-main)" />
                  <stop offset="55%" stopColor="var(--accent-main)" />
                  <stop offset="100%" stopColor="var(--accent-dark)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Diya Base (Clay Lamp) */}
              <path
                d="M20 55 Q20 85 50 85 Q80 85 80 55 C80 45 70 55 50 65 C30 55 20 45 20 55 Z"
                fill="var(--accent-dark)"
                opacity="0.8"
                stroke="var(--accent-main)"
                strokeWidth="1"
              />

              {/* The Flame (Sacred Fire) */}
              <path
                d="M50 15 Q65 40 60 55 Q50 70 40 55 Q35 40 50 15"
                fill="url(#premiumGold)"
                filter="url(#glow)"
                className="animate-pulse"
                style={{ transformOrigin: 'center bottom' }}
              />

              {/* Inner Core of Flame */}
              <path
                d="M50 25 Q58 45 50 55 Q42 45 50 25"
                fill="var(--accent-secondary)"
                opacity="0.9"
                style={{ filter: 'drop-shadow(0 0 4px var(--accent-secondary-glow))' }}
              />
            </svg>
          </CredIconWrapper>
        );
      case 'Purnima':
        return (
          <CredIconWrapper glowColor="rgba(255, 255, 255, 0.2)">
            <svg viewBox="0 0 100 100" className="w-[95%] h-[95%]">
              <defs>
                <radialGradient id="lunarSurface" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="70%" stopColor="#E0E5EA" />
                  <stop offset="100%" stopColor="#B4BDC7" />
                </radialGradient>
              </defs>
              {/* Outer Glow / Corona */}
              <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,0.05)" />
              {/* Moon Body */}
              <circle cx="50" cy="50" r="44" fill="url(#lunarSurface)" />
              {/* Cratering Textures */}
              <circle cx="35" cy="40" r="8" fill="rgba(0,0,0,0.03)" />
              <circle cx="60" cy="30" r="5" fill="rgba(0,0,0,0.04)" />
              <circle cx="55" cy="65" r="12" fill="rgba(0,0,0,0.02)" />
              <circle cx="25" cy="60" r="6" fill="rgba(0,0,0,0.03)" />
              {/* Metallic Rim */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </svg>
          </CredIconWrapper>
        );
      case 'Amavasya':
        return (
          <CredIconWrapper glowColor="rgba(255, 255, 255, 0.05)">
            <svg viewBox="0 0 100 100" className="w-[95%] h-[95%]">
              <circle cx="50" cy="50" r="44" fill="#050505" stroke="var(--accent-glow-subtle)" strokeWidth="2" />
              {/* Corona Ring */}
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="var(--accent-main)"
                strokeWidth="0.5"
                strokeDasharray="1, 4"
                className="animate-[spin_20s_linear_infinite] opacity-40"
              />
              <path d="M50 6 A 44 44 0 0 1 50 94" fill="none" stroke="var(--accent-main)" strokeWidth="1" opacity="0.4" filter="blur(1px)" />
            </svg>
          </CredIconWrapper>
        );
      case 'Ekadashi':
        return (
          <CredIconWrapper glowColor="var(--accent-glow-subtle)">
            <svg viewBox="0 0 100 100" className="w-[90%] h-[90%]">
              <defs>
                <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E0E5EA" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
              </defs>
              <path
                d="M 50 6 A 44 44 0 1 1 50 94 A 28 44 0 1 0 50 6"
                fill="url(#premiumGold)"
                style={{ filter: 'drop-shadow(0 0 10px var(--accent-glow-subtle))' }}
              />
              <path
                d="M 50 15 A 35 35 0 0 1 50 85"
                fill="none"
                stroke="var(--accent-main)"
                strokeWidth="1.5"
                className="opacity-60"
                style={{ filter: 'drop-shadow(0 0 5px var(--accent-main))' }}
              />
            </svg>
          </CredIconWrapper>
        );
      default:
        return (
          <CredIconWrapper>
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--accent-glow-subtle)" strokeWidth="1" strokeDasharray="4 6" />
              <path d="M50 30 L50 70 M30 50 L70 50" stroke="var(--accent-glow-subtle)" strokeWidth="0.5" />
            </svg>
          </CredIconWrapper>
        );
    }
  };

  return renderIcon();
};
