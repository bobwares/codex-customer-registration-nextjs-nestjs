# Customer Registration Platform

Full-stack application providing customer onboarding services with a NestJS API, PostgreSQL schema, and Next.js UI.

## Structure

- `api/` – NestJS service exposing CRUD endpoints for customers
- `ui/` – Next.js front-end for managing customers
- `db/` – SQL migrations and test data
- `schemas/` – Shared JSON schema for the customer domain

## Getting Started

1. Install dependencies
   ```bash
   cd api && npm install
   cd ../ui && npm install
   ```
2. Provision the database
   ```bash
   cd ..
   psql "$DATABASE_URL" -f db/migrations/01_customer_domain.sql
   psql "$DATABASE_URL" -f db/test/01_customer_domain_test_data.sql
   ```
3. Run the API
   ```bash
   cd api
   npm run start:dev
   ```
4. Run the UI
   ```bash
   cd ui
   npm run dev
   ```

## Testing

- API: `cd api && npm test && npm run test:e2e`
- UI: `cd ui && npm test`
