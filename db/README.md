# Database Operations

## Migrations
- `01_customer_domain.sql`: Creates the `customer_domain` schema with normalized customer, address, email, phone, and privacy tables derived from the persisted data specification. Run with `psql -f db/migrations/01_customer_domain.sql` after exporting required environment variables.

## Test Data
- `customer_domain_test_data.sql`: Seeds ten representative customer profiles, related addresses, privacy settings, emails, and phone numbers. Apply with `psql -f db/test/customer_domain_test_data.sql` after the base migration executes.
