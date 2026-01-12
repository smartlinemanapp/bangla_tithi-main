
import React, { useState, useEffect } from 'react';
import { M3Card } from './M3Card';
import { triggerHaptic } from '../utils/hapticUtils';
import { getPendingReminders, cancelReminder, scheduleManualReminder } from '../utils/notificationUtils';
import { toBengaliNumber, formatBengaliTime, formatFullBengaliDate } from '../utils/banglaUtils';

interface RemindersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (reminder: any) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({ isOpen, onClose, onEdit }) => {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadReminders();
        }
    }, [isOpen]);

    const loadReminders = async () => {
        const pending = await getPendingReminders();
        setReminders(pending || []);
    };

    const handleCancel = async (id: number) => {
        setLoading(true);
        const success = await cancelReminder(id);
        if (success) {
            setConfirmDeleteId(null);
            loadReminders();
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

            <M3Card variant="elevated" className="relative w-full max-w-lg bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white bangla-font flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent-main)]/10 flex items-center justify-center shadow-inner">
                            <svg className="w-5 h-5 text-[var(--accent-main)] neon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        রিমাইন্ডার লিস্ট
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-all">
                        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 custom-scrollbar">
                    {/* List Section */}
                    {/* List Section */}
                    <div className="space-y-3">
                        {reminders.length > 0 ? (
                            reminders.map((r) => {
                                const cleanTitle = r.title?.replace(/^Upcoming Tithi:\s*/i, '') || 'Reminder';
                                return (
                                    <div key={r.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center group active:bg-white/[0.04] transition-all">
                                        <div className="flex flex-col flex-1 min-w-0 pr-4 gap-1">
                                            <h4 className="text-sm font-black text-white/90 truncate bangla-font">{cleanTitle}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="px-2 py-0.5 rounded-md bg-[var(--accent-main)]/10 border border-[var(--accent-main)]/20">
                                                    <span className="text-[9px] text-[var(--accent-main)] font-black bangla-font uppercase tracking-wider">
                                                        {formatBengaliTime(r.schedule.at)}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-white/30 font-bold bangla-font">
                                                    {formatFullBengaliDate(new Date(r.schedule.at))}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { triggerHaptic('selection'); onEdit(r); }}
                                                className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-[var(--accent-main)] hover:bg-white/10 transition-all flex items-center justify-center shadow-lg"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => { triggerHaptic('warning'); setConfirmDeleteId(r.id); }}
                                                className="p-3 rounded-xl bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center shadow-lg"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 opacity-20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="text-white/20 text-xs font-black bangla-font tracking-widest uppercase">কোনো রিমাইন্ডার সেট করা নেই</p>
                            </div>
                        )}
                    </div>

                    {/* Manual Form Section */}
                </div>
            </M3Card>

            {/* Delete Confirmation Modal */}
            {confirmDeleteId !== null && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setConfirmDeleteId(null)} />
                    <M3Card variant="elevated" className="relative w-full max-w-xs bg-[#121212] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-black text-white bangla-font mb-2">আপনি কি নিশ্চিত?</h3>
                            <p className="text-xs text-white/40 bangla-font leading-relaxed">আপনি কি নিশ্চিতভাবে এই রিমাইন্ডারটি মুছতে চান? এটি আর ফিরে পাওয়া যাবে না।</p>
                        </div>
                        <div className="flex border-t border-white/5">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/5 transition-all bangla-font"
                            >
                                বন্ধ করুন
                            </button>
                            <button
                                onClick={() => confirmDeleteId && handleCancel(confirmDeleteId)}
                                disabled={loading}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 transition-all border-l border-white/5 bangla-font"
                            >
                                {loading ? 'মুছে ফেলছে...' : 'মুছে ফেলুন'}
                            </button>
                        </div>
                    </M3Card>
                </div>
            )}
        </div>
    );
};
