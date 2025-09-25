# ADR 1: NestJS API Scaffold and Health Module Setup

**Status**: Accepted

**Date**: 2025-09-25

**Context**
We needed to initialize the backend API for the Customer Registration project following the full-stack Next.js + NestJS pattern. The turn required scaffolding a NestJS 11 application with prescribed configuration files, implementing health check endpoints, and ensuring linting/testing workflows worked with ESLint v9 while honoring metadata header governance.

**Decision**
- Created the API project under `/api` with the exact package scripts and TypeScript configuration specified in the task instructions.
- Added a compatibility `eslint.config.js` bridge plus a dedicated `tsconfig.eslint.json` so ESLint v9 could consume the provided `.eslintrc.js` configuration and lint both source and test files.
- Implemented the health module, controller, Jest unit tests, Jest E2E tests, and REST Client `.http` probes with mandated metadata headers.

**Consequences**
- The backend skeleton can be built, linted, and tested via npm scripts out-of-the-box, enabling future domain development.
- Maintaining the compatibility bridge requires keeping `.eslintrc.js`, `eslint.config.js`, and `tsconfig.eslint.json` in sync when linting rules evolve.
- Health monitoring endpoints provide immediate operability checks for downstream infrastructure and manual validation tooling.
