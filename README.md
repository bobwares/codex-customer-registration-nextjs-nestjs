# Customer Registration

This repository contains a full-stack foundation for managing customer onboarding data. Turn 2 introduces the NestJS API that exposes CRUD endpoints backed by PostgreSQL.

## Structure

- `api/` — NestJS REST API with TypeORM persistence.
- `db/` — Docker Compose stack and environment samples for PostgreSQL.
- `libs/domain/` — Shared domain schema snapshots.
- `schemas/` — JSON schema used for validation.

## Getting Started

1. Start PostgreSQL locally:
   ```bash
   docker compose -f db/docker-compose.yml up -d
   ```
2. Install API dependencies and run migrations:
   ```bash
   cd api
   npm install
   npm run typeorm:migration:run
   ```
3. Launch the API:
   ```bash
   npm run start:dev
   ```

Refer to `api/README.md` for comprehensive setup, testing, and endpoint documentation.
