/**
 * # App: Customer Registration
 * # Package: api.customers.entities
 * # File: src/customers/entities/customer.entity.ts
 * # Version: 0.1.2
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T20:10:00Z
 * # Exports: Customer
 * # Description: Root customer aggregate entity with relations to addresses, privacy settings, emails, and phone numbers.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';
import { TIMESTAMP_COLUMN_TYPE, UUID_COLUMN_TYPE } from './entity-column-types';
import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';

@Entity({ name: 'customer', schema: 'customer_domain' })
@Index('idx_customer_address_id', ['addressId'])
@Index('idx_customer_privacy_settings_id', ['privacySettingsId'])
export class Customer {
  @PrimaryColumn({ name: 'customer_id', type: UUID_COLUMN_TYPE })
  customerId!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 120 })
  firstName!: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 120, nullable: true })
  middleName?: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 120 })
  lastName!: string;

  @Column({ name: 'address_id', type: 'integer', nullable: true })
  addressId?: number | null;

  @Column({ name: 'privacy_settings_id', type: 'integer', nullable: true })
  privacySettingsId?: number | null;

  @CreateDateColumn({ name: 'created_at', type: TIMESTAMP_COLUMN_TYPE })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: TIMESTAMP_COLUMN_TYPE })
  updatedAt!: Date;

  @ManyToOne(() => PostalAddress, (address) => address.customers, {
    cascade: ['insert', 'update'],
    eager: false,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'address_id' })
  postalAddress?: PostalAddress | null;

  @ManyToOne(() => PrivacySettings, (settings) => settings.customers, {
    cascade: ['insert', 'update'],
    eager: false,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'privacy_settings_id' })
  privacySettings?: PrivacySettings | null;

  @OneToMany(() => CustomerEmail, (email) => email.customer, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  emails!: CustomerEmail[];

  @OneToMany(() => CustomerPhoneNumber, (phone) => phone.customer, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  phoneNumbers!: CustomerPhoneNumber[];
}
