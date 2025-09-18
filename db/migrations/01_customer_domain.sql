-- App: Customer Registration
-- Package: db
-- File: 01_customer_domain.sql
-- Version: 0.1.0
-- Turns: 1
-- Author: AI Agent
-- Date: 2025-09-18T19:33:35Z
-- Description: Creates the customer_domain schema, normalized tables, constraints, indexes, and supporting views for the customer onboarding workflow.
-- Exports: Tables postal_address, privacy_settings, customer, customer_email, customer_phone_number; view customer_overview.

BEGIN;

CREATE SCHEMA IF NOT EXISTS customer_domain;

SET search_path TO customer_domain, public;

CREATE TABLE IF NOT EXISTS postal_address (
    address_id      SERIAL PRIMARY KEY,
    line1           VARCHAR(255) NOT NULL,
    line2           VARCHAR(255),
    city            VARCHAR(120) NOT NULL,
    state           VARCHAR(80) NOT NULL,
    postal_code     VARCHAR(20),
    country         CHAR(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS privacy_settings (
    privacy_settings_id  SERIAL PRIMARY KEY,
    marketing_emails_enabled BOOLEAN NOT NULL,
    two_factor_enabled       BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id         UUID PRIMARY KEY,
    first_name          VARCHAR(120) NOT NULL,
    middle_name         VARCHAR(120),
    last_name           VARCHAR(120) NOT NULL,
    address_id          INTEGER REFERENCES postal_address(address_id) ON DELETE SET NULL,
    privacy_settings_id INTEGER REFERENCES privacy_settings(privacy_settings_id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_address_id ON customer USING btree (address_id);
CREATE INDEX IF NOT EXISTS idx_customer_privacy_settings_id ON customer USING btree (privacy_settings_id);

CREATE TABLE IF NOT EXISTS customer_email (
    email_id    SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customer(customer_id) ON DELETE CASCADE,
    email       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (customer_id, email)
);

CREATE INDEX IF NOT EXISTS idx_customer_email_customer_id ON customer_email USING btree (customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_email_address ON customer_email (email);

CREATE TABLE IF NOT EXISTS customer_phone_number (
    phone_id    SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customer(customer_id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL,
    number      VARCHAR(20) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (customer_id, number)
);

CREATE INDEX IF NOT EXISTS idx_customer_phone_customer_id ON customer_phone_number USING btree (customer_id);

CREATE OR REPLACE VIEW customer_overview AS
SELECT
    c.customer_id,
    c.first_name,
    c.middle_name,
    c.last_name,
    pa.line1,
    pa.line2,
    pa.city,
    pa.state,
    pa.postal_code,
    pa.country,
    ps.marketing_emails_enabled,
    ps.two_factor_enabled,
    COALESCE(json_agg(DISTINCT ce.email) FILTER (WHERE ce.email IS NOT NULL), '[]'::json) AS emails,
    COALESCE(json_agg(DISTINCT jsonb_build_object('type', cpn.type, 'number', cpn.number))
        FILTER (WHERE cpn.phone_id IS NOT NULL), '[]'::json) AS phone_numbers
FROM customer c
LEFT JOIN postal_address pa ON pa.address_id = c.address_id
LEFT JOIN privacy_settings ps ON ps.privacy_settings_id = c.privacy_settings_id
LEFT JOIN customer_email ce ON ce.customer_id = c.customer_id
LEFT JOIN customer_phone_number cpn ON cpn.customer_id = c.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.middle_name,
    c.last_name,
    pa.line1,
    pa.line2,
    pa.city,
    pa.state,
    pa.postal_code,
    pa.country,
    ps.marketing_emails_enabled,
    ps.two_factor_enabled;

COMMENT ON VIEW customer_overview IS 'Flattened projection combining customer profile details, addresses, emails, phone numbers, and privacy flags.';

-- Smoke test: SELECT COUNT(*) FROM customer;

COMMIT;
