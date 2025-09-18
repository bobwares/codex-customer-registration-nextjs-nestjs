# Codex Agentic Pipeline Project Context

## Repository
- **Name**: codex-customer-registration-nextjs-nestjs
- **Location**: /workspace/codex-customer-registration-nextjs-nestjs
- **Primary Maintainer**: Bobwares CodeBot

## Application Pattern
- **Pattern ID**: full-stack-app-nextjs-nestjs
- **Pattern Source**: /workspace/codex-agentic-ai-pipeline/agentic-pipeline/patterns/full-stack-app-nextjs-nestjs
- **Front-end**: Next.js 14 with Tailwind CSS and Jest
- **Back-end**: NestJS 10 with TypeORM, PostgreSQL, and Jest testing
- **Database**: PostgreSQL migrations, seed data, and Docker Compose helpers under `db/`

## Domain Context
- **Primary Domain Object**: Customer
- **Shared Schema**: `schemas/customer.schema.json`
- **API Contract**: Request and response bodies align with the shared schema
- **Persisted Data**: PostgreSQL database bootstrapped via `db/migrations/01_customer_domain.sql`

## Workspace Layout
| Path | Purpose |
| ---- | ------- |
| `api/` | NestJS service exposing customer registration endpoints |
| `ui/` | Next.js web client implementing the registration form |
| `db/` | Database migrations, seed data, and local Docker Compose setup |
| `schemas/` | JSON schema definitions shared between API and UI |
| `ai/` | Agentic pipeline context, logs, and turn artifacts |

## Tooling & Scripts
- **API**
  - Install dependencies: `cd api && npm install`
  - Lint: `npm run lint`
  - Unit tests: `npm test -- --runInBand`
  - E2E tests: `npm run test:e2e`
- **UI**
  - Install dependencies: `cd ui && npm install`
  - Lint: `npm run lint`
  - Unit tests: `npm test`
- **Database**
  - Start PostgreSQL locally: `cd db && docker compose up -d`
  - Apply migrations/seeds manually via psql or migration tooling

## Agentic Requirements
- Each turn must create `manifest.json`, `changelog.md`, `adr.md`, and `session_context_values.md` under `ai/agentic-pipeline/turns/<turnId>/`.
- Maintain `ai/agentic-pipeline/turns/index.csv` as an append-only registry of turns.
- Update `version.md`, `changelog.md`, and `reasoning.md` in the repository root per turn.
- Ensure metadata headers at the top of every source, test, and infrastructure file using the provided template.

## Testing Expectations
- Run API linting, unit tests, and e2e suites before completing a turn.
- Run UI linting and unit tests; capture and address React `act(...)` warnings when possible.
- Document any skipped tests or known issues inside the turn changelog.

## Documentation Deliverables
- Root `README.md` must describe architecture, setup, and troubleshooting guidance.
- Maintain project history in `changelog.md` and `version.md` using semantic versioning.
- ADRs capturing significant architectural choices should live under `adr/` with date-based filenames if required.

## Turn Management
- Current turn ID: 1
- Session context values should include timestamps, pattern references, executed tools, and outstanding work for follow-up turns.
