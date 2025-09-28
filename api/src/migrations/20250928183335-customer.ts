import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CustomerDomainSchema20250928183335 implements MigrationInterface {
  name = 'CustomerDomainSchema20250928183335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('customer_domain', true);

    await queryRunner.createTable(
      new Table({
        schema: 'customer_domain',
        name: 'postal_addresses',
        columns: [
          {
            name: 'address_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'line1',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'line2',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'postal_code',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '2',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        schema: 'customer_domain',
        name: 'privacy_settings',
        columns: [
          {
            name: 'privacy_settings_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'marketing_emails_enabled',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'two_factor_enabled',
            type: 'boolean',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        schema: 'customer_domain',
        name: 'customers',
        columns: [
          {
            name: 'customer_id',
            type: 'uuid',
            isPrimary: true,
            default: () => 'gen_random_uuid()',
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'middle_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'address_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'privacy_settings_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: () => 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: () => 'now()',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_customers__postal_addresses__address_id',
            columnNames: ['address_id'],
            referencedSchema: 'customer_domain',
            referencedTableName: 'postal_addresses',
            referencedColumnNames: ['address_id'],
            onDelete: 'SET NULL',
          }),
          new TableForeignKey({
            name: 'fk_customers__privacy_settings__privacy_settings_id',
            columnNames: ['privacy_settings_id'],
            referencedSchema: 'customer_domain',
            referencedTableName: 'privacy_settings',
            referencedColumnNames: ['privacy_settings_id'],
            onDelete: 'SET NULL',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'ix_customers__address_id',
            columnNames: ['address_id'],
          }),
          new TableIndex({
            name: 'ix_customers__privacy_settings_id',
            columnNames: ['privacy_settings_id'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        schema: 'customer_domain',
        name: 'customer_emails',
        columns: [
          {
            name: 'email_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '320',
            isNullable: false,
          },
          {
            name: 'is_primary',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: () => 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'uq_customer_emails__customer_id_email',
            columnNames: ['customer_id', 'email'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_customer_emails__customers__customer_id',
            columnNames: ['customer_id'],
            referencedSchema: 'customer_domain',
            referencedTableName: 'customers',
            referencedColumnNames: ['customer_id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'ix_customer_emails__customer_id',
            columnNames: ['customer_id'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'customer_domain.customer_emails',
      new TableIndex({
        name: 'idx_customer_email_primary',
        columnNames: ['customer_id'],
        where: '"is_primary" IS TRUE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        schema: 'customer_domain',
        name: 'customer_phone_numbers',
        columns: [
          {
            name: 'phone_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: () => 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'uq_customer_phone_numbers__customer_id_number',
            columnNames: ['customer_id', 'number'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_customer_phone_numbers__customers__customer_id',
            columnNames: ['customer_id'],
            referencedSchema: 'customer_domain',
            referencedTableName: 'customers',
            referencedColumnNames: ['customer_id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'ix_customer_phone_numbers__customer_id',
            columnNames: ['customer_id'],
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'customer_domain.customer_emails',
      'idx_customer_email_primary',
    );
    await queryRunner.dropTable('customer_domain.customer_phone_numbers');
    await queryRunner.dropTable('customer_domain.customer_emails');
    await queryRunner.dropTable('customer_domain.customers');
    await queryRunner.dropTable('customer_domain.privacy_settings');
    await queryRunner.dropTable('customer_domain.postal_addresses');
    await queryRunner.dropSchema('customer_domain', true);
  }
}
