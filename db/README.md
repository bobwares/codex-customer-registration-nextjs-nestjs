# Customer Registration Database

## Overview
The database layer for the Customer Registration service is provisioned with PostgreSQL 16. The schema captures customer identity,
contact details, postal addresses, and privacy preferences while normalizing arrays and nested documents from the domain JSON
schema. Artifacts live within the `customer_domain` schema to decouple them from the public namespace.

## Directory Layout
- `migrations/` – Forward-only DDL scripts for creating and evolving the customer domain schema.
- `test/` – Idempotent data sets that seed development and QA environments for exploratory testing.

## Migrations
1. Ensure a PostgreSQL 16 instance is running and accessible (for local development `docker run -p 5432:5432 postgres:16` or the
   project docker-compose once available).
2. Apply the baseline migration:
   ```bash
   psql "$DATABASE_URL" -f db/migrations/01_customer_domain.sql
   ```
3. Validate the deployment by executing the embedded smoke tests:
   ```sql
   SELECT COUNT(*) FROM customer_domain.customer;
   SELECT COUNT(*) FROM customer_domain.customer_profile_view;
   ```
4. (Optional) Backfill sample data for manual testing using the test script below once the migration succeeds.

## Test Data
1. Confirm the baseline migration has been applied.
2. Seed representative customers:
   ```bash
   psql "$DATABASE_URL" -f db/test/customer_domain_test_data.sql
   ```
3. Verify at least ten customers are present:
   ```sql
   SELECT COUNT(*) FROM customer_domain.customer;
   ```
4. Re-run the seed script at any time; each statement uses `ON CONFLICT DO NOTHING` to remain idempotent.

## Operational Notes
- All scripts assume `search_path` is set to `customer_domain, public` and do not create roles or databases.
- Update metadata headers (version, date, and turn) whenever scripts change to align with governance requirements.
