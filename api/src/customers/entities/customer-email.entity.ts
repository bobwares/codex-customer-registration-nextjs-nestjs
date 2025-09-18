/**
 * # App: Customer Registration
 * # Package: api.customers.entities
 * # File: src/customers/entities/customer-email.entity.ts
 * # Version: 0.1.2
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T20:10:00Z
 * # Exports: CustomerEmail
 * # Description: TypeORM entity representing unique email addresses bound to a customer profile.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Customer } from './customer.entity';
import { TIMESTAMP_COLUMN_TYPE, UUID_COLUMN_TYPE } from './entity-column-types';

@Entity({ name: 'customer_email', schema: 'customer_domain' })
@Unique('uq_customer_email_per_customer', ['customerId', 'email'])
@Unique('uq_customer_email_global', ['email'])
@Index('idx_customer_email_customer_id', ['customerId'])
export class CustomerEmail {
  @PrimaryGeneratedColumn({ name: 'email_id', type: 'integer' })
  emailId!: number;

  @Column({ name: 'customer_id', type: UUID_COLUMN_TYPE })
  customerId!: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'created_at', type: TIMESTAMP_COLUMN_TYPE, default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Customer, (customer) => customer.emails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;
}
