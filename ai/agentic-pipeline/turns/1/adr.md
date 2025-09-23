# ADR 1: Initialize NestJS Backend Scaffold

**Status**: Accepted

**Date**: 2025-09-23

**Context**
Turn 1 requires initializing the backend service for the Customer Registration project using a NestJS 11 skeleton. The provided task mandated exact configuration files (package.json, tsconfig.json, nest-cli.json, ESLint, and .gitignore) while governance rules enforce metadata headers and working build/test automation. ESLint v9 expects flat config files, but the mandated `.eslintrc.js` uses the legacy format. Running Jest without test files also fails, so additional scaffolding is needed to satisfy acceptance criteria.

**Decision**
- Create the prescribed backend directory structure (`backend`) with the exact configuration files and metadata headers.
- Add `eslint.config.js` that reproduces the legacy `.eslintrc.js` settings in flat-config form so `npm run lint` succeeds under ESLint v9.
- Include `eslint-plugin-import` as a dev dependency to back the required import linting rules.
- Provide a placeholder Jest test (`test/app.spec.js`) to keep the test suite passing until domain logic arrives.
- Capture npm command logs under `ai/agentic-pipeline/turns/1/logs` for traceability.

**Consequences**
- The backend now builds, lints, and tests successfully with the mandated tooling versions, ensuring future turns can extend functionality without reworking the pipeline basics.
- Adding the flat-config bridge keeps the legacy ESLint configuration intact while complying with the governance header rules.
- The placeholder test maintains CI stability but should be replaced with meaningful tests as features are implemented.
