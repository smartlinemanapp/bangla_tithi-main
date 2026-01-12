
import { LocalNotifications } from '@capacitor/local-notifications';
import { triggerHaptic } from './hapticUtils';

export type TithiPresetType = '15min' | 'day_before_morning' | 'day_before_evening';

export const scheduleTithiPresetReminder = async (tithiName: string, startDate: string, preset: TithiPresetType) => {
    try {
        const { display } = await LocalNotifications.checkPermissions();

        if (display !== 'granted') {
            const { display: newDisplay } = await LocalNotifications.requestPermissions();
            if (newDisplay !== 'granted') {
                alert('Notification permission denied. Please enable it in settings to set reminders.');
                return false;
            }
        }

        const scheduledDate = new Date(startDate);
        let reminderTime: Date;
        let body: string;
        let label: string;

        switch (preset) {
            case '15min':
                reminderTime = new Date(scheduledDate.getTime() - 15 * 60000);
                body = `The sacred tithi "${tithiName}" starts in 15 minutes.`;
                label = '15 mins before start';
                break;
            case 'day_before_morning':
                // Day before at 08:00 AM
                reminderTime = new Date(scheduledDate.getTime() - 24 * 60 * 60000);
                reminderTime.setHours(8, 0, 0, 0);
                body = `Tithi Preparation: "${tithiName}" starts tomorrow. Perfect time for shopping and arrangements.`;
                label = 'day before (8 AM)';
                break;
            case 'day_before_evening':
                // Day before at 07:00 PM
                reminderTime = new Date(scheduledDate.getTime() - 24 * 60 * 60000);
                reminderTime.setHours(19, 0, 0, 0);
                body = `Sacred Alert: "${tithiName}" starts tomorrow. Time for evening rituals and final prep.`;
                label = 'day before (7 PM)';
                break;
            default:
                return false;
        }

        if (reminderTime < new Date()) {
            alert('This time has already passed. Please choose a different reminder.');
            return false;
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    title: tithiName,
                    body,
                    id: Math.floor(Math.random() * 1000000),
                    schedule: { at: reminderTime },
                    sound: 'default',
                    extra: {
                        tithiName,
                        startDate,
                        preset
                    }
                }
            ]
        });

        triggerHaptic('success');
        alert(`Reminder set for ${tithiName} (${label}).`);
        return true;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        alert('Failed to set reminder. Please try again.');
        return false;
    }
};

export const scheduleTithiReminder = async (tithiName: string, startDate: string) => {
    return scheduleTithiPresetReminder(tithiName, startDate, '15min');
};

export const getPendingReminders = async () => {
    try {
        const result = await LocalNotifications.getPending();
        return result.notifications;
    } catch (error) {
        console.error('Error getting pending notifications:', error);
        return [];
    }
};

export const cancelReminder = async (id: number) => {
    try {
        await LocalNotifications.cancel({ notifications: [{ id }] });
        triggerHaptic('light');
        return true;
    } catch (error) {
        console.error('Error canceling notification:', error);
        return false;
    }
};

export const scheduleManualReminder = async (title: string, body: string, date: Date) => {
    try {
        if (date < new Date()) {
            alert('Cannot set reminder for a past time.');
            return false;
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    title,
                    body,
                    id: Math.floor(Math.random() * 1000000),
                    schedule: { at: date },
                    sound: 'default'
                }
            ]
        });

        triggerHaptic('success');
        return true;
    } catch (error) {
        console.error('Error scheduling manual notification:', error);
        return false;
    }
};
