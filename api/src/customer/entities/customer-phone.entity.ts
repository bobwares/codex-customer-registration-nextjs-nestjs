/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-phone.entity.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerPhone
 * Description: TypeORM entity modeling customer phone numbers and their types.
 */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'customer_phone_numbers' })
export class CustomerPhone {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'customer_id' })
  customerId!: string;

  @Column({ name: 'phone_type' })
  phoneType!: string;

  @Column({ name: 'phone_number' })
  phoneNumber!: string;

  @ManyToOne(() => Customer, (customer) => customer.phones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;
}
