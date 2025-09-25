# ADR 4: Expose Customer CRUD with TypeORM Services and Swagger

**Status**: Accepted  
**Date**: 2025-09-25

## Context
The API must provide documented CRUD endpoints that persist to PostgreSQL, align with validation
rules, and publish a machine-readable OpenAPI specification.

## Decision
Implement DTO-based validation, a transactional `CustomerService` leveraging TypeORM repositories,
and a `CustomerController` annotated with Swagger decorators. Extend bootstrap logic and CLI tooling
to emit OpenAPI artifacts and include REST client examples.

## Consequences
- Consumers receive fully documented REST endpoints with consistent validation.
- Developers can regenerate specs for distribution and rely on automated tests for regression safety.
- TypeORM services encapsulate persistence complexity behind a clear module boundary.
