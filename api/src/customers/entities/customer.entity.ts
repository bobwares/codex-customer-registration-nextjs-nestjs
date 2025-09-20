/**
 * App: Customer Registration
 * Package: api/src/customers/entities
 * File: customer.entity.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: Customer, CustomerPhoneNumber, CustomerPostalAddress, CustomerPrivacySettings
 * Description: TypeORM entity mapping for the customer domain object with
 *              JSON-backed nested structures stored in PostgreSQL.
 */
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import type { ColumnOptions } from 'typeorm';

const isSqlite = (process.env.DATABASE_TYPE ?? '').toLowerCase() === 'sqlite';

const emailColumnOptions: ColumnOptions = isSqlite
  ? { type: 'simple-json', nullable: false }
  : { type: 'text', array: true };

const jsonColumnOptions: ColumnOptions = isSqlite
  ? { type: 'simple-json', nullable: true }
  : { type: 'jsonb', nullable: true };

const requiredJsonColumnOptions: ColumnOptions = isSqlite
  ? { type: 'simple-json', nullable: false }
  : { type: 'jsonb', nullable: false };

export type CustomerPhoneNumber = {
  type: string;
  number: string;
};

export interface CustomerPostalAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerPrivacySettings {
  marketingEmailsEnabled: boolean;
  twoFactorEnabled: boolean;
}

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'middle_name', nullable: true })
  middleName?: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column(emailColumnOptions)
  emails!: string[];

  @Column({ ...jsonColumnOptions, name: 'phone_numbers' })
  phoneNumbers?: CustomerPhoneNumber[];

  @Column(jsonColumnOptions)
  address?: CustomerPostalAddress;

  @Column({ ...requiredJsonColumnOptions, name: 'privacy_settings' })
  privacySettings!: CustomerPrivacySettings;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
