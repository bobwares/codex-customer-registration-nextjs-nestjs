# ADR 2: Customer Domain Migration and Seed Strategy

**Status**: Accepted  
**Date**: 2025-09-30

## Context
The API requires a persistent representation of the customer registration domain before API development can continue. We must transform the JSON domain schema into SQL, capture relational metadata, and provide deterministic seed data for developers and CI.

## Decision
Normalize the JSON schema into a dedicated PostgreSQL schema (`customer_domain`) with explicit tables for addresses, privacy preferences, emails, and phone numbers. Store the DDL as a forward-only migration in `db/migrations/01_customer_domain.sql`, emit an accompanying Draft 2020-12 entity schema, and provide an idempotent seed script under `db/test/customer_domain_test_data.sql`.

## Consequences
- Positive: The database can be provisioned repeatably with realistic data, and downstream tooling can rely on the generated JSON entity definitions.
- Positive: Isolation via the `customer_domain` schema avoids naming collisions with future modules.
- Negative: Explicit IDs in seed scripts require sequence synchronization statements to remain idempotent.
