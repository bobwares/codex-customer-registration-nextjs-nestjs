-- App: Customer Registration
-- Package: db
-- File: customer_domain_test_data.sql
-- Version: 0.1.0
-- Author: Codex Agent
-- Date: 2025-09-24
-- Description: Seeds sample customer domain data for integration and development testing.

BEGIN;

INSERT INTO customer_domain.postal_address (address_id, line1, line2, city, state, postal_code, country, created_at, updated_at)
VALUES
    (1, '100 Market St', NULL, 'Springfield', 'IL', '62701', 'US', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
    (2, '200 Oak Ave', 'Apt 2', 'Madison', 'WI', '53703', 'US', '2025-01-01T00:05:00Z', '2025-01-01T00:05:00Z'),
    (3, '300 Pine Rd', NULL, 'Austin', 'TX', '73301', 'US', '2025-01-01T00:10:00Z', '2025-01-01T00:10:00Z'),
    (4, '400 Maple Ln', NULL, 'Denver', 'CO', '80014', 'US', '2025-01-01T00:15:00Z', '2025-01-01T00:15:00Z'),
    (5, '500 Cedar Blvd', 'Suite 5', 'Phoenix', 'AZ', '85001', 'US', '2025-01-01T00:20:00Z', '2025-01-01T00:20:00Z'),
    (6, '600 Birch Way', NULL, 'Portland', 'OR', '97201', 'US', '2025-01-01T00:25:00Z', '2025-01-01T00:25:00Z'),
    (7, '700 Walnut St', NULL, 'Boston', 'MA', '02108', 'US', '2025-01-01T00:30:00Z', '2025-01-01T00:30:00Z'),
    (8, '800 Chestnut Dr', NULL, 'Seattle', 'WA', '98101', 'US', '2025-01-01T00:35:00Z', '2025-01-01T00:35:00Z'),
    (9, '900 Elm Cir', NULL, 'Atlanta', 'GA', '30303', 'US', '2025-01-01T00:40:00Z', '2025-01-01T00:40:00Z'),
    (10, '1000 Ash Pl', NULL, 'Miami', 'FL', '33101', 'US', '2025-01-01T00:45:00Z', '2025-01-01T00:45:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO customer_domain.privacy_settings (privacy_settings_id, marketing_emails_enabled, two_factor_enabled, created_at, updated_at)
VALUES
    (1, TRUE, FALSE, '2025-01-01T01:00:00Z', '2025-01-01T01:00:00Z'),
    (2, FALSE, TRUE, '2025-01-01T01:05:00Z', '2025-01-01T01:05:00Z'),
    (3, TRUE, TRUE, '2025-01-01T01:10:00Z', '2025-01-01T01:10:00Z'),
    (4, FALSE, FALSE, '2025-01-01T01:15:00Z', '2025-01-01T01:15:00Z'),
    (5, TRUE, FALSE, '2025-01-01T01:20:00Z', '2025-01-01T01:20:00Z'),
    (6, FALSE, TRUE, '2025-01-01T01:25:00Z', '2025-01-01T01:25:00Z'),
    (7, TRUE, TRUE, '2025-01-01T01:30:00Z', '2025-01-01T01:30:00Z'),
    (8, FALSE, FALSE, '2025-01-01T01:35:00Z', '2025-01-01T01:35:00Z'),
    (9, TRUE, FALSE, '2025-01-01T01:40:00Z', '2025-01-01T01:40:00Z'),
    (10, FALSE, TRUE, '2025-01-01T01:45:00Z', '2025-01-01T01:45:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO customer_domain.customer (customer_id, first_name, middle_name, last_name, preferred_email, address_id, privacy_settings_id, created_at, updated_at)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alice', NULL, 'Smith', 'alice.smith@example.com', 1, 1, '2025-01-02T00:00:00Z', '2025-01-02T00:00:00Z'),
    ('22222222-2222-2222-2222-222222222222', 'Bob', 'J', 'Jones', 'bob.jones@example.com', 2, 2, '2025-01-02T00:05:00Z', '2025-01-02T00:05:00Z'),
    ('33333333-3333-3333-3333-333333333333', 'Charlie', NULL, 'Brown', 'charlie.brown@example.com', 3, 3, '2025-01-02T00:10:00Z', '2025-01-02T00:10:00Z'),
    ('44444444-4444-4444-4444-444444444444', 'Dana', 'K', 'Miller', 'dana.miller@example.com', 4, 4, '2025-01-02T00:15:00Z', '2025-01-02T00:15:00Z'),
    ('55555555-5555-5555-5555-555555555555', 'Emma', NULL, 'Davis', 'emma.davis@example.com', 5, 5, '2025-01-02T00:20:00Z', '2025-01-02T00:20:00Z'),
    ('66666666-6666-6666-6666-666666666666', 'Frank', NULL, 'Wilson', 'frank.wilson@example.com', 6, 6, '2025-01-02T00:25:00Z', '2025-01-02T00:25:00Z'),
    ('77777777-7777-7777-7777-777777777777', 'Grace', 'L', 'Taylor', 'grace.taylor@example.com', 7, 7, '2025-01-02T00:30:00Z', '2025-01-02T00:30:00Z'),
    ('88888888-8888-8888-8888-888888888888', 'Hugo', NULL, 'Anderson', 'hugo.anderson@example.com', 8, 8, '2025-01-02T00:35:00Z', '2025-01-02T00:35:00Z'),
    ('99999999-9999-9999-9999-999999999999', 'Isabel', NULL, 'Thomas', 'isabel.thomas@example.com', 9, 9, '2025-01-02T00:40:00Z', '2025-01-02T00:40:00Z'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jack', 'M', 'Jackson', 'jack.jackson@example.com', 10, 10, '2025-01-02T00:45:00Z', '2025-01-02T00:45:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO customer_domain.customer_email (email_id, customer_id, email, is_primary, created_at, updated_at)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', 'alice.smith@example.com', TRUE, '2025-01-03T00:00:00Z', '2025-01-03T00:00:00Z'),
    (2, '22222222-2222-2222-2222-222222222222', 'bob.jones@example.com', TRUE, '2025-01-03T00:05:00Z', '2025-01-03T00:05:00Z'),
    (3, '33333333-3333-3333-3333-333333333333', 'charlie.brown@example.com', TRUE, '2025-01-03T00:10:00Z', '2025-01-03T00:10:00Z'),
    (4, '44444444-4444-4444-4444-444444444444', 'dana.miller@example.com', TRUE, '2025-01-03T00:15:00Z', '2025-01-03T00:15:00Z'),
    (5, '55555555-5555-5555-5555-555555555555', 'emma.davis@example.com', TRUE, '2025-01-03T00:20:00Z', '2025-01-03T00:20:00Z'),
    (6, '66666666-6666-6666-6666-666666666666', 'frank.wilson@example.com', TRUE, '2025-01-03T00:25:00Z', '2025-01-03T00:25:00Z'),
    (7, '77777777-7777-7777-7777-777777777777', 'grace.taylor@example.com', TRUE, '2025-01-03T00:30:00Z', '2025-01-03T00:30:00Z'),
    (8, '88888888-8888-8888-8888-888888888888', 'hugo.anderson@example.com', TRUE, '2025-01-03T00:35:00Z', '2025-01-03T00:35:00Z'),
    (9, '99999999-9999-9999-9999-999999999999', 'isabel.thomas@example.com', TRUE, '2025-01-03T00:40:00Z', '2025-01-03T00:40:00Z'),
    (10, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'jack.jackson@example.com', TRUE, '2025-01-03T00:45:00Z', '2025-01-03T00:45:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO customer_domain.customer_phone_number (phone_number_id, customer_id, phone_type, phone_number, created_at, updated_at)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', 'mobile', '+15555550101', '2025-01-04T00:00:00Z', '2025-01-04T00:00:00Z'),
    (2, '22222222-2222-2222-2222-222222222222', 'mobile', '+15555550102', '2025-01-04T00:05:00Z', '2025-01-04T00:05:00Z'),
    (3, '33333333-3333-3333-3333-333333333333', 'mobile', '+15555550103', '2025-01-04T00:10:00Z', '2025-01-04T00:10:00Z'),
    (4, '44444444-4444-4444-4444-444444444444', 'mobile', '+15555550104', '2025-01-04T00:15:00Z', '2025-01-04T00:15:00Z'),
    (5, '55555555-5555-5555-5555-555555555555', 'mobile', '+15555550105', '2025-01-04T00:20:00Z', '2025-01-04T00:20:00Z'),
    (6, '66666666-6666-6666-6666-666666666666', 'mobile', '+15555550106', '2025-01-04T00:25:00Z', '2025-01-04T00:25:00Z'),
    (7, '77777777-7777-7777-7777-777777777777', 'mobile', '+15555550107', '2025-01-04T00:30:00Z', '2025-01-04T00:30:00Z'),
    (8, '88888888-8888-8888-8888-888888888888', 'mobile', '+15555550108', '2025-01-04T00:35:00Z', '2025-01-04T00:35:00Z'),
    (9, '99999999-9999-9999-9999-999999999999', 'mobile', '+15555550109', '2025-01-04T00:40:00Z', '2025-01-04T00:40:00Z'),
    (10, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mobile', '+15555550110', '2025-01-04T00:45:00Z', '2025-01-04T00:45:00Z')
ON CONFLICT DO NOTHING;

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer_email;
