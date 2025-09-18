# ADR 1: SQLite-Compatible Customer Persistence for Tests

**Status**: Accepted

**Date**: 2025-09-18

**Context**
End-to-end tests run against an in-memory SQLite database while production uses PostgreSQL. The initial entity mappings used PostgreSQL-specific column types and relied on cascading relation persistence that SQLite handled inconsistently, causing failing tests.

**Decision**
Introduce helper constants that switch timestamp and UUID column types based on the detected database dialect, and refactor the `CustomersService` to persist email and phone relations explicitly through the TypeORM entity manager.

**Consequences**
- Positive: Test runs complete successfully without altering the production schema.
- Positive: Deterministic persistence behavior improves maintainability of unit and e2e tests.
- Negative: Service logic is slightly more complex due to explicit relation handling.
- Follow-up: Consider running integration tests against PostgreSQL to confirm parity between environments.
