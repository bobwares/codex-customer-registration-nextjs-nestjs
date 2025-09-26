/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-email.entity.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:58:49Z
 * Exports: CustomerEmailEntity
 * Description: TypeORM entity describing customer email addresses with primary flags and uniqueness constraints.
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

@Index('idx_customer_email_customer', ['customerId'])
@Index('idx_customer_email_primary', ['customerId'], {
  where: 'is_primary',
})
@Entity({ name: 'customer_email', schema: 'customer_domain' })
export class CustomerEmailEntity {
  @PrimaryGeneratedColumn({ name: 'email_id', type: 'integer' })
  public emailId!: number;

  @Column({ name: 'customer_id', type: 'uuid' })
  public customerId!: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  public email!: string;

  @Column({ name: 'is_primary', type: 'boolean' })
  public isPrimary!: boolean;

  @CreateDateColumn({ name: 'created_at', type: TIMESTAMP_COLUMN_TYPE })
  public createdAt!: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.emails, {
    onDelete: 'CASCADE',
  })
  public customer!: CustomerEntity;
}
