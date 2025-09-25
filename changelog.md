# Project Changelog

## 0.1.0 – 2025-09-25T19:10:45Z (Turn 1)
- Established the NestJS API scaffold with linting, testing, and formatting configuration.
- Implemented health module with liveness/readiness endpoints and accompanying unit and E2E tests.
- Added REST Client `.http` scenarios for manual verification.

## 0.2.0 – 2025-09-25T19:45:00Z (Turn 2)
- Added a customer_domain migration that creates normalized tables, foreign keys, indexes, and a flattened reporting view.
- Generated the Draft 2020-12 customer_domain entity schema reflecting the persisted model for integrations.
- Authored idempotent test data seeding script and documented migration workflows in `db/README.md`.
