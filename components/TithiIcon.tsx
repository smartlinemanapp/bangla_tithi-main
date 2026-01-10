import React from 'react';

interface TithiIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TithiIcon: React.FC<TithiIconProps> = ({ type, size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24';

  const CredIconWrapper = ({ children, glowColor = "rgba(196, 155, 102, 0.2)" }: { children: React.ReactNode, glowColor?: string }) => (
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
          <CredIconWrapper glowColor="rgba(196, 155, 102, 0.4)">
            <svg viewBox="0 0 100 100" className="w-[90%] h-[90%]">
              <defs>
                <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5D1A0" />
                  <stop offset="45%" stopColor="#C49B66" />
                  <stop offset="55%" stopColor="#A87D4A" />
                  <stop offset="100%" stopColor="#8B6236" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Intricate Flame Pattern */}
              <path
                d="M50 10 C60 30 85 40 85 65 S70 90 50 90 S15 90 15 65 S40 30 50 10"
                fill="url(#premiumGold)"
                filter="url(#glow)"
              />
              <path
                d="M50 25 C55 40 70 48 70 65 S62 80 50 80 S30 80 30 65 S45 40 50 25"
                fill="rgba(255,255,255,0.2)"
              />
              <circle cx="50" cy="58" r="6" fill="#FF2E63" className="animate-pulse shadow-lg" style={{ filter: 'drop-shadow(0 0 8px #FF2E63)' }} />
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
          <CredIconWrapper glowColor="rgba(255, 46, 99, 0.1)">
            <svg viewBox="0 0 100 100" className="w-[95%] h-[95%]">
              <circle cx="50" cy="50" r="44" fill="#050505" stroke="rgba(196, 155, 102, 0.15)" strokeWidth="2" />
              {/* Corona Ring */}
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="#FF2E63"
                strokeWidth="0.5"
                strokeDasharray="1, 4"
                className="animate-[spin_20s_linear_infinite] opacity-40"
              />
              <path d="M50 6 A 44 44 0 0 1 50 94" fill="none" stroke="#FF2E63" strokeWidth="1" opacity="0.4" filter="blur(1px)" />
            </svg>
          </CredIconWrapper>
        );
      case 'Ekadashi':
        return (
          <CredIconWrapper glowColor="rgba(196, 155, 102, 0.2)">
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
                style={{ filter: 'drop-shadow(0 0 10px rgba(196, 155, 102, 0.3))' }}
              />
              <path
                d="M 50 15 A 35 35 0 0 1 50 85"
                fill="none"
                stroke="#FF2E63"
                strokeWidth="1.5"
                className="opacity-60"
                style={{ filter: 'drop-shadow(0 0 5px #FF2E63)' }}
              />
            </svg>
          </CredIconWrapper>
        );
      default:
        return (
          <CredIconWrapper>
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(196,155,102,0.15)" strokeWidth="1" strokeDasharray="4 6" />
              <path d="M50 30 L50 70 M30 50 L70 50" stroke="rgba(196,155,102,0.2)" strokeWidth="0.5" />
            </svg>
          </CredIconWrapper>
        );
    }
  };

  return renderIcon();
};
