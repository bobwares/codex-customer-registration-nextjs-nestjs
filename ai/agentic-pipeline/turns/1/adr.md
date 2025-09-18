# ADR 20250918_001_select-typeorm-and-nextjs

**Status**: Accepted

**Date**: 2025-09-18

**Context**
The project required a full-stack implementation for the customer registration domain with REST APIs, PostgreSQL persistence, and a React-based front-end.

**Decision**
Adopt NestJS with TypeORM for the backend to leverage decorators, modular structure, and strong integration with PostgreSQL. Use Next.js 14 with SWR for the UI to provide server-aware data fetching and a rapid developer experience.

**Consequences**
- Positive: Consistent TypeScript stack across front-end and back-end; TypeORM simplifies mapping to the normalized schema; SWR offers cached data fetching.
- Negative: TypeORM migrations must be managed carefully to stay aligned with raw SQL; Next.js requires Node.js tooling familiarity.
