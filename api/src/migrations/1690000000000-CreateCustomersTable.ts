/**
 * App: Customer Registration
 * Package: api/src/migrations
 * File: 1690000000000-CreateCustomersTable.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: CreateCustomersTable1690000000000
 * Description: Database migration creating the customers table with JSONB
 *              fields for nested data structures.
 */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersTable1690000000000 implements MigrationInterface {
  name = 'CreateCustomersTable1690000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id uuid PRIMARY KEY,
        first_name varchar(255) NOT NULL,
        middle_name varchar(255),
        last_name varchar(255) NOT NULL,
        emails text[] NOT NULL,
        phone_numbers jsonb,
        address jsonb,
        privacy_settings jsonb NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz DEFAULT now() NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS customers;');
  }
}
