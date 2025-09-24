# Database Assets

## Migrations

- `db/migrations/01_customer_domain.sql` — Creates the `customer_domain` schema with customer, address, privacy, email, and phone number tables. Run with `psql -f db/migrations/01_customer_domain.sql` against a PostgreSQL 16 instance. Smoke test: `SELECT COUNT(*) FROM customer_domain.customer;`.
- `db/test/customer_domain_test_data.sql` — Seeds ten representative customers with associated addresses, privacy settings, emails, and phone numbers. Execute after migrations to prime development data. Smoke test: `SELECT COUNT(*) FROM customer_domain.customer_email;`.
