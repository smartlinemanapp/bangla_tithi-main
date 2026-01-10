import React from 'react';
import { triggerHaptic } from '../utils/hapticUtils';

interface PremiumLockProps {
    isPremium: boolean;
    onUnlock: () => void;
    title?: string;
    children: React.ReactNode;
}

export const PremiumLock: React.FC<PremiumLockProps> = ({ isPremium, onUnlock, title = "Premium Feature", children }) => {
    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 group">
            {/* Blurred Content Placeholder */}
            <div className="opacity-10 blur-sm pointer-events-none select-none filter grayscale">
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-500">
                <div className="p-4 rounded-full bg-[var(--accent-main)]/10 mb-4 animate-bounce hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[var(--accent-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>

                <h3 className="text-xl font-black text-white mb-1">{title}</h3>
                <p className="text-xs text-white/50 mb-6 font-medium text-center max-w-[80%]">Unlock this feature with Bangla Tithi Premium</p>

                <button
                    onClick={() => {
                        triggerHaptic('medium');
                        onUnlock();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[var(--accent-main)] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_var(--accent-glow)]"
                >
                    Unlock Now
                </button>
            </div>
        </div>
    );
};
