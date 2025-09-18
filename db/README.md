# Database Assets

The `db` directory provides PostgreSQL DDL and sample data for the Customer Registration service.

## Prerequisites

- PostgreSQL 16 or compatible
- psql client

## Migrations

1. Apply the normalized Customer domain tables:
   ```bash
   psql "$DATABASE_URL" -f migrations/01_customer_domain.sql
   ```
2. Verify the structure using the smoke queries embedded at the bottom of the migration script.

## Test Data

Load the curated dataset after running the migrations:

```bash
psql "$DATABASE_URL" -f test/01_customer_domain_test_data.sql
```

The statements insert a sample customer with associated emails, phone numbers, address, and privacy preferences to support integration and UI testing. Records are idempotent and may be re-applied safely.
