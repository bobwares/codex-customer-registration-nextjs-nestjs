/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: postal_address.entity.ts
 * Version: 0.1.1
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: PostalAddressEntity
 * Description: Defines the postal_addresses table mapping for storing structured mailing addresses.
 */
import type { EntityOptions } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

const schemaName = process.env.DATABASE_SCHEMA;
const entityOptions: EntityOptions = {
  name: 'postal_addresses',
  ...(schemaName ? { schema: schemaName } : {}),
};

@Entity(entityOptions)
export class PostalAddressEntity {
  @PrimaryGeneratedColumn({ name: 'address_id', type: 'integer' })
  public addressId!: number;

  @Column({ name: 'line1', type: 'varchar', length: 255 })
  public line1!: string;

  @Column({ name: 'line2', type: 'varchar', length: 255, nullable: true })
  public line2?: string | null;

  @Column({ name: 'city', type: 'varchar', length: 120 })
  public city!: string;

  @Column({ name: 'state', type: 'varchar', length: 80 })
  public state!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20 })
  public postalCode!: string;

  @Column({ name: 'country', type: 'char', length: 2 })
  public country!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt!: Date;

  @OneToMany(() => CustomerEntity, (customer) => customer.address)
  public customers?: CustomerEntity[];
}
