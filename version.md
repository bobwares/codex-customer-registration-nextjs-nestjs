# Version History

### 0.1.0 – 2025-09-18T19:33:35Z (turn 1)
#### Task
Initial project scaffolding based on the full-stack Next.js + NestJS pattern.
#### Changes
- Generated database schema, migrations, and seed fixtures for the customer domain.
- Scaffolded NestJS API with configuration, customer domain modules, and Jest setup.
- Bootstrapped Next.js UI with TailwindCSS, global layout, and basic registration form tests.

### 0.1.1 – 2025-09-18T19:54:05Z (turn 1)
#### Task
Stabilize API linting/tests and improve SQLite compatibility for automated pipelines.
#### Changes
- Reordered imports and added SQLite dev dependency to satisfy lint rules and unit tests.
- Adjusted entity timestamp handling and test bootstrapping for in-memory SQLite.
- Updated Jest e2e harness to load modules dynamically after setting environment variables.

### 0.1.2 – 2025-09-18T20:25:00Z (turn 1)
#### Task
Finalize cross-environment compatibility, expand automated checks, and author project documentation.
#### Changes
- Added shared entity column helpers and refined service logic to persist email/phone relations across SQLite runs.
- Introduced required UI testing dependencies (`ts-node`, `jest-environment-jsdom`) and fetch mocks for form tests.
- Authored root documentation, versioned change logs, and agentic pipeline records for Turn 1.
