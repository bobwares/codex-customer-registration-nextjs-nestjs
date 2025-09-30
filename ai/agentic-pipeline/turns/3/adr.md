# ADR 3: NestJS TypeORM Integration Strategy

**Status**: Accepted  
**Date**: 2025-09-30

## Context
With the database schema defined, the API must expose the customer domain through TypeORM entities, a reusable data source, and migration workflow. The solution must run in both development (TypeScript) and CI (compiled JavaScript) environments while honoring the `customer_domain` schema.

## Decision
Introduce a dedicated `CustomerModule` that registers entities and a repository-backed `CustomerService`. Configure a shared `AppDataSource` that loads environment variables from `ai/context/.env`, applies the SnakeNamingStrategy, and disables schema synchronization. Extend `package.json` with TypeORM CLI scripts and generate an initial migration (`1727713200000-CreateCustomerDomainTables.ts`) to align ORM migrations with the handcrafted SQL.

## Consequences
- Positive: NestJS now has a centralized TypeORM configuration that matches the manual SQL migration, enabling repeatable migrations across environments.
- Positive: Repository-backed services can orchestrate transactional writes for nested aggregates.
- Negative: Maintaining both raw SQL migrations and TypeORM migrations requires diligence to keep them in sync.
