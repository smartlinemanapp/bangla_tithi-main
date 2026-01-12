import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { M3Card } from './M3Card';
import { triggerHaptic } from '../utils/hapticUtils';
import { verifyLicenseKey, saveLicenseStatus } from '../services/license';

interface LicenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleVerify = async () => {
        if (!key.trim()) return;
        triggerHaptic('selection');
        setLoading(true);
        setError('');

        const result = await verifyLicenseKey(key);

        if (result.valid) {
            triggerHaptic('success');
            saveLicenseStatus(true);
            onSuccess();
            onClose();
        } else {
            triggerHaptic('error');
            setError(result.message);
        }
        setLoading(false);
    };

    const handleBuy = () => {
        // Replace with your actual Razorpay Payment Page URL
        window.open('https://rzp.io/l/placeholder', '_blank');
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 isolate">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <M3Card
                variant="elevated"
                className="w-full max-w-sm relative z-10 overflow-hidden bg-[#121212] border border-white/10 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300"
            >
                <div className="p-5 flex flex-col items-center text-center">

                    {/* Header */}
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-main)]/10 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-[var(--accent-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    </div>

                    <h2 className="text-xl font-black text-white mb-1.5 bangla-font">Premium</h2>
                    <p className="text-xs text-white/60 mb-5 leading-relaxed">
                        Unlock advanced Solar Charts, detailed Tithi timing, and ad-free experience.
                    </p>

                    {/* Key Input */}
                    <div className="w-full space-y-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="Enter Promo Code (e.g. BANGLA_PRO)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center text-white font-mono text-xs placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-main)]/50 focus:ring-1 focus:ring-[var(--accent-main)]/50 transition-all"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-[10px] font-bold animate-in fade-in slide-in-from-top-1">{error}</p>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={loading || !key}
                            className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${loading ? 'bg-white/10 text-white/50' : 'bg-[var(--accent-main)] text-black hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--accent-glow)]'}
                `}
                        >
                            {loading ? 'Verifying...' : 'Activate License'}
                        </button>

                        <div className="flex items-center justify-center gap-2 pt-2 opacity-60 hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-white/50 uppercase tracking-wider">Don't have a code?</span>
                            <button onClick={handleBuy} className="text-[10px] font-black text-[var(--accent-main)] uppercase tracking-wider underline decoration-[var(--accent-main)]/50">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </M3Card>
        </div>,
        document.body
    );
};
