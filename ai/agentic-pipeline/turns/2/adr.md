# ADR 2: Define Customer Domain Database Schema and Seed Data

**Status**: Accepted

**Date**: 2025-09-24

**Context**
Customer onboarding workflows require a normalized PostgreSQL schema and representative seed data derived from the persisted data JSON specification.

**Decision**
Transform the customer domain schema into a PostgreSQL migration under `db/migrations/01_customer_domain.sql`, generate the synchronized Draft 2020-12 entity specifications, and deliver an idempotent seed script populating ten realistic customer records.

**Consequences**
- Establishes a reproducible database baseline aligned with the JSON schema contract.
- Enables local development and automated testing via deterministic seed data.
- Provides structured metadata for future tooling and validation through the generated entity spec.
