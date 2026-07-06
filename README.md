# FurniStore

FurniStore is a full-stack furniture e-commerce MVP. It uses a React/Vite client, an Express/TypeScript API, MongoDB, Stripe checkout, JWT auth, and shared TypeScript types in an npm workspace monorepo.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Redux, TanStack Query, Tailwind CSS, React Router |
| Backend | Node.js 20, Express, TypeScript, MongoDB, Mongoose |
| Shared | TypeScript types and constants via `@furnistore/shared` |
| DevOps | Docker Compose, GitHub Actions CI |

## Prerequisites

- Node.js 20+
- npm 10+
- Docker and Docker Compose for local MongoDB/Mailhog
- MongoDB Atlas account for hosted database deployments
- Stripe test account for checkout

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Start MongoDB and Mailhog:

```bash
docker compose up mongo mailhog -d
```

4. Initialize and seed the database:

```bash
npm run db:init
```

5. Start the client and server:

```bash
npm run dev
```

Local URLs:

| Service | URL |
| --- | --- |
| Client | http://localhost:5173 |
| API | http://localhost:5000 |
| Health check | http://localhost:5000/api/v1/health |
| Mailhog | http://localhost:8025 |

Default seeded admin:

| Field | Value |
| --- | --- |
| Email | `admin@furnistore.com` |
| Password | `Admin@123456` |
| Admin page | http://localhost:5173/admin |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start client and server concurrently |
| `npm run dev:client` | Start only the Vite client |
| `npm run dev:server` | Start only the Express API |
| `npm run build` | Build shared, server, and client workspaces |
| `npm run lint` | Run ESLint for client and server |
| `npm run test` | Run server tests |
| `npm run db:init` | Create collections, indexes, seed products, and admin user |
| `npm run db:inspect` | Inspect MongoDB connection and collection counts |
| `npm run docker:up` | Start the Docker Compose stack |
| `npm run docker:down` | Stop the Docker Compose stack |

## Environment

Copy `.env.example` to `.env` for local development. Keep `.env` out of git.

Required production values:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV=production` | Enables production checks |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Access-token signing secret |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret |
| `CLIENT_URL` | Public client URL used for CORS and email links |
| `VITE_API_URL` | Client API base URL at build time |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

See [docs/atlas-setup.md](docs/atlas-setup.md) and [docs/stripe-setup.md](docs/stripe-setup.md) for setup details.

## Project Structure

```text
client/              React SPA (Vite)
server/              Express API
shared/              Shared TypeScript types and constants
docker/              MongoDB init scripts
docs/                Setup and architecture docs
scripts/             Local setup helpers
docker-compose.yml   Local development services
```

## GitHub Readiness

This repo includes:

- `.gitignore` for dependencies, build outputs, secrets, uploads, logs, and local deploy folders
- `.env.example` with all required configuration keys
- GitHub Actions CI for `npm ci`, audit, lint, build, and tests
- `LICENSE` for the MIT license declared here
- Deployment notes in [DEPLOYMENT.md](DEPLOYMENT.md)

Before pushing:

```bash
npm run audit
npm run lint
npm run build
npm run test
```

## Status

Completed:

- Monorepo workspace layout
- Vite React client
- Express API with TypeScript
- MongoDB models and seed scripts
- JWT auth, admin seed, protected routes
- Checkout, Stripe sessions, orders, and webhook handling
- CI, lint, tests, Docker local services

Planned:

- Product detail pages
- Search and filters
- Wishlist and reviews
- Admin catalog/order management polish

## License

MIT. See [LICENSE](LICENSE).
