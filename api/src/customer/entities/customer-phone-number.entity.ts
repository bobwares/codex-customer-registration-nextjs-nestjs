/**
 * App: Customer Registration
 * Package: api
 * File: customer-phone-number.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: CustomerPhoneNumber
 * Description: Stores phone numbers linked to customers with type metadata.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'customer_phone_number', schema: 'customer_domain' })
@Index('ux_customer_phone_number_unique', ['customerId', 'number'], { unique: true })
@Index('ix_customer_phone_number_customer_id', ['customerId'])
export class CustomerPhoneNumber {
  @PrimaryGeneratedColumn({ name: 'phone_id', type: 'integer' })
  id!: number;

  @Column({ name: 'type', type: 'varchar', length: 20 })
  type!: string;

  @Column({ name: 'number', type: 'varchar', length: 20 })
  number!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @ManyToOne(() => Customer, (customer) => customer.phoneNumbers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer!: Customer;
}
