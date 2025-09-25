# ADR 1: Adopt NestJS 11 Skeleton with Health Checks

**Status**: Accepted  
**Date**: 2025-09-25

## Context
The project requires a backend foundation compatible with NestJS 11 and needs immediate health
instrumentation for service monitoring.

## Decision
Use the prescribed NestJS 11 scaffold with ESLint, Prettier, Jest, and establish a dedicated health
module exposing `/health`, `/health/live`, and `/health/ready` endpoints.

## Consequences
- Provides consistent developer tooling and testing defaults from the outset.
- Health probes allow container orchestration readiness checks.
- Future modules can reuse the established project structure without rework.
