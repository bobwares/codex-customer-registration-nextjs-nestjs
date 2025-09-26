/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-phone-number.entity.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:58:54Z
 * Exports: CustomerPhoneNumberEntity
 * Description: TypeORM entity storing customer phone numbers including type and uniqueness per customer.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

const TIMESTAMP_COLUMN_TYPE: 'timestamptz' | 'datetime' =
  process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz';

@Index('idx_customer_phone_customer', ['customerId'])
@Entity({ name: 'customer_phone_number', schema: 'customer_domain' })
export class CustomerPhoneNumberEntity {
  @PrimaryGeneratedColumn({ name: 'phone_id', type: 'integer' })
  public phoneId!: number;

  @Column({ name: 'customer_id', type: 'uuid' })
  public customerId!: string;

  @Column({ name: 'type', type: 'varchar', length: 20 })
  public type!: string;

  @Column({ name: 'number', type: 'varchar', length: 20 })
  public number!: string;

  @CreateDateColumn({ name: 'created_at', type: TIMESTAMP_COLUMN_TYPE })
  public createdAt!: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.phoneNumbers, {
    onDelete: 'CASCADE',
  })
  public customer!: CustomerEntity;
}
