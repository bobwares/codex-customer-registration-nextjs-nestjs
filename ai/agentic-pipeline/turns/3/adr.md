# ADR 3: Centralize TypeORM Configuration via Shared DataSource

**Status**: Accepted  
**Date**: 2025-09-25

## Context
To avoid configuration drift between the NestJS runtime and TypeORM CLI, the project needs a single
source of truth for database options while supporting env-driven deployment.

## Decision
Implement `getDataSourceOptions()` that loads environment variables from `ai/context/.env` and
instantiate `AppDataSource` for reuse by both NestJS and CLI scripts. Generate TypeORM entities for
the customer domain to align with the previously defined SQL schema.

## Consequences
- Ensures migrations and application runtime rely on identical connection settings.
- Facilitates automated connection validation via `npm run db:validate`.
- Entity definitions keep the ORM layer synchronized with database structure.
