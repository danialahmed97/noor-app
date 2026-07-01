# noor-push-server

Minimal push-notification backend for the Noor app. Stores Expo push tokens in
SQLite and sends weekly "new cards" notifications via Expo's push API.

## Install

```bash
cd server
npm install
```

## Configure

```bash
cp .env.example .env
# edit .env and set NOOR_SEND_SECRET to a long random string
```

## Run

```bash
npm start
```

Server listens on `PORT` (default `4000`).

## Endpoints

### `GET /health`

Uptime check.

```bash
curl https://noor-api.gymfund.in/health
```

### `POST /register`

Registers an Expo push token from the app.

```bash
curl -X POST https://noor-api.gymfund.in/register \
  -H "Content-Type: application/json" \
  -d '{"token":"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"}'
```

### `POST /send`

Sends a push notification to all registered tokens. Requires the
`x-noor-secret` header to match `NOOR_SEND_SECRET`.

```bash
curl -X POST https://noor-api.gymfund.in/send \
  -H "Content-Type: application/json" \
  -H "x-noor-secret: <your NOOR_SEND_SECRET>" \
  -d '{"theme":"Patience"}'
```
