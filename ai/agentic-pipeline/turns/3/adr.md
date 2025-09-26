# ADR 3: Provide Customer Domain Seed Data

**Status**: Accepted

**Date**: 2025-09-26

## Context
Developers and automated tests require realistic sample records to validate the customer domain schema without depending on production data.

## Decision
Create an idempotent SQL seed script that populates the `customer_domain` schema with ten customers, associated addresses, privacy settings, emails, and phone numbers. Ensure the script can run repeatedly without duplication by leveraging `ON CONFLICT DO NOTHING` semantics.

## Consequences
- Positive: Local and CI environments can quickly load representative data for integration testing.
- Positive: Seed script reinforces referential integrity assumptions across tables.
- Negative: The script relies on deterministic primary key values, requiring maintenance if migration defaults change.
