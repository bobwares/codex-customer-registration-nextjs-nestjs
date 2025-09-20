-- App: Customer Registration
-- Package: db
-- File: customer_domain_test_data.sql
-- Version: 0.1.0
-- Turns: 1
-- Author: AI Agent
-- Date: 2025-09-19T23:14:05Z
-- Exports: postal_address, privacy_settings, customer, customer_email, customer_phone_number
-- Description: Loads deterministic customer domain seed data for local development and automated tests.

BEGIN;

SET search_path TO customer_domain, public;

-- Timestamp: 2025-09-19T23:14:05Z (UTC)

INSERT INTO postal_address (address_id, line1, line2, city, state, postal_code, country)
VALUES
    (1, '100 Market Street', NULL, 'Springfield', 'IL', '62701', 'US'),
    (2, '225 Lakeview Avenue', 'Suite 200', 'Madison', 'WI', '53703', 'US'),
    (3, '18 South Congress Ave', NULL, 'Austin', 'TX', '73301', 'US'),
    (4, '940 Lincoln Blvd', 'Floor 4', 'Denver', 'CO', '80203', 'US'),
    (5, '4100 Desert Ridge Dr', NULL, 'Phoenix', 'AZ', '85001', 'US'),
    (6, '71 Northwest 20th Street', NULL, 'Portland', 'OR', '97209', 'US'),
    (7, '305 Beacon Street', NULL, 'Boston', 'MA', '02116', 'US'),
    (8, '1620 Elliott Avenue', 'Apt 5B', 'Seattle', 'WA', '98101', 'US'),
    (9, '455 Midtown Circle', NULL, 'Atlanta', 'GA', '30303', 'US'),
    (10, '980 Bayshore Drive', NULL, 'Miami', 'FL', '33132', 'US')
ON CONFLICT (address_id) DO UPDATE
SET
    line1 = EXCLUDED.line1,
    line2 = EXCLUDED.line2,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    postal_code = EXCLUDED.postal_code,
    country = EXCLUDED.country;

SELECT setval(
    pg_get_serial_sequence('customer_domain.postal_address', 'address_id'),
    GREATEST((SELECT MAX(address_id) FROM postal_address), 0),
    TRUE
);

INSERT INTO privacy_settings (privacy_settings_id, marketing_emails_enabled, two_factor_enabled)
VALUES
    (1, TRUE, FALSE),
    (2, FALSE, TRUE),
    (3, TRUE, TRUE),
    (4, FALSE, FALSE),
    (5, TRUE, FALSE),
    (6, TRUE, TRUE),
    (7, FALSE, TRUE),
    (8, TRUE, FALSE),
    (9, FALSE, TRUE),
    (10, TRUE, TRUE)
ON CONFLICT (privacy_settings_id) DO UPDATE
SET
    marketing_emails_enabled = EXCLUDED.marketing_emails_enabled,
    two_factor_enabled = EXCLUDED.two_factor_enabled;

SELECT setval(
    pg_get_serial_sequence('customer_domain.privacy_settings', 'privacy_settings_id'),
    GREATEST((SELECT MAX(privacy_settings_id) FROM privacy_settings), 0),
    TRUE
);

INSERT INTO customer (
    customer_id,
    first_name,
    middle_name,
    last_name,
    preferred_email,
    address_id,
    privacy_settings_id
)
VALUES
    ('0f5a1ad0-2c4d-4f49-9a55-1a8a37dd0f01', 'Alice', 'R.', 'Morgan', 'alice.morgan@example.com', 1, 1),
    ('184f1f12-5f3d-4fd1-9505-6a1c403a9bb3', 'Benjamin', NULL, 'Ortiz', 'ben.ortiz@example.com', 2, 2),
    ('2c3d8bb4-8a5a-4d92-9686-60c7b6d925e0', 'Chloe', NULL, 'Hughes', 'chloe.hughes@example.com', 3, 3),
    ('3e6e5c9f-4ad0-4aa5-83f9-8c505d5e2f14', 'Darius', 'L.', 'Nguyen', 'darius.nguyen@example.com', 4, 4),
    ('4c1aa2fd-2359-4a9c-9d02-6d5e1e210f2d', 'Elena', NULL, 'Vasquez', 'elena.vasquez@example.com', 5, 5),
    ('5d2b3c4e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', 'Felix', 'A.', 'Carver', 'felix.carver@example.com', 6, 6),
    ('6e3f4a5b-7c8d-4e9f-b0a1-c2d3e4f5a6b7', 'Grace', NULL, 'Yamamoto', 'grace.yamamoto@example.com', 7, 7),
    ('7f4a5b6c-8d9e-4fa0-b1c2-d3e4f5a6b7c8', 'Hannah', 'M.', 'Singh', 'hannah.singh@example.com', 8, 8),
    ('8123abcd-9e0f-41a2-b3c4-d5e6f7a8b9c0', 'Isaac', NULL, 'Bennett', 'isaac.bennett@example.com', 9, 9),
    ('9a0b1c2d-3e4f-40a5-b6c7-d8e9f0a1b2c3', 'Jasmine', 'T.', 'Cole', 'jasmine.cole@example.com', 10, 10)
ON CONFLICT (customer_id) DO UPDATE
SET
    first_name = EXCLUDED.first_name,
    middle_name = EXCLUDED.middle_name,
    last_name = EXCLUDED.last_name,
    preferred_email = EXCLUDED.preferred_email,
    address_id = EXCLUDED.address_id,
    privacy_settings_id = EXCLUDED.privacy_settings_id;

INSERT INTO customer_email (customer_id, email, is_primary)
VALUES
    ('0f5a1ad0-2c4d-4f49-9a55-1a8a37dd0f01', 'alice.morgan@example.com', TRUE),
    ('184f1f12-5f3d-4fd1-9505-6a1c403a9bb3', 'ben.ortiz@example.com', TRUE),
    ('2c3d8bb4-8a5a-4d92-9686-60c7b6d925e0', 'chloe.hughes@example.com', TRUE),
    ('3e6e5c9f-4ad0-4aa5-83f9-8c505d5e2f14', 'darius.nguyen@example.com', TRUE),
    ('4c1aa2fd-2359-4a9c-9d02-6d5e1e210f2d', 'elena.vasquez@example.com', TRUE),
    ('5d2b3c4e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', 'felix.carver@example.com', TRUE),
    ('6e3f4a5b-7c8d-4e9f-b0a1-c2d3e4f5a6b7', 'grace.yamamoto@example.com', TRUE),
    ('7f4a5b6c-8d9e-4fa0-b1c2-d3e4f5a6b7c8', 'hannah.singh@example.com', TRUE),
    ('8123abcd-9e0f-41a2-b3c4-d5e6f7a8b9c0', 'isaac.bennett@example.com', TRUE),
    ('9a0b1c2d-3e4f-40a5-b6c7-d8e9f0a1b2c3', 'jasmine.cole@example.com', TRUE)
ON CONFLICT ON CONSTRAINT uq_customer_email_customer_id_email DO UPDATE
SET
    is_primary = EXCLUDED.is_primary;

INSERT INTO customer_phone_number (customer_id, phone_type, phone_number)
VALUES
    ('0f5a1ad0-2c4d-4f49-9a55-1a8a37dd0f01', 'mobile', '+13125550101'),
    ('184f1f12-5f3d-4fd1-9505-6a1c403a9bb3', 'mobile', '+16085550102'),
    ('2c3d8bb4-8a5a-4d92-9686-60c7b6d925e0', 'mobile', '+15125550103'),
    ('3e6e5c9f-4ad0-4aa5-83f9-8c505d5e2f14', 'mobile', '+13035550104'),
    ('4c1aa2fd-2359-4a9c-9d02-6d5e1e210f2d', 'mobile', '+16025550105'),
    ('5d2b3c4e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', 'mobile', '+15035550106'),
    ('6e3f4a5b-7c8d-4e9f-b0a1-c2d3e4f5a6b7', 'mobile', '+16175550107'),
    ('7f4a5b6c-8d9e-4fa0-b1c2-d3e4f5a6b7c8', 'mobile', '+12065550108'),
    ('8123abcd-9e0f-41a2-b3c4-d5e6f7a8b9c0', 'mobile', '+14045550109'),
    ('9a0b1c2d-3e4f-40a5-b6c7-d8e9f0a1b2c3', 'mobile', '+13055550110')
ON CONFLICT (customer_id, phone_number) DO NOTHING;

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer_email;
