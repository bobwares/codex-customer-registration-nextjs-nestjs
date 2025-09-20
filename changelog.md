# Project Changelog

## 0.1.0 – 2025-09-19

- Established PostgreSQL customer domain schema, view, and indexes (`db/migrations/01_customer_domain.sql`).
- Generated Draft 2020-12 entity specification mirroring the relational model (`db/entity-specs/customer_domain-entities.json`).
- Added idempotent customer seed data for local development and testing (`db/test/customer_domain_test_data.sql`).
- Documented execution guidance for applying migrations and loading seed data (`db/README.md`).
