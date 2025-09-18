/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer.entity.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: Customer
 * Description: TypeORM aggregate root representing a registered customer.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { CustomerAddress } from './customer-address.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhone } from './customer-phone.entity';

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

  @Column({ name: 'marketing_emails_enabled', default: false })
  marketingEmailsEnabled!: boolean;

  @Column({ name: 'two_factor_enabled', default: false })
  twoFactorEnabled!: boolean;

  @OneToMany(() => CustomerEmail, (email) => email.customer, { cascade: true })
  emails?: CustomerEmail[];

  @OneToMany(() => CustomerPhone, (phone) => phone.customer, { cascade: true })
  phones?: CustomerPhone[];

  @OneToOne(() => CustomerAddress, (address) => address.customer, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'customerId' })
  address?: CustomerAddress;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
