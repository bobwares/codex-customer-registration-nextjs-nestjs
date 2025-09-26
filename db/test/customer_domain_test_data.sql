-- App: Customer Registration
-- Package: db
-- File: customer_domain_test_data.sql
-- Version: 0.1.0
-- Turns: 3
-- Author: Codex Agent
-- Date: 2025-09-26T02:55:41Z
-- Description: Seeds reference customer domain data for local development and testing scenarios.

BEGIN;

INSERT INTO customer_domain.postal_address (address_id, line1, line2, city, state, postal_code, country)
VALUES
    (1, '100 Market St', NULL, 'Springfield', 'IL', '62701', 'US'),
    (2, '200 Oak Ave', 'Apt 2', 'Madison', 'WI', '53703', 'US'),
    (3, '300 Pine Rd', NULL, 'Austin', 'TX', '73301', 'US'),
    (4, '400 Maple Ln', NULL, 'Denver', 'CO', '80203', 'US'),
    (5, '500 Cedar Blvd', 'Suite 5', 'Phoenix', 'AZ', '85001', 'US'),
    (6, '600 Birch Way', NULL, 'Portland', 'OR', '97205', 'US'),
    (7, '700 Walnut St', NULL, 'Boston', 'MA', '02108', 'US'),
    (8, '800 Chestnut Dr', NULL, 'Seattle', 'WA', '98101', 'US'),
    (9, '900 Elm Cir', NULL, 'Atlanta', 'GA', '30303', 'US'),
    (10, '1000 Ash Pl', NULL, 'Miami', 'FL', '33101', 'US')
ON CONFLICT (address_id) DO NOTHING;

INSERT INTO customer_domain.privacy_settings (privacy_settings_id, marketing_emails_enabled, two_factor_enabled)
VALUES
    (1, TRUE, FALSE),
    (2, FALSE, TRUE),
    (3, TRUE, TRUE),
    (4, FALSE, FALSE),
    (5, TRUE, FALSE),
    (6, FALSE, TRUE),
    (7, TRUE, TRUE),
    (8, FALSE, FALSE),
    (9, TRUE, FALSE),
    (10, FALSE, TRUE)
ON CONFLICT (privacy_settings_id) DO NOTHING;

INSERT INTO customer_domain.customer (
    customer_id,
    first_name,
    middle_name,
    last_name,
    address_id,
    privacy_settings_id,
    created_at,
    updated_at
)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alice', NULL, 'Smith', 1, 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
    ('22222222-2222-2222-2222-222222222222', 'Bob', 'J', 'Jones', 2, 2, '2025-01-02T00:00:00Z', '2025-01-02T00:00:00Z'),
    ('33333333-3333-3333-3333-333333333333', 'Charlie', NULL, 'Brown', 3, 3, '2025-01-03T00:00:00Z', '2025-01-03T00:00:00Z'),
    ('44444444-4444-4444-4444-444444444444', 'Diana', 'K', 'Miller', 4, 4, '2025-01-04T00:00:00Z', '2025-01-04T00:00:00Z'),
    ('55555555-5555-5555-5555-555555555555', 'Ethan', NULL, 'Davis', 5, 5, '2025-01-05T00:00:00Z', '2025-01-05T00:00:00Z'),
    ('66666666-6666-6666-6666-666666666666', 'Fiona', NULL, 'Wilson', 6, 6, '2025-01-06T00:00:00Z', '2025-01-06T00:00:00Z'),
    ('77777777-7777-7777-7777-777777777777', 'Gavin', 'L', 'Taylor', 7, 7, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
    ('88888888-8888-8888-8888-888888888888', 'Hannah', NULL, 'Anderson', 8, 8, '2025-01-08T00:00:00Z', '2025-01-08T00:00:00Z'),
    ('99999999-9999-9999-9999-999999999999', 'Isaac', NULL, 'Thomas', 9, 9, '2025-01-09T00:00:00Z', '2025-01-09T00:00:00Z'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Julia', 'M', 'Jackson', 10, 10, '2025-01-10T00:00:00Z', '2025-01-10T00:00:00Z')
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO customer_domain.customer_email (
    customer_id,
    email,
    is_primary,
    created_at
)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'alice@example.com', TRUE, '2025-01-01T00:00:00Z'),
    ('22222222-2222-2222-2222-222222222222', 'bob@example.com', TRUE, '2025-01-02T00:00:00Z'),
    ('33333333-3333-3333-3333-333333333333', 'charlie@example.com', TRUE, '2025-01-03T00:00:00Z'),
    ('44444444-4444-4444-4444-444444444444', 'diana@example.com', TRUE, '2025-01-04T00:00:00Z'),
    ('55555555-5555-5555-5555-555555555555', 'ethan@example.com', TRUE, '2025-01-05T00:00:00Z'),
    ('66666666-6666-6666-6666-666666666666', 'fiona@example.com', TRUE, '2025-01-06T00:00:00Z'),
    ('77777777-7777-7777-7777-777777777777', 'gavin@example.com', TRUE, '2025-01-07T00:00:00Z'),
    ('88888888-8888-8888-8888-888888888888', 'hannah@example.com', TRUE, '2025-01-08T00:00:00Z'),
    ('99999999-9999-9999-9999-999999999999', 'isaac@example.com', TRUE, '2025-01-09T00:00:00Z'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'julia@example.com', TRUE, '2025-01-10T00:00:00Z')
ON CONFLICT (customer_id, email) DO NOTHING;

INSERT INTO customer_domain.customer_phone_number (
    customer_id,
    type,
    number,
    created_at
)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'mobile', '+15555550101', '2025-01-01T00:00:00Z'),
    ('22222222-2222-2222-2222-222222222222', 'mobile', '+15555550102', '2025-01-02T00:00:00Z'),
    ('33333333-3333-3333-3333-333333333333', 'mobile', '+15555550103', '2025-01-03T00:00:00Z'),
    ('44444444-4444-4444-4444-444444444444', 'mobile', '+15555550104', '2025-01-04T00:00:00Z'),
    ('55555555-5555-5555-5555-555555555555', 'mobile', '+15555550105', '2025-01-05T00:00:00Z'),
    ('66666666-6666-6666-6666-666666666666', 'mobile', '+15555550106', '2025-01-06T00:00:00Z'),
    ('77777777-7777-7777-7777-777777777777', 'mobile', '+15555550107', '2025-01-07T00:00:00Z'),
    ('88888888-8888-8888-8888-888888888888', 'mobile', '+15555550108', '2025-01-08T00:00:00Z'),
    ('99999999-9999-9999-9999-999999999999', 'mobile', '+15555550109', '2025-01-09T00:00:00Z'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mobile', '+15555550110', '2025-01-10T00:00:00Z')
ON CONFLICT (customer_id, number) DO NOTHING;

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
