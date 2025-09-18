# Database

The `db` workspace provisions PostgreSQL artifacts for the Customer Registration platform.

## Migrations

1. Start PostgreSQL using Docker Compose from the project root:
   ```bash
   docker compose -f db/docker-compose.yml up -d
   ```
2. Apply the customer domain schema:
   ```bash
   psql "$DATABASE_URL" -f db/migrations/01_customer_domain.sql
   ```
3. Seed deterministic test data:
   ```bash
   psql "$DATABASE_URL" -f db/test/01_customer_domain_test_data.sql
   ```

Smoke test:
```sql
SELECT COUNT(*) FROM customer_domain.customer;
```

## Entity Specifications

The canonical JSON Schema derived from the SQL DDL lives in `db/entity-specs/customer_domain-entities.json`. It powers API and UI model generation tasks.

## Environment

Copy `.env.example` to `.env` and adjust credentials before starting Docker Compose.
