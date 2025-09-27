/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer-address.entity.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-27T17:08:26Z
 * Exports: CustomerAddress
 * Description: Captures the optional postal address associated with a customer profile using a one-to-one
 *              relationship.
 */
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';

@Entity({ name: 'customer_profile_addresses' })
export class CustomerAddress {
  @PrimaryColumn('uuid', { name: 'customer_profile_id' })
  public customerProfileId!: string;

  @Column('text', { name: 'line1' })
  public line1!: string;

  @Column('text', { name: 'line2', nullable: true })
  public line2?: string | null;

  @Column('text', { name: 'city' })
  public city!: string;

  @Column('text', { name: 'state' })
  public state!: string;

  @Column('text', { name: 'postal_code' })
  public postalCode!: string;

  @Column('character varying', { name: 'country', length: 2 })
  public country!: string;

  @OneToOne(() => CustomerProfile, (profile) => profile.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_profile_id', referencedColumnName: 'id' })
  public customerProfile!: CustomerProfile;
}
