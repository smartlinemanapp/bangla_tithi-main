
import React from 'react';
import ReactDOM from 'react-dom';
import { TithiEvent, DAYS_BN, BANGLA_MONTHS_BN, ENGLISH_MONTHS_BN } from '../types';
import { getBanglaDate, toBengaliNumber, formatBengaliTime } from '../utils/banglaUtils';
import { triggerHaptic } from '../utils/hapticUtils';
import { scheduleTithiReminder } from '../utils/notificationUtils';

interface TithiModalProps {
    tithi: TithiEvent | null;
    isOpen: boolean;
    onClose: () => void;
    advice: string;
    adviceLoading: boolean;
    onSetReminder?: (tithi: TithiEvent) => void;
}

export const TithiModal: React.FC<TithiModalProps> = ({
    tithi,
    isOpen,
    onClose,
    advice,
    adviceLoading,
    onSetReminder
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

    const ModalTimeBlock = ({ label, isoDateTime, isEnd = false }: { label: string, isoDateTime: string, isEnd?: boolean }) => {
        if (!isoDateTime) return null;
        const d = new Date(isoDateTime);
        const day = String(d.getDate()).padStart(2, '0');
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const y = d.getFullYear();
        const dayName = DAYS_BN[d.getDay()];

        return (
            <div className={`flex flex-col gap-1 ${isEnd ? 'items-end text-right' : 'items-start text-left'}`}>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{label}</span>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-white">{formatBengaliTime(isoDateTime)}</span>
                    <span className="text-[10px] font-bold bangla-font text-[var(--accent-main)]">
                        {dayName}, {toBengaliNumber(day)}/{toBengaliNumber(m)}/{toBengaliNumber(y)}
                    </span>
                </div>
            </div>
        );
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
                relative w-full max-w-lg 
                max-h-[90vh] flex flex-col
                rounded-t-[2.5rem] sm:rounded-[3rem] 
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
                <div className="sm:hidden flex justify-center pt-5 pb-2 relative z-20">
                    <div className="w-16 h-1 rounded-full bg-white/10"></div>
                </div>

                {/* Sticky Header Section */}
                <div className="px-6 pt-3 pb-3 relative z-20 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black bangla-font uppercase tracking-tight text-[var(--accent-main)]">বিষদ বিবরণ</span>
                            <h2 className="text-4xl font-black bangla-font tracking-tight text-white leading-tight">
                                {tithi.event?.banglaName || 'সাধারণ দিন'}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/5 shadow-xl"
                        >
                            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 relative z-10 custom-scrollbar">
                    <div className="space-y-6">
                        {/* Timeline Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Bangla Calendar</span>
                                {(() => {
                                    const b = getBanglaDate(new Date(tithi.date));
                                    return (
                                        <span className="text-base font-black text-[var(--accent-main)]">
                                            {toBengaliNumber(b.day)} {BANGLA_MONTHS_BN[b.monthIndex]}, {toBengaliNumber(b.year)}
                                        </span>
                                    );
                                })()}
                            </div>
                            <div className="p-4 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Standard Date</span>
                                <span className="text-base font-black text-white/80">
                                    {toBengaliNumber(new Date(tithi.date).getDate())} {ENGLISH_MONTHS_BN[new Date(tithi.date).getMonth()]}
                                </span>
                            </div>
                        </div>

                        {/* Solar Data */}
                        {tithi.sun && (
                            <div className="flex items-center justify-between p-4 rounded-[2rem] bg-gradient-to-r from-white/[0.01] to-white/[0.03] border border-white/5 relative overflow-hidden">
                                { /* Ambient Glow for Day Length */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[var(--accent-main)]/5 blur-3xl rounded-full"></div>

                                <div className="flex flex-col gap-1 relative z-10">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent-main)]">Sunrise</span>
                                    <span className="text-2xl font-black">{tithi.sun.sunrise}</span>
                                </div>

                                <div className="flex flex-col items-center gap-1 relative z-10">
                                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[var(--accent-main)]/50 to-transparent"></div>
                                    <span className="text-[9px] font-black text-white/50 bg-white/5 px-2 py-1 rounded-full">{tithi.sun.dayLength}</span>
                                    <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-30">Day Length</span>
                                </div>

                                <div className="flex flex-col gap-1 items-end relative z-10">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent-secondary)]">Sunset</span>
                                    <span className="text-2xl font-black">{tithi.sun.sunset}</span>
                                </div>
                            </div>
                        )}

                        {/* Sacred Timing (Tithi Duration) */}
                        {tithi.event && (
                            <div className="p-6 rounded-[2rem] bg-[#121212] border border-white/5 shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg className="w-12 h-12 text-[var(--accent-main)]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black bangla-font uppercase tracking-tight text-[var(--accent-main)] mb-6 block">পুণ্য কাল (Sacred Duration)</span>
                                    <div className="flex justify-between items-center gap-4">
                                        <ModalTimeBlock label="আরম্ভ (Start)" isoDateTime={tithi.event.startDateTime} />
                                        <div className="flex-1 h-[1px] bg-white/5 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent-main)]/30"></div>
                                        </div>
                                        <ModalTimeBlock label="সমাপ্তি (End)" isoDateTime={tithi.event.endDateTime} isEnd />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="relative">
                            {adviceLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-6">
                                    <div className="w-12 h-12 border-[3px] border-[var(--accent-main)] border-t-transparent animate-spin rounded-full copper-glow"></div>
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
                                            onClick={() => {
                                                if (tithi && onSetReminder) {
                                                    onSetReminder(tithi);
                                                }
                                            }}
                                            className="w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all bg-[var(--accent-main)] text-black hover:bg-[#D4AB76] shadow-2xl copper-glow"
                                        >
                                            Set Reminder
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
