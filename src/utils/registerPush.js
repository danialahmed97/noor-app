import * as Notifications from 'expo-notifications';

const REGISTER_URL = 'https://noor-api.gymfund.in/register';

export async function registerForPushNotifications() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    const { data: token } = await Notifications.getExpoPushTokenAsync();
    if (!token) return;

    await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    // Never let push registration crash or block the app.
  }
}
