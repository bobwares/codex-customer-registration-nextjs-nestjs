# ADR 2: Normalize Customer Domain Schema in PostgreSQL

**Status**: Accepted  
**Date**: 2025-09-25

## Context
Customer data includes nested objects and arrays that must be persisted with referential integrity
and efficient query paths.

## Decision
Model the domain using a dedicated `customer_domain` schema with normalized tables for customers,
addresses, privacy settings, emails, and phone numbers. Provide matching JSON schema metadata and
idempotent seed data for local testing.

## Consequences
- Relational design enforces primary/foreign key constraints aligning with the JSON contract.
- Seed data accelerates manual QA and integration testing.
- Dedicated schema keeps customer tables isolated from future bounded contexts.
