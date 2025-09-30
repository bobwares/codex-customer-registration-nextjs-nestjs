/**
 * # App: Customer Registration API
 * # Package: api/src/customer/entities
 * # File: customer-phone-number.entity.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: CustomerPhoneNumberEntity
 * # Description: TypeORM entity mapping normalized phone numbers for customer contact records.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Unique('uq_customer_phone_number_customer_id_number', ['customerId', 'number'])
@Index('idx_customer_phone_number_customer_id', ['customerId'])
@Entity({ name: 'customer_phone_number', schema: 'customer_domain' })
export class CustomerPhoneNumberEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'phone_id' })
  phoneId!: number;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId!: string;

  @Column({ type: 'varchar', name: 'type', length: 20 })
  type!: string;

  @Column({ type: 'varchar', name: 'number', length: 20 })
  number!: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.phoneNumbers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customerId' })
  customer!: CustomerEntity;
}
