# Normalize CustomerProfile Schema into Relational Tables

**Status**: Accepted

**Date**: 2025-09-27

**Context**
The CustomerProfile JSON schema describes nested objects and arrays (emails, phone numbers, address, privacy settings). We need a
 TypeORM migration and entities that faithfully represent the schema while enabling relational integrity and query performance.

**Decision**
- Represent the root profile data in `customer_profiles` with boolean columns for privacy settings.
- Normalize emails, phone numbers, and addresses into dedicated tables with cascaded foreign keys rather than storing them as JSONB blobs.
- Create a dedicated Postgres enum (`customer_profile_phone_numbers_type_enum`) to encode the phone number type domain.
- Generate TypeORM entity classes mirroring the migration to support future repository/service work.

**Consequences**
- Structured tables enforce uniqueness, required fields, and relational integrity consistent with the schema.
- Additional joins are required to hydrate full profiles, but indexes mitigate query costs.
- Future migrations must maintain the enum and relational structure; schema evolution is additive and reversible via `down()`.
