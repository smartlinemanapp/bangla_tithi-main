# Alarm Plugin Usage

This document explains how to use the `Alarm` capacitor plugin.

## Setting an alarm

To set an alarm, you need to call the `set` method of the `Alarm` plugin. The method takes an object with `hour` and `minute` as parameters.

```javascript
import { Plugins } from '@capacitor/core';
const { Alarm } = Plugins;

async function setAlarm() {
  try {
    await Alarm.set({ hour: 10, minute: 30 });
    console.log('Alarm set successfully');
  } catch (error) {
    console.error('Error setting alarm', error);
  }
}
```

## How it works

The `set` method will schedule a daily alarm at the specified hour and minute.

On Android 12 and above, the user will be prompted to grant the "Alarms & reminders" permission if it's not already granted.

When the alarm fires, a notification will be displayed with the title "Bangla Tithi" and the message "It's time for your reminder!".

## Important

You need to add a "Set Reminder" button in your web app's UI and call the `setAlarm` function when the button is clicked. You can modify the `hour` and `minute` values as per your requirement.
