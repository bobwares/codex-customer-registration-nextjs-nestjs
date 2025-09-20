# Customer Registration API

The Customer Registration API is a NestJS service that exposes CRUD endpoints for managing customer records. It persists data to PostgreSQL using TypeORM and enforces the shared JSON schema via DTO validation.

## Prerequisites

- Node.js 20+
- npm 9+
- Docker (for PostgreSQL)

## Environment Setup

1. Copy the sample environment file:
   ```bash
   cp db/.env.example api/.env
   ```
2. Ensure the following variables are set in `api/.env` or your shell:
   - `DATABASE_HOST`
   - `DATABASE_PORT`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `DATABASE_NAME`
   - `DATABASE_SCHEMA`
   - `DATABASE_SSL` (set to `false` locally)

## Running PostgreSQL Locally

From the project root:

```bash
docker compose -f db/docker-compose.yml up -d
```

## Install Dependencies & Build

```bash
cd api
npm install
npm run build
```

## Database Migrations

Generate and run migrations with the TypeORM CLI:

```bash
npm run typeorm:migration:run
```

To create a new migration:

```bash
npm run typeorm:migration:create -- src/migrations/<MigrationName>
```

## Start the API

```bash
npm run start:dev
```

The service listens on `http://localhost:3000` by default.

## Testing

- Unit tests: `npm test`
- End-to-end tests (uses in-memory SQLite): `npm run test:e2e`
- Linting: `npm run lint`

## REST Resources

| Method | Route              | Description                 |
|--------|--------------------|-----------------------------|
| GET    | `/customers`       | List all customers          |
| GET    | `/customers/:id`   | Retrieve a specific customer|
| POST   | `/customers`       | Create a new customer       |
| PUT    | `/customers/:id`   | Update an existing customer |
| DELETE | `/customers/:id`   | Delete a customer           |

For manual testing, use the `.http` file in `rest-tests/customers.http`.
