-- App: Customer Registration
-- Package: db
-- File: 01_customer_domain.sql
-- Version: 0.1.0
-- Author: Codex Agent
-- Date: 2025-09-24
-- Description: Creates the customer_domain schema and tables derived from the persisted data schema.

BEGIN;

CREATE SCHEMA IF NOT EXISTS customer_domain;
SET search_path TO customer_domain, public;

CREATE TABLE IF NOT EXISTS postal_address (
    address_id      BIGSERIAL PRIMARY KEY,
    line1           VARCHAR(255) NOT NULL,
    line2           VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    postal_code     VARCHAR(20),
    country         CHAR(2) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_postal_address_country
    ON postal_address (country);
CREATE INDEX IF NOT EXISTS idx_postal_address_postal_code
    ON postal_address (postal_code);

CREATE TABLE IF NOT EXISTS privacy_settings (
    privacy_settings_id BIGSERIAL PRIMARY KEY,
    marketing_emails_enabled BOOLEAN NOT NULL,
    two_factor_enabled BOOLEAN NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id         UUID PRIMARY KEY,
    first_name          VARCHAR(100) NOT NULL,
    middle_name         VARCHAR(100),
    last_name           VARCHAR(100) NOT NULL,
    preferred_email     VARCHAR(320),
    address_id          BIGINT REFERENCES postal_address(address_id) ON DELETE SET NULL,
    privacy_settings_id BIGINT REFERENCES privacy_settings(privacy_settings_id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_preferred_email
    ON customer (preferred_email);
CREATE INDEX IF NOT EXISTS idx_customer_last_name
    ON customer (last_name);
CREATE INDEX IF NOT EXISTS idx_customer_address_id
    ON customer (address_id);
CREATE INDEX IF NOT EXISTS idx_customer_privacy_settings_id
    ON customer (privacy_settings_id);

CREATE TABLE IF NOT EXISTS customer_email (
    email_id    BIGSERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customer(customer_id) ON DELETE CASCADE,
    email       VARCHAR(320) NOT NULL,
    is_primary  BOOLEAN NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    UNIQUE (customer_id, email)
);

CREATE INDEX IF NOT EXISTS idx_customer_email_customer_id
    ON customer_email (customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_primary
    ON customer_email (customer_id)
    WHERE is_primary;

CREATE TABLE IF NOT EXISTS customer_phone_number (
    phone_number_id BIGSERIAL PRIMARY KEY,
    customer_id     UUID NOT NULL REFERENCES customer(customer_id) ON DELETE CASCADE,
    phone_type      VARCHAR(10) NOT NULL,
    phone_number    VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    UNIQUE (customer_id, phone_number)
);

CREATE INDEX IF NOT EXISTS idx_customer_phone_number_type
    ON customer_phone_number (phone_type);
CREATE INDEX IF NOT EXISTS idx_customer_phone_number_customer
    ON customer_phone_number (customer_id);

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
