/**
 * App: Customer Registration
 * Package: api
 * File: privacy_settings.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-24T22:04:40Z
 * Exports: PrivacySettings
 * Description: TypeORM entity mapping for customer privacy preferences within the customer_domain schema.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'privacy_settings', schema: 'customer_domain' })
export class PrivacySettings {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'privacy_settings_id' })
  privacy_settings_id!: number;

  @Column({ name: 'marketing_emails_enabled', type: 'boolean' })
  marketing_emails_enabled!: boolean;

  @Column({ name: 'two_factor_enabled', type: 'boolean' })
  two_factor_enabled!: boolean;

  @OneToMany(() => Customer, (customer) => customer.privacySettings)
  customers?: Customer[];
}
