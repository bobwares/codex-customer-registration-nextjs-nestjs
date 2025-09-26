# ADR 4: Customer Domain CRUD with Structured Observability

**Status**: Accepted

**Date**: 2025-09-26

## Context
Turn 4 requires delivering end-to-end customer CRUD APIs backed by TypeORM, instrumented with structured logging, and safeguarded by consistent validation and error handling. The solution must also expose comprehensive OpenAPI documentation consumable by other teams and automation.

## Decision
Implement a dedicated `CustomerModule` that wires new TypeORM entities, DTOs, service, and controller to satisfy the domain schema. Introduce a request-scoped context, middleware-provided request IDs, and a JSON logger plus logging interceptor to capture structured telemetry. Register a global validation pipe and HTTP exception filter returning RFC 7807 Problem Details responses. Centralize Swagger configuration and add an emission script that writes `openapi/openapi.json` for downstream tooling.

## Consequences
- Positive: CRUD endpoints, logging, and validation are standardized, improving operability and reliability across environments.
- Positive: Generated OpenAPI documentation and `.http` smoke tests streamline integration and manual verification.
- Negative: Additional providers increase application bootstrap time slightly and require environment variables for database connectivity.
