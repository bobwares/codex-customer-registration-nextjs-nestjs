# ADR 3: Unified TypeORM Configuration and Customer Entities

**Status**: Accepted

**Date**: 2025-09-24

## Context
The backend required a single source of truth for database connectivity, scriptable migration flows, and entity mappings consistent with the previously defined customer domain schema.

## Decision
- Centralized TypeORM configuration within `data-source.ts`, sourcing environment variables from `ai/context/.env` and failing fast when required values are missing.
- Added validation tooling and npm scripts to streamline migration management in both TypeScript and compiled JavaScript contexts.
- Generated TypeORM entity classes for all customer domain tables, including indexes, uniqueness constraints, and bidirectional relations.
- Documented operational steps in `api/README.md` for developers and CI pipelines.

## Consequences
- Application startup and CLI tooling reuse the same configuration, reducing drift between environments.
- Entities mirror the canonical schema, enabling repository and service layers to rely on strict typings.
- Environments must maintain `ai/context/.env`; missing variables will surface immediately during bootstrap or validation.
