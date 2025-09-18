# Customer Registration API

NestJS-based service that exposes CRUD APIs for managing customer registration profiles.

## Getting Started

```bash
cd api
npm install
npm run build
npm run start:dev
```

## Environment

Provide a `.env` file with the following variables:

```
DATABASE_URL=postgres://postgres:password@localhost:5432/customer_db
APP_PORT=3001
```

## Customers API

| Method | Path              | Description            |
| ------ | ----------------- | ---------------------- |
| GET    | `/customers`      | List customers         |
| GET    | `/customers/:id`  | Retrieve by identifier |
| POST   | `/customers`      | Create a new customer  |
| PUT    | `/customers/:id`  | Update an existing     |
| DELETE | `/customers/:id`  | Remove a customer      |

## Database

Run migrations and seeds from the repository root:

```bash
psql "$DATABASE_URL" -f ../db/migrations/01_customer_domain.sql
psql "$DATABASE_URL" -f ../db/test/01_customer_domain_test_data.sql
```

## Testing

```bash
npm test
npm run test:e2e
```
