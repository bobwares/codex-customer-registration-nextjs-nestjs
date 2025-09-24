# Customer Registration API

## Database Operations
1. Start PostgreSQL: `docker compose -f ../db/docker-compose.yml up -d`
2. Validate connection: `npm run db:validate`
3. Generate a migration: `npm run typeorm:migration:generate`
4. Apply migrations in development: `npm run typeorm:migration:run`
5. Build and apply migrations for CI/production: `npm run build && npm run typeorm:migration:run:js`

## Customer API
- `GET /customers` – list all customers.
- `GET /customers/{id}` – retrieve a customer by identifier.
- `POST /customers` – create a customer aggregate including address, privacy, emails, and phone numbers.
- `PUT /customers/{id}` – update mutable fields for an existing customer.
- `DELETE /customers/{id}` – remove a customer and associated records.
