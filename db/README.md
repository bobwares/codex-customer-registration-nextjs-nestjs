<!--
App: Customer Registration
Package: db
File: README.md
Version: 0.1.0
Turns: 2-3
Author: Codex Agent
Date: 2025-09-25T06:25:09Z
Description: Database operations guide for migrations and test data.
-->
# Database Operations

The `db` directory contains PostgreSQL artifacts that support the Customer Registration API.

## Prerequisites

- Docker and Docker Compose for running PostgreSQL locally.
- `psql` client for applying migrations manually if desired.

## Migrations

1. Start the database:
   ```bash
   docker compose -f db/docker-compose.yml up -d
   ```
2. Apply migrations from the API package:
   ```bash
   cd api
   npm install
   npm run build
   npm run typeorm:migration:run:js
   ```
3. Run the connection smoke test:
   ```bash
   npm run db:validate
   ```

The canonical SQL DDL lives in [`migrations/01_customer_domain.sql`](./migrations/01_customer_domain.sql).

## Test Data

A reusable seed script is provided at [`test/customer_domain_test_data.sql`](./test/customer_domain_test_data.sql).

Apply it with:

```bash
psql postgresql://postgres:postgres@localhost:5432/customer_registration \
  --file=db/test/customer_domain_test_data.sql
```

Each INSERT statement is idempotent and may be executed multiple times.

## Schema Specifications

The JSON representation of the relational schema resides in
[`../ai/context/schemas/customer_domain-entities.json`](../ai/context/schemas/customer_domain-entities.json).
