# ADR 4: Customer CRUD API Implementation

**Status**: Accepted

**Date**: 2025-09-24

## Context
The project required fully functional REST endpoints for customer CRUD operations that align with the normalized database schema and domain JSON specification.

## Decision
- Modeled create and update payloads using DTOs that mirror the domain schema, including nested address, privacy settings, email, and phone collections.
- Implemented a TypeORM-backed service that orchestrates persistence across related tables without relying on cascading side effects, ensuring explicit control over inserts and deletes.
- Exposed the service through a NestJS controller and module, complemented by REST Client assets and Jest unit/e2e-style tests to validate interactions.

## Consequences
- API consumers can manage customer aggregates through documented endpoints backed by database persistence.
- The service encapsulates relation management, enabling future enhancements (e.g., transactions) without breaking controller contracts.
- Additional infrastructure (PostgreSQL) remains necessary to run integration tests end-to-end.
