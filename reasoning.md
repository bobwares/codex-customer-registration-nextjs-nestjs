# Turn 1 Reasoning Log

## Goals
- Finish SQLite compatibility for automated NestJS e2e tests while preserving PostgreSQL defaults.
- Ensure both API and UI workspaces install, lint, and test cleanly.
- Produce documentation and agentic pipeline artifacts required by the pattern.

## Key Decisions
1. **Shared column helpers for TypeORM** – Created `TIMESTAMP_COLUMN_TYPE` and `UUID_COLUMN_TYPE` constants so entities automatically map to SQLite-friendly types during tests while keeping PostgreSQL types for runtime deployments.
2. **Manual relation persistence in `CustomersService`** – Reworked update logic to delete and recreate email/phone rows via the entity manager to avoid SQLite constraint violations caused by cascading saves with UUID join columns.
3. **UI testing dependencies** – Added `ts-node` and `jest-environment-jsdom` so Jest can parse TypeScript configs and provide a DOM environment, and refactored form tests to mock `fetch` via `globalThis` rather than relying on implicit globals.
4. **Agentic documentation** – Authored changelog, version history, ADR, manifest, and README updates to align with the full-stack pattern requirements.

## Follow-ups
- Consider adding negative-path UI tests (failed submission) and database-backed API integration tests against PostgreSQL.
- Evaluate replacing manual email/phone persistence with repository injections for better test isolation.
