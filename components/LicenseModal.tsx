import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { M3Card } from './M3Card';
import { triggerHaptic } from '../utils/hapticUtils';
import { verifyLicenseKey, saveLicenseStatus } from '../services/license';
import { purchasePackage, restorePurchases, getOfferings } from '../services/purchases';
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';

interface LicenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [offering, setOffering] = useState<PurchasesPackage | null>(null);
    const [showPromoInput, setShowPromoInput] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load price from RevenueCat
            getOfferings().then(pkg => {
                if (pkg) setOffering(pkg);
            });
        }
    }, [isOpen]);

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

    const handleBuy = async () => {
        if (!offering) return;
        triggerHaptic('selection');
        setLoading(true);

        const result = await purchasePackage(offering);

        if (result.success) {
            triggerHaptic('success');
            onSuccess();
            onClose();
        } else {
            if (result.message !== 'Purchase cancelled.') {
                setError(result.message);
            }
        }
        setLoading(false);
    };

    const handleRestore = async () => {
        setLoading(true);
        triggerHaptic('selection');
        const result = await restorePurchases();
        if (result.success) {
            triggerHaptic('success');
            onSuccess();
            onClose();
        } else {
            setError(result.message);
        }
        setLoading(false);
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

                    <h2 className="text-xl font-black text-white mb-1.5 bangla-font">Go Premium</h2>
                    <p className="text-xs text-white/60 mb-5 leading-relaxed">
                        Unlock advanced Solar Charts, detailed Tithi timing, and support the developer.
                    </p>

                    {/* Primary Purchase Button */}
                    <div className="w-full space-y-3 mb-4">
                        <button
                            onClick={handleBuy}
                            disabled={loading || !offering}
                            className={`w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                ${loading ? 'bg-white/10 text-white/50' : 'bg-[var(--accent-main)] text-black hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--accent-glow)]'}
                            `}
                        >
                            {loading ? 'Processing...' : (offering ? `Unlock for ${offering.product.priceString}` : 'Loading Price...')}
                        </button>

                        <button
                            onClick={handleRestore}
                            disabled={loading}
                            className="text-[10px] font-bold text-white/40 uppercase tracking-wider hover:text-white transition-colors"
                        >
                            Restore Purchases
                        </button>
                    </div>

                    <div className="w-full h-[1px] bg-white/5 mb-4"></div>

                    {/* Promo Code Toggle */}
                    {!showPromoInput ? (
                        <button
                            onClick={() => setShowPromoInput(true)}
                            className="text-[10px] text-white/30 hover:text-[var(--accent-main)] transition-colors underline decoration-white/10"
                        >
                            I have a Promo Code/License Key
                        </button>
                    ) : (
                        <div className="w-full space-y-3 animate-in fade-in slide-in-from-top-2">
                            <input
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="Enter Promo Code"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center text-white font-mono text-xs placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-main)]/50 focus:ring-1 focus:ring-[var(--accent-main)]/50 transition-all"
                            />
                            {error && (
                                <p className="text-red-400 text-[10px] font-bold animate-in fade-in slide-in-from-top-1">{error}</p>
                            )}
                            <button
                                onClick={handleVerify}
                                disabled={loading || !key}
                                className="w-full py-2.5 rounded-xl bg-white/10 font-bold text-[10px] text-white uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                                Redeem Code
                            </button>
                        </div>
                    )}

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
