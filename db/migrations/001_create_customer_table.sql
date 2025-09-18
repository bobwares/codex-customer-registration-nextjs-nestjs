-- App: Customer Registration
-- Package: db/migrations
-- File: 001_create_customer_table.sql
-- Version: 0.1.0
-- Turns: [1]
-- Author: ChatGPT
-- Date: 2025-09-18T16:44:28Z
-- Description: Creates customer, email, phone, and address tables for customer registration domain.

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    marketing_emails_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_emails (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    email VARCHAR(320) NOT NULL,
    UNIQUE(customer_id, email)
);

CREATE TABLE IF NOT EXISTS customer_phone_numbers (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    phone_type VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    CHECK (phone_type IN ('mobile', 'home', 'work', 'other'))
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(120) NOT NULL,
    state VARCHAR(120) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country CHAR(2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_emails_email ON customer_emails(email);
CREATE INDEX IF NOT EXISTS idx_customer_phone_numbers_phone ON customer_phone_numbers(phone_number);
