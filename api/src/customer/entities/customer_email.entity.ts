/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer_email.entity.ts
 * Version: 0.1.1
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: CustomerEmailEntity
 * Description: Maps customer email addresses with uniqueness per customer and optional primary flag.
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
  name: 'customer_emails',
  ...(schemaName ? { schema: schemaName } : {}),
};

@Entity(entityOptions)
@Index('ix_customer_emails_customer_id', ['customerId'])
@Index('ux_customer_emails_customer_id_email', ['customerId', 'email'], { unique: true })
export class CustomerEmailEntity {
  @PrimaryGeneratedColumn({ name: 'email_id', type: 'integer' })
  public emailId!: number;

  @Column({ name: 'customer_id', type: 'uuid' })
  public customerId!: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  public email!: string;

  @Column({ name: 'is_primary', type: 'boolean' })
  public isPrimary!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt!: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.emails, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customerId' })
  public customer!: CustomerEntity;
}
