# ADR 1: Establish NestJS API Foundation with Health Checks

**Status**: Accepted

**Date**: 2025-09-26

## Context
Turn 1 required initializing the backend service using the prescribed NestJS 11 stack and delivering operational health endpoints to validate runtime readiness.

## Decision
Create a clean NestJS project scaffold with the specified dependencies, apply organization-wide metadata headers, and implement a dedicated `HealthModule` with controller actions for `/health`, `/health/live`, and `/health/ready`. Provide automated (Jest) and manual (.http) verification assets.

## Consequences
- Positive: The project now has a reproducible scaffolding with linting, formatting, unit, and e2e testing in place, enabling further feature work.
- Positive: Health endpoints expose service metadata required for platform monitoring integrations.
- Negative: Additional startup time is needed to install dependencies before exercising the tests locally.
