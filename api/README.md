# Customer Registration API

The Customer Registration API is a NestJS + TypeORM service that exposes CRUD endpoints for onboarding and managing customer profiles.

## Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker for local database via `db/docker-compose.yml`)

## Setup

```bash
cd api
cp .env.example .env
npm install
```

## Running Locally

Start the database:
```bash
docker compose -f ../db/docker-compose.yml up -d
```

Apply migrations and seed data:
```bash
psql "$DATABASE_URL" -f ../db/migrations/01_customer_domain.sql
psql "$DATABASE_URL" -f ../db/test/01_customer_domain_test_data.sql
```

Launch the API server:
```bash
npm run start:dev
```

The service listens on `http://localhost:3000/api`.

## Testing

```bash
npm test       # unit tests
npm run test:e2e  # end-to-end tests with in-memory SQLite
```

## Endpoints

- `POST   /api/customers`
- `GET    /api/customers`
- `GET    /api/customers/:id`
- `PUT    /api/customers/:id`
- `DELETE /api/customers/:id`

See `e2e/customers.http` for example HTTP requests.
