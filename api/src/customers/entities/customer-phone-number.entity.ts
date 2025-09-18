/**
 * # App: Customer Registration
 * # Package: api.customers.entities
 * # File: src/customers/entities/customer-phone-number.entity.ts
 * # Version: 0.1.2
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T20:10:00Z
 * # Exports: CustomerPhoneNumber
 * # Description: TypeORM entity modeling categorized phone numbers owned by a customer.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Customer } from './customer.entity';
import { TIMESTAMP_COLUMN_TYPE, UUID_COLUMN_TYPE } from './entity-column-types';

@Entity({ name: 'customer_phone_number', schema: 'customer_domain' })
@Unique('uq_customer_phone_number', ['customerId', 'number'])
@Index('idx_customer_phone_customer_id', ['customerId'])
export class CustomerPhoneNumber {
  @PrimaryGeneratedColumn({ name: 'phone_id', type: 'integer' })
  phoneId!: number;

  @Column({ name: 'customer_id', type: UUID_COLUMN_TYPE })
  customerId!: string;

  @Column({ name: 'type', type: 'varchar', length: 20 })
  type!: string;

  @Column({ name: 'number', type: 'varchar', length: 20 })
  number!: string;

  @Column({ name: 'created_at', type: TIMESTAMP_COLUMN_TYPE, default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Customer, (customer) => customer.phoneNumbers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;
}
