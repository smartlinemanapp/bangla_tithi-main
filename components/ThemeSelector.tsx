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
    currentStyle?: string;
    onSelect: (palette: ThemePalette) => void;
    onSelectStyle?: (style: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, currentStyle, onSelect, onSelectStyle, isOpen, onClose }) => {
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

                <div className="my-6 h-px bg-white/10 w-full" />

                <h3 className="text-lg font-black bangla-font text-white mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-white/50 shadow-[0_0_10px_white]"></div>
                    ডিজাইন স্টাইল
                </h3>

                <div className="grid grid-cols-4 gap-3">
                    {[
                        { id: 'modern', label: 'Modern', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
                        { id: 'cartoon', label: 'Cartoon', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                        { id: 'colourbook', label: 'Sketch', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /> },
                        { id: 'oldscript', label: 'Retro', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
                    ].map((style) => (
                        <button
                            key={style.id}
                            onClick={() => {
                                triggerHaptic('medium');
                                if (onSelectStyle) onSelectStyle(style.id);
                            }}
                            className={`
                                group relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 gap-2 border border-white/5
                                ${currentStyle === style.id ? 'bg-[var(--accent-main)] text-black scale-105 shadow-lg shadow-[var(--accent-glow)]' : 'bg-white/5 text-white/60 hover:bg-white/10'}
                            `}
                            title={style.label}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {style.icon}
                            </svg>
                            <span className="text-[9px] font-black uppercase tracking-wider">{style.label}</span>
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
