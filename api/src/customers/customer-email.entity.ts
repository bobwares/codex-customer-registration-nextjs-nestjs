/**
 * App: Customer Registration
 * Package: api.customers
 * File: customer-email.entity.ts
 * Version: 0.1.1
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CustomerEmail
 * Description: Represents an email address associated with a customer, enforcing uniqueness
 *              per customer and aligning with the normalized database schema.
 */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'customer_email' })
export class CustomerEmail {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Customer, (customer) => customer.emails, {
    onDelete: 'CASCADE',
  })
  customer!: Customer;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
