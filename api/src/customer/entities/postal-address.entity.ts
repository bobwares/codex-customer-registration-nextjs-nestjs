/**
 * # App: Customer Registration API
 * # Package: api/src/customer/entities
 * # File: postal-address.entity.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: PostalAddressEntity
 * # Description: TypeORM entity representing mailing addresses captured during customer onboarding.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'postal_address', schema: 'customer_domain' })
export class PostalAddressEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'address_id' })
  addressId!: number;

  @Column({ type: 'varchar', name: 'line1', length: 255 })
  line1!: string;

  @Column({ type: 'varchar', name: 'line2', length: 255, nullable: true })
  line2: string | null = null;

  @Column({ type: 'varchar', name: 'city', length: 100 })
  city!: string;

  @Column({ type: 'varchar', name: 'state', length: 50 })
  state!: string;

  @Column({ type: 'varchar', name: 'postal_code', length: 20 })
  postalCode!: string;

  @Column({ type: 'char', name: 'country', length: 2 })
  country!: string;

  @OneToMany(() => CustomerEntity, (customer) => customer.address)
  customers!: CustomerEntity[];
}
