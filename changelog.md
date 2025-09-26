# Project Changelog

## 0.1.0 – 2025-09-26

### Turn 1
- Initialized the NestJS API project with linting, formatting, and testing configuration.
- Added health module, controller, and accompanying unit/e2e tests plus REST client script.

### Turn 2
- Authored the `customer_domain` PostgreSQL migration and generated the aligned JSON entity schema.
- Documented migration execution steps in `db/README.md`.

### Turn 3
- Created idempotent SQL seed data for the customer domain and documented load instructions.

### Turn 4
- Delivered full customer CRUD module with DTOs, TypeORM entities, service, controller, and Swagger documentation.
- Added structured logging, request context propagation, and global validation/error handling with Problem Details responses.
- Produced OpenAPI emission tooling, customer e2e/.http tests, and updated project documentation.
