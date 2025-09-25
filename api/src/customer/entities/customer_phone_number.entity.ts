/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer_phone_number.entity.ts
 * Version: 0.1.2
 * Turns: 3, 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: CustomerPhoneNumberEntity
 * Description: Maps customer phone numbers with uniqueness per customer/type combination.
 */
import type { EntityOptions } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

const schemaName = process.env.DATABASE_SCHEMA;
const entityOptions: EntityOptions = {
  name: 'customer_phone_numbers',
  ...(schemaName ? { schema: schemaName } : {}),
};

const timestampColumnType = process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz';

@Entity(entityOptions)
@Index('ix_customer_phone_numbers_customer_id', ['customerId'])
@Index('ux_customer_phone_numbers_customer_id_type_number', ['customerId', 'type', 'number'], {
  unique: true,
})
export class CustomerPhoneNumberEntity {
  @PrimaryGeneratedColumn({ name: 'phone_id', type: 'integer' })
  public phoneId!: number;

  @Column({ name: 'customer_id', type: 'uuid' })
  public customerId!: string;

  @Column({ name: 'type', type: 'varchar', length: 20 })
  public type!: string;

  @Column({ name: 'number', type: 'varchar', length: 20 })
  public number!: string;

  @Column({ name: 'extension', type: 'varchar', length: 10, nullable: true })
  public extension?: string | null;

  @CreateDateColumn({ name: 'created_at', type: timestampColumnType })
  public createdAt!: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.phoneNumbers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customerId' })
  public customer!: CustomerEntity;
}
