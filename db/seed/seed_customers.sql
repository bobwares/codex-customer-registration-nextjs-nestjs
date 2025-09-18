-- App: Customer Registration
-- Package: db/seed
-- File: seed_customers.sql
-- Version: 0.1.0
-- Turns: [1]
-- Author: ChatGPT
-- Date: 2025-09-18T16:44:28Z
-- Description: Seeds customer tables with representative customer registration data.

INSERT INTO customers (id, first_name, middle_name, last_name, marketing_emails_enabled, two_factor_enabled)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alice', NULL, 'Johnson', TRUE, TRUE),
    ('22222222-2222-2222-2222-222222222222', 'Bob', 'Q', 'Smith', FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO customer_emails (customer_id, email)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
    ('22222222-2222-2222-2222-222222222222', 'bob.smith@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO customer_phone_numbers (customer_id, phone_type, phone_number)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'mobile', '+15555550123'),
    ('22222222-2222-2222-2222-222222222222', 'work', '+15555550987')
ON CONFLICT DO NOTHING;

INSERT INTO customer_addresses (customer_id, line1, line2, city, state, postal_code, country)
VALUES
    ('11111111-1111-1111-1111-111111111111', '123 Elm St', NULL, 'Springfield', 'IL', '62701', 'US'),
    ('22222222-2222-2222-2222-222222222222', '456 Oak Ave', 'Suite 5', 'Franklin', 'TN', '37064', 'US')
ON CONFLICT (customer_id) DO NOTHING;
