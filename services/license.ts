import { supabase } from './supabase';

export interface LicenseVerificationResult {
    valid: boolean;
    message: string;
    isPremium?: boolean;
}

const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';
// TODO: User to check this permalink match if they want strict checking
// const PRODUCT_PERMALINK = 'bangla-tithi-premium'; 

export const verifyLicenseKey = async (key: string): Promise<LicenseVerificationResult> => {
    try {
        const response = await fetch(GUMROAD_VERIFY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                product_permalink: 'bangla_tithi_premium', // Optional: Replace with your actual product permalink from Gumroad
                license_key: key.trim(),
            }),
        });

        const data = await response.json();

        if (data.success && !data.purchase.refunded && !data.purchase.chargebacked) {
            // Valid purchase
            return {
                valid: true,
                isPremium: true,
                message: 'License verified successfully! Premium features unlocked.',
            };
        } else {
            // 2. If Gumroad fails, check Supabase Promo Codes
            const { data, error } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', key.trim())
                .eq('is_active', true)
                .single();

            if (data && !error) {
                // Increment usage count securely
                await supabase.rpc('increment_promo_usage', { code_text: key.trim() });

                return {
                    valid: true,
                    isPremium: true,
                    message: 'Promo code applied! Premium unlocked. 🎉',
                };
            }

            return {
                valid: false,
                message: 'Invalid or missing license key.',
            };
        }
    } catch (error) {
        console.error('License verification failed:', error);
        return {
            valid: false,
            message: 'Network error. Please try again.',
        };
    }
};

export const saveLicenseStatus = (isPremium: boolean) => {
    if (isPremium) {
        localStorage.setItem('bangla_tithi_premium_unlocked', 'true');
    } else {
        localStorage.removeItem('bangla_tithi_premium_unlocked');
    }
};

export const getLicenseStatus = (): boolean => {
    return localStorage.getItem('bangla_tithi_premium_unlocked') === 'true';
};
