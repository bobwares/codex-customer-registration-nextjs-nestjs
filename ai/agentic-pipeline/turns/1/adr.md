# ADR 1: NestJS API Scaffold with Health Monitoring

**Status**: Accepted

**Date**: 2025-09-24

**Context**
The project required a NestJS backend skeleton aligned with the provided package and tooling definitions while complying with metadata headers and governance rules. We also needed immediate health monitoring endpoints, automated tests, and compatibility with ESLint 9's flat config requirements.

**Decision**
Initialize a dedicated `api` workspace containing the prescribed dependencies, TypeScript configuration, and metadata headers. Implement the health module/controller with accompanying unit, E2E, and REST client tests. Provide a compatibility `eslint.config.js` that reuses the legacy `.eslintrc.js` via `FlatCompat` and a `tsconfig.eslint.json` to lint both source and test files.

**Consequences**
- Positive: The backend builds and runs with full linting, formatting, unit, and E2E coverage, giving immediate observability endpoints. Metadata headers document ownership and change history.
- Positive: The flat ESLint bridge keeps the provided `.eslintrc.js` intact while satisfying ESLint 9 expectations.
- Negative: The configuration introduces extra compatibility files (`eslint.config.js`, `tsconfig.eslint.json`) that must stay in sync with tooling changes.
- Follow-up: Future turns must expand modules within the structured `api` folder and update metadata versioning per governance.
