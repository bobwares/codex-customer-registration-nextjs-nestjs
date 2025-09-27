/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-profile.entity.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-27T17:08:26Z
 * Exports: CustomerProfile
 * Description: Defines the CustomerProfile aggregate root with relationships to emails, phone numbers,
 *              and address entities for persistence via TypeORM.
 */
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerAddress } from './customer-address.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';

@Entity({ name: 'customer_profiles' })
export class CustomerProfile {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id!: string;

  @Column('text', { name: 'first_name' })
  public firstName!: string;

  @Column('text', { name: 'middle_name', nullable: true })
  public middleName?: string | null;

  @Column('text', { name: 'last_name' })
  public lastName!: string;

  @Column('boolean', { name: 'marketing_emails_enabled' })
  public marketingEmailsEnabled!: boolean;

  @Column('boolean', { name: 'two_factor_enabled' })
  public twoFactorEnabled!: boolean;

  @OneToMany(() => CustomerEmail, (email) => email.customerProfile, {
    cascade: ['insert', 'update'],
  })
  public emails!: CustomerEmail[];

  @OneToMany(() => CustomerPhoneNumber, (phone) => phone.customerProfile, {
    cascade: ['insert', 'update'],
  })
  public phoneNumbers?: CustomerPhoneNumber[];

  @OneToOne(() => CustomerAddress, (address) => address.customerProfile, {
    cascade: ['insert', 'update'],
  })
  public address?: CustomerAddress | null;
}
