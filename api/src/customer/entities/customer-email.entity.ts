/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-email.entity.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerEmail
 * Description: TypeORM entity representing customer email addresses.
 */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'customer_emails' })
export class CustomerEmail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'customer_id' })
  customerId!: string;

  @Column()
  email!: string;

  @ManyToOne(() => Customer, (customer) => customer.emails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;
}
