/**
 * App: Customer Registration
 * Package: api
 * File: customer.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: Customer
 * Description: Core customer aggregate representing persisted registration
 *              data and related contact details.
 */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';

@Entity({ name: 'customer', schema: 'customer_domain' })
export class Customer {
  @PrimaryGeneratedColumn('uuid', { name: 'customer_id' })
  id!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName!: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 255, nullable: true })
  middleName!: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName!: string;

  @ManyToOne(() => PostalAddress, { cascade: ['insert', 'update'], nullable: true, eager: true })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address: PostalAddress | null = null;

  @RelationId((customer: Customer) => customer.address)
  addressId?: number | null;

  @ManyToOne(() => PrivacySettings, {
    cascade: ['insert', 'update'],
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'privacy_settings_id', referencedColumnName: 'id' })
  privacySettings!: PrivacySettings;

  @RelationId((customer: Customer) => customer.privacySettings)
  privacySettingsId!: number;

  @OneToMany(() => CustomerEmail, (email) => email.customer, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  emails!: CustomerEmail[];

  @OneToMany(() => CustomerPhoneNumber, (phone) => phone.customer, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  phoneNumbers!: CustomerPhoneNumber[];
}
