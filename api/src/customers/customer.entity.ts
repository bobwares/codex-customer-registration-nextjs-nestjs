/**
 * App: Customer Registration
 * Package: api.customers
 * File: customer.entity.ts
 * Version: 0.1.1
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: Customer
 * Description: Declares the Customer aggregate root entity along with relationships to
 *              addresses, privacy preferences, emails, and phone numbers for persistence.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'middle_name', nullable: true })
  middleName?: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @ManyToOne(() => PostalAddress, (address) => address.customers, {
    cascade: true,
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'address_id' })
  address?: PostalAddress | null;

  @ManyToOne(() => PrivacySettings, (privacy) => privacy.customers, {
    cascade: true,
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'privacy_settings_id' })
  privacySettings?: PrivacySettings | null;

  @OneToMany(() => CustomerEmail, (email) => email.customer, {
    cascade: true,
    eager: true,
  })
  emails!: CustomerEmail[];

  @OneToMany(() => CustomerPhoneNumber, (phoneNumber) => phoneNumber.customer, {
    cascade: true,
    eager: true,
  })
  phoneNumbers!: CustomerPhoneNumber[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
