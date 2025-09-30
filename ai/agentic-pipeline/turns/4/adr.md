# ADR 4: Problem Detail Error Handling and Documentation Strategy

**Status**: Accepted

**Date**: 2025-09-30

## Context
Customer CRUD endpoints require consistent validation and error responses while exposing an OpenAPI specification consumable by other services. The API must provide useful metadata without a live database connection, ensuring both documentation generation and automated tests operate against predictable contracts.

## Decision
Introduce a global `HttpExceptionFilter` that emits Problem Details envelopes and register a strict `ValidationPipe` with whitelist, transformation, and explicit 422 status codes. Boot the Swagger module during application startup and via a dedicated `emit-openapi.ts` script that wires stubbed services to avoid database dependencies. Document DTOs and error shapes with Swagger decorators so generated specs remain accurate.

## Consequences
- Positive: Every endpoint now returns a consistent error structure, simplifying front-end consumption and automated testing.
- Positive: OpenAPI JSON/YAML artifacts can be generated without the real database, enabling CI documentation publishing.
- Negative: The stubbed service used for documentation must stay aligned with the production implementation to avoid divergent schemas.
