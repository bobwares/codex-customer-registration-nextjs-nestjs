# ADR 2: Customer CRUD API with TypeORM and PostgreSQL

**Status**: Accepted

**Date**: 2025-09-20

## Context
The project required implementing RESTful CRUD endpoints for the Customer domain while persisting data to PostgreSQL. The solution needed to respect the provided JSON schema, support automated testing, and document database setup.

## Decision
- Scaffolded a NestJS application using TypeORM for persistence and Joi-backed configuration validation.
- Modelled customers as a dedicated module with DTO validation, service/repository integration, and TypeORM entity definitions matching the schema.
- Added a migration creating the `customers` table and Docker Compose resources for PostgreSQL.
- Enabled a SQLite driver fallback for automated tests to run without container orchestration while keeping PostgreSQL as the production default.

## Consequences
- Database connections are centrally configured through environment variables, easing deployment but requiring secrets management.
- The SQLite fallback simplifies CI execution; parity with PostgreSQL relies on shared JSON column shapes and should be validated against real databases regularly.
- New unit and e2e tests provide coverage for DTO validation and CRUD flows, increasing maintenance responsibilities as the domain evolves.
