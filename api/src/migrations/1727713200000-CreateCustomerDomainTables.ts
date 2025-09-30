/**
 * # App: Customer Registration API
 * # Package: api/src/migrations
 * # File: 1727713200000-CreateCustomerDomainTables.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Description: TypeORM migration establishing the customer_domain schema, tables, constraints, and indexes.
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerDomainTables1727713200000 implements MigrationInterface {
  public readonly name = 'CreateCustomerDomainTables1727713200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS customer_domain`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_domain.postal_address (
        address_id SERIAL PRIMARY KEY,
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country CHAR(2) NOT NULL,
        CONSTRAINT ck_postal_address_country CHECK (char_length(country) = 2)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_domain.privacy_settings (
        privacy_settings_id SERIAL PRIMARY KEY,
        marketing_emails_enabled BOOLEAN NOT NULL,
        two_factor_enabled BOOLEAN NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_domain.customer (
        customer_id UUID PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        address_id INTEGER REFERENCES customer_domain.postal_address(address_id) ON DELETE SET NULL,
        privacy_settings_id INTEGER NOT NULL REFERENCES customer_domain.privacy_settings(privacy_settings_id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_address_id
        ON customer_domain.customer (address_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_privacy_settings_id
        ON customer_domain.customer (privacy_settings_id)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_domain.customer_email (
        email_id SERIAL PRIMARY KEY,
        customer_id UUID NOT NULL REFERENCES customer_domain.customer(customer_id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        CONSTRAINT uq_customer_email_customer_id_email UNIQUE (customer_id, email)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_email_customer_id
        ON customer_domain.customer_email (customer_id)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_domain.customer_phone_number (
        phone_id SERIAL PRIMARY KEY,
        customer_id UUID NOT NULL REFERENCES customer_domain.customer(customer_id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        number VARCHAR(20) NOT NULL,
        CONSTRAINT uq_customer_phone_number_customer_id_number UNIQUE (customer_id, number)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_phone_number_customer_id
        ON customer_domain.customer_phone_number (customer_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS customer_domain.customer_phone_number`);
    await queryRunner.query(`DROP TABLE IF EXISTS customer_domain.customer_email`);
    await queryRunner.query(`DROP TABLE IF EXISTS customer_domain.customer`);
    await queryRunner.query(`DROP TABLE IF EXISTS customer_domain.privacy_settings`);
    await queryRunner.query(`DROP TABLE IF EXISTS customer_domain.postal_address`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS customer_domain`);
  }
}
