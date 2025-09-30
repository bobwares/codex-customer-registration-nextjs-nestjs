# Database Resources

The `db` directory defines PostgreSQL artifacts used by the Customer Registration API during local development and automated testing. Artifacts are written as forward-only migrations and idempotent seed scripts so the environment can be recreated reliably.

## Migrations

1. Ensure Docker or a PostgreSQL 16 instance is available and the connection details in `ai/context/.env` are correct.
2. Apply migrations in order:
   - `01_customer_domain.sql` – creates the `customer_domain` schema, normalized tables, foreign keys, and indexes required by the customer registration domain.
3. Smoke test the schema after applying migrations:
   ```sql
   -- Connect with psql or your SQL client
   SET search_path TO customer_domain, public;
   SELECT COUNT(*) FROM customer;
   ```

## Test Data

The seed script `db/test/customer_domain_test_data.sql` inserts ten realistic customer records (with addresses, privacy settings, emails, and phone numbers). The script can be executed repeatedly without creating duplicates and resets sequences to the latest values. After running the script, execute the smoke test at the end of the file to verify at least ten active customers exist.
