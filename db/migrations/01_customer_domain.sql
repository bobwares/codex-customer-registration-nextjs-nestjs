-- App: Customer Registration
-- Package: db
-- File: 01_customer_domain.sql
-- Version: 0.1.0
-- Turns: 2
-- Author: Codex Agent
-- Date: 2025-09-25T06:25:09Z
-- Description: Creates the customer_domain schema and core tables.

BEGIN;

CREATE SCHEMA IF NOT EXISTS customer_domain;

CREATE TABLE IF NOT EXISTS customer_domain.postal_address (
    address_id   SERIAL PRIMARY KEY,
    line1        VARCHAR(255) NOT NULL,
    line2        VARCHAR(255),
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(50)  NOT NULL,
    postal_code  VARCHAR(20)  NOT NULL,
    country      CHAR(2)      NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_domain.privacy_settings (
    privacy_settings_id      SERIAL PRIMARY KEY,
    marketing_emails_enabled BOOLEAN NOT NULL,
    two_factor_enabled       BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_domain.customer (
    customer_id         UUID PRIMARY KEY,
    first_name          VARCHAR(255) NOT NULL,
    middle_name         VARCHAR(255),
    last_name           VARCHAR(255) NOT NULL,
    address_id          INTEGER REFERENCES customer_domain.postal_address(address_id),
    privacy_settings_id INTEGER NOT NULL REFERENCES customer_domain.privacy_settings(privacy_settings_id)
);

CREATE INDEX IF NOT EXISTS ix_customer_address_id
    ON customer_domain.customer (address_id);
CREATE INDEX IF NOT EXISTS ix_customer_privacy_settings_id
    ON customer_domain.customer (privacy_settings_id);

CREATE TABLE IF NOT EXISTS customer_domain.customer_email (
    email_id    SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customer_domain.customer(customer_id) ON DELETE CASCADE,
    email       VARCHAR(255) NOT NULL,
    CONSTRAINT ux_customer_email_customer_id_email UNIQUE (customer_id, email)
);

CREATE INDEX IF NOT EXISTS ix_customer_email_customer_id
    ON customer_domain.customer_email (customer_id);

CREATE TABLE IF NOT EXISTS customer_domain.customer_phone_number (
    phone_id    SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customer_domain.customer(customer_id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL,
    number      VARCHAR(20) NOT NULL,
    CONSTRAINT ux_customer_phone_number_unique UNIQUE (customer_id, number)
);

CREATE INDEX IF NOT EXISTS ix_customer_phone_number_customer_id
    ON customer_domain.customer_phone_number (customer_id);

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
