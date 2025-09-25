# ADR 3: TypeORM Data Source and Customer Persistence Layer

**Status**: Accepted

**Date**: 2025-09-25

**Context**
The API required a single source of truth for TypeORM configuration that could be reused by NestJS, the CLI, and migrations while honoring the project-provided environment variables. The customer domain schema from prior turns also needed concrete TypeORM entities, migrations, and NestJS services to persist and query real customer data instead of stubs.

**Decision**
Use a dedicated `AppDataSource` that loads credentials from `ai/context/.env`, applies the snake-case naming strategy, and exposes build-aware migration globs. Register the same options with `TypeOrmModule.forRoot` so the NestJS runtime and CLI use identical settings. Model the customer, address, email, phone, privacy, and profile view structures as TypeORM entities with a transactional `CustomerService`, wrap them in a `CustomerModule`, and generate an initial migration that creates the schema, tables, indexes, foreign keys, and reporting view.

**Consequences**
- Positive: Configuration drift between the CLI and NestJS runtime is eliminated, and repository-backed CRUD is available immediately for downstream API work.
- Positive: The migration establishes database objects aligned with the domain schema, enabling deterministic builds and CI flows.
- Negative: Additional metadata headers and manual migration maintenance are required as the domain evolves, increasing review overhead.
