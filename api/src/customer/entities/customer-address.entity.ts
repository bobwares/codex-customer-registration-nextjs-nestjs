/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-address.entity.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerAddress
 * Description: TypeORM entity representing postal addresses for customers.
 */
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'customer_addresses' })
export class CustomerAddress {
  @PrimaryColumn({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column()
  line1!: string;

  @Column({ nullable: true })
  line2?: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column({ name: 'postal_code' })
  postalCode!: string;

  @Column()
  country!: string;

  @OneToOne(() => Customer, (customer) => customer.address, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;
}
