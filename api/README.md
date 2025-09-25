# Customer Registration API

## Overview
The Customer Registration API is a NestJS 11 service built with TypeScript, TypeORM 0.3.x, and PostgreSQL 16. It captures and manages onboarding data for new customers, exposing CRUD operations, health/readiness probes, structured error envelopes, and OpenAPI documentation available at `/docs` and `/api/openapi.json`.

## Prerequisites
- Node.js 20+
- Docker and Docker Compose
- GNU Make

## Quickstart
Run the following commands from the project root to bring up the full stack, apply migrations, and start the API in watch mode:

```
make compose-up
make db-wait
make migrate-run
make api-dev
```

### Verification
- Visit or curl `http://localhost:${API_PORT}/health` and confirm the response reports `status: ok`.
- If you use the VS Code REST Client, execute the requests in [`api/rest-tests/health.http`](./rest-tests/health.http).

## Configuration
1. Copy the example file and adjust values for your environment:
   ```
   cp api/.env.local.example api/.env.local
   ```
2. Variables provided in `.env.local.example`:
   - `DATABASE_HOST` – Hostname for Postgres (use `db` when running under Docker Compose).
   - `DATABASE_PORT` – Postgres port inside the Compose network.
   - `DATABASE_USERNAME` – Database user.
   - `DATABASE_PASSWORD` – Database password.
   - `DATABASE_NAME` – Database name.
   - `DATABASE_SCHEMA` – Default schema to target.
   - `DATABASE_SSL` – Set to `false` for local development; configure as needed for secured environments.
3. Do not introduce `${VAR:-default}` fallbacks in environment files, scripts, or documentation. Compose services inherit concrete values from [`infra/.env`](../infra/.env).

## Running with Docker Compose
- Start all services: `make compose-up`
- Stream logs: `make compose-logs`
- Stop and remove containers/volumes: `make compose-down`
- Persistent storage is provided via the `db_data` named volume defined in [`infra/docker-compose.yml`](../infra/docker-compose.yml). Host port mappings and credentials are sourced from [`infra/.env`](../infra/.env).

## Database and Migrations
- Generate a migration: `make migrate-generate NAME=<description>`
- Apply migrations: `make migrate-run`
- Revert the latest migration: `make migrate-revert`
- TypeORM data source: `api/src/database/data-source.ts`
- Generated migrations: `api/src/migrations`

## Development Scripts
- Build the project: `make api-build`
- Run unit tests: `make api-test`
- Start the development server: `make api-dev`

## API Documentation
- Swagger UI: `http://localhost:${API_PORT}/docs`
- OpenAPI JSON: `http://localhost:${API_PORT}/api/openapi.json`
- Regenerate the OpenAPI artifact locally with `npm run openapi:emit` (outputs to `api/openapi/openapi.json`).

## Health and Readiness
- `GET /health` – Aggregated health details, returns HTTP 200 when healthy.
- `GET /health/ready` – Readiness probe, returns HTTP 200 with service readiness indicators.
- `GET /health/live` – Liveness probe for container orchestrators.
Responses include `status`, `info`, `error`, and `details` sections aligned with NestJS Terminus conventions.

## Error Handling Contract
All errors are wrapped in a consistent JSON envelope containing:
- `statusCode`
- `message`
- `error`
- `path`
- `timestamp`
- `requestId`
Validation failures (`400`) and unprocessable entity responses (`422`) reuse this structure with a `message` array describing violations.

## Troubleshooting
- **Port conflicts**: Ensure `API_PORT` and `DB_PORT` from `infra/.env` are free before running `make compose-up`.
- **Database host resolution**: Use `db` as the host inside Compose; when running directly against a local Postgres instance use `localhost` and update `.env.local` accordingly.
- **Inspecting services**: `make db-logs` tails the Postgres logs and `make db-psql` opens a psql session with container credentials.

## Project Structure
```
api/
|-- Dockerfile
|-- README.md
|-- package.json
|-- rest-tests/
|   |-- customers.http
|   `-- health.http
|-- src/
|   |-- app.module.ts
|   |-- common/
|   |-- customer/
|   |-- database/
|   |-- health/
|   `-- logging/
`-- test/
    |-- e2e/
    `-- unit/
```


## Conventions and Governance
- Keep Docker Compose, Makefile, and README instructions synchronized; update documentation with every workflow change.
- Commit generated migrations alongside feature work to maintain history.
- Avoid default environment fallbacks in configuration files, scripts, and documentation.
