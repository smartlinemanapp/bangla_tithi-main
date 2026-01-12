
import React from 'react';
import { M3Card } from './M3Card';
import { triggerHaptic } from '../utils/hapticUtils';
import { TithiPresetType } from '../utils/notificationUtils';

interface ReminderOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (preset: TithiPresetType | 'custom') => void;
    tithiName: string;
}

export const ReminderOptionsModal: React.FC<ReminderOptionsModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    tithiName
}) => {
    if (!isOpen) return null;

    const options: { id: TithiPresetType | 'custom'; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
        {
            id: '15min',
            title: 'তিথি শুরু হওয়ার আগে',
            subtitle: '১৫ মিনিট আগে একটি পবিত্র সংকেত',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            color: 'bg-amber-500/10 text-amber-500'
        },
        {
            id: 'day_before_morning',
            title: 'উদযাপন প্রস্তুতি - সকাল',
            subtitle: 'আগের দিন সকাল ৮:০০ টায় (বাজার ও প্রস্তুতির সময়)',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'bg-orange-500/10 text-orange-500'
        },
        {
            id: 'day_before_evening',
            title: 'উদযাপন প্রস্তুতি - সন্ধ্যা',
            subtitle: 'আগের দিন সন্ধ্যা ৭:০০ টায় (পূজা ও রীতির সময়)',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ),
            color: 'bg-indigo-500/10 text-indigo-500'
        },
        {
            id: 'custom' as any,
            title: 'নিজের মতো সময় সেট করুন',
            subtitle: 'আপনার সুবিধামতো দিন ও সময় বেছে নিন',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            color: 'bg-emerald-500/10 text-emerald-500'
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <M3Card
                variant="elevated"
                className="relative w-full max-w-sm overflow-hidden border-none bg-[#121212] cred-card animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-lg font-black text-white tracking-tight bangla-font">রিমাইন্ডার অপশন</h3>
                        <p className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-widest mt-0.5 bangla-font">{tithiName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => {
                                triggerHaptic('selection');
                                onSelect(opt.id);
                            }}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all text-left group active:scale-[0.98]"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${opt.color} group-hover:scale-110 transition-transform`}>
                                {opt.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-white/90 leading-tight">{opt.title}</h4>
                                <p className="text-[10px] font-medium text-white/40 mt-0.5 line-clamp-1">{opt.subtitle}</p>
                            </div>
                            <div className="text-white/20 group-hover:text-[var(--accent-main)] transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5">
                    <p className="text-[10px] font-bold text-white/30 text-center leading-relaxed italic bangla-font">
                        "সঠিক প্রস্তুতিই হলো পবিত্র উদযাপনের চাবিকাঠি।"
                    </p>
                </div>
            </M3Card>
        </div>
    );
};
