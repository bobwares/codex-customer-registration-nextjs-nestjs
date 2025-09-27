# ADR 1: NestJS API Scaffold with Structured Logging and Health Checks

**Status**: Accepted

**Date**: 2025-09-27

**Context**
The project required a baseline NestJS API aligned with the full-stack Next.js/NestJS pattern. Early tasks mandated configuration validation, health monitoring, structured logging with request correlation, and supporting developer tooling.

**Decision**
Adopt the provided NestJS 11 skeleton with Joi-backed configuration validation, build out the health check module, and implement logging via a custom `JsonLogger`, `RequestIdMiddleware`, and `LoggingInterceptor` that emit JSON-formatted entries enriched with request identifiers and latency metrics. Tests ensure the infrastructure functions and remains regression-proof.

**Consequences**
- Positive: Provides a production-ready foundation with validated configuration, observability, and health endpoints; developers can rely on consistent JSON logs.
- Negative: Custom logging implementation increases maintenance responsibility compared to off-the-shelf loggers.
- Follow-up: Extend logging coverage when new modules are added and integrate persistence/database layers in subsequent turns.
