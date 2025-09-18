-- App: Customer Registration
-- Package: db
-- File: 01_customer_domain.sql
-- Version: 0.1.0
-- Author: AI Agent
-- Date: 2025-06-08T00:00:00Z
-- Description: Creates normalized tables for the customer profile domain, including address,
-- emails, phone numbers, privacy settings, and a flattened customer view.

BEGIN;

CREATE TABLE IF NOT EXISTS postal_address (
    postal_address_id SERIAL PRIMARY KEY,
    line1             VARCHAR(255) NOT NULL,
    line2             VARCHAR(255),
    city              VARCHAR(120) NOT NULL,
    state             VARCHAR(80)  NOT NULL,
    postal_code       VARCHAR(20)  NOT NULL,
    country           CHAR(2)      NOT NULL,
    UNIQUE (line1, line2, city, state, postal_code, country)
);

CREATE TABLE IF NOT EXISTS privacy_settings (
    privacy_settings_id      SERIAL PRIMARY KEY,
    marketing_emails_enabled BOOLEAN NOT NULL,
    two_factor_enabled       BOOLEAN NOT NULL,
    UNIQUE (marketing_emails_enabled, two_factor_enabled)
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id         UUID PRIMARY KEY,
    first_name          VARCHAR(120) NOT NULL,
    middle_name         VARCHAR(120),
    last_name           VARCHAR(120) NOT NULL,
    address_id          INTEGER REFERENCES postal_address (postal_address_id) ON DELETE SET NULL,
    privacy_settings_id INTEGER REFERENCES privacy_settings (privacy_settings_id) ON DELETE SET NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_address_id
    ON customer (address_id);

CREATE INDEX IF NOT EXISTS idx_customer_privacy_settings_id
    ON customer (privacy_settings_id);

CREATE TABLE IF NOT EXISTS customer_email (
    customer_email_id SERIAL PRIMARY KEY,
    customer_id       UUID NOT NULL REFERENCES customer (customer_id) ON DELETE CASCADE,
    email             VARCHAR(255) NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (customer_id, email)
);

CREATE INDEX IF NOT EXISTS idx_customer_email_customer_id
    ON customer_email (customer_id);

CREATE TABLE IF NOT EXISTS customer_phone_number (
    customer_phone_number_id SERIAL PRIMARY KEY,
    customer_id              UUID NOT NULL REFERENCES customer (customer_id) ON DELETE CASCADE,
    phone_type               VARCHAR(16) NOT NULL,
    phone_number             VARCHAR(20) NOT NULL,
    created_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (customer_id, phone_number)
);

CREATE INDEX IF NOT EXISTS idx_customer_phone_customer_id
    ON customer_phone_number (customer_id);

CREATE OR REPLACE VIEW customer_profile_view AS
SELECT
    c.customer_id,
    c.first_name,
    c.middle_name,
    c.last_name,
    c.created_at,
    c.updated_at,
    pa.line1,
    pa.line2,
    pa.city,
    pa.state,
    pa.postal_code,
    pa.country,
    ps.marketing_emails_enabled,
    ps.two_factor_enabled
FROM customer c
         LEFT JOIN postal_address pa ON pa.postal_address_id = c.address_id
         LEFT JOIN privacy_settings ps ON ps.privacy_settings_id = c.privacy_settings_id;

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer;
-- Smoke test: SELECT COUNT(*) FROM customer_email ce JOIN customer c ON c.customer_id = ce.customer_id;
-- Smoke test: SELECT * FROM customer_profile_view LIMIT 5;
