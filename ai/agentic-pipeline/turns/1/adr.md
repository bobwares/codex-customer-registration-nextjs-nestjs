# ADR 1: Establish NestJS Backend Scaffold and Health Endpoints

**Status**: Accepted

**Date**: 2025-09-24

**Context**
The project required an initial NestJS backend scaffold that aligns with the specified toolchain and introduces foundational observability endpoints for subsequent development.

**Decision**
Adopt the provided NestJS 11 configuration verbatim, implement a dedicated Health module with metadata, liveness, and readiness endpoints, and supply associated unit, E2E, and REST client assets.

**Consequences**
- Provides a runnable backend skeleton with consistent linting, formatting, and test tooling.
- Enables operational monitoring through health endpoints from the outset.
- Establishes testing patterns (unit, e2e, manual .http) that future features can follow.
