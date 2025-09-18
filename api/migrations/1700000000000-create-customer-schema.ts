/**
 * App: Customer Registration
 * Package: api.migrations
 * File: 1700000000000-create-customer-schema.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CreateCustomerSchema1700000000000
 * Description: TypeORM migration aligning the runtime schema with the normalized SQL DDL.
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS postal_address (
        postal_address_id SERIAL PRIMARY KEY,
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255),
        city VARCHAR(120) NOT NULL,
        state VARCHAR(80) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country CHAR(2) NOT NULL,
        UNIQUE (line1, line2, city, state, postal_code, country)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS privacy_settings (
        privacy_settings_id SERIAL PRIMARY KEY,
        marketing_emails_enabled BOOLEAN NOT NULL,
        two_factor_enabled BOOLEAN NOT NULL,
        UNIQUE (marketing_emails_enabled, two_factor_enabled)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer (
        customer_id UUID PRIMARY KEY,
        first_name VARCHAR(120) NOT NULL,
        middle_name VARCHAR(120),
        last_name VARCHAR(120) NOT NULL,
        address_id INTEGER REFERENCES postal_address (postal_address_id) ON DELETE SET NULL,
        privacy_settings_id INTEGER REFERENCES privacy_settings (privacy_settings_id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customer_address_id ON customer (address_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customer_privacy_settings_id ON customer (privacy_settings_id);`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_email (
        customer_email_id SERIAL PRIMARY KEY,
        customer_id UUID NOT NULL REFERENCES customer (customer_id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (customer_id, email)
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customer_email_customer_id ON customer_email (customer_id);`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_phone_number (
        customer_phone_number_id SERIAL PRIMARY KEY,
        customer_id UUID NOT NULL REFERENCES customer (customer_id) ON DELETE CASCADE,
        phone_type VARCHAR(16) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (customer_id, phone_number)
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customer_phone_customer_id ON customer_phone_number (customer_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS customer_phone_number CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS customer_email CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS customer CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS privacy_settings CASCADE;');
    await queryRunner.query('DROP TABLE IF EXISTS postal_address CASCADE;');
  }
}
