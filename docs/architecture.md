# FurniStore Architecture

## Overview

FurniStore is an npm workspace monorepo with three app packages:

- `client`: React SPA served by Vite
- `server`: Express REST API
- `shared`: TypeScript types and constants

## Runtime Flow

```text
Browser -> Vite client (5173) -> Express API (5000) -> MongoDB
                                      |
                                      +-> Stripe
                                      +-> SMTP/Mailhog
```

## Client

- Redux ducks hold cart, product, and auth state.
- TanStack Query is available for server state.
- Vite reads `VITE_API_URL` at build time.
- The API client attaches JWT access tokens and refreshes expired sessions.

## Server

- Express app with Helmet, CORS, rate limiting, and mongo-sanitize.
- Mongoose models for users, catalog, orders, reviews, and wishlists.
- JWT access and refresh tokens for auth.
- Stripe checkout session and webhook handling for orders.
- Nodemailer transport for verification, password reset, and order email.
- Standard API envelope via shared response helpers.

## Shared

The `shared` package exports common constants and TypeScript types consumed by both workspaces.

## Local Services

Docker Compose provides:

- MongoDB on port `27017`
- Mailhog SMTP on port `1025`
- Mailhog UI on port `8025`

## CI

GitHub Actions runs:

1. `npm ci`
2. `npm run audit`
3. `npm run lint`
4. `npm run build`
5. `npm run test -w server`
