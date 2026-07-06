# Deployment

FurniStore is a full-stack app, so deploy the client and server separately.

## Recommended Targets

| Part | Suggested platform | Build/start |
| --- | --- | --- |
| Client | Vercel, Netlify, or static hosting | `npm run build -w client` |
| Server | Render, Railway, Fly.io, or Docker host | `npm run build -w server`, then `npm run start -w server` |
| Database | MongoDB Atlas | Use `MONGODB_URI` |

## GitHub Setup

1. Push the repository to GitHub.
2. Confirm GitHub Actions runs the CI workflow on push.
3. Add deployment platform secrets in the platform dashboard, not in GitHub source.
4. Keep `.env` local and commit only `.env.example`.

## Server Environment

Set these variables on the server platform:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/furniture_shop?retryWrites=true&w=majority
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=https://your-client-domain.example
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@your-domain.example
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
AUTO_VERIFY_EMAIL=false
ADMIN_EMAIL=admin@your-domain.example
ADMIN_PASSWORD=replace-with-a-strong-password
ADMIN_NAME=Store Admin
```

## Client Environment

Set this variable before building the client:

```env
VITE_API_URL=https://your-api-domain.example/api/v1
```

## Production Checks

Run these locally before creating a release:

```bash
npm run audit
npm run lint
npm run build
npm run test
```

## Stripe Webhook

In the Stripe dashboard, add a webhook endpoint:

```text
https://your-api-domain.example/api/webhooks/stripe
```

Subscribe to checkout/payment events used by the order flow, then copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
