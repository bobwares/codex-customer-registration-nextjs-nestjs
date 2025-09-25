# Project Changelog

## 0.1.0 – 2025-09-25T19:10:45Z (Turn 1)
- Established the NestJS API scaffold with linting, testing, and formatting configuration.
- Implemented health module with liveness/readiness endpoints and accompanying unit and E2E tests.
- Added REST Client `.http` scenarios for manual verification.

## 0.2.0 – 2025-09-25T19:45:00Z (Turn 2)
- Added a customer_domain migration that creates normalized tables, foreign keys, indexes, and a flattened reporting view.
- Generated the Draft 2020-12 customer_domain entity schema reflecting the persisted model for integrations.
- Authored idempotent test data seeding script and documented migration workflows in `db/README.md`.

## 0.3.0 – 2025-09-25T19:49:54Z (Turn 3)
- Configured a shared TypeORM data source, CLI scripts, and validation utilities that read credentials from `ai/context/.env`.
- Implemented customer domain entities, view projections, and a transactional NestJS service bundled in a new `CustomerModule`.
- Captured the initial TypeORM migration and README guidance to manage migrations and runtime database checks.

## 0.4.0 – 2025-09-25T20:43:14Z (Turn 5)
- Added Docker Compose stack and shared environment configuration under `infra/` to run Postgres and the NestJS API together.
- Introduced a project-level `Makefile` covering Compose lifecycle, TypeORM migrations, and application commands.
- Published an end-to-end API README with configuration guidance, troubleshooting, and workflow documentation, and reorganized REST client `.http` files under `api/rest-tests/` with updated metadata headers.
