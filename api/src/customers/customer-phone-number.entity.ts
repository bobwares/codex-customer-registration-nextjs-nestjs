/**
 * App: Customer Registration
 * Package: api.customers
 * File: customer-phone-number.entity.ts
 * Version: 0.1.1
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CustomerPhoneNumber
 * Description: Entity describing a phone number linked to a customer with type metadata and
 *              cascading lifecycle behaviour.
 */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'customer_phone_number' })
export class CustomerPhoneNumber {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Customer, (customer) => customer.phoneNumbers, {
    onDelete: 'CASCADE',
  })
  customer!: Customer;

  @Column({ name: 'phone_type', type: 'varchar', length: 16 })
  type!: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  number!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
