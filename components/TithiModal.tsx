
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
}

export const TithiModal: React.FC<TithiModalProps> = ({
    tithi,
    isOpen,
    onClose,
    advice,
    adviceLoading,
}) => {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen || !tithi) return null;

    const handleClose = () => {
        triggerHaptic('selection');
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-5">
            {/* Scrim */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className={`
                relative w-full max-w-lg overflow-hidden
                rounded-t-[3.5rem] sm:rounded-[4rem] 
                shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-20 duration-700
                border-t sm:border border-white/5
                bg-[#050505] text-white
            `}>
                {/* Decorative Pattern Header (Grid) */}
                <div className="absolute top-0 left-0 right-0 h-48 opacity-[0.05] pointer-events-none overflow-hidden">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="modalGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.2" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#modalGrid)" />
                    </svg>
                </div>

                {/* Handle for Bottom Sheet on Mobile */}
                <div className="sm:hidden flex justify-center pt-5 pb-2 relative z-10">
                    <div className="w-16 h-1 rounded-full bg-white/10"></div>
                </div>

                <div className="p-10 pt-8 sm:pt-16 relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black bangla-font uppercase tracking-tight text-[#C49B66]">বিষদ বিবরণ</span>
                            <h2 className="text-4xl font-black bangla-font tracking-tight text-white leading-tight">
                                {tithi.event.banglaName}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-4 rounded-3xl bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/5 shadow-xl"
                        >
                            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Timeline Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Bangla Calendar</span>
                                {(() => {
                                    const b = getBanglaDate(new Date(tithi.date));
                                    return (
                                        <span className="text-base font-black text-[#C49B66]">
                                            {toBengaliNumber(b.day)} {BANGLA_MONTHS_BN[b.monthIndex]}, {toBengaliNumber(b.year)}
                                        </span>
                                    );
                                })()}
                            </div>
                            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Standard Date</span>
                                <span className="text-base font-black text-white/80">
                                    {toBengaliNumber(new Date(tithi.date).getDate())} {ENGLISH_MONTHS_BN[new Date(tithi.date).getMonth()]}
                                </span>
                            </div>
                        </div>

                        {/* Solar Data */}
                        {tithi.sun && (
                            <div className="flex items-center justify-between p-6 rounded-[2.5rem] bg-gradient-to-r from-white/[0.01] to-white/[0.03] border border-white/5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[#C49B66]">Sunrise</span>
                                    <span className="text-2xl font-black">{tithi.sun.sunrise}</span>
                                </div>
                                <div className="w-[1px] h-8 bg-white/5"></div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[#FF2E63]">Sunset</span>
                                    <span className="text-2xl font-black">{tithi.sun.sunset}</span>
                                </div>
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="relative pt-4 pb-4">
                            {adviceLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-6">
                                    <div className="w-12 h-12 border-[3px] border-[#C49B66] border-t-transparent animate-spin rounded-full copper-glow"></div>
                                    <span className="text-[10px] font-black bangla-font uppercase tracking-widest opacity-40">তথ্য লোড করা হচ্ছে...</span>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-12 h-[1px] bg-[#FF2E63]/30"></span>
                                        <span className="text-[11px] font-black bangla-font uppercase tracking-widest text-[#FF2E63] neon-glow">বিশেষ তথ্য</span>
                                    </div>
                                    <p className="text-[18px] leading-[1.7] bangla-font font-medium text-white/80 text-justify">
                                        {advice}
                                    </p>

                                    <div className="mt-12 flex flex-col gap-4">
                                        <button
                                            onClick={handleClose}
                                            className="w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all bg-[#C49B66] text-black hover:bg-[#D4AB76] shadow-2xl copper-glow"
                                        >
                                            Dismiss Dashboard
                                        </button>
                                        <p className="text-center text-[9px] font-black bangla-font opacity-20 uppercase tracking-widest">বঙ্গ তিথি দর্পণ</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root') || document.body
    );
};
