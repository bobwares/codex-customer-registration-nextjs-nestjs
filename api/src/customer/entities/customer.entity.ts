/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer.entity.ts
 * Version: 0.1.2
 * Turns: 3, 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: CustomerEntity
 * Description: Represents customer records and relations to addresses, privacy settings, emails, and phone numbers.
 */
import type { EntityOptions } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEmailEntity } from './customer_email.entity';
import { CustomerPhoneNumberEntity } from './customer_phone_number.entity';
import { PostalAddressEntity } from './postal_address.entity';
import { PrivacySettingsEntity } from './privacy_settings.entity';

const schemaName = process.env.DATABASE_SCHEMA;
const entityOptions: EntityOptions = {
  name: 'customers',
  ...(schemaName ? { schema: schemaName } : {}),
};

const timestampColumnType = process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz';

@Entity(entityOptions)
@Unique('ux_customers_email', ['email'])
@Index('ix_customers_address_id', ['addressId'])
@Index('ix_customers_privacy_settings_id', ['privacySettingsId'])
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'customer_id' })
  public customerId!: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  public name!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 120 })
  public firstName!: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 120, nullable: true })
  public middleName?: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 120 })
  public lastName!: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  public email!: string;

  @Column({ name: 'address_id', type: 'integer', nullable: true })
  public addressId?: number | null;

  @Column({ name: 'privacy_settings_id', type: 'integer', nullable: true })
  public privacySettingsId?: number | null;

  @CreateDateColumn({ name: 'created_at', type: timestampColumnType })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: timestampColumnType })
  public updatedAt!: Date;

  @ManyToOne(() => PostalAddressEntity, (address) => address.customers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'addressId' })
  public address?: PostalAddressEntity | null;

  @ManyToOne(() => PrivacySettingsEntity, (privacy) => privacy.customers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'privacy_settings_id', referencedColumnName: 'privacySettingsId' })
  public privacySettings?: PrivacySettingsEntity | null;

  @OneToMany(() => CustomerEmailEntity, (email) => email.customer)
  public emails?: CustomerEmailEntity[];

  @OneToMany(() => CustomerPhoneNumberEntity, (phoneNumber) => phoneNumber.customer)
  public phoneNumbers?: CustomerPhoneNumberEntity[];
}
