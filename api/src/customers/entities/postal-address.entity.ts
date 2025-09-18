/**
 * # App: Customer Registration
 * # Package: api.customers.entities
 * # File: src/customers/entities/postal-address.entity.ts
 * # Version: 0.1.1
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:54:05Z
 * # Exports: PostalAddress
 * # Description: TypeORM entity representing the normalized postal_address table for customer mailing information.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'postal_address', schema: 'customer_domain' })
export class PostalAddress {
  @PrimaryGeneratedColumn({ name: 'address_id', type: 'integer' })
  addressId!: number;

  @Column({ name: 'line1', type: 'varchar', length: 255 })
  line1!: string;

  @Column({ name: 'line2', type: 'varchar', length: 255, nullable: true })
  line2?: string | null;

  @Column({ name: 'city', type: 'varchar', length: 120 })
  city!: string;

  @Column({ name: 'state', type: 'varchar', length: 80 })
  state!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20, nullable: true })
  postalCode?: string | null;

  @Column({ name: 'country', type: 'varchar', length: 2 })
  country!: string;

  @OneToMany(() => Customer, (customer) => customer.postalAddress)
  customers!: Customer[];
}
