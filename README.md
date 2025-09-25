<!--
App: Customer Registration
Package: root
File: README.md
Version: 0.1.0
Turns: 1-4
Author: Codex Agent
Date: 2025-09-25T06:25:09Z
Description: Project overview and run instructions for the full stack application.
-->
# Customer Registration

Customer Registration is a full-stack starter that provides a NestJS REST API for onboarding
customers backed by a PostgreSQL schema.

## Project Structure

- `api/` – NestJS 11 application exposing health and customer CRUD endpoints.
- `db/` – PostgreSQL migrations, Docker Compose stack, and seed data.
- `ai/context/` – JSON schemas and environment configuration used by automation.

## Getting Started

```bash
npm install --prefix api
npm run build --prefix api
npm run start:dev --prefix api
```

The health checks are exposed at:
- `GET http://localhost:3000/health`
- `GET http://localhost:3000/health/live`
- `GET http://localhost:3000/health/ready`

## API Documentation

Swagger UI is served from `http://localhost:3000/api/docs`.
Generate a static OpenAPI document with:

```bash
npm run openapi:emit --prefix api
```

The script writes `api/openapi/openapi.json`.

## Database

Launch PostgreSQL locally via Docker Compose:

```bash
docker compose -f db/docker-compose.yml up -d
```

Apply the canonical migration and optional test data:

```bash
psql postgresql://postgres:postgres@localhost:5432/customer_registration \
  --file=db/migrations/01_customer_domain.sql
psql postgresql://postgres:postgres@localhost:5432/customer_registration \
  --file=db/test/customer_domain_test_data.sql
```

## Testing

Run the full suite from the `api` directory:

```bash
npm test
npm run test:e2e
```
