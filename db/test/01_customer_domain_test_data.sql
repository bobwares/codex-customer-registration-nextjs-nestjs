-- App: Customer Registration
-- Package: db
-- File: 01_customer_domain_test_data.sql
-- Version: 0.1.0
-- Author: AI Agent
-- Date: 2025-06-08T00:00:00Z
-- Description: Provides idempotent seed data for the customer domain tables to support integration testing.

WITH upsert_address AS (
    INSERT INTO postal_address (line1, line2, city, state, postal_code, country)
    VALUES ('123 Market Street', 'Suite 500', 'San Francisco', 'CA', '94105', 'US')
    ON CONFLICT (line1, line2, city, state, postal_code, country)
        DO UPDATE SET line1 = EXCLUDED.line1
    RETURNING postal_address_id
),
resolved_address AS (
    SELECT postal_address_id FROM upsert_address
    UNION ALL
    SELECT postal_address_id
    FROM postal_address
    WHERE line1 = '123 Market Street'
      AND COALESCE(line2, '') = 'Suite 500'
      AND city = 'San Francisco'
      AND state = 'CA'
      AND postal_code = '94105'
      AND country = 'US'
    LIMIT 1
),
upsert_privacy AS (
    INSERT INTO privacy_settings (marketing_emails_enabled, two_factor_enabled)
    VALUES (TRUE, TRUE)
    ON CONFLICT (marketing_emails_enabled, two_factor_enabled)
        DO UPDATE SET marketing_emails_enabled = EXCLUDED.marketing_emails_enabled
    RETURNING privacy_settings_id
),
resolved_privacy AS (
    SELECT privacy_settings_id FROM upsert_privacy
    UNION ALL
    SELECT privacy_settings_id
    FROM privacy_settings
    WHERE marketing_emails_enabled = TRUE AND two_factor_enabled = TRUE
    LIMIT 1
)
INSERT INTO customer (customer_id, first_name, middle_name, last_name, address_id, privacy_settings_id)
VALUES ('11111111-2222-3333-4444-555555555555', 'Ada', 'Lovelace', 'Byron',
        (SELECT postal_address_id FROM resolved_address LIMIT 1),
        (SELECT privacy_settings_id FROM resolved_privacy LIMIT 1))
ON CONFLICT (customer_id)
    DO UPDATE SET updated_at = NOW();

INSERT INTO customer_email (customer_id, email)
VALUES
    ('11111111-2222-3333-4444-555555555555', 'ada.lovelace@example.com'),
    ('11111111-2222-3333-4444-555555555555', 'ada@analyticalengines.io')
ON CONFLICT (customer_id, email) DO NOTHING;

INSERT INTO customer_phone_number (customer_id, phone_type, phone_number)
VALUES
    ('11111111-2222-3333-4444-555555555555', 'mobile', '+14155550100'),
    ('11111111-2222-3333-4444-555555555555', 'work', '+14155550101')
ON CONFLICT (customer_id, phone_number) DO NOTHING;

-- Smoke test: SELECT * FROM customer_profile_view WHERE customer_id = '11111111-2222-3333-4444-555555555555';
