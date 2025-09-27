/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-email.entity.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-27T17:08:26Z
 * Exports: CustomerEmail
 * Description: Models an individual customer email address with uniqueness and relation back to the
 *              owning customer profile.
 */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';

@Entity({ name: 'customer_profile_emails' })
@Unique('uq_customer_profile_emails__customer_profile_id__email', [
  'customerProfileId',
  'email',
])
@Index('ix_customer_profile_emails__customer_profile_id', ['customerProfileId'])
export class CustomerEmail {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  public id!: string;

  @Column('character varying', { name: 'email', length: 320 })
  public email!: string;

  @ManyToOne(() => CustomerProfile, (profile) => profile.emails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_profile_id', referencedColumnName: 'id' })
  public customerProfile!: CustomerProfile;

  @RelationId((email: CustomerEmail) => email.customerProfile)
  public customerProfileId!: string;
}
