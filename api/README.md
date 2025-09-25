# Customer Registration API

## Database and Migrations

1. Start the PostgreSQL instance:
   ```bash
   docker compose -f ../db/docker-compose.yml up -d
   ```
2. Validate connectivity and credentials:
   ```bash
   npm run db:validate
   ```
3. Generate a new migration from entity changes:
   ```bash
   npm run typeorm:migration:generate -- src/migrations/<Name>
   ```
4. Build the project and apply compiled migrations (CI / production):
   ```bash
   npm run build
   npm run typeorm:migration:run:js
   ```
5. Revert the latest compiled migration if required:
   ```bash
   npm run typeorm:migration:revert:js
   ```

## Customer API

The Customer API exposes CRUD operations for onboarding records via `/customers`.

### Endpoints

| Method | Path                  | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/customers`          | List customers (optional `ids` query parameter). |
| GET    | `/customers/{id}`     | Fetch a single customer by UUID. |
| POST   | `/customers`          | Create a customer profile.     |
| PUT    | `/customers/{id}`     | Update an existing customer.   |
| DELETE | `/customers/{id}`     | Remove a customer record.      |

Requests and responses are validated using DTOs derived from the domain schema. Error responses follow a Problem Details shape containing `statusCode`, `error`, `message`, `path`, `timestamp`, and `requestId` fields.

### API Documentation

Swagger UI is available at [`/api/docs`](http://localhost:3000/api/docs). The machine-readable OpenAPI specification is exposed at [`/api/openapi.json`](http://localhost:3000/api/openapi.json).

To regenerate the specification artifact locally, run:

```bash
npm run openapi:emit
```

The command writes the generated document to `api/openapi/openapi.json`.
