/**
 * App: Customer Registration
 * Package: api
 * File: customer_email.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-24T22:04:40Z
 * Exports: CustomerEmail
 * Description: TypeORM entity mapping for customer email addresses with uniqueness constraints per customer.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'customer_email', schema: 'customer_domain' })
@Unique('ux_customer_email', ['customer_id', 'email'])
export class CustomerEmail {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'customer_email_id' })
  customer_email_id!: number;

  @Index('idx_customer_email_customer_id')
  @Column({ name: 'customer_id', type: 'uuid' })
  customer_id!: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email!: string;

  @ManyToOne(() => Customer, (customer) => customer.emails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customer_id' })
  customer!: Customer;
}
