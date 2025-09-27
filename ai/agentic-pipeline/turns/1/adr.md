# ADR 1: NestJS Backend Initialization with Health Module

**Status**: Accepted

**Date**: 2025-09-27

**Context**
We needed to deliver the initial NestJS 11 backend scaffold, including configuration validation, linting, testing, and a health check module with supporting tests and REST client scripts.

**Decision**
Create a dedicated `api` workspace containing the prescribed NestJS skeleton, adopt Joi-backed configuration validation, configure ESLint via flat config compatibility, and implement health endpoints with supporting unit, e2e, and manual `.http` checks.

**Consequences**
- Provides a runnable backend with linting, formatting, and testing workflows verified by npm scripts.
- Ensures configuration errors surface immediately via Joi validation across app and test environments.
- Requires maintaining the compatibility-based ESLint configuration and environment setup for future modules and tests.
