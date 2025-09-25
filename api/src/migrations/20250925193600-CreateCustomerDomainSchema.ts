/**
 * App: Customer Registration
 * Package: api/src/migrations
 * File: 20250925193600-CreateCustomerDomainSchema.ts
 * Version: 0.1.3
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: CreateCustomerDomainSchema1695660960
 * Description: Establishes customer domain tables, relationships, and projection view required by the service layer.
 */
import type { DataSourceOptions, MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex, TableUnique } from 'typeorm';

function resolveSchema(queryRunner: QueryRunner): string | undefined {
  const options = queryRunner.connection.options as DataSourceOptions & { schema?: string };
  if (options.schema && options.schema.length > 0) {
    return options.schema;
  }
  if (process.env.DATABASE_SCHEMA && process.env.DATABASE_SCHEMA.length > 0) {
    return process.env.DATABASE_SCHEMA;
  }
  return undefined;
}

function tablePath(schema: string | undefined, identifier: string): string {
  return schema ? `${schema}.${identifier}` : identifier;
}

function withSchema(schema: string | undefined, identifier: string): string {
  return schema ? `"${schema}"."${identifier}"` : `"${identifier}"`;
}

export class CreateCustomerDomainSchema1695660960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = resolveSchema(queryRunner);
    const driverType = (queryRunner.connection.options as { type?: string }).type ?? 'postgres';
    const timestampType = driverType === 'postgres' ? 'timestamptz' : 'timestamp';

    if (schema && driverType === 'postgres') {
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    }

    await queryRunner.createTable(
      new Table({
        name: 'postal_addresses',
        columns: [
          {
            name: 'address_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'line1', type: 'varchar', length: '255', isNullable: false },
          { name: 'line2', type: 'varchar', length: '255', isNullable: true },
          { name: 'city', type: 'varchar', length: '120', isNullable: false },
          { name: 'state', type: 'varchar', length: '80', isNullable: false },
          { name: 'postal_code', type: 'varchar', length: '20', isNullable: false },
          { name: 'country', type: 'char', length: '2', isNullable: false },
          { name: 'created_at', type: timestampType, default: 'CURRENT_TIMESTAMP', isNullable: false },
          {
            name: 'updated_at',
            type: timestampType,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        ...(schema ? { schema } : {}),
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'privacy_settings',
        columns: [
          {
            name: 'privacy_settings_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'marketing_emails_enabled', type: 'boolean', isNullable: false },
          { name: 'two_factor_enabled', type: 'boolean', isNullable: false },
          { name: 'created_at', type: timestampType, default: 'CURRENT_TIMESTAMP', isNullable: false },
          {
            name: 'updated_at',
            type: timestampType,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        ...(schema ? { schema } : {}),
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'customer_id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'first_name', type: 'varchar', length: '120', isNullable: false },
          { name: 'middle_name', type: 'varchar', length: '120', isNullable: true },
          { name: 'last_name', type: 'varchar', length: '120', isNullable: false },
          { name: 'email', type: 'varchar', length: '255', isNullable: false },
          { name: 'address_id', type: 'integer', isNullable: true },
          { name: 'privacy_settings_id', type: 'integer', isNullable: true },
          { name: 'created_at', type: timestampType, default: 'CURRENT_TIMESTAMP', isNullable: false },
          {
            name: 'updated_at',
            type: timestampType,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        uniques: [new TableUnique({ name: 'ux_customers_email', columnNames: ['email'] })],
        indices: [
          new TableIndex({ name: 'ix_customers_address_id', columnNames: ['address_id'] }),
          new TableIndex({ name: 'ix_customers_privacy_settings_id', columnNames: ['privacy_settings_id'] }),
        ],
        ...(schema ? { schema } : {}),
      }),
    );

    await queryRunner.createForeignKeys(
      tablePath(schema, 'customers'),
      [
        new TableForeignKey({
          name: 'fk_customers_address_id',
          columnNames: ['address_id'],
          referencedTableName: 'postal_addresses',
          referencedColumnNames: ['address_id'],
          onDelete: 'SET NULL',
          ...(schema ? { referencedSchema: schema } : {}),
        }),
        new TableForeignKey({
          name: 'fk_customers_privacy_settings_id',
          columnNames: ['privacy_settings_id'],
          referencedTableName: 'privacy_settings',
          referencedColumnNames: ['privacy_settings_id'],
          onDelete: 'SET NULL',
          ...(schema ? { referencedSchema: schema } : {}),
        }),
      ],
    );

    await queryRunner.createTable(
      new Table({
        name: 'customer_emails',
        columns: [
          {
            name: 'email_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'customer_id', type: 'uuid', isNullable: false },
          { name: 'email', type: 'varchar', length: '255', isNullable: false },
          { name: 'is_primary', type: 'boolean', isNullable: false },
          { name: 'created_at', type: timestampType, default: 'CURRENT_TIMESTAMP', isNullable: false },
        ],
        uniques: [
          new TableUnique({
            name: 'ux_customer_emails_customer_id_email',
            columnNames: ['customer_id', 'email'],
          }),
        ],
        indices: [
          new TableIndex({ name: 'ix_customer_emails_customer_id', columnNames: ['customer_id'] }),
        ],
        ...(schema ? { schema } : {}),
      }),
    );

    await queryRunner.createForeignKey(
      tablePath(schema, 'customer_emails'),
      new TableForeignKey({
        name: 'fk_customer_emails_customer_id',
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['customer_id'],
        onDelete: 'CASCADE',
        ...(schema ? { referencedSchema: schema } : {}),
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'customer_phone_numbers',
        columns: [
          {
            name: 'phone_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'customer_id', type: 'uuid', isNullable: false },
          { name: 'type', type: 'varchar', length: '20', isNullable: false },
          { name: 'number', type: 'varchar', length: '20', isNullable: false },
          { name: 'extension', type: 'varchar', length: '10', isNullable: true },
          { name: 'created_at', type: timestampType, default: 'CURRENT_TIMESTAMP', isNullable: false },
        ],
        uniques: [
          new TableUnique({
            name: 'ux_customer_phone_numbers_customer_id_type_number',
            columnNames: ['customer_id', 'type', 'number'],
          }),
        ],
        indices: [
          new TableIndex({ name: 'ix_customer_phone_numbers_customer_id', columnNames: ['customer_id'] }),
        ],
        ...(schema ? { schema } : {}),
      }),
    );

    await queryRunner.createForeignKey(
      tablePath(schema, 'customer_phone_numbers'),
      new TableForeignKey({
        name: 'fk_customer_phone_numbers_customer_id',
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['customer_id'],
        onDelete: 'CASCADE',
        ...(schema ? { referencedSchema: schema } : {}),
      }),
    );

    const viewName = withSchema(schema, 'customer_profile_view');
    const customers = withSchema(schema, 'customers');
    const addresses = withSchema(schema, 'postal_addresses');
    const privacy = withSchema(schema, 'privacy_settings');

    await queryRunner.query(
      `CREATE VIEW ${viewName} AS
      SELECT
        c.customer_id,
        c.name,
        c.first_name,
        c.middle_name,
        c.last_name,
        c.email,
        a.line1,
        a.line2,
        a.city,
        a.state,
        a.postal_code,
        a.country,
        p.marketing_emails_enabled,
        p.two_factor_enabled
      FROM ${customers} c
      LEFT JOIN ${addresses} a ON a.address_id = c.address_id
      LEFT JOIN ${privacy} p ON p.privacy_settings_id = c.privacy_settings_id`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema = resolveSchema(queryRunner);
    const viewName = withSchema(schema, 'customer_profile_view');

    await queryRunner.query(`DROP VIEW IF EXISTS ${viewName}`);
    await queryRunner.dropTable(tablePath(schema, 'customer_phone_numbers'));
    await queryRunner.dropTable(tablePath(schema, 'customer_emails'));
    await queryRunner.dropTable(tablePath(schema, 'customers'));
    await queryRunner.dropTable(tablePath(schema, 'privacy_settings'));
    await queryRunner.dropTable(tablePath(schema, 'postal_addresses'));
  }
}
