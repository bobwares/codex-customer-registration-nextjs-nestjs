# ADR 2: Normalize Customer Domain Schema in PostgreSQL

**Status**: Accepted

**Date**: 2025-09-26

## Context
The persisted data schema for the customer domain must translate the JSON contract into a relational PostgreSQL model suitable for TypeORM integration and downstream reporting.

## Decision
Design a forward-only migration that creates a dedicated `customer_domain` schema with tables for postal addresses, privacy settings, customers, emails, and phone numbers. Include timestamp metadata, foreign key relationships, uniqueness constraints, and supporting indexes. Capture the relational structure in a Draft 2020-12 JSON Schema for tooling alignment.

## Consequences
- Positive: Database structures now align with the domain schema, enabling consistent ORM mapping and validation.
- Positive: JSON Schema output keeps downstream generators synchronized with the relational model.
- Negative: Future schema changes must introduce new migration files to remain forward-only.
