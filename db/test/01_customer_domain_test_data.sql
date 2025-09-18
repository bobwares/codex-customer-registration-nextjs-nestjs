-- App: Customer Registration
-- Package: db
-- File: 01_customer_domain_test_data.sql
-- Version: 0.1.0
-- Turns: 1
-- Author: AI Agent
-- Date: 2025-09-18T19:33:35Z
-- Description: Seeds deterministic customer domain reference data for local development and automated tests.
-- Exports: Deterministic rows for postal_address, privacy_settings, customer, customer_email, customer_phone_number tables.

BEGIN;

INSERT INTO customer_domain.postal_address (address_id, line1, line2, city, state, postal_code, country)
VALUES
    (1, '100 Market St', NULL, 'Springfield', 'IL', '62701', 'US'),
    (2, '200 Oak Ave', 'Apt 2', 'Madison', 'WI', '53703', 'US'),
    (3, '300 Pine Rd', NULL, 'Austin', 'TX', '73301', 'US'),
    (4, '400 Maple Ln', NULL, 'Denver', 'CO', '80203', 'US'),
    (5, '500 Cedar Blvd', 'Suite 5', 'Phoenix', 'AZ', '85001', 'US'),
    (6, '600 Birch Way', NULL, 'Portland', 'OR', '97201', 'US'),
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

INSERT INTO customer_domain.customer (customer_id, first_name, middle_name, last_name, address_id, privacy_settings_id)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alice', NULL, 'Smith', 1, 1),
    ('22222222-2222-2222-2222-222222222222', 'Benjamin', 'A', 'Jones', 2, 2),
    ('33333333-3333-3333-3333-333333333333', 'Charlotte', NULL, 'Brown', 3, 3),
    ('44444444-4444-4444-4444-444444444444', 'Daniel', 'B', 'Miller', 4, 4),
    ('55555555-5555-5555-5555-555555555555', 'Evelyn', NULL, 'Davis', 5, 5),
    ('66666666-6666-6666-6666-666666666666', 'Franklin', NULL, 'Wilson', 6, 6),
    ('77777777-7777-7777-7777-777777777777', 'Grace', 'C', 'Taylor', 7, 7),
    ('88888888-8888-8888-8888-888888888888', 'Harper', NULL, 'Anderson', 8, 8),
    ('99999999-9999-9999-9999-999999999999', 'Isabella', NULL, 'Thomas', 9, 9),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jackson', 'D', 'Martin', 10, 10)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO customer_domain.customer_email (customer_id, email)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'alice.smith@example.com'),
    ('22222222-2222-2222-2222-222222222222', 'ben.jones@example.com'),
    ('33333333-3333-3333-3333-333333333333', 'charlie.brown@example.com'),
    ('44444444-4444-4444-4444-444444444444', 'dan.miller@example.com'),
    ('55555555-5555-5555-5555-555555555555', 'eve.davis@example.com'),
    ('66666666-6666-6666-6666-666666666666', 'frank.wilson@example.com'),
    ('77777777-7777-7777-7777-777777777777', 'grace.taylor@example.com'),
    ('88888888-8888-8888-8888-888888888888', 'harper.anderson@example.com'),
    ('99999999-9999-9999-9999-999999999999', 'isabella.thomas@example.com'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'jackson.martin@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO customer_domain.customer_phone_number (customer_id, type, number)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'mobile', '+15555550101'),
    ('22222222-2222-2222-2222-222222222222', 'mobile', '+15555550102'),
    ('33333333-3333-3333-3333-333333333333', 'mobile', '+15555550103'),
    ('44444444-4444-4444-4444-444444444444', 'mobile', '+15555550104'),
    ('55555555-5555-5555-5555-555555555555', 'mobile', '+15555550105'),
    ('66666666-6666-6666-6666-666666666666', 'mobile', '+15555550106'),
    ('77777777-7777-7777-7777-777777777777', 'mobile', '+15555550107'),
    ('88888888-8888-8888-8888-888888888888', 'mobile', '+15555550108'),
    ('99999999-9999-9999-9999-999999999999', 'mobile', '+15555550109'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mobile', '+15555550110')
ON CONFLICT DO NOTHING;

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
