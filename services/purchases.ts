import { Purchases, PurchasesPackage, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Platform } from 'react-native'; // Not available in pure web/capacitor directly, standard capacitor check used instead.
import { Capacitor } from '@capacitor/core';
import { saveLicenseStatus } from './license';

// REPLACE THIS WITH YOUR ACTUAL REVENUECAT API KEY
const REVENUECAT_API_KEY_ANDROID = 'goog_YOUR_REVENUECAT_ANDROID_API_KEY';

export interface PurchaseResult {
    success: boolean;
    message: string;
    isPremium: boolean;
}

export const initializePurchases = async () => {
    if (!Capacitor.isNativePlatform()) {
        console.log('Purchases: Web platform detected, skipping initialization.');
        return;
    }

    try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY_ANDROID });
        console.log('Purchases: RevenueCat configured successfully.');

        // Check for existing entitlements immediately
        await checkSubscriptionStatus();
    } catch (error) {
        console.error('Purchases: Initialization failed', error);
    }
};

export const checkSubscriptionStatus = async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return false;

    try {
        const customerInfo = await Purchases.getCustomerInfo();
        // Identify your entitlement identifier from RevenueCat dashboard
        // Assuming 'premium' is the entitlement identifier
        const isPremium = typeof customerInfo.entitlements.active['premium'] !== "undefined";

        saveLicenseStatus(isPremium); // Sync with local app state
        return isPremium;
    } catch (error) {
        console.error('Purchases: Failed to check status', error);
        return false;
    }
};

export const getOfferings = async (): Promise<PurchasesPackage | null> => {
    if (!Capacitor.isNativePlatform()) return null;

    try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
            return offerings.current.availablePackages[0]; // Return the first available package (usually the lifetime/monthly one)
        }
    } catch (error) {
        console.error('Purchases: Failed to get offerings', error);
    }
    return null;
};

export const purchasePackage = async (pack: PurchasesPackage): Promise<PurchaseResult> => {
    if (!Capacitor.isNativePlatform()) {
        return { success: false, message: 'Web purchases not supported yet.', isPremium: false };
    }

    try {
        const { customerInfo } = await Purchases.purchasePackage({ aPackage: pack });
        const isPremium = typeof customerInfo.entitlements.active['premium'] !== "undefined";

        if (isPremium) {
            saveLicenseStatus(true);
            return { success: true, message: 'Purchase successful! Premium unlocked.', isPremium: true };
        }
    } catch (error: any) {
        if (error.userCancelled) {
            return { success: false, message: 'Purchase cancelled.', isPremium: false };
        }
        console.error('Purchases: Purchase failed', error);
    }

    return { success: false, message: 'Purchase failed or not authorized.', isPremium: false };
};

export const restorePurchases = async (): Promise<PurchaseResult> => {
    if (!Capacitor.isNativePlatform()) {
        return { success: false, message: 'Not on native device.', isPremium: false };
    }

    try {
        const customerInfo = await Purchases.restorePurchases();
        const isPremium = typeof customerInfo.entitlements.active['premium'] !== "undefined";

        if (isPremium) {
            saveLicenseStatus(true);
            return { success: true, message: 'Purchases restored successfully!', isPremium: true };
        } else {
            return { success: false, message: 'No active Premium subscription found.', isPremium: false };
        }
    } catch (error) {
        console.error('Purchases: Restore failed', error);
        return { success: false, message: 'Failed to restore purchases.', isPremium: false };
    }
};
