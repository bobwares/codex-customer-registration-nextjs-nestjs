<!--
App: Customer Registration
Package: documentation
File: README.md
Version: 0.1.0
Turns: [1]
Author: ChatGPT
Date: 2025-09-18T16:44:28Z
Description: Project overview and setup instructions for the Customer Registration full-stack application.
-->
# Customer Registration Platform

The Customer Registration platform is a full-stack TypeScript solution that enables teams to onboard customers securely.
It combines a Next.js front-end for data capture, a NestJS API for validation and persistence, and PostgreSQL for relational storage.
Shared JSON Schemas and migrations keep the platform consistent across services.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `ui/` | Next.js 14 application for customer onboarding workflows |
| `api/` | NestJS 10 REST API exposing CRUD endpoints for customer data |
| `db/` | PostgreSQL migrations and seed data |
| `schemas/` | JSON schemas shared between UI and API |
| `ai/` | Agentic pipeline context, logs, and automation artifacts |

## Prerequisites

- Node.js 20+
- npm 9+
- PostgreSQL 14+

## Quick Start

1. **Install dependencies**
   ```bash
   cd ui && npm install
   cd ../api && npm install
   ```

2. **Start the database** (example using Docker)
   ```bash
   docker run --name customer-registration-postgres \
     -e POSTGRES_DB=customer_registration \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 -d postgres:14
   ```

3. **Apply migrations and seed data**
   ```bash
   psql postgresql://postgres:postgres@localhost:5432/customer_registration \
     -f db/migrations/001_create_customer_table.sql
   psql postgresql://postgres:postgres@localhost:5432/customer_registration \
     -f db/seed/seed_customers.sql
   ```

4. **Run the API**
   ```bash
   cd api
   npm run start:dev
   ```

5. **Run the UI**
   ```bash
   cd ui
   npm run dev
   ```

The UI expects the API to be reachable at `http://localhost:3001`. Override the endpoint by setting `NEXT_PUBLIC_API_URL`.

## Testing

- `cd api && npm test`
- `cd ui && npm test`

## Environment Variables

The following variables configure the API:

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `3001` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `customer_registration` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |

The UI uses `NEXT_PUBLIC_API_URL` to configure the API endpoint.
