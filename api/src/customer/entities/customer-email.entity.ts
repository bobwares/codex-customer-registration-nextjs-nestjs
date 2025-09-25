/**
 * App: Customer Registration
 * Package: api
 * File: customer-email.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: CustomerEmail
 * Description: Represents unique email addresses associated with a customer.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'customer_email', schema: 'customer_domain' })
@Index('ux_customer_email_customer_id_email', ['customerId', 'email'], { unique: true })
@Index('ix_customer_email_customer_id', ['customerId'])
export class CustomerEmail {
  @PrimaryGeneratedColumn({ name: 'email_id', type: 'integer' })
  id!: number;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @ManyToOne(() => Customer, (customer) => customer.emails, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer!: Customer;
}
