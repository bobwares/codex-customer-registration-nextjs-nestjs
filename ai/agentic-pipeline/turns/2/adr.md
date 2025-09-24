# ADR 2: Customer Domain Persistence Model

**Status**: Accepted

**Date**: 2025-09-24

## Context
We needed to translate the Customer persisted data schema into a normalized PostgreSQL design, provide JSON entity metadata for downstream tooling, and supply deterministic seed data for development environments.

## Decision
- Established a dedicated `customer_domain` schema with relational tables representing addresses, privacy settings, customers, emails, and phone numbers.
- Captured relational metadata in a Draft 2020-12 JSON schema to ensure consistency between SQL migrations and code generation tasks.
- Seeded ten representative customers spanning related tables using idempotent inserts for repeatable environment setup.

## Consequences
- Database migrations and seeds can be executed deterministically in local and CI environments.
- Downstream code generation has a canonical entity specification aligned with the SQL DDL.
- Future changes must add new forward-only migrations; existing scripts remain immutable to preserve history.
