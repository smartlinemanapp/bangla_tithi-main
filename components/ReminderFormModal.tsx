
import React, { useState, useEffect } from 'react';
import { M3Card } from './M3Card';
import { triggerHaptic } from '../utils/hapticUtils';
import { scheduleManualReminder, cancelReminder } from '../utils/notificationUtils';

interface ReminderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingReminder?: any;
    initialTitle?: string;
}

export const ReminderFormModal: React.FC<ReminderFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editingReminder,
    initialTitle
}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editingReminder) {
                const scheduledDate = new Date(editingReminder.schedule.at);
                setTitle(editingReminder.title);
                setDate(scheduledDate.toISOString().split('T')[0]);
                setTime(scheduledDate.toTimeString().slice(0, 5));
            } else if (initialTitle) {
                setTitle(initialTitle);
                setDate('');
                setTime('');
            } else {
                setTitle('');
                setDate('');
                setTime('');
            }
        }
    }, [isOpen, editingReminder, initialTitle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time) return;

        setLoading(true);
        try {
            if (editingReminder) {
                await cancelReminder(editingReminder.id);
            }

            const scheduledDate = new Date(`${date}T${time}`);
            const success = await scheduleManualReminder(title, "Tithi Reminder", scheduledDate);

            if (success) {
                triggerHaptic('success');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error saving reminder:', error);
            alert('রিমাইন্ডার সেভ করতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />

            <M3Card
                variant="elevated"
                className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-lg font-black text-white tracking-tight bangla-font">
                            {editingReminder ? 'রিমাইন্ডার পরিবর্তন' : 'রিমাইন্ডার সেট করুন'}
                        </h3>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">
                            {editingReminder ? 'Modify Settings' : 'Custom Preferences'}
                        </p>
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-main)] ml-1 bangla-font">রিমাইন্ডার নাম</label>
                        <input
                            type="text"
                            placeholder="যেমন: ফুল কেনা বা পূজার প্রস্তুতি"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[var(--accent-main)]/50 transition-all font-medium bangla-font"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-main)] ml-1 bangla-font">তারিখ</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-[var(--accent-main)]/50 transition-all font-mono"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-main)] ml-1 bangla-font">সময়</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-[var(--accent-main)]/50 transition-all font-mono"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all disabled:opacity-50 active:scale-95 bangla-font shadow-xl ${editingReminder
                                ? 'bg-white text-black hover:bg-white/90'
                                : 'bg-[var(--accent-main)] text-black hover:opacity-90'
                                }`}
                        >
                            {loading ? 'প্রক্রিয়া চলছে...' : (editingReminder ? 'পরিবর্তন করুন' : 'নিশ্চিত করুন')}
                        </button>
                    </div>

                    <p className="text-center text-[9px] font-bold opacity-20 uppercase tracking-[0.3em] bangla-font">বঙ্গ তিথি দর্পণ</p>
                </form>
            </M3Card>
        </div>
    );
};
