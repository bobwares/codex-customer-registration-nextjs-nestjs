-- App: Customer Registration
-- Package: db
-- File: customer_domain_test_data.sql
-- Version: 0.1.0
-- Author: AI Agent
-- Date: 2025-09-25T19:45:00Z
-- Description: Seeds representative customer records, emails, phone numbers, and supporting reference data for local testing.
--
BEGIN;

SET search_path TO customer_domain, public;

INSERT INTO postal_address (address_id, line1, line2, city, state, postal_code, country)
VALUES
    (1, '742 Evergreen Terrace', NULL, 'Springfield', 'IL', '62704', 'US'),
    (2, '1600 Amphitheatre Parkway', NULL, 'Mountain View', 'CA', '94043', 'US'),
    (3, '1 Infinite Loop', NULL, 'Cupertino', 'CA', '95014', 'US'),
    (4, '11 Wall Street', NULL, 'New York', 'NY', '10005', 'US'),
    (5, '350 Fifth Avenue', 'Floor 59', 'New York', 'NY', '10118', 'US'),
    (6, '221B Baker Street', NULL, 'London', 'LN', 'NW16XE', 'GB'),
    (7, '4 Privet Drive', NULL, 'Little Whinging', 'SR', 'CR35TG', 'GB'),
    (8, '4059 Mt Lee Drive', NULL, 'Los Angeles', 'CA', '90068', 'US'),
    (9, '405 Lexington Ave', NULL, 'New York', 'NY', '10174', 'US'),
    (10, '500 Memorial Drive', NULL, 'Cambridge', 'MA', '02139', 'US')
ON CONFLICT (address_id) DO NOTHING;

INSERT INTO privacy_settings (privacy_settings_id, marketing_emails_enabled, two_factor_enabled)
VALUES
    (1, TRUE, TRUE),
    (2, TRUE, FALSE),
    (3, FALSE, TRUE),
    (4, FALSE, FALSE),
    (5, TRUE, TRUE),
    (6, TRUE, FALSE),
    (7, FALSE, TRUE),
    (8, TRUE, TRUE),
    (9, FALSE, FALSE),
    (10, TRUE, TRUE)
ON CONFLICT (privacy_settings_id) DO NOTHING;

INSERT INTO customer (customer_id, name, first_name, middle_name, last_name, email, address_id, privacy_settings_id)
VALUES
    ('0b33fbc5-3dd9-4d6a-8a0b-3f2f3e1e8d01', 'Homer Simpson', 'Homer', NULL, 'Simpson', 'homer.simpson@example.com', 1, 1),
    ('14c33ad9-11fc-4e05-8be5-b746b8ef39c2', 'Ada Lovelace', 'Ada', 'Byron', 'Lovelace', 'ada.lovelace@example.com', 10, 2),
    ('22f0bd18-21f1-4202-a1bb-1a7b39b9a1f9', 'Grace Hopper', 'Grace', 'Brewster', 'Hopper', 'grace.hopper@example.com', 10, 3),
    ('304a93a4-7a2f-4a97-b598-d7132e78a812', 'Linus Torvalds', 'Linus', NULL, 'Torvalds', 'linus.torvalds@example.com', 3, 4),
    ('41db55a1-dbe0-427c-9f51-9f1be9b96cc1', 'Katherine Johnson', 'Katherine', 'Coleman', 'Johnson', 'katherine.johnson@example.com', 9, 5),
    ('5aa9c2fb-9f6c-4cbb-8fb8-337f342a2d66', 'Margaret Hamilton', 'Margaret', NULL, 'Hamilton', 'margaret.hamilton@example.com', 10, 6),
    ('6400647d-cfa6-48b3-8b21-87dc0f67d512', 'Alan Turing', 'Alan', 'Mathison', 'Turing', 'alan.turing@example.com', 6, 7),
    ('7f7888ef-ded2-4ec1-85a2-84d8976ec5a5', 'Joan Clarke', 'Joan', NULL, 'Clarke', 'joan.clarke@example.com', 6, 8),
    ('8cdd0e4a-3b99-4dd6-8d5a-7b8f52cb31ac', 'Dennis Ritchie', 'Dennis', NULL, 'Ritchie', 'dennis.ritchie@example.com', 2, 9),
    ('9f3c8c54-6d4c-4e0d-9304-58c0e3f561b7', 'Barbara Liskov', 'Barbara', NULL, 'Liskov', 'barbara.liskov@example.com', 10, 10)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO customer_email (customer_id, email, is_primary)
VALUES
    ('0b33fbc5-3dd9-4d6a-8a0b-3f2f3e1e8d01', 'hsimpson@springfieldpower.com', FALSE),
    ('14c33ad9-11fc-4e05-8be5-b746b8ef39c2', 'ada@analyticalengines.org', FALSE),
    ('22f0bd18-21f1-4202-a1bb-1a7b39b9a1f9', 'ghopper@navy.mil', FALSE),
    ('304a93a4-7a2f-4a97-b598-d7132e78a812', 'linus@kernel.org', TRUE),
    ('41db55a1-dbe0-427c-9f51-9f1be9b96cc1', 'kjohnson@nasa.gov', TRUE),
    ('5aa9c2fb-9f6c-4cbb-8fb8-337f342a2d66', 'mhamilton@nasa.gov', TRUE),
    ('6400647d-cfa6-48b3-8b21-87dc0f67d512', 'aturing@bletchley.uk', FALSE),
    ('7f7888ef-ded2-4ec1-85a2-84d8976ec5a5', 'jclarke@bletchley.uk', TRUE),
    ('8cdd0e4a-3b99-4dd6-8d5a-7b8f52cb31ac', 'dritchie@bell-labs.com', TRUE),
    ('9f3c8c54-6d4c-4e0d-9304-58c0e3f561b7', 'bliskov@mit.edu', TRUE)
ON CONFLICT (customer_id, email) DO NOTHING;

INSERT INTO customer_phone_number (customer_id, type, number, extension)
VALUES
    ('0b33fbc5-3dd9-4d6a-8a0b-3f2f3e1e8d01', 'mobile', '+12175550101', NULL),
    ('14c33ad9-11fc-4e05-8be5-b746b8ef39c2', 'mobile', '+16175550102', NULL),
    ('22f0bd18-21f1-4202-a1bb-1a7b39b9a1f9', 'mobile', '+16175550103', NULL),
    ('304a93a4-7a2f-4a97-b598-d7132e78a812', 'mobile', '+14085550104', NULL),
    ('41db55a1-dbe0-427c-9f51-9f1be9b96cc1', 'mobile', '+12125550105', NULL),
    ('5aa9c2fb-9f6c-4cbb-8fb8-337f342a2d66', 'mobile', '+16175550106', NULL),
    ('6400647d-cfa6-48b3-8b21-87dc0f67d512', 'mobile', '+442075550107', NULL),
    ('7f7888ef-ded2-4ec1-85a2-84d8976ec5a5', 'mobile', '+442075550108', NULL),
    ('8cdd0e4a-3b99-4dd6-8d5a-7b8f52cb31ac', 'mobile', '+14085550109', NULL),
    ('9f3c8c54-6d4c-4e0d-9304-58c0e3f561b7', 'mobile', '+16175550110', NULL)
ON CONFLICT (customer_id, type, number) DO NOTHING;

COMMIT;

-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer;
-- Smoke test: SELECT COUNT(*) FROM customer_domain.customer_email;
