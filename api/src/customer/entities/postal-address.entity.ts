/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: postal-address.entity.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:58:36Z
 * Exports: PostalAddressEntity
 * Description: TypeORM entity mapping the postal_address table to persist structured customer addresses.
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'postal_address', schema: 'customer_domain' })
export class PostalAddressEntity {
  @PrimaryGeneratedColumn({ name: 'address_id', type: 'integer' })
  public addressId!: number;

  @Column({ name: 'line1', type: 'varchar', length: 255 })
  public line1!: string;

  @Column({ name: 'line2', type: 'varchar', length: 255, nullable: true })
  public line2?: string | null;

  @Column({ name: 'city', type: 'varchar', length: 100 })
  public city!: string;

  @Column({ name: 'state', type: 'varchar', length: 100 })
  public state!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20 })
  public postalCode!: string;

  @Column({ name: 'country', type: 'varchar', length: 2 })
  public country!: string;
}
