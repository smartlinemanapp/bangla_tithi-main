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
        return (
          <CredIconWrapper glowColor="rgba(196, 155, 102, 0.3)">
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C49B66" />
                  <stop offset="50%" stopColor="#A87D4A" />
                  <stop offset="100%" stopColor="#8B6236" />
                </linearGradient>
              </defs>
              <path
                d="M50 15 C55 35 75 45 85 65 S75 90 50 90 S15 85 15 65 S45 35 50 15"
                fill="url(#goldGrad)"
              />
              <path
                d="M50 35 C53 45 65 52 70 65 S65 80 50 80 S30 78 30 65 S47 45 50 35"
                fill="white"
                opacity="0.1"
              />
              <circle cx="50" cy="55" r="8" fill="#FF2E63" className="animate-pulse neon-glow" />
            </svg>
          </CredIconWrapper>
        );
      case 'Purnima':
        return (
          <CredIconWrapper glowColor="rgba(255, 255, 255, 0.15)">
            <svg viewBox="0 0 100 100" className="w-[90%] h-[90%]">
              <defs>
                <radialGradient id="silverMoon" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#DDE4EC" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="46" fill="url(#silverMoon)" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
            </svg>
          </CredIconWrapper>
        );
      case 'Amavasya':
        return (
          <CredIconWrapper glowColor="rgba(0, 0, 0, 0.8)">
            <svg viewBox="0 0 100 100" className="w-[90%] h-[90%]">
              <circle cx="50" cy="50" r="46" fill="#050505" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(196, 155, 102, 0.2)" strokeWidth="1.5" />
              <path d="M50 4 A 46 46 0 0 1 50 96" fill="none" stroke="#FF2E63" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </CredIconWrapper>
        );
      case 'Ekadashi':
        return (
          <CredIconWrapper glowColor="rgba(255, 46, 99, 0.2)">
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
              <path
                d="M 50 4 A 46 46 0 1 1 50 96 A 32 46 0 1 0 50 4"
                fill="#C49B66"
              />
              <path
                d="M 50 20 A 30 30 0 0 1 50 80"
                fill="none"
                stroke="#FF2E63"
                strokeWidth="1.5"
                className="neon-glow"
              />
            </svg>
          </CredIconWrapper>
        );
      case 'Pratipada':
        return (
          <CredIconWrapper glowColor="rgba(255, 255, 255, 0.1)">
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
              <path
                d="M 50 4 A 46 46 0 1 1 50 96 A 40 46 0 1 0 50 4"
                fill="#C49B66"
                opacity="0.8"
              />
            </svg>
          </CredIconWrapper>
        );
      default:
        return (
          <CredIconWrapper>
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#C49B66" strokeWidth="1" strokeDasharray="6 4" />
            </svg>
          </CredIconWrapper>
        );
    }
  };

  return renderIcon();
};
