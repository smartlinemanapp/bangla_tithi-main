
/**
 * Triggers a short haptic feedback vibration (Android only)
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'selection' = 'selection') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        switch (type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(50);
                break;
            case 'selection':
                navigator.vibrate(5);
                break;
        }
    }
};
