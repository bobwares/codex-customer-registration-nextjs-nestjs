/**
 * App: Customer Registration
 * Package: api
 * File: customer_phone_number.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-24T22:04:40Z
 * Exports: CustomerPhoneNumber
 * Description: TypeORM entity mapping for customer phone numbers with per-customer uniqueness enforcement.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'customer_phone_number', schema: 'customer_domain' })
@Unique('ux_customer_phone', ['customer_id', 'number'])
export class CustomerPhoneNumber {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'customer_phone_number_id' })
  customer_phone_number_id!: number;

  @Index('idx_customer_phone_customer_id')
  @Column({ name: 'customer_id', type: 'uuid' })
  customer_id!: string;

  @Column({ name: 'type', type: 'varchar', length: 20 })
  type!: string;

  @Column({ name: 'number', type: 'varchar', length: 20 })
  number!: string;

  @ManyToOne(() => Customer, (customer) => customer.phoneNumbers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customer_id' })
  customer!: Customer;
}
