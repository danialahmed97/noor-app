import express from 'express';
import { saveToken, getAllTokens } from './db.js';

const PORT = process.env.PORT || 4000;
const NOOR_SEND_SECRET = process.env.NOOR_SEND_SECRET;
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const BATCH_SIZE = 100;

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/register', (req, res) => {
  const { token } = req.body || {};

  if (typeof token !== 'string' || !token.startsWith('ExponentPushToken')) {
    return res.status(400).json({ ok: false, error: 'invalid token' });
  }

  try {
    saveToken(token);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save token:', err);
    res.status(500).json({ ok: false, error: 'internal error' });
  }
});

app.post('/send', async (req, res) => {
  if (req.header('x-noor-secret') !== NOOR_SEND_SECRET) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const { theme, title, body } = req.body || {};

  try {
    const tokens = getAllTokens();
    let sent = 0;

    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
      const batch = tokens.slice(i, i + BATCH_SIZE);
      const messages = batch.map((token) => ({
        to: token,
        title: title || '🌙 New cards this week',
        body: body || `Theme : ${theme}`,
        sound: 'default',
      }));

      const response = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(messages),
      });

      if (response.ok) {
        sent += batch.length;
      } else {
        console.error('Expo push batch failed:', response.status, await response.text());
      }
    }

    res.json({ ok: true, sent });
  } catch (err) {
    console.error('Failed to send push notifications:', err);
    res.status(500).json({ ok: false, error: 'internal error' });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'internal error' });
});

app.listen(PORT, () => {
  console.log(`noor-push-server listening on port ${PORT}`);
});
