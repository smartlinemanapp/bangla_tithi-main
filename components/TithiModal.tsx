
import React from 'react';
import ReactDOM from 'react-dom';
import { TithiEvent, DAYS_BN, BANGLA_MONTHS_BN, ENGLISH_MONTHS_BN } from '../types';
import { getBanglaDate, toBengaliNumber } from '../utils/banglaUtils';
import { triggerHaptic } from '../utils/hapticUtils';

interface TithiModalProps {
    tithi: TithiEvent | null;
    isOpen: boolean;
    onClose: () => void;
    advice: string;
    adviceLoading: boolean;
    theme: 'saffron' | 'midnight' | 'emerald';
    activeTheme: any;
}

export const TithiModal: React.FC<TithiModalProps> = ({
    tithi,
    isOpen,
    onClose,
    advice,
    adviceLoading,
    theme,
    activeTheme
}) => {
    if (!isOpen || !tithi) return null;

    const handleClose = () => {
        triggerHaptic('selection');
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-5">
            {/* Scrim */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className={`
        relative w-full max-w-lg overflow-hidden
        rounded-t-[3rem] sm:rounded-[3rem] 
        shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-500
        border-t sm:border border-[var(--md-sys-color-outline)]/10
        ${theme === 'midnight' ? 'bg-slate-900' : 'bg-white'}
      `}>
                {/* Handle for Bottom Sheet on Mobile */}
                <div className="sm:hidden flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-current opacity-20"></div>
                </div>

                <div className="p-7 pt-4 sm:pt-10">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-6 rounded-full ${activeTheme.secondary} shadow-lg shadow-current/30`}></div>
                            <h5 className="text-xs font-black bangla-font tracking-widest uppercase opacity-60">তিথির বিস্তারিত</h5>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2.5 rounded-full hover:bg-black/5 active:scale-90 transition-all opacity-40 hover:opacity-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Title Section */}
                    <div className="mb-8">
                        <h2 className={`text-4xl font-black bangla-font tracking-tight mb-2 ${activeTheme.textMain}`}>
                            {tithi.banglaName}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {/* English Date Badge */}
                            <div className={`px-4 py-2 rounded-2xl flex flex-col items-start gap-0.5 border shadow-sm ${theme === 'midnight' ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-blue-50/50 border-blue-100'}`}>
                                <span className={`text-[8px] font-black uppercase tracking-widest opacity-40 ${theme === 'midnight' ? 'text-indigo-300' : 'text-blue-900'}`}>ইংরেজি ক্যালেন্ডার</span>
                                <span className={`text-xs font-black bangla-font ${theme === 'midnight' ? 'text-indigo-100' : 'text-blue-900'}`}>
                                    {toBengaliNumber(new Date(tithi.date).getDate())} {ENGLISH_MONTHS_BN[new Date(tithi.date).getMonth()]}, {toBengaliNumber(new Date(tithi.date).getFullYear())}
                                </span>
                            </div>

                            {/* Bangla Date Badge */}
                            {(() => {
                                const b = getBanglaDate(new Date(tithi.date));
                                return (
                                    <div className={`px-4 py-2 rounded-2xl flex flex-col items-start gap-0.5 border shadow-sm ${theme === 'midnight' ? 'bg-orange-950/30 border-orange-500/20' : 'bg-orange-50/50 border-orange-100'}`}>
                                        <span className={`text-[8px] font-black uppercase tracking-widest opacity-40 ${theme === 'midnight' ? 'text-orange-300' : 'text-orange-900'}`}>বাংলা তারিখ</span>
                                        <span className={`text-xs font-black bangla-font ${theme === 'midnight' ? 'text-orange-100' : 'text-orange-900'}`}>
                                            {toBengaliNumber(b.day)} {BANGLA_MONTHS_BN[b.monthIndex]}, {toBengaliNumber(b.year)}
                                        </span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="relative min-h-[150px]">
                        {adviceLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <div className={`w-10 h-10 border-[3px] border-t-transparent animate-spin rounded-full ${activeTheme.textAccent}`}></div>
                                <span className="text-[10px] font-black bangla-font opacity-40 uppercase tracking-widest">তথ্য লোড হচ্ছে...</span>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <p className={`text-[17px] leading-[1.8] bangla-font font-medium opacity-90 text-justify ${theme === 'midnight' ? 'text-slate-300' : 'text-gray-700'}`}>
                                    {advice}
                                </p>

                                <div className={`p-4 rounded-3xl border ${theme === 'midnight' ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-500"></div>
                                        <span className="text-[11px] font-black bangla-font opacity-60 uppercase tracking-widest">পূণ্যফল ও শুভ লক্ষণসমূহ</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={handleClose}
                                        className={`w-full py-4 rounded-2xl font-black text-xs transition-all active:scale-[0.98] uppercase tracking-[0.2em] bangla-font shadow-xl ${theme === 'midnight' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}
                                    >
                                        বন্ধ করুন
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom padding for mobile bar */}
                <div className="h-4 sm:hidden"></div>
            </div>
        </div>,
        document.getElementById('modal-root') || document.body
    );
};
