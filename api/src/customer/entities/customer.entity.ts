/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer.entity.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:59:00Z
 * Exports: CustomerEntity
 * Description: Aggregate TypeORM entity representing customers with related address, privacy, email, and phone records.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEmailEntity } from './customer-email.entity';
import { CustomerPhoneNumberEntity } from './customer-phone-number.entity';
import { PostalAddressEntity } from './postal-address.entity';
import { PrivacySettingsEntity } from './privacy-settings.entity';

const TIMESTAMP_COLUMN_TYPE: 'timestamptz' | 'datetime' =
  process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz';

@Entity({ name: 'customer', schema: 'customer_domain' })
export class CustomerEntity {
  @PrimaryColumn('uuid', { name: 'customer_id' })
  public customerId!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  public firstName!: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 255, nullable: true })
  public middleName?: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  public lastName!: string;

  @CreateDateColumn({ name: 'created_at', type: TIMESTAMP_COLUMN_TYPE })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: TIMESTAMP_COLUMN_TYPE })
  public updatedAt!: Date;

  @OneToOne(() => PostalAddressEntity, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'addressId' })
  public address?: PostalAddressEntity | null;

  @OneToOne(() => PrivacySettingsEntity, {
    cascade: true,
    eager: true,
    nullable: false,
  })
  @JoinColumn({
    name: 'privacy_settings_id',
    referencedColumnName: 'privacySettingsId',
  })
  public privacySettings!: PrivacySettingsEntity;

  @OneToMany(() => CustomerEmailEntity, (email) => email.customer, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  public emails!: CustomerEmailEntity[];

  @OneToMany(() => CustomerPhoneNumberEntity, (phone) => phone.customer, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  public phoneNumbers!: CustomerPhoneNumberEntity[];
}
