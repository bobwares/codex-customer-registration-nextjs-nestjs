<!--
App: Customer Registration
Package: db
File: README.md
Version: 0.1.0
Turns: 1
Author: AI Agent
Date: 2025-09-19T23:14:05Z
Description: Documentation for database migrations, entity specifications, and seed data assets.
-->
# Database Operations

This directory contains PostgreSQL 16 assets that define and seed the Customer Registration persistence layer.

## Migrations

| File | Description |
| --- | --- |
| `migrations/01_customer_domain.sql` | Creates the normalized customer domain schema, tables, constraints, indexes, and a flattened view. |

### Applying migrations locally

1. Export a PostgreSQL connection string (for example, `export DATABASE_URL=postgres://postgres:postgres@localhost:5432/customer_db`).
2. Execute the migration with `psql "$DATABASE_URL" -f db/migrations/01_customer_domain.sql` from the project root.
3. Verify the schema using `psql "$DATABASE_URL" -c "\dn"` and check the new tables with `\dt customer_domain.*`.

## Entity Specifications

| File | Description |
| --- | --- |
| `entity-specs/customer_domain-entities.json` | Draft 2020-12 JSON Schema describing the relational entities and constraints created by the migration. |

## Test Data

| File | Description |
| --- | --- |
| `test/customer_domain_test_data.sql` | Idempotent seed script that loads ten example customer records with related emails, phone numbers, addresses, and privacy settings. |

### Loading test data

1. Ensure the migration has been applied.
2. Run `psql "$DATABASE_URL" -f db/test/customer_domain_test_data.sql`.
3. Confirm row counts with `psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM customer_domain.customer;"`.

## Smoke Tests

After running the migration and seed scripts, execute the commented smoke-test queries contained within each SQL file to validate the dataset.
