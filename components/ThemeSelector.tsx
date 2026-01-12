import React from 'react';
import { triggerHaptic } from '../utils/hapticUtils';

export interface ThemePalette {
    name: string;
    main: string;
    light: string;
    dark: string;
    glow: string;
    glowSubtle: string;
    secondary: string;
    secondaryGlow: string;
}

export const PALETTES: ThemePalette[] = [
    {
        name: 'Sacred Gold',
        main: '#C49B66',
        light: '#F5D1A0',
        dark: '#8B6236',
        glow: 'rgba(196, 155, 102, 0.4)',
        glowSubtle: 'rgba(196, 155, 102, 0.15)',
        secondary: '#FF2E63',
        secondaryGlow: 'rgba(255, 46, 99, 0.4)',
    },
    {
        name: 'Mystic Purple',
        main: '#A855F7',
        light: '#D8B4FE',
        dark: '#7E22CE',
        glow: 'rgba(168, 85, 247, 0.4)',
        glowSubtle: 'rgba(168, 85, 247, 0.15)',
        secondary: '#EC4899',
        secondaryGlow: 'rgba(236, 72, 153, 0.4)',
    },
    {
        name: 'Deep Crimson',
        main: '#FF2E63',
        light: '#FF7597',
        dark: '#C71B48',
        glow: 'rgba(255, 46, 99, 0.4)',
        glowSubtle: 'rgba(255, 46, 99, 0.15)',
        secondary: '#F59E0B',
        secondaryGlow: 'rgba(245, 158, 11, 0.4)',
    },
    {
        name: 'Forest Green',
        main: '#10B981',
        light: '#6EE7B7',
        dark: '#059669',
        glow: 'rgba(16, 185, 129, 0.4)',
        glowSubtle: 'rgba(16, 185, 129, 0.15)',
        secondary: '#3B82F6',
        secondaryGlow: 'rgba(59, 130, 246, 0.4)',
    },
    {
        name: 'Celestial Blue',
        main: '#3B82F6',
        light: '#93C5FD',
        dark: '#1D4ED8',
        glow: 'rgba(59, 130, 246, 0.4)',
        glowSubtle: 'rgba(59, 130, 246, 0.15)',
        secondary: '#10B981',
        secondaryGlow: 'rgba(16, 185, 129, 0.4)',
    },
];

interface ThemeSelectorProps {
    currentTheme: string;
    onSelect: (palette: ThemePalette) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelect, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 sm:p-0">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm rounded-[2rem] p-6 bg-[#121212] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
                <h3 className="text-lg font-black bangla-font text-white mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-[var(--accent-main)] shadow-[0_0_10px_var(--accent-glow)]"></div>
                    রঙ পরিবর্তন করুন
                </h3>

                <div className="grid grid-cols-5 gap-3">
                    {PALETTES.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => {
                                triggerHaptic('medium');
                                onSelect(p);
                            }}
                            className={`
                group relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300
                ${currentTheme === p.name ? 'ring-2 ring-white ring-offset-4 ring-offset-[#121212] scale-110' : 'hover:scale-105'}
              `}
                            title={p.name}
                        >
                            <div
                                className="w-full h-full rounded-2xl shadow-inner border border-white/5"
                                style={{ background: `linear-gradient(135deg, ${p.light} 0%, ${p.main} 100%)` }}
                            />
                            {currentTheme === p.name && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] bg-white/5 text-white/60 hover:bg-white/10 transition-all border border-white/5"
                >
                    বন্ধ করুন
                </button>
            </div>
        </div>
    );
};
