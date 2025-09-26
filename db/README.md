<!--
App: Customer Registration
Package: db
File: README.md
Version: 0.1.0
Turns: 2-3
Author: Codex Agent
Date: 2025-09-26T02:55:41Z
Description: Documents database migrations and seed data workflows for the customer domain.
-->

# Customer Registration Database

## Migrations

| Migration | Description | Apply Command |
| --- | --- | --- |
| `db/migrations/01_customer_domain.sql` | Creates the `customer_domain` schema with customer, address, privacy, email, and phone tables plus supporting indexes. | `psql $DATABASE_URL -f db/migrations/01_customer_domain.sql` |

After applying the migration, verify connectivity:

```sql
SET search_path TO customer_domain, public;
\dt
```

## Test Data

| Script | Description | Load Command |
| --- | --- | --- |
| `db/test/customer_domain_test_data.sql` | Seeds ten example customers, addresses, emails, and phone numbers for local development. | `psql $DATABASE_URL -f db/test/customer_domain_test_data.sql` |

Run the smoke test appended to each script to confirm row counts meet expectations.
