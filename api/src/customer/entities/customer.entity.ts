/**
 * # App: Customer Registration API
 * # Package: api/src/customer/entities
 * # File: customer.entity.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: CustomerEntity
 * # Description: TypeORM aggregate root for customer registration profiles, including address and contact relationships.
 */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CustomerEmailEntity } from './customer-email.entity';
import { CustomerPhoneNumberEntity } from './customer-phone-number.entity';
import { PostalAddressEntity } from './postal-address.entity';
import { PrivacySettingsEntity } from './privacy-settings.entity';

@Index('idx_customer_address_id', ['addressId'])
@Index('idx_customer_privacy_settings_id', ['privacySettingsId'])
@Entity({ name: 'customer', schema: 'customer_domain' })
export class CustomerEntity {
  @PrimaryColumn('uuid', { name: 'customer_id' })
  customerId!: string;

  @Column({ type: 'varchar', name: 'first_name', length: 255 })
  firstName!: string;

  @Column({ type: 'varchar', name: 'middle_name', length: 255, nullable: true })
  middleName: string | null = null;

  @Column({ type: 'varchar', name: 'last_name', length: 255 })
  lastName!: string;

  @Column({ type: 'integer', name: 'address_id', nullable: true })
  addressId: number | null = null;

  @Column({ type: 'integer', name: 'privacy_settings_id' })
  privacySettingsId!: number;

  @ManyToOne(() => PostalAddressEntity, (address) => address.customers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'addressId' })
  address?: PostalAddressEntity | null;

  @ManyToOne(() => PrivacySettingsEntity, (privacy) => privacy.customers, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'privacy_settings_id',
    referencedColumnName: 'privacySettingsId',
  })
  privacySettings!: PrivacySettingsEntity;

  @OneToMany(() => CustomerEmailEntity, (email) => email.customer, {
    cascade: ['insert', 'update'],
  })
  emails!: CustomerEmailEntity[];

  @OneToMany(() => CustomerPhoneNumberEntity, (phone) => phone.customer, {
    cascade: ['insert', 'update'],
  })
  phoneNumbers!: CustomerPhoneNumberEntity[];
}
