<!--
App: Customer Registration
Package: api
File: README.md
Version: 0.1.0
Turns: 1-4
Author: Codex Agent
Date: 2025-09-25T06:25:09Z
Description: Backend service documentation for customer registration API.
-->
# Customer Registration API

NestJS service that manages the customer onboarding lifecycle backed by PostgreSQL and TypeORM.

## Setup

```bash
npm install
npm run build
```

## Running

```bash
npm run start:dev
```

### Health Endpoints

- `GET /health`
- `GET /health/live`
- `GET /health/ready`

### Customer Endpoints

- `GET /customers`
- `GET /customers/{id}`
- `POST /customers`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`

Refer to `api/e2e/customers.http` for request examples.

## Database Workflows

- Validate environment connectivity: `npm run db:validate`
- Generate a TypeORM migration: `npm run typeorm:migration:generate`
- Run migrations in development: `npm run typeorm:migration:run`
- Run compiled migrations (CI/prod): `npm run typeorm:migration:run:js`

## OpenAPI

Generate the OpenAPI specification with:

```bash
npm run openapi:emit
```

Swagger UI is available at `http://localhost:3000/api/docs`. The emitted JSON file lives in `openapi/openapi.json`.

## Testing

```bash
npm test
npm run test:e2e
```
