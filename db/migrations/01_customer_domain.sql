-- App: Customer Registration
-- Package: db/migrations
-- File: 01_customer_domain.sql
-- Version: 0.1.0
-- Turns: 2
-- Author: Codex Agent
-- Date: 2025-09-30T17:10:00Z
-- Description: Creates the customer_domain schema with normalized tables, relationships, and supporting indexes for customer onboarding data.
-- Exports: Tables customer_domain.postal_address, customer_domain.privacy_settings, customer_domain.customer, customer_domain.customer_email, customer_domain.customer_phone_number

BEGIN;

CREATE SCHEMA IF NOT EXISTS customer_domain;
SET search_path TO customer_domain, public;

CREATE TABLE IF NOT EXISTS postal_address (
    address_id SERIAL PRIMARY KEY,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country CHAR(2) NOT NULL,
    CONSTRAINT ck_postal_address_country CHECK (char_length(country) = 2)
);

CREATE TABLE IF NOT EXISTS privacy_settings (
    privacy_settings_id SERIAL PRIMARY KEY,
    marketing_emails_enabled BOOLEAN NOT NULL,
    two_factor_enabled BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    address_id INTEGER REFERENCES postal_address(address_id) ON DELETE SET NULL,
    privacy_settings_id INTEGER NOT NULL REFERENCES privacy_settings(privacy_settings_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_customer_address_id
    ON customer (address_id);

CREATE INDEX IF NOT EXISTS idx_customer_privacy_settings_id
    ON customer (privacy_settings_id);

CREATE TABLE IF NOT EXISTS customer_email (
    email_id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customer(customer_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    CONSTRAINT uq_customer_email_customer_id_email UNIQUE (customer_id, email)
);

CREATE INDEX IF NOT EXISTS idx_customer_email_customer_id
    ON customer_email (customer_id);

CREATE TABLE IF NOT EXISTS customer_phone_number (
    phone_id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customer(customer_id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    number VARCHAR(20) NOT NULL,
    CONSTRAINT uq_customer_phone_number_customer_id_number UNIQUE (customer_id, number)
);

CREATE INDEX IF NOT EXISTS idx_customer_phone_number_customer_id
    ON customer_phone_number (customer_id);

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
