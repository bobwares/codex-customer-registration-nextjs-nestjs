# Customer Migration

## Source
- Schema file: `ai/context/schemas/customer-entity-schema.json`
- Schema commit: `087901fc5bde8d7794fe47a600c71c23b6fc2b60`
- Database schema: `customer_domain`
- Migration class: `20250928183335-customer.ts`

## Table Overview

### customer_domain.postal_addresses
| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| address_id | integer | NO | identity | Primary key |
| line1 | varchar(255) | NO | — |  |
| line2 | varchar(255) | YES | — | Optional second address line |
| city | varchar(100) | NO | — |  |
| state | varchar(100) | NO | — |  |
| postal_code | varchar(20) | NO | — |  |
| country | varchar(2) | NO | — | ISO-3166 alpha-2 code |

### customer_domain.privacy_settings
| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| privacy_settings_id | integer | NO | identity | Primary key |
| marketing_emails_enabled | boolean | NO | — |  |
| two_factor_enabled | boolean | NO | — |  |

### customer_domain.customers
| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| customer_id | uuid | NO | gen_random_uuid() | Primary key |
| first_name | varchar(255) | NO | — |  |
| middle_name | varchar(255) | YES | — | Optional |
| last_name | varchar(255) | NO | — |  |
| address_id | integer | YES | — | FK → postal_addresses.address_id |
| privacy_settings_id | integer | YES | — | FK → privacy_settings.privacy_settings_id |
| created_at | timestamptz | NO | now() |  |
| updated_at | timestamptz | NO | now() |  |

### customer_domain.customer_emails
| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| email_id | integer | NO | identity | Primary key |
| customer_id | uuid | NO | — | FK → customers.customer_id |
| email | varchar(320) | NO | — | format: email |
| is_primary | boolean | NO | — | Partial index WHERE is_primary |
| created_at | timestamptz | NO | now() |  |

### customer_domain.customer_phone_numbers
| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| phone_id | integer | NO | identity | Primary key |
| customer_id | uuid | NO | — | FK → customers.customer_id |
| type | varchar(20) | NO | — | phone type label |
| number | varchar(20) | NO | — | Unique per customer |
| created_at | timestamptz | NO | now() |  |

## Constraints & Indexes

### Keys
- `postal_addresses`: `pk_postal_addresses` (implicit) on `address_id`.
- `privacy_settings`: `pk_privacy_settings` (implicit) on `privacy_settings_id`.
- `customers`: `pk_customers` on `customer_id`.
- `customer_emails`: `pk_customer_emails` on `email_id`.
- `customer_phone_numbers`: `pk_customer_phone_numbers` on `phone_id`.

### Foreign Keys
- `fk_customers__postal_addresses__address_id`: `customers.address_id` → `postal_addresses.address_id` (ON DELETE SET NULL).
- `fk_customers__privacy_settings__privacy_settings_id`: `customers.privacy_settings_id` → `privacy_settings.privacy_settings_id` (ON DELETE SET NULL).
- `fk_customer_emails__customers__customer_id`: `customer_emails.customer_id` → `customers.customer_id` (ON DELETE CASCADE).
- `fk_customer_phone_numbers__customers__customer_id`: `customer_phone_numbers.customer_id` → `customers.customer_id` (ON DELETE CASCADE).

### Unique Constraints
- `uq_customer_emails__customer_id_email`: ensures one email address per customer.
- `uq_customer_phone_numbers__customer_id_number`: ensures one phone number per customer.

### Indexes
- `ix_customers__address_id` on `customers(address_id)`.
- `ix_customers__privacy_settings_id` on `customers(privacy_settings_id)`.
- `ix_customer_emails__customer_id` on `customer_emails(customer_id)`.
- `idx_customer_email_primary` partial index on `customer_emails(customer_id) WHERE is_primary IS TRUE` for fast lookup of primary emails.
- `ix_customer_phone_numbers__customer_id` on `customer_phone_numbers(customer_id)`.

## Running the Migration
1. `cd api`
2. `npm install`
3. Ensure `.env` is configured with database credentials and `DATABASE_SCHEMA=customer_domain` (or omit to use default).
4. Run migrations: `npx typeorm migration:run -d src/database/data-source.ts`
5. (Optional) Show status: `npx typeorm migration:show -d src/database/data-source.ts`

## Reverting
- `cd api`
- `npx typeorm migration:revert -d src/database/data-source.ts`

## Troubleshooting
- `gen_random_uuid()` requires the PostgreSQL `pgcrypto` extension. Enable via `CREATE EXTENSION IF NOT EXISTS pgcrypto;`.
- Partial index `idx_customer_email_primary` relies on the boolean column `is_primary`. Ensure TypeORM CLI uses PostgreSQL ≥ 11.
- If the schema already exists with conflicting objects, either drop manually or set a different `DATABASE_SCHEMA` environment variable.

## Change Log
- 2025-09-28: Initial migration authored from `customer-entity-schema.json`.
