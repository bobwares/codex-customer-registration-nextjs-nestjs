# CustomerProfile Migration

- **Source schema**: [`ai/context/schemas/customer.schema.json`](../../ai/context/schemas/customer.schema.json)
- **Generated from commit**: `89bd82f49e77b1dd98de83eea962e51823cb1b0a` (schema baseline prior to this migration)

## Relational Model Overview

| Table | Purpose |
| --- | --- |
| `customer_profiles` | Core customer identity and privacy preferences. |
| `customer_profile_addresses` | Optional postal address for a profile (1:1). |
| `customer_profile_emails` | Email addresses associated with a profile (1:N). |
| `customer_profile_phone_numbers` | Phone numbers with typed categories (1:N). |

## Column Reference

### `customer_profiles`

| Column | Type | Null? | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key. |
| `first_name` | `text` | NO | — | Required by schema. |
| `middle_name` | `text` | YES | — | Optional middle/initial. |
| `last_name` | `text` | NO | — | Required by schema. |
| `marketing_emails_enabled` | `boolean` | NO | — | Mirrors `privacySettings.marketingEmailsEnabled`. |
| `two_factor_enabled` | `boolean` | NO | — | Mirrors `privacySettings.twoFactorEnabled`. |

### `customer_profile_addresses`

| Column | Type | Null? | Default | Notes |
| --- | --- | --- | --- | --- |
| `customer_profile_id` | `uuid` | NO | — | PK & FK to `customer_profiles.id`. |
| `line1` | `text` | NO | — | Required when address present. |
| `line2` | `text` | YES | — | Optional second line. |
| `city` | `text` | NO | — | |
| `state` | `text` | NO | — | |
| `postal_code` | `text` | NO | — | |
| `country` | `varchar(2)` | NO | — | ISO 3166-1 alpha-2. |

### `customer_profile_emails`

| Column | Type | Null? | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigserial` | NO | sequence | Surrogate PK. |
| `customer_profile_id` | `uuid` | NO | — | FK to `customer_profiles.id`. |
| `email` | `varchar(320)` | NO | — | Enforces RFC 5321 max length. |

**Indexes & Constraints**

- `pk_customer_profile_emails` – primary key (`id`).
- `uq_customer_profile_emails__customer_profile_id__email` – enforces per-profile uniqueness and JSON schema `uniqueItems`.
- `ix_customer_profile_emails__customer_profile_id` – speeds lookups by profile.

### `customer_profile_phone_numbers`

| Column | Type | Null? | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigserial` | NO | sequence | Surrogate PK. |
| `customer_profile_id` | `uuid` | NO | — | FK to `customer_profiles.id`. |
| `type` | `customer_profile_phone_numbers_type_enum` | NO | — | Enum: `mobile`, `home`, `work`, `other`. |
| `number` | `varchar(16)` | NO | — | Supports E.164 (max 15 digits + `+`). |

**Indexes & Constraints**

- `pk_customer_profile_phone_numbers` – primary key (`id`).
- `ix_customer_profile_phone_numbers__customer_profile_id` – query by owner profile.

## Enumerations

- `customer_profile_phone_numbers_type_enum` – Postgres enum with values `mobile`, `home`, `work`, `other`.

## Running the Migration

```bash
cd api
npx typeorm migration:run -d src/database/data-source.ts
```

## Reverting the Migration

```bash
cd api
npx typeorm migration:revert -d src/database/data-source.ts
```

## Troubleshooting

- **Missing `pgcrypto` extension**: the migration enables it with `CREATE EXTENSION IF NOT EXISTS "pgcrypto"`. Ensure the connected user has privileges to install extensions.
- **SSL connection issues**: set `DATABASE_SSL=false` locally or provide CA certs if your Postgres cluster enforces SSL.
- **Enum mismatch**: if you previously altered enum values manually, drop dependent objects before rerunning or adjust using a follow-up migration.

## Change Log

- _2025-09-27_: Initial migration generated from `CustomerProfile` schema.
