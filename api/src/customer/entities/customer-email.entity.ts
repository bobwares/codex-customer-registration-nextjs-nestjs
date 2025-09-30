/**
 * # App: Customer Registration API
 * # Package: api/src/customer/entities
 * # File: customer-email.entity.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: CustomerEmailEntity
 * # Description: TypeORM entity representing email addresses associated with a customer profile.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Unique('uq_customer_email_customer_id_email', ['customerId', 'email'])
@Index('idx_customer_email_customer_id', ['customerId'])
@Entity({ name: 'customer_email', schema: 'customer_domain' })
export class CustomerEmailEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'email_id' })
  emailId!: number;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId!: string;

  @Column({ type: 'varchar', name: 'email', length: 255 })
  email!: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.emails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customerId' })
  customer!: CustomerEntity;
}
