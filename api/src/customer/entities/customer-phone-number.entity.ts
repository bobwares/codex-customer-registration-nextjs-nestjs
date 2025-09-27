/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-phone-number.entity.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-27T17:08:26Z
 * Exports: CustomerPhoneNumber, CustomerPhoneType
 * Description: Represents a customer's phone number with enum-backed type and relation to the customer
 *              profile aggregate.
 */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';

export enum CustomerPhoneType {
  MOBILE = 'mobile',
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}

@Entity({ name: 'customer_profile_phone_numbers' })
@Index('ix_customer_profile_phone_numbers__customer_profile_id', ['customerProfileId'])
export class CustomerPhoneNumber {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  public id!: string;

  @Column({
    type: 'enum',
    enum: CustomerPhoneType,
    enumName: 'customer_profile_phone_numbers_type_enum',
    name: 'type',
  })
  public type!: CustomerPhoneType;

  @Column('character varying', { name: 'number', length: 16 })
  public number!: string;

  @ManyToOne(() => CustomerProfile, (profile) => profile.phoneNumbers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_profile_id', referencedColumnName: 'id' })
  public customerProfile!: CustomerProfile;

  @RelationId((phone: CustomerPhoneNumber) => phone.customerProfile)
  public customerProfileId!: string;
}
