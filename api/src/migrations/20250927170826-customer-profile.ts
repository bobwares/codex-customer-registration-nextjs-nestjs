/**
 * App: Customer Registration
 * Package: api/src/migrations
 * File: 20250927170826-customer-profile.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-27T17:08:26Z
 * Exports: CustomerProfile20250927170826
 * Description: Creates the customer profile domain tables, enumerations, and supporting indexes derived
 *              from the CustomerProfile JSON schema, ensuring reversible TypeORM migrations.
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerProfile20250927170826 implements MigrationInterface {
  public readonly name = 'CustomerProfile20250927170826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(
      "CREATE TYPE \"customer_profile_phone_numbers_type_enum\" AS ENUM ('mobile','home','work','other')",
    );
    await queryRunner.query(
      `CREATE TABLE "customer" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "first_name" text NOT NULL,
        "middle_name" text,
        "last_name" text NOT NULL,
        "marketing_emails_enabled" boolean NOT NULL,
        "two_factor_enabled" boolean NOT NULL,
        CONSTRAINT "pk_customer_profiles" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_profile_addresses" (
        "customer_profile_id" uuid NOT NULL,
        "line1" text NOT NULL,
        "line2" text,
        "city" text NOT NULL,
        "state" text NOT NULL,
        "postal_code" text NOT NULL,
        "country" character varying(2) NOT NULL,
        CONSTRAINT "pk_customer_profile_addresses" PRIMARY KEY ("customer_profile_id"),
        CONSTRAINT "fk_customer_profile_addresses__customer_profiles__customer_profile_id"
          FOREIGN KEY ("customer_profile_id")
          REFERENCES "customer"("id")
          ON DELETE CASCADE
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_profile_emails" (
        "id" BIGSERIAL NOT NULL,
        "customer_profile_id" uuid NOT NULL,
        "email" character varying(320) NOT NULL,
        CONSTRAINT "pk_customer_profile_emails" PRIMARY KEY ("id"),
        CONSTRAINT "uq_customer_profile_emails__customer_profile_id__email"
          UNIQUE ("customer_profile_id", "email"),
        CONSTRAINT "fk_customer_profile_emails__customer_profiles__customer_profile_id"
          FOREIGN KEY ("customer_profile_id")
          REFERENCES "customer_profiles"("id")
          ON DELETE CASCADE
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_customer_profile_emails__customer_profile_id"
        ON "customer_profile_emails" ("customer_profile_id")`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_profile_phone_numbers" (
        "id" BIGSERIAL NOT NULL,
        "customer_profile_id" uuid NOT NULL,
        "type" "customer_profile_phone_numbers_type_enum" NOT NULL,
        "number" character varying(16) NOT NULL,
        CONSTRAINT "pk_customer_profile_phone_numbers" PRIMARY KEY ("id"),
        CONSTRAINT "fk_customer_profile_phone_numbers___customer_profile_id"
          FOREIGN KEY ("customer_profile_id")
          REFERENCES "customer_profiles"("id")
          ON DELETE CASCADE
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_customer_profile_phone_numbers__customer_profile_id"
        ON "customer_profile_phone_numbers" ("customer_profile_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "ix_customer_profile_phone_numbers__customer_profile_id"',
    );
    await queryRunner.query('DROP TABLE IF EXISTS "customer_profile_phone_numbers"');
    await queryRunner.query(
      'DROP INDEX IF EXISTS "ix_customer_profile_emails__customer_profile_id"',
    );
    await queryRunner.query('DROP TABLE IF EXISTS "customer_profile_emails"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_profile_addresses"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_profiles"');
    await queryRunner.query('DROP TYPE IF EXISTS "customer_profile_phone_numbers_type_enum"');
  }
}
