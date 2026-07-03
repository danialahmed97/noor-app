import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const REGISTER_URL = 'https://noor-api.gymfund.in/register';

export async function registerForPushNotifications() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log('[push] permission status:', finalStatus);

    if (finalStatus !== 'granted') return;

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? '0a625db5-899f-4e73-94bc-f9ab626cd232';
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log('[push] token:', token);
    if (!token) return;

    const response = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    console.log('[push] register response status:', response.status);
  } catch (err) {
    console.warn('[push] registration failed:', err);
  }
}
