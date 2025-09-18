# Customer Registration Platform

A full-stack customer onboarding solution composed of a NestJS REST API, a PostgreSQL schema with migrations, and a Next.js UI. The project is scaffolded from the Codex full-stack Next.js + NestJS pattern and is ready for local development, automated testing, and containerized database runs.

## Repository Layout

| Path | Description |
| ---- | ----------- |
| `db/` | SQL migrations, entity specs, seed data, Docker Compose, and environment samples for PostgreSQL. |
| `api/` | NestJS service implementing customer CRUD, validation, TypeORM persistence, and automated unit/e2e tests. |
| `ui/` | Next.js 14 application with TailwindCSS styling and a customer registration form backed by Jest tests. |
| `schemas/` | Shared JSON schemas derived from the domain definition. |
| `ai/` | Agentic pipeline context, documentation artifacts, and turn logs. |

## Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional but recommended for PostgreSQL via `db/docker-compose.yml`)

## Initial Setup

1. **Database**
   ```bash
   cd db
   cp .env.example .env
   docker compose up -d
   # Run migrations/seed scripts as needed using your preferred tool or psql
   ```

2. **API**
   ```bash
   cd api
   npm install
   cp .env.example .env # create if needed and provide database credentials
   npm run start:dev
   ```
   The API exposes REST endpoints under `http://localhost:3000/api/customers` by default. `npm run start:dev` enables hot reload.

3. **UI**
   ```bash
   cd ui
   npm install
   cp .env.example .env.local # configure NEXT_PUBLIC_API_BASE_URL if necessary
   npm run dev
   ```
   The Next.js app runs at `http://localhost:3001` (configure via `package.json` or `next.config.js` as desired) and submits registrations to the API base URL defined in the environment file.

## Testing & Quality Gates

### API Workspace

```bash
cd api
npm run lint           # ESLint (TypeScript aware)
npm test -- --runInBand # Unit tests (Jest)
npm run test:e2e       # Supertest-backed e2e suite using in-memory SQLite
```

### UI Workspace

```bash
cd ui
npm run lint  # Next.js ESLint config
npm test      # Jest + Testing Library component tests
```

### Database

- Apply migrations via your preferred workflow (psql, sqitch, or migration runner).
- Seed data is available under `db/test/01_customer_domain_test_data.sql` for local experimentation.

## Environment Configuration

- `api/.env.example` documents required variables for HTTP server configuration and Postgres connectivity.
- `ui/.env.example` (copy to `.env.local`) exposes `NEXT_PUBLIC_API_BASE_URL` for browser-side fetches.
- `db/.env.example` provides defaults consumed by Docker Compose and migration tooling.

## Additional Resources

- HTTP request examples for the API live under `api/test/http/` and can be executed via VS Code REST Client or similar tools.
- Pattern guidance, turn manifests, and ADRs are tracked in `ai/agentic-pipeline/`.
- Tailwind styles and UI components live under `ui/src/app/` with tests in adjacent `*.test.tsx` files.

## Running End-to-End Locally

1. Start PostgreSQL via Docker Compose.
2. Run the NestJS API (`npm run start:dev` in `api/`).
3. Run the Next.js UI (`npm run dev` in `ui/`).
4. Access the customer registration form in the browser and submit data; records will be persisted through the API to the database.

## Troubleshooting

- If NestJS e2e tests fail with SQLite type errors, verify the shared column helper (`src/customers/entities/entity-column-types.ts`) resolves `process.env.NODE_ENV === 'test'` before module imports.
- Jest component tests require `ts-node` and `jest-environment-jsdom`; both are installed as dev dependencies. Re-run `npm install` inside `ui/` if Jest reports missing modules.
- For lint warnings referencing unsupported TypeScript versions, ensure Node/npm lockfiles remain consistent with the project `package-lock.json` files.
