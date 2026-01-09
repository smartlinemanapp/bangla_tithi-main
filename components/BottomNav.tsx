
import React from 'react';

export type TabType = 'home' | 'calendar' | 'upcoming';

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    theme: 'saffron' | 'midnight' | 'emerald';
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, theme }) => {
    const tabs: { id: TabType; label: string; icon: React.ReactNode; activeIcon: React.ReactNode }[] = [
        {
            id: 'home',
            label: 'হোম',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            activeIcon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
            ),
        },
        {
            id: 'calendar',
            label: 'ক্যালেন্ডার',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            activeIcon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
            ),
        },
        {
            id: 'upcoming',
            label: 'আসন্ন',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            activeIcon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
            ),
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[var(--md-sys-color-surface)] border-t border-[var(--md-sys-color-outline)]/10 px-4 pb-[env(safe-area-inset-bottom,16px)] pt-3 flex justify-around items-center transition-colors duration-500">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className="flex flex-col items-center gap-1 group relative py-1 px-4 min-w-[64px]"
                    >
                        <div className={`
              relative px-5 py-1 rounded-full transition-all duration-300 transform
              ${isActive ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] scale-110' : 'text-[var(--md-sys-color-on-surface)] opacity-70 hover:opacity-100'}
            `}>
                            {isActive ? tab.activeIcon : tab.icon}
                        </div>
                        <span className={`
              text-[11px] font-bold bangla-font transition-all duration-300
              ${isActive ? 'text-[var(--md-sys-color-on-surface)] scale-105' : 'text-[var(--md-sys-color-on-surface)] opacity-60'}
            `}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};
