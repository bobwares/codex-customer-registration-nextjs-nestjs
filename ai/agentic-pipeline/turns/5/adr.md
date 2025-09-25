# ADR 5: Containerized Local Workflow and Developer Runbook

**Status**: Accepted

**Date**: 2025-09-25

**Context**
Turn 5 required providing a reproducible way to launch PostgreSQL alongside the NestJS API, standardizing developer commands, and documenting the end-to-end workflow without relying on environment variable fallbacks. The project already exposed manual scripts and `.http` probes, but it lacked a cohesive Compose stack, Makefile entry points, or consolidated onboarding documentation. Governance also mandates metadata headers and consistent documentation for tooling updates.

**Decision**
- Added an `infra/docker-compose.yml` plus scoped `.env` file to run Postgres 16 and the API container together, relying on explicit variable declarations with no default fallbacks.
- Introduced an API `Dockerfile` and `.env.local.example` so the Compose stack and local development environments share the same credentials and host conventions.
- Authored a project-level `Makefile` that wraps Compose lifecycle, TypeORM migrations, and npm scripts, giving developers and CI a single entry point for the workflow.
- Rebuilt `api/README.md` to document prerequisites, Quickstart commands, configuration, troubleshooting, and API documentation, and moved REST Client `.http` probes into `api/rest-tests/` with refreshed metadata headers to align with governance.

**Consequences**
- Developers can bootstrap the database and API using `make` commands that delegate to Docker Compose, reducing setup friction and ensuring health checks pass before migrations run.
- The Makefile centralizes operational commands, but future workflow changes require updating both the Makefile and README to prevent drift.
- Relocating the `.http` files under `api/rest-tests/` clarifies their purpose, yet automation referencing the old `api/e2e` path must be updated if introduced later.
