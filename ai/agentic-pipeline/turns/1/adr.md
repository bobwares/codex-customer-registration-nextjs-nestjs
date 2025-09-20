# ADR 1: Customer Domain Relational Schema and Seed Strategy

**Status**: Accepted

**Date**: 2025-09-19

## Context

The customer JSON schema defines nested structures (addresses, privacy settings, arrays of emails and phone numbers) required by both the NestJS API and Next.js UI. The project lacked a relational schema, migration, or seed data to persist this domain in PostgreSQL 16.

## Decision

Normalize the domain into dedicated tables (`customer`, `postal_address`, `privacy_settings`, `customer_email`, `customer_phone_number`) within a dedicated `customer_domain` schema. Provide supporting triggers, indexes, and a flattened view for read models. Complement the migration with a Draft 2020-12 entity specification and deterministic seed data that can be replayed idempotently.

## Consequences

- **Positive**: Schema adheres to project conventions, supports referential integrity, and enables predictable seed data for local development and automated tests.
- **Positive**: The JSON entity specification keeps the API and database layers aligned and machine-validated.
- **Negative**: Additional maintenance is required to keep the flattened view and seed data synchronized with future schema changes.
- **Negative**: Trigger-based timestamp updates add minor overhead but simplify auditing.
