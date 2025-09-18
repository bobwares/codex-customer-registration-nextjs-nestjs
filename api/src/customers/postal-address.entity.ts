/**
 * App: Customer Registration
 * Package: api.customers
 * File: postal-address.entity.ts
 * Version: 0.1.2
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: PostalAddress
 * Description: Models the normalized postal address entity linked to customers within the
 *              registration system.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'postal_address' })
export class PostalAddress {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  line1!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  line2?: string | null;

  @Column({ type: 'varchar', length: 120 })
  city!: string;

  @Column({ type: 'varchar', length: 80 })
  state!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20 })
  postalCode!: string;

  @Column({ type: 'varchar', length: 2 })
  country!: string;

  @OneToMany(() => Customer, (customer) => customer.address)
  customers!: Customer[];
}
