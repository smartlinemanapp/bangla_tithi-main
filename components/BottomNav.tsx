
import React from 'react';

export type TabType = 'home' | 'calendar' | 'upcoming';

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    const tabs: { id: TabType; label: string; icon: React.ReactNode; activeIcon: React.ReactNode }[] = [
        {
            id: 'home',
            label: 'হোম',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            activeIcon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
            ),
        },
        {
            id: 'calendar',
            label: 'পঞ্জিকা',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            activeIcon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 19H5V8h14v11zM16 1V3H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2z" />
                </svg>
            ),
        },
        {
            id: 'upcoming',
            label: 'আসন্ন',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            activeIcon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="fixed bottom-8 left-0 right-0 z-[100] px-6">
            <nav className="max-w-md mx-auto bg-[#121212]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 flex justify-around items-center shadow-2xl">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className="flex flex-col items-center gap-1 group relative py-3 px-6 rounded-3xl transition-all duration-500"
                        >
                            <div className={`
                                relative transition-all duration-500 transform
                                ${isActive ? 'text-[var(--accent-main)] scale-110 neon-glow' : 'text-white/40 hover:text-white/60'}
                            `}>
                                {isActive ? tab.activeIcon : tab.icon}
                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent-main)] copper-glow"></div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
