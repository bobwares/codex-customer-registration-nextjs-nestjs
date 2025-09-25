# ADR 2: Customer Domain Migration and Seeding Strategy

**Status**: Accepted

**Date**: 2025-09-25

**Context**
Turn 2 required materializing the customer persisted-data schema for PostgreSQL, producing a canonical JSON description of the
resulting entities, and preparing deterministic seed data for local development. Governance mandates metadata headers, forward-
only migrations, normalized table design, and traceability between SQL and JSON representations.

**Decision**
- Established a `customer_domain` schema with normalized tables for addresses, privacy settings, customers, emails, and phone
  numbers, plus indexes and a flattened reporting view to simplify read models.
- Treated the SQL migration as the source of truth and generated a Draft 2020-12 JSON schema (`ai/context/schemas/customer_domain-
  entities.json`) that captures primary keys, foreign keys, uniques, and indexes for tooling reuse.
- Authored an idempotent seed script that inserts ten well-known customer personas and supporting reference data while documenting
  execution steps inside `db/README.md`.

**Consequences**
- ✅ Database consumers gain a repeatable migration/seed path and a machine-readable contract for ORM configuration.
- ⚠️ Future changes must update both the migration history and the derived JSON schema to avoid drift.
- 🔜 Subsequent turns should introduce automation (Makefile or Docker Compose) to run migrations and seeds inside CI/CD pipelines.
