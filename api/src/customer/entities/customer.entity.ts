/**
 * App: Customer Registration
 * Package: api
 * File: customer.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-24T22:04:40Z
 * Exports: Customer
 * Description: TypeORM entity mapping for the customer table including relations to addresses, privacy settings, emails, and phone numbers.
 */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostalAddress } from './postal_address.entity';
import { PrivacySettings } from './privacy_settings.entity';
import { CustomerEmail } from './customer_email.entity';
import { CustomerPhoneNumber } from './customer_phone_number.entity';

@Entity({ name: 'customer', schema: 'customer_domain' })
export class Customer {
  @PrimaryGeneratedColumn('uuid', { name: 'customer_id' })
  customer_id!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  first_name!: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 255, nullable: true })
  middle_name?: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  last_name!: string;

  @Index('idx_customer_address_id')
  @Column({ name: 'address_id', type: 'integer', nullable: true })
  address_id?: number | null;

  @Index('idx_customer_privacy_settings_id')
  @Column({ name: 'privacy_settings_id', type: 'integer', nullable: true })
  privacy_settings_id?: number | null;

  @ManyToOne(() => PostalAddress, (address) => address.customers, { nullable: true })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'postal_address_id' })
  address?: PostalAddress | null;

  @ManyToOne(() => PrivacySettings, (settings) => settings.customers, { nullable: true })
  @JoinColumn({ name: 'privacy_settings_id', referencedColumnName: 'privacy_settings_id' })
  privacySettings?: PrivacySettings | null;

  @OneToMany(() => CustomerEmail, (email) => email.customer)
  emails?: CustomerEmail[];

  @OneToMany(() => CustomerPhoneNumber, (phone) => phone.customer)
  phoneNumbers?: CustomerPhoneNumber[];
}
