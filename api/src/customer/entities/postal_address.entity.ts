/**
 * App: Customer Registration
 * Package: api
 * File: postal_address.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-24T22:04:40Z
 * Exports: PostalAddress
 * Description: TypeORM entity mapping for the postal_address table within the customer_domain schema.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'postal_address', schema: 'customer_domain' })
export class PostalAddress {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'postal_address_id' })
  postal_address_id!: number;

  @Column({ name: 'line1', type: 'varchar', length: 255 })
  line1!: string;

  @Column({ name: 'line2', type: 'varchar', length: 255, nullable: true })
  line2?: string | null;

  @Column({ name: 'city', type: 'varchar', length: 100 })
  city!: string;

  @Column({ name: 'state', type: 'varchar', length: 50 })
  state!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20 })
  postal_code!: string;

  @Column({ name: 'country', type: 'char', length: 2 })
  country!: string;

  @OneToMany(() => Customer, (customer) => customer.address)
  customers?: Customer[];
}
