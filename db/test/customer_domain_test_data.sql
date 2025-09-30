-- App: Customer Registration
-- Package: db/test
-- File: customer_domain_test_data.sql
-- Version: 0.1.0
-- Turns: 2
-- Author: Codex Agent
-- Date: 2025-09-30T17:10:00Z
-- Description: Inserts sample customers, emails, phone numbers, and privacy settings for development and testing workflows.
-- Exports: Seed data for customer_domain schema tables

BEGIN;

SET search_path TO customer_domain, public;

INSERT INTO postal_address (address_id, line1, line2, city, state, postal_code, country)
VALUES
    (1, '100 Market St', NULL, 'Springfield', 'IL', '62701', 'US'),
    (2, '200 Oak Ave', 'Apt 2', 'Madison', 'WI', '53703', 'US'),
    (3, '300 Pine Rd', NULL, 'Austin', 'TX', '73301', 'US'),
    (4, '400 Maple Ln', NULL, 'Denver', 'CO', '80014', 'US'),
    (5, '500 Cedar Blvd', 'Suite 5', 'Phoenix', 'AZ', '85001', 'US'),
    (6, '600 Birch Way', NULL, 'Portland', 'OR', '97035', 'US'),
    (7, '700 Walnut St', NULL, 'Boston', 'MA', '02108', 'US'),
    (8, '800 Chestnut Dr', NULL, 'Seattle', 'WA', '98101', 'US'),
    (9, '900 Elm Cir', NULL, 'Atlanta', 'GA', '30303', 'US'),
    (10, '1000 Ash Pl', NULL, 'Miami', 'FL', '33101', 'US')
ON CONFLICT (address_id) DO NOTHING;

INSERT INTO privacy_settings (privacy_settings_id, marketing_emails_enabled, two_factor_enabled)
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

INSERT INTO customer (customer_id, first_name, middle_name, last_name, address_id, privacy_settings_id)
VALUES
    ('2e4fa6f0-46a4-4b46-97bb-3fba38c3ac01', 'Alice', NULL, 'Smith', 1, 1),
    ('5fd32b4d-ea5d-4f9a-b0cf-9c3ca096a202', 'Brian', 'M', 'Johnson', 2, 2),
    ('97b9121e-42c3-4c1a-b981-7c0e83ef6403', 'Camila', NULL, 'Lopez', 3, 3),
    ('a7fd6a11-9678-49f2-9586-3f6e3d898904', 'Darius', 'K', 'Nguyen', 4, 4),
    ('c470f126-7a8d-4c14-a3e3-e958c0c1a105', 'Elena', NULL, 'Ivanova', 5, 5),
    ('d36fe910-1a72-4f63-bf56-0f8169777e06', 'Farah', NULL, 'Hassan', 6, 6),
    ('ec9f4d87-3f2a-4ad4-9b01-7f52ae8e2507', 'Giorgio', 'P', 'Rossi', 7, 7),
    ('f6c0b335-16a4-4e3a-9d59-401804408f08', 'Harper', NULL, 'Williams', 8, 8),
    ('0aa9fbc3-7c4f-4096-8f8d-3f6f63c59f09', 'Isaac', NULL, 'Khan', 9, 9),
    ('192e9b48-03c4-4d21-8441-343bf39ad610', 'Jasmine', 'R', 'O''Brien', 10, 10)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO customer_email (email_id, customer_id, email)
VALUES
    (1, '2e4fa6f0-46a4-4b46-97bb-3fba38c3ac01', 'alice.smith@example.com'),
    (2, '5fd32b4d-ea5d-4f9a-b0cf-9c3ca096a202', 'brian.johnson@example.com'),
    (3, '97b9121e-42c3-4c1a-b981-7c0e83ef6403', 'camila.lopez@example.com'),
    (4, 'a7fd6a11-9678-49f2-9586-3f6e3d898904', 'darius.nguyen@example.com'),
    (5, 'c470f126-7a8d-4c14-a3e3-e958c0c1a105', 'elena.ivanova@example.com'),
    (6, 'd36fe910-1a72-4f63-bf56-0f8169777e06', 'farah.hassan@example.com'),
    (7, 'ec9f4d87-3f2a-4ad4-9b01-7f52ae8e2507', 'giorgio.rossi@example.com'),
    (8, 'f6c0b335-16a4-4e3a-9d59-401804408f08', 'harper.williams@example.com'),
    (9, '0aa9fbc3-7c4f-4096-8f8d-3f6f63c59f09', 'isaac.khan@example.com'),
    (10, '192e9b48-03c4-4d21-8441-343bf39ad610', 'jasmine.obrien@example.com')
ON CONFLICT (email_id) DO NOTHING;

INSERT INTO customer_phone_number (phone_id, customer_id, type, number)
VALUES
    (1, '2e4fa6f0-46a4-4b46-97bb-3fba38c3ac01', 'mobile', '+12175550101'),
    (2, '5fd32b4d-ea5d-4f9a-b0cf-9c3ca096a202', 'mobile', '+16085550102'),
    (3, '97b9121e-42c3-4c1a-b981-7c0e83ef6403', 'mobile', '+15125550103'),
    (4, 'a7fd6a11-9678-49f2-9586-3f6e3d898904', 'mobile', '+13035550104'),
    (5, 'c470f126-7a8d-4c14-a3e3-e958c0c1a105', 'mobile', '+16025550105'),
    (6, 'd36fe910-1a72-4f63-bf56-0f8169777e06', 'mobile', '+15035550106'),
    (7, 'ec9f4d87-3f2a-4ad4-9b01-7f52ae8e2507', 'mobile', '+16175550107'),
    (8, 'f6c0b335-16a4-4e3a-9d59-401804408f08', 'mobile', '+12065550108'),
    (9, '0aa9fbc3-7c4f-4096-8f8d-3f6f63c59f09', 'mobile', '+14045550109'),
    (10, '192e9b48-03c4-4d21-8441-343bf39ad610', 'mobile', '+13015550110')
ON CONFLICT (phone_id) DO NOTHING;

SELECT setval('customer_domain.postal_address_address_id_seq', COALESCE((SELECT MAX(address_id) FROM postal_address), 0), true);
SELECT setval('customer_domain.privacy_settings_privacy_settings_id_seq', COALESCE((SELECT MAX(privacy_settings_id) FROM privacy_settings), 0), true);
SELECT setval('customer_domain.customer_email_email_id_seq', COALESCE((SELECT MAX(email_id) FROM customer_email), 0), true);
SELECT setval('customer_domain.customer_phone_number_phone_id_seq', COALESCE((SELECT MAX(phone_id) FROM customer_phone_number), 0), true);

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
