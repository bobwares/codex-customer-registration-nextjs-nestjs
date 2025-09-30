# ADR 1: Establish API Foundation with Structured Logging

## Status
Accepted

## Context
The project required executing Turn 1 tasks for the NestJS API: initialize the workspace, deliver health monitoring endpoints, provide manual .http verification, and implement structured logging with request correlation. The logging requirement mandated using Nest's built-in Logger, exposing request IDs, latency, and JSON-formatted entries controlled by environment variables.

## Decision
- Scaffolding: Create the `api` workspace with the prescribed project files (package.json, tsconfig, nest-cli, ESLint, Prettier, Jest) and global configuration using `@nestjs/config` and Joi validation.
- Health Module: Implement `HealthController` and `HealthModule` with metadata responses and tests, wiring into `AppModule`.
- Logging: Build logging utilities under `src/common/logging` (AsyncLocalStorage request context, middleware, JSON logger, interceptor). Register middleware and global interceptor via `APP_INTERCEPTOR`. Expose configuration toggles for log level and format.
- Testing: Supply Jest unit and e2e tests plus an `.http` client file to exercise the endpoints. E2E tests dynamically inject environment variables to satisfy configuration validation while validating JSON log entries.

## Consequences
- The API can be built, unit-tested, and executed with validated environment configuration and comprehensive health endpoints.
- Structured logs now include request IDs and latency, enabling downstream observability integration. The logging interceptor depends on AsyncLocalStorage; compatibility with environments lacking async_hooks would require additional guards.
- ESLint requires migration to the new flat configuration format in a future turn; current command fails because ESLint v9 no longer honors `.eslintrc.js` as default.
